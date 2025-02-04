import { Router } from "express";
import { addUser,removeUser } from "../controllers/user/admin.controller";
import { isAdmin } from "../middlewares/isAdmin.middleware";
const router = Router();


// only for Admin 
router.post('/create',isAdmin,addUser)
router.delete('/remove/:id',isAdmin,removeUser)



export default router;