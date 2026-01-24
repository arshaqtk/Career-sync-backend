import expressAsyncHandler from "express-async-handler";
import { CustomError } from "../../../shared/utils/customError";
import { Request, Response } from "express";
import { candidateSkillService } from "../services/candidateSkill.service";

export const updateCandidateProfileSkill=expressAsyncHandler(async (req: Request, res: Response) => {

    const userId = req.auth?.id as string;
    if (!userId) {
      throw new CustomError("unAuthorized User Not Found", 401);
    }
    const skill=req.body
    const result = await candidateSkillService(userId,skill)
    res.status(200).json({
      success: true,  
      message: "Profile updated successfully",
      data: result,
    }); 
  })