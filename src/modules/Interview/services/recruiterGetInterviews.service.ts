import { ApplicationRepository } from "../repository/application.repositories";
import { InterviewRepository } from "../repository/interview.repository";
import { CustomError } from "../../../shared/utils/customError";
import { RecruiterInterviewsDTO } from "../dto/recruiter.allInterviews.dto";
import { InterviewQuery } from "../types/interview.query.type";

 const interviewRepository = InterviewRepository();
 const applicationRepository = ApplicationRepository();
 
 
 
 export const recruiterGetInterviews = async (
    recruiterId: string,
    query: InterviewQuery
  ): Promise<RecruiterInterviewsDTO[]> => {
    if (!recruiterId) {
      throw new CustomError("Required identifier not found", 400);
    }

    const {
      status,
      sortBy = "newest",
      page = "1",
      limit = "10",
      roundType,
      search,
    } = query;

    const filter: Record<string, any> = {
      recruiterId,
    };

    //  status filter
    if (status && status !== "All") {
      filter.status = status;
    }

    //  round type filter
    if (roundType && roundType !== "All") {
      filter.roundType = roundType;
    }

    const sortOrder = sortBy === "newest" ? -1 : 1;
    const skip = (Number(page) - 1) * Number(limit);

    const interviews = await interviewRepository.findLatestByActor({
      actorField: "recruiterId",
      actorId: recruiterId,
      filter,
      populate: [
        { path: "candidateId", select: "name email" },
        { path: "jobId", select: "title" },
      ],
      sort: { createdAt: sortOrder },
      skip,
      limit: Number(limit),
    });


    const filteredInterviews = search
      ? interviews.filter((interview: any) =>
        interview.candidateId?.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        interview.jobId.title
          ?.toLowerCase()
          .includes(search.toLowerCase())
      )
      : interviews;

    return filteredInterviews.map((interview: any) => ({
      id: interview._id.toString(),
      candidateName: interview.candidateId?.name ?? "-",
      jobTitle: interview.jobId?.title ?? "-",
      roundType: interview.roundType,
      roundNumber: interview.roundNumber,
      status: interview.status,
      createdAt: interview.createdAt,
    }));
  };