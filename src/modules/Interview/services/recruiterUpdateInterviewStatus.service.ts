import { CustomError } from "../../../shared/utils/customError";
import { INTERVIEW_STATUS, InterviewStatus } from "../types/interview.type";
import { InterviewPopulated } from "../types/interview.populated.type";
import { io } from "../../../server";
import { createNotificationService } from "../../notification/services/createNotification.service";
import { sendInterviewEmail } from "./interviewEmail.service";
import { InterviewRepository } from "../repository/interview.repository";

const interviewRepository = InterviewRepository();
 export const recruiterUpdateInterviewStatus = async ({
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
      throw new CustomError("unAuthorized User Not Found action", 403);
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
  await createNotificationService(io,{
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