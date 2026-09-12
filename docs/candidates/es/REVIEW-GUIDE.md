# Working the 2026-09 Spanish source batches

This is a reviewer's aid for the eight discovery batches opened from the
`fuentes_productores_locales_espana.xlsx` inventory, listed in
`source-inventory.md`. It adds nothing to policy: `docs/EDITORIAL.md` owns the
admission test and the decision matrix, `docs/CSV_CONTRACT.md` owns how a value
is written, `docs/EVIDENCE_CONTRACT.md` owns the record, and
`data/csv/es/AGENTS.md` owns each source's ceiling. Delete this file when the
batches are resolved.

## What a candidate row already gives you

Every row carries a name, a municipality or geographic clue, a probable
category, why it may qualify, the discovery URL and **one actionable blocker**.
The blocker is the thing that is missing, so read it first: it tells you whether
the next step is finding a public identity, a municipality, or evidence of a
current offer.

A probable category is a guess from the source's own wording, never an
assignment. Confirm the material output before writing `categoria`.

## What each source can carry, and what it cannot

| Batch | Can support | Cannot support |
|---|---|---|
| Castilla-La Mancha RVDCLM | Identity, own productive output, offer, municipality, declared products | Current activity; a trade name for a personal-name holder; any online channel |
| Asturias quality-figure roster | Identity including a declared trade name, the figure's product | The municipality except on the Cabrales sheet; current activity; a verified shop |
| Madrid M Producto | Identity, municipality, certified products, website | Current activity |
| CPAEN Navarra | Identity, municipality, declared transformed products, website | Elaboration itself; current activity; an operator's type |
| CRAEGA Galicia | Identity, locality, the *Industrias* activity class | Any product or category; current activity |
| Cooperativas Agro-alimentarias | Identity, municipality, registered sectors | Whether a food reaches the market under the cooperative's own name |
| Reyno Gourmet | Trade name, product types, quality figures, entity type | The municipality; current activity |
| Illes Balears direct-sale | Identity, own productive output, address, sometimes products | The official municipality; current activity |

Two consequences worth stating plainly. A register that accredits an operator to
sell its own output — Castilla-La Mancha, Illes Balears, and the Catalan one
already in the country guide — can carry a whole admission at `pendiente`. A
register that only certifies or classifies — CPAEN, CRAEGA, the cooperative
directory — never admits a row by itself.

## Order of work on a row

1. **Resolve the public identity.** Prefer the declared trade name over a
   personal name or a legal name. Where a row shows a truncated name, the
   Castilla-La Mancha register cuts company names at nineteen characters.
2. **Place the productive unit.** A clue is not a placement. Addresses in the
   Balearic batch often name a locality, the Asturian roster names a figure's
   comarca, and the Reyno Gourmet clue is derived from a map point and can name
   a neighbouring municipality.
3. **Confirm the material output**, then assign `categoria` and any
   `categorias adicionales`.
4. **Check it is not already represented.** Search the area CSV by name, by
   municipality and by web domain — domain matching found duplicates in every
   batch that name matching missed.
5. **Decide** through the decision matrix in `docs/EDITORIAL.md`.

## Moving an accepted candidate into the CSV

The area file is `data/csv/es/<region>/<area>.csv`; the row's own note header
names it. Fill only what a source actually supports:

- `slug`, `nombre`, `municipio`, `categoria` are the minimum.
- `direccion`, `telefono`, `correo`, `web` only where public and first-party.
  Personal phone numbers and personal e-mail addresses from the direct-sale and
  organic registers stay out.
- `verificacion` is `pendiente` whenever a core claim rests on the register
  alone, which is the normal outcome for these batches.
- `Venta online` needs a channel seen usable at review time. An authorised
  online modality on the Castilla-La Mancha register and a `tienda on-line` flag
  on the Asturian roster are claims, not channels: neither sets it.
- `lat`/`lon` stay empty unless supported per `docs/PRODUCER_GEOLOCATION.md`.
  The Reyno Gourmet points were used only as a clue and are not a source for
  coordinates.

Then create the `keep` record in `data/evidence/es/<region>/<area>.jsonl` with
only the sources actually relied on, and delete the candidate row.

## Verifying a candidate

Useful searches, in rough order of yield:

- `"<nombre>" <municipio>` to find a first-party site.
- `site:<dominio>` once a site is found, to confirm the offer is current.
- The area CSV itself, by name fragment, municipality and domain, before
  anything else.

Registry pages already linked in the `discovery` column remain the best evidence
of what that register publishes; re-open the entry rather than citing a search.

## Known traps in these batches

- **Duplicate leads.** 44 rows were removed on 2026-09-12 because the same unit
  was already open from an earlier pass in the same note. Where that happened
  the batch intro names them, and the earlier entry now has a second source.
- **Group and parent-company rows.** Second-degree cooperatives and named groups
  commercialise members' output and are not productive units.
- **Slaughterhouses and packers.** Carcasses for the trade and washed, cut,
  bagged or frozen produce are not an own offer; look for a further transforming
  step or own growing.
- **Registers that reach beyond their territory.** CPAEN, CRAEGA and the
  cooperative directory all certify operators seated in other communities; check
  the published locality before placing a row.

## Commands

```bash
npx pnpm check:csv:changed && npx pnpm check:evidence:changed
```

```bash
npx pnpm verify:data
```
