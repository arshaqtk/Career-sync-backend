import { model, Schema, Types } from "mongoose";
import { ICompany } from "../types/company.types";

const companySchema = new Schema<ICompany>(
  {
    // BASIC INFO -----------------------------------------
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    website: {
      type: String,
      trim: true,
    },

    logo: {
      key: { type: String },
      url: { type: String },
    },

    location: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    industry: {
      type: String,
      trim: true,
    },

    size: {
      type: String,
    },

    foundedYear: {
      type: Number,
    },

       owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    recruiters: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    pendingRecruiters: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // VERIFICATION ---------------------------------------

    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    verifiedBy:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    verifiedAt: {
      type: Date,
    },

    // STATUS ---------------------------------------------
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    blockedAt: {
      type: Date,
    },

    blockReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

companySchema.index({ name: 1 });
companySchema.index({ owner: 1 });

export const CompanyModel = model<ICompany>("Company", companySchema);
