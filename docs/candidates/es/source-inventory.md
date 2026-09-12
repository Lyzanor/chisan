# Spain — source qualification pass

- Scope: the 50-source inventory in `fuentes_productores_locales_espana.xlsx`
  (author-supplied, 2026-09-11), assessed as discovery and evidence sources for
  the Spanish catalog. This note qualifies **sources**, not candidates.
- Search dates: qualification 2026-09-11; discovery batches 2026-09-11, closing
  reconciliation 2026-09-12. All 50 URLs were requested; findings below record
  what each source actually publishes at those dates.
- Target: `data/csv/es/**` (13,251 published rows across 17 areas at this date).
- Six sources have since been worked into discovery batches, producing 558
  candidates across area notes and two tombstones; one batch is suspended. The
  rest are qualified only. Durable conclusions that change how we work are folded
  into `data/csv/es/AGENTS.md` § Source ceilings.
- Editorial and source rules: `docs/EDITORIAL.md`, `docs/EVIDENCE_CONTRACT.md`
  and `data/csv/es/AGENTS.md`. `REVIEW-GUIDE.md` beside this file is the
  reviewer's aid for working the batches these sources opened.

This file is a country-level workspace rather than an area note, so it does not
follow the one-file-per-area rule in `docs/candidates/README.md`. Prune each row
as its source is either worked into an area batch or closed.

## Depth of check

Claims below are only as strong as the check behind them.

| Depth | Sources |
|---|---|
| Worked into a discovery batch: full data read and de-duplicated against the catalog | 8, 16, 19, 20, 22, 24, 28, 30 |
| Batch attempted and suspended | 25 |
| Dataset downloaded and parsed, not yet worked | 1, 13, 15, 33 |
| Landing or result page read | 2, 3, 4, 5, 6, 7, 21, 23, 27, 31, 32, 34, 37, 38, 41, 44, 46, 50 |
| Content inspected on 2026-09-12, previously unopened | 14, 17, 18, 26, 29, 42, 43, 45 |
| HTTP reachability only | 9, 10, 11, 12, 35, 36, 39, 40, 47, 48, 49 |

A reachability-only row is an open question, not a verdict about content.

## Verdict vocabulary

- **admission-capable** — one record may carry an admission at `pendiente`,
  subject to the ceiling recorded for it.
- **discovery** — may surface candidates; every admission claim still needs
  corroboration.
- **cross-check** — useful to corroborate or enrich an existing row, not to find
  new ones.
- **index** — reaches producers only through a second source.
- **unusable** — publishes no producer identity, or cannot be browsed.
- **blocked** — licence or access forbids use.

## Batch A — national registers and directories (1–9)

| # | Source | Verdict | What it actually publishes |
|---|---|---|---|
| 1 | AESAN RGSEAA | cross-check | Full listing downloads as XLSX (142,426 establishments, updated 2026-09-01): `N_RGSEAA`, `Razon_Social`, `Domicilio_industrial`, `Provincia`, `CCAA`, `Clave`, `Clave_Descripcion`. No municipality column, no trade name, no contact, no products. 61,153 rows (43%) are class 40 storage/distribution/transport/packing/import; 4,958 are food-contact materials; 1,365 technological ingredients. Only 20.9% of catalog names match a `Razon_Social`, because we publish trade names and the register publishes company names. Confirms and strengthens the existing ceiling. |
| 2 | MAPA REGOE | discovery | National organic operator search aggregating the CCAA authorities. The only download is the list of operators exempted from certification. Organic certification is not evidence of elaboration. |
| 3 | MAPA localizador DOP/IGP | discovery | Map viewer plus downloadable food-map publications. Establishment-level names were not confirmed as listable or downloadable. |
| 4 | MAPA DOP/IGP | index | Denomination searcher and downloadable lists by CCAA and province. States its own content is `carácter informativo` and refers to the competent authority. Reaches councils, not operators. |
| 5 | SIEX / REGEPA | unusable | Not publicly browsable. Only a historical REGEPA-code lookup keyed by DNI/NIF/NIE. No listing and no download. |
| 6 | ICEX Foods & Wines | discovery | Exporter directory; export orientation biases it toward larger commercial firms. Per-entry fields unconfirmed. |
| 7 | Cámara censo público | cross-check | Name, address, postcode, municipality and economic activity, one row per activity, capped at 50 results per search. Carries municipality but no productive-activity proof and no bulk access. |
| 8 | Cooperativas Agro-alimentarias | discovery | 2,171 member cooperatives, readable in nine requests from the listing endpoint behind the search. Each record carries name, address, postcode, municipality, province, community, phone and registered sectors; only 183 publish a website. 234 register no food sector at all (supplies and fuel, member shops, credit sections, feed, fodder, tobacco, cotton, flowers, forestry) and 1,303 register an elaborating food sector. It mixes first- and second-degree cooperatives. Its decisive weakness is that it cannot show whether a food reaches the market under the cooperative's own name, which is the criterion these cases turn on. |
| 9 | Federaciones | index | Seventeen territorial federations; reaches producers only through each federation. |

