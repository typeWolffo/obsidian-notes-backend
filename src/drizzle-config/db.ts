import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "../env";

const DATABASE_URL = env.DATABASE_URL;

const queryClient = postgres(DATABASE_URL);
export const db = drizzle(queryClient, { schema });
