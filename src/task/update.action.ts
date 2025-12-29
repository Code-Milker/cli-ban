// src/task/update.action.ts
import { db } from "../lib/db";
import { tasks, taskAttributes } from "../lib/generated/schema";
import { eq } from "drizzle-orm";
import {
  UpdateTaskPayload,
  updateTaskPayloadSchema,
} from "./update.validators";

export async function updateTask(payload: UpdateTaskPayload) {
  const result = updateTaskPayloadSchema.safeParse(payload);
  if (!result.success) {
    console.error("Payload validation failed:");
    result.error.issues.forEach((err) => {
      console.error(` - ${err.path.join(".")} -> ${err.message}`);
    });
    throw result.error;
  }

  return db.transaction(async (tx) => {
    const updateData: Partial<typeof tasks.$inferInsert> = {};
    if (payload.category !== undefined) updateData.category = payload.category;
    if (payload.title !== undefined) updateData.title = payload.title;
    if (payload.section !== undefined) updateData.section = payload.section;

    const [updatedTask] = await tx
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, payload.id))
      .returning();

    if (!updatedTask) {
      throw new Error(`Task with ID ${payload.id} not found`);
    }

    console.log(
      `Task updated: ID ${updatedTask.id} - "${updatedTask.title}" (${updatedTask.category}) in ${updatedTask.section}`,
    );

    if (payload.attributes !== undefined) {
      // Delete existing attributes and insert new (full replace)
      await tx
        .delete(taskAttributes)
        .where(eq(taskAttributes.taskId, payload.id));
      if (payload.attributes) {
        const inserts = Object.entries(payload.attributes).flatMap(
          ([key, values]) =>
            values.map((value) => ({ taskId: payload.id, key, value })),
        );
        if (inserts.length > 0) {
          await tx.insert(taskAttributes).values(inserts);
          console.log(` + Updated ${inserts.length} attributes`);
        }
      }
    }

    return updatedTask;
  });
}
