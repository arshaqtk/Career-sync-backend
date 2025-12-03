import z from "zod";

export const updateUserProfileSchema = z.object({
  name: z.string().min(4).optional(),
  phone: z.string().min(10).max(15).optional(),
//   profilePictureUrl: z.string().url().optional(),
});
export type UpdateUserProfileDTO = z.infer<typeof updateUserProfileSchema>;