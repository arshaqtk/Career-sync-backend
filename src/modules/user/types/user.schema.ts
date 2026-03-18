import { Document, Types } from "mongoose";

export interface IResumeData {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  currentTitle?: string;
  totalYearsExp?: number;
  summary?: string;
  skills?: string[];
  languages?: string[];
  education?: {
    degree?: string;
    institution?: string;
    year?: number;
  }[];
  experience?: {
    title?: string;
    company?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }[];
}

export interface ICoverLetter {
  jobId: Types.ObjectId;
  content: string;
  tone: string;
  createdAt: Date;
}

export interface IUser extends Document {

  // COMMON FIELDS
  name: string;
  email: string;
  phone?: string;
  profilePicture?: {
    key: string,
    url: string,
    updatedAt: Date
  };

  // AUTH
  password?: string;
  authProvider: "local" | "google"
  googleId?: string;


  field: string | undefined;
  role: "candidate" | "recruiter" | "admin";

  isVerified: boolean;
  isActive: boolean;
  isProfileComplete: boolean;
  isOnline?: boolean;
  lastSeen?: Date;


  blockedAt?: Date | null;
  blockReason?: string | null;

  candidateData?: ICandidateData;
  recruiterData?: IRecruiterData;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExperience {
  _id?: string;
  company: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  location?: string;
  jobType?: string
}

export interface IEducation {
  _id?: string;
  school: string;
  standard: "High School" | "Higher Secondary" | "Diploma" | "Undergraduate" | "Postgraduate" | "Doctorate" | "Other";
  startDate: Date;
  endDate?: Date;
  isCurrent?: boolean;
  location?: string;
  description?: string;
  gradeOrPercentage?: string;
}


export interface ICandidateData {
  about?: string;
  role?: string;
  isProfileInitialized?: boolean;
  resume?: {
    key: string,          // S3 object key
    originalName: string,
    uploadedAt: Date
  }
  resumeData?: IResumeData;
  coverLetters?: ICoverLetter[];
  experience?: IExperience[];
  skills?: string[];
  education?: IEducation[];
  portfolioUrl?: string;
}

export interface IRecruiterData {
  company?: Types.ObjectId
  companyApprovalStatus?: "pending" | "approved" | "rejected"
}


