import { Request,Response } from "express"
import { CustomError } from "../../../shared/utils/customError"
import { getMessagesService } from "../services/chat.service"
export const getMessagesController=async(req:Request,res:Response)=>{
   const userId=req.auth?.id as string
   const conversationId=req.params.conversationId as string
//  const {limit=10,page=1}=req.query
 if(!userId){
    throw new CustomError("unAuthorized User Not Found")
 }
    const messages=await getMessagesService({userId:userId,conversationId:conversationId})
    return res.status(200).json({
    success: true,
    data: messages,
  })
} 
