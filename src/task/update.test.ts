// src/task/update.test.ts
import { tasks, taskAttributes } from "../lib/generated/schema";
import { eq } from "drizzle-orm";
import { addTask } from "./add.action";
import { updateTask } from "./update.action";
import { addTaskPayloadSchema, type AddTaskPayload } from "./add.validators";
import { updateTaskPayloadSchema } from "./update.validators";
import { initTestDB } from "../lib/testDb";
import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
let db: BunSQLiteDatabase;
describe("update task", () => {
  beforeEach(async () => {
    db = await initTestDB();
  });
  test("updates a task", async () => {
    const added = await addTask(
      addTaskPayloadSchema.parse({
        category: "Job",
        title: "Old title",
      }) as AddTaskPayload,
      db,
    );
    await updateTask(
      updateTaskPayloadSchema.parse({
        id: added.id,
        title: "New title",
        section: "DOING",
      }),
      db,
    );
    const updatedTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, added.id));
    expect(updatedTasks[0].title).toBe("New title");
    expect(updatedTasks[0].section).toBe("DOING");
  });
  test("updates attributes", async () => {
    const added = await addTask(
      addTaskPayloadSchema.parse({
        category: "Project",
        title: "Test",
        attributes: { note: ["Old"] },
      }) as AddTaskPayload,
      db,
    );
    await updateTask(
      updateTaskPayloadSchema.parse({
        id: added.id,
        attributes: { goal: ["New goal"] },
      }),
      db,
    );
    const attrs = await db
      .select()
      .from(taskAttributes)
      .where(eq(taskAttributes.taskId, added.id));
    expect(attrs).toHaveLength(1);
    expect(attrs[0].key).toBe("goal");
    expect(attrs[0].value).toBe("New goal");
  });
  test("removes attributes if empty", async () => {
    const added = await addTask(
      addTaskPayloadSchema.parse({
        category: "Project",
        title: "Test",
        attributes: { note: ["Old"] },
      }) as AddTaskPayload,
      db,
    );
    await updateTask(
      updateTaskPayloadSchema.parse({
        id: added.id,
        attributes: {},
      }),
      db,
    );
    const attrs = await db
      .select()
      .from(taskAttributes)
      .where(eq(taskAttributes.taskId, added.id));
    expect(attrs).toHaveLength(0);
  });
  test("fails on invalid input", async () => {
    const invalidInput = { id: "invalid" };
    expect(() => updateTaskPayloadSchema.parse(invalidInput)).toThrow();
    const addedTasks = await db.select().from(tasks);
    expect(addedTasks).toHaveLength(0);
  });
});
