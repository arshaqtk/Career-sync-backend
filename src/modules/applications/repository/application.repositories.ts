import { UpdateQuery, } from "mongoose";
import { ApplicationModel } from "../models/application.model";
import { IApplication } from "../types/applicatioModel.types";
import { IApplicationRepository } from "./application.repository.interface";
import { FindManyOptions } from "./application.repository.types";


export const ApplicationRepository = (): IApplicationRepository => {
  const create = async (data: Partial<IApplication>): Promise<IApplication> => {
    return await ApplicationModel.create(data);
  };

  const findById = async (id: string): Promise<IApplication | null> => {
    return await ApplicationModel.findById(id);
  };

  const findOne = async (filter: Record<string, any>): Promise<IApplication | null> => {
    return await ApplicationModel.findOne(filter);
  };


  const findMany = async (options: FindManyOptions = {}) => {
    const { filter = {}, sort, limit, populate, select } = options
    let query = ApplicationModel.find(filter);
    if (sort) query = query.sort(sort);
    if (limit) query = query.limit(limit);
    if (populate) query = query.populate(populate);
    return query.exec();
  };

  const update = async (id: string, data: UpdateQuery<IApplication>): Promise<IApplication | null> => {
    return await ApplicationModel.findByIdAndUpdate(id, data, { new: true });
  };

  const remove = async (id: string): Promise<void> => {
    await ApplicationModel.findByIdAndDelete(id);
  };

  return {
    create,
    findById,
    findOne,
    findMany,
    update,
    remove
  };
};
