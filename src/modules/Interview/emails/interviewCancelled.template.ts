
export const interviewCancelledTemplate = ({
  candidateName,
  jobTitle,
  companyName,
  reason,
}: {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  reason?: string;
}) => ({
  subject: `Interview Cancelled – ${jobTitle}`,
  html: `
    <p>Hi ${candidateName},</p>

    <p>We regret to inform you that your interview for <b>${jobTitle}</b> at <b>${companyName}</b> has been cancelled.</p>

    ${
      reason ? `<p><b>Reason:</b> ${reason}</p>` : ""
    }

    <p>Thank you for your interest and time.</p>

    <p>Best regards,<br/>${companyName} Recruitment Team</p>
  `,
});
