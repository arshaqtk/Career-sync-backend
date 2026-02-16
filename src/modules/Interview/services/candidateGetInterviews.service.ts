import { CustomError } from "@/shared/utils/customError";
import { CandidateInterviewsDTO } from "../dto/candidateInterviews.dto";
import { InterviewRepository } from "../repository/interview.repository";
import { InterviewQuery } from "../types/interview.query.type";

 
 const interviewRepository = InterviewRepository();
 
 export const candidateGetInterviews = async (
    candidateId: string,
    query: InterviewQuery
  ): Promise<{
    today: CandidateInterviewsDTO[]
    upcoming: CandidateInterviewsDTO[]
    past: CandidateInterviewsDTO[]
  }> => {
    if (!candidateId) {
      throw new CustomError("Required identifier not found", 400);
    }

    const {
      status,
      sortBy = "newest",
      page = "1",
      limit = "10",
      roundType,
    } = query;

    const filter: Record<string, any> = {
      candidateId,
    };

    if (status && status !== "All") {
      filter.status = status;
    }

    if (roundType && roundType !== "All") {
      filter.roundType = roundType;
    }

    const sortOrder = sortBy === "newest" ? -1 : 1;
    const skip = (Number(page) - 1) * Number(limit);

    const interviews = await interviewRepository.findLatestByActor({
      actorField: "candidateId",
      actorId: candidateId,
      filter,
      populate: [{ path: "jobId", select: "title company" }],
      sort: { createdAt: sortOrder },
      skip,
      limit: Number(limit),
    });

    const now = new Date();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const today: CandidateInterviewsDTO[] = [];
    const upcoming: CandidateInterviewsDTO[] = [];
    const past: CandidateInterviewsDTO[] = [];

    interviews.forEach((interview) => {
      const startTime = interview.startTime
        ? new Date(interview.startTime)
        : null;

      const endTime = interview.endTime
        ? new Date(interview.endTime)
        : null;

      const dto: CandidateInterviewsDTO = {
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

      // ---- classification logic ----
      if (
        startTime &&
        startTime >= todayStart &&
        startTime <= todayEnd
      ) {
        today.push(dto);
      } else if (startTime && startTime > now) {
        upcoming.push(dto);
      } else {
        past.push(dto);
      }
    });

    return {
      today,
      upcoming,
      past,
    };
  };
