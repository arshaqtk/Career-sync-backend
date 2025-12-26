import path from "path"
import { CustomError } from "../../../shared/utils/customError"
import { RecruiterInterviewsDTO, RecruiterInterviewTimeLineDto } from "../dto/recruiter.allInterviews.dto"
import { InterviewDetails } from "../dto/recruiter.interviewDetail.dto"
import { InterviewRepository } from "../repository/interview.repository"
import { InterviewQuery } from "../types/interview.query.type"
import { INTERVIEW_STATUS, InterviewStatus } from "../types/interview.type"
import { ScheduleInterview } from "../types/interviewSchedule.type"
import { sendInterviewEmail } from "./interviewEmail.service"
import { formatInterviewDateTime } from "../../../shared/utils/dateFormatter"
import { InterviewPopulated } from "../types/interview.populated.type"
import { ApplicationRepository } from "../../../modules/applications/repository/application.repositories"
import { APPLICATION_STATUS } from "../../../modules/applications/types/applicationStatus.types"
import mongoose, { Types } from "mongoose"
import { CandidateInterviewsDTO } from "../dto/candidateInterviews.dto"
import { InterviewModel } from "../models/interview.model"

const interviewRepository = InterviewRepository();
const applicationRepository = ApplicationRepository();

export const InterviewServices = () => {

    const recruiterGetInterviews = async (recruiterId: string, query: InterviewQuery): Promise<RecruiterInterviewsDTO[]> => {
        if (!recruiterId) throw new CustomError("Required identifier not found", 400);

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
        console.log(recruiterId)
        const interviews = await interviewRepository.findLatestByActor({
            actorField: "recruiterId",
            actorId: recruiterId,
            filter,
            populate: [
                { path: "candidateId", select: "name" },
                { path: "jobId", select: "title" },
            ],
            sort: { createdAt: sortOrder },
            skip,
            limit: Number(limit),
        });

        console.log(interviews)

        return interviews.map((interview) => ({
            id: interview._id.toString(),
            candidateName: (interview.candidateId as any).name,
            jobTitle: (interview.jobId as any).title,
            roundType: interview.roundType,
            roundNumber: interview.roundNumber,
            status: interview.status,
            createdAt: interview.createdAt,
        }))

    }


const recruiterGetInterviewsByApplicationId = async ({applicationId,recruiterId}:{applicationId: string, recruiterId?: string}): Promise<RecruiterInterviewTimeLineDto[]> => {
  if (!applicationId) {
    throw new CustomError("ApplicationId is required", 400);
  }

  const filter: Record<string, any> = {
    applicationId:new Types.ObjectId(applicationId),
  };


  if (recruiterId) {
    filter.recruiterId =new Types.ObjectId(recruiterId)
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
    endTime:interview.endTime,
    startTime:interview.startTime,
    durationMinutes:interview.durationMinutes,
    mode:interview.mode,
    notes:interview.notes,
    statusHistory:interview.statusHistory,
    createdAt: interview.createdAt,
  }));
};


    const recruiterGetInterviewById = async (interviewId: string): Promise<InterviewDetails> => {
        console.log(interviewId)
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
            applicationId:interview.applicationId.toString(),
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
            roundNumber: interview.roundNumber,
            startTime: interview.startTime?.toString(),
            endTime: interview.endTime?.toString(),
            meetingLink: interview.meetingLink,
            status: interview.status,
            statusHistory: interview.statusHistory,
            notes: interview.notes,
            mode: interview.mode
        }
    }

    const recruiterScheduleInterview = async ({
        recruiterId,
        applicationId,
        payload,
        scheduleMode, // "initial" | "next_round"
    }: {
        recruiterId: string;
        applicationId: string;
        payload: ScheduleInterview;
        scheduleMode: "initial" | "next_round";
    }) => {

        if (!recruiterId || !applicationId) {
            throw new CustomError("Recruiter ID or application ID missing", 400);
        }

        const application = await applicationRepository.findById({
            id: applicationId,
            populate: [
                { path: "candidateId", select: "name email" },
                { path: "jobId", select: "company title" },
            ],
        });

        if (!application) throw new CustomError("Application not found", 404);

        if (application.recruiterId.toString() !== recruiterId) {
            throw new CustomError("Access denied", 403);
        }


        if (payload.mode === "Offline" && !payload.location) {
            throw new CustomError("Location required for offline interview", 400);
        }

        if (payload.mode === "Online" && !payload.meetingLink) {
            throw new CustomError("Meeting link required for online interview", 400);
        }

        const start = new Date(payload.startTime);
        const end = new Date(payload.endTime);

        if (end <= start) {
            throw new CustomError("End time must be after start time", 400);
        }

        // 🔹 Next round specific rules
        if (scheduleMode === "next_round") {
            const lastInterview =
                await interviewRepository.findLatestRound(applicationId);

            if (!lastInterview) {
                throw new CustomError("No previous interview found", 400);
            }

            if (lastInterview.status !== INTERVIEW_STATUS.COMPLETED) {
                throw new CustomError(
                    "Previous round must be completed",
                    400
                );
            }

            if (payload.roundNumber !== lastInterview.roundNumber + 1) {
                throw new CustomError("Invalid next round number", 400);
            }
        }

        //  Initial scheduling rule
        if (scheduleMode === "initial" && payload.roundNumber !== 1) {
            throw new CustomError("Initial interview must be round 1", 400);
        }

        await applicationRepository.update(applicationId, {
            status: APPLICATION_STATUS.INTERVIEW,
        });

        const interview = await interviewRepository.create({
            candidateId: application.candidateId,
            applicationId,
            jobId: application.jobId,
            recruiterId: application.recruiterId,

            startTime: start,
            endTime: end,
            roundNumber: payload.roundNumber,
            roundType: payload.roundType,
            mode: payload.mode,
            meetingLink:
                payload.mode === "Online" ? payload.meetingLink : undefined,
            location:
                payload.mode === "Offline" ? payload.location : undefined,

            status: INTERVIEW_STATUS.SCHEDULED,
            statusHistory: [
                {
                    status: INTERVIEW_STATUS.SCHEDULED,
                    changedBy: recruiterId,
                    changedAt: new Date(),
                    note:
                        scheduleMode === "next_round"
                            ? "Next round scheduled"
                            : "Interview scheduled",
                    roundNumber: payload.roundNumber,
                },
            ],
        });

        return interview;
    };


    //------------------------Update interview  Status----------------------------------------------
    const recruiterUpdateInterviewStatus = async ({
        recruiterId,
        interviewId,
        payload,
    }: {
        recruiterId: string;
        interviewId: string;
        payload: {
            status:
            | typeof INTERVIEW_STATUS.COMPLETED
            | typeof INTERVIEW_STATUS.CANCELLED
            | typeof INTERVIEW_STATUS.IN_PROGRESS;
            note?: string;
            roundNumber: number;
        };

    }) => {
        let { status, note, roundNumber } = payload;
        if (!recruiterId || !interviewId) {
            throw new CustomError("Recruiter ID or Interview ID is missing", 400);
        }

        const interview = await interviewRepository.findById({ id: interviewId });

        if (!interview) {
            throw new CustomError("Interview not found", 404);
        }

        if (interview.recruiterId.toString() !== recruiterId) {
            throw new CustomError("Unauthorized action", 403);
        }
       

        const allowedStatuses: InterviewStatus[] = [
            INTERVIEW_STATUS.COMPLETED,
            INTERVIEW_STATUS.CANCELLED,
            INTERVIEW_STATUS.IN_PROGRESS
        ];

        if (!allowedStatuses.includes(status)) {
            throw new CustomError("Invalid status update", 400);
        }





        const updatedInterview = await interviewRepository.updateByIdAndPopulate(
            interviewId,
            {
                updateData: {
                    status,
                    $push: {
                        statusHistory: {
                            roundNumber,
                            status,
                            changedBy: recruiterId,
                            changedAt: new Date(),
                            note,
                        },
                    },
                },
                populate: [
                    { path: "candidateId", select: "name email" },
                    { path: "jobId", select: "title company" },
                ],
            }
        );




        if (!updatedInterview) {
            throw new CustomError("Interview not found after update", 404);
        }

        const populatedInterview =
            updatedInterview as unknown as InterviewPopulated;

        try {
            await sendInterviewEmail(status, {
                to: populatedInterview.candidateId.email,
                candidateName: populatedInterview.candidateId.name,
                jobTitle: populatedInterview.jobId.title,
                companyName: populatedInterview.jobId.company,
                reason: note,
            });
        } catch (err) {
            console.error("Interview email failed:", err);

        }


        return populatedInterview;
    };

    //-----------------------Finalize interview  Status----------------------------------------------------

    const finalizeCandidateService = async ({
  recruiterId,
  applicationId,
  decision,
  note,
}: {
  recruiterId: string;
  applicationId: string;
  decision: "Selected"|"Rejected";
  note?: string;
}) => {

  const application = await applicationRepository.findById({id:applicationId});

  if (!application) {
    throw new CustomError("Application not found", 404);
  }

  if (application.recruiterId.toString() !== recruiterId) {
    throw new CustomError("Unauthorized action", 403);
  }
  

  if (![ "Interview" ].includes(application.status)) {
    throw new CustomError("Invalid application state", 400);
  }

  await applicationRepository.update(applicationId, {
    status: decision,
    decisionNote: note,
  });

  return { success: true };
};




//-----------------------------------CANDIDATE-------------------------------------------------------------------

const candidateGetInterviews = async (
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
      companyName:(interview.jobId as any)?.company,
      mode:interview.mode||"Online",
      startTime: interview.startTime?.toISOString(),
      endTime: interview.endTime?.toISOString(),
      meetingLink: interview.meetingLink,
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

const candidateGetInterviewById = async (
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
    durationMinutes: item.durationMinutes,
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


    return {
        recruiterGetInterviews,
        recruiterGetInterviewsByApplicationId,
        recruiterGetInterviewById,
        recruiterScheduleInterview,
        recruiterUpdateInterviewStatus,
        candidateGetInterviews,
        candidateGetInterviewById,
        finalizeCandidateService
    }
}