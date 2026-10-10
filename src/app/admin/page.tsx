import type { Metadata } from "next";
import Link from "next/link";

import { AccountHeader } from "@/components/auth/account-header";
import { SiteFooter } from "@/components/site-footer";
import { requireAdmin } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Admin — Atelier",
  description: "Protected Atelier administration area.",
};

export default async function AdminPage() {
  const session = await requireAdmin();

  return (
    <div className="min-h-screen">
      <AccountHeader />
      <main id="main-content" className="page-shell py-14 md:py-24">
        <div className="max-w-3xl">
          <p className="type-label text-ink-muted">Restricted access</p>
          <h1 className="type-heading mt-5">Admin area</h1>
          <p className="type-body-lg mt-7 text-ink-muted">
            Signed in as {session.user.email}. Administrative tools will be added here as the store grows.
          </p>
          <div className="mt-9 border border-line bg-surface p-6 sm:p-9">
            <p className="type-label text-ink-muted">Authorization status</p>
            <p className="mt-3">Administrator access confirmed.</p>
          </div>
          <Link className="button button-secondary mt-9" href="/account">
            Return to account
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
