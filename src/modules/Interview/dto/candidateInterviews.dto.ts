import { InterviewMode } from "../types/interview.type";

export interface CandidateInterviewsDTO {
  _id: string;
  jobTitle:string;
  roundType: "Final" | "Technical" | "Hr" | "Managerial";
    status:  "Pending"|"Scheduled"
  | "Rescheduled"
  | "InProgress"
  | "Completed"
  | "Selected"
  | "Rejected"
  | "Cancelled";
   startTime?: string;
  endTime?: string;
  meetingLink?: string;
  createdAt: Date;
  roundNumber:number;
  companyName: string
  mode: InterviewMode
}