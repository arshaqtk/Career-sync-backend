import { IJob } from "../types/JobModel.type";
import { jobRepository } from "../repository/job.repository";

export const addJobService = async (data:IJob, userId:string) => {
  data.postedBy = userId;
  return jobRepository.createJob(data);
};