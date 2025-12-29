import { sqliteTable, AnySQLiteColumn, index, integer, text, numeric, foreignKey } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const tasks = sqliteTable("tasks", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	category: text("category").notNull(),
	title: text("title").notNull(),
	section: text("section").default("TODO").notNull(),
	createdAt: numeric("created_at").default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: numeric("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
},
(table) => {
	return {
		idxTasksSection: index("idx_tasks_section").on(table.section),
	}
});

export const taskAttributes = sqliteTable("task_attributes", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	taskId: integer("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" } ),
	key: text("key").notNull(),
	value: text("value").notNull(),
},
(table) => {
	return {
		idxTaskAttributesTaskId: index("idx_task_attributes_task_id").on(table.taskId),
	}
});