import { Request,Response } from "express";
import { InterviewServices } from "../services/interview.service";
import { InterviewQuery } from "../types/interview.query.type";


const interviewServices=InterviewServices()

export const recruiterGetInterviewsController=async(req:Request,res:Response)=>{
    const recruiterId=req.user?.id as string
    const { page = 1, limit = 10,sortBy,status,roundType } = req.query as InterviewQuery
  const response=await interviewServices.recruiterGetInterviews(recruiterId,{sortBy,status,roundType,limit,page})
  res.status(200).json({
  success: true,
  message: "Interview fetched successfully",
  data: response,
});
}


export const recruiterGetInterviewByIdController=async(req:Request,res:Response)=>{
    const {interviewId}=req.params
    console.log(interviewId)
  const response=await interviewServices.recruiterGetInterviewById(interviewId)
  res.status(200).json({
  success: true,
  message: "Interview fetched successfully",
  data: response,
});


}
