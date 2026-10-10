import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { getSession } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Create an account — Atelier",
  description: "Create an Atelier customer account.",
};

export default async function SignUpPage() {
  const session = await getSession();

  if (session) {
    redirect("/account");
  }

  return (
    <AuthPageShell
      eyebrow="Customer account"
      title="Begin your account."
      description="Create a private Atelier account with your name, email address, and a secure password."
    >
      <SignUpForm />
    </AuthPageShell>
  );
}
