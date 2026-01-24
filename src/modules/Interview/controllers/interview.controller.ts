import { Request,Response } from "express";
import { InterviewServices } from "../services/interview.service";
import { InterviewQuery } from "../types/interview.query.type";
import { scheduledInterviewSchema } from "../validators/interviewSchedule.shema";


const interviewServices=InterviewServices()

export const recruiterGetInterviewsController=async(req:Request,res:Response)=>{
    const recruiterId=String(req.auth?.id)
    const { page = 1, limit = 10,sortBy,status,roundType,search }:InterviewQuery = req.query 
  const response=await interviewServices.recruiterGetInterviews(recruiterId,{sortBy,status,roundType,limit,page,search})
  res.status(200).json({
  success: true,
  message: "Interview fetched successfully",
  data: response,
});
}


export const recruiterGetInterviewByIdController=async(req:Request,res:Response)=>{
   const interviewId = String(req.params.interviewId)
   
  const response=await interviewServices.recruiterGetInterviewById(String(interviewId))
  res.status(200).json({
  success: true,
  message: "Interview fetched successfully",
  data: response,
});
}

export const recruiterScheduleInterviewController=async(req:Request,res:Response)=>{
  const {applicationId}=req.params
  const recruiterId=String(req.auth?.id)
  const payload = scheduledInterviewSchema.parse(req.body)
  const scheduleMode:"initial" | "next_round"=payload.scheduleMode
  const response=await interviewServices.recruiterScheduleInterview({recruiterId:String(recruiterId),applicationId:String(applicationId),
    payload,scheduleMode})
  res.status(200).json({
  success: true,
  message: "Interview scheduled successfully",
  data: response,
});
}

export const rescheduleInterviewController = async (req:Request,res:Response) => {
  const recruiterId = String(req.auth?.id)
  const interviewId = req.params.interviewId as string;

  const interview = await interviewServices.recruiterRescheduleInterview({
    recruiterId:String(recruiterId),
    interviewId:String(interviewId),
    payload: req.body,
  })

  res.status(200).json({
    message: "Interview rescheduled successfully",
    interview,
  })
}


//------------------Fetch all the interview by each application--------------------------------------
export const recruiterGetInterviewsByApplicationController=async(req:Request,res:Response)=>{
    const recruiterId=String(req.auth?.id)
     const  applicationId  = String(req.params.applicationId)

  const response=await interviewServices.recruiterGetInterviewsByApplicationId({applicationId:String(applicationId),recruiterId:String(recruiterId)})
  res.status(200).json({
  success: true,
  message: "Interview fetched successfully",
  data: response,
});
}



export const recruiterUpdateInterviewStatusController=async(req:Request,res:Response)=>{
 const interviewId = req.params.interviewId as string;
  const recruiterId=req.auth?.id as string
  const payload=req.body
   const response=await interviewServices.recruiterUpdateInterviewStatus({recruiterId:String(recruiterId),
    interviewId:String(interviewId),payload})
  res.status(200).json({
  success: true,
  message: `Interview ${payload.status} successfully`,
  data: response,
});
}

export const recruiterFinalizeCandidateController=async(req:Request,res:Response)=>{
  const recruiterId=req.auth?.id as string
  const  applicationId  = req.params.applicationId as string;
  const {decision,note}=req.body
   const response=await interviewServices.finalizeCandidateService({recruiterId:String(recruiterId),applicationId:String(applicationId),decision,note})
  res.status(200).json({
  success: true,
  message: `Candidate ${decision} successfully`,
  data: response,
});
}



export const candidateGetInterviewsController=async (req:Request,res:Response)=>{
  const candidateId=req.auth?.id as string
    const { page = 1, limit = 10,sortBy,status,roundType,search }:InterviewQuery = req.query
  
  const response=await interviewServices.candidateGetInterviews(candidateId,{sortBy,status,roundType,limit,page,search})
  res.status(200).json({
  success: true,
  message: `Interviews fetched successfully`,
  data: response,
});
}

export const candidateGetInterviewDetailController=async (req:Request,res:Response)=>{
  const candidateId=req.auth?.id as string
    const interviewId = req.params.interviewId as string;
  
  const response=await interviewServices.candidateGetInterviewById(String(candidateId),String(interviewId))
  res.status(200).json({
  success: true,
  message: `Interviews fetched successfully`,
  data: response,
});
}