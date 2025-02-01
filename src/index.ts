import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
const app = express()

const prisma = new PrismaClient()

dotenv.config()

app.use(express.json())


app.get('/',(req:Request,res:Response)=>{
    res.status(200).json({message:"Initialize App!"})
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`)
})
