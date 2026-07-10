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

Do not keep candidate notes directly under `docs/` as
`docs/[provincia]_candidates.md`. If you find one, move it here and rename it
to the shared province file before continuing, unless `git status --short`
shows another agent is actively working that province. In that case, leave the
file untouched and call it out in the handoff.

Before adding any producer to `data/csv/**`:

1. Run `npx pnpm list:province [provincia]` to check existing rows.
2. Verify the producer through an official website, registry, map listing, or
   reliable public source.
3. Add only real producers with a stable `slug`, normalized `categoria`,
   coordinates, `Google Maps`, `verificacion`, and `Venta online`.
4. Add the accepted decision to the matching `data/evidence/**` JSONL ledger.
5. Run `npx pnpm check:csv:changed` while iterating.
6. Run `npx pnpm verify:data` before finishing.

Prune or update these notes once candidates are accepted, rejected, or already
present in the catalog.

For unresolved candidates, keep enough evidence for another agent to continue
without restarting:
- status: `unverified`, `accepted`, `rejected`, or `already-present`
- source URL or search route used
- duplicate check result
- final slug when accepted or already present

Once accepted, structured provenance belongs in `data/evidence/**`; prune
routine source detail from candidate notes.

## Cómo encontrar el registro real de una DO/DOP (aprendizajes, pasada do-huecos 2026-07)

Destilado de 26 lotes contra consejos reguladores. Detalle por lote en
`do-huecos.md` → Estado.

**Dónde buscar, por orden de rendimiento:**

1. **El organismo de control/certificación, no el consejo.** Cuando la
   certificación está delegada (INTIA en Navarra, entidades tipo ENAC), ese
   organismo publica el listado íntegro de operadores; el consejo solo enseña
   sus asociados o los que pagan ficha de enoturismo (Navarra: 27 de 85;
   Cariñena: 17 de 33). Buscar «listado operadores certificados <DO> pdf».
2. **El endpoint de datos detrás del JS.** Si la web pinta el listado con
   JavaScript, mirar antes de rendirse: endpoints CSV (`bodegas_csv.php` en
   Ribeira Sacra), el JSON embebido en `wp-json/wp/v2/pages/<id>` (array
   `places` del Queso Manchego), custom post types (`wp/v2/bodegas` en
   Navarra), o una ruta hermana server-rendered (`/autenticos-productores/` en
   Calanda).
3. **El portal institucional** (cabildo, diputación, consejería): tablas
   limpias Nombre·Marca·Dirección·Web (`vinosdetenerife.es`).
4. **La cooperativa de 2º grado o comercializadora comarcal** cuando el consejo
   no publica nada (Campo de Montiel) — con cautela: si ella comercializa todo,
   sus socias probablemente son maquila y no son vendibles por separado.
5. **Wayback Machine** para PDFs movidos y webs caídas (INTIA, Ycoden,
   Utiel-Requena vía PDF de terceros).

**Trampas de dominio:** los dominios "oficiales" caducan y se reutilizan
(`arzua-ulloa.org` → academia; `docarinena.com` → sitio vietnamita, aunque el
email del consejo siga siendo @docarinena.com). Verificar siempre que el
contenido es el del consejo. Un 403 persistente suele ser Cloudflare
(`utielrequena.org`): probar `Referer`, y si no, fuente alternativa.

**Reglas de dedup que evitan duplicados reales (todas mordieron):**

- **Marca ≠ razón social.** El consejo publica marcas y el registro razones
  sociales (o al revés). Cruzar SIEMPRE ambas contra `nombre` del CSV
  (Finca Albret=Príncipe de Viana; Oveman=Villadharo; Mesur=Frontos;
  Calius=Cándido Hernández Pío).
- **Plegar acentos ANTES de quitar palabras genéricas** («QUEIXERÍA» no casa
  con «queixeria» si se filtra primero).
- **Exigir la categoría correcta en la fila del CSV** al casar por nombre; sin
  esa guarda, bodegas casan con charcuterías, conserveras o fruta.
- **Municipio, no sede fiscal**: el registro suele dar la sede (Discosta Norte
  «en Ribadeo» para una bodega de Utiel-Requena) o la del consejo (fichas de
  Monterrei). Y una misma empresa aparece dos veces si tiene dos plantas
  («Instalaciones sitas en:» del PDF de INTIA).
- Un dominio que no casa con el nombre suele ser **la matriz del grupo**, no un
  duplicado (pazodomar.com en Pazo das Tapias).

**Medir el hueco contra el registro de operadores, nunca contra el CSV**: contar
«filas de la categoría en la zona» infló huecos inexistentes (Arzúa-Ulloa,
Manchego-Cuenca) y ocultó reales (Utiel-Requena, 34 netas).
