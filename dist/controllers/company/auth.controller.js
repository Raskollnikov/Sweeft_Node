"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.verify = exports.register = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = require("../../utils/generateToken");
const email_1 = require("../../utils/email");
const generateToken_2 = require("../../utils/generateToken");
const companyValidation_1 = require("../../validations/companyValidation");
const prisma = new client_1.PrismaClient();
const register = async (req, res) => {
    try {
        const validationResult = companyValidation_1.companySchema.safeParse(req.body);
        if (!validationResult.success) {
            const errorMessages = validationResult.error.errors
                .map(err => `${err.path.join('.')}: ${err.message}`);
            return res.status(400).json({
                message: "Validation errors",
                errors: errorMessages
            });
        }
        const { name, email, password, country, industry } = validationResult.data;
        const existingCompany = await prisma.company.findUnique({ where: { email } });
        if (existingCompany)
            return res.status(400).json({ message: "Email already in use" });
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const verificationToken = (0, generateToken_1.generateVerificationToken)();
        const company = await prisma.company.create({
            data: {
                name,
                email,
                password: hashedPassword,
                country,
                industry,
                token: verificationToken,
                status: "PENDING",
            },
        });
        await (0, email_1.sendVerificationEmail)(email, verificationToken);
        res.status(201).json({ message: "Company registered. Check email for verification code." });
    }
    catch (error) {
        res.status(500).json({ message: "Error registering company", error });
    }
};
exports.register = register;
const verify = async (req, res) => {
    try {
        const { token } = req.query;
        if (typeof token !== "string") {
            return res.status(400).json({ message: "Invalid token format" });
        }
        const company = await prisma.company.findFirst({
            where: { token },
        });
        if (!company) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }
        const updatedCompany = await prisma.company.update({
            where: { id: company.id },
            data: {
                status: "ACTIVE",
                token: null,
                isActive: true
            },
        });
        res.status(200).json({ message: "Account successfully verified" });
    }
    catch (error) {
        res.status(500).json({ message: "Error verifying company", error });
    }
};
exports.verify = verify;
const login = async (req, res) => {
    try {
        const validationResult = companyValidation_1.loginSchema.safeParse(req.body);
        if (!validationResult.success) {
            const errorMessages = validationResult.error.errors
                .map(err => `${err.path.join('.')}: ${err.message}`);
            return res.status(400).json({
                message: "Validation errors",
                errors: errorMessages
            });
        }
        const { email, password } = validationResult.data;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }
        const company = await prisma.company.findUnique({ where: { email } });
        if (!company) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        if (company.status !== "ACTIVE" || !company.isActive) {
            return res.status(400).json({ message: "Account is not activated or verified" });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, company.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        (0, generateToken_2.generateJwt)(company.id, company.email, res);
        res.status(200).json({
            message: "Login successful",
        });
    }
    catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Error logging in", error });
    }
};
exports.login = login;
