import { Request,Response } from "express";
import { recruiterRescheduleInterview } from "../services/recruiterRescheduleInterview.service";

export const rescheduleInterviewController = async (req:Request,res:Response) => {
  const recruiterId = String(req.auth?.id)
  const interviewId = req.params.interviewId as string;

  const interview = await recruiterRescheduleInterview({
    recruiterId:String(recruiterId),
    interviewId:String(interviewId),
    payload: req.body,
  })

  res.status(200).json({
    message: "Interview rescheduled successfully",
    interview,
  })
}
