import { Response,Request } from "express";
import expressAsyncHandler from "express-async-handler";
import { getJobByIdService } from "../services/getJobById.service";
import { CustomError } from "../../../shared/utils/customError";


export const getJobByIdController=expressAsyncHandler(async(req:Request,res:Response)=>{
   const candidateId=req.user?.id
   const jobId=req.params.id
   if(!candidateId){
            throw new CustomError("unAuthorized",401)
       }
    const jobs=await getJobByIdService({jobId,candidateId})
     res.status(200).json(jobs);
})