interface JobQuery {
  page: number;
  limit: number;
  location?: string;
  search?:string;
  jobType?: "full-time" | "part-time" | "internship" | "all";
  status?: "open" | "closed"  | "all";
}