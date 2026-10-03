import "server-only";

import { and, asc, eq, isNotNull, sql } from "drizzle-orm";

import { db } from "@/db";
import { categories, productImages, products, stock } from "@/db/schema";

export type HomepageProduct = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: {
    name: string;
    slug: string;
  };
  priceInCents: number;
  currency: string;
  imageSrc: string;
  imageAlt: string;
  isNew: boolean;
  stockQuantity: number;
  isSoldOut: boolean;
};

export async function getHomepageProducts(): Promise<HomepageProduct[]> {
  const stockQuantity = sql<number>`coalesce(${stock.quantity}, 0)`.mapWith(
    Number,
  );

  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      subtitle: products.subtitle,
      categoryName: categories.name,
      categorySlug: categories.slug,
      priceInCents: products.priceInCents,
      currency: products.currency,
      imageSrc: productImages.src,
      imageAlt: productImages.alt,
      isNew: products.isNew,
      stockQuantity,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
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
        eq(products.isPublished, true),
        isNotNull(products.homepagePosition),
      ),
    )
    .orderBy(asc(products.homepagePosition))
    .limit(4);

  return rows.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    subtitle: product.subtitle,
    category: {
      name: product.categoryName,
      slug: product.categorySlug,
    },
    priceInCents: product.priceInCents,
    currency: product.currency,
    imageSrc: product.imageSrc,
    imageAlt: product.imageAlt,
    isNew: product.isNew,
    stockQuantity: product.stockQuantity,
    isSoldOut: product.stockQuantity <= 0,
  }));
}
