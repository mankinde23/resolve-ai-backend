import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().int().min(1).max(65535).default(3000),

  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
  CORS_ORIGIN: z
    .string()
    .default("http://localhost:5173,http://localhost:9000"),

  ML_SERVICE_URL: z.string().url().default("http://localhost:8000"),

  ML_SERVICE_TIMEOUT_MS: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
