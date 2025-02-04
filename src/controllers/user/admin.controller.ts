import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { generateVerificationToken } from "../../utils/generateToken";
import { sendVerificationEmail } from "../../utils/email";

const prisma = new PrismaClient();


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

        await sendVerificationEmail(email, verificationToken);
        res.status(201).json({ message: "User added. Email sent for activation." });

    } catch (error) {
        res.status(500).json({ message: "Error adding user", error });
    }
};


export const removeUser = async (req: Request, res: Response) => {
    try {
        const { employeeId } = req.params;
        const companyId = req.user?.companyId; 
        

        if(!companyId) return 

        const employee = await prisma.user.findUnique({ where: { id: employeeId } });
        if (!employee || employee.companyId !== companyId) {
            return res.status(404).json({ message: "user not found" });
        }

        await prisma.user.delete({ where: { id: employeeId } });

        res.status(200).json({ message: "user deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};