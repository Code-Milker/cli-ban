import { sqliteTable, AnySQLiteColumn, index, check, integer, text, numeric, foreignKey } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const tasks = sqliteTable("tasks", {
	id: integer().primaryKey({ autoIncrement: true }),
	category: text().notNull(),
	title: text().notNull(),
	section: text().default("TODO").notNull(),
	createdAt: numeric("created_at").default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: numeric("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
},
(table) => [
	index("idx_tasks_section").on(table.section),
	check("tasks_check_1", sql`category IN ('Job', 'Project', 'Health', 'Friend', 'Fun', 'Life'`),
	check("tasks_check_2", sql`section IN ('TODO', 'DOING', 'DONE'`),
	check("task_attributes_check_3", sql`key IN ('goal', 'done', 'remaining', 'note', 'outcome', 'deadline', 'target'`),
]);

export const taskAttributes = sqliteTable("task_attributes", {
	id: integer().primaryKey({ autoIncrement: true }),
	taskId: integer("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" } ),
	key: text().notNull(),
	value: text().notNull(),
},
(table) => [
	index("idx_task_attributes_task_id").on(table.taskId),
	check("tasks_check_1", sql`category IN ('Job', 'Project', 'Health', 'Friend', 'Fun', 'Life'`),
	check("tasks_check_2", sql`section IN ('TODO', 'DOING', 'DONE'`),
	check("task_attributes_check_3", sql`key IN ('goal', 'done', 'remaining', 'note', 'outcome', 'deadline', 'target'`),
]);

