import { z } from "zod";

export const updateJobSchema = z.object({
  title: z.string().min(1).optional(),
  company: z.string().min(1).optional(),

  description: z.string().optional(),

  skills: z.array(z.string()).optional(),

  experienceMin: z.number().optional(),
  experienceMax: z.number().optional(),
 field:z.string().optional(),
  salary: z.string().optional(),

  location: z.string().optional(),

  remote: z.boolean().optional(),

  jobType: z.enum(["full-time", "part-time", "internship"]).optional(),

});
