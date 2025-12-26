export interface ApplicationQuery {
  page?: string;
  limit?: string;
   status?: "all" | "applied" | "shortlisted" | "interview" | "rejected";
  sortBy?: "newest" | "oldest";
}

