import { model, Schema } from "mongoose";
import { IInterview } from "../types/interviewModel.types";
import { InterviewStatusHistorySchema } from "./interviewHistory.schema";
import { InterviewRoundType, InterviewStatus } from "../types/interview.type";


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

    roundType: {
       type: Schema.Types.String,
        enum: Object.values(InterviewRoundType),
      default: InterviewRoundType.NOT_DEFINED,
    },

    startTime: {
      type: Date,
    },

    endTime: {
      type: Date,
    },

    durationMinutes: {
      type: Number,
      min: 1,
    },

    status: {
      type: Schema.Types.String,
      enum: Object.values(InterviewStatus),
      default: InterviewStatus.PENDING,
    },
    statusHistory: {
      type: [InterviewStatusHistorySchema],
      default: [],
    },

    mode: { 
      type: String,
      enum: ["Online" , "Offline"],
    },

    meetingLink: {
      type: String,
      trim: true,
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

export const InterviewModel=model<IInterview>("Interview",interviewSchema)


// interviewSchema.pre("save", function (next) {
//   // auto calculate duration if not provided
//   if (!this.durationMinutes && this.startTime && this.endTime) {
//     const diff =
//       (this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60);
//     this.durationMinutes = Math.max(Math.round(diff), 1);
//   }

//   // mode-based validation
//   if (this.mode === "external_link" && !this.externalLink) {
//     return next(new Error("External link is required for external_link mode"));
//   }

//   if (this.mode === "webrtc" && !this.webrtcRoomId) {
//     return next(new Error("WebRTC roomId is required for webrtc mode"));
//   }

//   next();
// });