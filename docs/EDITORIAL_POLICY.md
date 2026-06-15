# Editorial Policy

## Purpose

This document defines the stable decision model behind catalog verification.
`docs/VERIFICATION_TECHNIQUES.md` explains how to investigate efficiently;
this file defines the outcome that equivalent evidence should produce.

The model is intentionally small. It protects core decisions from tool,
agent, province and workflow changes without pretending that all research can
be reduced to deterministic code.

## Decision order

Resolve hard exclusions before assigning a verification level:

1. Same productive unit as an existing row → `merge`.
2. Entity reliably proven nonexistent → `purge:nonexistent`.
3. Reseller, restaurant, directory or other non-producer → `purge:not-producer`.
4. Real entity outside the catalog's defined scope → `purge:out-of-scope`.
5. Permanent closure reliably established → `purge:closed`.
6. Productive unit belongs to another province → `purge:other-province`.
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

## Online sales is independent

Identity verification does not imply online sales.

| Evidence | `Venta online` |
|---|---|
| Current, concrete and usable remote ordering channel | `sí` |
| Current channels reviewed and no remote ordering mechanism found | `no` |
| Not checked, ambiguous or temporarily unavailable | `no comprobado` |

`Canal de venta` records the demonstrated mechanism. A web page, product
catalog, price list, legal text or abandoned cart is not sufficient by itself.

## Stable edge-case rules

- **Related entities:** shared ownership or address does not imply duplicate;
  merge only the same productive unit.
- **Brand vs. legal entity:** preserve the public stable `slug`; use identifiers
  and productive-unit identity to decide merges.
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
- provincial geography.

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
