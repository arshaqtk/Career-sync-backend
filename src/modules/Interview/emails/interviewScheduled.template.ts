
export const interviewScheduledTemplate = ({
  candidateName,
  jobTitle,
  companyName,
  date,
  time,
}: {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  date: string;
  time: string;
}) => ({
  subject: `Interview Scheduled – ${jobTitle} at ${companyName}`,
  html: `
    <p>Hi ${candidateName},</p>

    <p>Your interview for the position of <b>${jobTitle}</b> at <b>${companyName}</b> has been scheduled.</p>

    <p><b>Date:</b> ${date}<br/>
       <b>Time:</b> ${time}</p>


    <p>Please be prepared and join on time.</p>

    <p>Best regards,<br/>${companyName} Recruitment Team</p>
  `,
});
