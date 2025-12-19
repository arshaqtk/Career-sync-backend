
export const interviewRescheduledTemplate = ({
  candidateName,
  jobTitle,
  companyName,
  newDate,
  newTime,
}: {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  newDate: string;
  newTime: string;

}) => ({
  subject: `Interview Rescheduled – ${jobTitle}`,
  html: `
    <p>Hi ${candidateName},</p>

    <p>Your interview for <b>${jobTitle}</b> has been rescheduled.</p>

    <p><b>New Date:</b> ${newDate}<br/>
       <b>New Time:</b> ${newTime}</p>

   

    <p>We apologize for the inconvenience.</p>

    <p>Best regards,<br/>${companyName} Recruitment Team</p>
  `,
});
