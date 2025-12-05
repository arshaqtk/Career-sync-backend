import { generateOtp } from "../../../shared/utils/generateOtp";
import { sendResetOtpEmail } from "./email.service";
import { saveResetOtp, verifyResetOtp } from "./otp.service";
import { ResetPasswordDTO } from "../types/resetPassword.types";
import bcrypt from "bcryptjs"
import { UserRepository } from "../../user/repository/user.repository";
import redis from "../../../config/redis";



export const passWordService = {
    sendForgetPasswordOtp: async (email: string) => {
        const user = await UserRepository.findByEmail(email)
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
    resetPasswordService: async ({ email, password, confirmPassword,resetToken}: ResetPasswordDTO) => {
        const user = await UserRepository.findByEmail(email).select("+password");
        const storedToken = await redis.get(`resetToken:${email}`);

  if (!storedToken || storedToken !== resetToken) {
     return { success: false, message: "Invalid verification attempt" };
  }
        
        if (!user) {
            return { success: false, message: "Invalid credentials" };
        }
        if (password !== confirmPassword) {
            return { success: false, message: "Passwords do not match" };
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        await UserRepository.updateByEmail(email, { password: hashedPassword })

       await redis.del(`resetToken:${email}`);

        return { success: true, message: "Password reset successfully" };
    }
}
