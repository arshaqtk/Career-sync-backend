import { Types } from "mongoose";

export interface IConversation{
    participants: Types.ObjectId[];  
  lastMessage?: string;            
  lastMessageAt?: Date;             
  createdAt?: Date;
  updatedAt?: Date;
}