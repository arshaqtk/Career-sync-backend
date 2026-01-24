import { Request,Response } from "express";
import { CandidategetJobsService } from "../services/getAlljob.service";
// import { parseBoolean } from "../../../shared/utils/parseBoolean";



export const CandidategetJobs=async (req:Request, res:Response)=>{
    const id=req.auth?.id
    const { page = 1, limit = 10, location, jobType,status,search, remote,experienceMin,experienceMax,field } = req.query
    // if(!id){ 
    //      throw new CustomError("unAuthorized User Not Found",401)
    // }
    const result  = await CandidategetJobsService({candidateId:id,query:{
      page: Number(page),
      limit: Number(limit), 
      location: location as string,
      search:search as string,
      jobType: jobType as "full-time" | "part-time" | "internship" | "all",
      status:status as "open" | "closed" | "all" ,
      remote:remote==="true"?true:remote=="false"?false:undefined,
       experienceMin:Number(experienceMin),
       experienceMax:Number(experienceMax),
       field:field as string
    }});
    res.status(200).json({
      success: true,
      jobs: result.jobsWithAppliedFlag,
      pagination: result.pagination,
    });
  } 
