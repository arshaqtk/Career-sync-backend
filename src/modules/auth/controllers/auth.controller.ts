import { Request, Response } from "express";
import { Authservice } from "../services/auth.service";
import { verifyOtp } from "../services/otp.service";

export const AuthController = {
    register: async (req: Request, res: Response) => {
        try {
            const result = await Authservice.register(req.body)
            
            res.status(201).json(result)

        } catch (err: any) {
            res.status(400).json({ message: err.message })
        }
    },
    login: async (req: Request, res: Response) => {
        try {
            const result = await Authservice.login(req.body);
            res
                .cookie("accessToken", result.accessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge: 15 * 60 * 1000
                })
                .cookie("refreshToken", result.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
                .json({ message: "Logged in successfully" });


        } catch (err: any) {
            res.status(400).json({ message: err.message })
        }
    },
    verifyOtp:async(req:Request,res:Response)=>{
        try{
            const email:string=req.body.email
            const otp:string=req.body.otp
            const result=await verifyOtp(email,otp)
             if (!result.success) {
            return res.status(400).json({ message: result.message});
        }
             return res.json({ message:result.message});
        }catch(err:any){
res.status(400).json({ message: err.message })
        }
    },
    resendOtp:async(req:Request,res:Response)=>{
        try{
            const email:string=req.body.email
           const result= await Authservice.resendOtp(email)

             return res.json({ message:result.message});
             
        }catch(err:any){
res.status(400).json({ message: err.message })
        }
    }
}