import expressAsyncHandler from "express-async-handler";
import { CustomError } from "../../../shared/utils/customError";
import { Request, Response } from "express";
import { candidateExperienceService } from "../services/candidateExperience.service";

export const updateCandidateProfileExperience=expressAsyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    if (!userId) {
      throw new CustomError("Unauthorized", 401);
    }
    const experience=req.body
    const result = await candidateExperienceService(userId,experience)
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  })