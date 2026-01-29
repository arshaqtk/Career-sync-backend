import { Types } from "mongoose";

export interface IConversation{
    participants: Types.ObjectId[];  
   clearedAt: Map<string, Date>;
  lastMessage?: string;            
  lastMessageAt?: Date;             
  createdAt?: Date;
  updatedAt?: Date;
}