## Batch B — Catalonia (10–12)

All three are already governed by ceilings in `data/csv/es/AGENTS.md`; each URL
was reachable at this date. No change proposed.

| # | Source | Verdict | Note |
|---|---|---|---|
| 10 | Venda de Proximitat | admission-capable | Existing ceiling stands, including the livestock-accreditation limit and the preference for the live dataset over the PDF. |
| 11 | CCPAE guia d'operadors | discovery | Existing ceiling stands. |
| 12 | CCPAE downloads | discovery | Existing ceiling stands; the guide already records that no open dataset is published and the annual PDF is the parseable alternative. |

## Batch C — direct-sale registers (13–18)

| # | Source | Verdict | What it actually publishes |
|---|---|---|---|
| 13 | Andalucía SIVDA | discovery, degraded | CSV/XLS/ODS, but the published file is `od_ventadirecta_mar23` and all 1,137 rows carry a 2022 `FECHA_ACTUALIZACION` — roughly four years stale. 1,039 of 1,137 rows (91%) are natural persons split across name and two surname columns; there is no trade-name field at all. 1,030 personal emails and 1,136 phone numbers. Non-food entities are present (a carpentry firm, plant nurseries, a rural-tourism company). Not admission-capable. |
| 14 | Andalucía registro sanitario | cross-check | The procedure page links a downloadable list of registered Andalusian food establishments, updated 2025-12-31. It is the autonomous complement to the RGSEAA and carries the same establishment-record ceiling: an entity, its registered activity class and address, never a public identity or a current own offer. |
| 15 | Aragón venta local | discovery, small | 2026 XLSX, 98 entries over 12 product sections: number, `Persona Productora`, email, phone, `Municipio`. Municipality is present for every row, but 90 of 98 are plain personal names with no trade name, and the file is mostly personal contact data. 60 distinct municipalities. Honey dominates (56 of 98). |
| 16 | Castilla-La Mancha RVDCLM | admission-capable, candidate | 339 live records: registration number, `Nombre y apellidos / Razón social`, province, municipality, phones, email, products, sale modalities. A `Descargar` button exports the whole result set as CSV (196 KB, latin-1), so it does have bulk access. Structurally parallel to the Catalan register — an accreditation to sell own output, carrying identity, own productive output and offer. Three limits found: records are **per product line**, so one holder can hold several (RVDCLM0002 and RVDCLM0003 are the same person, and 339 records are 333 holders); `Modalidades de venta` lists `Venta on line` as an *authorised* modality, which is not a channel seen usable and must never set `Venta online=sí`; and company names are **truncated at 19 characters** in both the table and the export, while personal names run to 59. 273 of 333 holders are bare personal names. |
| 17 | Navarra Local/Tokikoa | discovery, noisy | It publishes producers **and** the establishments that sell them — shops, restaurants, agritourism — plus fairs and markets, across twelve product categories. Retail and hospitality have to be filtered out entry by entry, unlike Reyno Gourmet which separates them by taxonomy. |
| 18 | Navarra canales cortos | qualified, available | It does publish its register, as a PDF listing producers **and intermediaries** together; an intermediary is not a producer, so the two must be separated on reading. Not yet worked. |

## Batch D — organic certifiers and regional seals (19–28)

