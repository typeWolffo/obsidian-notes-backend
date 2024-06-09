import "dotenv/config";
import { z } from "zod";

const client = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  GMAIL_PASSWORD: z.string(),
  GMAIL_USER: z.string().email(),
  API_BASE_PATH: z.string(),
});

type EnvOutput = z.infer<typeof client>;

const metaEnv: Record<keyof EnvOutput, string> = {
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.SECRET_KEY || "",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",
  GMAIL_USER: process.env.GMAIL_USER || "",
  GMAIL_PASSWORD: process.env.GMAIL_PASSWORD || "",
  API_BASE_PATH: process.env.API_BASE_PATH || "",
};

const parsed = client.safeParse(metaEnv);

if (!parsed.success) {
  console.error(
    "❗Invalid environment variables:",
    parsed.error.flatten().fieldErrors
  );
  throw new Error("Invalid environment variables");
}

const env: EnvOutput = parsed.data;

export { env };
