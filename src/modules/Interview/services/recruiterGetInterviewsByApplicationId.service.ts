import { CustomError } from "@/shared/utils/customError";
import { Types } from "mongoose";
import { InterviewRepository } from "../repository/interview.repository";
import { RecruiterInterviewTimeLineDto } from "../dto/recruiter.allInterviews.dto";

const interviewRepository = InterviewRepository();

export  const recruiterGetInterviewsByApplicationId = async ({ applicationId, recruiterId }: 
    { applicationId: string, recruiterId?: string }): Promise<RecruiterInterviewTimeLineDto[]> => {
    if (!applicationId) {
      throw new CustomError("ApplicationId is required", 400);
    }

    const filter: Record<string, any> = {
      applicationId: new Types.ObjectId(applicationId),
    };


    if (recruiterId) {
      filter.recruiterId = new Types.ObjectId(recruiterId)
    }


    const interviews = await interviewRepository.findMany({
      filter,
      sort: { roundNumber: 1 },
    });




    return interviews.map((interview) => ({
      _id: interview._id.toString(),
      roundType: interview.roundType,
      roundNumber: interview.roundNumber,
      status: interview.status,
      endTime: interview.endTime,
      startTime: interview.startTime,
      mode: interview.mode,
      notes: interview.notes,
      statusHistory: interview.statusHistory,
      createdAt: interview.createdAt,
    }));
  };