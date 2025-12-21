export const InterviewRoundType = {
  TECHNICAL: "Technical",
  HR: "Hr",
  MANAGERIAL: "Managerial",
  FINAL:"Final"
} as const;

export type InterviewRoundType =
  (typeof InterviewRoundType)[keyof typeof InterviewRoundType];

export enum INTERVIEW_STATUS {
  PENDING="Pending",
  SCHEDULED = "Scheduled",
  RESCHEDULED = "Rescheduled",
  IN_PROGRESS = "InProgress",
  COMPLETED = "Completed",
  SELECTED = "Selected",
  REJECTED = "Rejected",
  CANCELLED = "Cancelled",
}
export type InterviewStatus =
  (typeof INTERVIEW_STATUS)[keyof typeof INTERVIEW_STATUS];

export type InterviewMode =
  "Online" | "Offline"