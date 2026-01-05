import express from "express";
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { rateLimit } from 'express-rate-limit'
import cookieParser from "cookie-parser"
import authRoutes from "./modules/auth/routes/auth.routes"
import userRoutes from "./modules/user/routes/user.route"
import jobRoutes from "./modules/jobs/routes/job.routes"
import candidateRoutes from "./modules/candidate/routes/candidate.routes"
import applicationRoutes from "./modules/applications/routes/application.routes"
import recruiterRoutes from "./modules/recruiter/routes/recruiter.routes"
import interviewRoutes from "./modules/Interview/routes/interview.routes"
import adminRoutes from "./modules/admin/routes/admin.routes";
import notificationRoutes from "./modules/notification/routes/notification.routes";
import chatRoutes from "./modules/chat/routes/chat.route";


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
app.use(cookieParser());
app.use(express.json({limit:'10mb'}))
app.use(express.urlencoded({extended:true}))


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/candidate",candidateRoutes)
app.use("/api/recruiter",recruiterRoutes)
app.use("/api/application",applicationRoutes)
app.use("/api/interview",interviewRoutes)
app.use("/api/admin",adminRoutes) 
app.use("/api/notifications",notificationRoutes)
app.use("/api/chat",chatRoutes)




 

app.use(errorHandler);
export default app