export interface RecruiterInterviewsDTO {
  id: string;
  jobTitle:string;
  candidateName:string;
  roundType: "Not Defined" | "Technical" | "Hr" | "Managerial";
    status:  "Pending" | "Scheduled" | "Rescheduled" | "Completed" | "Cancelled";
  createdAt: Date;
}