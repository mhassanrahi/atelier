import type { Metadata } from "next";
import Link from "next/link";

import { AccountHeader } from "@/components/auth/account-header";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { SiteFooter } from "@/components/site-footer";
import { requireUser } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Your account — Atelier",
  description: "View your Atelier customer account.",
};

export default async function AccountPage() {
  const session = await requireUser("/account");

  return (
    <div className="min-h-screen">
      <AccountHeader current="account" />
      <main id="main-content" className="page-shell py-14 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,30rem)] lg:items-start lg:gap-24">
          <div>
            <p className="type-label text-ink-muted">Customer account</p>
            <h1 className="type-heading mt-5">Hello, {session.user.name}.</h1>
            <p className="type-body-lg mt-7 max-w-[38rem] text-ink-muted">
              Your Atelier account is ready. Orders and saved pieces will appear here as those experiences are introduced.
            </p>
          </div>

          <section aria-labelledby="account-details-heading" className="border border-line bg-surface p-6 sm:p-9">
            <h2 id="account-details-heading" className="type-subheading">
              Account details
            </h2>
            <dl className="mt-8 divide-y divide-line border-y border-line">
              <div className="py-5">
                <dt className="type-label text-ink-muted">Name</dt>
                <dd className="mt-2">{session.user.name}</dd>
              </div>
              <div className="py-5">
                <dt className="type-label text-ink-muted">Email</dt>
                <dd className="mt-2 break-words">{session.user.email}</dd>
              </div>
              <div className="py-5">
                <dt className="type-label text-ink-muted">Access</dt>
                <dd className="mt-2 capitalize">{session.user.role}</dd>
              </div>
            </dl>
            {session.user.role === "admin" ? (
              <Link className="button button-quiet mt-7" href="/admin">
                Open admin area
              </Link>
            ) : null}
            <div className="mt-7">
              <SignOutButton />
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
