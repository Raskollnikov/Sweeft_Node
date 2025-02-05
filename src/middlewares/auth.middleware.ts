import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt; // this is a jwt for company 

    if (!token) {
        return res.status(401).json({ message: "Unauthorized, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { companyId: string, email: string };
        req.user = decoded; 
        req.isCompany = true;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized, invalid token" });
    }
};

export const userAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.userJwt

    if (!token) {
        return res.status(401).json({ message: "unauthorized, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string; companyId: string };
        req.user = decoded; 
        req.isCompany = false; 
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized, invalid token" });
    }
};