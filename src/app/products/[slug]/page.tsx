import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import {
  getHomepageProducts,
  getProductBySlug,
} from "@/db/queries/products";

export const dynamic = "force-dynamic";

const getProduct = cache(getProductBySlug);

const productStories: Record<
  string,
  {
    description: string;
    details: string[];
    material: string;
    care: string;
  }
> = {
  "column-leather-bag": {
    description:
      "A study in clean geometry, the Column is shaped with a softly structured body and a precise top handle. Its quiet profile is designed to move easily from day into evening.",
    details: ["Hand-finished edges", "Interior slip pocket", "Protective metal feet"],
    material: "Calfskin leather with a smooth leather lining and brushed metal hardware.",
    care: "Store in its dust bag and keep away from prolonged sunlight, water, and abrasive surfaces.",
  },
  "sculpted-court": {
    description:
      "A classic court shoe redrawn with a fluid heel and an elongated line. Supple nappa leather follows the foot while the sculpted base gives the silhouette its architectural character.",
    details: ["Sculpted heel", "Leather sole", "Hand-finished upper"],
    material: "Nappa leather upper, leather lining, and a hand-finished leather sole.",
    care: "Wipe gently with a soft, dry cloth and store with tissue in its dust bag between wears.",
  },
  "solstice-frame": {
    description:
      "Bold in proportion and restrained in detail, the Solstice frame pairs a softened rectangular shape with precisely beveled edges for a considered everyday statement.",
    details: ["Beveled profile", "Tinted lenses", "Polished metal core"],
    material: "Polished acetate with tinted lenses and metal-reinforced temples.",
    care: "Clean with the supplied lens cloth and store in the protective case when not in use.",
  },
  "arc-mini-bag": {
    description:
      "Compact and gently curved, the Arc Mini balances a sculptural outline with an easy crossbody scale. A tactile grained finish makes it suited to everyday wear.",
    details: ["Adjustable strap", "Magnetic closure", "Interior card pocket"],
    material: "Grained leather with a smooth leather lining and tonal metal hardware.",
    care: "Store in its dust bag and avoid contact with water, oils, and richly dyed fabrics.",
  },
};

const fallbackStory = {
  description:
    "A considered Atelier object, refined through proportion, material, and careful finishing. Designed for daily use and made to remain relevant beyond the season.",
  details: ["Designed in Berlin", "Responsibly sourced materials", "Made in small runs"],
  material: "Selected for character, longevity, and a graceful patina over time.",
  care: "Treat with care and store in a cool, dry place between uses.",
};

function formatPrice(priceInCents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
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

export async function generateMetadata(
  props: PageProps<"/products/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Product not found — Atelier" };
  }

  return {
    title: `${product.name} — Atelier`,
    description: `${product.subtitle}. Discover ${product.name} from Atelier.`,
  };
}

