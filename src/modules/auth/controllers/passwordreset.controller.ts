import { passWordService } from "../services/passwordReset.service";
import { Request, Response } from "express";


export const passwordController = {

    sendForgetPasswordOtp: async (req: Request, res: Response) => {
        try {
            const { email } = req.body
            const result = await passWordService.sendForgetPasswordOtp(email)
            return res.json({ message: result.message });
        } catch (err: any) {
            res.status(500).json({ message: "Issue With sending Otp" });
        }
    },
    verifyResetOtp: async (req: Request, res: Response) => {
        try {
            const { email, otp } = req.body;
            const result = await passWordService.verifyResetOtp(email, otp);

            if (!result.success) {
                return res.status(400).json({ message: result.message });
            }

            return res.json({ message: result.message });
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    },
    resetPassword:async(req:Request,res:Response)=>{
        try{
            const {email,password,confirmPassword}=req.body
            const result=await passWordService.resetPassword({email,password,confirmPassword})
             return res.json({ message: result.message });
        }catch (err: any) {
            res.status(500).json({ message: "Issue With  Updating Password" });
        }
    }
}