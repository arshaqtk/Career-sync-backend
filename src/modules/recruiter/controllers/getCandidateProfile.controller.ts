import { CustomError } from "@/shared/utils/customError";
import { Request, Response } from "express";
import { RecruiterService } from "../services/recruiter.service";

const recruiterService = RecruiterService()


export const getCandidateProfileController = async (req: Request, res: Response) => {
    const candidateId = req.params.candidateId
    const result = await recruiterService.getCandidateProfile(candidateId)

    res.status(200).json(result);
}

