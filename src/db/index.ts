import "server-only";

import { drizzle } from "drizzle-orm/neon-http";

import * as authSchema from "@/db/auth-schema";
import * as catalogSchema from "@/db/schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured.");
}

export const db = drizzle(databaseUrl, {
  schema: {
    ...catalogSchema,
    ...authSchema,
  },
});
