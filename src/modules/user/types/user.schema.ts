export interface IExperience {
  _id?: string;
  company: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  location?: string;
  jobType?:string
}

export interface ICandidateData {
  about?: string;
  resumeUrl?: string;
  experience?: IExperience[];
  skills?: string[];
  education?: string[];
  portfolioUrl?: string;
}

export interface IRecruiterData {
  companyName?: string;
  companyWebsite?: string;
  companyLogo?: string;
  companyLocation?: string;
  companyDescription?: string;
}
