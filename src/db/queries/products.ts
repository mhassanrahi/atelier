import "server-only";

import { and, asc, eq, isNotNull, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  categories,
  productDetails,
  productImages,
  products,
  stock,
} from "@/db/schema";

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

export type ProductDetail = Omit<HomepageProduct, "imageSrc" | "imageAlt"> & {
  sku: string;
  description: string;
  details: string[];
  material: string;
  care: string;
  images: {
    src: string;
    alt: string;
    position: number;
  }[];
};

export type CollectionCategory = {
  name: string;
  slug: string;
};

export type CollectionCatalog = {
  activeCategory?: CollectionCategory;
  categories: CollectionCategory[];
  products: HomepageProduct[];
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

export async function getProductBySlug(
  slug: string,
): Promise<ProductDetail | undefined> {
  const stockQuantity = sql<number>`coalesce(${stock.quantity}, 0)`.mapWith(
    Number,
  );

  const [product] = await db
    .select({
      id: products.id,
      slug: products.slug,
      sku: products.sku,
      name: products.name,
      subtitle: products.subtitle,
      description: products.description,
      material: products.material,
      care: products.care,
      categoryName: categories.name,
      categorySlug: categories.slug,
      priceInCents: products.priceInCents,
      currency: products.currency,
      isNew: products.isNew,
      stockQuantity,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(stock, eq(products.id, stock.productId))
    .where(and(eq(products.slug, slug), eq(products.isPublished, true)))
    .limit(1);

  if (!product) {
    return undefined;
  }

  const [images, details] = await Promise.all([
    db
      .select({
        src: productImages.src,
        alt: productImages.alt,
        position: productImages.position,
      })
      .from(productImages)
      .where(eq(productImages.productId, product.id))
      .orderBy(asc(productImages.position)),
    db
      .select({ content: productDetails.content })
      .from(productDetails)
      .where(eq(productDetails.productId, product.id))
      .orderBy(asc(productDetails.position)),
  ]);

  return {
    id: product.id,
    slug: product.slug,
    sku: product.sku,
    name: product.name,
    subtitle: product.subtitle,
    description: product.description,
    details: details.map((detail) => detail.content),
    material: product.material,
    care: product.care,
    category: {
      name: product.categoryName,
      slug: product.categorySlug,
    },
    priceInCents: product.priceInCents,
    currency: product.currency,
    images,
    isNew: product.isNew,
    stockQuantity: product.stockQuantity,
    isSoldOut: product.stockQuantity <= 0,
  };
}

export async function getCollectionCatalog(
  categorySlug?: string,
): Promise<CollectionCatalog | undefined> {
  const catalogCategories = await db
    .select({ name: categories.name, slug: categories.slug })
    .from(categories)
    .orderBy(asc(categories.name));

  const activeCategory = categorySlug
    ? catalogCategories.find((category) => category.slug === categorySlug)
    : undefined;

  if (categorySlug && !activeCategory) {
    return undefined;
  }

  const stockQuantity = sql<number>`coalesce(${stock.quantity}, 0)`.mapWith(
    Number,
  );
  const conditions = [eq(products.isPublished, true)];

  if (activeCategory) {
    conditions.push(eq(categories.slug, activeCategory.slug));
  }

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
    .where(and(...conditions))
    .orderBy(asc(products.name));

  return {
    activeCategory,
    categories: catalogCategories,
    products: rows.map((product) => ({
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
    })),
  };
}
