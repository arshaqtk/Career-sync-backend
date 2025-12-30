import { IJob } from "@/modules/jobs/types/JobModel.type";
import { Document, Types } from "mongoose";

export interface IApplication extends Document {
  candidateId: Types.ObjectId | string;
  recruiterId:Types.ObjectId | string;
  jobId: Types.ObjectId |string ;
  resumeUrl: string;
  status: "Pending" | "Shortlisted" | "Selected" | "Rejected";
  experience:string;
  currentRole:string;
  coverLetter?: string; 
  expectedSalary?: number;
  noticePeriod?: string;
  decisionNote?:string;
  createdAt: Date;     
  updatedAt: Date;  
}

export interface IPopulatedJob {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType?:string;
}

export interface IPopulatedCandidate {
  _id: string;
  name: string;
  email: string;
  candidateData: {
    skills: string[];
    resumeUrl: {url:string};
  };
}
export interface IPopulatedRecruiter{
   _id: string;
  name: string;
  email: string;
  recruiterData: {
    companyName: string;
  };
}

export interface IApplicationPopulated extends Omit<IApplication, "jobId" | "candidateId"|"recruiterId"> {
  application:IApplication
  jobId: IPopulatedJob;
  candidateId: IPopulatedCandidate;
  recruiterId:IPopulatedRecruiter;
}