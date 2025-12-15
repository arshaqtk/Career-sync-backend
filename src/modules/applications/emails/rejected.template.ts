export const rejectedTemplate = ({
  candidateName,
  jobTitle,
  companyName,
  jobLocation,
  employmentType
}: {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  jobLocation: string;
  employmentType?: string;
}) => `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2>Hello ${candidateName},</h2>

    <p>
      Thank you for applying for the <strong>${jobTitle}</strong> role at 
      <strong>${companyName}</strong>.
    </p>

    <p>
      After reviewing your profile, we regret to inform you that we will not 
      be moving forward with your application for this position.
    </p>

    <p><strong>Job Summary:</strong></p>
    <ul>
      <li><strong>Company:</strong> ${companyName}</li>
      <li><strong>Location:</strong> ${jobLocation}</li>
      <li><strong>Employment Type:</strong> ${employmentType}</li>
    </ul>

    <p>
      We appreciate your interest and encourage you to apply to future openings 
      that match your skills.
    </p>

    <br />
    <p>Best regards,<br/>CareerSync Team</p>
  </div>
`;
