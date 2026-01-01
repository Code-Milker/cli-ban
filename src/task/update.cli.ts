// src/task/update.cli.ts
import { db } from "../lib/db";
import { updateTask } from "./update.action";
import { UpdateTaskPayload } from "./update.validators";
import { getTasks } from "./get.action";
import { getKanBanBoard } from "../kanban/get.action";

async function main() {
  const stdin = await Bun.file("/dev/stdin").text();
  let payload: UpdateTaskPayload;
  try {
    payload = JSON.parse(stdin.trim());
  } catch (err) {
    console.error("Invalid JSON input:", (err as Error).message);
    process.exit(1);
  }

  try {
    await updateTask(payload, db);
    getKanBanBoard();
  } catch (err) {
    console.error("Error updating task:", (err as Error).message);
    process.exit(1);
  }
}

main();
