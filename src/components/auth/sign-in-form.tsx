"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { authClient } from "@/lib/auth-client";

const inputClassName =
  "mt-2 min-h-12 w-full border border-line-strong bg-surface px-4 text-ink outline-none transition focus:border-ink";

export function SignInForm({ callbackURL }: { callbackURL: string }) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      const { error } = await authClient.signIn.email({ email, password });

      if (error) {
        setErrorMessage("We couldn't sign you in with those details.");
        return;
      }

      router.replace(callbackURL);
      router.refresh();
    } catch {
      setErrorMessage("Sign in is temporarily unavailable. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={isPending}>
      <div>
        <label htmlFor="sign-in-email" className="type-label text-ink-muted">
          Email address
        </label>
        <input
          id="sign-in-email"
          className={inputClassName}
          name="email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          aria-describedby={errorMessage ? "sign-in-error" : undefined}
        />
      </div>
      <div className="mt-6">
        <label htmlFor="sign-in-password" className="type-label text-ink-muted">
          Password
        </label>
        <input
          id="sign-in-password"
          className={inputClassName}
          name="password"
          type="password"
          autoComplete="current-password"
          minLength={8}
          maxLength={128}
          required
          aria-describedby={errorMessage ? "sign-in-error" : undefined}
        />
      </div>
      <div
        id="sign-in-error"
        className="mt-5 min-h-6 text-sm text-[#8b2f2f]"
        role="status"
        aria-live="polite"
      >
        {errorMessage}
      </div>
      <button
        className="button button-primary button-fluid-mobile mt-3 w-full"
        type="submit"
        disabled={isPending}
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
      <p className="mt-6 text-center text-sm text-ink-muted">
        New to Atelier?{" "}
        <Link className="link-inline text-ink" href="/sign-up">
          Create an account
        </Link>
      </p>
    </form>
  );
}
