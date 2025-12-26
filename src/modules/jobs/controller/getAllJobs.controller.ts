import { CustomError } from "../../../shared/utils/customError";
import { Request,Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { CandidategetJobsService } from "../services/getAlljob.service";



export const CandidategetJobs=expressAsyncHandler(async (req:Request, res:Response)=>{
    const id=req.user?.id
    const { page = 1, limit = 10, location, jobType,status,search } = req.query
    if(!id){
         throw new CustomError("unAuthorized",401)
    }

    const result  = await CandidategetJobsService(id,{
      page: Number(page),
      limit: Number(limit), 
      location: location as string,
      search:search as string,
      jobType: jobType as "full-time" | "part-time" | "internship" | "all",
      status:status as "open" | "closed" | "all" ,
    });
    res.status(200).json({
      success: true,
      jobs: result.jobsWithAppliedFlag,
      pagination: result.pagination,
    });
  }
)