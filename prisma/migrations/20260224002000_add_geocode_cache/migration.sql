-- CreateEnum
CREATE TYPE "GeocodeStatus" AS ENUM ('SUCCESS', 'NOT_FOUND', 'ERROR');

-- CreateTable
CREATE TABLE "GeocodeCache" (
    "id" SERIAL NOT NULL,
    "queryKey" VARCHAR(400) NOT NULL,
    "queryText" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "status" "GeocodeStatus" NOT NULL DEFAULT 'SUCCESS',
    "source" VARCHAR(40),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeocodeCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GeocodeCache_queryKey_key" ON "GeocodeCache"("queryKey");

-- CreateIndex
CREATE INDEX "GeocodeCache_status_idx" ON "GeocodeCache"("status");
