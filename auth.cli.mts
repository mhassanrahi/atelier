import { betterAuth } from "better-auth";

import { sharedAuthOptions } from "./src/lib/auth-options";

export const auth = betterAuth(sharedAuthOptions);
