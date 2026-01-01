// src/task/delete.cli.ts
import { getKanBanBoard } from "../kanban/get.action";
import { db } from "../lib/db";
import { deleteTask } from "./delete.action";
import { DeleteTaskPayload } from "./delete.validators";
import { getTasks } from "./get.action";

async function main() {
  const stdin = await Bun.file("/dev/stdin").text();
  let payload: DeleteTaskPayload;
  try {
    payload = JSON.parse(stdin.trim());
  } catch (err) {
    console.error("Invalid JSON input:", (err as Error).message);
    process.exit(1);
  }

  try {
    await deleteTask(payload, db);
    getKanBanBoard();
  } catch (err) {
    console.error("Error deleting task:", (err as Error).message);
    process.exit(1);
  }
}

main();
