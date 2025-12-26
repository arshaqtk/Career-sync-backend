import { JobModel } from "../models/job.model";
import { IJob } from "../types/JobModel.type";
import { QueryFilter } from "mongoose";
import { PipelineStage } from "mongoose";

export const jobRepository = {
  createJob: (data: IJob) => {
    return JobModel.create(data);
  },
  findById: (id: string) => {
    return JobModel.findById(id).lean();
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
    return JobModel.findByIdAndUpdate(id, updateData, { new: true });
  },
  deleteById: (id: string) => {
    return JobModel.findByIdAndDelete(id)
  },
findJobStats: (pipeline: PipelineStage[]): Promise<any[]> => {
  return JobModel.aggregate(pipeline);
}
}