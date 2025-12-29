// src/lib/testDb.ts
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

// Reuse init but always in-memory for tests and apply schema
export async function initTestDB() {
  const sqlite = new Database(":memory:");
  // Apply schema
  const schemaUrl = new URL("../../drizzle/schema.sql", import.meta.url);
  const schema = await Bun.file(schemaUrl.pathname).text();
  sqlite.exec(schema);
  return drizzle(sqlite);
}
