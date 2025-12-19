export const interviewCompletedTemplate = ({
  candidateName,
  jobTitle,
  companyName,
}: {
  candidateName: string;
  jobTitle: string;
  companyName: string;
}) => ({
  subject: `Interview Completed – ${jobTitle}`,
  html: `
    <p>Hi ${candidateName},</p>

    <p>Thank you for attending the interview for <b>${jobTitle}</b> at <b>${companyName}</b>.</p>

    <p>Our team will review your performance and get back to you soon.</p>

    <p>Best regards,<br/>${companyName} Recruitment Team</p>
  `,
});
