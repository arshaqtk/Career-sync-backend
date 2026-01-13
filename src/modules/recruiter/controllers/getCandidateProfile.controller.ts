import { CustomError } from "@/shared/utils/customError";
import { Request, Response } from "express";
import { RecruiterService } from "../services/recruiter.service";

const recruiterService = RecruiterService()


export const getCandidateProfileController = async (req: Request, res: Response) => {
    const candidateId = req.params.candidateId as string
    const result = await recruiterService.getCandidateProfile(candidateId)

    res.status(200).json(result);
}

export const getRecruiterProfileStats=async(req:Request,res:Response)=>{
    const recruiterId=req.user?.id as string
    const result =await recruiterService.getProfileStats(recruiterId);
     res.status(200).json(result); 
}

export const getRecruiterDashboardData=async(req:Request,res:Response)=>{
    const recruiterId=req.user?.id as string 
    const data=await recruiterService.getRecruiterDashboardDataService(recruiterId);
    return res.status(200).json({
      success: true,
      data,
    }) 
}
