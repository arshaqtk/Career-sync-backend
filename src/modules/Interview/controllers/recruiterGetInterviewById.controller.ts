import { recruiterGetInterviewById } from "../services/recruiterGetInterviewById.service";
import { Request,Response } from "express";

export const recruiterGetInterviewByIdController=async(req:Request,res:Response)=>{
   const interviewId = String(req.params.interviewId)
   
  const response=await recruiterGetInterviewById(String(interviewId))
  res.status(200).json({
  success: true,
  message: "Interview fetched successfully",
  data: response,
});
}