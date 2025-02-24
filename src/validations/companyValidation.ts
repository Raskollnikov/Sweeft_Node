import { z } from "zod";

export const companySchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name must be less than 100 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters").max(20, "Password must be less than 20 characters"),
    country: z.string().min(3, "Country name must be at least 3 characters"),
    industry: z.string().min(3, "Industry name must be at least 3 characters"),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

export const updateCompanySchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name must be less than 100 characters").optional(),
    country: z.string().min(3, "Country name must be at least 3 characters").optional(),
    industry: z.string().min(3, "Industry name must be at least 3 characters").optional(),
});

export const changePasswordSchema = z.object({
    oldPassword: z.string().min(6, "Old password must be at least 6 characters"),
    newPassword: z.string()
        .min(6, "New password must be at least 6 characters")
        .max(20, "New password must be less than 20 characters")
});