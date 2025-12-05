import z from "zod";

export const updateJobStatusSchema = z.object({
  status: z.enum(["open", "closed", "paused"])
});