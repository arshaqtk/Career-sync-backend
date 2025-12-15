export const shortlistedTemplate = ({
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
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color:#0e8a50;">Good News, ${candidateName}!</h2>

    <p>
      Your application for the <strong>${jobTitle}</strong> position at 
      <strong>${companyName}</strong> has been 
      <strong style="color:#0e8a50;">shortlisted</strong>.
    </p>

    <p><strong>Job Details:</strong></p>
    <ul>
      <li><strong>Company:</strong> ${companyName}</li>
      <li><strong>Location:</strong> ${jobLocation}</li>
      <li><strong>Employment Type:</strong> ${employmentType}</li>
     
    </ul>

    <p>
      Our team was impressed by your background and will contact you soon with 
      next steps.
    </p>

    <br />
    <p>Warm regards,<br/>CareerSync Team</p>
  </div>
`;
