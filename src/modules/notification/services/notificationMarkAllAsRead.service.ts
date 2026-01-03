import { NotificationModel } from "../models/notification.model"

export const markAllAsRead=async(userId:string)=>{
    const result=await NotificationModel.updateMany({recipientId:userId,isRead: false},{$set:{isRead:true}})
     return {
    modifiedCount: result.modifiedCount,
  }
}