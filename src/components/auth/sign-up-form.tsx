"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { authClient } from "@/lib/auth-client";

const inputClassName =
  "mt-2 min-h-12 w-full border border-line-strong bg-surface px-4 text-ink outline-none transition focus:border-ink";

export function SignUpForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const passwordConfirmation = String(
      formData.get("passwordConfirmation") ?? "",
    );

    if (password !== passwordConfirmation) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsPending(true);

    try {
      const { error } = await authClient.signUp.email({ name, email, password });

      if (error) {
        setErrorMessage("We couldn't create an account with those details.");
        return;
      }

      router.replace("/account");
      router.refresh();
    } catch {
      setErrorMessage("Account creation is temporarily unavailable. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  const errorDescription = errorMessage ? "sign-up-error" : undefined;

  return (
    <form onSubmit={handleSubmit} aria-busy={isPending}>
      <div>
        <label htmlFor="sign-up-name" className="type-label text-ink-muted">
          Full name
        </label>
        <input
          id="sign-up-name"
          className={inputClassName}
          name="name"
          type="text"
          autoComplete="name"
          minLength={2}
          maxLength={100}
          required
          aria-describedby={errorDescription}
        />
      </div>
      <div className="mt-6">
        <label htmlFor="sign-up-email" className="type-label text-ink-muted">
          Email address
        </label>
        <input
          id="sign-up-email"
          className={inputClassName}
          name="email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          aria-describedby={errorDescription}
        />
      </div>
      <div className="mt-6">
        <label htmlFor="sign-up-password" className="type-label text-ink-muted">
          Password
        </label>
        <input
          id="sign-up-password"
          className={inputClassName}
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={128}
          required
          aria-describedby="password-requirements"
        />
        <p id="password-requirements" className="mt-2 text-xs text-ink-muted">
          Use 8 to 128 characters.
        </p>
      </div>
      <div className="mt-6">
        <label
          htmlFor="sign-up-password-confirmation"
          className="type-label text-ink-muted"
        >
          Confirm password
        </label>
        <input
          id="sign-up-password-confirmation"
          className={inputClassName}
          name="passwordConfirmation"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={128}
          required
          aria-describedby={errorDescription}
        />
      </div>
      <div
        id="sign-up-error"
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
        {isPending ? "Creating account..." : "Create account"}
      </button>
      <p className="mt-6 text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link className="link-inline text-ink" href="/sign-in">
          Sign in
        </Link>
      </p>
    </form>
  );
}
