import { candidateGetInterviewById } from "../services/candidateGetInterviewById.service";
import { Request,Response } from "express";

export const candidateGetInterviewDetailController=async (req:Request,res:Response)=>{
  const candidateId=req.auth?.id as string
    const interviewId = req.params.interviewId as string;
  
  const response=await candidateGetInterviewById(String(candidateId),String(interviewId))
  res.status(200).json({
  success: true,
  message: `Interviews fetched successfully`,
  data: response,
});
}