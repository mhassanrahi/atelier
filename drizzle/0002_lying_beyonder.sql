CREATE TABLE "product_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"content" varchar(200) NOT NULL,
	"position" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_details_position_positive" CHECK ("product_details"."position" > 0)
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "material" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "care" text;--> statement-breakpoint
ALTER TABLE "product_details" ADD CONSTRAINT "product_details_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "product_details_product_position_unique" ON "product_details" USING btree ("product_id","position");--> statement-breakpoint
UPDATE "products"
SET
	"description" = 'A study in clean geometry, the Column is shaped with a softly structured body and a precise top handle. Its quiet profile is designed to move easily from day into evening.',
	"material" = 'Calfskin leather with a smooth leather lining and brushed metal hardware.',
	"care" = 'Store in its dust bag and keep away from prolonged sunlight, water, and abrasive surfaces.'
WHERE "sku" = 'ATL-COLUMN-BAG';--> statement-breakpoint
UPDATE "products"
SET
	"description" = 'A classic court shoe redrawn with a fluid heel and an elongated line. Supple nappa leather follows the foot while the sculpted base gives the silhouette its architectural character.',
	"material" = 'Nappa leather upper, leather lining, and a hand-finished leather sole.',
	"care" = 'Wipe gently with a soft, dry cloth and store with tissue in its dust bag between wears.'
WHERE "sku" = 'ATL-SCULPTED-COURT';--> statement-breakpoint
UPDATE "products"
SET
	"description" = 'Bold in proportion and restrained in detail, the Solstice frame pairs a softened rectangular shape with precisely beveled edges for a considered everyday statement.',
	"material" = 'Polished acetate with tinted lenses and metal-reinforced temples.',
	"care" = 'Clean with the supplied lens cloth and store in the protective case when not in use.'
WHERE "sku" = 'ATL-SOLSTICE-FRAME';--> statement-breakpoint
UPDATE "products"
SET
	"description" = 'Compact and gently curved, the Arc Mini balances a sculptural outline with an easy crossbody scale. A tactile grained finish makes it suited to everyday wear.',
	"material" = 'Grained leather with a smooth leather lining and tonal metal hardware.',
	"care" = 'Store in its dust bag and avoid contact with water, oils, and richly dyed fabrics.'
WHERE "sku" = 'ATL-ARC-MINI-BAG';--> statement-breakpoint
INSERT INTO "product_details" ("product_id", "content", "position")
SELECT "products"."id", "seed_details"."content", "seed_details"."position"
FROM "products"
INNER JOIN (
	VALUES
		('ATL-COLUMN-BAG', 'Hand-finished edges', 1),
		('ATL-COLUMN-BAG', 'Interior slip pocket', 2),
		('ATL-COLUMN-BAG', 'Protective metal feet', 3),
		('ATL-SCULPTED-COURT', 'Sculpted heel', 1),
		('ATL-SCULPTED-COURT', 'Leather sole', 2),
		('ATL-SCULPTED-COURT', 'Hand-finished upper', 3),
		('ATL-SOLSTICE-FRAME', 'Beveled profile', 1),
		('ATL-SOLSTICE-FRAME', 'Tinted lenses', 2),
		('ATL-SOLSTICE-FRAME', 'Polished metal core', 3),
		('ATL-ARC-MINI-BAG', 'Adjustable strap', 1),
		('ATL-ARC-MINI-BAG', 'Magnetic closure', 2),
		('ATL-ARC-MINI-BAG', 'Interior card pocket', 3)
) AS "seed_details" ("sku", "content", "position")
	ON "products"."sku" = "seed_details"."sku";--> statement-breakpoint
DO $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM "products"
		WHERE "description" IS NULL
			OR "material" IS NULL
			OR "care" IS NULL
	) THEN
		RAISE EXCEPTION 'Product content backfill is incomplete; populate description, material, and care before applying this migration';
	END IF;
END
$$;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "material" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "care" SET NOT NULL;
