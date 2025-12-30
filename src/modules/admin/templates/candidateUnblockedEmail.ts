export const candidateUnblockedEmail = ({
  name,
}: {
  name: string
}) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.6">
      <h2 style="color: #16a34a;">Account Access Restored</h2>

      <p>Dear ${name},</p>

      <p>
        We’re happy to inform you that your <strong>Career Sync account</strong>
        has been <strong>successfully unblocked</strong>.
      </p>

      <p>
        You can now log in and continue using all platform features,
        including job applications and interview scheduling.
      </p>

      <p style="background:#f0fdf4;padding:12px;border-left:4px solid #22c55e">
        Please make sure to follow our community guidelines to avoid
        any future restrictions.
      </p>

      <p>
        If you have any questions or need assistance,
        feel free to contact our support team.
      </p>

      <p>
        Best regards,<br />
        <strong>Career Sync Team</strong>
      </p>
    </div>
  `
}
