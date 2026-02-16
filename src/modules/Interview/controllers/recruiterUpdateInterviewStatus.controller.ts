import { Request,Response } from "express";
import { recruiterUpdateInterviewStatus } from "../services/recruiterUpdateInterviewStatus.service";

export const recruiterUpdateInterviewStatusController=async(req:Request,res:Response)=>{
 const interviewId = req.params.interviewId as string;
  const recruiterId=req.auth?.id as string
  const payload=req.body
   const response=await recruiterUpdateInterviewStatus({recruiterId:String(recruiterId),
    interviewId:String(interviewId),payload})
  res.status(200).json({
  success: true,
  message: `Interview ${payload.status} successfully`,
  data: response,
});
}