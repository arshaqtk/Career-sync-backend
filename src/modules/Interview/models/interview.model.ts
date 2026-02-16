import { model, Schema } from "mongoose";
import { IInterview } from "../types/interviewModel.types";
import { InterviewStatusHistorySchema } from "./interviewHistory.schema";
import { INTERVIEW_STATUS, InterviewRoundType, InterviewStatus } from "../types/interview.type";


const interviewSchema = new Schema<IInterview>(
  {
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // interviewerIds: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "User",
    //     required: true,
    //   },
    // ],

    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    roundNumber: {
      type: Number,
      required: true,
    },
    roundType: {
      type: Schema.Types.String,
      enum: Object.values(InterviewRoundType),
      default: InterviewRoundType.HR,
    },

    startTime: {
      type: Date,
    },

    endTime: {
      type: Date,
    },



    status: {
      type: Schema.Types.String,
      enum: Object.values(INTERVIEW_STATUS),
      default: INTERVIEW_STATUS.PENDING,
    },
    statusHistory: {
      type: [InterviewStatusHistorySchema],
      default: [],
    },

    mode: {
      type: String,
      enum: ["Online", "Offline"],
    },

    meetingLink: {
      type: String,
      required: function () {
        return this.mode === "Online";
      },
    },
    location: {
      type: String,
      required: function () {
        return this.mode === "Offline";
      },
    },
    interviewerEmail: {
      type: String
    },
    interviewerName: {
      type: String
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
interviewSchema.index({ candidateId: 1, startTime: 1 });
export const InterviewModel = model<IInterview>("Interview", interviewSchema)
