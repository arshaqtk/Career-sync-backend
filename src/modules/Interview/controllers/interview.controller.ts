import { Request,Response } from "express";
import { InterviewServices } from "../services/interview.service";
import { InterviewQuery } from "../types/interview.query.type";
import { scheduledInterviewSchema } from "../validators/interviewSchedule.shema";


const interviewServices=InterviewServices()

export const recruiterGetInterviewsController=async(req:Request,res:Response)=>{
    const recruiterId=req.user?.id as string
    const { page = 1, limit = 10,sortBy,status,roundType,search }:InterviewQuery = req.query 
  const response=await interviewServices.recruiterGetInterviews(recruiterId,{sortBy,status,roundType,limit,page,search})
  res.status(200).json({
  success: true,
  message: "Interview fetched successfully",
  data: response,
});
}


export const recruiterGetInterviewByIdController=async(req:Request,res:Response)=>{
    const {interviewId}=req.params
   
  const response=await interviewServices.recruiterGetInterviewById(interviewId)
  res.status(200).json({
  success: true,
  message: "Interview fetched successfully",
  data: response,
});
}

export const recruiterScheduleInterviewController=async(req:Request,res:Response)=>{
  const {applicationId}=req.params
  const recruiterId=req.user?.id as string
  const payload = scheduledInterviewSchema.parse(req.body)
  const scheduleMode:"initial" | "next_round"=payload.scheduleMode
  const response=await interviewServices.recruiterScheduleInterview({recruiterId,applicationId,payload,scheduleMode})
  res.status(200).json({
  success: true,
  message: "Interview scheduled successfully",
  data: response,
});
}

export const rescheduleInterviewController = async (req:Request,res:Response) => {
  const recruiterId = req.user?.id as string
  const { interviewId } = req.params

  const interview = await interviewServices.recruiterRescheduleInterview({
    recruiterId,
    interviewId,
    payload: req.body,
  })

  res.status(200).json({
    message: "Interview rescheduled successfully",
    interview,
  })
}


//------------------Fetch all the interview by each application--------------------------------------
export const recruiterGetInterviewsByApplicationController=async(req:Request,res:Response)=>{
    const recruiterId=req.user?.id as string
    const {applicationId}=req.params 
  const response=await interviewServices.recruiterGetInterviewsByApplicationId({applicationId,recruiterId})
  res.status(200).json({
  success: true,
  message: "Interview fetched successfully",
  data: response,
});
}



export const recruiterUpdateInterviewStatusController=async(req:Request,res:Response)=>{
  const {interviewId}=req.params
  const recruiterId=req.user?.id as string
  const payload=req.body
   const response=await interviewServices.recruiterUpdateInterviewStatus({recruiterId,interviewId,payload})
  res.status(200).json({
  success: true,
  message: `Interview ${payload.status} successfully`,
  data: response,
});
}

export const recruiterFinalizeCandidateController=async(req:Request,res:Response)=>{
  const recruiterId=req.user?.id as string
  const { applicationId } = req.params;
  const {decision,note}=req.body
   const response=await interviewServices.finalizeCandidateService({recruiterId,applicationId,decision,note})
  res.status(200).json({
  success: true,
  message: `Candidate ${decision} successfully`,
  data: response,
});
}



export const candidateGetInterviewsController=async (req:Request,res:Response)=>{
  const candidateId=req.user?.id as string
    const { page = 1, limit = 10,sortBy,status,roundType,search }:InterviewQuery = req.query
  
  const response=await interviewServices.candidateGetInterviews(candidateId,{sortBy,status,roundType,limit,page,search})
  res.status(200).json({
  success: true,
  message: `Interviews fetched successfully`,
  data: response,
});
}

export const candidateGetInterviewDetailController=async (req:Request,res:Response)=>{
  const candidateId=req.user?.id as string
    const {interviewId}=req.params
  
  const response=await interviewServices.candidateGetInterviewById(candidateId,interviewId)
  res.status(200).json({
  success: true,
  message: `Interviews fetched successfully`,
  data: response,
});
}