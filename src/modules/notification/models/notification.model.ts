import mongoose from "mongoose";
import { INotification } from "../types/notification.types";


const notificationSchema=new mongoose.Schema<INotification>({
    senderId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: false,
},
    recipientId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},
    type: {
  type: String,
  enum: [
    "JOB_APPLIED",
    "JOB_STATUS_CHANGED",
    "INTERVIEW_SCHEDULED",
    "INTERVIEW_RESCHEDULED",
    "INTERVIEW_CANCELLED",
    "ACCOUNT_BLOCKED",
    "ACCOUNT_UNBLOCKED",
    "REPORT_UPDATED",
    "JOB_BLOCKED",
  "JOB_UNBLOCKED",
  "APPLICATION_SUBMITTED"
  ],
  required: true,
},
    title:{
        type:String,
         required: true,
    },
    message:{
        type:String,
         required: true,
    },
    entityType: {
  type: String,
  enum: ["job", "interview", "user", "report"],
},
    entityId:{
        type:mongoose.Schema.Types.ObjectId,
    },isRead: {
  type: Boolean,
  default: false,
}
},{
    timestamps:true
})

notificationSchema.index({ recipientId: 1, isRead: 1 })
notificationSchema.index({ createdAt: -1 })

export const NotificationModel = mongoose.model(
  "Notification",
  notificationSchema
)