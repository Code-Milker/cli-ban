import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite", // Required
  dbCredentials: {
    url: "./db/kanban.db", // Path to your actual DB file
  },
  out: "./src/lib/generated", // Where generated TS files go
});
