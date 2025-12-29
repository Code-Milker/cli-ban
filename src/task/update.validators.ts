// src/task/update.validators.ts
import { z } from "zod/v4";
import { addTaskPayloadSchema } from "./add.validators";

export const updateTaskPayloadSchema = z.object({
  id: z.number().int().positive(),
  category: addTaskPayloadSchema.shape.category.optional(),
  title: addTaskPayloadSchema.shape.title.optional(),
  section: addTaskPayloadSchema.shape.section.optional(),
  attributes: addTaskPayloadSchema.shape.attributes.optional(), // Full replace
});

export type UpdateTaskPayload = z.infer<typeof updateTaskPayloadSchema>;
