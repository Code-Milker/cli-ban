// src/task/get.ts
import { getTasks } from "../task/get.action";
import { db } from "../lib/db";

async function main() {
  const sections = await getTasks(db);

  // Format as Markdown matching the example
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
}

main();
