type CountQuery = (
  statement: string,
  values: readonly (string | number)[],
) => Promise<readonly { count: number | string }[]>;

const REFERENCE_TABLES = [
  ["favorites", "country"],
  ["producer_claims", "country"],
  ["producer_memberships", "country"],
  ["producer_change_requests", "country"],
  ["producer_change_executions", "country"],
  ["entitlements", "producer_country"],
  ["producer_profile_upgrade_requests", "country"],
  ["producer_daily_stats", "country"],
] as const;

/** Aggregate references only: no private notes, account identifiers or payment IDs. */
export async function inspectProducerReferences(
  country: string,
  producerId: number,
  query: CountQuery,
): Promise<Record<string, number>> {
  if (
    !/^[a-z]{2}$/.test(country) ||
    !Number.isSafeInteger(producerId) ||
    producerId < 1
  )
    throw new Error("Invalid producer identity.");
  const counts: Record<string, number> = {};
  for (const [table, countryColumn] of REFERENCE_TABLES) {
    const rows = await query(
      `SELECT count(*) AS count FROM ${table} WHERE ${countryColumn} = $1 AND producer_id = $2`,
      [country, producerId],
    );
    if (
      rows.length !== 1 ||
      !Number.isSafeInteger(Number(rows[0].count)) ||
      Number(rows[0].count) < 0
    )
      throw new Error(`Incomplete reference inspection for ${table}.`);
    counts[table] = Number(rows[0].count);
  }
  return counts;
}
