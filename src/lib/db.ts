// src/lib/db.ts (updated to parameterize via env)
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

// Centralized init function for reuse
export function initDB(path: string = "db/kanban.db") {
  // Default to main DB
  const sqlite = new Database(path);
  return drizzle(sqlite);
}

// Main DB uses env or default
const dbPath = process.env.DB_PATH || "db/kanban.db";
export const db = initDB(dbPath);
