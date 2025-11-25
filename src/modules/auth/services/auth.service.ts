import bcrypt from "bcryptjs"
import { AuthRepository } from "../repository/auth.repository"
import { RegisterDTO, LoginDTO } from "../types/auth.types"
import { generateTokens } from "../../../core/utils/jwt"
import { generateOtp } from "../../../core/utils/generateOtp"
import { saveOtp, verifyOtp } from "./otp.service"
import { sendOtpEmail } from "./email.service"


export const Authservice = {
    register: async (data: RegisterDTO) => {
        const exists = await AuthRepository.findByEmail(data.email);
        if (exists) {
            throw new Error("User already exists");

        }
        const hashedPassword = await bcrypt.hash(data.password, 10)

        const user = await AuthRepository.createUser({
            ...data,
            password: hashedPassword,
            isVerified: false
        })

        const otp = generateOtp()

        await saveOtp(user.email, otp)

        await sendOtpEmail(user.email, otp)

        return user.email
    },
    login: async (data: LoginDTO) => {
        const user = await AuthRepository.findByEmail(data.email);
        if (!user) { throw new Error("Invalid email or password"); }

        const match = await bcrypt.compare(data.password, user.password)
        if (!match) throw new Error("Invalid email or password");

        const token = generateTokens({
            id: user._id,
            role: user.role
        });

        return { refreshToken: token.refreshToken, accessToken: token.accessToken };
    },

    verifyOtp: async (email: string, otp: string) => {
        const result = await verifyOtp(email, otp)
        return result
    },

    resendOtp: async (email: string) => {
        const user = await AuthRepository.findByEmail(email);
        if (!user) {
            throw new Error("User does not exist");
        }
        if (user.isVerified) {
            throw new Error("User already verified");
        }
        const otp = generateOtp()

        await saveOtp(email, otp)

        await sendOtpEmail(email, otp)

        return { success: true, message: "OTP sent successfully" };
    }

}