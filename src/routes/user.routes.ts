import { Router } from "express";
import { addUser,removeUser,getAllUsers } from "../controllers/user/admin.controller";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import limiter from "../utils/rateLimiter";
import { verifyUser,userLogin,logoutUser} from "../controllers/user/user.controller";
import { userAuthMiddleware } from "../middlewares/auth.middleware";
const router = Router();


// only for Admin 
router.get('/', isAdmin, getAllUsers);
router.post('/create',limiter,isAdmin,addUser)
router.delete('/remove/:id',isAdmin,removeUser)


//routes for user

router.post('/verify', verifyUser);
router.post('/login',userLogin)
router.post('/logout',userAuthMiddleware,logoutUser)


export default router;