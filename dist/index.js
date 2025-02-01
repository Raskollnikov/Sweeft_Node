"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.status(200).json({ message: "Initialize App!" });
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`);
});
