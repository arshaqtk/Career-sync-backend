import { candidateGetInterviews } from "../services/candidateGetInterviews.service";
import { InterviewQuery } from "../types/interview.query.type";
import { Request,Response } from "express";

export const candidateGetInterviewsController=async (req:Request,res:Response)=>{
  const candidateId=req.auth?.id as string
    const { page = 1, limit = 10,sortBy,status,roundType,search }:InterviewQuery = req.query
  
  const response=await candidateGetInterviews(candidateId,{sortBy,status,roundType,limit,page,search})
  res.status(200).json({
  success: true,
  message: `Interviews fetched successfully`,
  data: response,
});
}