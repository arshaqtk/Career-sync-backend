import { NotificationModel } from "../../../modules/notification/models/notification.model";
import { CustomError } from "../../../shared/utils/customError";
import { updateRecruiterCompanyDTO, UpdateUserProfileDTO } from "../dtos/user.dto";
import { UserRepository } from "../repository/user.repository"


export const UserService = {

  getOnlineUsers: async () => {
    const users = await UserRepository.findOnlineUserIds()
    return users.map((u) => u._id)
  },
  getProfile: async (id: string) => {
    const notificationCount = await NotificationModel.countDocuments({ recipientId: id, isRead: false });

    // Fetch base user first to determine role
    const baseUser = await UserRepository.findById(id);
    if (!baseUser) throw new CustomError("User not found", 404);

    if (baseUser.role === "recruiter") {
      // For recruiters: populate the company reference so frontend gets full company object
      const user = await UserRepository.findById(id)
        .populate({
          path: "recruiterData.company",
          select: "name logo website location industry size foundedYear description verificationStatus isActive owner",
        });

      return {
        ...user!.toObject(),
        notificationCount,
        candidateData: undefined,
      };
    }

    return {
      ...baseUser.toObject(),
      notificationCount,
      recruiterData: undefined,
    };

  },


  updateUserProfile: async (id: string, dto: UpdateUserProfileDTO) => {
    const updatedUser = await UserRepository.updateById(id, dto)
    return updatedUser
  },

  updateUserAvatar: async (id: string, { key, url }: { key: string, url: string }) => {
    const updatedUser = await UserRepository.updateById(id, {
      profilePicture: {
        key: key,
        url: url,
        updatedAt: new Date(),
      },
    })
    return updatedUser
  },

  updateUserNestedField: async (
    userId: string,
    fieldPath: string,
    value: any
  ) => {
    const updateData: Record<string, any> = {
      [fieldPath]: value,
    };


    const updatedUser = await UserRepository.updateById(userId, updateData);
    return updatedUser;
  },


};

