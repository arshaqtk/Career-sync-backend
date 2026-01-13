export interface ApplicationQuery {
  page: number;
  limit: number;
   status?: "all" | "Pending" | "Shortlisted" | "Interview" | "Rejected"|"Selected";
  sortBy?: "newest" | "oldest";
  search?:string
}

