import { Response,Request } from "express";
import { getJobByIdService } from "../services/getJobById.service";
import { CustomError } from "../../../shared/utils/customError";


export const getJobByIdController=async(req:Request,res:Response)=>{
   const candidateId=req.auth?.id
   const jobId=req.params.id
    const jobs=await getJobByIdService({jobId:String(jobId),candidateId})
     res.status(200).json(jobs);
}