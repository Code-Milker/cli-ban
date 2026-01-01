// src/task/get.ts
import { getTasks } from "../task/get.action";
import { db } from "../lib/db";

export async function getKanBanBoard() {
  const sections = await getTasks(db);
  let md = "";
  for (const [section, taskList] of Object.entries(sections)) {
    if (taskList.length === 0) continue;
    md += `# ${section}\n\n`;
    for (const task of taskList) {
      md += `## ${task.category}: ${task.title}\n`;
      // Sort attributes alphabetically by key
      const sortedAttrs = Object.entries(task.attributes).sort((a, b) =>
        a[0].localeCompare(b[0]),
      );
      for (const [key, values] of sortedAttrs) {
        if (values.length === 1) {
          md += `- **${key}**: ${values[0]}\n`;
        } else {
          md += `- **${key}**:\n`;
          for (const value of values) {
            md += `  - ${value}\n`;
          }
        }
      }
      md += "\n"; // Separator for readability
    }
  }
  console.log(md);
}
