import { z } from "zod";

const client = z.object({
  DATABASE_URL: z.string(),
});

type EnvOutput = z.infer<typeof client>;

const metaEnv: Record<keyof EnvOutput, string> = {
  DATABASE_URL: process.env.DATABASE_URL || "",
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
