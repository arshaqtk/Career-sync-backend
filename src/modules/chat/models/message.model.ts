import mongoose, { Schema } from "mongoose";
import { IMessage } from "../types/message.type";

export const messageSchema = new Schema<IMessage>({
    conversationId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Conversation"
    },
    senderId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })
messageSchema.index({ conversationId: 1, createdAt: -1 });
export const MessageModel = mongoose.model<IMessage>(
    "Message",
    messageSchema
);