import { readFile } from "node:fs/promises";
import path from "node:path";
import "dotenv/config";

import { GeocodeStatus, Prisma, PrismaClient } from "@prisma/client";
import { parse } from "csv-parse/sync";

import { isWithinBarcelonaProvince } from "../lib/barcelona";
import { CsvProducerRow, PreparedSeedProducer, parseCsvProducerRow } from "../lib/csv-producer";
import {
  geocodeWithRetry,
  getGeocodingConfigFromEnv,
  sleep,
} from "../lib/geocoding";

type GeocodingStats = {
  cacheHits: number;
  remoteRequests: number;
  newlyGeocoded: number;
  cityFallbackAssignments: number;
  notFound: number;
  errors: number;
  skippedByLimit: number;
};

type CacheLookup = {
  queryText: string;
  status: GeocodeStatus;
  latitude: number | null;
  longitude: number | null;
};

const DIACRITIC_REGEX = /\p{Diacritic}/gu;
const NON_ALNUM_REGEX = /[^\p{L}\p{N}]+/gu;

const prisma = new PrismaClient();

function splitInChunks<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function normalizeLookupKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(DIACRITIC_REGEX, "")
    .toLowerCase()
    .replace(NON_ALNUM_REGEX, " ")
    .trim();
}

function buildCityCacheKey(city: string): string {
  return `city|${normalizeLookupKey(city)}`;
}

function buildCityQueryCandidates(city: string): string[] {
  const normalized = city.replace(/\s+/g, " ").trim();
  const withoutParentheses = normalized.replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
  const firstSlashPart = withoutParentheses.split("/")[0]?.trim() ?? "";
  const firstDashPart = withoutParentheses.split("–")[0]?.split(" - ")[0]?.trim() ?? "";

  const baseCandidates = [normalized, withoutParentheses, firstSlashPart, firstDashPart]
    .filter((value) => value.length > 0)
    .filter((value, index, values) => values.indexOf(value) === index);

  return baseCandidates
    .flatMap((base) => [
      `${base}, Barcelona, Catalunya, España`,
      `${base}, Provincia de Barcelona, Catalunya, España`,
      `${base}, Catalunya, España`,
    ])
    .filter((value, index, values) => values.indexOf(value) === index);
}

function hasCoordinates(producer: Prisma.ProducerCreateManyInput): boolean {
  return (
    producer.latitude !== null &&
    producer.latitude !== undefined &&
    producer.longitude !== null &&
    producer.longitude !== undefined
  );
}

function hasUsableCoordinates(producer: Prisma.ProducerCreateManyInput): boolean {
  if (!hasCoordinates(producer)) {
    return false;
  }

  return isWithinBarcelonaProvince(producer.latitude as number, producer.longitude as number);
}

function toCacheLookup(row: {
  queryText: string;
  status: GeocodeStatus;
  latitude: number | null;
  longitude: number | null;
}): CacheLookup {
  return {
    queryText: row.queryText,
    status: row.status,
    latitude: row.latitude,
    longitude: row.longitude,
  };
}

