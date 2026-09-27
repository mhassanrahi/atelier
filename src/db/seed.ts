import "dotenv/config";

import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

import { categories, products, stock } from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed the catalog.");
}

const seedDb = drizzle(databaseUrl);

const categorySeed = [
  { name: "Bags", slug: "bags" },
  { name: "Footwear", slug: "footwear" },
  { name: "Eyewear", slug: "eyewear" },
] as const;

const productSeed = [
  {
    categorySlug: "bags",
    sku: "ATL-COLUMN-BAG",
    name: "Column Leather Bag",
    slug: "column-leather-bag",
    subtitle: "Hand-finished calfskin",
    priceInCents: 148000,
    currency: "USD",
    imageSrc: "/product-column-bag.jpg",
    imageAlt: "Structured tan leather handbag",
    isPublished: true,
    isNew: true,
    homepagePosition: 1,
  },
  {
    categorySlug: "footwear",
    sku: "ATL-SCULPTED-COURT",
    name: "Sculpted Court",
    slug: "sculpted-court",
    subtitle: "Nappa leather",
    priceInCents: 79000,
    currency: "USD",
    imageSrc: "/product-sculpted-court.jpg",
    imageAlt: "Black sculptural high heel shoe",
    isPublished: true,
    isNew: false,
    homepagePosition: 2,
  },
  {
    categorySlug: "eyewear",
    sku: "ATL-SOLSTICE-FRAME",
    name: "Solstice Frame",
    slug: "solstice-frame",
    subtitle: "Acetate sunglasses",
    priceInCents: 46000,
    currency: "USD",
    imageSrc: "/product-solstice-frame.jpg",
    imageAlt: "Dark sunglasses on a warm neutral surface",
    isPublished: true,
    isNew: false,
    homepagePosition: 3,
  },
  {
    categorySlug: "bags",
    sku: "ATL-ARC-MINI-BAG",
    name: "Arc Mini Bag",
    slug: "arc-mini-bag",
    subtitle: "Grained leather",
    priceInCents: 125000,
    currency: "USD",
    imageSrc: "/product-arc-mini.jpg",
    imageAlt: "Small cream leather handbag",
    isPublished: true,
    isNew: false,
    homepagePosition: 4,
  },
] as const;

async function seedCatalog() {
  const categoryIds = new Map<string, string>();

  for (const category of categorySeed) {
    await seedDb.insert(categories).values(category).onConflictDoNothing();

    const [savedCategory] = await seedDb
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, category.slug))
      .limit(1);

    if (!savedCategory) {
      throw new Error(`Could not seed category: ${category.slug}`);
    }

    categoryIds.set(category.slug, savedCategory.id);
  }

  for (const product of productSeed) {
    const { categorySlug, ...productValues } = product;
    const categoryId = categoryIds.get(categorySlug);

    if (!categoryId) {
      throw new Error(`Missing category for product: ${product.sku}`);
    }

    await seedDb
      .insert(products)
      .values({ ...productValues, categoryId })
      .onConflictDoNothing();

    const [savedProduct] = await seedDb
      .select({ id: products.id })
      .from(products)
      .where(eq(products.sku, product.sku))
      .limit(1);

    if (!savedProduct) {
      throw new Error(`Could not seed product: ${product.sku}`);
    }

    await seedDb
      .insert(stock)
      .values({ productId: savedProduct.id, quantity: 10 })
      .onConflictDoNothing();
  }

  console.log("Catalog seed complete: 3 categories and 4 products are ready.");
}

seedCatalog().catch((error: unknown) => {
  console.error("Catalog seed failed.", error);
  process.exitCode = 1;
});
