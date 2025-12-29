import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tasks } from "../lib/generated/schema";

const insertTaskSchema = createInsertSchema(tasks, {
  category: z.enum(["Job", "Project", "Health", "Friend", "Fun", "Life"]),
  section: z.enum(["TODO", "DOING", "DONE"]).optional().default("TODO"),
title: z.string().min(1),  // Enforce non-empty
});
// Extended for nested attributes (minimal manual extension since separate table)
export const addTaskPayloadSchema = insertTaskSchema.extend({
  attributes: z
    .record(
      z.enum([
        "goal",
        "done",
        "remaining",
        "note",
        "outcome",
        "deadline",
        "target",
      ] as const),
      z.array(z.string().min(1)).default([]),
    )
    .optional(),
});

export type AddTaskPayload = z.infer<typeof addTaskPayloadSchema>;
