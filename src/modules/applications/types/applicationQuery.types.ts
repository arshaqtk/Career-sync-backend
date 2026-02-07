export interface ApplicationQuery {
  page: number;
  limit: number;
   status?: "all" | "Pending" | "Shortlisted" | "Interview" | "Rejected"|"Selected"|"Viewed";
  sortBy?: "newest" | "oldest";
  search?:string
}

