import { ApplicationRepository } from "../../applications/repository/application.repositories";
import { InterviewRepository } from "../repository/interview.repository";
import { CustomError } from "../../../shared/utils/customError";
import { INTERVIEW_STATUS } from "../types/interview.type";
import { sendInterviewEmail } from "./interviewEmail.service";
import { createNotificationService } from "../../notification/services/createNotification.service";
import { io } from "../../../server";

  const interviewRepository = InterviewRepository();
  const applicationRepository = ApplicationRepository();
  
  
  export const recruiterRescheduleInterview = async ({
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

    const date = start.toISOString().split("T")[0];


const time = start.toISOString().split("T")[1].slice(0, 5);
 const populatedinterview = await interviewRepository.findById({
      id: interviewId,
      populate: [
        { path: "candidateId", select: "name email" },
        { path: "jobId", select: "company title" },
      ],
    });
     try {
         await sendInterviewEmail(INTERVIEW_STATUS.RESCHEDULED, {
           to: populatedinterview.candidateId.email,
           candidateName: populatedinterview.candidateId.name,
           jobTitle: populatedinterview.jobId.title,
           companyName: populatedinterview.jobId.company,
           date,
           time
         });
       } catch (err) {
         console.error("Interview schedule email failed:", err);
    
       }

 await createNotificationService(io,{
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