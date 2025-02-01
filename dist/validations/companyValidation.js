"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.companySchema = void 0;
const zod_1 = require("zod");
exports.companySchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "Name must be at least 3 characters").max(100, "Name must be less than 100 characters"),
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters").max(20, "Password must be less than 20 characters"),
    country: zod_1.z.string().min(3, "Country name must be at least 3 characters"),
    industry: zod_1.z.string().min(3, "Industry name must be at least 3 characters"),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters")
});
