import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1).default("mongodb://127.0.0.1:27017/sodapops_collectibles"),
  AUTH_SECRET: z.string().min(16).optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  UPLOAD_DIR: z.string().default("./uploads"),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

function normalizeSiteUrl(value: string | undefined): string {
  const trimmed = value?.trim().replace(/\/$/, "");
  if (!trimmed) return "http://localhost:3000";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function getEnv(): Env {
  const candidate = {
    MONGODB_URI: process.env.MONGODB_URI,
    AUTH_SECRET: process.env.AUTH_SECRET,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    NEXT_PUBLIC_SITE_URL: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
    UPLOAD_DIR: process.env.UPLOAD_DIR,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NODE_ENV: process.env.NODE_ENV,
  };

  const parsed = envSchema.safeParse(candidate);
  if (parsed.success) return parsed.data;

  console.error("getEnv:", parsed.error.flatten().fieldErrors);
  return envSchema.parse({
    ...candidate,
    MONGODB_URI: candidate.MONGODB_URI || "mongodb://127.0.0.1:27017/sodapops_collectibles",
    NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    NODE_ENV: "production",
  });
}

export function isStripeConfigured(): boolean {
  const env = getEnv();
  return Boolean(env.STRIPE_SECRET_KEY && env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

export function getSiteUrl(): string {
  try {
    return getEnv().NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  } catch {
    return "https://sodapopscollectibles.vercel.app";
  }
}
