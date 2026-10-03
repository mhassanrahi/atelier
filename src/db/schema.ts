import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  ...timestamps,
});

export const collectionEditorials = pgTable(
  "collection_editorials",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "cascade",
    }),
    eyebrow: varchar("eyebrow", { length: 160 }).notNull(),
    title: varchar("title", { length: 160 }).notNull(),
    description: text("description").notNull(),
    imageSrc: varchar("image_src", { length: 500 }).notNull(),
    imageAlt: varchar("image_alt", { length: 300 }).notNull(),
    imagePosition: varchar("image_position", { length: 100 })
      .default("center")
      .notNull(),
    imageCaption: varchar("image_caption", { length: 160 }).notNull(),
    ...timestamps,
  },
  (table) => [
    unique("collection_editorials_category_id_unique")
      .on(table.categoryId)
      .nullsNotDistinct(),
  ],
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    sku: varchar("sku", { length: 64 }).notNull().unique(),
    name: varchar("name", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 160 }).notNull().unique(),
    subtitle: varchar("subtitle", { length: 200 }).notNull(),
    description: text("description").notNull(),
    material: text("material").notNull(),
    care: text("care").notNull(),
    priceInCents: integer("price_in_cents").notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    isPublished: boolean("is_published").default(false).notNull(),
    isNew: boolean("is_new").default(false).notNull(),
    homepagePosition: integer("homepage_position"),
    ...timestamps,
  },
  (table) => [
    index("products_category_id_idx").on(table.categoryId),
    index("products_homepage_idx").on(
      table.isPublished,
      table.homepagePosition,
    ),
    uniqueIndex("products_homepage_position_unique").on(
      table.homepagePosition,
    ),
    check("products_price_in_cents_nonnegative", sql`${table.priceInCents} >= 0`),
    check(
      "products_homepage_position_positive",
      sql`${table.homepagePosition} IS NULL OR ${table.homepagePosition} > 0`,
    ),
  ],
);

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    src: varchar("src", { length: 500 }).notNull(),
    alt: varchar("alt", { length: 300 }).notNull(),
    position: integer("position").notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("product_images_product_position_unique").on(
      table.productId,
      table.position,
    ),
    check("product_images_position_positive", sql`${table.position} > 0`),
  ],
);

export const productDetails = pgTable(
  "product_details",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    content: varchar("content", { length: 200 }).notNull(),
    position: integer("position").notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("product_details_product_position_unique").on(
      table.productId,
      table.position,
    ),
    check("product_details_position_positive", sql`${table.position} > 0`),
  ],
);

export const stock = pgTable(
  "stock",
  {
    productId: uuid("product_id")
      .primaryKey()
      .references(() => products.id, { onDelete: "cascade" }),
    quantity: integer("quantity").default(0).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check("stock_quantity_nonnegative", sql`${table.quantity} >= 0`),
  ],
);

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  products: many(products),
  collectionEditorial: one(collectionEditorials),
}));

export const collectionEditorialsRelations = relations(
  collectionEditorials,
  ({ one }) => ({
    category: one(categories, {
      fields: [collectionEditorials.categoryId],
      references: [categories.id],
    }),
  }),
);

export const productsRelations = relations(products, ({ many, one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  details: many(productDetails),
  stock: one(stock),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const productDetailsRelations = relations(productDetails, ({ one }) => ({
  product: one(products, {
    fields: [productDetails.productId],
    references: [products.id],
  }),
}));

export const stockRelations = relations(stock, ({ one }) => ({
  product: one(products, {
    fields: [stock.productId],
    references: [products.id],
  }),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type CollectionEditorial = typeof collectionEditorials.$inferSelect;
export type NewCollectionEditorial = typeof collectionEditorials.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductImage = typeof productImages.$inferSelect;
export type NewProductImage = typeof productImages.$inferInsert;
export type ProductDetail = typeof productDetails.$inferSelect;
export type NewProductDetail = typeof productDetails.$inferInsert;
export type Stock = typeof stock.$inferSelect;
export type NewStock = typeof stock.$inferInsert;
