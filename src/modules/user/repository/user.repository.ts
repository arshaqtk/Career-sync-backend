import { QueryFilter, Types } from "mongoose";
import UserModel, { IUser } from "../models/user.model";
import { AllowedNestedArrayPaths, NestedArrayValueType } from "../types/candidateNestedArrayPaths.type";
import { CreateUserDTO } from "../types/user.repository.types";


export const UserRepository = {
  createUser: (data:CreateUserDTO) => {
    
    return UserModel.create(data);
  },
  findByEmail: (email: string) => {

    return UserModel.findOne({ email });
  },

  findById: (id: string) => {

    return UserModel.findById(id);
  },

  updateByEmail: (email: string, updateData: any) => {

    return UserModel.updateOne({ email }, { $set: updateData });
  },

  updateById: (id: string | Types.ObjectId, updateData: any) => {
    return UserModel.findByIdAndUpdate(id, { $set: updateData }, { new: true });
  },

   removeFieldById: (id: string | Types.ObjectId, updateData: any) => {
    return UserModel.findByIdAndUpdate(id, { $unset: updateData }, { new: true });
  },

  updateNestedArray: <P extends AllowedNestedArrayPaths>( id: string,path: P,value: NestedArrayValueType<P>) => {
    return UserModel.findByIdAndUpdate(id, { $push: { [path]: value } },{ new: true });

  },
  
  updateExperience:(userId: string, experienceId: string, updates: Record<string, any>)=>{
    console.log(userId,experienceId,updates)
    return UserModel.findOneAndUpdate( {_id: userId,  "candidateData.experience._id": experienceId},{$set: updates},
    {
      new: true
    });
  },

  updateEducation:(userId: string, educationId: string, updates: Record<string, any>)=>{
    console.log(userId,educationId,updates)
    return UserModel.findOneAndUpdate( {_id: userId,  "candidateData.education._id": educationId},{$set: updates},
    {
      new: true
    });
  },
findByQuery: (query: QueryFilter<IUser>) => {
     return UserModel.find(query)
   },
   countByQuery: (query: QueryFilter<IUser>) => {
      return UserModel.countDocuments(query); 
    },

};
