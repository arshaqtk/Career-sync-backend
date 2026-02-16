type emailPayload={
  interviewerName: string;
  candidateName: string;
  jobTitle: string;
  companyName: string;
  date: string;
  time: string;
  meetingLink: string;
}

export const interviewerScheduledTemplate = ({
  interviewerName,
  candidateName,
  jobTitle,
  companyName,
  date,
  time,
  meetingLink,
}: emailPayload) => ({
  subject: `New Interview Scheduled with ${candidateName} – ${jobTitle}`,
  html: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 24px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">

      <h2 style="margin-top: 0; color: #1a73e8;">
        📅 Interview Scheduled
      </h2>

      <p>Hi <b>${interviewerName}</b>,</p>

      <p>An interview has been scheduled with the following details:</p>

      <div style="background: #f8f9fa; padding: 16px; border-radius: 6px; margin: 16px 0;">
        <p style="margin: 6px 0;"><b>👤 Candidate:</b> ${candidateName}</p>
        <p style="margin: 6px 0;"><b>💼 Position:</b> ${jobTitle}</p>
        <p style="margin: 6px 0;"><b>🏢 Company:</b> ${companyName}</p>
        <p style="margin: 6px 0;"><b>📆 Date:</b> ${date}</p>
        <p style="margin: 6px 0;"><b>⏰ Time:</b> ${time}</p>
      </div>

      <div style="text-align: center; margin: 20px 0;">
        <a href="${meetingLink}" 
           style="background-color: #1a73e8; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          🔗 Join Meeting
        </a>
      </div>

      <div style="text-align: center; margin-top: 10px;">
        <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Interview+with+${candidateName}&dates=${date}T${time}"
           style="color: #1a73e8; text-decoration: none; font-size: 14px;">
          ➕ Add to Calendar
        </a>
      </div>

      <p style="margin-top: 30px; font-size: 14px; color: #555;">
        Please ensure you are available and join the meeting on time.
      </p>

      <hr style="margin: 20px 0;" />

      <p style="font-size: 13px; color: #888;">
        Best regards,<br/>
        ${companyName} Hiring Team
      </p>

    </div>
  </div>
  `,
});
