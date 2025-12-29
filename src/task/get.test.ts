// src/task/get.test.ts
import { db } from "../lib/db";
import { tasks, taskAttributes } from "../lib/generated/schema";
import { getTasks } from "./get.action";
import { addTask } from "./add.action";
import { addTaskPayloadSchema } from "./add.validators";

describe("get tasks", () => {
  beforeEach(async () => {
    await db.delete(taskAttributes);
    await db.delete(tasks);
  });

  test("gets empty board", async () => {
    const md = await getTasks();
    expect(md).toBe("");
  });

  test("gets simple tasks", async () => {
    await addTask(
      addTaskPayloadSchema.parse({ category: "Job", title: "Task1" }),
    );
    await addTask(
      addTaskPayloadSchema.parse({
        category: "Project",
        title: "Task2",
        section: "DOING",
      }),
    );
    const md = await getTasks();
    expect(md).toContain("## TODO\n#### Job: Task1");
    expect(md).toContain("## DOING\n#### Project: Task2");
  });

  test("gets with attributes", async () => {
    await addTask(
      addTaskPayloadSchema.parse({
        category: "Project",
        title: "Task with attrs",
        attributes: { goal: ["Test goal"], note: ["Test note"] },
      }),
    );
    const md = await getTasks();
    expect(md).toContain(
      "## TODO\n#### Project: Task with attrs\n- goal: Test goal\n- note: Test note",
    );
  });
});
