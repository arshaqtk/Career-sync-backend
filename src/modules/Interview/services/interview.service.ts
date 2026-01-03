import { CustomError } from "../../../shared/utils/customError"
import { RecruiterInterviewsDTO, RecruiterInterviewTimeLineDto } from "../dto/recruiter.allInterviews.dto"
import { InterviewDetails } from "../dto/recruiter.interviewDetail.dto"
import { InterviewRepository } from "../repository/interview.repository"
import { InterviewQuery } from "../types/interview.query.type"
import { INTERVIEW_STATUS, InterviewStatus } from "../types/interview.type"
import { ScheduleInterview } from "../types/interviewSchedule.type"
import { sendInterviewEmail } from "./interviewEmail.service"
import { InterviewPopulated } from "../types/interview.populated.type"
import { ApplicationRepository } from "../../../modules/applications/repository/application.repositories"
import { APPLICATION_STATUS } from "../../../modules/applications/types/applicationStatus.types"
import mongoose, { Types } from "mongoose"
import { CandidateInterviewsDTO } from "../dto/candidateInterviews.dto"
import { interviewFinalRejectedEmail } from "../emails/interviewFinalRejectedEmail"
import { sendEmail } from "../../../shared/email/email.service"
import { interviewFinalSelectedEmail } from "../emails/interviewFinalSelectedEmail"
import { createNotificationService } from "../../notification/services/createNotification.service"

const interviewRepository = InterviewRepository();
const applicationRepository = ApplicationRepository();

