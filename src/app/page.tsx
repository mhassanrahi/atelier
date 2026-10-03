import Image from "next/image";
import Link from "next/link";

import { getHomepageProducts } from "@/db/queries/products";

export const dynamic = "force-dynamic";

function formatPrice(priceInCents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(priceInCents / 100);
}

const footerLinks = {
  Services: ["Contact us", "Shipping & returns", "Care guide", "Book an appointment"],
  Atelier: ["Our story", "Craftsmanship", "Journal", "Careers"],
  Legal: ["Privacy", "Terms", "Accessibility", "Cookies"],
} as const;

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none">
      <path d="M4 12h15M14 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none">
      <path d="M5.5 8.5h13l-1 11h-11l-1-11Z" stroke="currentColor" strokeWidth="1.35" />
      <path d="M9 9V6.5a3 3 0 0 1 6 0V9" stroke="currentColor" strokeWidth="1.35" />
    </svg>
  );
}

export default async function Home() {
  const products = await getHomepageProducts();

  return (
    <main>
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
              </nav>
            </div>
          </details>

          <a href="#" aria-label="Atelier home" className="font-display text-xl tracking-[0.18em] no-underline md:text-2xl">
            ATELIER
          </a>

          <nav aria-label="Customer" className="flex items-center justify-end gap-5 md:gap-7">
            <a className="link-nav desktop-only" href="#newsletter">Search</a>
            <a className="link-nav desktop-only" href="#footer">Account</a>
            <a aria-label="Shopping bag, 0 items" href="#new-arrivals" className="inline-flex items-center gap-2 no-underline">
              <BagIcon />
              <span className="type-label">0</span>
            </a>
          </nav>
        </div>
      </header>

      <section id="main-content" className="relative min-h-[46rem] overflow-hidden bg-[#302d2a] text-white md:min-h-screen">
        <Image
          src="/hero-editorial.jpg"
          alt="Model in colorful sunglasses and a red top against a deep teal sky"
          fill
          preload
          sizes="100vw"
          className="object-cover object-[58%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-black/30" />
        <div className="page-shell relative flex min-h-[46rem] items-end pb-12 pt-36 md:min-h-screen md:pb-16">
          <div className="max-w-[55rem]">
            <p className="type-label mb-5">Autumn / Winter 2026</p>
            <h1 className="type-display max-w-[10ch]">Form, found in motion.</h1>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/collections" className="button button-fluid-mobile bg-white text-ink hover:bg-[#e8e6e0]">Shop the collection</Link>
              <a href="#story" className="button button-fluid-mobile border border-white/70 text-white hover:bg-white hover:text-ink">Discover the story</a>
            </div>
          </div>
        </div>
        <p className="type-label absolute bottom-5 right-gutter hidden [writing-mode:vertical-rl] md:block">Campaign 01 — Berlin</p>
      </section>

      <section id="collections" className="section-space">
        <div className="page-shell">
          <div className="mb-10 flex items-end justify-between gap-8 md:mb-16">
            <div>
              <p className="type-label mb-4 text-ink-muted">Explore the house</p>
              <h2 className="type-heading">Two points of view</h2>
            </div>
            <Link className="link-nav desktop-only" href="/collections">View all collections</Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            <Link href="/collections" className="group relative min-h-[33rem] overflow-hidden bg-surface-subtle text-white no-underline md:min-h-[48rem]">
              <Image
                src="/collection-women.jpg"
                alt="Woman in sunglasses holding shopping bags"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/5" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 md:p-10">
                <div>
                  <p className="type-label mb-3">Collection 01</p>
                  <h3 className="type-subheading text-3xl md:text-5xl">The Women&apos;s Edit</h3>
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/70 transition group-hover:bg-white group-hover:text-ink"><ArrowIcon /></span>
              </div>
            </Link>

            <Link href="/collections" className="group relative min-h-[33rem] overflow-hidden bg-surface-subtle text-white no-underline md:min-h-[48rem]">
              <Image
                src="/collection-men.jpg"
                alt="Man adjusting a denim jacket outdoors"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center transition duration-700 ease-out group-hover:scale-[1.025]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/5" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 md:p-10">
                <div>
                  <p className="type-label mb-3">Collection 02</p>
                  <h3 className="type-subheading text-3xl md:text-5xl">The Men&apos;s Edit</h3>
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/70 transition group-hover:bg-white group-hover:text-ink"><ArrowIcon /></span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section id="new-arrivals" className="border-y border-line bg-surface py-20 md:py-28">
        <div className="page-shell">
          <div className="mb-12 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="type-label mb-4 text-ink-muted">Just arrived</p>
              <h2 className="type-heading">Objects of desire</h2>
            </div>
            <Link href="/collections" className="link-nav w-fit">Shop all new arrivals</Link>
          </div>

          {products.length > 0 ? (
            <div className="product-grid">
              {products.map((product) => (
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
            <p className="text-sm text-ink-muted">New arrivals are being prepared.</p>
          )}
        </div>
      </section>

      <section id="story" className="bg-[#22211f] text-inverse-ink">
        <div className="grid lg:grid-cols-[1.25fr_.75fr]">
          <div className="relative min-h-[34rem] lg:min-h-[52rem]">
            <Image
              src="/atelier-story.jpg"
              alt="Atelier fitting in a softly lit studio"
              fill
              sizes="(max-width: 1024px) 100vw, 63vw"
              className="object-cover object-center"
            />
          </div>
          <div className="flex items-center px-gutter py-20 lg:py-24">
            <div className="max-w-[32rem]">
              <p className="type-label mb-8 text-white/65">Inside the atelier — No. 04</p>
              <h2 className="type-heading">Made slowly.<br />Worn endlessly.</h2>
              <p className="type-body-lg mt-8 max-w-[34rem] text-white/70">
                From the first paper pattern to the final hand-finished edge, each piece is shaped by people who know that lasting design begins with attention.
              </p>
              <a href="#" className="button mt-10 border border-white/70 text-white hover:bg-white hover:text-ink">Meet our makers <ArrowIcon /></a>
            </div>
          </div>
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

      <section id="newsletter" className="section-space bg-canvas">
        <div className="page-shell grid gap-10 md:grid-cols-2 md:items-end">
          <div>
            <p className="type-label mb-5 text-ink-muted">Private correspondence</p>
            <h2 className="type-heading max-w-[12ch]">A letter from the atelier.</h2>
          </div>
          <form className="max-w-[40rem] md:justify-self-end" action="#" method="post">
            <label htmlFor="email" className="type-label">Email address</label>
            <div className="mt-4 flex border-b border-ink">
              <input id="email" name="email" type="email" required placeholder="you@example.com" className="min-w-0 flex-1 bg-transparent py-4 text-base outline-none placeholder:text-ink-muted/60" />
              <button type="submit" className="flex items-center gap-2 py-4 pl-5 text-xs font-medium uppercase tracking-[0.14em]">Subscribe <ArrowIcon /></button>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-ink-muted">New collections, atelier stories, and private appointments — sent occasionally.</p>
          </form>
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
                    {links.map((link) => <li key={link}><a href="#" className="text-white/85 no-underline hover:text-white">{link}</a></li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 pt-7 text-[0.6875rem] uppercase tracking-[0.12em] text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Atelier Store</p>
            <div className="flex flex-wrap gap-6"><a href="#">Instagram</a><a href="#">Pinterest</a><a href="https://unsplash.com" rel="noreferrer">Photography: Unsplash</a><a href="#">English / USD</a></div>
          </div>
        </div>
      </footer>
    </main>
  );
}
