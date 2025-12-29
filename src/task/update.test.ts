// src/task/update.test.ts
import { db } from "../lib/db";
import { tasks, taskAttributes } from "../lib/generated/schema";
import { eq } from "drizzle-orm";
import { addTask } from "./add.action";
import { updateTask } from "./update.action";
import { addTaskPayloadSchema, type AddTaskPayload } from "./add.validators";
import { updateTaskPayloadSchema } from "./update.validators";

describe("update task", () => {
  beforeEach(async () => {
    await db.delete(taskAttributes);
    await db.delete(tasks);
  });

  test("updates a task", async () => {
    const added = await addTask(addTaskPayloadSchema.parse({ category: "Job", title: "Old title" }) as AddTaskPayload);
    await updateTask(updateTaskPayloadSchema.parse({ id: added.id, title: "New title", section: "DOING" }));
    const updatedTasks = await db.select().from(tasks).where(eq(tasks.id, added.id));
    expect(updatedTasks[0].title).toBe("New title");
    expect(updatedTasks[0].section).toBe("DOING");
  });

  test("updates attributes", async () => {
    const added = await addTask(addTaskPayloadSchema.parse({
      category: "Project",
      title: "Test",
      attributes: { note: ["Old"] },
    }) as AddTaskPayload);
    await updateTask(updateTaskPayloadSchema.parse({
      id: added.id,
      attributes: { goal: ["New goal"] },
    }));
    const attrs = await db.select().from(taskAttributes).where(eq(taskAttributes.taskId, added.id));
    expect(attrs).toHaveLength(1);
    expect(attrs[0].key).toBe("goal");
    expect(attrs[0].value).toBe("New goal");
  });

  test("removes attributes if empty", async () => {
    const added = await addTask(addTaskPayloadSchema.parse({
      category: "Project",
      title: "Test",
      attributes: { note: ["Old"] },
    }) as AddTaskPayload);
    await updateTask(updateTaskPayloadSchema.parse({
      id: added.id,
      attributes: {},
    }));
    const attrs = await db.select().from(taskAttributes).where(eq(taskAttributes.taskId, added.id));
    expect(attrs).toHaveLength(0);
  });

  test("fails on invalid input", () => {
    expect(() => updateTaskPayloadSchema.parse({ id: "invalid" })).toThrow();
  });
});
