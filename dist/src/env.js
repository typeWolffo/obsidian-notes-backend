"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const client = zod_1.z.object({
    DATABASE_URL: zod_1.z.string(),
});
const metaEnv = {
    DATABASE_URL: process.env.DATABASE_URL || "",
};
const parsed = client.safeParse(metaEnv);
if (!parsed.success) {
    console.error("❗Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
}
const env = parsed.data;
exports.env = env;
