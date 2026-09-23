/** Instance-local overload protection, not a distributed quota or spending cap. */
export function createCatalogRequestBudget({
  requestsPerMinute = 120,
  maxConcurrent = 8,
  now = Date.now,
} = {}) {
  let windowStart = now();
  let requests = 0;
  let active = 0;
  return {
    acquire(): (() => void) | null {
      const time = now();
      if (time - windowStart >= 60_000) { windowStart = time; requests = 0; }
      if (active >= maxConcurrent || requests >= requestsPerMinute) return null;
      requests++;
      active++;
      let released = false;
      return () => { if (!released) { released = true; active--; } };
    },
  };
}
