import { QueryFilter, Types, UpdateQuery, } from "mongoose";
import { ApplicationModel } from "../models/application.model";
import { IApplication, IApplicationPopulated } from "../types/applicatioModel.types";
import { IApplicationRepository } from "./application.repository.interface";
import { FindByIdOptions, FindManyOptions } from "./application.repository.types";
import { CandidateApplicationDetailResponse } from "../types/ApplicationDetailsResponse.types";
import { CustomError } from "../../../shared/utils/customError";


export const ApplicationRepository = (): IApplicationRepository => {
  
  const create = async (data: Partial<IApplication>): Promise<IApplication> => {
    return await ApplicationModel.create(data);
  };
//updated this to i application populted
 const findById = async (options: FindByIdOptions): Promise<IApplicationPopulated|null> => {
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
    const { filter = {}, sort, limit, populate,skip } = options

    let query = ApplicationModel.find(filter);
    if (sort) query = query.sort(sort);
    if (skip) query = query.skip(skip);
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
    return query.lean().exec()
  };




  const getCandidateApplicationDetail=async(
    applicationId: string
  ): Promise<CandidateApplicationDetailResponse> => {
    if (!applicationId) {
      throw new CustomError("Application ID not found", 400)
    }

    const pipeline = [
    
      {
        $match: {
          _id: new Types.ObjectId(applicationId),
        },
      },

      
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },

      
      {
        $lookup: {
          from: "users",
          localField: "recruiterId",
          foreignField: "_id",
          as: "recruiter",
        },
      },
      { $unwind: "$recruiter" },

     
      {
        $project: {
          _id: 0,

          application: {
            id: { $toString: "$_id" },
            status: "$status",
            experience: "$experience",
            currentRole: "$currentRole",
            resumeUrl: "$resumeUrl",
            coverLetter: "$coverLetter",
            expectedSalary: "$expectedSalary",
            noticePeriod: "$noticePeriod",
            decisionNote: "$decisionNote",
            appliedAt: "$createdAt",
            updatedAt: "$updatedAt",
          },

          job: {
            id: { $toString: "$job._id" },
            title: "$job.title",
            company: "$job.company",
            description: "$job.description",
            skills: "$job.skills",
            experienceMin: "$job.experienceMin",
            experienceMax: "$job.experienceMax",
            salary: "$job.salary",
            field: "$job.field",
            location: "$job.location",
            remote: "$job.remote",
            jobType: "$job.jobType",
          },

          recruiter: {
            name: "$recruiter.name",
            email: "$recruiter.email",
            id:"$recruiter._id",
            company: {
              companyName: "$recruiter.companyName",
              companyWebsite: "$recruiter.companyWebsite",
              companyLogo: "$recruiter.companyLogo",
              companyLocation: "$recruiter.companyLocation",
              companyDescription: "$recruiter.companyDescription",
            },
          },
        },
      },
    ]

    const result = await ApplicationModel.aggregate(pipeline)

    if (!result.length) {
      throw new CustomError("Application not found", 404)
    }

    return result[0]
}

  const update = async (id: string, data: UpdateQuery<IApplication>): Promise<IApplication | null> => {
    return await ApplicationModel.findByIdAndUpdate(id, data, { new: true });
  };

  const remove = async (id: string): Promise<void> => {
    await ApplicationModel.findByIdAndDelete(id);
  };


  const countByQuery=async (query: QueryFilter<IApplication>) => {
      return ApplicationModel.countDocuments(query); 
    }

  return {
    create,
    findById,
    findOne,
    findMany,
    getCandidateApplicationDetail,
    update,
    remove,
    countByQuery
  };
}
