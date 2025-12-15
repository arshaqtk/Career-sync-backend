export const genericStatusUpdateTemplate = ({
  candidateName,
  jobTitle,
  companyName,
  jobLocation,
  employmentType,
  newStatus
}: {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  jobLocation: string;
  employmentType?: string;
  newStatus: string;
}) => `
  <div style="font-family: Arial, sans-serif; color:#333;">
    <h2>Hello ${candidateName},</h2>

    <p>
      The status of your job application for <strong>${jobTitle}</strong> at 
      <strong>${companyName}</strong> has been updated.
    </p>

    <p>
      <strong>New Status:</strong> ${newStatus}
    </p>

    <p><strong>Job Summary:</strong></p>
    <ul>
      <li><strong>Company:</strong> ${companyName}</li>
      <li><strong>Location:</strong> ${jobLocation}</li>
      <li><strong>Employment Type:</strong> ${employmentType}</li>
    </ul>

    <br />
    <p>Regards,<br/>CareerSync Team</p>
  </div>
`;
