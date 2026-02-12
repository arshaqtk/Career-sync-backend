import mongoose, { model, Schema } from "mongoose";
import { IApplication } from "../types/applicatioModel.types";
import { string } from "zod";

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
    recruiterId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resume: {
        key:{type:String,required: true},
        originalName:{type:String}
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
    },
    decisionNote:{
      type:String,
    },
    viewedAt: {
  type: Date,
  default: null
}
  },
  { timestamps: true }
);
applicationSchema.index({ candidateId: 1 });
export const ApplicationModel = model("Application", applicationSchema);
