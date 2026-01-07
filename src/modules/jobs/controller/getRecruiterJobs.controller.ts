import { Response,Request } from "express";
import expressAsyncHandler from "express-async-handler";
import { getEmployerJobService } from "../services/getEmployerJob.service";
import { CustomError } from "../../../shared/utils/customError";

export const getRecruiterJobController=expressAsyncHandler(async(req:Request,res:Response)=>{
     const { page = 1, limit = 10, location, jobType,status,search,sortByApplication } = req.query
     const recruiterId=req.user?.id as string

    if(!recruiterId){
         throw new CustomError("unAuthorized",401)
    }

    const result=await getEmployerJobService(recruiterId,{
     page: Number(page),
      limit: Number(limit), 
      location: location as string,
      search:search as string,
      jobType: jobType as "full-time" | "part-time" | "internship" | "all",
      status:status as "open" | "closed" | "all" ,
      sortByApplication:sortByApplication as "most_applied" | "least_applied"
    })
      res.status(200).json({
      success: true,
      jobs: result.jobs,
      pagination: result.pagination,
    });

})