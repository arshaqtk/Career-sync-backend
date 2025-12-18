export const InterviewRoundType = {
  NOT_DEFINED: "Not Defined",
  TECHNICAL: "Technical",
  HR: "Hr",
  MANAGERIAL: "Managerial",
} as const;

export type InterviewRoundType =
  (typeof InterviewRoundType)[keyof typeof InterviewRoundType];

export const InterviewStatus = {
  PENDING:"Pending",
  SCHEDULED: "Scheduled",
  RESCHEDULED: "Rescheduled",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const;

export type InterviewStatus =
  (typeof InterviewStatus)[keyof typeof InterviewStatus];

export type InterviewMode =
  "Online" | "Offline"