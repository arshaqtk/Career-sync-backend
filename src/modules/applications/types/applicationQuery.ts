interface ApplicationQuery {
  page: number;
  limit: number;
   search?:string;
  status: "all"| "Pending" | "Shortlisted" | "Selected"|"Interview"
     | "Rejected"
      sortBy: "newest" | "oldest";
}