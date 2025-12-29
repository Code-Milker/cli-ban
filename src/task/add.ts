// src/task/add.ts
import { db } from "../lib/db";
import { tasks, taskAttributes } from "../lib/generated/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
// Auto-generated Zod schema from introspected DB
const insertTaskSchema = createInsertSchema(tasks, {
  category: z.enum(["Job", "Project", "Health", "Friend", "Fun", "Life"]),
  section: z.enum(["TODO", "DOING", "DONE"]),
});
// Extended for nested attributes (minimal manual extension since separate table)
const addTaskPayloadSchema = insertTaskSchema.extend({
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
type AddTaskPayload = z.infer<typeof addTaskPayloadSchema>;
export async function addTaskFromInput(rawInput: string) {
  let payload: AddTaskPayload;
  try {
    payload = addTaskPayloadSchema.parse(JSON.parse(rawInput.trim() || "{}"));
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation failed:");

      error.issues.forEach((err) => {
        console.error(` - ${err.path.join(".")} -> ${err.message}`);
      });
    } else {
      console.error("Invalid JSON input.");
      console.error(
        '\nExample: {"category": "Job", "title": "System design practice", "section": "DOING", "attributes": {"goal": ["Record interview"]}}',
      );
    }
    throw error; // Throw for test handling
  }
  const [newTask] = await db
    .insert(tasks)
    .values({
      category: payload.category,
      title: payload.title,
      section: payload.section || "TODO",
    })
    .returning();
  console.log(
    `Task added: ID ${newTask.id} - "${newTask.title}" (${newTask.category}) in ${newTask.section}`,
  );
  if (payload.attributes) {
    const inserts = Object.entries(payload.attributes).flatMap(
      ([key, values]) =>
        values.map((value) => ({ taskId: newTask.id, key, value })),
    );
    if (inserts.length > 0) {
      await db.insert(taskAttributes).values(inserts);
      console.log(` + Added ${inserts.length} attributes`);
    }
  }
  return newTask; // Return for testing
}