export const InterviewServices = () => {

  const recruiterGetInterviews = async (
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

    // ✅ status filter
    if (status && status !== "All") {
      filter.status = status;
    }

    // ✅ round type filter
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

    // ⚠️ Optional in-memory search (TEMP solution)
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



  const recruiterGetInterviewsByApplicationId = async ({ applicationId, recruiterId }: { applicationId: string, recruiterId?: string }): Promise<RecruiterInterviewTimeLineDto[]> => {
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


  const recruiterGetInterviewById = async (interviewId: string): Promise<InterviewDetails> => {

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
      location:interview.location,
      status: interview.status,
      statusHistory: interview.statusHistory,
      notes: interview.notes,
      mode: interview.mode
    }
  }



  //======================Schedule Interview ========================================


  const recruiterScheduleInterview = async ({
    recruiterId,applicationId,payload,scheduleMode, 
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


    // if (payload.mode === "Offline" && !payload.location) {
    //   throw new CustomError("Location required for offline interview", 400);
    // }

    // if (payload.mode === "Online" && !payload.meetingLink) {
    //   throw new CustomError("Meeting link required for online interview", 400);
    // }

    const start = new Date(payload.startTime);
    const end = new Date(payload.endTime);

    // if (end <= start) {
    //   throw new CustomError("End time must be after start time", 400);
    // }

    //  Next round specific rules
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
      candidateId: application.candidateId._id,
      applicationId,
      jobId: application.jobId._id,
      recruiterId: application.recruiterId._id,

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

  await   createNotificationService({
      recipientId:application.candidateId._id,
      senderId:application.recruiterId._id,
      entityId: interview._id,
      title:
  scheduleMode === "next_round"
    ? "Next Interview Round Scheduled"
    : "Interview Scheduled",

message:
  scheduleMode === "next_round"
    ? `Your next interview round for ${application.jobId.title} has been scheduled.`
    : `Your interview for ${application.jobId.title} has been scheduled.`,
type:"INTERVIEW_SCHEDULED",
    })

    return interview;
  };

//===============================RESECHDULE INTERVIEW=================================================================

  const recruiterRescheduleInterview = async ({
    recruiterId,   interviewId, payload,
  }: {
    recruiterId: string
    interviewId: string
    payload: {
      startTime: string
      endTime: string
      mode: "Online" | "Offline"
      meetingLink?: string
      location?: string
      reason?: string
    }
  }) => {
    if (!recruiterId || !interviewId) {
      throw new CustomError("Recruiter ID or Interview ID missing", 400)
    }

    const interview = await interviewRepository.findOne({ _id: interviewId })

    if (!interview) {
      throw new CustomError("Interview not found", 404)
    }

    if (interview.recruiterId.toString() !== recruiterId) {
      throw new CustomError("Access denied", 403)
    }

  
    if (interview.status == INTERVIEW_STATUS.COMPLETED) {
      throw new CustomError(
        "Only scheduled interviews can be rescheduled",
        400
      )
    }

    // Mode validation
    if (payload.mode === "Offline" && !payload.location) {
      throw new CustomError("Location required for offline interview", 400)
    }

    if (payload.mode === "Online" && !payload.meetingLink) {
      throw new CustomError("Meeting link required for online interview", 400)
    }

    const start = new Date(payload.startTime)
    const end = new Date(payload.endTime)

    if (end <= start) {
      throw new CustomError("End time must be after start time", 400)
    }

    // Update interview
    interview.startTime = start
    interview.endTime = end
    interview.mode = payload.mode
    interview.meetingLink =
      payload.mode === "Online" ? payload.meetingLink : undefined
    interview.location =
      payload.mode === "Offline" ? payload.location : undefined

    interview.statusHistory?.push({
      status: INTERVIEW_STATUS.RESCHEDULED,
      changedBy: recruiterId,
      changedAt: new Date(),
      note: payload.reason || "Interview rescheduled",
      roundNumber: interview.roundNumber,
    })

    await interview.save()

 await createNotificationService({
  recipientId: interview.candidateId,
  senderId: interview.recruiterId,

  type: "INTERVIEW_RESCHEDULED",

  title: "Interview Rescheduled",

  message: payload.reason
    ? `Your interview has been rescheduled. Reason: ${payload.reason}`
    : "Your interview schedule has been updated.",

  entityType: "interview",
  entityId: interview._id,
})
    return interview
  }


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
      notes?: string;
      roundNumber: number;
    };

  }) => {
    let { status, notes, roundNumber } = payload;
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
              notes
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

      if (
  status === INTERVIEW_STATUS.COMPLETED ||
  status === INTERVIEW_STATUS.CANCELLED
) {
  await createNotificationService({
    recipientId: populatedInterview.candidateId._id,
    senderId: populatedInterview.recruiterId,

    type:
      status === INTERVIEW_STATUS.COMPLETED
        ? "INTERVIEW_COMPLETED"
        : "INTERVIEW_CANCELLED",

    title:
      status === INTERVIEW_STATUS.COMPLETED
        ? "Interview Completed"
        : "Interview Cancelled",

    message:
      status === INTERVIEW_STATUS.COMPLETED
        ? `Your interview for ${populatedInterview.jobId.title} has been completed.`
        : notes
        ? `Your interview for ${populatedInterview.jobId.title} was cancelled. Reason: ${notes}`
        : `Your interview for ${populatedInterview.jobId.title} was cancelled.`,

    entityType: "interview",
    entityId: populatedInterview._id,
  })
}

    try {
      await sendInterviewEmail(status, {
        to: populatedInterview.candidateId.email,
        candidateName: populatedInterview.candidateId.name,
        jobTitle: populatedInterview.jobId.title,
        companyName: populatedInterview.jobId.company,
        reason: notes,
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
    decision: "Selected" | "Rejected";
    note?: string;
  }) => {

    const application = await applicationRepository.findById({
      id: applicationId, populate: [
        { path: "candidateId", select: "name email" },
        { path: "recruiterId", select: "recruiterData.companyName" },
        { path: "jobId", select: "title" },
      ],
    });

    if (!application) {
      throw new CustomError("Application not found", 404);
    }

    if (application.recruiterId._id.toString() !== recruiterId) {
      throw new CustomError("Unauthorized action", 403);
    }
    console.log()

    // if (![ "Interview" ].includes(application.status)) {
    //   throw new CustomError("Invalid application state", 400);
    // }

    await applicationRepository.update(applicationId, {
      status: decision,
      decisionNote: note,
    });
    console.log(application.candidateId)
    if (decision === "Selected") {
      await sendEmail({
        to: application.candidateId.email,
        subject: "Interview Result – You’ve Been Selected",
        html: interviewFinalSelectedEmail({
          name: application.candidateId.name,
          jobTitle: application.jobId.title,
          companyName: application.recruiterId.recruiterData?.companyName,
          nextSteps: "Our HR team will reach out for offer letter and documentation.",
        }),
      })
    }

    if (decision === "Rejected") {
      await sendEmail({
        to: application.candidateId.email,
        subject: "Interview Outcome – Career Sync",
        html: interviewFinalRejectedEmail({
          name: application.candidateId.name,
          jobTitle: application.jobId.title,
          companyName: application.recruiterId.recruiterData?.companyName,
        }),
      })
    }

    await createNotificationService({
  recipientId: application.candidateId._id,
  senderId: application.recruiterId._id,

  type:
    decision === "Selected"
      ? "CANDIDATE_SELECTED"
      : "CANDIDATE_REJECTED",

  title:
    decision === "Selected"
      ? "Congratulations! You’re Selected"
      : "Interview Result",

  message:
    decision === "Selected"
      ? `You have been selected for the ${application.jobId.title} role at ${application.recruiterId.recruiterData?.companyName}.`
      : `Thank you for attending the interview for ${application.jobId.title}. Unfortunately, you were not selected.`,

  entityType: "job",
  entityId: application.jobId._id,
})

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


  return {
    recruiterGetInterviews,
    recruiterGetInterviewsByApplicationId,
    recruiterGetInterviewById,
    recruiterScheduleInterview,
    recruiterRescheduleInterview,
    recruiterUpdateInterviewStatus,
    candidateGetInterviews,
    candidateGetInterviewById,
    finalizeCandidateService,
  }
}