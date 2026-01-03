import { CustomError } from "../../../shared/utils/customError";
import { CreateNotificationPayload } from "../types/notification.types";
import { NotificationModel } from "../models/notification.model";


export const createNotificationService=async(payload:CreateNotificationPayload)=>{
     const { recipientId, senderId, type,  title, message,entityType,entityId,} = payload

     if(!recipientId||!type||!title||!message){
        throw new CustomError("Missing required notification fields")
     }

       const notification = await NotificationModel.create({
      recipientId,
      senderId,
      type,
      title,
      message,
      entityType,
      entityId,
      isRead: false,
    })

return notification
}

