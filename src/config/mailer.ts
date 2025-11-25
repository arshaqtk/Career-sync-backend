import nodemailer from "nodemailer"
import { ENV } from "./env"


export const mailer=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:ENV.MAIL_USER,
        pass:ENV.MAIL_PASS
    }
})