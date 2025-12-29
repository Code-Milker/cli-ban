// src/task/add.test.ts
import { db } from "../lib/db";
import { tasks, taskAttributes } from "../lib/generated/schema";
import { eq } from "drizzle-orm";
import { addTask } from "./add.action"; // Import the exported function
import { addTaskPayloadSchema, type AddTaskPayload } from "./add.validators";
describe("add task script", () => {
  beforeEach(async () => {
    // Clear tables before each test
    await db.delete(taskAttributes);
    await db.delete(tasks);
  });
  test("adds a simple task", async () => {
    const payload: AddTaskPayload = addTaskPayloadSchema.parse({
      category: "Job",
      title: "Test task",
    });
    await addTask(payload);
    const addedTasks = await db.select().from(tasks);
    expect(addedTasks).toHaveLength(1);
    expect(addedTasks[0].category).toBe("Job");
    expect(addedTasks[0].title).toBe("Test task");
    expect(addedTasks[0].section).toBe("TODO");
  });
  test("adds a task with attributes", async () => {
    const payload: AddTaskPayload = addTaskPayloadSchema.parse({
      category: "Project",
      title: "Test project",
      section: "DOING",
      attributes: { goal: ["Achieve something"], note: ["Important"] },
    });
    await addTask(payload);
    const addedTasks = await db.select().from(tasks);
    expect(addedTasks).toHaveLength(1);
    expect(addedTasks[0].section).toBe("DOING");
    const addedAttributes = await db
      .select()
      .from(taskAttributes)
      .where(eq(taskAttributes.taskId, addedTasks[0].id));
    expect(addedAttributes).toHaveLength(2);
    expect(addedAttributes.find((a) => a.key === "goal")?.value).toBe(
      "Achieve something",
    );
    expect(addedAttributes.find((a) => a.key === "note")?.value).toBe(
      "Important",
    );
  });
  test("fails on invalid input", async () => {
    const invalidInput = { category: "Invalid", title: "" };
    expect(() => addTaskPayloadSchema.parse(invalidInput)).toThrow();
    const addedTasks = await db.select().from(tasks);
    expect(addedTasks).toHaveLength(0);
  });
});
