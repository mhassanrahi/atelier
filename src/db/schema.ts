import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  timestamp,
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
    priceInCents: integer("price_in_cents").notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    imageSrc: varchar("image_src", { length: 500 }).notNull(),
    imageAlt: varchar("image_alt", { length: 300 }).notNull(),
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

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  stock: one(stock),
}));

export const stockRelations = relations(stock, ({ one }) => ({
  product: one(products, {
    fields: [stock.productId],
    references: [products.id],
  }),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Stock = typeof stock.$inferSelect;
export type NewStock = typeof stock.$inferInsert;
