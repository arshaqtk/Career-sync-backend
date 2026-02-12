import { Request,Response } from "express"
import { CustomError } from "../../../shared/utils/customError"
import { clearMessageService } from "../services/chat.service"
export const clearMessageController=async(req:Request,res:Response)=>{
   const conversationId=req.params.conversationId as string
      const userId=req.auth?.id as string
  await clearMessageService({conversationId,userId})

  return res.status(200).json({
    success: true,
    message:"Message History Cleared SucccessFully",
  })
}