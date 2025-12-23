import { InterviewRoundType, InterviewStatus } from "../types/interview.type";

export interface RecruiterInterviewsDTO {
  id: string;
  jobTitle:string;
  candidateName:string;
  roundType: "Final" | "Technical" | "Hr" | "Managerial";
    status:  "Pending"|"Scheduled"
  | "Rescheduled"
  | "InProgress"
  | "Completed"
  | "Selected"
  | "Rejected"
  | "Cancelled";
  createdAt: Date;
}

export interface RecruiterInterviewTimeLineDto{
 
  _id: string;
  roundNumber: number;
  roundType: InterviewRoundType;
  status: InterviewStatus;
  startTime: Date;
  endTime: Date;
  durationMinutes?: number;
  statusHistory?: {
  roundNumber: number;
  status: InterviewStatus;
  changedAt: Date;
  note?: string;
}[];
  mode?: "Online" | "Offline";
  notes?: string;
  createdAt: Date;

}