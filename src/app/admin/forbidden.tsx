import Link from "next/link";

import { AccountHeader } from "@/components/auth/account-header";
import { SiteFooter } from "@/components/site-footer";

export default function Forbidden() {
  return (
    <div className="min-h-screen">
      <AccountHeader />
      <main id="main-content" className="page-shell py-20 md:py-32">
        <p className="type-label text-ink-muted">403 — Forbidden</p>
        <h1 className="type-heading mt-5 max-w-[12ch]">This area is reserved for administrators.</h1>
        <p className="type-body-lg mt-7 max-w-[38rem] text-ink-muted">
          Your account is active, but it does not have permission to view this page.
        </p>
        <Link className="button button-secondary mt-9" href="/account">
          Return to account
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
