# Spain — remaining source research

This workspace retains unfinished research from the author-supplied
`fuentes_productores_locales_espana.xlsx` inventory dated 2026-09-11. Source
numbers preserve that inventory's references. Observations below were made on
2026-09-11 and 2026-09-12; recheck dynamic claims before using them.

These are source questions, not admission decisions. Apply
[Editorial](../../EDITORIAL.md), the [candidate format](../README.md) and
[Spain's source ceilings](../../../data/csv/es/AGENTS.md). Resolved source
qualifications and completed batch accounting have been removed; Git retains
their history. Open candidates remain in their area notes. Prune each remaining
item after its handoff or resolution.

## Sources not yet worked

Reachability, an empty result or a failed request does not establish what a
source contains. Exhibitor directories are edition-specific and may mix brands,
importers and distributors with producers; their stand location does not place
a productive unit.

| # | Source | Observation at the recorded check | Remaining context |
|---|---|---|---|
| 2 | MAPA REGOE | discovery | National organic operator search aggregating the CCAA authorities. The only download is the list of operators exempted from certification. Canarias ROPE/ICCA points to this same register. Organic certification is not evidence of elaboration. |
| 3 | MAPA localizador DOP/IGP | discovery | Map viewer plus downloadable food-map publications. Establishment-level names were not confirmed as listable or downloadable. |
| 4 | MAPA DOP/IGP | index | Denomination searcher and downloadable lists by CCAA and province. States its own content is `carácter informativo` and refers to the competent authority. Reaches councils, not operators. |
| 6 | ICEX Foods & Wines | discovery | Exporter directory; export orientation biases it toward larger commercial firms. Per-entry fields unconfirmed. |
| 7 | Cámara censo público | cross-check | Name, address, postcode, municipality and economic activity, one row per activity, capped at 50 results per search. Carries municipality but no productive-activity proof and no bulk access. |
| 9 | Federaciones | open question | Reachability only across the territorial federations. Inspect their directories before drawing conclusions about producer coverage. |
| 13 | Andalucía SIVDA | discovery, degraded | CSV/XLS/ODS, but the published file is `od_ventadirecta_mar23` and all 1,137 rows carry a 2022 `FECHA_ACTUALIZACION` — roughly four years stale. 1,039 of 1,137 rows (91%) are natural persons split across name and two surname columns; there is no trade-name field at all. 1,030 personal emails and 1,136 phone numbers. Non-food entities are present (a carpentry firm, plant nurseries, a rural-tourism company). Not admission-capable. |
| 14 | Andalucía registro sanitario | cross-check | The procedure page links a downloadable list of registered Andalusian food establishments, updated 2025-12-31. It is the autonomous complement to the RGSEAA and carries the same establishment-record ceiling: an entity, its registered activity class and address, never a public identity or a current own offer. |
| 15 | Aragón venta local | discovery, small | 2026 XLSX, 98 entries over 12 product sections: number, `Persona Productora`, email, phone, `Municipio`. Municipality is present for every row, but 90 of 98 are plain personal names with no trade name, and the file is mostly personal contact data. 60 distinct municipalities. Honey dominates (56 of 98). |
| 17 | Navarra Local/Tokikoa | discovery, noisy | It publishes producers **and** the establishments that sell them — shops, restaurants, agritourism — plus fairs and markets, across twelve product categories. Retail and hospitality have to be filtered out entry by entry, unlike Reyno Gourmet which separates them by taxonomy. |
| 18 | Navarra canales cortos | qualified, available | It does publish its register, as a PDF listing producers **and intermediaries** together; an intermediary is not a producer, so the two must be separated on reading. Not yet worked. |
| 23 | Galicia Calidade | open question | Reachability only. Brand-oriented, so a listed marca may have no productive unit of its own. |
| 25 | CyL Tierra de Sabor | suspended | Producer pages are listed in `producers-sitemap.xml`; the WordPress REST API is closed. Detail pages are needed for productive placement. Preserve the suspended scope below before restarting. |
| 26 | CyL canales alternativos | unusable as given | The inventory URL is the generic procedure portal, which answers but exposes no register listing. Without a direct address for the register itself there is nothing to read. |
| 27 | Asturias Alimentos del Paraíso | discovery | 362 `Elaboradores` behind operator, product, certification and locality filters. |
| 29 | Extremadura suministro directo | qualified, degraded | The procedure page does publish a `Relación de entidades`, but it is an 18-page **scanned PDF with no text layer** — 6 MB of page images, zero extractable characters — and it is dated 2024-05-29. Reading it needs OCR, and its content would still be roughly two years old. |
| 35 | La Rioja marcas de calidad | inaccessible | HTTP 403 on 2026-09-11 and again on 2026-09-12. Inaccessibility is uncertainty, not a negative finding. |
| 36 | FEPEX | open question | Reachability only; reaches member associations rather than producers. |
| 37 | FEV | discovery, weak placement | 950 bodegas and 17 associations, presented as logos linking out to each winery's own site. No municipality, no location field and no contact, so it cannot place a productive unit by itself. |
| 38 | Origen España | index | Roughly 100+ members, and the members are consejos reguladores, not producers. Second-degree. |
| 39 | ANICE | open question | The inventory URL points at `quiénes somos`, not at a member list. |
| 40 | FeNIL | open question | Reachability only. |
| 41 | APROMAR | discovery, small and mixed | Around 40 producer members listed with species and website, alongside feed, health and equipment suppliers (Biomar, Skretting, Grundfos) and regional associations, which are not food producers. Location is not given consistently. |
| 42 | Salón Gourmets 2026 | discovery, weak placement | Publicly browsable without login, roughly nine pages of exhibitors. Each entry gives the company name, pavilion, stand and **country** — no region, province or municipality, and no website. It cannot place a productive unit. |
| 43 | Alimentaria Barcelona 2026 | discovery, weak placement | A browsable exhibitor directory searchable by product category, for an edition expecting some 3,300 companies from 70+ countries. Stand location is published; a Spanish municipality is not. |
| 44 | Fruit Attraction | empty at check | The catalogue returned no results at this date. |
| 45 | Barcelona Wine Week | qualified, available | The exhibitor list lives in a separate e-catalogue on `ecatalogue.firabarcelona.com`, browsable without registration and filterable to exhibitors only. Per-exhibitor fields not yet inspected. |
| 46 | BioCultura | discovery, noisy | Around 3,300 entries with a province filter, but the directory explicitly spans shops, NGOs, institutions, bioconstruction, textiles and tourism. Heavy filtering required. |
| 47 | Seafood Expo Global 2026 | inaccessible | HTTP 404 at this date. |

## Unfinished parts of sources already worked

The quantities below identify the deferred scope at the 2026-09-12 handoff,
not the current catalog or queue size. Source interpretation lives in the
country guide; de-duplicate against current CSVs and notes before continuing.

| Source | Remaining scope and next question |
|---|---|
| 8 Cooperativas Agro-alimentarias | 1,101 unmatched elaborating cooperatives were deferred for lack of own-offer evidence. Establish what reaches the market under each cooperative's public identity. |
| 16 Castilla-La Mancha RVDCLM | 273 bare personal-name holders were not worked. Resolve a public producer identity per holder before considering admission. |
| 19 CPAEN/NNPEK | 556 raw-production records were deferred. Select a bounded relevant slice and check its own food offer. |
| 22 CRAEGA | Roughly 1,000 raw-production records were deferred after the `Industrias` pass. Select a bounded relevant slice and check its own food offer. |
| 24 Madrid M Producto | One possible catalog match remained unresolved at handoff; reconcile it with the [Madrid note](madrid.md) before treating it as a new producer. |
| 28 Asturias Alimentos del Paraíso | 106 bare personal-name operators were deferred. Resolve the public identity and productive municipality. The separate web directory (#27) remains unworked. |
| 30 Illes Balears direct-sale | One of the 87 accredited entries was not read. Reconcile it against the [Balearic batch](baleares.md) before continuing. |

## Published-row follow-up

Three placement conflicts surfaced during the same pass. They need a level 3
review of the productive municipality, not candidate admission or an automatic
location correction. These dated register clues do not establish the right
location:

| Producer | Catalog municipality at handoff | Register clue |
|---|---|---|
| Olivapalacios | Almagro | Bolaños de Calatrava |
| Pereimos 2007 | A Pobra de Trives | Touro |
| Regal López | Taboada | Chantada |

## Suspended scope — Tierra de Sabor

The 2026-09-11 sitemap pass partitioned 664 URLs into 239 published-name
matches, 126 probable matches needing review and 299 unmatched pages. Those
unmatched pages need detail-page evidence of a placement clue before they can
be queued; no candidates were written from this pass.

The host stopped answering during the crawl and was still refusing connections
on 2026-09-12 while other Junta de Castilla y León sites answered. The cause
was not established. Recheck availability before resuming and retain this as an
access limitation, not evidence about any producer.

Fetch slowly and serially with several seconds between requests. Province
filters on `/productores-y-productos` may expose municipality information on
listing cards and reduce the number of detail requests. Reconcile the dated
sitemap partition against the current catalog and notes before using it.
