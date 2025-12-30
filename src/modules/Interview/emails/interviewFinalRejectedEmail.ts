export const interviewFinalRejectedEmail = ({
  name,
  jobTitle,
  companyName,
}: {
  name: string
  jobTitle: string
  companyName: string
}) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.6">
      <h2 style="color:#dc2626">Interview Outcome Update</h2>

      <p>Dear ${name},</p>

      <p>
        Thank you for taking the time to interview for the
        <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.
      </p>

      <p>
        After careful consideration, we regret to inform you that
        you have not been selected for this role at this time.
      </p>

      <div style="background:#f9fafb;padding:12px;border-left:4px solid #9ca3af">
        This decision was based on overall interview evaluation and current
        role requirements, and does not reflect negatively on your skills
        or experience.
      </div>

      <p style="margin-top:16px">
        We encourage you to apply for future opportunities that match
        your profile.
      </p>

      <p>
        Wishing you every success in your job search.<br />
        <strong>${companyName} Recruitment Team</strong>
      </p>
    </div>
  `
}
