"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateCompany = exports.getCompany = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const companyValidation_1 = require("../../validations/companyValidation");
const prisma = new client_1.PrismaClient();
const getCompany = async (req, res) => {
    try {
        if (!req.user || !req.user.companyId) {
            return res.status(400).json({ message: "No user information found" });
        }
        const company = await prisma.company.findUnique({
            where: { id: req.user.companyId },
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
                isActive: true,
                createdAt: true,
                industry: true,
                country: true
            },
        });
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        res.status(200).json({ company });
    }
    catch (error) {
        console.error("Error fetching company:", error);
        res.status(500).json({ message: "An error occurred while fetching company data" });
    }
};
exports.getCompany = getCompany;
const updateCompany = async (req, res) => {
    try {
        if (!req.user || !req.user.companyId) {
            return res.status(400).json({ message: "Unauthorized access" });
        }
        const validationResult = companyValidation_1.updateCompanySchema.safeParse(req.body);
        if (!validationResult.success) {
            const errorMessages = validationResult.error.errors
                .map(err => `${err.path.join('.')}: ${err.message}`);
            return res.status(400).json({
                message: "Validation errors",
                errors: errorMessages,
            });
        }
        const { name, country, industry } = validationResult.data;
        const updatedCompany = await prisma.company.update({
            where: { id: req.user.companyId },
            data: { name, country, industry },
        });
        const { password, email, ...companyWithoutSensitiveData } = updatedCompany;
        res.status(200).json({
            message: "Profile updated successfully",
            company: companyWithoutSensitiveData
        });
    }
    catch (error) {
        console.error("Error updating company:", error);
        res.status(500).json({ message: "An error occurred while updating company data" });
    }
};
exports.updateCompany = updateCompany;
const changePassword = async (req, res) => {
    try {
        if (!req.user || !req.user.companyId) {
            return res.status(400).json({ message: "Unauthorized access" });
        }
        const validationResult = companyValidation_1.changePasswordSchema.safeParse(req.body);
        if (!validationResult.success) {
            const errorMessages = validationResult.error.errors
                .map(err => `${err.path.join('.')}: ${err.message}`);
            return res.status(400).json({
                message: "Validation errors",
                errors: errorMessages,
            });
        }
        const { oldPassword, newPassword } = validationResult.data;
        const company = await prisma.company.findUnique({
            where: { id: req.user.companyId },
        });
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(oldPassword, company.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await prisma.company.update({
            where: { id: req.user.companyId },
            data: { password: hashedPassword },
        });
        res.status(200).json({ message: "Password changed successfully" });
    }
    catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "An error occurred while changing password" });
    }
};
exports.changePassword = changePassword;
