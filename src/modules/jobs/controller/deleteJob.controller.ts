import expressAsyncHandler from "express-async-handler";
import { Request,Response } from "express";
import { CustomError } from "../../../shared/utils/customError";
import { deleteJobService } from "../services/deleteJob.service";


export const deleteJobCOntroller=expressAsyncHandler(async(req:Request,res:Response)=>{
     const employerId=req.user?.id
        const jobId=req.params.id
        if(!employerId){ 
            throw new CustomError("unAuthorized",401)
        }
        if (!jobId) {
       throw new CustomError("Job ID is required", 400);
    }
    
    const deletedJob = await deleteJobService({ employerId, jobId });
    res.status(200).json({
    message: "Job deleted successfully",
    deletedJob,
  });
})