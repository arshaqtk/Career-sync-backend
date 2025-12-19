import { ENV } from "../../config/env";
import { mailer } from "../../config/mailer";
import { SendEmailPayload } from "./email.types";
import { CustomError } from "../utils/customError";

export const sendEmail = async ({
  to,
  subject,
  html,
}:SendEmailPayload) => {
  try {
    return await mailer.sendMail({
      from: ENV.MAIL_FROM,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new CustomError("Failed to send email");
  }
};