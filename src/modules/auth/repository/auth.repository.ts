import UserModel from "../models/user.model";

export const AuthRepository = {
  createUser: (data: any) => {
    return UserModel.create(data);
  },

  findByEmail: (email: string) => {
    return UserModel.findOne({ email });
  },

  findById: (id: string) => {
    return UserModel.findById(id);
  },
  
  updateByEmail(email: string, updateData: any) {
        return UserModel.updateOne({ email }, { $set: updateData });
    }
};