async function enrichCoordinates(producers: PreparedSeedProducer[]): Promise<GeocodingStats> {
  const config = getGeocodingConfigFromEnv();

  const pending = producers.filter(
    (producer) => !hasUsableCoordinates(producer.data) && producer.geocodeQueryText,
  );

  if (!config.enabled) {
    console.info("Geocoding disabled via GEOCODING_ENABLED=false");
    return {
      cacheHits: 0,
      remoteRequests: 0,
      newlyGeocoded: 0,
      cityFallbackAssignments: 0,
      notFound: 0,
      errors: 0,
      skippedByLimit: pending.length,
    };
  }

  if (pending.length === 0) {
    return {
      cacheHits: 0,
      remoteRequests: 0,
      newlyGeocoded: 0,
      cityFallbackAssignments: 0,
      notFound: 0,
      errors: 0,
      skippedByLimit: 0,
    };
  }

  const producerKeys = [...new Set(pending.map((producer) => producer.geocodeQueryKey))];
  const cityKeys = new Set<string>();

  for (const producer of pending) {
    if (producer.data.city) {
      cityKeys.add(buildCityCacheKey(producer.data.city));
    }
  }

  const cacheKeys = [...new Set([...producerKeys, ...cityKeys])];
  const cachedRows = await prisma.geocodeCache.findMany({
    where: {
      queryKey: {
        in: cacheKeys,
      },
    },
    select: {
      queryKey: true,
      queryText: true,
      status: true,
      latitude: true,
      longitude: true,
    },
  });

  const cacheByKey = new Map<string, CacheLookup>(
    cachedRows.map((row) => [row.queryKey, toCacheLookup(row)]),
  );

  const cityResolution = new Map<string, CacheLookup>();

  const stats: GeocodingStats = {
    cacheHits: 0,
    remoteRequests: 0,
    newlyGeocoded: 0,
    cityFallbackAssignments: 0,
    notFound: 0,
    errors: 0,
    skippedByLimit: 0,
  };

  async function runLookup(queryKey: string, queryText: string): Promise<CacheLookup | null> {
    if (config.maxRequests !== null && stats.remoteRequests >= config.maxRequests) {
      stats.skippedByLimit += 1;
      return null;
    }

    if (stats.remoteRequests > 0) {
      await sleep(config.delayMs);
    }

    const result = await geocodeWithRetry(queryText, config);
    stats.remoteRequests += 1;

    let lookup: CacheLookup;

    if (result.status === "SUCCESS") {
      lookup = {
        queryText: result.queryText,
        status: GeocodeStatus.SUCCESS,
        latitude: result.latitude,
        longitude: result.longitude,
      };
    } else if (result.status === "NOT_FOUND") {
      stats.notFound += 1;
      lookup = {
        queryText: result.queryText,
        status: GeocodeStatus.NOT_FOUND,
        latitude: null,
        longitude: null,
      };
    } else {
      stats.errors += 1;
      lookup = {
        queryText: result.queryText,
        status: GeocodeStatus.ERROR,
        latitude: null,
        longitude: null,
      };
    }

    await prisma.geocodeCache.upsert({
      where: { queryKey },
      create: {
        queryKey,
        queryText: lookup.queryText,
        latitude: lookup.latitude,
        longitude: lookup.longitude,
        status: lookup.status,
        source: result.source,
        lastError: result.status === "ERROR" ? result.error : null,
      },
      update: {
        queryText: lookup.queryText,
        latitude: lookup.latitude,
        longitude: lookup.longitude,
        status: lookup.status,
        source: result.source,
        lastError: result.status === "ERROR" ? result.error : null,
      },
    });

    cacheByKey.set(queryKey, lookup);
    return lookup;
  }

  async function resolveCity(city: string): Promise<CacheLookup | null> {
    const cityCacheKey = buildCityCacheKey(city);
    const cityQueryCandidates = buildCityQueryCandidates(city);

    const memoized = cityResolution.get(cityCacheKey);
    if (memoized?.status === GeocodeStatus.SUCCESS) {
      return memoized;
    }

    const cached = cacheByKey.get(cityCacheKey);
    if (
      cached &&
      cached.status === GeocodeStatus.SUCCESS &&
      cityQueryCandidates.includes(cached.queryText) &&
      cached.latitude !== null &&
      cached.longitude !== null &&
      isWithinBarcelonaProvince(cached.latitude, cached.longitude)
    ) {
      cityResolution.set(cityCacheKey, cached);
      return cached;
    }

    let lastLookup = cached ?? null;

    for (const cityQuery of cityQueryCandidates) {
      if (
        lastLookup &&
        lastLookup.queryText === cityQuery &&
        lastLookup.status === GeocodeStatus.NOT_FOUND
      ) {
        continue;
      }

      const lookedUp = await runLookup(cityCacheKey, cityQuery);
      if (!lookedUp) {
        return lastLookup;
      }

      lastLookup = lookedUp;
      if (lookedUp.status === GeocodeStatus.SUCCESS) {
        cityResolution.set(cityCacheKey, lookedUp);
        return lookedUp;
      }
    }

    if (lastLookup) {
      cityResolution.set(cityCacheKey, lastLookup);
    }

    return lastLookup;
  }

  for (const producer of pending) {
    const producerQueryText = producer.geocodeQueryText;
    const cachedProducerLookup = cacheByKey.get(producer.geocodeQueryKey);

    if (
      cachedProducerLookup &&
      producerQueryText &&
      cachedProducerLookup.queryText === producerQueryText &&
      cachedProducerLookup.status === GeocodeStatus.SUCCESS &&
      cachedProducerLookup.latitude !== null &&
      cachedProducerLookup.longitude !== null &&
      isWithinBarcelonaProvince(cachedProducerLookup.latitude, cachedProducerLookup.longitude)
    ) {
      producer.data.latitude = cachedProducerLookup.latitude;
      producer.data.longitude = cachedProducerLookup.longitude;
      stats.cacheHits += 1;
      continue;
    }

    if (producer.data.city) {
      const cityLookup = await resolveCity(producer.data.city);

      if (
        cityLookup &&
        cityLookup.status === GeocodeStatus.SUCCESS &&
        cityLookup.latitude !== null &&
        cityLookup.longitude !== null &&
        isWithinBarcelonaProvince(cityLookup.latitude, cityLookup.longitude)
      ) {
        producer.data.latitude = cityLookup.latitude;
        producer.data.longitude = cityLookup.longitude;
        stats.cityFallbackAssignments += 1;

        if (!producerQueryText) {
          continue;
        }

        if (
          !cachedProducerLookup ||
          cachedProducerLookup.status !== GeocodeStatus.SUCCESS ||
          cachedProducerLookup.queryText !== producerQueryText
        ) {
          const producerLookup: CacheLookup = {
            queryText: producerQueryText,
            status: GeocodeStatus.SUCCESS,
            latitude: cityLookup.latitude,
            longitude: cityLookup.longitude,
          };

          await prisma.geocodeCache.upsert({
            where: { queryKey: producer.geocodeQueryKey },
            create: {
              queryKey: producer.geocodeQueryKey,
              queryText: producerLookup.queryText,
              latitude: producerLookup.latitude,
              longitude: producerLookup.longitude,
              status: producerLookup.status,
              source: "city-fallback",
              lastError: null,
            },
            update: {
              queryText: producerLookup.queryText,
              latitude: producerLookup.latitude,
              longitude: producerLookup.longitude,
              status: producerLookup.status,
              source: "city-fallback",
              lastError: null,
            },
          });

          cacheByKey.set(producer.geocodeQueryKey, producerLookup);
        }

        continue;
      }
    }

    if (!producerQueryText) {
      continue;
    }

    if (
      cachedProducerLookup &&
      cachedProducerLookup.queryText === producerQueryText &&
      cachedProducerLookup.status === GeocodeStatus.NOT_FOUND
    ) {
      stats.cacheHits += 1;
      continue;
    }

    const producerLookup = await runLookup(producer.geocodeQueryKey, producerQueryText);
    if (
      producerLookup &&
      producerLookup.status === GeocodeStatus.SUCCESS &&
      producerLookup.latitude !== null &&
      producerLookup.longitude !== null &&
      isWithinBarcelonaProvince(producerLookup.latitude, producerLookup.longitude)
    ) {
      producer.data.latitude = producerLookup.latitude;
      producer.data.longitude = producerLookup.longitude;
      stats.newlyGeocoded += 1;
    }
  }

  return stats;
}

