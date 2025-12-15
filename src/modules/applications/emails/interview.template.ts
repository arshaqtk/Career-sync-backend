export const interviewTemplate = ({
  candidateName,
  jobTitle,
  companyName,
  jobLocation,
  employmentType,
}: {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  jobLocation: string;
  employmentType?: string;
  
}) => `
  <div style="font-family: Arial, sans-serif; color:#333;">
    <h2 style="color:#0057D9;">Great News, ${candidateName}!</h2>

    <p>
      Your application for the <strong>${jobTitle}</strong> position at 
      <strong>${companyName}</strong> has progressed to the 
      <strong>Interview Stage</strong>.
    </p>

    <p><strong>Job Details:</strong></p>
    <ul>
      <li><strong>Company:</strong> ${companyName}</li>
      <li><strong>Location:</strong> ${jobLocation}</li>
      <li><strong>Employment Type:</strong> ${employmentType}</li>
    </ul>

    <p>
      A recruiter will contact you soon to schedule the interview.
      Please keep your email and phone reachable.
    </p>

    <br />
    <p>Looking forward to speaking with you,<br/>CareerSync Team</p>
  </div>
`;
