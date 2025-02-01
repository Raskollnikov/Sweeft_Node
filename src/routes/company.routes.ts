import { Router, } from "express";
import {register,verify,login,logout} from "../controllers/company/auth.controller";
import { getCompany,updateCompany,changePassword} from "../controllers/company/profile.controller";
import limiter from "../utils/rateLimiter";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

//registration & authentication
router.post("/register",limiter, register);
router.post("/verify", verify);    
router.post("/login",limiter, login);
router.post("/logout", authMiddleware, logout);

//company profile routes after successfully login + protected route 
router.get('/about', authMiddleware, getCompany);
router.patch("/update", authMiddleware, updateCompany); 
router.put("/change-password", authMiddleware, changePassword);


export default router;
