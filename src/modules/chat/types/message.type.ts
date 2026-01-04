import { Types } from "mongoose";

export interface IMessage{
    conversationId:string|Types.ObjectId;
    senderId:string|Types.ObjectId;
     receiverId: string|Types.ObjectId;
    content:string;
    isRead:boolean;
    createdAt?:Date;
    updatedAt?:Date;
}

export interface MessagePayload{
    conversationId:string|Types.ObjectId;
    senderId:string|Types.ObjectId;
     receiverId: string|Types.ObjectId;
    content:string;
}