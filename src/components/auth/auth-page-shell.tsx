import type { ReactNode } from "react";

import { AccountHeader } from "@/components/auth/account-header";
import { SiteFooter } from "@/components/site-footer";

type AuthPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthPageShell({
  eyebrow,
  title,
  description,
  children,
}: AuthPageShellProps) {
  return (
    <div className="min-h-screen">
      <AccountHeader />
      <main id="main-content" className="page-shell py-14 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,30rem)] lg:items-start lg:gap-24">
          <div className="max-w-2xl lg:pt-8">
            <p className="type-label text-ink-muted">{eyebrow}</p>
            <h1 className="type-heading mt-5 max-w-[11ch]">{title}</h1>
            <p className="type-body-lg mt-7 max-w-[38rem] text-ink-muted">
              {description}
            </p>
          </div>
          <div className="border border-line bg-surface p-6 sm:p-9">{children}</div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
