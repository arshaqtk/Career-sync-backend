import { IApplication, IApplicationPopulated } from "../types/applicatioModel.types";
import type { QueryFilter, UpdateQuery } from "mongoose";
import { FindByIdOptions, FindManyOptions } from "./application.repository.types";
import { CandidateApplicationDetailResponse } from "../types/ApplicationDetailsResponse.types";

export interface IApplicationRepository {
  create(data: Partial<IApplication>): Promise<IApplication>;
 findById(options: FindByIdOptions):  Promise<IApplication|null>;
  findOne(filter: Record<string, any>): Promise<IApplication | null>;
  findMany(options?: FindManyOptions): Promise<IApplication[]>;
  update(id: string, data: UpdateQuery<IApplication>): Promise<IApplication | null>;
  remove(id: string): Promise<void>;
   getCandidateApplicationDetail(
    applicationId: string
  ): Promise<CandidateApplicationDetailResponse>;
 countByQuery(filter: QueryFilter<IApplication>): Promise<number>
}
