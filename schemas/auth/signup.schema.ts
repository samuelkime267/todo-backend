import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z
      .string("Name must be a string")
      .trim()
      .min(3, "Name must be at least 3 characters"),

    email: z.email("Invalid email address").trim(),

    password: z
      .string("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(72, "Password too long"),

    confirmPassword: z.string("Confirm Password is required").trim(),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpBodyType = z.infer<typeof signUpSchema>;
