import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string("Password is required"),
});

export type LoginBodyType = z.infer<typeof loginSchema>;
