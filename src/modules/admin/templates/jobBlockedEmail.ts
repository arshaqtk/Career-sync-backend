export const jobBlockedEmail = ({
  recruiterName,
  jobTitle,
  companyName,
  reason,
}: {
  recruiterName: string
  jobTitle: string
  companyName?: string
  reason: string
}) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.6">
      <h2 style="color:#dc2626">Job Listing Temporarily Restricted</h2>

      <p>Dear ${recruiterName},</p>

      <p>
        This email is to inform you that the following
        <strong>job listing</strong> on <strong>Career Sync</strong>
        has been <strong>temporarily blocked</strong>
        by the platform administrators.
      </p>

      <p>
        <strong>Job Title:</strong> ${jobTitle}<br />
        ${companyName ? `<strong>Organization:</strong> ${companyName}` : ""}
      </p>

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
        While this listing is restricted, you will not be able to:
      </p>

      <ul>
        <li>Receive new applications for this job</li>
        <li>View or manage existing applications</li>
        <li>Modify or republish the job post</li>
      </ul>

      <div style="
        background:#fff7ed;
        padding:12px;
        border-left:4px solid #f97316;
        margin-top:12px;
      ">
        Please review the job details and ensure compliance with
        our posting guidelines. The listing may be restored
        after review by the admin team.
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
