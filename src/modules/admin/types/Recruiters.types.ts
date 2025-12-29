export type RecruiterList = {
  id: string
  name: string
  email: string
  company: string
  jobsPosted: number
  status: "active" | "blocked"
}

export interface RecruiterListResponse {
  recruiters: RecruiterList[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}