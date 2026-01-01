// src/task/add.cli.ts
import { getKanBanBoard } from "../kanban/get.action";
import { db } from "../lib/db";
import { addTask } from "./add.action";
import { AddTaskPayload } from "./add.validators";
import { getTasks } from "./get.action";

async function main() {
  const stdin = await Bun.file("/dev/stdin").text();
  let payload: AddTaskPayload;
  try {
    payload = JSON.parse(stdin.trim());
  } catch (err) {
    console.error("Invalid JSON input:", (err as Error).message);
    process.exit(1);
  }
  try {
    await addTask(payload, db);
    getKanBanBoard();
  } catch (err) {
    console.error("Error adding task:", (err as Error).message);
    process.exit(1);
  }
}
main();
