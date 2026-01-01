import { Schema, model, Types } from "mongoose"

const reportSchema = new Schema(
  {
    entityType: {
      type: String,
      enum: ["job", "recruiter", "candidate"],
      required: true,
    },

    entityId: {
      type: Types.ObjectId,
      required: true,
    },

    reportedBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Resolved"],
      default: "Pending",
    },
  },
  { timestamps: true }
)

export const ReportModel = model("Report", reportSchema)
