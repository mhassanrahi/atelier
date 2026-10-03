import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-gutter py-20 text-center">
      <div>
        <p className="type-label text-ink-muted">404 — Product not found</p>
        <h1 className="type-heading mt-6">This piece has left the atelier.</h1>
        <p className="mx-auto mt-6 max-w-lg text-ink-muted">
          It may no longer be part of the current collection, or the address may have changed.
        </p>
        <Link href="/#new-arrivals" className="button button-primary mt-9">
          Explore new arrivals
        </Link>
      </div>
    </main>
  );
}
