import { CustomError } from "@/shared/utils/customError";
import { InterviewDetails } from "../dto/recruiter.interviewDetail.dto";
import { InterviewRepository } from "../repository/interview.repository";
import mongoose from "mongoose";

  export const recruiterGetInterviewById = async (interviewId: string): Promise<InterviewDetails> => {
const interviewRepository = InterviewRepository();

    if (!interviewId) {
      throw new CustomError("Required identifier not found", 400);
    }
    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      throw new CustomError("Invalid interview id", 400)
    }
    const interview = await interviewRepository.findById({
      id: interviewId, populate: [{ path: "candidateId", select: "_id name email" },
      { path: "jobId", select: "_id title" }]
    })
    if (!interview) {
      throw new CustomError("Interview  not found", 404);

    }
    return {
      _id: interview._id.toString(),
      applicationId: interview.applicationId.toString(),
      candidate: {
        _id:interview?.candidateId._id.toString(),
        name:interview?.candidateId.name,
        email:interview?.candidateId.email
      },
      job: {
        _id: (interview?.jobId as any)._id,
        title: (interview?.jobId as any).title

      },
      roundType: interview.roundType,
      roundNumber: interview.roundNumber,
      startTime: interview.startTime?.toString(),
      endTime: interview.endTime?.toString(),
      meetingLink: interview.meetingLink,
      location:interview.location,
      status: interview.status,
      statusHistory: interview.statusHistory,
      notes: interview.notes,
      mode: interview.mode
    }
  }