// src/task/get.action.ts
import { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { tasks, taskAttributes } from "../lib/generated/schema";
import { asc, inArray } from "drizzle-orm";

export async function getTasks(db: BunSQLiteDatabase) {
  const allTasks = await db
    .select()
    .from(tasks)
    .orderBy(asc(tasks.section), asc(tasks.category), asc(tasks.title));

  const attributesByTaskId = new Map<number, any[]>();
  if (allTasks.length > 0) {
    const taskIds = allTasks.map((t) => t.id);
    const allAttributes = await db
      .select()
      .from(taskAttributes)
      .where(inArray(taskAttributes.taskId, taskIds));
    for (const attr of allAttributes) {
      if (!attributesByTaskId.has(attr.taskId)) {
        attributesByTaskId.set(attr.taskId, []);
      }
      attributesByTaskId.get(attr.taskId)!.push(attr);
    }
  }

  // Group by section
  const sections: { [key: string]: any[] } = { TODO: [], DOING: [], DONE: [] };
  for (const task of allTasks) {
    const attrs = attributesByTaskId.get(task.id) || [];
    const groupedAttrs: { [key: string]: string[] } = attrs.reduce(
      (
        acc: { [key: string]: string[] },
        { key, value }: { key: string; value: string },
      ) => {
        if (!acc[key]) acc[key] = [];
        acc[key].push(value);
        return acc;
      },
      {},
    );

    sections[task.section].push({ ...task, attributes: groupedAttrs });
  }

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
  console.log(md.trim());
  return md.trim();
}
