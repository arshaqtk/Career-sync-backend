import { CustomError } from "../../../shared/utils/customError";
import { InterviewModel } from "../models/interview.model";
import { FindByIdOptions, FindManyOptions, UpdateByIdOptions } from "../types/interview.repository.types";
import { IInterview } from "../types/interviewModel.types";
import { IInterviewRepository } from "./interviewRepository.interface";

export const InterviewRepository=():IInterviewRepository=>{
    const create=async(data:Partial<IInterview>):Promise<IInterview>=>{
        return await InterviewModel.create(data)
    }
    const findOne=async (filter:Record<string,any>):Promise<IInterview|null>=>{
        return await InterviewModel.findOne(filter)
    }

    const findMany=async (options:FindManyOptions={})=>{
        const {filter={},sort,limit,populate}=options
        let query=InterviewModel.find(filter);
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
        updateByIdAndPopulate
    }
}