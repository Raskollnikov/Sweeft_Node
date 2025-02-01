import express from 'express'
import dotenv from 'dotenv'
import cors from "cors";
import companyRoutes from "./routes/company.routes";
import cookieParser from "cookie-parser";
import helmet from 'helmet';

const app = express()

dotenv.config()

app.use(cookieParser());

app.use(express.json())

app.use(cors());
app.use(helmet())

app.use("/company", companyRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`)
})
