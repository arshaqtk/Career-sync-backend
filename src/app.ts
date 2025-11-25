import express from "express";
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { rateLimit } from 'express-rate-limit'

import authRoutes from "./modules/auth/routes/auth.routes"


const app=express()

app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use(express.json({limit:'10mb'}))
app.use(express.urlencoded({extended:true}))


app.use("/api/auth", authRoutes);
 
export default app