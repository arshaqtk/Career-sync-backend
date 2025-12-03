import { Schema, model } from "mongoose";
import { IJob } from "../interfaces/job.Interafce";


const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    skills: { type: [String], default: [] },

    experienceMin: { type: Number, min: 0 },
    experienceMax: { type: Number, min: 0 },

    salaryRange: {
      min: { type: Number, min: 0 },
      max: { type: Number, min: 0 },
    },

    location: { type: String, default: "Remote" },
    remote: { type: Boolean, default: false },

    jobType: {
      type: String,
      required: true,
      enum: ["full-time", "part-time", "internship"],
    },

    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["open", "closed", "paused"],
      default: "open",
    },

    applicationCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Job = model<IJob>("Job", JobSchema);
