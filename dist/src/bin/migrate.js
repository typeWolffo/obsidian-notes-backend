"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const migrator_1 = require("drizzle-orm/postgres-js/migrator");
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
}
const migrationClient = (0, postgres_1.default)(DATABASE_URL, { max: 1 });
const db = (0, postgres_js_1.drizzle)(migrationClient);
const main = async () => {
    console.log("Migrating database...");
    await (0, migrator_1.migrate)(db, { migrationsFolder: "drizzle" });
    await migrationClient.end();
    console.log("Database migrated successfully!");
};
main();
