export const jobUnblockedEmail = ({
  recruiterName,
  jobTitle,
  companyName,
}: {
  recruiterName: string
  jobTitle: string
  companyName?: string
}) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.6">
      <h2 style="color:#16a34a">Job Listing Restored</h2>

      <p>Dear ${recruiterName},</p>

      <p>
        We’re happy to inform you that the following
        <strong>job listing</strong> on <strong>Career Sync</strong>
        has been <strong>successfully restored</strong>
        and is now active on the platform.
      </p>

      <p>
        <strong>Job Title:</strong> ${jobTitle}<br />
        ${companyName ? `<strong>Organization:</strong> ${companyName}` : ""}
      </p>

      <div style="
        background:#f0fdf4;
        padding:12px;
        border-left:4px solid #16a34a;
        margin:12px 0;
      ">
        You can now:
        <ul style="margin:8px 0 0 16px">
          <li>Receive and manage candidate applications</li>
          <li>Update job details if required</li>
          <li>Continue the hiring process</li>
        </ul>
      </div>

      <p style="margin-top:16px">
        Thank you for your cooperation and for ensuring
        compliance with our platform guidelines.
      </p>

      <p>
        If you have any questions or need further assistance,
        feel free to contact our support team.
      </p>

      <p>
        Regards,<br />
        <strong>Career Sync Admin Team</strong>
      </p>
    </div>
  `
}
