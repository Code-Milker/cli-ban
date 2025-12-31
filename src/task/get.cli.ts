// src/task/get.cli.ts
import { db } from "../lib/db";
import { getTasks } from "./get.action";

async function main() {
  try {
    const sections = await getTasks(db);
    // Flatten all tasks into a list
    const allTasks = Object.values(sections).flat();
    console.log(JSON.stringify(allTasks, null, 2));
  } catch (err) {
    console.error("Error listing tasks:", (err as Error).message);
    process.exit(1);
  }
}

main();
