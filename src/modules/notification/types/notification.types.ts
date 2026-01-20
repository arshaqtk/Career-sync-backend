import { Types } from "mongoose";

export type NotificationType =
  | "JOB_APPLIED"
  | "JOB_STATUS_CHANGED"
  | "INTERVIEW_SCHEDULED"
  | "INTERVIEW_RESCHEDULED"
  | "INTERVIEW_CANCELLED"
  |"INTERVIEW_COMPLETED"
  | "CANDIDATE_SELECTED"
| "CANDIDATE_REJECTED"
  | "ACCOUNT_BLOCKED"
  | "ACCOUNT_UNBLOCKED"
  | "REPORT_UPDATED"
  | "JOB_BLOCKED"
  |"JOB_UNBLOCKED"
  |"APPLICATION_SUBMITTED"
  |"APPLICATION_UPDATED"
  |"NEW_CHAT_MESSAGE"

export interface INotification{
    _id?: Types.ObjectId | string
  recipientId: Types.ObjectId | string;     // who receives it
  senderId?: Types.ObjectId | string;      // who triggered it 
  type: NotificationType;
  title: string;
  message: string;
  entityType?: "job" | "interview" | "user" | "report"|"chat";
  entityId?: Types.ObjectId | string;
  isRead: boolean;
  createdAt: Date;
    updatedAt: Date
}

export interface CreateNotificationPayload {
  recipientId: Types.ObjectId | string
  senderId?: Types.ObjectId | string
  type: NotificationType
  title: string
  message: string
  entityType?: "job" | "interview" | "user" | "report"| "chat"
  entityId?: Types.ObjectId | string
}