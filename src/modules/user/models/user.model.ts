import { Schema, model } from "mongoose";
import { IUser } from "../types/user.schema";
import { EducationSchema, ExperienceSchema } from "../schemas/index"

const ResumeDataSchema = new Schema(
  {
    fullName: String,
    email: String,
    phone: String,
    location: String,
    currentTitle: String,
    totalYearsExp: Number,
    summary: String,

    skills: {
      type: [String],
      default: []
    },

    languages: {
      type: [String],
      default: []
    },

    education: [
      {
        degree: String,
        institution: String,
        year: Number
      }
    ],
    experience: [
      {
        title: String,
        company: String,
        startDate: String,
        endDate: String,
        description: String
      }
    ]
  },
  { _id: false }
);
const userSchema = new Schema<IUser>(
  {
    // COMMON FIELDS ---------------------------------------------------------
    name: {
      type: String,
      required: true,
      minlength: 2,
      trim: true, 
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      minlength: 10,
      maxlength: 15,
    },

    password: {
      type: String,
      minlength: 6,
      select: false,
    },

    profilePicture: {
      key: { type: String },
      url: { type: String },
      updatedAt: { type: Date, default: Date.now }
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String
    },

    role: {
      type: String,
      enum: ["candidate", "recruiter", "admin"],
      default: "candidate",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    isProfileComplete: {
      type: Boolean,
      default: false
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isOnline: { type: Boolean, default: false },
    lastSeen:{ type: Date },


    blockedAt: {
      type: Date,
    },

    blockReason: {
      type: String,
    },
    field: {
      type: String,
    },

    // CANDIDATE FIELDS ------------------------------------------------------
    candidateData: {
      role: { type: String },
      about: { type: String },
      resume: {
        key: { type: String },
        originalName: { type: String },
        uploadedAt: { type: Date, }
      },
       resumeData: {
    type: ResumeDataSchema
  },
      coverLetters: [{
  jobId: { type:Schema.Types.ObjectId, ref: 'Job' },
  content: String,
  tone: String,
  createdAt: { type: Date, default: Date.now }
}],

      experience: { type: [ExperienceSchema], default: [] },
      skills: { type: [String], default: [] },
      education: { type: [EducationSchema], default: [] },
      portfolioUrl: { type: String },
    },


    // RECRUITER FIELDS ------------------------------------------------------
    recruiterData: {
      company: { type: Schema.Types.ObjectId, ref: "Company" },
      companyApprovalStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
      },
    },
    lastLoginAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = model<IUser>("User", userSchema);
export default UserModel;
