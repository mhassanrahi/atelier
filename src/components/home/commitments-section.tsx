const commitments = [
  ["01", "Complimentary delivery", "On every order, worldwide."],
  ["02", "Considered packaging", "Recycled, recyclable, and refined."],
  ["03", "Atelier care", "Repairs and advice for every piece."],
] as const;

export function CommitmentsSection() {
  return (
    <section aria-label="Our commitments" className="border-b border-line bg-canvas">
      <div className="page-shell grid divide-y divide-line py-10 md:grid-cols-3 md:divide-x md:divide-y-0 md:py-14">
        {commitments.map(([number, title, copy]) => (
          <div
            key={number}
            className="grid grid-cols-[2rem_1fr] gap-4 py-7 first:pt-0 last:pb-0 md:px-8 md:py-0 md:first:pl-0 md:last:pr-0"
          >
            <span className="type-label text-ink-muted">{number}</span>
            <div>
              <h3 className="type-subheading text-xl">{title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
