// src/task/delete.action.ts
import { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { tasks } from "../lib/generated/schema";
import { eq } from "drizzle-orm";
import {
  DeleteTaskPayload,
  deleteTaskPayloadSchema,
} from "./delete.validators";

export async function deleteTask(
  payload: DeleteTaskPayload,
  db: BunSQLiteDatabase,
) {
  const result = deleteTaskPayloadSchema.safeParse(payload);
  if (!result.success) {
    console.error("Payload validation failed:");
    result.error.issues.forEach((err) => {
      console.error(` - ${err.path.join(".")} -> ${err.message}`);
    });
    throw result.error;
  }

  const deleted = await db
    .delete(tasks)
    .where(eq(tasks.id, payload.id))
    .returning();

  if (deleted.length === 0) {
    throw new Error(`Task with ID ${payload.id} not found`);
  }

  console.log(
    `Task deleted: ID ${deleted[0].id} - "${deleted[0].title}" (${deleted[0].category}) in ${deleted[0].section}`,
  );
  return deleted[0];
}
