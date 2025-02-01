import { Router } from "express";
import {register,verify,login} from "../controllers/company/auth.controller";

const router = Router();

//registration & authentication
router.post("/register", register);
router.post("/verify", verify);    
router.post("/login",login);         

export default router;
