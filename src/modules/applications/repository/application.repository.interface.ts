import { IApplication } from "../types/applicatioModel.types";
import type { UpdateQuery } from "mongoose";
import { FindManyOptions } from "./application.repository.types";

export interface IApplicationRepository {
  create(data: Partial<IApplication>): Promise<IApplication>;
  findById(id: string): Promise<IApplication | null>;
  findOne(filter: Record<string, any>): Promise<IApplication | null>;
  findMany(options?: FindManyOptions): Promise<IApplication[]>;
  update(id: string, data: UpdateQuery<IApplication>): Promise<IApplication | null>;
  remove(id: string): Promise<void>;
}
