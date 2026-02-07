import { ENV } from "../../../config/env";
import { shortlistedTemplate, rejectedTemplate, interviewTemplate, genericStatusUpdateTemplate } from "../emails/index";
import { mailer } from "../../../config/mailer";
import { ApplicationStatus } from "../types/applicationStatus.types";

const templates = {
  Pending: genericStatusUpdateTemplate,
  Shortlisted: shortlistedTemplate,
  Rejected: rejectedTemplate,
  Interview: interviewTemplate
};

export const sendApplicationStatusUpdateEmail = async ({
  email,
  candidateName,
  jobTitle,
  companyName,
  jobLocation,
  employmentType,
  newStatus
}: {
  email: string;
  candidateName: string;
  jobTitle: string;
  companyName: string;
  jobLocation: string;
  employmentType?: string;
  newStatus: Exclude<ApplicationStatus,"Viewed">;
}) => {
  
  const templateFn =
    templates[newStatus] || genericStatusUpdateTemplate;

  const html = templateFn({
    candidateName,
    jobTitle,
    companyName,
    jobLocation,
    employmentType,
    newStatus
  });

  await mailer.sendMail({
    from: ENV.MAIL_FROM,
    to: email,
    subject: `Update on Your Application – ${jobTitle} at ${companyName}`,
    html
  });
};
