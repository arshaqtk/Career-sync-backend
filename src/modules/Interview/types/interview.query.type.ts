export interface InterviewQuery {
    page?: Number;
    limit?: Number;
    roundType?: "All"|"Final" | "Technical" | "Hr" | "Managerial";
    status?: "All"| "Scheduled"
  | "Rescheduled"
  | "InProgress"
  | "Completed"
  | "Selected"
  | "Rejected"
  | "Cancelled";
    sortBy?: "newest" | "oldest";
}