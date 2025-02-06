import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const subscriptionCheckMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const companyId = req.user?.companyId;

  if (!companyId) {
    return res.status(400).json({ message: "company ID missing" });
  }

  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: { subscription: true },
    });

    if (!company) {
      return res.status(404).json({ message: "company not found" });
    }

    if (company.status !== 'ACTIVE') {
      return res.status(403).json({ message: "company is not active" });
    }

    const subscription = company.subscription;

    if (!subscription) {
      return res.status(403).json({ message: "no subscription found" });
    }

    const currentDate = new Date();
    if (subscription.endDate < currentDate) {
      return res.status(403).json({ message: "subscription has expired" });
    }

    if (subscription.filesProcessed >= subscription.maxFiles) {
      return res.status(403).json({ message: "file limit exceeded" });
    }

    if (subscription.maxUsers !== null && subscription.usersCount > subscription.maxUsers) {
      return res.status(403).json({ message: "user limit exceeded" });
    }

    next();
  } catch (error: any) {
    res.status(500).json({ message: "Error checking subscription", error: error.message });
  }
};