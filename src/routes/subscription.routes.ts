import express from 'express';
import { subscribePlan, viewSubscription, upgradePlan, downgradePlan,getCurrentBilling } from '../controllers/subscription/subscription.controller';
import {authMiddleware} from '../middlewares/auth.middleware';

const router = express.Router();


router
    .post("/", authMiddleware, subscribePlan) 
    .get("/current", authMiddleware, viewSubscription)
    .patch("/upgrade", authMiddleware, upgradePlan)
    .patch("/downgrade", authMiddleware, downgradePlan);  

// to check current billing only for company gmail  ( admin )
router.get('/current/billing', authMiddleware, getCurrentBilling);

export default router;
