import { NotificationModel } from "../models/notification.model"
export const getMyNotifications=async(userId:string,query?: { page?: number; limit?: number })=>{
    
    const notifications=await NotificationModel.find({recipientId:userId}).sort({ createdAt: -1 })
    .limit(query?.limit ?? 20)

    return notifications
}