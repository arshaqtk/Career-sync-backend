export interface InterviewQuery {
    page?: Number;
    limit?: Number;
    roundType?: "All"|"Not Defined" | "Technical" | "Hr" | "Managerial";
    status?: "All" | "Pending" | "Scheduled" | "Rescheduled" | "Completed" | "Cancelled";
    sortBy?: "newest" | "oldest";
}