import { Request,Response } from "express";
import { adminDashboardService, adminDashboardStatsService } from "../services/adminDashboard.service";



export const adminDashboardStats=async(req:Request,res:Response)=>{
    const stats=await adminDashboardStatsService()
     res.status(200).json(stats);
}

export const getAdminDashboardData=async(req:Request,res:Response)=>{
    const data=await adminDashboardService();
    return res.status(200).json({
      success: true,
      data,
    }) 
}