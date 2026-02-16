import { CustomError } from "@/shared/utils/customError";
import { ScheduleInterview } from "../types/interviewSchedule.type";
import { INTERVIEW_STATUS } from "../types/interview.type";
import { APPLICATION_STATUS } from "@/modules/applications/types/applicationStatus.types";
import { sendInterviewEmail } from "./interviewEmail.service";
import { interviewerScheduledTemplate } from "../emails/interviewerScheduled.template";
import { sendEmail } from "@/shared/email/email.service";
import { createNotificationService } from "@/modules/notification/services/createNotification.service";
import { InterviewRepository } from "../repository/interview.repository";
import { ApplicationRepository } from "@/modules/applications/repository/application.repositories";
import { io } from "@/server";


const interviewRepository = InterviewRepository();
const applicationRepository = ApplicationRepository();


export const recruiterScheduleInterview = async ({
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
interviewerEmail:payload.interviewerEmail??undefined,
interviewerName:payload.interviewerName??undefined,
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

    const date = start.toISOString().split("T")[0];


const time = start.toISOString().split("T")[1].slice(0, 5);

     try {

         await sendInterviewEmail(INTERVIEW_STATUS.SCHEDULED, {
           to: application.candidateId.email,
           candidateName: application.candidateId.name,
           jobTitle: application.jobId.title,
           companyName: application.jobId.company,
           date,
           time
         });
       } catch (err) {
         console.error("Interview schedule email failed:", err);
    
       }
if(payload.interviewerEmail){
  try {
    const email= interviewerScheduledTemplate({
       candidateName:application.candidateId.name,
       companyName:application.jobId.company,
       date,
       interviewerName:payload.interviewerName!,
       jobTitle:application.jobId.title,
       meetingLink:payload.meetingLink!,
       time,
      });
      await sendEmail({
          to: payload.interviewerEmail,
          subject: email.subject,
          html: email.html,
        });
 } catch (err) {
   console.error("Interview schedule email failed:", err);

 }
}

  await   createNotificationService(io,{
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