import { z } from "zod";

export const companyNameValidation = z
  .string({ required_error: "Company Name is required" })
  .min(4, "Company name must be at least 4 characters")
  .max(30, "Company name can not be more than 30 characters");
export const fullNameValidation = z
  .string({ required_error: "Name is required" })
  .min(2, "Name must be at least 2 characters");

export const emailValidation = z
  .string()
  .email({ message: "Invalid email address" });

export const passwordValidation = z
  .string()
  .min(6, { message: "Password must be at least 6 characters" });
export const confirmPasswordValidation = z
  .string()
  .min(6, { message: "Confirm password must be at least 6 characters" });
export const maxUsersValidation = z
  .string()
  .min(1, { message: "There Should be atleast 1 user in the company account" });

export const signUpValidationSchema = z
  .object({
    companyName: companyNameValidation,
    fullName: fullNameValidation,
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: confirmPasswordValidation,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const userFormValidation = z.object({
  companyName: companyNameValidation,
  fullName: fullNameValidation,
  email: emailValidation,
  password: passwordValidation,
});
export const managerFormValidation = z.object({
  companyName: companyNameValidation,
  fullName: fullNameValidation,
  email: emailValidation,
  password: passwordValidation,
  maxUsers: maxUsersValidation,
});
export const adminFormValidation = z.object({
  fullName: fullNameValidation,
  email: emailValidation,
  password: passwordValidation,
});
