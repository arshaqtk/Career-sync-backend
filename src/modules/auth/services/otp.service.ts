import redis from "../../../config/redis"
import UserModel from "../models/user.model"
import { AuthRepository } from "../repository/auth.repository"

export const saveOtp=async (email:string,otp:string)=>{
    await redis.set(`otp:${email}`,otp,{EX:300})
}

export const verifyOtp=async(email:string,otp:string)=>{
    const storedOtp=await redis.get(`otp:${email}`)
    if (!storedOtp) {
        return { success: false, message: "OTP expired or not found" };
    }
    if (storedOtp !== otp) {
        return { success: false, message: "Invalid OTP" };
    }

     await AuthRepository.updateByEmail( email,{ isVerified: true }  );
    
     return { success: true,message:"OTP verified successfully" };
}

export const deleteOtp = async (email: string) => {
  await redis.del(`otp:${email}`);
};