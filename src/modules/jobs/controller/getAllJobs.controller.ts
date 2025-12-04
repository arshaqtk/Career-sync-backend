import { CustomError } from "../../../utils/customError";
import { Request,Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { getAllJobsService } from "../services/getAlljob.service";

export const getAllJobs=expressAsyncHandler(async (req:Request, res:Response)=>{
    const id=req.user?.id
    const { page = 1, limit = 10, search, location, jobType } = req.query;
    if(!id){
         throw new CustomError("unAuthorized",401)
    }

    const jobs = await getAllJobsService({
      page: Number(page),
      limit: Number(limit),
      search: search as string,
      location: location as string,
      jobType: jobType as string,
    });

    res.status(200).json(jobs);
  }
)