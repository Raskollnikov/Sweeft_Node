import { Request, Response } from "express";
import { s3, S3_BUCKET } from "../../s3/s3.config";
import { PrismaClient } from "@prisma/client";
import { FileType } from "@prisma/client";

const prisma = new PrismaClient();

const MIME_TO_FILETYPE: Record<string, FileType> = {
  "text/csv": "CSV",
  "application/vnd.ms-excel": "XLS",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
};

export const uploadFile = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const companyId = req.user?.companyId;
    const userId = req.user?.userId;
    const visibility = req.body.visibility || "ALL";
    const allowedUsers = req.body.allowedUsers || [];

    if (!companyId || !userId) {
      return res.status(400).json({ message: "User or company ID missing" });
    }

    if (!["ALL", "SELECTED"].includes(visibility)) {
      return res.status(400).json({ message: "Invalid visibility option" });
    }

    const fileType = MIME_TO_FILETYPE[req.file.mimetype];
    if (!fileType) {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    const file = await prisma.file.create({
      data: {
        name: req.file.originalname,
        url: (req.file as any).location,
        key: (req.file as any).key,
        type: fileType,
        ownerId: userId,
        companyId,
        visibility,
        allowedUsers: visibility === "SELECTED" ? { connect: allowedUsers.map((id: string) => ({ id })) } : undefined,
      },
    });

    await prisma.subscription.update({
      where: { companyId },
      data: { filesProcessed: { increment: 1 } },
    });

    res.json({ message: "File uploaded successfully", file });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Error uploading file", error: error.message });
  }
};


export const getFiles = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    const userId = req.user?.userId;

    if (!companyId || !userId) {
      return res.status(400).json({ message: "User or company ID not found" });
    }

    const checkIfUserAdmin = await prisma.user.findFirst({
      where: { id: userId, role: "ADMIN" }
    });

    let files;

    if (checkIfUserAdmin) {
      files = await prisma.file.findMany({
        where: { companyId }
      });
    } else {
      files = await prisma.file.findMany({
        where: {
          companyId,
          OR: [
            { visibility: "ALL" },
            { visibility: "SELECTED", allowedUsers: { some: { id: userId } } },
          ],
        },
      });
    }

    return res.status(200).json({ files });
  } catch (error: any) {
    console.error("Error retrieving files:", error);
    res.status(500).json({ message: "Error retrieving files", error: error.message });
  }
};



export const updateFileVisibility = async (req: Request, res: Response) => {
  try {
    const { fileId, visibility, allowedUsers } = req.body;
    const userId = req.user?.userId;

    const file = await prisma.file.findUnique({ where: { id: fileId } });

    if (!file || file.ownerId !== userId) {
      return res.status(403).json({ message: "can't change file visibility" });
    }

    const updatedFile = await prisma.file.update({
      where: { id: fileId },
      data: {
        visibility,
        allowedUsers: visibility === "SELECTED" ? { set: allowedUsers.map((id: string) => ({ id })) } : { set: [] },
      },
    });

    res.json({ message: "File visibility updated", file: updatedFile });
  } catch (error: any) {
    console.error("Update visibility error:", error);
    res.status(500).json({ message: "Error updating visibility", error: error.message });
  }
};



export const deleteFile = async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;
    const userId = req.user?.userId;
    const companyId=req.user?.companyId
    const file = await prisma.file.findUnique({ where: { id: fileId } });

    if (!file || file.ownerId !== userId) {
      return res.status(403).json({ message: "can't delete this file" });
    }

    // deleting from S3
    await s3.deleteObject({
      Bucket: S3_BUCKET,
      Key: file.key,
    });

    // dlete from database
    await prisma.file.delete({ where: { id: fileId } });
    
    await prisma.subscription.update({
      where: { companyId },
      data: { filesProcessed: { decrement: 1 } }
    });
    res.json({ message: "File deleted successfully" });
  } catch (error: any) {
    console.error("Delete file error:", error);
    res.status(500).json({ message: "Error deleting file", error: error.message });
  }
};
