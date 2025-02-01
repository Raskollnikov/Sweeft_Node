"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJwt = exports.generateVerificationToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateVerificationToken = () => {
    return crypto_1.default.randomInt(100000, 999999).toString();
};
exports.generateVerificationToken = generateVerificationToken;
const generateJwt = (companyId, email, res) => {
    const token = jsonwebtoken_1.default.sign({ companyId, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 1000,
        sameSite: true
    });
};
exports.generateJwt = generateJwt;
