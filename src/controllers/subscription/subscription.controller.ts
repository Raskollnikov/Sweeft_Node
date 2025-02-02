import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const subscribePlan = async (req:Request, res:Response) => {
    const { plan, amountOfUser } = req.body;
    const companyId = req.user?.companyId; 

    if (!["FREE", "BASIC", "PREMIUM"].includes(plan)) {
        return res.status(400).json({ message: "Invalid plan." });
    }

    const companySub = await prisma.subscription.findUnique({
        where: { companyId },
        });
        
    if(companySub){
        return res.status(500).json({message:"Already Subscribed"})
    }

    if (!companyId) {
        return res.status(400).json({ message: "Company ID is required." });
    }
    
    let maxFiles=0,maxUsers=0, pricePerMonth=0,usersCount=0;


    switch (plan) {
      case "FREE":
        maxFiles = 10;
        maxUsers = 1;
        pricePerMonth = 0;
        break;
        case "BASIC":
            maxFiles = 100;
            maxUsers = 10;
            usersCount = amountOfUser !== undefined ? Math.min(10, Math.max(0, amountOfUser)) : 0; 
            pricePerMonth = usersCount * 5;
            break;
      case "PREMIUM":
        maxFiles = 1000;
        maxUsers=10_000_000;
        pricePerMonth = 300;
        break;
    }

    await prisma.subscription.create({
        data: {
        companyId,
        plan,
        maxFiles,
        maxUsers,
        pricePerMonth,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), 
        nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
    });

    res.json({ message: `Successfully subscribed to ${plan} plan.` });

};

export const viewSubscription = async (req:Request, res:Response) => {
    const companyId = req.user?.companyId;

    const subscription = await prisma.subscription.findUnique({
        where: { companyId },
        });

    if (!subscription) return res.status(404).json({ message: "No subscription found." });

    res.json(subscription);
};

export const upgradePlan=(req:Request,res:Response)=>{
    res.json({message:"CR7 SUIIIIIIIIIIIIIIIIIII"})
}
export const downgradePlan=(req:Request,res:Response)=>{
    res.json({message:"CR7 SUIIIIIIIIIIIIIIIIIII"})
}