| # | Source | Verdict | What it actually publishes |
|---|---|---|---|
| 19 | CPAEN/NNPEK | discovery | 756 operators, exported whole from `?excel=1` with name, occasional trade name, address, postcode, población, website and declared products by class; the operator-type columns export empty. 581 records declare only untransformed vegetal produce and 200 declare transformed products or wine. Importers, distributors, cold logistics, retail chains, fodder and non-food operators are certified beside producers, and some operators are seated outside Navarra. Publishes a named contact with personal phone and email. |
| 20 | Reyno Gourmet | discovery | 237 member entities, readable in three requests from an open WordPress REST API. Its `tipo_de_entidad` taxonomy separates 116 *Empresas* from 59 *Comercios* and 29 *Hostelería*, so shops and hospitality are a distinct section rather than mixed in — the qualification note of 2026-09-11 read the site's navigation as a single mixed directory and was wrong about that. Records carry trade name, product types, quality figures and a map point but no municipality; the entity page carries the address. |
| 21 | Galicia venta directa / SEVEDI | unusable | Not a public listing of holdings. The page carries the regulation plus a `NIFREAGA` lookup that requires the holding's own code. Cannot be browsed for discovery. |
| 22 | CRAEGA | discovery | Roughly 1,295 certified operators. The `Descargar listado completo` control builds its CSV client-side from a WordPress AJAX endpoint that accepts a filter and returns the whole matching set, so no crawling is needed, but it refuses an unfiltered query. The export carries identity, address and contact only — **no product or activity column**. By activity: Vegetal 784, Animal 518, Industrias 242, Comercializador 136, Acuicultura 150, Importación 20, Algas 13, and Apicultura returns nothing at all. Port terminals, cold stores, retail chains and input suppliers are certified beside producers. |
| 23 | Galicia Calidade | open question | Reachability only. Brand-oriented, so a listed marca may have no productive unit of its own. |
| 24 | Madrid M Producto | discovery, clean | 141 certified producers across 14 product categories. The listing pages give name and product category; each producer page adds municipality, phone, email, website and the certified products, so an entry supports the registered products and place but not current activity. Enumerable from 24 listing pages, and the host tolerated a 1.5–2 s serial pace without complaint. The roster mixes in an IGP body and a few distributors, packers and hospitality chains. |
| 25 | CyL Tierra de Sabor | discovery / cross-check | 664 producer pages, enumerable from `producers-sitemap.xml` (allowed by robots.txt; the WordPress REST API is closed). Each page publishes the name, full street address with postcode and municipality, province, phone, email, website, a description and the individual products with their quality figures — rich enough to carry several admission claims at once. Ten entries are associations or regulatory councils rather than producers. **The host stopped answering during a three-worker crawl on 2026-09-11 and was still refusing connections the next check**, from three independent network paths while other Junta de Castilla y León hosts served normally — so the outage is the host's, not a block on our address, and whether the crawl contributed is unestablished. Fetch it slowly and serially regardless. |
| 26 | CyL canales alternativos | unusable as given | The inventory URL is the generic procedure portal, which answers but exposes no register listing. Without a direct address for the register itself there is nothing to read. |
| 27 | Asturias Alimentos del Paraíso | discovery | 362 `Elaboradores` behind operator, product, certification and locality filters. |
| 28 | Asturias Open Data | mixed | Only `dataset-alimentos-paraiso.xlsx` names operators: 21 sheets, one per DOP/IGP/APN figure, carrying the declared trade name, phones, email and a `TIENDA ONLINE` flag. `CONCEJO` appears **only on the DOP Cabrales sheet** — 31 of 344 rows — so most entries carry no municipality. The other four datasets (`produccion-ecologica`, `sidra-deriv-manzana`, `denominaciones-calidad`, `comercio-prod-hortofrut`) are statistical aggregates by year with no operator names. |

## Batch E — remaining autonomous sources (29–35)

| # | Source | Verdict | What it actually publishes |
|---|---|---|---|
| 29 | Extremadura suministro directo | qualified, degraded | The procedure page does publish a `Relación de entidades`, but it is an 18-page **scanned PDF with no text layer** — 6 MB of page images, zero extractable characters — and it is dated 2024-05-29. Reading it needs OCR, and its content would still be roughly two years old. |
| 30 | Illes Balears venda directa | admission-capable | **Worked 2026-09-12.** The seal's *Operadores de venta directa* section is a browsable register of 87 accredited operators, ten to a page, each with an entity page carrying the name, a street or rural address, opening hours and sometimes products. Like the Catalan register it accredits a named operator to sell its own output. It publishes no municipality field, and its addresses often name a locality rather than the municipality. |
| 31 | CAECV | **blocked** | States `En ningún supuesto se autoriza su explotación económica o uso comercial.` and publishes NIF/CIF, email, phone, mobile, postcode and municipality. Do not use as a data source. |
| 32 | Canarias ROPE / ICCA | duplicate | Refers operator consultation to the national REGOE listing, so it is not an independent source from #2. |
| 33 | País Vasco directorio | unusable | The published CSV/XLSX is `número de establecimientos y personal ocupado` — establishment counts and employment by subsector and province (1,862 establishments in 2024). It contains no company names. |
| 34 | La Rioja registro industrias | licence-restricted | XLS/XML/CSV/JSON, updated daily (2026-09-11 at this check), but licensed **CC BY-NC 2.0**, non-commercial only. Our La Rioja area already holds 425 rows. |
| 35 | La Rioja marcas de calidad | inaccessible | HTTP 403 on 2026-09-11 and again on 2026-09-12. Inaccessibility is uncertainty, not a negative finding. |

