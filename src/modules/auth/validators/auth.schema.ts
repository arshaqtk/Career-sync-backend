import {z} from "zod";

export const registerSchema=z.object({
    name:z.string().min(3),
    email:z.string().email("Please enter a valid email address."),
    password:z.string().min(6,"Password must be at least 6 characters."),
    confirmPassword:z.string().min(6,"Password must be at least 6 characters."),
    role:z.enum(["candidate", "recruiter","admin"]),
    field:z.string().min(1,"Field required")
})

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6),
  role:z.enum(["candidate", "recruiter","admin"])
});

export const passwordSchema=z.object({
  email:z.string().email(),
  resetToken:z.string(),
  password:z.string().min(6,"Password must be at least 6 characters."),
  confirmPassword:z.string().min(6,"Password must be at least 6 characters."),
})