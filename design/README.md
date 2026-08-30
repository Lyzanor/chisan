# Chisan design

This directory is the single source of truth for Chisan's visual language. It
is intentionally separate from catalog data, account state, routing and
deployment infrastructure.

The design system is organised in four replaceable layers:

| Layer | Owns | Must not own |
|---|---|---|
| [`DESIGN_LANGUAGE.md`](DESIGN_LANGUAGE.md) | Philosophy, hierarchy, voice and durable design rules | Runtime implementation details |
| [`foundations/`](foundations) | Colour, type, spacing, shape and motion tokens | Component markup or product data |
| [`brand/`](brand) | Approved logo assets, usage rules and asset provenance | Navigation, catalog identity or producer facts |
| [`adapters/`](adapters) | Thin presentation mappings for a specific surface | Canonical tokens or business logic |
| [`references/`](references) | Decision boards, external inspiration and superseded explorations | Runtime assets |

## Integration boundary

The application consumes design through two deliberately small seams:

1. `app/_components/site-root-shell.tsx` loads the foundation and web adapter
   styles.
2. `components/brand/chisan-brand.tsx` exposes framework-specific image
   components backed by the canonical files in `design/brand/assets/`.

No file under `design/` may read from `data/csv/**`, PostgreSQL, Clerk, Vercel
configuration or environment variables. Conversely, catalog files never carry
visual decisions. A future rebrand should be possible by changing this
directory and the brand adapter without changing producer identity or routes.

## Change policy

- Change philosophy before tokens, tokens before adapters, and adapters before
  page-specific exceptions.
- Brand assets are immutable within a released version. Add a new version,
  update the adapter, then remove the old version in a later cleanup.
- Keep reference boards out of runtime imports.
- Keep semantic product colours, such as errors and verification states, owned
  by their product contract rather than by the brand palette.
- A design change must be checked on the shared shell, a catalog page, the map,
  mobile layout, focus states and at least one long or non-Latin locale.

The current release is **v0.3 — The Passage**.
