import { Request, Response } from "express";
import bcrypt from 'bcryptjs'
import { PrismaClient } from "@prisma/client";
import { updateCompanySchema,changePasswordSchema } from "../../validations/companyValidation";
const prisma = new PrismaClient();

export const getCompany = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.companyId) {
            return res.status(400).json({ message: "No user information found" });
        }

        const company = await prisma.company.findUnique({
            where: { id: req.user.companyId },
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
                isActive: true,
                createdAt: true,
                industry:true,
                country:true
            },
        });

        const subscription = await prisma.subscription.findUnique({
            where:{companyId:req.user.companyId},
            select:{
                plan:true,
                filesProcessed:true,
                maxFiles:true,
                maxUsers:true,
                pricePerMonth:true,
                usersCount:true,
                nextBillingDate:true,
                startDate:true,
                endDate:true,
            }
        })

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        res.status(200).json({ company,subscription });
    } catch (error) {
        console.error("Error fetching company:", error);
        res.status(500).json({ message: "An error occurred while fetching company data" });
    }
};

export const updateCompany = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.companyId) {
            return res.status(400).json({ message: "Unauthorized access" });
        }

        const validationResult = updateCompanySchema.safeParse(req.body);

        if (!validationResult.success) {
            const errorMessages = validationResult.error.errors
                .map(err => `${err.path.join('.')}: ${err.message}`);
            return res.status(400).json({
                message: "Validation errors",
                errors: errorMessages,
            });
        }

        const { name, country, industry } = validationResult.data;

        const updatedCompany = await prisma.company.update({
            where: { id: req.user.companyId },
            data: { name, country, industry },
        });
        const { password, email, ...companyWithoutSensitiveData } = updatedCompany;

        res.status(200).json({ 
            message: "Profile updated successfully", 
            company: companyWithoutSensitiveData 
        });
    } catch (error) {
        console.error("Error updating company:", error);
        res.status(500).json({ message: "An error occurred while updating company data" });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.companyId) {
            return res.status(400).json({ message: "Unauthorized access" });
        }

        const validationResult = changePasswordSchema.safeParse(req.body);
        
        if (!validationResult.success) {
            const errorMessages = validationResult.error.errors
                .map(err => `${err.path.join('.')}: ${err.message}`);
            return res.status(400).json({
                message: "Validation errors",
                errors: errorMessages,
            });
        }

        const { oldPassword, newPassword } = validationResult.data;

        const company = await prisma.company.findUnique({
            where: { id: req.user.companyId },
        });

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, company.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.company.update({
            where: { id: req.user.companyId },
            data: { password: hashedPassword },
        });

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "An error occurred while changing password" });
    }
};