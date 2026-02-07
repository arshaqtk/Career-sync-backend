export const APPLICATION_STATUS = {
  PENDING: "Pending",
  SHORTLISTED: "Shortlisted",
  REJECTED: "Rejected",
  INTERVIEW: "Interview",
  VIEWED:"Viewed"
} as const;

export type ApplicationStatus =(typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];