## Batch F — sector associations (36–41)

| # | Source | Verdict | What it actually publishes |
|---|---|---|---|
| 36 | FEPEX | open question | Reachability only; reaches member associations rather than producers. |
| 37 | FEV | discovery, weak placement | 950 bodegas and 17 associations, presented as logos linking out to each winery's own site. No municipality, no location field and no contact, so it cannot place a productive unit by itself. |
| 38 | Origen España | index | Roughly 100+ members, and the members are consejos reguladores, not producers. Second-degree. |
| 39 | ANICE | open question | The inventory URL points at `quiénes somos`, not at a member list. |
| 40 | FeNIL | open question | Reachability only. |
| 41 | APROMAR | discovery, small and mixed | Around 40 producer members listed with species and website, alongside feed, health and equipment suppliers (Biomar, Skretting, Grundfos) and regional associations, which are not food producers. Location is not given consistently. |

## Batch G — fairs and exhibitor catalogues (42–47)

Exhibitor catalogues list exhibiting companies — brands, distributors and
importers as well as producers — and are edition-scoped, so they go stale. None
carries a productive municipality.

| # | Source | Verdict | Note |
|---|---|---|---|
| 42 | Salón Gourmets 2026 | discovery, weak placement | Publicly browsable without login, roughly nine pages of exhibitors. Each entry gives the company name, pavilion, stand and **country** — no region, province or municipality, and no website. It cannot place a productive unit. |
| 43 | Alimentaria Barcelona 2026 | discovery, weak placement | A browsable exhibitor directory searchable by product category, for an edition expecting some 3,300 companies from 70+ countries. Stand location is published; a Spanish municipality is not. |
| 44 | Fruit Attraction | empty at check | The catalogue returned no results at this date. |
| 45 | Barcelona Wine Week | qualified, available | The exhibitor list lives in a separate e-catalogue on `ecatalogue.firabarcelona.com`, browsable without registration and filterable to exhibitors only. Per-exhibitor fields not yet inspected. |
| 46 | BioCultura | discovery, noisy | Around 3,300 entries with a province filter, but the directory explicitly spans shops, NGOs, institutions, bioconstruction, textiles and tourism. Heavy filtering required. |
| 47 | Seafood Expo Global 2026 | inaccessible | HTTP 404 at this date. |

## Batch H — commercial B2B databases (48–50)

These sell company data. They publish mercantile and contact attributes — CIF,
CNAE, administrators, phones — which do not establish qualifying productive
activity, the productive municipality or a current own offer. They are the
weakest fit for our evidence model and the heaviest on personal data.

| # | Source | Verdict | Note |
|---|---|---|---|
| 48 | Kompass | blocked | HTTP 403 bot protection at this date, over a paid licence. |
| 49 | eInforma / Informa D&B | out of editorial scope | Paid mercantile database; publishes administrators, which is personal data. |
| 50 | Camerdata | out of editorial scope | Paid commercial file vendor; TLS certificate verification failed at this check. |

## Cross-cutting findings

1. **The inventory is built for commercial prospecting, not for our evidence
   model.** Its `Utilidad` and `Uso para prospección` columns rank sources by
   lead quality — reachable contacts. We rank sources by whether they support a
   public producer identity, qualifying activity, a current own offer and a
   productive municipality. The two rankings disagree most where a source is
   contact-rich and evidence-poor.
2. **Six sources yield no producer identity at all**: 5 and 21 are not
   browsable, 33 and four of the five files behind 28 are statistics, 32 is a
   pointer to 2, and 47 is gone. Four of these are rated 3–5 in the inventory.
3. **Two sources are legally closed to us.** CAECV (31) forbids commercial
   exploitation outright, and La Rioja (34) is CC BY-NC. Both matter because
   Chisan operates a paid tier.
4. **Personal data is the dominant shape of the direct-sale registers.** 13, 15,
   16 and 19 are largely natural persons with personal phones and emails. They
   may support an admission where the register also publishes what reaches the
   market, but their contact columns must not be bulk-imported into the CSV.
