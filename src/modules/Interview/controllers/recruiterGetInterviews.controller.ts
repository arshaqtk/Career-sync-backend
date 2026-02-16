import { Request,Response } from "express";
import { InterviewQuery } from "../types/interview.query.type";
import { recruiterGetInterviews } from "../services/recruiterGetInterviews.service";

export const recruiterGetInterviewsController=async(req:Request,res:Response)=>{
    const recruiterId=String(req.auth?.id)
    const { page = 1, limit = 10,sortBy,status,roundType,search }:InterviewQuery = req.query 
  const response=await recruiterGetInterviews(recruiterId,{sortBy,status,roundType,limit,page,search})
  res.status(200).json({
  success: true,
  message: "Interview fetched successfully",
  data: response,
});
}