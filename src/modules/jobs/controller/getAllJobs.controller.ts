import { CustomError } from "../../../shared/utils/customError";
import { Request,Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { CandidategetJobsService } from "../services/getAlljob.service";
// import { parseBoolean } from "../../../shared/utils/parseBoolean";



export const CandidategetJobs=expressAsyncHandler(async (req:Request, res:Response)=>{
    const id=req.user?.id
    const { page = 1, limit = 10, location, jobType,status,search, remote,experienceMin,experienceMax,field } = req.query
    if(!id){
         throw new CustomError("unAuthorized",401)
    }
console.log("remote",remote)
    const result  = await CandidategetJobsService(id,{
      page: Number(page),
      limit: Number(limit), 
      location: location as string,
      search:search as string,
      jobType: jobType as "full-time" | "part-time" | "internship" | "all",
      status:status as "open" | "closed" | "all" ,
      remote,
       experienceMin:Number(experienceMin),
       experienceMax:Number(experienceMax),
       field:field as string
    });
    res.status(200).json({
      success: true,
      jobs: result.jobsWithAppliedFlag,
      pagination: result.pagination,
    });
  } 
)