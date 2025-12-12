import expressAsyncHandler from "express-async-handler";
import { Request,Response } from "express";
import { CustomError } from "../../../shared/utils/customError";
import { ApplicationService } from "../services/createApplication.service";

const applicationService = ApplicationService();

export const applyToJob=async(req:Request,res:Response)=>{    
  console.log(req.body)
    const data=await applicationService.applyForJob(req.user?.id as string,req.body)
     res.status(201).json({ success: true, data,message:"Applied to job successfully" });
}

//detail view
export const getApplicationController = expressAsyncHandler(async (req, res) => {
  const response = await applicationService.getApplication(req.params.id);
  res.status(200).json(response); 
}); 

//application by candidate
export const getMyApplicationsController = expressAsyncHandler(async (req, res) => {  
  const response = await applicationService.getMyApplications(req.user?.id as string);
  res.status(200).json(response);
});

//application by recruiter based on job
export const getApplicationsByJobController = expressAsyncHandler(async (req, res) => {
  const response = await applicationService.getApplicationsByJob(req.params.jobId);
  console.log(response)
  res.status(200).json(response);
});