async function main(): Promise<void> {
  const csvPath = path.resolve(process.cwd(), "Km0-productores.csv");
  const rawCsv = await readFile(csvPath, "utf8");

  const rows = parse(rawCsv, {
    columns: true,
    bom: true,
    skip_empty_lines: true,
  }) as CsvProducerRow[];

  const byDedupeKey = new Map<string, PreparedSeedProducer>();
  const slugUsage = new Map<string, number>();

  let skippedNoName = 0;
  let duplicates = 0;

  for (const row of rows) {
    const parsedRow = parseCsvProducerRow(row);
    if (!parsedRow) {
      skippedNoName += 1;
      continue;
    }

    if (byDedupeKey.has(parsedRow.dedupeKey)) {
      duplicates += 1;
      continue;
    }

    const seenCount = (slugUsage.get(parsedRow.baseSlug) ?? 0) + 1;
    slugUsage.set(parsedRow.baseSlug, seenCount);
    parsedRow.data.slug = seenCount === 1 ? parsedRow.baseSlug : `${parsedRow.baseSlug}-${seenCount}`;

    byDedupeKey.set(parsedRow.dedupeKey, parsedRow);
  }

  const producers = [...byDedupeKey.values()];

  const initialCoordinates = producers.filter((producer) => hasUsableCoordinates(producer.data)).length;
  const geocodingStats = await enrichCoordinates(producers);
  const finalCoordinates = producers.filter((producer) => hasUsableCoordinates(producer.data)).length;

  await prisma.producer.deleteMany();

  for (const chunk of splitInChunks(producers.map((producer) => producer.data), 500)) {
    await prisma.producer.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }

  console.info("CSV total rows:", rows.length);
  console.info("Inserted producers:", producers.length);
  console.info("Rows with coordinates from CSV:", initialCoordinates);
  console.info("Rows with coordinates after geocoding:", finalCoordinates);
  console.info("Geocoding cache hits:", geocodingStats.cacheHits);
  console.info("Geocoding remote requests:", geocodingStats.remoteRequests);
  console.info("Geocoding new coordinates:", geocodingStats.newlyGeocoded);
  console.info("Geocoding city fallback assignments:", geocodingStats.cityFallbackAssignments);
  console.info("Geocoding not found:", geocodingStats.notFound);
  console.info("Geocoding errors:", geocodingStats.errors);
  console.info("Geocoding skipped by request limit:", geocodingStats.skippedByLimit);
  console.info("Skipped without name:", skippedNoName);
  console.info("Skipped as duplicates:", duplicates);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
