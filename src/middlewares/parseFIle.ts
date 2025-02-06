import { Request,Response,NextFunction } from "express";

export const parseFileMetadata = (req:Request, res:Response, next:NextFunction) => {
    req.body.visibility = req.body.visibility || "ALL";

    if (req.body.allowedUsers) {
      try {
        req.body.allowedUsers = JSON.parse(req.body.allowedUsers);
      } catch (error) {
        return res.status(400).json({ message: "Invalid allowedUsers format" });
      }
    }
    next();
};