import "server-only";

import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";

import { db } from "@/db";
import * as authSchema from "@/db/auth-schema";
import { sharedAuthOptions } from "@/lib/auth-options";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  ...sharedAuthOptions,
});
