# Evidence ledgers

This directory stores structured editorial evidence. It is not read by the
application and does not replace `data/csv/**` as the producer-data source of
truth.

- Path: `data/evidence/[comunidad]/[provincia].jsonl`
- Contract: `docs/EVIDENCE_CONTRACT.md`
- Validation: `npx pnpm check:evidence`
- Progressive enforcement: add a province to `coverage.json` only when every
  current CSV row has a valid `keep` record.

JSONL keeps one decision per line so agents can find and edit a producer by
`slug` without loading or rewriting a large ledger.
