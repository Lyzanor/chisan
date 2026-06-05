# Barcelona Candidate Notes

Research date: 2026-06-05

Scope: recently opened or recently surfaced producers in Barcelona province, with
emphasis on 2026 openings.

De-duplication performed:

- `npx pnpm list:province barcelona` generated 2,964 current Barcelona rows.
- Exact/near-name checks were run against the roster and
  `data/csv/catalunya/barcelona.csv`.
- No CSV edits were made in this pass.

## Candidates For Review

| status | candidate | municipio | likely category | evidence | duplicate check | review notes |
| --- | --- | --- | --- | --- | --- | --- |
| unverified | Vibra Gelateria | Barcelona - Eixample | Helados | Time Out, 2026-05-19: opened 2026-05-08 at C/ Enric Granados, 145; artisan gelato with Catalan flavors. https://www.timeout.es/barcelona/es/noticias/asi-es-vibra-la-heladeria-artesana-que-apuesta-por-el-helado-de-carquinyoli-y-se-hizo-viral-tras-la-rua-del-barca-051926 | `Vibra` not found in current Barcelona roster. | Good 2026 lead. Confirm official/social source, Google Maps place, phone/web if any, and whether `Venta online` is `no comprobado` or `no`. |
| unverified | Fonik | Barcelona - Sant Antoni | Helados | Un Buen Dia en Barcelona, 2026-05-14, and Paperblog/Bulevard coverage: C/ Tamarit, 104; cafe with artisan gelato made daily in own obrador. https://unbuendiaenbarcelona.com/fonik/ / https://es.paperblog.com/fonik-cafe-de-especialidad-helados-de-autor-y-la-cultura-del-vinilo-convergen-este-chaflan-de-sant-antoni-10493618/ | `Fonik` not found in current Barcelona roster. | Strong candidate if accepted as a helado producer rather than just cafe. Confirm official Instagram/maps and coordinates. |
| unverified | MCava Pastissers | Mataro | Pan y pasteleria | Capgros, 2026-06-01: Pg. Carles Padros, 75; pasteleria artesana, product made by hand, own production in obrador. https://capgros.elnacional.cat/es/negocio/empresas-y-emprendedores/mcava-pastissers-nueva-pasteleria-toda-vida_818616_102.html | `MCava`, `M Cava`, and `Cava Pastissers` not found in current Barcelona roster. | Recent lead, though JobToday suggests the business existed by 2025-11. Confirm if this is a new shop or rebrand before marking as 2026 opening. |
| unverified | A27 Bakehouse | Barcelona - Ciutat Vella (Raval) | Pan y pasteleria | Barcelona Secreta, 2026-04-22: Carrer del Carme, 53; Raval obrador/pasteleria with daily batch, sourdough and laminated pastry. https://barcelonasecreta.com/a27-pasteleria-raval/ | `A27` and `Bakehouse` not found in current Barcelona roster. | Not strict 2026: Tripadvisor review says it opened shortly before 2025-12. Still a good recent candidate if the pass accepts late-2025 openings. |
| unverified | Holy Madre Gelateria - Barceloneta | Barcelona - Ciutat Vella (Barceloneta) | Helados | Time Out, 2026-05-19: new local at C/ de la Maquinista, 11; brand described as artisan-production Argentine gelato. https://www.timeout.es/barcelona/es/noticias/la-oferta-celebra-la-apertura-de-un-nuevo-local-de-la-cadena-conocida-por-sus-deliciosos-helados-de-dulce-de-leche-y-pistacho-051926 | `Holy Madre` not found in current Barcelona roster. | Needs stricter review: multiple-shop brand, confirm if production/obrador belongs in catalog and whether to add brand or specific location. |
| unverified | Hijos de Nata | Barcelona - Gracia / Sarria-Sant Gervasi | Helados | DondeGo, 2026-01-07, and business registry snippets: first local at Pl. Gal.la Placidia, 2; second at Rubinstein, 6 planned/opening in 2026; own obrador in Gracia. https://dondego.es/barcelona/news/hijos-de-nata-revoluciona-grcia-con-helados-de-autor-y-diseo-argentino/ | `Hijos de Nata` not found in current Barcelona roster. | Not a pure 2026 opening: company created 2025-05 and first shop opened 2025. Useful recent candidate; decide whether to add first shop, second shop, or one brand row. |
| unverified | Baluard - El Magatzem | l'Hospitalet de Llobregat | Pan y pasteleria | Baluard social/LinkedIn coverage: new 2026 space at C/ Cobalt, 124, L'Hospitalet; artisan bread brand. https://es.linkedin.com/company/baluard-barceloneta-sl | Brand is already present as Baluard Barceloneta, Eixample, and Poblenou; this specific L'Hospitalet site was not found. | Treat as a new-location decision, not a new producer. Confirm whether it has production/retail status and avoid duplicate brand clutter. |

## Already Present Or Low-Value Duplicates

| status | candidate/source | existing row or reason |
| --- | --- | --- |
| already-present | Jon Cake Poblenou, Time Out 2026-04-14. https://www.timeout.es/barcelona/es/noticias/jon-cake-abre-un-local-de-350-metros-cuadrados-dedicados-al-pastel-de-queso-en-el-poblenou-041426 | Existing row: `jon-cake-poblenou-barcelona-sant-marti`. |
| already-present | Parallelo Gelato Time Out Market opening, Time Out 2026-04-30. https://www.timeout.es/barcelona/es/noticias/una-de-las-mejores-heladerias-del-mundo-abre-en-time-out-market-barcelona-043026 | Existing base row: `parallelo-gelato-barcelona-gracia`. The Time Out Market stand is a new sales point, not necessarily a distinct producer row. |
| already-present | Hofmann Badalona production/I+D center, The New Barcelona Post 2026. https://www.thenewbarcelonapost.com/hofmann-badalona-centro-id-expansion-internacional/ | Existing brand row: `pastisseria-hofmann-barcelona-ciutat-vella`. New Badalona center appears to be production infrastructure, not a public producer detail row. |
| already-present | La Fabrique | Existing row: `la-fabrique-barcelona-sants-montjuic`. |
| already-present | Obrador La Nena | Existing row: `obrador-la-nena-barcelona-gracia`. |
| already-present | Forn Gil | Existing row: `forn-gil-barcelona-sant-marti`. |

## Next Review Steps

1. Prioritize strict 2026 openings first: Vibra Gelateria, Fonik, MCava Pastissers.
2. For each accepted candidate, verify an official site/social or Google Maps
   listing, get coordinates, normalize address/phone/web/social, and decide
   `Venta online`.
3. Before adding rows, run `npx pnpm list:province barcelona` again and grep the
   candidate name to avoid races with other agents.
4. After CSV edits, run `npx pnpm check:csv:changed`, then `npx pnpm verify:data`.
