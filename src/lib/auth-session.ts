import "server-only";

import { headers } from "next/headers";
import { forbidden, redirect } from "next/navigation";
import { cache } from "react";

import { auth } from "@/lib/auth";

type ProtectedPath = "/account" | "/admin";

export const getSession = cache(async () =>
  auth.api.getSession({
    headers: await headers(),
  }),
);

export async function requireUser(callbackURL: ProtectedPath = "/account") {
  const session = await getSession();

  if (!session) {
    redirect(`/sign-in?callbackURL=${encodeURIComponent(callbackURL)}`);
  }

  return session;
}

export async function requireAdmin() {
  const session = await requireUser("/admin");

  if (session.user.role !== "admin") {
    forbidden();
  }

  return session;
}
