// src/createDb.ts (renamed from createKanBan.ts for generality)
import { Database } from "bun:sqlite";

// Use env for DB path (e.g., DB_PATH=db/newboard.db bun src/createDb.ts)
const dbPath = process.env.DB_PATH || "db/kanban.db";
const schemaUrl = new URL("../drizzle/schema.sql", import.meta.url);
const dbDirUrl = new URL(
  `../${dbPath.split("/").slice(0, -1).join("/")}`,
  import.meta.url,
); // Extract dir

const schemaPath = schemaUrl.pathname;
const fullDbPath = new URL(`../${dbPath}`, import.meta.url).pathname;

// Ensure dir exists
(await Bun.file(dbDirUrl).exists()) ||
  (await Bun.$`mkdir -p ${dbDirUrl.pathname}`);

console.log(`Creating/applying database schema at ${fullDbPath}...`);

// Read schema
const schema = await Bun.file(schemaPath).text();

// Apply
const sqlite = new Database(fullDbPath);
sqlite.exec(schema);
console.log("✓ Database created and schema applied!");
sqlite.close();
