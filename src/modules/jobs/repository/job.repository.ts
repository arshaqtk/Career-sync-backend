import { JobModel } from "../models/job.model";
import { IJob } from "../types/JobModel.type";
import { QueryFilter } from "mongoose";

export const jobRepository = {
  createJob: (data: IJob) => {
    return JobModel.create(data);
  },
  findById: (id: string) => {
    return JobModel.findById(id)
  },
  findByQuery: (query: QueryFilter<IJob>) => {
    return JobModel.find(query)
  },
  findOneByQuery: (query: QueryFilter<IJob>) => {
    return JobModel.findOne(query)
  },
  countByQuery: (query: QueryFilter<IJob>) => {
    return JobModel.countDocuments(query);
  },
  updateById: (id: string, updateData: any) => {
    return JobModel.findByIdAndUpdate(id, { $set: updateData }, { new: true });
  },
  deleteById: (id: string) => {
    return JobModel.findByIdAndDelete(id)
  }
}