import { CustomError } from "../../../shared/utils/customError";
import { CreateNotificationPayload } from "../types/notification.types";
import { NotificationModel } from "../models/notification.model";
import { emitNotification } from "../socket/notification.socket";
import {Server} from "socket.io"

export const createNotificationService=async(io: Server,payload:CreateNotificationPayload)=>{
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

    emitNotification(io,String(recipientId),{
      entityId:String(entityId),message,title,type,createdAt:notification.createdAt
    })

return notification
}

