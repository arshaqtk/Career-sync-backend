export interface CandidateInterviewsDTO {
  id: string;
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
}