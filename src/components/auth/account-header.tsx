import Link from "next/link";

export function AccountHeader() {
  return (
    <header className="border-b border-line bg-canvas">
      <a
        href="#main-content"
        className="absolute left-4 top-4 -translate-y-24 bg-ink px-4 py-3 text-xs font-medium uppercase tracking-[0.14em] text-inverse-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      <div className="page-shell grid h-20 grid-cols-[1fr_auto_1fr] items-center md:h-24">
        <Link className="link-nav justify-self-start" href="/collections">
          Collection
        </Link>
        <Link
          href="/"
          aria-label="Atelier home"
          className="font-display text-xl tracking-[0.18em] no-underline md:text-2xl"
        >
          ATELIER
        </Link>
        <Link className="link-nav justify-self-end" href="/account">
          Account
        </Link>
      </div>
    </header>
  );
}
