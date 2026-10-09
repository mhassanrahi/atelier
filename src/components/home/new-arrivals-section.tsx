import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import type { ProductCardProduct } from "@/db/queries/products";

type NewArrivalsSectionProps = {
  products: ProductCardProduct[];
};

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
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-muted">New arrivals are being prepared.</p>
        )}
      </div>
    </section>
  );
}
