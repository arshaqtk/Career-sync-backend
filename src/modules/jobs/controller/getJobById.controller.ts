import { Response,Request } from "express";
import { getJobByIdService } from "../services/getJobById.service";
import { CustomError } from "../../../shared/utils/customError";


export const getJobByIdController=async(req:Request,res:Response)=>{
   const candidateId=req.auth?.id
   const jobId=req.params.id
   if(!candidateId){
            throw new CustomError("unAuthorized User Not Found",401)
       }
    const jobs=await getJobByIdService({jobId:String(jobId),candidateId})
     res.status(200).json(jobs);
}