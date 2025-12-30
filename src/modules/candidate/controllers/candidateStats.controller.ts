import { Request,Response } from "express";
import { getCandidateProfileStatsService } from "../services/candidateProfileStats.service";
export const getCandidateProfileStats=async(req:Request,res:Response)=>{
    const candidateId=req.user?.id as string
    const result =await getCandidateProfileStatsService(candidateId);
     res.status(200).json(result); 
}