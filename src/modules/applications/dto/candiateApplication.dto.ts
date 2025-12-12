export interface CandidateApplicationDTO {
  id: string;
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
  };
  status: "Pending" | "Shortlisted" | "Selected" | "Rejected";
  createdAt: Date;
}
