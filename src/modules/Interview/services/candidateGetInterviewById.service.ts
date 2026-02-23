import { InterviewRepository } from "../repository/interview.repository";
import { CustomError } from "../../../shared/utils/customError";
import mongoose, { Types } from "mongoose";
import { CandidateInterviewsDTO } from "../dto/candidateInterviews.dto";

const interviewRepository = InterviewRepository();
export  const candidateGetInterviewById = async (
    candidateId: string,
    interviewId: string
  ): Promise<{
    interview: CandidateInterviewsDTO;
    timeline: any[];
  }> => {
    // ---------- validation ----------
    if (!interviewId) {
      throw new CustomError("Required identifier not found", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      throw new CustomError("Invalid interview id", 400);
    }

    // ---------- fetch current interview ----------
    const interview = await interviewRepository.findById({
      id: interviewId,
      populate: [{ path: "jobId", select: "_id title company" }],
    });

    if (!interview) {
      throw new CustomError("Interview not found", 404);
    }

    if (!interview.applicationId) {
      throw new CustomError("ApplicationId is required", 400);
    }

    // ---------- fetch timeline (all rounds for same application) ----------
    const filter: Record<string, any> = {
      applicationId: new Types.ObjectId(interview.applicationId),
    };

    if (candidateId) {
      filter.candidateId = new Types.ObjectId(candidateId);
    }

    const interviewsByApplicationId = await interviewRepository.findMany({
      filter,
      sort: { roundNumber: 1 }, // chronological order
    });

    // ---------- build timeline ----------
    const timeline = interviewsByApplicationId.map((item) => ({
      id: item._id.toString(),
      roundType: item.roundType,
      roundNumber: item.roundNumber,
      status: item.status,
      mode: item.mode,
      startTime: item.startTime?.toISOString(),
      endTime: item.endTime?.toISOString(),
      notes: item.notes,
      statusHistory: item.statusHistory,
      createdAt: item.createdAt,
    }));

    // ---------- build current interview dto ----------
    const interviewDTO: CandidateInterviewsDTO = {
      _id: interview._id.toString(),
      jobTitle: (interview.jobId as any)?.title,
      companyName: (interview.jobId as any)?.company,
      mode: interview.mode || "Online",
      startTime: interview.startTime?.toISOString(),
      endTime: interview.endTime?.toISOString(),
      meetingLink: interview.meetingLink,
      location:interview.location,
      roundType: interview.roundType,
      roundNumber: interview.roundNumber,
      status: interview.status,
      createdAt: interview.createdAt,
    };

    // ---------- final response ----------
    return {
      interview: interviewDTO,
      timeline,
    };
  };