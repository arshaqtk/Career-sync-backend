import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { CustomError } from "../../../shared/utils/customError";
import { deleteResumeService, getResumeService, getUserByIdService, initializeProfileFromResumeService, updateResumeService } from "../services/candidateResume.service";
import { extractText, parseResumeWithAI } from "@/modules/Ai/resumeParser.controller";
import UserModel from "@/modules/user/models/user.model";

export const candidateGetResumeUrlController = async (req: Request, res: Response) => {
  const userId = req.auth?.id
  const mode = (req.query.mode as "view" | "download") || "view";
  if (mode != "view" && mode != "download") {
    throw new CustomError("Invalid Request")
  }
  if (!userId) {
    throw new CustomError("Invalid Request")
  }
  const url = await getResumeService({ userId, mode })
  res.status(201).json({
    success: true,
    message: "Resume fetched successfully",
    url: url,
  });
}

export const updateResumeController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.auth?.id as string

    if (!userId) {
      throw new CustomError("unAuthorized User Not Found", 401);
    }

    if (!req.file) {
      throw new CustomError("No file uploaded or invalid file type (PDF/DOCX only)", 400);
    }

    const rawText = await extractText(req.file.buffer, req.file.mimetype);
    if (rawText.trim().length < 100) {
      throw new CustomError('Resume appears to be empty or unreadable', 400);
    }
    const parsed = await parseResumeWithAI(rawText);
    const user = await getUserByIdService(userId);

    const isFirstUpload = !user?.candidateData?.isProfileInitialized;
   const result = isFirstUpload
      ? await initializeProfileFromResumeService(userId, req.file, parsed)
      : await updateResumeService(userId, req.file, parsed);

    res.status(200).json({
      success: true,
      message: isFirstUpload ? "Profile initialized" : "Resume updated",
      data: result,
    });
  }
);

export const candidateDeleteResumeController = async (req: Request, res: Response) => {
  const userId = req.auth?.id as string

  if (!userId) {
    throw new CustomError("unAuthorized User Not Found", 401);
  }

  await deleteResumeService({ userId });

  res.status(200).json({
    success: true,
    message: "Resume deleted successfully",
  });
}
