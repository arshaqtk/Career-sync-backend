import bcrypt from "bcryptjs"
import { UserRepository } from "../../user/repository/user.repository"
import { RegisterDTO, LoginDTO } from "../types/auth.types"
import { generateAccessToken, generateTokens, verifyRefreshToken } from "../../../shared/utils/jwt"
import { generateOtp } from "../../../shared/utils/generateOtp"
import { sendRegisterOtpEmail, sendResetOtpEmail } from "./email.service"
import { saveRegisterOtp, verifyRegisterOtp } from "./otp.service"
import { CustomError } from "../../../shared/utils/customError"



export const Authservice = {
    register: async (data: RegisterDTO) => {
        const { confirmPassword, email, name, password, role,field } = data

        const exists = await UserRepository.findByEmail(email);

        if (exists) {
            throw new CustomError("User already exists", 400);
        }
        if (confirmPassword != password) {
            throw new CustomError("Password and Confirm password Doesn't Match");
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await UserRepository.createUser({
            email, name, role,field,
            password: hashedPassword,
            isVerified: false
        })

        const otp = generateOtp()

        await saveRegisterOtp(email, otp)

        await sendRegisterOtpEmail(email, otp)

        return { email, message: "Registerd Succesffully" }
    },
    login: async (data: LoginDTO) => {
        const user = await UserRepository.findByEmail(data.email).select("+password");
        if (!user) { 
       
            throw new CustomError("Invalid email or password", 400);  }

        const match = await bcrypt.compare(data.password, user.password)
        const roleAuthenticated=user.role===data.role

        if (!match||!roleAuthenticated){
            throw new CustomError("Invalid email or password", 400); 
        }
        
            
        console.log(user.isVerified)
        if (!user.isVerified) {
           
            const otp = generateOtp();
            await saveRegisterOtp(user.email, otp);
            await sendRegisterOtpEmail(user.email, otp);

            return {
                success: false, 
                status: "NOT_VERIFIED",
                isVerified:false,
                message: "Your account is not verified. A new OTP has been sent.",
                email: user.email
            };
        }

        const token = generateTokens({
            id: user._id,
            email:user.email,
            role: user.role
        });

        return { success: true,  
                status: "VERIFIED",
                message: "Logged successfully",
                isVerified:true,
                 email: user.email,
                 role: user.role,
                refreshToken: token.refreshToken, 
                accessToken: token.accessToken };
    },

    verifyRegisterOtp: async (email: string, otp: string) => {
        return await verifyRegisterOtp(email, otp);
    },

    resendRegisterOtp: async (email: string) => {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw new Error("User does not exist");
        }
        if (user.isVerified) {
            throw new Error("User already verified");
        }
        const otp = generateOtp()

        await saveRegisterOtp(email, otp)

        await sendRegisterOtpEmail(email, otp)

        return { success: true, message: "OTP sent successfully" };
    },
    refreshTokens:(async(refreshToken:string)=>{
        return await verifyRefreshToken(refreshToken)
    })

}