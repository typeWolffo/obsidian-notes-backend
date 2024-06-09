import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "../drizzle-config/schema";

export type Database = PostgresJsDatabase<typeof schema>;
