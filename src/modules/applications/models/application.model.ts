import mongoose, { model, Schema } from "mongoose";
import { IApplication } from "../types/applicatioModel.types";

const applicationSchema = new Schema<IApplication>(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    resumeUrl: {
      type: String,
      required: true,
    },
    currentRole:{
      type:String,
      required:true,
    },
    experience:{type:String,
      require:true,
      default:"0"
    },
    status: {
      type: String,
      enum: ["Pending", "Shortlisted", "Selected", "Rejected"],
      default: "Pending",
    },
    coverLetter: {
      type: String,
      maxlength: 2000,
    },
    expectedSalary: {
      type: Number,
      min: 0
    },
    noticePeriod: {
      type: String,
    }
  },
  { timestamps: true }
);

export const ApplicationModel = model("Application", applicationSchema);
