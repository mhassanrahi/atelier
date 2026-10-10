import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { SignInForm } from "@/components/auth/sign-in-form";
import { getSafeCallbackURL } from "@/lib/auth-redirect";
import { getSession } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Sign in — Atelier",
  description: "Sign in to your Atelier customer account.",
};

type SignInPageProps = {
  searchParams: Promise<{
    callbackURL?: string | string[];
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const callbackURL = getSafeCallbackURL((await searchParams).callbackURL);
  const session = await getSession();

  if (session) {
    redirect(callbackURL);
  }

  return (
    <AuthPageShell
      eyebrow="Customer account"
      title="Welcome back."
      description="Sign in to continue to your account and keep your Atelier experience close at hand."
    >
      <SignInForm callbackURL={callbackURL} />
    </AuthPageShell>
  );
}
