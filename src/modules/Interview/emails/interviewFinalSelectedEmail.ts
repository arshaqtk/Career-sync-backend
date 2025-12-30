export const interviewFinalSelectedEmail = ({
  name,
  jobTitle,
  companyName,
  nextSteps,
}: {
  name: string
  jobTitle: string
  companyName: string
  nextSteps?: string
}) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.6">
      <h2 style="color:#16a34a">Congratulations! You’ve Been Selected</h2>

      <p>Dear ${name},</p>

      <p>
        We are pleased to inform you that you have been
        <strong>selected</strong> for the position of
        <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.
      </p>

      <p>
        Your performance during the interview process met our expectations,
        and we look forward to the possibility of working with you.
      </p>

      ${
        nextSteps
          ? `
            <div style="background:#f0fdf4;padding:12px;border-left:4px solid #22c55e">
              <strong>Next Steps:</strong><br/>
              ${nextSteps}
            </div>
          `
          : ""
      }

      <p style="margin-top:16px">
        Our recruitment team will contact you shortly with further details.
      </p>

      <p>
        Best regards,<br />
        <strong>${companyName} Recruitment Team</strong>
      </p>
    </div>
  `
}
