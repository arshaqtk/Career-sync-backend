interface JobQuery {
  page: number;
  limit: number;
  search?: string;
  field?: string
  location?: string
  remote?: boolean
  experienceMin?: number
  experienceMax?: number
  jobType?: "full-time" | "part-time" | "internship" | "all";
  status?: "open" | "closed" | "all";
  sortByApplication?: "most_applied" | "least_applied";
  recommended?: boolean;
}