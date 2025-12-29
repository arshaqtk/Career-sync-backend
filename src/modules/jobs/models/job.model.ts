import { Schema, model, Types } from "mongoose";
import { IJob } from "../types/JobModel.type";



const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },

    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: false,
    },

    skills: {
      type: [String],
      default: [],
    },

    experienceMin: {
      type: Number,
      required: false,
    },

    experienceMax: {
      type: Number,
      required: false,
    },

    salary: {
      type: String,
      required: false,
    },
    field: { type: String,
      required:true
     },

    location: {
      type: String,
      required: false,
      trim: true,
    },

    remote: {
      type: Boolean,
      default: false,
    },

    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship"],
      required: [true, "Job type is required"],
    },

    postedBy: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "PostedBy (employer) is required"],
    },

    status: {
      type: String,
      enum: ["open", "closed", "paused"],
      default: "open",
      required: true,
    },

    applicationCount: {
      type: Number,
      default: 0,
    },
    
     blockedAt: {
  type: Date,
},

blockReason: {
  type: String,
},
wasClosedByRecruiter: {
  type: Boolean,
  default: false,
}
  },
  {
    timestamps: true, // automatically creates createdAt & updatedAt
  }
);

export const JobModel = model("Job", JobSchema);
