import { CustomError } from "../../../shared/utils/customError"
import { clearMessageService, deleteConversationService, getConvesationListService, getMessagesService } from "../services/chat.service"
import { Request,Response } from "express"
export const getConversationListController=async(req:Request,res:Response)=>{
   const userId=req.auth?.id
//  const {limit=10,page=1}=req.query
 if(!userId){
    throw new CustomError("unAuthorized User Not Found")
 }
    const conversations=await getConvesationListService({userId:userId,query:{page:1,limit:10}})
    return res.status(200).json({
    success: true,
    data: conversations,
  })
} 



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


export const clearMessageController=async(req:Request,res:Response)=>{
   const conversationId=req.params.conversationId as string
  await clearMessageService({conversationId})

  return res.status(200).json({
    success: true,
    message:"Message History Cleared SucccessFully",
  })
}


export const deleteConversationController=async(req:Request,res:Response)=>{
   const conversationId=req.params.conversationId as string
  await deleteConversationService({conversationId})

  return res.status(200).json({
    success: true,
    message:"Conversation Deleted SucccessFully",
  })
}