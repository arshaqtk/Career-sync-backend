import { Response,Request } from "express";
import expressAsyncHandler from "express-async-handler";
import { getJobByIdService } from "../services/getJobById.service";


export const getJobByIdController=expressAsyncHandler(async(req:Request,res:Response)=>{
   const jobId=req.params.id
    const jobs=await getJobByIdService(jobId)
     res.status(200).json(jobs);
})