import express from 'express'
import dotenv from 'dotenv'
import cors from "cors";
import companyRoutes from "./routes/company.routes";
import subscriptionRoutes from './routes/subscription.routes'
import userRoutes from './routes/user.routes'
import fileRoutes from './routes/file.routes'
import cookieParser from "cookie-parser";
import helmet from 'helmet';
import limiter from './utils/rateLimiter';

const app = express()

dotenv.config()

app.use(cookieParser());

app.use(express.json())
app.use(limiter)
app.use(cors({credentials:true}));
app.use(helmet())

app.use("/company", companyRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/user",userRoutes)
app.use('/api/v1/file',fileRoutes)
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`)
})
