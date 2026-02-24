-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- CreateTable
CREATE TABLE "Producer" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(240) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "city" VARCHAR(120),
    "category" VARCHAR(120),
    "subcategory" VARCHAR(180),
    "address" TEXT,
    "description" TEXT,
    "openingHours" TEXT,
    "phone" VARCHAR(80),
    "email" VARCHAR(180),
    "website" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "googleMapsUrl" TEXT,
    "reviewed" BOOLEAN NOT NULL DEFAULT false,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "dedupeKey" VARCHAR(400) NOT NULL,
    "searchText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Producer_slug_key" ON "Producer"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Producer_dedupeKey_key" ON "Producer"("dedupeKey");

-- CreateIndex
CREATE INDEX "Producer_city_idx" ON "Producer"("city");

-- CreateIndex
CREATE INDEX "Producer_category_idx" ON "Producer"("category");

-- CreateIndex
CREATE INDEX "Producer_subcategory_idx" ON "Producer"("subcategory");

-- CreateIndex
CREATE INDEX "Producer_latitude_longitude_idx" ON "Producer"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "Producer_category_subcategory_idx" ON "Producer"("category", "subcategory");

-- CreateIndex
CREATE INDEX "Producer_city_category_subcategory_idx" ON "Producer"("city", "category", "subcategory");

-- CreateIndex
CREATE INDEX "Producer_searchText_trgm_idx" ON "Producer" USING GIN ("searchText" gin_trgm_ops);
