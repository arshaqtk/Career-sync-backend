import { Request,Response } from "express";
import { finalizeCandidateService } from "../services/finalizeCandidateService.service";

export const recruiterFinalizeCandidateController=async(req:Request,res:Response)=>{
  const recruiterId=req.auth?.id as string
  const  applicationId  = req.params.applicationId as string;
  const {decision,note}=req.body
   const response=await finalizeCandidateService({recruiterId:String(recruiterId),applicationId:String(applicationId),decision,note})
  res.status(200).json({
  success: true,
  message: `Candidate ${decision} successfully`,
  data: response,
});
}