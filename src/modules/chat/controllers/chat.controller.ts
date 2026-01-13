import { CustomError } from "../../../shared/utils/customError"
import { getConvesationListService, getMessagesService } from "../services/chat.service"
import { Request,Response } from "express"
export const getConversationListController=async(req:Request,res:Response)=>{
   const userId=req.user?.id
//  const {limit=10,page=1}=req.query
 if(!userId){
    throw new CustomError("UnAuthorized")
 }
    const conversations=await getConvesationListService({userId:userId,query:{page:1,limit:10}})
    return res.status(200).json({
    success: true,
    data: conversations,
  })
} 



export const getMessagesController=async(req:Request,res:Response)=>{
   const userId=req.user?.id as string
   const conversationId=req.params.conversationId as string
//  const {limit=10,page=1}=req.query
 if(!userId){
    throw new CustomError("UnAuthorized")
 }
    const messages=await getMessagesService({userId:userId,conversationId:conversationId})
    return res.status(200).json({
    success: true,
    data: messages,
  })
} 