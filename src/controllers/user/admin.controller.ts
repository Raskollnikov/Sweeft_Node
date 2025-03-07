import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { generateVerificationToken } from "../../utils/generateToken";
import { sendVerificationEmail } from "../../utils/email";

const prisma = new PrismaClient();

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const companyId = req.user?.companyId;
        
        if (!companyId) return res.status(400).json({ message: "Invalid company ID" });

        const employees = await prisma.user.findMany({
            where: { companyId, role: "EMPLOYEE" },
            select: { id: true, email: true, username: true, isActive: true, createdAt: true }
        });

        res.status(200).json({ employees });
    } catch (error) {
        res.status(500).json({ message: "Error fetching employees", error });
    }
};

export const addUser = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const companyId = req.user?.companyId;
        
        if (!companyId) return res.status(400).json({ message: "invalid company ID" });

        const existingEmployee = await prisma.user.findUnique({ where: { email } });
        if (existingEmployee) return res.status(400).json({ message: "user already exists" });

        const subscription = await prisma.subscription.findUnique({ where: { companyId } });
        if (!subscription) return res.status(400).json({ message: "Subscription not found" });

        if ((subscription.plan === "FREE" && subscription.usersCount >= 1)|| (subscription.plan==="BASIC" && subscription.usersCount>=10)) {
            return res.status(403).json({ message: "Upgrade plan before adding users " });
        }

        const verificationToken = generateVerificationToken();
        const employee = await prisma.user.create({
            data: {
                email,
                companyId,
                role: "EMPLOYEE",
                token: verificationToken
            }
        });

        await prisma.subscription.update({
            where: { companyId },
            data: { usersCount: { increment: 1 } }
        });
        
        if (subscription.plan === 'BASIC') {
            await prisma.subscription.update({
                where: { companyId },
                data: { 
                    pricePerMonth: (subscription.usersCount + 1) * 5 
                }
            });
        }
        await sendVerificationEmail(email, verificationToken);
        res.status(201).json({ message: "User added. Email sent for activation." });

    } catch (error) {
        res.status(500).json({ message: "Error adding user", error });
    }
};


export const removeUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const companyId = req.user?.companyId;   
        const subscription = await prisma.subscription.findUnique({ where: { companyId } });

        if(!subscription) return

        if (subscription.plan === 'BASIC') {
            await prisma.subscription.update({
                where: { companyId },
                data: { 
                    pricePerMonth: (subscription.usersCount - 1) * 5 
                }
            });
        }
        
        if(!companyId) return 

        const employee = await prisma.user.findUnique({ where: { id } });
        if (!employee || employee.companyId !== companyId) {
            return res.status(404).json({ message: "user not found" });
        }

        //decrement user count by 1 
        await prisma.subscription.update({
            where: { companyId },
            data: { usersCount: { decrement: 1 } }
        });
        
        await prisma.user.delete({ where: { id } });

        res.status(200).json({ message: "user deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};