import { Types } from "mongoose";
import UserModel from "../models/user.model";
import { AllowedNestedArrayPaths, NestedArrayValueType } from "../types/candidateNestedArrayPaths.type";

export const UserRepository = {
  createUser: (data: any) => {
    
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

  updateNestedArray: <P extends AllowedNestedArrayPaths>( id: string,path: P,value: NestedArrayValueType<P>) => {

    return UserModel.findByIdAndUpdate(id, { $push: { [path]: value } },{ new: true });
  },
};
