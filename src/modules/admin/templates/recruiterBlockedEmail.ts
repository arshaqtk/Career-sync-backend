export const recruiterBlockedEmail = ({
  name,
  companyName,
  reason,
}: {
  name: string
  companyName?: string
  reason: string
}) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.6">
      <h2 style="color:#dc2626">Recruiter Account Temporarily Restricted</h2>

      <p>Dear ${name},</p>

      <p>
        This email is to inform you that your <strong>recruiter account</strong>
        on <strong>Career Sync</strong> has been <strong>temporarily blocked</strong>
        by the platform administrators.
      </p>

      ${
        companyName
          ? `<p><strong>Organization:</strong> ${companyName}</p>`
          : ""
      }

      <p>
        <strong>Reason for restriction:</strong>
      </p>

      <blockquote style="
        background:#fef2f2;
        padding:12px;
        border-left:4px solid #dc2626;
        margin:10px 0;
      ">
        ${reason}
      </blockquote>

      <p>
        During this period, you will not be able to:
      </p>

      <ul>
        <li>Post or manage job listings</li>
        <li>View or process candidate applications</li>
        <li>Schedule or conduct interviews</li>
      </ul>

      <div style="
        background:#fff7ed;
        padding:12px;
        border-left:4px solid #f97316;
        margin-top:12px;
      ">
        Please review and ensure compliance with our platform policies.
        Access may be restored after verification by the admin team.
      </div>

      <p style="margin-top:16px">
        If you believe this action was taken in error or wish to
        request a review, please contact our support team.
      </p>

      <p>
        Regards,<br />
        <strong>Career Sync Admin Team</strong>
      </p>
    </div>
  `
}
