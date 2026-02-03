export interface IApplyJobDTO {
  jobId: string;
  resumeKey:string,
  resumeOriginalName:string;
  coverLetter?: string;
  experience:string;
  currentRole:string;
  expectedSalary?: number;
  noticePeriod?: string;
}