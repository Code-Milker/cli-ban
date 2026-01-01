// src/task/delete.validators.ts
import { z } from "zod";

export const deleteTaskPayloadSchema = z.object({
  id: z.number().int().positive(),
});

export type DeleteTaskPayload = z.infer<typeof deleteTaskPayloadSchema>;
