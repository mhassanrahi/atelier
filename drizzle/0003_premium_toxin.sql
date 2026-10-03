CREATE TABLE "collection_editorials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid,
	"eyebrow" varchar(160) NOT NULL,
	"title" varchar(160) NOT NULL,
	"description" text NOT NULL,
	"image_src" varchar(500) NOT NULL,
	"image_alt" varchar(300) NOT NULL,
	"image_position" varchar(100) DEFAULT 'center' NOT NULL,
	"image_caption" varchar(160) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "collection_editorials_category_id_unique" UNIQUE NULLS NOT DISTINCT("category_id")
);
--> statement-breakpoint
ALTER TABLE "collection_editorials" ADD CONSTRAINT "collection_editorials_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
INSERT INTO "collection_editorials" (
	"category_id",
	"eyebrow",
	"title",
	"description",
	"image_src",
	"image_alt",
	"image_position",
	"image_caption"
)
VALUES (
	NULL,
	'Autumn / Winter 2026',
	'The collection',
	'A considered study in shape, texture, and utility. Each object is designed to feel distinct today and remain relevant well beyond the season.',
	'/collection-women.jpg',
	'Woman in sunglasses holding shopping bags',
	'center',
	'Atelier study — 2026'
);
--> statement-breakpoint
INSERT INTO "collection_editorials" (
	"category_id",
	"eyebrow",
	"title",
	"description",
	"image_src",
	"image_alt",
	"image_position",
	"image_caption"
)
SELECT
	"categories"."id",
	"seed_editorials"."eyebrow",
	"seed_editorials"."title",
	"seed_editorials"."description",
	"seed_editorials"."image_src",
	"seed_editorials"."image_alt",
	"seed_editorials"."image_position",
	"seed_editorials"."image_caption"
FROM "categories"
INNER JOIN (
	VALUES
		('bags', 'Collection 01 — Bags', 'Carried with intention', 'Sculptural companions grounded in function, finished by hand and proportioned for the rhythm of every day.', '/product-column-bag.jpg', 'Structured teal leather handbag in an editorial still life', 'center 62%', 'Atelier study — 2026'),
		('footwear', 'Collection 02 — Footwear', 'A study in movement', 'Familiar forms redrawn with fluid lines, tactile leathers, and a quiet sense of architecture.', '/product-sculpted-court.jpg', 'Floral-print high-heeled shoes against a blue background', 'center', 'Atelier study — 2026'),
		('eyewear', 'Collection 03 — Eyewear', 'A different point of view', 'Expressive frames balanced by precise details, made to bring clarity and character to the everyday.', '/product-solstice-frame.jpg', 'Round sunglasses with dark green lenses on a pale surface', 'center', 'Atelier study — 2026')
) AS "seed_editorials" (
	"slug",
	"eyebrow",
	"title",
	"description",
	"image_src",
	"image_alt",
	"image_position",
	"image_caption"
)
	ON "categories"."slug" = "seed_editorials"."slug";
