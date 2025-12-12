import { PopulateOptions } from "mongoose";

export interface FindManyOptions {
  filter?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
  limit?: number;
  populate?: string | string[] | PopulateOptions | PopulateOptions[];
  select?: string | Record<string, 1 | 0>;
}