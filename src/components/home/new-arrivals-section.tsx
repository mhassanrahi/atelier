import Image from "next/image";
import Link from "next/link";

import type { HomepageProduct } from "@/db/queries/products";

type NewArrivalsSectionProps = {
  products: HomepageProduct[];
};

function formatPrice(priceInCents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(priceInCents / 100);
}

export function NewArrivalsSection({ products }: NewArrivalsSectionProps) {
  return (
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
                <Link
                  href={`/products/${product.slug}`}
                  aria-label={`View ${product.name}`}
                  className="group block no-underline"
                >
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
                    <p className="shrink-0 text-sm">
                      {formatPrice(product.priceInCents, product.currency)}
                    </p>
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
  );
}
