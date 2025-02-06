import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt || req.cookies.userJwt;

    if (!token) {
        return res.status(401).json({ message: "Unautorized, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { companyId: string, email: string };

        req.user=decoded
        const user = await prisma.user.findUnique({
        where: {
            email: decoded.email,  
            companyId: decoded.companyId 
        }
        });

        if (!user) {
        return res.status(401).json({ message: "Unauthorized, user not found" });
        }

        if (user.role !== 'ADMIN') {
        return res.status(403).json({ message: "only admin can access this resource" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized, invalid token" });
    }
};
