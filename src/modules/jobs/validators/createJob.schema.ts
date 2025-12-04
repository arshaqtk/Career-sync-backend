import { z } from "zod";

export const createJobSchema = z.object({
  title: z
    .string()
    .min(1, "Job title is required"),

  company: z
    .string()
    .min(1, "Company name is required"),

  description: z.string().optional(),

  skills: z.array(z.string()).optional(),

  experienceMin: z.number().optional(),
  experienceMax: z.number().optional(),

  salary: z.string().optional(),

  location: z.string().optional(),

  remote: z.boolean().optional(),

  jobType: z.enum(["full-time", "part-time", "internship"], {
    // Zod v3 supports this
    message: "Job type is required",
  }),

  status: z.enum(["open", "closed", "paused"]).optional(),
});
