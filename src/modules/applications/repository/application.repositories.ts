import { UpdateQuery, } from "mongoose";
import { ApplicationModel } from "../models/application.model";
import { IApplication } from "../types/applicatioModel.types";
import { IApplicationRepository } from "./application.repository.interface";
import { FindByIdOptions, FindManyOptions } from "./application.repository.types";


export const ApplicationRepository = (): IApplicationRepository => {
  
  const create = async (data: Partial<IApplication>): Promise<IApplication> => {
    return await ApplicationModel.create(data);
  };

 const findById = async (options: FindByIdOptions): Promise<any> => {
    const { id, populate, select } = options;

    let query: any = ApplicationModel.findById(id);

    // populate handling
    if (populate) {
      const normalizedPopulate =
        typeof populate === "string"
          ? [{ path: populate }]
          : Array.isArray(populate)
          ? populate.map((p) =>
              typeof p === "string" ? { path: p } : p
            )
          : [populate];

      query = query.populate(normalizedPopulate);
    }

    // select handling
    if (select) query = query.select(select);

    return query.lean().exec(); // Lean returns plain JS object
  };

  const findOne = async (filter: Record<string, any>): Promise<IApplication | null> => {
    return await ApplicationModel.findOne(filter);
  };


  const findMany = async (options: FindManyOptions = {}) => {
    const { filter = {}, sort, limit, populate, select } = options
    let query = ApplicationModel.find(filter);
    if (sort) query = query.sort(sort);
    if (limit) query = query.limit(limit);
        if (populate) {
    const normalizedPopulate =
      typeof populate === "string"
        ? [{ path: populate }]
        : Array.isArray(populate)
        ? populate.map((p) =>
            typeof p === "string" ? { path: p } : p
          )
        : [populate];

    query = query.populate(normalizedPopulate);
  }
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
