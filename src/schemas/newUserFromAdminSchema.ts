import { z } from "zod";

export const newUserFromAdminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  companyName: z
    .string()
    .min(4, "Company name must be at least 4 characters")
    .max(30, "Company name can not be more than 30 characters"),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  role: z
    .string()
    .min(4, "Role must be atleast 4 characters")
    .max(7, "Role can not exceed 7 characters"),
});
