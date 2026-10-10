import "server-only";

import { and, eq, inArray, sql } from "drizzle-orm";

import { db } from "@/db";
import { productImages, products, stock } from "@/db/schema";
import type { CartProduct } from "@/lib/cart-model";

const stockQuantity = sql<number>`coalesce(${stock.quantity}, 0)`.mapWith(Number);

function cartProductSelection() {
  return {
    id: products.id,
    slug: products.slug,
    name: products.name,
    subtitle: products.subtitle,
    priceInCents: products.priceInCents,
    currency: products.currency,
    imageSrc: productImages.src,
    imageAlt: productImages.alt,
    stockQuantity,
  };
}

export async function getCartProducts(productIds: string[]): Promise<CartProduct[]> {
  if (productIds.length === 0) {
    return [];
  }

  return db
    .select(cartProductSelection())
    .from(products)
    .innerJoin(
      productImages,
      and(
        eq(products.id, productImages.productId),
        eq(productImages.position, 1),
      ),
    )
    .leftJoin(stock, eq(products.id, stock.productId))
    .where(
      and(
        inArray(products.id, productIds),
        eq(products.isPublished, true),
      ),
    );
}

export async function getCartProduct(
  productId: string,
): Promise<CartProduct | undefined> {
  const [product] = await db
    .select(cartProductSelection())
    .from(products)
    .innerJoin(
      productImages,
      and(
        eq(products.id, productImages.productId),
        eq(productImages.position, 1),
      ),
    )
    .leftJoin(stock, eq(products.id, stock.productId))
    .where(and(eq(products.id, productId), eq(products.isPublished, true)))
    .limit(1);

  return product;
}
