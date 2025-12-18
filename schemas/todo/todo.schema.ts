import { z } from "zod";

export const todoBodySchema = z.object({
  title: z
    .string("title is required")
    .min(1, "Title length should be at 1 character length")
    .trim(),
  description: z
    .string("description must be a string")
    .nullable()
    .default(null),
  status: z.boolean().default(false),
  subtasks: z
    .array(
      z.object({
        title: z
          .string("title is required")
          .min(1, "Title length should be at 1 character length")
          .trim(),
        status: z.boolean().default(false),
        _id: z.string().optional(),
      })
    )
    .optional()
    .default([]),
});

export type todoBodyType = z.infer<typeof todoBodySchema>;
