// src/createKanBan.ts

import { Database } from "bun:sqlite";

// Resolve absolute paths relative to this script's location
const schemaUrl = new URL("../drizzle/schema.sql", import.meta.url);
const dbDirUrl = new URL("../db", import.meta.url); // projectroot/db/
const dbUrl = new URL("../db/kanban.db", import.meta.url); // projectroot/db/kanban.db

const schemaPath = schemaUrl.pathname;
const dbPath = dbUrl.pathname;

// Ensure the db directory exists (Bun doesn't create dirs automatically)
(await Bun.file(dbDirUrl).exists()) ||
  (await Bun.$`mkdir -p ${dbDirUrl.pathname}`);

console.log("Creating/applying Kanban database schema...");
console.log(`Database: ${dbPath}`);
console.log(`Schema:   ${schemaPath}\n`);

// Read schema using Bun's native API
const schema = await Bun.file(schemaPath).text();

// Open (or create) the SQLite database in db/
const sqlite = new Database(dbPath);

// Apply the schema (safe to run multiple times thanks to IF NOT EXISTS)
sqlite.exec(schema);

console.log("✓ db/kanban.db created and schema applied successfully!");
sqlite.close();
