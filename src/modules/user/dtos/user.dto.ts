export interface CandidateData {
  resumeUrl?: string;
  experienceYears?: number;
   companyName?: string;
  skills?: string[];
  education?: string[];
  portfolioUrl?: string;
  about?:string;
}

export interface RecruiterData {
  // companyName?: string;
  // companyWebsite?: string;
  // companyLogo?: string;
  // companyLocation?: string;
  // companyDescription?: string;
   company?: string;
}

export type UpdateUserProfileDTO = {
  name?: string;
  phone?: string;
};

// export type updateRecruiterCompanyDTO={
//  companyName?: string;
//   companyWebsite?: string;
//   companyLogo?: string;
//   companyLocation?: string;
//   companyDescription?: string;
// }

export type updateRecruiterCompanyDTO = {
  company?: string;
}