export default async function ProductPage(
  props: PageProps<"/products/[slug]">,
) {
  const { slug } = await props.params;
  const product = await getProduct(slug);

  if (!product || product.images.length === 0) {
    notFound();
  }

  const story = productStories[product.slug] ?? fallbackStory;
  const relatedProducts = (await getHomepageProducts())
    .filter((item) => item.id !== product.id)
    .slice(0, 3);
  const primaryImage = product.images[0];

  return (
    <main>
      <header className="relative z-30 bg-canvas text-ink">
        <a
          href="#product-content"
          className="absolute left-4 top-4 -translate-y-24 bg-ink px-4 py-3 text-xs font-medium uppercase tracking-[0.14em] text-inverse-ink focus:translate-y-0"
        >
          Skip to content
        </a>
        <div className="page-shell grid h-20 grid-cols-[1fr_auto_1fr] items-center border-b border-line md:h-24">
          <nav aria-label="Primary" className="desktop-only flex items-center gap-7">
            <Link className="link-nav" href="/#new-arrivals">New in</Link>
            <Link className="link-nav" href="/collections">Collections</Link>
            <Link className="link-nav" href="/#story">The atelier</Link>
          </nav>

          <details className="mobile-menu mobile-only justify-self-start">
            <summary className="type-label list-none py-3">Menu</summary>
            <div className="fixed inset-x-0 top-20 border-b border-line bg-canvas px-gutter py-8 text-ink shadow-xl">
              <nav aria-label="Mobile" className="flex flex-col gap-6">
                <Link className="type-subheading" href="/#new-arrivals">New in</Link>
                <Link className="type-subheading" href="/collections">Collections</Link>
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

      <section id="product-content" className="page-shell py-6 md:py-10">
        <nav aria-label="Breadcrumb" className="type-label flex items-center gap-2 text-ink-muted">
          <Link href="/" className="no-underline hover:text-ink">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/collections?category=${product.category.slug}`} className="no-underline hover:text-ink">{product.category.name}</Link>
          <span aria-hidden="true">/</span>
          <span className="text-ink" aria-current="page">{product.name}</span>
        </nav>

        <div className="mt-6 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(22rem,.75fr)] lg:items-start lg:gap-16">
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
            <div className="media-frame aspect-[4/5] w-full min-w-0 md:col-span-2">
              <Image
                src={primaryImage.src}
                alt={primaryImage.alt}
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 62vw"
                className="object-cover"
              />
              {product.isNew ? (
                <span className="type-label absolute left-4 top-4 bg-surface px-3 py-2">New</span>
              ) : null}
            </div>
            <div className="media-frame hidden aspect-square md:block">
              <Image
                src={primaryImage.src}
                alt={`${product.name}, detail view`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 31vw"
                className="scale-125 object-cover object-left"
              />
            </div>
            <div className="hidden aspect-square items-end bg-[#ddd8ce] p-7 md:flex md:p-10">
              <div>
                <p className="type-label text-ink-muted">Atelier note</p>
                <p className="type-subheading mt-5 max-w-[14ch]">Form follows feeling.</p>
                <p className="mt-5 max-w-[26rem] text-sm leading-relaxed text-ink-muted">
                  Each piece is developed slowly, with close attention to touch, balance, and the way it lives with its wearer.
                </p>
              </div>
            </div>
          </div>

          <aside className="min-w-0 lg:sticky lg:top-10">
            <div className="flex items-center justify-between gap-5">
              <p className="type-label text-ink-muted">{product.category.name}</p>
              <p className="type-label text-ink-muted">{product.sku}</p>
            </div>
            <h1 className="type-heading mt-5">{product.name}</h1>
            <p className="mt-4 text-ink-muted">{product.subtitle}</p>
            <p className="mt-7 text-lg">{formatPrice(product.priceInCents, product.currency)}</p>

            <div className="rule mt-9 pt-8">
              <p className="type-body-lg max-w-[34rem] text-ink-muted">{story.description}</p>
              <ul className="mt-7 space-y-2 text-sm">
                {story.details.map((detail) => (
                  <li key={detail} className="flex gap-3">
                    <span aria-hidden="true">—</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-9 border border-line bg-surface p-5">
              <div className="flex items-center gap-3">
                <span className={`size-2 rounded-full ${product.isSoldOut ? "bg-ink-muted" : "bg-[#52634c]"}`} />
                <p className="type-label">{product.isSoldOut ? "Currently unavailable" : "Available"}</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {product.isSoldOut
                  ? "This piece is currently out of stock."
                  : "Purchase options will be introduced in the next release. For now, explore the piece and its details."}
              </p>
            </div>

            <div className="mt-8 divide-y divide-line border-y border-line">
              <details className="group py-5">
                <summary className="type-label flex list-none items-center justify-between gap-6">
                  Materials
                  <span className="text-lg font-normal group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="max-w-[32rem] pb-2 pt-4 text-sm leading-relaxed text-ink-muted">{story.material}</p>
              </details>
              <details className="group py-5">
                <summary className="type-label flex list-none items-center justify-between gap-6">
                  Care guide
                  <span className="text-lg font-normal group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="max-w-[32rem] pb-2 pt-4 text-sm leading-relaxed text-ink-muted">{story.care}</p>
              </details>
              <details className="group py-5">
                <summary className="type-label flex list-none items-center justify-between gap-6">
                  Delivery & returns
                  <span className="text-lg font-normal group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="max-w-[32rem] pb-2 pt-4 text-sm leading-relaxed text-ink-muted">
                  Complimentary delivery and returns will be available when ordering launches.
                </p>
              </details>
            </div>
          </aside>
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="mt-14 border-t border-line bg-surface py-20 md:mt-24 md:py-28">
          <div className="page-shell">
            <div className="mb-10 flex items-end justify-between gap-8 md:mb-14">
              <div>
                <p className="type-label mb-4 text-ink-muted">The edit continues</p>
                <h2 className="type-heading">You may also like</h2>
              </div>
              <Link href="/collections" className="link-nav desktop-only">View all pieces</Link>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-6">
              {relatedProducts.map((item) => (
                <article key={item.id}>
                  <Link href={`/products/${item.slug}`} className="group block no-underline">
                    <div className="media-frame aspect-[4/5]">
                      <Image
                        src={item.imageSrc}
                        alt={item.imageAlt}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
                      />
                    </div>
                    <div className="mt-5 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="mt-1 text-sm text-ink-muted">{item.subtitle}</p>
                      </div>
                      <p className="shrink-0 text-sm">{formatPrice(item.priceInCents, item.currency)}</p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section aria-label="Our commitments" className="border-t border-line bg-canvas">
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
              <div>
                <h2 className="type-label mb-5 text-white/50">Services</h2>
                <ul className="space-y-3 text-sm text-white/85"><li>Contact us</li><li>Shipping & returns</li><li>Care guide</li></ul>
              </div>
              <div>
                <h2 className="type-label mb-5 text-white/50">Atelier</h2>
                <ul className="space-y-3 text-sm text-white/85"><li>Our story</li><li>Craftsmanship</li><li>Journal</li></ul>
              </div>
              <div>
                <h2 className="type-label mb-5 text-white/50">Continue</h2>
                <Link href="/" className="button border border-white/50 text-white hover:bg-white hover:text-ink">Return home <ArrowIcon /></Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 pt-7 text-[0.6875rem] uppercase tracking-[0.12em] text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Atelier Store</p>
            <p>English / USD</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
