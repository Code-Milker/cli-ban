import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

// Use absolute path resolution to avoid relative path issues in tests/scripts
const dbUrl = new URL("../../db/kanban.db", import.meta.url);
const dbPath = dbUrl.pathname;

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite);
