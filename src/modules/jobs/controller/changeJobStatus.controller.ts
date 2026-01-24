import { Request,Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { CustomError } from "../../../shared/utils/customError";
import { UpdateJobStatusDTO } from "../types/jobStatus.types";
import { updateJobStatusService } from "../services/updateJobStatus.service";


export const updateJobStatusController =expressAsyncHandler(async (req:Request, res:Response) => {
    const employerId=req.auth?.id
    const jobId=req.params.id
    if(!employerId){ 
        throw new CustomError("unAuthorized User Not Found",401)
    }
    if (!jobId) {
   throw new CustomError("Job ID is required", 400);
}
    const data:UpdateJobStatusDTO = req.body; 
  
    const job = await updateJobStatusService({data,employerId,jobId:String(jobId)});
    res.status(200).json({
      message: "Job updated successfully",
      job, 
    });
})
