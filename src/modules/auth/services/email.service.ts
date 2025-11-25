// import { mailer } from "../../../config/mailer";
import { ENV } from "../../../config/env";
import { mailer } from "../../../config/mailer";

export const sendOtpEmail = async (email: string, otp: string) => {
    await mailer.sendMail({
    from:ENV.MAIL_FROM,
    to: email,
    subject: "Your OTP Verification Code",
    html: `
      <h2>Your OTP Code</h2>
      <p style="font-size: 20px; font-weight: bold;">${otp}</p>
      <p>This OTP is valid for 5 minutes.</p>
    `,
  });
};