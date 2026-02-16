import { ApplicationRepository } from "@/modules/applications/repository/application.repositories";
import { sendEmail } from "@/shared/email/email.service";
import { CustomError } from "@/shared/utils/customError";
import { interviewFinalSelectedEmail } from "../emails/interviewFinalSelectedEmail";
import { interviewFinalRejectedEmail } from "../emails/interviewFinalRejectedEmail";
import { createNotificationService } from "@/modules/notification/services/createNotification.service";
import { io } from "@/server";

const applicationRepository = ApplicationRepository();

export const finalizeCandidateService = async ({
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
        { path: "candidateId", select: "name email _id" },
        { path: "recruiterId", select: "recruiterData.companyName" },
        { path: "jobId", select: "title" },
      ],
    });

    if (!application) {
      throw new CustomError("Application not found", 404);
    }

    if (application.recruiterId._id.toString() !== recruiterId) {
      throw new CustomError("unAuthorized User Not Found action", 403);
    }


    // if (![ "Interview" ].includes(application.status)) {
    //   throw new CustomError("Invalid application state", 400);
    // }

    await applicationRepository.update(applicationId, {
      status: decision,
      decisionNote: note,
    });
    
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

    await createNotificationService(io,{
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