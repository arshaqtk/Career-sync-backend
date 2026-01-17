import { Types } from "mongoose"
import { ConversationModel } from "../models/conversatin.model"
import { MessageModel } from "../models/message.model"
import { MessagePayload } from "../types/message.type"
import { CustomError } from "../../../shared/utils/customError"
import { createNotificationService } from "../../../modules/notification/services/createNotification.service"

export const createConversation=async({user1,user2}:{user1:string,user2:string})=>{
  if(!user1||!user2){
    throw new CustomError("ID NOT FOUND")
  }

     const user1Id = new Types.ObjectId(user1)
  const user2Id = new Types.ObjectId(user2)
    const conversation=await ConversationModel.findOne({
        participants:{$all:[user1Id,user2Id]}
    })
    if(conversation) return conversation

    const newConversation=await ConversationModel.create({participants:[user1Id,user2Id]})

    return newConversation
}

export const sendMessage=async({content,conversationId,receiverId,senderId}:MessagePayload)=>{
    const conversation = await ConversationModel.findById(conversationId)

     if (!conversation) {
    throw new Error("Conversation not found")
  }
  if(!receiverId){
    throw new Error("RecieverId not found")
  }

   const senderObjectId = new Types.ObjectId(senderId)
  const receiverObjectId = new Types.ObjectId(receiverId)

   const isParticipant = conversation.participants.some(
    (id) => id.equals(senderObjectId)
  )

  if (!isParticipant) {
    throw new Error("User not part of this conversation")
  }
    const message=await MessageModel.create({conversationId,senderId:senderObjectId,receiverId:receiverObjectId,content})

    await ConversationModel.findByIdAndUpdate(conversationId, {
    lastMessage: content,
    lastMessageAt: new Date(),
  })

 await createNotificationService({
  recipientId: receiverObjectId,
  senderId: senderObjectId,

  type: "NEW_CHAT_MESSAGE",

  title: "New message received",

  message: content
    ? content
    : "You have received a new chat message.",

  entityType: "chat",
  entityId: conversationId, 
});


    return message
}

export const getConvesationListService=async({userId,query}:{userId:string,query: {
  page: number
  limit: number
  search?: string 
}})=>{

const { page, limit,search } = query
const skip = (page - 1) * limit

  const userObjectId = new Types.ObjectId(userId)

  const conversations=await ConversationModel.aggregate([

   { $match:{participants:userObjectId}},

   {$sort:{lastMessageAt:-1}},

   { $skip: skip },
      { $limit: limit },

{
  $lookup:{
    from:"users",
    localField:"participants",
    foreignField:"_id",
    as:"participantsData"
  },
},

{$addFields:{
  receiver:{
    $arrayElemAt:[{
      $filter:{
        input:"$participantsData",
        as:"user",
        cond:{$ne:["$$user._id",userObjectId]},
      }
    },0,]
  }
}},

{
  $project:{
    lastMessage:1,
    lastMessageAt:1,
    receiver:{
      _id:1,
      name:1,
      email:1,
      profilePictureUrl:1
    }
  }
}

])

return conversations
}

export const getMessagesService=async({conversationId,userId,}:
  {conversationId:string,userId:string})=>{

  if(!conversationId||!userId){
    throw new CustomError("Failed to fetch history", 400)
  }

   const conversation = await ConversationModel.findOne({
    _id: conversationId,
    participants: userId,
  })

  if (!conversation) {
    throw new CustomError("Unauthorized", 403)
  }
  const limit=20
  const page=1
  const skip=limit*page

  const messages=await MessageModel.find({conversationId:conversationId}).sort({createdAt:1}).lean()

  return messages 
}