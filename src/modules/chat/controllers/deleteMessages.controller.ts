import { deleteConversationService } from "../services/chat.service"
import { Request,Response } from "express"
export const deleteConversationController=async(req:Request,res:Response)=>{
   const conversationId=req.params.conversationId as string
  await deleteConversationService({conversationId})

  return res.status(200).json({
    success: true,
    message:"Conversation Deleted SucccessFully",
  })
}