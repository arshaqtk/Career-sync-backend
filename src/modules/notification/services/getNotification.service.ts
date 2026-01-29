import { parseArgs } from "node:util";
import { NotificationModel } from "../models/notification.model"
export const getMyNotifications=async({userId,query}:{userId:string,query: { page: number; limit: number }})=>{
    
    const notifications=await NotificationModel.find({recipientId:userId}).sort({ createdAt: -1 })
     .skip((query.page - 1) * query.limit)
    .limit(query.limit).lean();

    const total=await NotificationModel.countDocuments({recipientId:userId})

    return {notifications, pagination: { 
      parseArgs:query.page,
      limit:query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },}
}