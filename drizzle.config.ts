import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
  schema: "./src/drizzle-config/schema.ts",
  out: "./drizzle",
});
