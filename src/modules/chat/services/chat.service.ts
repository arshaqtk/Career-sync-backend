import { Types } from "mongoose"
import { ConversationModel } from "../models/conversatin.model"
import { MessageModel } from "../models/message.model"
import { MessagePayload } from "../types/message.type"

export const createConversation=async({user1,user2}:{user1:string,user2:string})=>{
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
  
    return message
}