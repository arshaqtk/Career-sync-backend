import path from "path"
import { CustomError } from "../../../shared/utils/customError"
import { RecruiterInterviewsDTO } from "../dto/recruiter.allInterviews.dto"
import { InterviewDetails } from "../dto/recruiter.interviewDetail.dto"
import { InterviewRepository } from "../repository/interview.repository"
import { InterviewQuery } from "../types/interview.query.type"
import { INTERVIEW_STATUS, InterviewStatus } from "../types/interview.type"
import { ScheduleInterview } from "../types/interviewSchedule.type"
import { sendInterviewEmail } from "./interviewEmail.service"
import { formatInterviewDateTime } from "../../../shared/utils/dateFormatter"
import { InterviewPopulated } from "../types/interview.populated.type"

const interviewRepository = InterviewRepository()

export const InterviewServices = () => {

    const recruiterGetInterviews = async (recruiterId: string, query: InterviewQuery): Promise<RecruiterInterviewsDTO[]> => {
        if (!recruiterId) throw new CustomError("Required identifier not found", 400)

        const { status, sortBy = "newest", page = "1", limit = "10", roundType } = query;

        const filter: Record<string, any> = {
            recruiterId,
        };

        if (status && status !== "All") {
            filter.status = status;
        }
        if (roundType && roundType != "All") {
            filter.roundType = roundType
        }
        const sortOrder = sortBy === "newest" ? -1 : 1;

        const skip = (Number(page) - 1) * Number(limit);

        const interviews = await interviewRepository.findMany({
            filter,
            populate: [{ path: "candidateId", select: "name" }, { path: "jobId", select: "title" }],
            sort: { createdAt: sortOrder },
            skip,
            limit: Number(limit)
        })

        return interviews.map((interview) => ({
            id: interview._id.toString(),
            candidateName: (interview.candidateId as any).name,
            jobTitle: (interview.jobId as any).title,
            roundType: interview.roundType,
            status: interview.status,
            createdAt: interview.createdAt,
        }))

    }

    const recruiterGetInterviewById = async (interviewId: string): Promise<InterviewDetails> => {
        const interview = await interviewRepository.findById({
            id: interviewId, populate: [{ path: "candidateId", select: "_id name email" },
            { path: "jobId", select: "_id title" }]
        })

        return {
            _id: interview._id.toString(),
            candidate: {
                _id: (interview?.candidateId as any)._id,
                name: (interview?.candidateId as any).name,
                email: (interview?.candidateId as any).email
            },
            job: {
                _id: (interview?.jobId as any)._id,
                title: (interview?.jobId as any).title

            },
            roundType: interview.roundType,
            startTime: interview.startTime?.toString(),
            endTime: interview.endTime?.toString(),
            meetingLink: interview.meetingLink,
            status: interview.status,
            statusHistory: interview.statusHistory,
            notes: interview.notes,
            mode: interview.mode
        }
    }

    const recruiterScheduleInterview = async ({ recruiterId, interviewId, payload }: { recruiterId: string, interviewId: string, payload: ScheduleInterview }) => {
        if (!recruiterId || !interviewId) {
            throw new CustomError("Recruiter ID or Interview ID is missing", 400);
        }

        if (Object.keys(payload).length === 0) {
            throw new CustomError("No update data provided", 400);
        }
        const interview = await interviewRepository.findById({
            id: interviewId,
            populate: [{ path: "candidateId", select: "name email" }, { path: "jobId", select: "title company" }]
        });

        if (!interview) {
            throw new CustomError("Interview not found", 404);
        }
        if (interview.recruiterId.toString() !== recruiterId) {
            throw new CustomError("Access denied", 403);
        }
        if (payload.mode === "Offline" && !payload.location) {
            throw new CustomError(
                "Location is required for offline interview",
                400
            );
        }
        if (payload.mode === "Online" && !payload.meetingLink) {
            throw new CustomError(
                "MeetingLink is required for Online interview",
                400
            );
        }
        const start = new Date(payload.startTime);
        const end = new Date(payload.endTime);

        if (end <= start) {
            throw new CustomError(
                "End time must be after start time",
                400
            );
        }
        const updatedInterview = await interviewRepository.updateById(
            interviewId,
            {
                startTime: start,
                endTime: end,
                timezone: payload.timezone,
                mode: payload.mode,
                meetingLink: payload.mode === "Online" ? payload.meetingLink : undefined,
                location: payload.mode === "Offline" ? payload.location : undefined,

                status: INTERVIEW_STATUS.SCHEDULED,

                $push: {
                    statusHistory: {
                        status: INTERVIEW_STATUS.SCHEDULED,
                        changedBy: recruiterId,
                        changedAt: new Date(),
                        note: "Interview scheduled",
                    },
                },
            }
        );
        if (!updatedInterview) {
            throw new CustomError("Interview not found", 404);
        }

        const { date, time } = formatInterviewDateTime(
            updatedInterview.startTime
        );

        const populatedInterview =
            updatedInterview as unknown as InterviewPopulated;

        await sendInterviewEmail(populatedInterview.status, {
            to: populatedInterview.candidateId.email,
            candidateName: populatedInterview.candidateId.name,
            jobTitle: populatedInterview.jobId.title,
            companyName: populatedInterview.jobId.company,
            date, time
        });
        return updatedInterview;
    }




const recruiterUpdateInterviewStatus = async ({
  recruiterId,
  interviewId,
  payload,
}: {
  recruiterId: string;
  interviewId: string;
  payload: {
    status: typeof INTERVIEW_STATUS.COMPLETED
        | typeof INTERVIEW_STATUS.CANCELLED;
    note?: string;
  };
}) => {
  const { status, note } = payload;

  if (!recruiterId || !interviewId) {
    throw new CustomError("Recruiter ID or Interview ID is missing", 400);
  }

  const interview = await interviewRepository.findById({ id: interviewId });

  if (!interview) {
    throw new CustomError("Interview not found", 404);
  }

  // 🔐 Authorization check
  if (interview.recruiterId.toString() !== recruiterId) {
    throw new CustomError("Unauthorized action", 403);
  }

  const allowedStatuses:InterviewStatus[] = [
    INTERVIEW_STATUS.COMPLETED,
  INTERVIEW_STATUS.CANCELLED,
  ];

  if (!allowedStatuses.includes(status)) {
    throw new CustomError("Invalid status update", 400);
  }

  await interviewRepository.updateById(interviewId, {
    status,
    $push: {
      statusHistory: {
        status,
        changedBy: recruiterId,
        changedAt: new Date(),
        note,
      },
    },
  });


  const updatedInterview = await interviewRepository.findById({
    id: interviewId,
    populate: [
      { path: "candidateId", select: "name email" },
      { path: "jobId", select: "title company" },
    ],
  });

  if (!updatedInterview) {
    throw new CustomError("Interview not found after update", 404);
  }

  const populatedInterview =
    updatedInterview as unknown as InterviewPopulated;

  await sendInterviewEmail(populatedInterview.status, {
    to: populatedInterview.candidateId.email,
    candidateName: populatedInterview.candidateId.name,
    jobTitle: populatedInterview.jobId.title,
    companyName: populatedInterview.jobId.company,
    reason: note,
  });

  return populatedInterview;
};

    return {
        recruiterGetInterviews,
        recruiterGetInterviewById,
        recruiterScheduleInterview,
        recruiterUpdateInterviewStatus
    }
}