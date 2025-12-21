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