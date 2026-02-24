import { jsonWithCache } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";

type BucketRow = {
  value: string;
  count: bigint | number | string;
};

function normalizeBuckets(rows: BucketRow[]): Array<{ value: string; count: number }> {
  return rows.map((row) => ({
    value: row.value,
    count:
      typeof row.count === "bigint"
        ? Number(row.count)
        : typeof row.count === "string"
          ? Number.parseInt(row.count, 10)
          : row.count,
  }));
}

export async function GET() {
  try {
    const [citiesRaw, categoriesRaw, subcategoriesRaw] = await Promise.all([
      prisma.$queryRaw<BucketRow[]>`
        SELECT city AS value, COUNT(*) AS count
        FROM "Producer"
        WHERE city IS NOT NULL AND city <> ''
        GROUP BY city
        ORDER BY COUNT(*) DESC, city ASC
      `,
      prisma.$queryRaw<BucketRow[]>`
        SELECT category AS value, COUNT(*) AS count
        FROM "Producer"
        WHERE category IS NOT NULL AND category <> ''
        GROUP BY category
        ORDER BY COUNT(*) DESC, category ASC
      `,
      prisma.$queryRaw<BucketRow[]>`
        SELECT subcategory AS value, COUNT(*) AS count
        FROM "Producer"
        WHERE subcategory IS NOT NULL AND subcategory <> ''
        GROUP BY subcategory
        ORDER BY COUNT(*) DESC, subcategory ASC
      `,
    ]);

    return jsonWithCache(
      {
        cities: normalizeBuckets(citiesRaw),
        categories: normalizeBuckets(categoriesRaw),
        subcategories: normalizeBuckets(subcategoriesRaw),
      },
      "public, s-maxage=3600, stale-while-revalidate=86400",
    );
  } catch (error) {
    console.error("/api/taxonomy failed", error);
    return jsonWithCache(
      { error: "No se pudo cargar taxonomía." },
      "no-store",
      500,
    );
  }
}
