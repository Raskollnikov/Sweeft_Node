"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/company/auth.controller");
const router = (0, express_1.Router)();
//registration & authentication
router.post("/register", auth_controller_1.register);
router.post("/verify", auth_controller_1.verify);
router.post("/login", auth_controller_1.login);
exports.default = router;