5. **Staleness is uneven and not visible from the inventory.** RGSEAA and
   La Rioja are current to the day; Andalucía's open dataset is four years old.
6. **Coverage is already substantial in the areas these sources serve.** Madrid
   holds 309 rows against 141 certified producers; Castilla y León 1,532 against
   roughly 662; La Rioja 425. The regional seal directories are better used to
   corroborate and enrich than to find.

## Suggested order of work

1. ~~**Castilla-La Mancha RVDCLM (16)**~~ — worked 2026-09-11. 339 records →
   333 holders → 60 with a trade name; 15 already represented (two of them
   found only through a trade name derived from the holder's own domain), 44
   recorded as candidates across the five area notes. The 273 bare personal-name holders
   remain unworked and are the next slice of this source.
2. ~~**Asturias operator roster (28)**~~ — worked 2026-09-11. 344 rows → 321
   operators; 114 already represented, 95 trade-named candidates recorded in the
   Asturias note. The 106 bare personal-name operators are deferred alongside the
   Castilla-La Mancha ones.
3. **Tierra de Sabor (25)** — batch **suspended 2026-09-11**, see below.
4. ~~**CPAEN/NNPEK (19)**~~ — worked 2026-09-11. 200 elaborating operators of
   756 → 47 already represented, 109 recorded as candidates, 8 routed to other
   areas and 11 screened out. The 556 raw-produce records are deferred.
5. ~~**CRAEGA (22)**~~ — worked 2026-09-11. The 242 *Industrias* operators →
   42 already represented, 172 recorded as candidates across the four Galician
   notes, 15 routed and 13 screened out. The 1,000-odd raw-production records
   are deferred.
6. ~~**Cooperativas Agro-alimentarias (8)**~~ — worked 2026-09-11. 1,303
   elaborating cooperatives → 147 already represented; the 55 unmatched ones
   publishing a first-party website recorded as candidates across 23 area notes.
   1,101 unmatched elaborating cooperatives deferred for want of own-offer
   evidence.
7. ~~**Madrid M Producto (24)**~~ — worked 2026-09-11. 141 certified producers →
   54 already represented, 2 rejected with tombstones, 83 recorded as candidates
   and one possible match left unresolved.
4. Leave 31, 34, 48, 49 and 50 unused.

## Suspended batch — Tierra de Sabor, 2026-09-11

De-duplication was completed offline from the sitemap slugs alone, with no
further requests: of 664 producer pages, 239 match a published Castilla y León
row by name and 126 more are probable matches to review, leaving **299 pages
unmatched**. Those 299 are the candidate pool.

The batch stopped there because fetching the detail pages is what the
unmatched rows need — the slug carries a name but no municipality, and a
candidate cannot be recorded without a placement clue. The host stopped
answering mid-crawl and has not recovered, so no candidate was written; an
unreachable source is uncertainty and proves nothing either way.

Reachability rechecked 2026-09-12: still refusing connections on 443 from every
path tried, while `jcyl.es` answered normally. Recheck before planning the work.

To resume: the 299 URLs are the working list. Fetch serially with several
seconds between requests, or first try the province filters on
`/productores-y-productos`, which may expose the municipality per card and
replace most of the 299 requests with a handful of listing pages.

## Batches worked

Counts are the rows actually present in the area notes at the closing date.

| Source | Read | Already represented | Candidates | Tombstones | Deferred |
|---|---|---|---|---|---|
| 16 Castilla-La Mancha RVDCLM | 339 records → 333 holders | 15 | 44 | — | 273 personal-name holders |
| 28 Asturias Alimentos del Paraíso | 344 rows → 321 operators | 114 | 95 | — | 106 personal-name operators |
| 24 Madrid M Producto | 141 certified producers | 54 | 83 | 2 | — |
| 19 Navarra CPAEN/NNPEK | 200 elaborating of 756 | 47 | 109 | — | 556 raw-production records |
| 22 Galicia CRAEGA | 242 *Industrias* of ~1,295 | 42 | 172 | — | ~1,000 raw-production records |
| 8 Cooperativas Agro-alimentarias | 1,303 elaborating of 2,171 | 147 | 55 | — | 1,101 elaborating without own-offer evidence |
| 30 Illes Balears direct-sale register | 86 of 87 accredited operators | 25 | 60 | — | 1 entry not read |
| 20 Reyno Gourmet | 116 *Empresas* of 237 entities | 25 + 9 open candidates | 81 | — | 59 *Comercios* and 29 *Hostelería*, a separate section |
| **Total** | | **478** | **699** | **2** | |

A review pass on 2026-09-12 removed 44 of those 699 as already open from an
earlier pass in the same area note, leaving **655**. The batches had been
de-duplicated against the published CSV but not against the notes' existing
entries, which is what `docs/candidates/README.md` asks for; each affected batch
intro now names what was dropped and where it was already open.

Every batch took a slice rather than the whole source, and each deferred slice is
named above so the next pass knows what was left rather than missed.

Two recurring reasons for deferral: an operator published only as a personal name
with no trade name, which cannot carry a public identity without separate
research; and a register that names an operator but cannot show that a food
reaches the market under its own name.

### What the batches taught about matching

De-duplicating by name alone understates overlap badly, because registers key on
the legal name while the catalog keys on the public trade name. Matching on the
operator's **own web domain** caught duplicates that no name comparison would:
14 in CPAEN, 14 in the Asturian roster, 2 in CRAEGA, and in Madrid three
published rows were only found by hand after a fuzzy match pointed elsewhere.
Where a source publishes few websites — CRAEGA publishes about a dozen across
242 rows — the resulting candidate lists carry more duplicate risk, and the
Galician batch says so in its own note.

Three placement conflicts on published rows surfaced in passing and belong to a
level 3 pass, not to a candidate note: Olivapalacios (catalog Almagro, register
Bolaños de Calatrava), Pereimos 2007 (catalog A Pobra de Trives, register Touro)
and Regal López (catalog Taboada, register Chantada).

## What remains

| State | Sources | Note |
|---|---|---|
| Worked | 8, 16, 19, 20, 22, 24, 28, 30 | Deferred slices named above |
| Suspended | 25 | Host unreachable; 299 URLs and the slug-level de-duplication are ready |
| Closed — publishes no producer identity | 5, 21, 26, 32, 33, 47 | Not browsable, statistics only, a generic portal, a pointer to another source, or gone |
| Closed — licence or access forbids use | 31, 34, 48 | Two forbid commercial use; one is bot-blocked behind a paid licence |
| Closed — outside the evidence model | 49, 50 | Paid mercantile databases; mercantile attributes establish none of our claims |
| Governed by an existing ceiling | 10, 11, 12 | Catalan registers already described in the country guide |
| Corroboration only, not discovery | 1, 4, 7, 38 | Useful against an existing row; none can find a placeable new unit alone |
| Second-degree, reaches producers through another source | 9, 36, 39, 40 | Federations and sector associations |
| Qualified, not yet worked | 2, 3, 6, 13, 14, 15, 17, 18, 23, 27, 29, 37, 41, 42, 43, 45, 46 | Each has a verdict above; none is blocked |
| Open question, reachability only | 35 | Refused access on both checks; a verdict would be invention |
| Returned nothing at check | 44 | The exhibitor catalogue listed no exhibitors; an empty result is not an absence |

Of the 50: 8 worked, 1 suspended, 11 closed, 3 governed by an existing ceiling,
8 reaching producers only indirectly, 17 qualified and available, 1 still
refusing access, and 1 that returned an empty catalogue. Nothing now sits
unexamined: every source has had its content inspected or has a recorded reason
why it could not be.

The nearest useful work, in order: resume 25 when its host answers; 27 Asturias Alimentos del Paraíso's web directory, which holds 362
elaboradores behind filters and would corroborate the roster batch already
recorded; and the personal-name slices deferred from 16 and 28, which need a
public identity resolved per holder before they can carry rows.

## Full candidate disposition pass — 2026-09-13

This pass reviewed every row then present in the Spain candidate notes. The
8,799 older rows had already been reviewed; their recorded blocker was retained
unless this pass resolved the row as an exact catalog representation. The
655-row official-source intake from 2026-09-11/12 was checked individually
against the current catalog, its source ceiling and current first-party evidence.

- 117 producer identities were admitted to the canonical CSVs;
  122 candidate rows were removed because several identities
  appeared in more than one source batch.
- 123 additional rows were removed as already represented. No new
  evidence record was created for those queue-only duplicate resolutions.
- 1 malformed or affirmatively ineligible row was closed with an
  evidence tombstone.
- Every remaining row is a hold. Its last column states the unresolved admission
  test; no row was promoted from a directory, certification or association signal
  without the evidence required by that source's documented ceiling.

The pass deliberately leaves optional CSV fields blank when no reviewed source
supports them. Direct-sale registry authorisations do not set online sales, and
personal registry contact details were not copied into public rows.
