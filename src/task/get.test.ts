// src/task/get.test.ts
import { tasks, taskAttributes } from "../lib/generated/schema";
import { getTasks } from "./get.action";
import { addTask } from "./add.action";
import { addTaskPayloadSchema } from "./add.validators";
import { initTestDB } from "../lib/testDb";
import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";

let db: BunSQLiteDatabase;

describe("get tasks", () => {
  beforeEach(async () => {
    db = await initTestDB();
  });
  test("gets empty board", async () => {
    const md = await getTasks(db);
    expect(md).toBe("");
  });
  test("gets simple tasks", async () => {
    await addTask(
      addTaskPayloadSchema.parse({ category: "Job", title: "Task1" }),
      db
    );
    await addTask(
      addTaskPayloadSchema.parse({
        category: "Project",
        title: "Task2",
        section: "DOING",
      }),
      db
    );
    const md = await getTasks(db);
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
      db
    );
    const md = await getTasks(db);
    expect(md).toContain(
      "## TODO\n#### Project: Task with attrs\n- goal: Test goal\n- note: Test note",
    );
  });
});
