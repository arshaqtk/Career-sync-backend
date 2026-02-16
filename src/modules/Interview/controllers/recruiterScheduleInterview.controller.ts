import { Request,Response } from "express";
import { scheduledInterviewSchema } from "../validators/interviewSchedule.shema";
import { recruiterScheduleInterview } from "../services/recruiterScheduleInterview.service";

export const recruiterScheduleInterviewController=async(req:Request,res:Response)=>{
  const {applicationId}=req.params
  const recruiterId=String(req.auth?.id)
  const payload = scheduledInterviewSchema.parse(req.body)
  const scheduleMode:"initial" | "next_round"=payload.scheduleMode
  const response=await recruiterScheduleInterview({recruiterId:String(recruiterId),applicationId:String(applicationId),
    payload,scheduleMode})
  res.status(200).json({
  success: true,
  message: "Interview scheduled successfully",
  data: response,
});
}