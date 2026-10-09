import { ArrowIcon } from "@/components/home/icons";

export function NewsletterSection() {
  return (
    <section id="newsletter" className="section-space bg-canvas">
      <div className="page-shell grid gap-10 md:grid-cols-2 md:items-end">
        <div>
          <p className="type-label mb-5 text-ink-muted">Private correspondence</p>
          <h2 className="type-heading max-w-[12ch]">A letter from the atelier.</h2>
        </div>
        <form className="max-w-[40rem] md:justify-self-end" action="#" method="post">
          <label htmlFor="email" className="type-label">Email address</label>
          <div className="mt-4 flex border-b border-ink">
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="min-w-0 flex-1 bg-transparent py-4 text-base outline-none placeholder:text-ink-muted/60"
            />
            <button
              type="submit"
              className="flex items-center gap-2 py-4 pl-5 text-xs font-medium uppercase tracking-[0.14em]"
            >
              Subscribe <ArrowIcon />
            </button>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-ink-muted">
            New collections, atelier stories, and private appointments — sent occasionally.
          </p>
        </form>
      </div>
    </section>
  );
}
