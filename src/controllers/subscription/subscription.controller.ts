import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const subscribePlan = async (req:Request, res:Response) => {
    const { plan } = req.body;
    const companyId = req.user?.companyId; 

    if (!["FREE", "BASIC", "PREMIUM"].includes(plan)) {
        return res.status(400).json({ message: "Invalid plan." });
    }

    const companySub = await prisma.subscription.findUnique({
        where: { companyId },
        });
        
    if(companySub){
        return res.status(400).json({message:`Already Subscribed to ${companySub.plan}`})
    }

    if (!companyId) {
        return res.status(401).json({ message: "Unauthorized. please log in." });
    }
    
    let maxFiles=0,maxUsers:number|null=0, pricePerMonth=0;

    switch (plan) {
      case "FREE":
        maxFiles = 10;
        maxUsers = 1;
        pricePerMonth = 0;
        break;
        case "BASIC":
            maxFiles = 100;
            maxUsers = 10;
            pricePerMonth = 5;
            break;
      case "PREMIUM":
        maxFiles = 1000;
        maxUsers=null;
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

export const upgradePlan = async (req: Request, res: Response) => {
    const { plan } = req.body;
    const companyId = req.user?.companyId;

    if (!["BASIC", "PREMIUM"].includes(plan)) {
        return res.status(400).json({ message: "Invalid upgrade target." });
    }

    const subscription = await prisma.subscription.findUnique({ where: { companyId } });

    if (!subscription) {
        return res.status(404).json({ message: "You don't have any subscription yet!" });
    }

    if(subscription?.plan==plan){
        return res.status(400).json({message:`You arleady have a ${plan} plan`})
    }

    let maxFiles = 0, maxUsers: number | null = 0, pricePerMonth = 0;

    if (plan === "BASIC") {
        maxFiles = 100;
        maxUsers = 10;
        pricePerMonth = subscription.usersCount === 0 ? 5 : subscription.usersCount * 5;
    } else if (plan === "PREMIUM") {
        maxFiles = 1000;
        maxUsers = null;
        pricePerMonth = 300;
    }

    await prisma.subscription.update({
        where: { companyId },
        data: {
            plan,
            maxFiles,
            maxUsers,
            pricePerMonth,
            startDate: new Date(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
        }
    });

    res.json({ message: `Successfully upgraded to ${plan} plan.` });
};


export const downgradePlan = async (req: Request, res: Response) => {
    const { plan } = req.body; 
    const companyId = req.user?.companyId;

    if (!["FREE", "BASIC"].includes(plan)) {
        return res.status(400).json({ message: "Invalid downgrade target." });
    }

    const subscription = await prisma.subscription.findUnique({ where: { companyId } });

    if (!subscription) {
        return res.status(404).json({ message: "No subscription found." });
    }

    if(subscription?.plan==plan){
        return res.status(400).json({message:`You already have a ${plan} plan`})
    }

    if (subscription.plan === "PREMIUM" && plan === "BASIC") {
        if (subscription.usersCount > 10) {
            return res.status(400).json({ message: "Reduce users to 10 before downgrading." });
        }
        if (subscription.filesProcessed > 100) {
            return res.status(400).json({ message: "File processes are more than 100" });
        }
    }

    if (subscription.plan === "BASIC" && plan === "FREE") {
        if (subscription.usersCount > 1) {
            return res.status(400).json({ message: "Reduce users to 1 before downgrading." });
        }
        if (subscription.filesProcessed > 10) {
            return res.status(400).json({ message: "Files limit exceeded" });
        }
    }

    let maxFiles = 0, maxUsers: number | null = 0, pricePerMonth = 0;

    if (plan === "BASIC") {
        maxFiles = 100;
        maxUsers = 10;
        pricePerMonth = subscription.usersCount === 0 ? 5 : subscription.usersCount * 5;
    } else if (plan === "FREE") {
        maxFiles = 10;
        maxUsers = 1;
        pricePerMonth = 0;
    }

    await prisma.subscription.update({
        where: { companyId },
        data: {
            plan,
            maxFiles,
            maxUsers,
            pricePerMonth,
            startDate: new Date(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
        }
    });

    res.json({ message: `Successfully downgraded to ${plan} plan.` });
};