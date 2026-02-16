import { sendEmail } from "../../../shared/email/email.service";
import {
  interviewScheduledTemplate,
  interviewRescheduledTemplate,
  interviewCancelledTemplate,
  interviewCompletedTemplate,
} from "../emails";
import { interviewerScheduledTemplate } from "../emails/interviewerScheduled.template";
import { INTERVIEW_STATUS, InterviewStatus } from "../types/interview.type"; 

type InterviewEmailPayload = {
  to: string;
  candidateName: string;
  jobTitle: string;
  companyName: string;
  date?: string;
  time?: string;
  meetingLink?: string;
  reason?: string;
  interviewerName?:string;
};

export const sendInterviewEmail = async (
  status: InterviewStatus,
  payload: InterviewEmailPayload
) => {
  let email;

  switch (status) {
    case INTERVIEW_STATUS.SCHEDULED:
      email = interviewScheduledTemplate(payload as any);
      break;
      

    case INTERVIEW_STATUS.RESCHEDULED:
      email = interviewRescheduledTemplate({
        candidateName: payload.candidateName,
        jobTitle: payload.jobTitle,
        companyName: payload.companyName,
        newDate: payload.date!,
        newTime: payload.time!,
      });
      break;

    case INTERVIEW_STATUS.CANCELLED:
      email = interviewCancelledTemplate(payload);
      break;

    case INTERVIEW_STATUS.COMPLETED:
      email = interviewCompletedTemplate(payload);
      break;

    default:
      return;
  }

  await sendEmail({
    to: payload.to,
    subject: email.subject,
    html: email.html,
  });
};