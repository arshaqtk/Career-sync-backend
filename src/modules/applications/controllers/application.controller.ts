import expressAsyncHandler from "express-async-handler";
import { Request,Response } from "express";
import { CustomError } from "../../../shared/utils/customError";
import { ApplicationService } from "../services/application.service";
import { ApplicationQuery } from "../types/applicationQuery.types";

const applicationService = ApplicationService();


//--------------------Candidate------------------------

export const applyToJob=async(req:Request,res:Response)=>{    
  const data=await applicationService.applyForJob(req.user?.id as string,req.body)
  res.status(201).json({ success: true, data,message:"Applied to job successfully" });
}


//application by candidate
export const getMyApplicationsController = expressAsyncHandler(async (req:Request,res:Response) => {  
  const id=req.user?.id as string
      const { page = 1, limit = 10,sortBy,status } = req.query as ApplicationQuery
  const response = await applicationService.getMyApplications(id,{status,sortBy});
  res.status(200).json(response);
});
 
//candidate application detail view
export const getApplicationController = expressAsyncHandler(async (req:Request,res:Response) => {
  const response = await applicationService.getApplication(req.params.id);
  res.status(200).json(response); 
}); 


 
//-----------------------Recruiter--------------------------------

export const getRecruiterApplicationsController=async(req:Request,res:Response)=>{
  const recruiterId=req.user?.id
  if(!recruiterId){
    throw new CustomError("unAuthorized",401)
  } 
    const response = await applicationService.getRecruiterApplications(recruiterId);
  res.status(200).json(response);
}
//application by recruiter based on job
export const getApplicationsByJobController = async (req:Request,res:Response) => {
  const response = await applicationService.getApplicationsByJob(req.params.jobId);
  res.status(200).json(response);
}

//Recruiter  applicant detail view 
export const getApplicantDetailsController=async(req:Request,res:Response)=>{
  const response=await applicationService.getApplicantDetails(req.params.applicationId)
  res.status(200).json(response);
}

export const updateApplicationStatusController=async(req:Request,res:Response)=>{

  const applicationId=req.params.applicationId
  const {status}=req.body

  const updated=await applicationService.updateApplicationStatusService(applicationId,status)
    return res.status(200).json({
      message: "Application status updated",
      data: updated
    })
  }