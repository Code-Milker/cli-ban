// src/task/update.cli.ts
import { db } from "../lib/db";
import { updateTask } from "./update.action";
import { UpdateTaskPayload } from "./update.validators";
import { getTasks } from "./get.action";

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
    console.error("Error updating task:", (err as Error).message);
    process.exit(1);
  }
}

main();
