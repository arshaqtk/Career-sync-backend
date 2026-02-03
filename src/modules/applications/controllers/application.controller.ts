import expressAsyncHandler from "express-async-handler";
import { Request,Response } from "express";
import { CustomError } from "../../../shared/utils/customError";
import { ApplicationService } from "../services/application.service";
import { ApplicationQuery } from "../types/applicationQuery.types";

const applicationService = ApplicationService();


export const getResumeUrl=async(req:Request,res:Response)=>{   
  const applicationId=req.params.applicationId
  const key=req.body.data
  console.log(key,"--------------------")
  const resumeUrl=await applicationService.ViewResumeService(applicationId,key)
  res.status(201).json({ success: true, resumeUrl,message:"Resume fetched successfully" });
}

//--------------------Candidate------------------------

export const applyToJob=async(req:Request,res:Response)=>{    
  const data=await applicationService.applyForJob(req.auth?.id as string,req.body)
  res.status(201).json({ success: true, data,message:"Applied to job successfully" });
}


//application by candidate
export const getMyApplicationsController = expressAsyncHandler(async (req:Request,res:Response) => {  
  const id=req.auth?.id as string
      const {page = 1, limit = 10 ,sortBy,status } = req.query
  const response = await applicationService.getMyApplications(id,{
   page: Number(page),
      limit: Number(limit),
     status:status as  "all" | "Pending" | "Shortlisted" | "Interview" | "Rejected"
    ,sortBy:sortBy as "newest" | "oldest"});
  res.status(200).json(response);
});
 
//candidate application detail view
export const getApplicationController = expressAsyncHandler(async (req:Request,res:Response) => {
  const  applicationId  = req.params.applicationId as string
  const response = await applicationService.getCandidateApplicationDetailService(applicationId);
  res.status(200).json(response); 
}); 


 
//-----------------------Recruiter--------------------------------

//recruiter get all applications which have status interview 
export const getRecruiterApplicationsController=async(req:Request,res:Response)=>{
  const recruiterId=req.auth?.id
   const { page = 1, limit = 10,status,sortBy,search } = req.query
  if(!recruiterId){
    throw new CustomError("unAuthorized User Not Found",401)
  } 
    const response = await applicationService.getRecruiterApplications(recruiterId,{
      page: Number(page),
      limit: Number(limit),
      search:search as string,
       status:status as  "all" | "Pending" | "Shortlisted" | "Interview" | "Rejected" ,
      sortBy:sortBy as "newest" | "oldest"
    });
  res.status(200).json(response);
}


//application by recruiter based on job
export const getApplicationsByJobController = async (req:Request,res:Response) => {
  const response = await applicationService.getApplicationsByJob(String(req.params.jobId));
  res.status(200).json(response);
}

//Recruiter  applicant detail view 
export const getApplicantDetailsController=async(req:Request,res:Response)=>{
  const response=await applicationService.getApplicantDetails(String(req.params.applicationId))
  res.status(200).json(response);
}

export const updateApplicationStatusController=async(req:Request,res:Response)=>{

   const  applicationId  = req.params.applicationId as string

  const {status}=req.body

  const updated=await applicationService.updateApplicationStatusService(applicationId,status)
    return res.status(200).json({
      message: "Application status updated",
      data: updated
    })
  }