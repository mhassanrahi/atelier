"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSignOut() {
    setErrorMessage(null);
    setIsPending(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        setErrorMessage("We couldn't sign you out. Please try again.");
        return;
      }

      router.replace("/sign-in");
      router.refresh();
    } catch {
      setErrorMessage("Sign out is temporarily unavailable. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        className="button button-secondary"
        onClick={handleSignOut}
        disabled={isPending}
      >
        {isPending ? "Signing out..." : "Sign out"}
      </button>
      <p className="mt-3 text-sm text-[#8b2f2f]" role="status" aria-live="polite">
        {errorMessage}
      </p>
    </div>
  );
}
