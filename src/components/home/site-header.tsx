import Link from "next/link";

import { CartLink } from "@/components/cart/cart-link";

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 text-white">
      <a
        href="#main-content"
        className="absolute left-4 top-4 -translate-y-24 bg-white px-4 py-3 text-xs font-medium uppercase tracking-[0.14em] text-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      <div className="page-shell grid h-20 grid-cols-[1fr_auto_1fr] items-center border-b border-white/30 md:h-24">
        <nav aria-label="Primary" className="desktop-only flex items-center gap-7">
          <Link className="link-nav" href="/collections">New in</Link>
          <Link className="link-nav" href="/collections">Collections</Link>
          <a className="link-nav" href="#story">The atelier</a>
        </nav>

        <details className="mobile-menu mobile-only justify-self-start">
          <summary className="type-label list-none py-3">Menu</summary>
          <div className="fixed inset-x-0 top-20 border-b border-line bg-canvas px-gutter py-8 text-ink shadow-xl">
            <nav aria-label="Mobile" className="flex flex-col gap-6">
              <Link className="type-subheading" href="/collections">New in</Link>
              <Link className="type-subheading" href="/collections">Collections</Link>
              <a className="type-subheading" href="#story">The atelier</a>
              <Link className="type-subheading" href="/collections?focus=search#catalog-search">Search</Link>
              <Link className="type-subheading" href="/account">Account</Link>
            </nav>
          </div>
        </details>

        <a
          href="#"
          aria-label="Atelier home"
          className="font-display text-xl tracking-[0.18em] no-underline md:text-2xl"
        >
          ATELIER
        </a>

        <nav aria-label="Customer" className="flex items-center justify-end gap-5 md:gap-7">
          <Link className="link-nav desktop-only" href="/collections?focus=search#catalog-search">Search</Link>
          <Link className="link-nav desktop-only" href="/account">Account</Link>
          <CartLink />
        </nav>
      </div>
    </header>
  );
}
