// src/task/delete.cli.ts
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
    const sections = await getTasks(db);
    // Format as Markdown matching your get.action.ts
    let md = "";
    for (const [section, taskList] of Object.entries(sections)) {
      if (taskList.length === 0) continue;
      md += `## ${section}\n`;
      for (const task of taskList) {
        md += `#### ${task.category}: ${task.title}\n`;
        for (const [key, values] of Object.entries(task.attributes)) {
          for (const value of values) {
            md += `- ${key}: ${value}\n`;
          }
        }
      }
    }
    console.log(md);
  } catch (err) {
    console.error("Error deleting task:", (err as Error).message);
    process.exit(1);
  }
}

main();
