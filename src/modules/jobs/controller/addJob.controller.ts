import { Request,Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { IJob } from "../types/JobModel.type";
import {  addJobService } from "../services/addJob.service";
import { Schema } from "mongoose";
import { CustomError } from "../../../shared/utils/customError";

export const addJobController =expressAsyncHandler(async (req:Request, res:Response) => {
    const id=req.user?.id
    if(!id){
        throw new CustomError("unAuthorized",401)
    }
//    const userId = new Schema.Types.ObjectId(id);
    const data:IJob = req.body;
    const job = await addJobService(data,id);
    res.status(201).json({
      message: "Job created successfully",
      job,
    });
})
