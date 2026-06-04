# Cáceres Candidate Notes

Raw candidate notes from manual research. Not source of truth until each producer is checked again and promoted into `data/csv/extremadura/caceres.csv`.

## 2026-06-04 — Resolved (candidate pass closed)

The 2026-06-03 pass (55 candidates) has been verified and integrated. Summary:

- **41 `accepted` candidates verified and added** to `data/csv/extremadura/caceres.csv` (all as `verificacion=parcial`, web-verified existence + contact data; `lat`/`lon` set to the municipio centroid, so coordinates are municipio-level approximations to refine later). `Venta online=sí` only where a live own-site checkout was confirmed (23 rows).
- **13 `duplicate` candidates confirmed already present** (Quesería Almonte, Iberqués Extremadura, La Chinata→Finca La Barca, Las Hermanas, Almazara As Pontis, Coop. Navaconcejo, Gata-Oliva→La Almazara Extremeña, La Almazara Tradicional, Casa Alonso, Conservas Sendín, Embutidos Sierra de las Villuercas). No action.
- **3 `accepted` candidates intentionally NOT added:**
  - **Jamones Casa Bautista (Montánchez HQ)** — same brand already in CSV as `jamones-casa-bautista-trujillo`. Casa Bautista (Montánchez, since 1925) runs shops in both Montánchez and Trujillo + online; adding a second row would duplicate the brand. NOTE for editors: the existing Trujillo row may be better placed in Montánchez (production/secaderos are there), but the existing row was left untouched.
  - **El Garganteño (Garganta la Olla)** — it is mainly a *tienda de productos típicos* (reseller of third-party products), not a self-producer. Does not fit the self-producing criterion, despite making some of its own honey.
  - **Miel HurdeGatina (Torrecilla de los Ángeles)** — could not verify it is a real active producer. `mielhurdegatina.com` returns HTTP 429 (no readable content) and no independent source (DOP registries, press, Google Maps, social) confirms the brand. Re-check later; do not add until verifiable.

### Follow-up done (2026-06-04)
- **Images**: 20 logos applied via `enrich:images --apply --slug` (reviewed each; only saved genuine brand logos). Granaex's only candidate rendered as junk → reverted to blank.
- **Coordinates**: 20 rows geocoded to street/building level via Nominatim. 14 rows upgraded to `verificado` (own website + precise coords). Counts: 14 verificado · 27 parcial · 231 pendiente.
- **Instagram/Facebook**: added IG for Las Granadas + Barón de Ley; FB for Caravaca, Sierra Miel, Granaex, Las Granadas.

### Still worth enriching (future)
- **Images missing** on 21 rows: no web / HTTP 403 (El Rey de la Vera, Cooprado, COPRECA) / 503 (Cerex) / SSL (Campo y Tierra) / DNS (Mangurria), plus a few whose top candidate was a white logo or EU/subsidy banner (Queval, Extrem Puro, Acenorca, Jacoliva, Granaex). Several of these have a usable logo on-site — pick the right candidate manually.
- **Coordinates** still at municipio centroid for the rows Nominatim could not resolve (mostly polígono-industrial / km-marker / paraje addresses): villuercas, capribor, queval, la-dalia, orencio-hoyo, regadhigos, extrem-puro, dehesa-de-solana, carlos-rosco, extremiel, las-granadas, castanas-el-comun, peraliega, cooprado, las-delicias, sierra-miel, acenorca, granaex, martin-amaro.
- **Instagram** genuinely not found for Caravaca, Sierra Miel, Granaex (use FB), Regadhigos, Coop. San Marcos Torrecilla.
- A few phones came from DOP-registry candidate notes rather than the producer's own site (Caballo de Oros, Dehesa de Solana, Castañas El Común, Miel Flor de Alba, Bodegas Martín Amaro) — confirm if revisited.
