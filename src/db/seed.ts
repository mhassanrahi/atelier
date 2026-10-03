import "dotenv/config";

import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

import {
  categories,
  productDetails,
  productImages,
  products,
  stock,
} from "./schema";

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
    description:
      "A study in clean geometry, the Column is shaped with a softly structured body and a precise top handle. Its quiet profile is designed to move easily from day into evening.",
    details: ["Hand-finished edges", "Interior slip pocket", "Protective metal feet"],
    material: "Calfskin leather with a smooth leather lining and brushed metal hardware.",
    care: "Store in its dust bag and keep away from prolonged sunlight, water, and abrasive surfaces.",
    priceInCents: 148000,
    currency: "USD",
    images: [
      {
        src: "/product-column-bag.jpg",
        alt: "Structured teal leather handbag in an editorial still life",
        position: 1,
      },
    ],
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
    description:
      "A classic court shoe redrawn with a fluid heel and an elongated line. Supple nappa leather follows the foot while the sculpted base gives the silhouette its architectural character.",
    details: ["Sculpted heel", "Leather sole", "Hand-finished upper"],
    material: "Nappa leather upper, leather lining, and a hand-finished leather sole.",
    care: "Wipe gently with a soft, dry cloth and store with tissue in its dust bag between wears.",
    priceInCents: 79000,
    currency: "USD",
    images: [
      {
        src: "/product-sculpted-court.jpg",
        alt: "Floral-print high-heeled shoes against a blue background",
        position: 1,
      },
    ],
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
    description:
      "Bold in proportion and restrained in detail, the Solstice frame pairs a softened rectangular shape with precisely beveled edges for a considered everyday statement.",
    details: ["Beveled profile", "Tinted lenses", "Polished metal core"],
    material: "Polished acetate with tinted lenses and metal-reinforced temples.",
    care: "Clean with the supplied lens cloth and store in the protective case when not in use.",
    priceInCents: 46000,
    currency: "USD",
    images: [
      {
        src: "/product-solstice-frame.jpg",
        alt: "Round sunglasses with dark green lenses on a pale surface",
        position: 1,
      },
    ],
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
    description:
      "Compact and gently curved, the Arc Mini balances a sculptural outline with an easy crossbody scale. A tactile grained finish makes it suited to everyday wear.",
    details: ["Adjustable strap", "Magnetic closure", "Interior card pocket"],
    material: "Grained leather with a smooth leather lining and tonal metal hardware.",
    care: "Store in its dust bag and avoid contact with water, oils, and richly dyed fabrics.",
    priceInCents: 125000,
    currency: "USD",
    images: [
      {
        src: "/product-arc-mini.jpg",
        alt: "Small red leather handbag on a display plinth",
        position: 1,
      },
    ],
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
    const { categorySlug, details, images, ...productValues } = product;
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

    for (const image of images) {
      await seedDb
        .insert(productImages)
        .values({ ...image, productId: savedProduct.id })
        .onConflictDoUpdate({
          target: [productImages.productId, productImages.position],
          set: { src: image.src, alt: image.alt },
        });
    }

    for (const [detailIndex, content] of details.entries()) {
      await seedDb
        .insert(productDetails)
        .values({
          productId: savedProduct.id,
          content,
          position: detailIndex + 1,
        })
        .onConflictDoNothing({
          target: [productDetails.productId, productDetails.position],
        });
    }

    await seedDb
      .insert(stock)
      .values({ productId: savedProduct.id, quantity: 10 })
      .onConflictDoNothing();
  }

  console.log(
    "Catalog seed complete: 3 categories, 4 products, images, and details are ready.",
  );
}

seedCatalog().catch((error: unknown) => {
  console.error("Catalog seed failed.", error);
  process.exitCode = 1;
});
