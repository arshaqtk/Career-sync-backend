import { Request,Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { IJob } from "../types/JobModel.type";
import { CustomError } from "../../../shared/utils/customError";
import { updateJobService } from "../services/updateJob.service";

export const updateJobController =expressAsyncHandler(async (req:Request, res:Response) => {
    const employerId=req.user?.id
    const jobId=req.params.id
    if(!employerId){ 
        throw new CustomError("unAuthorized",401)
    }
    if (!jobId) {
   throw new CustomError("Job ID is required", 400);
}

    const data:Partial<IJob> = req.body;
    const job = await updateJobService({data,employerId,jobId});
    res.status(200).json({
      message: "Job updated successfully",
      job,
    });
})
