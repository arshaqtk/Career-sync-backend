import expressAsyncHandler from "express-async-handler";
import { CustomError } from "../../../shared/utils/customError";
import { Request, Response } from "express";
import { addCandidateEducationeService,updateCandidateEducationService } from "../services/candidateEducation.service";

export const addCandidateEducationController=expressAsyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    if (!userId) {
      throw new CustomError("Unauthorized", 401);
    }
    const {education}=req.body
    const addedEducation = await addCandidateEducationeService(userId,education)
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: addedEducation,
    });
  })


  export const updateCandidateEducationController=expressAsyncHandler(async(req:Request,res:Response)=>{
  
    const userId=req.user?.id as string
    if(!userId){
       throw new CustomError("Unauthorized", 401);
    }

    const educationId=req.params.id
    const {education}=req.body
    const updatedEducation=await updateCandidateEducationService({userId,educationId,education})
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedEducation,
    });
  })