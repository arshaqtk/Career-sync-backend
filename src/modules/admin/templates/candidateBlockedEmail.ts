export const candidateBlockedEmail = ({
  name,
  reason,
}: {
  name: string
  reason: string
}) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.6">
      <h2>Account Access Restricted</h2>
      <p>Dear ${name},</p>

      <p>
        Your account has been <strong>blocked by the admin</strong> due to the following reason:
      </p>

      <blockquote style="background:#f5f5f5;padding:10px;border-left:4px solid red">
        ${reason}
      </blockquote>

      <p>
        If you believe this is a mistake or need clarification,
        please contact our support team.
      </p>

      <p>
        Regards,<br />
        <strong>Career Sync Team</strong>
      </p>
    </div>
  `
}