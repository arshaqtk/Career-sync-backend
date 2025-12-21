import { CustomError } from "../../../shared/utils/customError";
import { Request,Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { CandidategetJobsService } from "../services/getAlljob.service";

interface JobQuery {
  page?: string;
  limit?: string;
  status?: "open" | "closed"
  jobType?: "full-time" | "part-time" | "internship";
  location?: string;
  // experience?: string;
}

export const CandidategetJobs=expressAsyncHandler(async (req:Request, res:Response)=>{
    const id=req.user?.id
    const { page = 1, limit = 10, location, jobType,status } = req.query as JobQuery
    if(!id){
         throw new CustomError("unAuthorized",401)
    }

    const result  = await CandidategetJobsService(id,{
      page: Number(page),
      limit: Number(limit), 
      location: location as string,
      jobType: jobType as "full-time" | "part-time" | "internship" | "all",
      status:status as "open" | "closed" | "all" ,
    });
console.log(result)
    res.status(200).json({
      success: true,
      jobs: result.jobs,
      pagination: result.pagination,
    });
  }
)