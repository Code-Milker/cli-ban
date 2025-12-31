// src/task/add.ts
import { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { tasks, taskAttributes } from "../lib/generated/schema";
import { AddTaskPayload, addTaskPayloadSchema } from "./add.validators";
// Auto-generated Zod schema from introspected DB
export async function addTask(payload: AddTaskPayload, db: BunSQLiteDatabase) {
  const result = addTaskPayloadSchema.safeParse(payload);
  if (!result.success) {
    console.error("Payload validation failed:");
    result.error.issues.forEach((err) => {
      console.error(` - ${err.path.join(".")} -> ${err.message}`);
    });
    throw result.error;
  }
  return db.transaction(async (tx) => {
    // Wrap in transaction for atomicity
    const [newTask] = await tx
      .insert(tasks)
      .values({
        category: payload.category,
        title: payload.title,
        section: payload.section,
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
        await tx.insert(taskAttributes).values(inserts);
        console.log(` + Added ${inserts.length} attributes`);
      }
    }
    return newTask; // Return for testing
  });
}
