export const recruiterUnblockedEmail = ({
  name,
  companyName,
}: {
  name: string
  companyName?: string
}) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.6">
      <h2 style="color:#16a34a">Recruiter Account Reactivated</h2>

      <p>Dear ${name},</p>

      <p>
        We’re writing to inform you that your recruiter account on
        <strong>Career Sync</strong> has been <strong>successfully unblocked</strong>.
      </p>

      ${
        companyName
          ? `<p><strong>Organization:</strong> ${companyName}</p>`
          : ""
      }

      <p>
        You now have full access to recruiter features, including:
      </p>

      <ul>
        <li>Posting and managing job listings</li>
        <li>Reviewing candidate applications</li>
        <li>Scheduling and managing interviews</li>
      </ul>

      <div style="background:#f0fdf4;padding:12px;border-left:4px solid #22c55e">
        Please ensure continued compliance with platform policies
        to avoid future account restrictions.
      </div>

      <p style="margin-top:16px">
        If you have any questions or need assistance, feel free to
        contact our support team.
      </p>

      <p>
        Regards,<br />
        <strong>Career Sync Admin Team</strong>
      </p>
    </div>
  `
}
