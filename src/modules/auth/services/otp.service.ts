import redis from "../../../config/redis"
import { UserRepository } from "../../user/repository/user.repository"
import crypto from "crypto";

//---------------REGISTER-----------------------------------

export const saveRegisterOtp=async (email:string,otp:string)=>{
    await redis.del(`otp:register:${email}`);
    await redis.set(`otp:register:${email}`,otp,{EX:600})
}

export const verifyRegisterOtp=async(email:string,otp:string)=>{
   
    const storedOtp=await redis.get(`otp:register:${email}`)
    if (!storedOtp) {
        return { success: false, message: "OTP expired" };
    }
    if (storedOtp !== otp) {
        return { success: false, message: "Invalid OTP" };
    }

     await UserRepository.updateByEmail( email,{ isVerified: true }  );

    await redis.del(`otp:register:${email}`);

     return { success: true,message:"OTP verified successfully" };
}

//-----------------FORGET PASSWORD------------------

export const saveResetOtp=async (email:string,otp:string)=>{
    await redis.set(`otp:reset:${email}`,otp,{EX:300})
}

export const verifyResetOtp=async(email:string,otp:string)=>{
    const storedOtp=await redis.get(`otp:reset:${email}`)
    if (!storedOtp) {
        return { success: false, message: "Invalid OTP or email." };
    }
    if (storedOtp !== otp) {
        return { success: false, message: "Invalid OTP or email." };
    }
    const resetToken = crypto.randomBytes(32).toString("hex");

  await redis.set(`resetToken:${email}`, resetToken, {EX:900});


   await redis.del(`otp:reset:${email}`);

     return { success: true,message:"OTP verified successfully",resetToken,email };
}
