"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/company/auth.controller");
const profile_controller_1 = require("../controllers/company/profile.controller");
const rateLimiter_1 = __importDefault(require("../utils/rateLimiter"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
//registration & authentication
router.post("/register", rateLimiter_1.default, auth_controller_1.register);
router.post("/verify", auth_controller_1.verify);
router.post("/login", rateLimiter_1.default, auth_controller_1.login);
router.post("/logout", auth_middleware_1.authMiddleware, auth_controller_1.logout);
//company profile routes after successfully login + protected route 
router.get('/about', auth_middleware_1.authMiddleware, profile_controller_1.getCompany);
router.patch("/update", auth_middleware_1.authMiddleware, profile_controller_1.updateCompany);
router.put("/change-password", auth_middleware_1.authMiddleware, profile_controller_1.changePassword);
exports.default = router;
