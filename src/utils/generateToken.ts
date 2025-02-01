import crypto from "crypto";
import { Response } from "express";
import jwt from 'jsonwebtoken'

export const generateVerificationToken = (): string => {
    return crypto.randomInt(100000, 999999).toString();
};

export const generateJwt = (companyId: string, email: string, res: Response): void => {
    const token = jwt.sign(
        { companyId, email },
        process.env.JWT_SECRET!,
        { expiresIn:'1h' } 
    );

    res.cookie('jwt', token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",  
        maxAge: 60 * 60 * 1000,
        sameSite:true  
    });
};