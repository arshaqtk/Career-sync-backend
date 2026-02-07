export interface CandidateApplicationDetailResponse {
  application: {
    id: string
    status: "Pending" | "Shortlisted" | "Selected" | "Rejected"|"Viewed"


    experience: string
    currentRole: string
    resumeUrl: string
    coverLetter?: string
    expectedSalary?: number
    noticePeriod?: string

   
    decisionNote?: string

    appliedAt: string   // ISO string
    updatedAt: string  // ISO string
  }

  job: {
    id: string
    title: string
    company: string
    description?: string

    skills?: string[]
    experienceMin?: number
    experienceMax?: number

    salary?: string
    field: string
    location?: string
    remote?: boolean
    jobType: "full-time" | "part-time" | "internship"
  }

  recruiter: {
    name: string
    email: string

    company: {
      companyName?: string
      companyWebsite?: string
      companyLogo?: string
      companyLocation?: string
      companyDescription?: string
    }
  }
}
