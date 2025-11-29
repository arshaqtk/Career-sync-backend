import { generateOtp } from "../../../utils/generateOtp";
import { sendResetOtpEmail } from "./email.service";
import { saveResetOtp, verifyResetOtp } from "./otp.service";
import { ResetPasswordDTO } from "../types/resetPassword.types";
import bcrypt from "bcryptjs"
import { AuthRepository } from "../repository/auth.repository";
import redis from "../../../config/redis";



export const passWordService = {
    sendForgetPasswordOtp: async (email: string) => {

        const user = await AuthRepository.findByEmail(email)
        if (user) {
            const otp = generateOtp()

            await saveResetOtp(email, otp)

            await sendResetOtpEmail(email, otp)
        }

        return { message: "A reset otp has been processed. Please check your email." }
    },
    verifyResetOtp: async (email: string, otp: string) => {
        return await verifyResetOtp(email, otp);
    },
    resetPassword: async ({ email, password, confirmPassword }: ResetPasswordDTO) => {
        const user = await AuthRepository.findByEmail(email)
        const verified = await redis.get(`reset-verified:${email}`)

        if (!verified) {
            return { success: false, message: "Invalid verification attempt" };
        }
        if (!user) {
            return { success: false, message: "Invalid credentials" };
        }
        if (password !== confirmPassword) {
            return { success: false, message: "Passwords do not match" };
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        await AuthRepository.updateByEmail(email, { password: hashedPassword })

        await redis.del(`reset-verified:${email}`);

        return { success: true, message: "Password reset successfully" };
    }
}
