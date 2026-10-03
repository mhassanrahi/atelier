CREATE TABLE "product_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"src" varchar(500) NOT NULL,
	"alt" varchar(300) NOT NULL,
	"position" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_images_position_positive" CHECK ("product_images"."position" > 0)
);
--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "product_images_product_position_unique" ON "product_images" USING btree ("product_id","position");--> statement-breakpoint
INSERT INTO "product_images" ("product_id", "src", "alt", "position")
SELECT "id", "image_src", "image_alt", 1
FROM "products";--> statement-breakpoint
DO $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM "products"
		LEFT JOIN "product_images"
			ON "product_images"."product_id" = "products"."id"
			AND "product_images"."position" = 1
		WHERE "product_images"."id" IS NULL
	) THEN
		RAISE EXCEPTION 'Product image backfill was incomplete';
	END IF;
END
$$;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "image_src";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "image_alt";
