import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AccountHeader } from "@/components/auth/account-header";
import { CartLineControls } from "@/components/cart/cart-line-controls";
import { SiteFooter } from "@/components/site-footer";
import { getCart } from "@/lib/cart";

export const metadata: Metadata = {
  title: "Your bag — Atelier",
  description: "Review the pieces in your Atelier shopping bag.",
};

function formatPrice(priceInCents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(priceInCents / 100);
}

export default async function CartPage() {
  const cart = await getCart();
  const itemLabel = cart.totalQuantity === 1 ? "piece" : "pieces";

  return (
    <div className="min-h-screen">
      <AccountHeader current="cart" />
      <main id="main-content" className="page-shell py-12 md:py-20">
        <div className="flex flex-col gap-5 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="type-label text-ink-muted">Your selection</p>
            <h1 className="type-heading mt-4">Shopping bag</h1>
          </div>
          <p className="type-label text-ink-muted">
            {cart.totalQuantity} {itemLabel}
          </p>
        </div>

        {cart.hasAdjustments ? (
          <div
            role="status"
            className="mt-7 border border-line bg-surface px-5 py-4 text-sm leading-relaxed"
          >
            Availability changed while these pieces were in your bag. Quantities and totals now reflect current stock.
          </div>
        ) : null}

        {cart.items.length === 0 ? (
          <section className="py-20 text-center md:py-28">
            <p className="type-subheading">Your bag is waiting.</p>
            <p className="mx-auto mt-4 max-w-[20rem] text-ink-muted sm:max-w-lg">
              Explore the collection and add a piece when something feels right.
            </p>
            <Link href="/collections" className="button button-primary mt-8">
              Explore the collection
            </Link>
          </section>
        ) : (
          <div className="grid gap-12 py-9 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,28rem)] lg:items-start lg:gap-20 lg:py-12">
            <section aria-label="Items in your bag" className="divide-y divide-line border-y border-line">
              {cart.items.map((item) => (
                <article
                  key={item.id}
                  className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-5 py-6 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-7 sm:py-8"
                >
                  <Link
                    href={`/products/${item.slug}`}
                    className="media-frame aspect-[4/5] self-start"
                    aria-label={`View ${item.name}`}
                  >
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 640px) 104px, 144px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="min-w-0 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-8">
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-medium no-underline hover:underline"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-sm text-ink-muted">{item.subtitle}</p>
                      <p className="mt-3 text-sm">
                        {formatPrice(item.priceInCents, item.currency)} each
                      </p>
                      {item.isSoldOut ? (
                        <p className="mt-4 text-sm font-medium">Currently unavailable</p>
                      ) : item.isAdjusted ? (
                        <p className="mt-4 text-sm font-medium">
                          Quantity adjusted to {item.quantity} based on current stock.
                        </p>
                      ) : (
                        <p className="mt-4 text-sm text-ink-muted">
                          {item.stockQuantity} available
                        </p>
                      )}
                    </div>

                    <p className="mt-4 shrink-0 sm:mt-0 sm:text-right">
                      {item.isSoldOut
                        ? "—"
                        : formatPrice(item.lineTotalInCents, item.currency)}
                    </p>

                    <div className="sm:col-span-2">
                      <CartLineControls
                        key={`${item.id}-${item.quantity}-${item.stockQuantity}`}
                        productId={item.id}
                        quantity={item.quantity}
                        stockQuantity={item.stockQuantity}
                        isSoldOut={item.isSoldOut}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="border border-line bg-surface p-6 sm:p-8 lg:sticky lg:top-8">
              <p className="type-label text-ink-muted">Bag summary</p>
              <div className="mt-6 flex items-center justify-between gap-6 border-y border-line py-5">
                <span>Subtotal</span>
                <strong className="font-medium">
                  {formatPrice(cart.subtotalInCents, cart.currency)}
                </strong>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-ink-muted">
                Prices and availability are checked against the current collection. Items in your bag are not reserved.
              </p>
              <Link
                href="/collections"
                className="button button-secondary mt-7 w-full"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
