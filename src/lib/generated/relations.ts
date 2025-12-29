import { relations } from "drizzle-orm/relations";
import { tasks, taskAttributes } from "./schema";

export const taskAttributesRelations = relations(taskAttributes, ({one}) => ({
	task: one(tasks, {
		fields: [taskAttributes.taskId],
		references: [tasks.id]
	}),
}));

export const tasksRelations = relations(tasks, ({many}) => ({
	taskAttributes: many(taskAttributes),
}));