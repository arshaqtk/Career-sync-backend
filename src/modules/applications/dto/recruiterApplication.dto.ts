export interface RecruiterApplicationDTO {
  id: string;

  candidate: {
    id: string;
    name: string;
    email: string;
    skills: string[];
    resumeUrl: string;
  };
  
  job: {
    id: string;
    title: string;
    company: string;
  };
  
  status: "Pending" | "Shortlisted" | "Selected" | "Rejected";
  currentRole:string;
  experience: string;
  coverLetter?: string;
  expectedSalary?: number;
  noticePeriod?: string;

  createdAt: Date;
}
