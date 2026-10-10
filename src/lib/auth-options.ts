import type { BetterAuthOptions } from "better-auth";

export const sharedAuthOptions = {
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  user: {
    additionalFields: {
      role: {
        type: ["customer", "admin"],
        required: true,
        defaultValue: "customer",
        input: false,
      },
    },
  },
} satisfies BetterAuthOptions;
