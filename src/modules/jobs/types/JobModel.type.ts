import { Schema } from "mongoose";

export interface IJob {
  _id?: string;
  title: string;
  company: string;
  description?: string;
  skills?: string[];
  experienceMin?: number;
  experienceMax?: number;
  salaryRange?: { min?: number; max?: number };
  location?: string;
  remote?: boolean;
  jobType: "full-time" | "part-time" | "internship";
  postedBy: Schema.Types.ObjectId|string;
  status: "open" | "closed" | "paused";
  applicationCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
