import express from "express";
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { rateLimit } from 'express-rate-limit'

import authRoutes from "./modules/auth/routes/auth.routes"
import { errorHandler } from "./middlewares/errorHandler";


const app=express()

app.use(helmet())
app.use( 
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan('combined'))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use(express.json({limit:'10mb'}))
app.use(express.urlencoded({extended:true}))


app.use("/api/auth", authRoutes);
 

app.use(errorHandler);
export default app