import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { generateVerificationToken } from "../../utils/generateToken";
import { sendVerificationEmail } from "../../utils/email";
import { generateJwt } from "../../utils/generateToken"; 
import { companySchema, loginSchema } from "../../validations/companyValidation";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
    try {
        const validationResult = companySchema.safeParse(req.body);
        
        if (!validationResult.success) {
            const errorMessages = validationResult.error.errors
                .map(err => `${err.path.join('.')}: ${err.message}`);
            
            return res.status(400).json({ 
                message: "Validation errors",
                errors: errorMessages 
            });
        }

        const { name, email, password, country, industry } = validationResult.data;

        const existingCompany = await prisma.company.findUnique({ where: { email } });

        if (existingCompany) return res.status(400).json({ message: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = generateVerificationToken();

        const company = await prisma.company.create({
        data: {
            name,
            email,
            password: hashedPassword,
            country,
            industry,
            token: verificationToken,
            status: "PENDING",  
        },
    });

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ message: "Company registered. Check email for verification code." });
    } catch (error) {
    res.status(500).json({ message: "Error registering company", error });
    }
};


export const verify = async (req: Request, res: Response) => {
    try {
        const { token } = req.query; 

        if (typeof token !== "string") {
            return res.status(400).json({ message: "Invalid token format" });
        }

        const company = await prisma.company.findFirst({
            where: { token },
        });

        if (!company) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }
        
        const updatedCompany = await prisma.company.update({
            where: { id: company.id },
            data: {
            status: "ACTIVE",
            token: null,
            isActive:true 
            },
        });
    
        res.status(200).json({ message: "Account successfully verified"});
        } catch (error) {
        res.status(500).json({ message: "Error verifying company", error });
        }
};

export const login = async (req: Request, res: Response) => {
    try {
        const validationResult = loginSchema.safeParse(req.body);
        
        if (!validationResult.success) {
            const errorMessages = validationResult.error.errors
                .map(err => `${err.path.join('.')}: ${err.message}`);
            
            return res.status(400).json({ 
                message: "Validation errors",
                errors: errorMessages 
            });
        }

        const { email, password } = validationResult.data;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const company = await prisma.company.findUnique({ where: { email } });

        if (!company) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (company.status !== "ACTIVE" || !company.isActive) {
            return res.status(400).json({ message: "Account is not activated or verified" });
        }

        const isPasswordValid = await bcrypt.compare(password, company.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateJwt(company.id, company.email, res);

        res.status(200).json({
            message: "Login successful",
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Error logging in", error });
    }
};


export const logout = (req: Request, res: Response) => {
    res.clearCookie("jwt", { httpOnly: true });
    return res.status(200).json({ message: "Logged out successfully" });
};