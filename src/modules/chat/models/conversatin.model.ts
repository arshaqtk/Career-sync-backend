import mongoose, { Schema } from "mongoose";
import { IConversation } from "../types/conversation.type";



export const conversationSchema=new Schema<IConversation>({
participants:{
     type: [Schema.Types.ObjectId],
          ref: "User",
          required: true,
},
 lastMessage: {
      type: String,
    },

    lastMessageAt: {
      type: Date,
    },
},{timestamps:true})


export const ConversationModel=mongoose.model<IConversation>("Conversation",conversationSchema)