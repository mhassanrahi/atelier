import Link from "next/link";

import { CartLink } from "@/components/cart/cart-link";

type AccountHeaderProps = {
  current?: "account" | "cart";
};

export function AccountHeader({ current }: AccountHeaderProps) {
  return (
    <header className="border-b border-line bg-canvas">
      <a
        href="#main-content"
        className="absolute left-4 top-4 -translate-y-24 bg-ink px-4 py-3 text-xs font-medium uppercase tracking-[0.14em] text-inverse-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      <div className="page-shell relative flex h-20 items-center justify-between md:h-24">
        <div className="justify-self-start">
          <Link className="link-nav desktop-only" href="/collections">
            Collection
          </Link>
          <Link
            className="link-nav mobile-only"
            href={current === "cart" ? "/account" : "/collections"}
          >
            {current === "cart" ? "Account" : "Collection"}
          </Link>
        </div>
        <Link
          href="/"
          aria-label="Atelier home"
          className="absolute left-1/2 -translate-x-1/2 font-display text-xl tracking-[0.18em] no-underline md:text-2xl"
        >
          ATELIER
        </Link>
        <nav aria-label="Customer" className="flex items-center justify-self-end gap-4 md:gap-6">
          <Link
            className="link-nav desktop-only"
            href="/account"
            aria-current={current === "account" ? "page" : undefined}
          >
            Account
          </Link>
          <CartLink current={current === "cart"} />
        </nav>
      </div>
    </header>
  );
}
