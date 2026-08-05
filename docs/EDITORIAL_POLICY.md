# Editorial Policy

## Purpose

This document defines the stable decision model behind catalog verification.
`docs/VERIFICATION_TECHNIQUES.md` explains how to investigate efficiently;
this file defines the outcome that equivalent evidence should produce.

The model is intentionally small. It protects core decisions from tool,
agent, area and workflow changes without pretending that all research can
be reduced to deterministic code.

## Catalog scope

A row is a **productive unit that makes or elaborates food or drink in the
area and sells it under its own identity**. The catalog favors local,
artisan and terroir-scale producers over industrial operations.

Included:

- Farms, cellars, mills, dairies, obradores and similar productive units with
  their own name, municipality and offer — including units owned by a
  quality-oriented group when the unit keeps its own identity (a named estate
  winery inside a wine group is still a row).
- First-grade cooperatives selling to consumers under their own brand, and
  second-grade cooperatives that are the actual market identity of their
  members' production.

Excluded:

- Resellers, shops, restaurants, distributors and directories without own
  production → `purge:not-producer`.
- Industrial or mass-market operations without a local producer identity
  (large food groups, national commodity brands, white-label plants) →
  `purge:out-of-scope`. **Scale alone does not exclude.** A high-volume
  producer stays when it elaborates in its own area under its own brand and
  identity; it leaves when production is delocalized from the area it claims,
  or when the brand has no productive unit of its own. Decide this explicitly
  and record it in the row's evidence — the reasoning is worth more than the
  verdict, because the next pass will meet the same case.
- A brand label without its own productive unit: when the domain redirects to
  the group site and no own facility or municipality exists, it is a label of
  the group, not an entity. Merge into the parent's row when present;
  otherwise do not add it.
- A first-grade cooperative that only processes for its members while brand
  and sales belong to the second-grade cooperative (maquila/B2B): keep the
  second-grade entity, exclude the maquila unit → `purge:out-of-scope`.
- Rows imported from livestock-holding or facility registries (the country guide names them): a farming holding is not a
  sellable producer by default; triage and prune.

## Decision order

Resolve hard exclusions before assigning a verification level:

1. Same productive unit as an existing row → `merge`.
2. Entity reliably proven nonexistent → `purge:nonexistent`.
3. Reseller, restaurant, directory or other non-producer → `purge:not-producer`.
4. Real entity outside the catalog's defined scope → `purge:out-of-scope`.
5. Permanent closure reliably established → `purge:closed`.
6. Productive unit belongs to another area → `purge:other-area`.
7. Otherwise keep the row and assign `verificacion`.

Do not turn uncertainty into an exclusion. Technical failure, registry absence
or weak search results leave the row unresolved; they do not prove closure or
nonexistence.

## Core verification claims

Verification depends on three independent claims:

1. **Identity:** this is the named entity.
2. **Producer activity:** it produces or elaborates within catalog scope.
3. **Municipality:** the productive unit belongs to the stated municipality.

| Evidence state | Result |
|---|---|
| All three claims confirmed by current primary or clearly reliable evidence; entity active and in scope | `verificado` |
| All three claims have evidence, but at least one relies on a secondary source or retains material doubt | `parcial` |
| At least one core claim lacks sufficient evidence | `pendiente` |

`parcial` is a valid stable result. Never promote it only to improve a metric
or empty a queue.

`verificado` additionally requires at least one **verifying source read live at
review time** — official site, store, social profile, Google Maps profile or
the producer's own marketplace storefront (`docs/EVIDENCE_CONTRACT.md` § Source
types). Registries, regulatory councils, directories and press are supporting
sources: any number of them without a live verifying source caps the row at
`parcial`. A dead own domain (TLS/DNS failure, parked or suspended site, a page
that will not render) therefore caps the row at `parcial` even when registries
and directories agree.

## Online sales is independent

Identity verification does not imply online sales.

| Evidence | `Venta online` |
|---|---|
| Current, concrete and usable remote ordering channel | `sí` |
| Current channels reviewed and no remote ordering mechanism found | `no` |
| Not checked, ambiguous or temporarily unavailable | `no comprobado` |

`Canal de venta` records the demonstrated mechanism. Checklist for `sí` — the
channel must be **seen working at review time** and operated by or on behalf
of the producer:

- Its own shop or agrobotiga with a working checkout, or explicit
  `whatsapp`/`email`/`telefono` ordering published by the entity.
- The official online shop of its group, DO or cooperative collective counts
  as the producer's channel.
- A marketplace listing counts only when it is the producer's own or
  official-collective storefront (`Canal de venta = marketplace`). A product
  merely **resold by independent third-party retailers** (generic wine shops,
  marketplaces not acting for the producer) does not establish the producer's
  online sale → `no comprobado` unless an own or collective channel is
  confirmed.

Not sufficient for `sí`: a web page, product catalog, price list, legal text,
physical-shop information or historical publication. A shop under maintenance,
a cart without a working checkout, an age-gate or block that hides the shop,
or any technical failure is uncertainty → `no comprobado`, not `no`.

## Stable edge-case rules

- **Related entities:** shared ownership or address does not imply duplicate;
  merge only the same productive unit.
- **Third-party resale:** see Online sales; independent retailers do not
  establish the producer's own sale.
- **Brand vs. legal entity:** preserve a correct public `slug`; use identifiers
  and productive-unit identity to decide merges. Correct a slug that materially
  encodes the wrong identity or municipality.
- **Geographic uncertainty:** use an honest centroid rather than invented
  precision. Correct reference overrides for territorial homonyms.
- **Broken source:** timeout, TLS, DNS or blocked fetch is uncertainty, not a
  negative business fact.
- **Registry evidence:** useful for existence and localization, but generally
  insufficient for current activity or online sales.
- **Dynamic claims:** activity, closure and sale require evidence current at
  the time of review.
- **Empty vs. false:** an empty field or unresolved status is preferable to a
  plausible invention.

## Evaluation suite

The executable policy baseline lives in:

```text
data/evals/editorial-policy-cases.json
scripts/editorial-policy.mjs
scripts/test-editorial-policy.mjs
```

The suite uses synthetic archetypes, never real producers. It currently covers:

- verification;
- producer scope;
- online sales;
- deduplication;
- freshness and technical failure;
- area geography.

Run:

```bash
npx pnpm test:editorial-policy
```

The executable evaluator covers only the stable core above. It is a regression
guard, not an automatic research engine or substitute for evidence.

## Policy change discipline

A material criteria change is complete only when the same commit updates:

1. this document;
2. `docs/VERIFICATION_TECHNIQUES.md` when workflow changes;
3. the evaluator when the stable decision logic changes;
4. existing cases whose expected outcome changes;
5. at least one new case for the newly introduced edge condition.

Run `npx pnpm verify:ai` after changing policy, evaluation or validation code.
