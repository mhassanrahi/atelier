export default function CollectionNotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-gutter py-20 text-center">
      <div>
        <p className="type-label text-ink-muted">404 — Collection not found</p>
        <h1 className="type-heading mt-6">This edit is not in the archive.</h1>
        <p className="mx-auto mt-6 max-w-lg text-ink-muted">
          Explore the current collection to discover the pieces now available from Atelier.
        </p>
        <a href="/collections" className="button button-primary mt-9">
          View the collection
        </a>
      </div>
    </main>
  );
}
