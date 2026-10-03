import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCollectionCatalog } from "@/db/queries/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Collection — Atelier",
  description:
    "Explore Atelier's collection of bags, footwear, and eyewear, shaped by modern form and enduring craft.",
};

const footerLinks = {
  Services: ["Contact us", "Shipping & returns", "Care guide", "Book an appointment"],
  Atelier: ["Our story", "Craftsmanship", "Journal", "Careers"],
  Legal: ["Privacy", "Terms", "Accessibility", "Cookies"],
} as const;

function formatPrice(priceInCents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(priceInCents / 100);
}

function BagIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none">
      <path d="M5.5 8.5h13l-1 11h-11l-1-11Z" stroke="currentColor" strokeWidth="1.35" />
      <path d="M9 9V6.5a3 3 0 0 1 6 0V9" stroke="currentColor" strokeWidth="1.35" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none">
      <path d="M4 12h15M14 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

type CollectionsPageProps = {
  searchParams: Promise<{ category?: string | string[] }>;
};

export default async function CollectionsPage(
  props: CollectionsPageProps,
) {
  const searchParams = await props.searchParams;
  const categoryParam = searchParams.category;
  const categorySlug = typeof categoryParam === "string" ? categoryParam : undefined;
  const catalog = await getCollectionCatalog(categorySlug);

  if (!catalog) {
    notFound();
  }

  const editorial = catalog.editorial;
  const collectionName = catalog.activeCategory?.name ?? "All pieces";

  return (
    <main>
      <header className="relative z-30 bg-canvas text-ink">
        <a
          href="#collection-content"
          className="absolute left-4 top-4 -translate-y-24 bg-ink px-4 py-3 text-xs font-medium uppercase tracking-[0.14em] text-inverse-ink focus:translate-y-0"
        >
          Skip to content
        </a>
        <div className="page-shell grid h-20 grid-cols-[1fr_auto_1fr] items-center border-b border-line md:h-24">
          <nav aria-label="Primary" className="desktop-only flex items-center gap-7">
            <Link className="link-nav" href="/collections">New in</Link>
            <Link className="link-nav" href="/collections" aria-current="page">Collections</Link>
            <Link className="link-nav" href="/#story">The atelier</Link>
          </nav>

          <details className="mobile-menu mobile-only justify-self-start">
            <summary className="type-label list-none py-3">Menu</summary>
            <div className="fixed inset-x-0 top-20 border-b border-line bg-canvas px-gutter py-8 text-ink shadow-xl">
              <nav aria-label="Mobile" className="flex flex-col gap-6">
                <Link className="type-subheading" href="/collections">New in</Link>
                <Link className="type-subheading" href="/collections" aria-current="page">Collections</Link>
                <Link className="type-subheading" href="/#story">The atelier</Link>
              </nav>
            </div>
          </details>

          <Link href="/" aria-label="Atelier home" className="font-display text-xl tracking-[0.18em] no-underline md:text-2xl">
            ATELIER
          </Link>

          <nav aria-label="Customer" className="flex items-center justify-end gap-5 md:gap-7">
            <Link className="link-nav desktop-only" href="/#newsletter">Search</Link>
            <Link className="link-nav desktop-only" href="/#footer">Account</Link>
            <span aria-label="Shopping bag, 0 items" className="inline-flex items-center gap-2">
              <BagIcon />
              <span className="type-label">0</span>
            </span>
          </nav>
        </div>
      </header>

      <section id="collection-content" className="page-shell pb-8 pt-12 md:pb-14 md:pt-20">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.25fr)_minmax(18rem,.75fr)] md:items-end md:gap-16">
          <div>
            <p className="type-label mb-5 text-ink-muted">{editorial.eyebrow}</p>
            <h1 className="type-display max-w-[10ch]">{editorial.title}</h1>
          </div>
          <p className="type-body-lg max-w-[34rem] text-ink-muted md:pb-2">
            {editorial.description}
          </p>
        </div>
      </section>

      <section className="page-shell">
        <div className="media-frame aspect-[4/5] md:aspect-[16/7]">
          <Image
            src={editorial.imageSrc}
            alt={editorial.imageAlt}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: editorial.imagePosition }}
          />
          <p className="type-label absolute bottom-5 right-5 bg-surface/90 px-3 py-2 text-ink md:bottom-7 md:right-7">
            {editorial.imageCaption}
          </p>
        </div>
      </section>

      <section className="mt-16 border-y border-line bg-surface py-16 md:mt-24 md:py-24">
        <div className="page-shell">
          <div className="flex flex-col gap-7 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="type-label mb-3 text-ink-muted">Shop the collection</p>
              <h2 className="type-heading">{collectionName}</h2>
            </div>
            <p className="type-label text-ink-muted">
              {catalog.products.length} {catalog.products.length === 1 ? "piece" : "pieces"}
            </p>
          </div>

          <nav aria-label="Filter collection" className="flex gap-x-7 gap-y-3 overflow-x-auto border-b border-line py-6">
            <Link
              href="/collections"
              aria-current={!catalog.activeCategory ? "page" : undefined}
              className="link-nav shrink-0"
            >
              All
            </Link>
            {catalog.categories.map((category) => (
              <Link
                key={category.slug}
                href={`/collections?category=${category.slug}`}
                aria-current={catalog.activeCategory?.slug === category.slug ? "page" : undefined}
                className="link-nav shrink-0"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {catalog.products.length > 0 ? (
            <div className="product-grid mt-10 md:mt-14">
              {catalog.products.map((product) => (
                <article key={product.id}>
                  <Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`} className="group block no-underline">
                    <div className="media-frame aspect-[4/5]">
                      <Image
                        src={product.imageSrc}
                        alt={product.imageAlt}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
                      />
                      {product.isSoldOut ? (
                        <span className="type-label absolute left-4 top-4 bg-surface px-3 py-2">Sold out</span>
                      ) : product.isNew ? (
                        <span className="type-label absolute left-4 top-4 bg-surface px-3 py-2">New</span>
                      ) : null}
                    </div>
                    <div className="mt-5 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="mt-1 text-sm text-ink-muted">{product.subtitle}</p>
                      </div>
                      <p className="shrink-0 text-sm">{formatPrice(product.priceInCents, product.currency)}</p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="type-subheading">The next pieces are taking shape.</p>
              <p className="mt-4 text-ink-muted">Return soon to discover this edit.</p>
            </div>
          )}
        </div>
      </section>

      <section className="grid bg-[#22211f] text-inverse-ink lg:grid-cols-[.9fr_1.1fr]">
        <div className="flex items-center px-gutter py-20 lg:py-28">
          <div className="max-w-[34rem]">
            <p className="type-label mb-7 text-white/60">The atelier approach</p>
            <h2 className="type-heading">Less, but lasting.</h2>
            <p className="type-body-lg mt-7 text-white/70">
              We develop in small runs, returning to materials and forms that reward attention. The result is a collection built to be worn, kept, and cared for.
            </p>
            <Link href="/#story" className="button mt-9 border border-white/60 text-white hover:bg-white hover:text-ink">
              Our story <ArrowIcon />
            </Link>
          </div>
        </div>
        <div className="relative min-h-[30rem] lg:min-h-[44rem]">
          <Image
            src="/collection-men.jpg"
            alt="Man adjusting a denim jacket outdoors"
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
        </div>
      </section>

      <section aria-label="Our commitments" className="border-b border-line bg-canvas">
        <div className="page-shell grid divide-y divide-line py-10 md:grid-cols-3 md:divide-x md:divide-y-0 md:py-14">
          {[
            ["01", "Complimentary delivery", "On every order, worldwide."],
            ["02", "Considered packaging", "Recycled, recyclable, and refined."],
            ["03", "Atelier care", "Repairs and advice for every piece."],
          ].map(([number, title, copy]) => (
            <div key={number} className="grid grid-cols-[2rem_1fr] gap-4 py-7 first:pt-0 last:pb-0 md:px-8 md:py-0 md:first:pl-0 md:last:pr-0">
              <span className="type-label text-ink-muted">{number}</span>
              <div>
                <h3 className="type-subheading text-xl">{title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer id="footer" className="bg-inverse text-inverse-ink">
        <div className="page-shell py-14 md:py-20">
          <div className="grid gap-14 border-b border-white/20 pb-16 md:grid-cols-[1.2fr_2fr]">
            <div>
              <p className="font-display text-3xl tracking-[0.16em]">ATELIER</p>
              <p className="mt-5 max-w-[24rem] text-sm leading-relaxed text-white/60">A study in modern form, made with enduring materials and an uncompromising eye.</p>
            </div>
            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              {Object.entries(footerLinks).map(([group, links]) => (
                <div key={group}>
                  <h2 className="type-label mb-5 text-white/50">{group}</h2>
                  <ul className="space-y-3 text-sm">
                    {links.map((link) => <li key={link}><span className="text-white/85">{link}</span></li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 pt-7 text-[0.6875rem] uppercase tracking-[0.12em] text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Atelier Store</p>
            <div className="flex flex-wrap gap-6"><span>Instagram</span><span>Pinterest</span><span>English / USD</span></div>
          </div>
        </div>
      </footer>
    </main>
  );
}
