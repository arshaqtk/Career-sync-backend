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

export interface IEducation {
  _id?:string;
  school:string;
  standard:"High School"|"Higher Secondary"|   "Diploma"|   "Undergraduate"|   "Postgraduate"| "Doctorate"|  "Other";
  startDate:Date;
  endDate?:Date;
  isCurrent?:boolean;
  location?:string;
  description?:string;
  gradeOrPercentage?:string;
}

export interface ICandidateData {
  about?: string;
  resumeUrl?: string;
  experience?: IExperience[];
  skills?: string[];
  education?: IEducation[];
  portfolioUrl?: string;
}

export interface IRecruiterData {
  companyName?: string;
  companyWebsite?: string;
  companyLogo?: string;
  companyLocation?: string;
  companyDescription?: string;
}
