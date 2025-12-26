import { Request,Response } from "express";
import { adminDashboardStatsService } from "../services/adminDashboard.service";



export const adminDashboardStats=async(req:Request,res:Response)=>{
    const stats=await adminDashboardStatsService()
     res.status(200).json(stats);
}