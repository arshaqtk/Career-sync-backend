import expressAsyncHandler from "express-async-handler";
import { CustomError } from "../../../shared/utils/customError";
import { Request, Response } from "express";
import { addCandidateExperienceService, updateCandidateProfileExperienceService } from "../services/candidateExperience.service";

export const addCandidateProfileExperienceController=expressAsyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    if (!userId) {
      throw new CustomError("Unauthorized", 401);
    }
    const {experience}=req.body
    const addedExperince = await addCandidateExperienceService(userId,experience)
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: addedExperince,
    });
  })


  export const updateCandidateProfileExperienceController=expressAsyncHandler(async(req:Request,res:Response)=>{
  
    const userId=req.user?.id as string
    if(!userId){
       throw new CustomError("Unauthorized", 401);
    }

    const experienceId=req.params.id
    const {experience}=req.body
    const updatedExperience=await updateCandidateProfileExperienceService({userId,experienceId,experience})
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedExperience,
    });
  })