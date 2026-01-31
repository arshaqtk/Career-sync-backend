import expressAsyncHandler from "express-async-handler";
import { Request,Response } from "express";
import { CustomError } from "../../../shared/utils/customError";
import { deleteResumeService, getResumeService, updateResumeService } from "../services/candidateResume.service";


export const candidateGetResumeUrlController=async(req:Request,res:Response)=>{
    const userId=req.auth?.id
    const mode=(req.query.mode as "view" | "download") || "view";
    if(mode!="view"&&mode!="download"){
      throw new CustomError("Invalid Request")
    }
    if(!userId){
        throw new CustomError("Invalid Request")
    }
    const url=await getResumeService({userId,mode})
     res.status(201).json({
      success: true,
      message: "Resume fetched successfully",
      url: url,
    });
}

export const updateResumeController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id = req.auth?.id as string

    if (!id) {
      throw new CustomError("unAuthorized User Not Found", 401);
    }

    if (!req.file) {
      throw new CustomError("Resume file not found", 400);
    }
   

    const result = await updateResumeService(id, req.file);

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      data: result,
    });
  }
);

export const candidateDeleteResumeController=async(req:Request,res:Response)=>{
   const userId = req.auth?.id as string

    if (!userId) {
      throw new CustomError("unAuthorized User Not Found", 401);
    }

   await deleteResumeService({userId});

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
}
