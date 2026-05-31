# Candidate Notes

This folder stores raw candidate notes from manual research or other agents.

These files are not a source of truth. Treat every entry as unverified until it
has been checked against reliable sources and de-duplicated against the current
province CSV.

Use this folder as the shared scratch space for all agents. Do not create
agent-private candidate folders or parallel province lists.

Recommended naming:
- `docs/candidates/[provincia].md` for shared province research.
- `docs/candidates/[provincia]-[topic].md` only when a focused pass would make
  the main file hard to review.

Before adding any producer to `data/csv/**`:

1. Run `npx pnpm list:province [provincia]` to check existing rows.
2. Verify the producer through an official website, registry, map listing, or
   reliable public source.
3. Add only real producers with a stable `slug`, normalized `categoria`,
   coordinates, `Google Maps`, `verificacion`, and `Venta online`.
4. Run `npx pnpm check:csv:changed` while iterating.
5. Run `npx pnpm verify:ai` before finishing.

Prune or update these notes once candidates are accepted, rejected, or already
present in the catalog.

For each candidate, keep enough evidence for another agent to continue without
restarting:
- status: `unverified`, `accepted`, `rejected`, or `already-present`
- source URL or search route used
- duplicate check result
- final slug when accepted or already present
