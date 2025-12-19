export const InterviewRoundType = {
  NOT_DEFINED: "Not Defined",
  TECHNICAL: "Technical",
  HR: "Hr",
  MANAGERIAL: "Managerial",
} as const;

export type InterviewRoundType =
  (typeof InterviewRoundType)[keyof typeof InterviewRoundType];

export const INTERVIEW_STATUS = {
  PENDING:"Pending",
  SCHEDULED: "Scheduled",
  RESCHEDULED: "Rescheduled",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const;

export type InterviewStatus =
  (typeof INTERVIEW_STATUS)[keyof typeof INTERVIEW_STATUS];

export type InterviewMode =
  "Online" | "Offline"