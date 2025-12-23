import { Types } from "mongoose";
import { CustomError } from "../../../shared/utils/customError";
import { InterviewModel } from "../models/interview.model";
import { FindByIdOptions, FindLatestByActorOptions, FindManyOptions, UpdateByIdOptions } from "../types/interview.repository.types";
import { IInterview } from "../types/interviewModel.types";
import { IInterviewRepository } from "./interviewRepository.interface";
import { buildLookupStages } from "./buildLookupStages";
import { normalizeFilterIds } from "./normalizeFIlter";

export const InterviewRepository=():IInterviewRepository=>{
    const create=async(data:Partial<IInterview>):Promise<IInterview>=>{
        return await InterviewModel.create(data)
    }
    const findOne=async (filter:Record<string,any>):Promise<IInterview|null>=>{
        return await InterviewModel.findOne(filter)
    }

    const findMany=async (options:FindManyOptions={})=>{
        const {filter={},sort,limit,populate}=options
        console.log(filter)
        let query= InterviewModel.find(filter);

        if(sort) query=query.sort(sort);
        if(limit) query=query.limit(limit);
        if(populate){
          const normalizedPopulate=typeof populate=="string"?
          [{path:populate}]:Array.isArray(populate)?populate.map(
            (p)=>typeof p==="string"?{path:p}:p):[populate]
            
            query =query.populate(normalizedPopulate)
          }
          
        return query.exec();
    
    }

    const findById=async(options:FindByIdOptions)=>{
        const {id,populate,select}=options
        let query:any=InterviewModel.findById(id);

        if(populate){
             const normalizedPopulate=typeof populate=="string"?
            [{path:populate}]:Array.isArray(populate)?populate.map(
                (p)=>typeof p==="string"?{path:p}:p):[populate]

                query =query.populate(normalizedPopulate)
        }

        if(select){
            query=query.select(select);
        }

        return query.lean().exec();
    }

   const updateById = async (id: string, updateData: any):Promise<IInterview|null> => {
  const updated= InterviewModel.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );
   
  return updated
};

 const findLatestRound = async (applicationId: string) => {
  return InterviewModel.findOne({
    applicationId,
    status: { $in: ["Scheduled", "InProgress", "Completed"] },
  })
    .sort({ roundNumber: -1 })
    .exec();
};


const findLatestByActor = async ({
  actorField,
  actorId,
  filter = {},
  populate,
  sort = { createdAt: -1 },
  skip = 0,
  limit = 10,
}: FindLatestByActorOptions): Promise<IInterview[]> => {
const actorObjectId =
    typeof actorId === "string" ? new Types.ObjectId(actorId) : actorId;

  const normalizedFilter = normalizeFilterIds(filter);
  
  return InterviewModel.aggregate<IInterview>([
    {
      $match: {
        [actorField]: actorObjectId,
        ...normalizedFilter,
      },
    },
    { $sort: { roundNumber: -1 } },
    {
      $group: {
        _id: "$applicationId",
        interview: { $first: "$$ROOT" },
      },
    },
    { $replaceRoot: { newRoot: "$interview" } },

    ...buildLookupStages(populate),

    { $sort: sort },
    { $skip: skip },
    { $limit: limit },
  ]);


// return InterviewModel.aggregate([
//   {
//     $match: {
//       recruiterId: new Types.ObjectId(actorId),
//     },
//   },{ $sort: { roundNumber: -1 } },
//   {
//     $group: {
//       _id: "$applicationId",
//       interview: { $first: "$$ROOT" },
//     },
//   },{ $replaceRoot: { newRoot: "$interview" } }
// ]);
};




const updateByIdAndPopulate = async (id: string,options: UpdateByIdOptions<IInterview>): Promise<IInterview | null> => {

  const { updateData, populate,select } = options;

  let query = InterviewModel.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

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

  if(select){
            query=query.select(select);
        }



  return query.exec();
};
    
    return {
        create,
        findOne,
        findMany,
        findById,
        updateById,
        updateByIdAndPopulate,
        findLatestRound,
        findLatestByActor
    }
}