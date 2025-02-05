import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs'
import { generateUserJwt } from "../../utils/generateToken";

const prisma =new PrismaClient();

export const verifyUser = async (req: Request, res: Response) => {
    try {
        const { token, password, username } = req.body;

        const employee = await prisma.user.findFirst({ where: { token } });
        if (!employee) return res.status(400).json({ message: "invalid token" });

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: employee.id },
            data: { password: hashedPassword, username, isActive: true, token: null }
        });

        res.status(200).json({ message: "employee verified successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error verifying employee", error });
    }
};


export const userLogin = async(req:Request,res:Response)=>{
    const {email,password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.role !== "EMPLOYEE") {
        return res.status(400).json({ message: "invalid credentials" });
    }

    if (!user.isActive) {
        return res.status(400).json({ message: "employee is not verified" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);

    if (!isPasswordValid) {
        return res.status(400).json({ message: "invalid credentials" });
    }

    generateUserJwt(user.id,email,user.companyId,res)

    res.status(200).json({ message: "Login successful" });
}


export const logoutUser = async(req:Request,res:Response)=>{
    res.clearCookie('userJwt',{ httpOnly: true })
    return res.status(200).json({ message: "Logged out successfully" });
}