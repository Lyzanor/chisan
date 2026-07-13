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
present in the catalog. When a file is fully resolved, summarize it in
`integracion.md` («Resumen de lo integrado») and delete it — git history is the
archive. Verification ledgers do not belong here; they go to
`docs/verificacion/`.

## Estado de la carpeta (reordenación 2026-07-13)

Ficheros vivos y su cola pendiente (⚑ el pool de alto valor está agotado: casi
todo lo que queda son colas de registro sin web o descartes grupo/maquila):

| Fichero | Pendiente (aprox.) | Naturaleza |
|---|---|---|
| `ourense.md` | ~80 | Monterrei resto 13 (solo tel) · Ribeiro corte 3 ~34 · Valdeorras resto ~19 (necesita navegador) · Queixería Gaia (¡con web!) · diferidos con motivo |
| `santa-cruz-de-tenerife.md` | ~62 | 5 bodegas con web + DOP Islas Canarias ~9 con web · 45 sin web · 3 Anaga sin rastro |
| `cordoba.md` | ~20 | 3 leads con tienda (Rosán, Campolio, Lagar de Quirós) · coops Montilla/Montoro-Adamuz · 7 registro sin web · COVAP/Embajada/Gracia Hnos. |
| `zaragoza.md` | ~21 | Cariñena corte 2 ~16 (vía organismo certificación) · 3 coops Borja · 2 B2B |
| `jaen.md` | ~17 | Segura sin web 13 + 4 de la nota final |
| `navarra.md` | ~17 | Registro INTIA sin web · correcciones mendiko/otazu/lezaun |
| `huelva.md` | ~15 | Bodegas Bollullos/Almonte sin web · 8 coops Condado · Cárdeno/Miguel y María (provincia) |
| `teruel.md` | ~14 | Jamón DOP resto (5 + 3 DNS) · Melocotón La Arenosa · 4 provincia sin web · Centelles y Buj |
| `valencia.md` | ~13 | Utiel-Requena sin web 7 · 4 coops triaje · BVC · Sentencia |
| `toledo.md` | ~11 | 8 coops aceite sin web · IFAMA · 3 queserías Manchego diferidas |
| `madrid.md` | 10 | Heladerías pendientes de filtro estricto (dueño propio) |
| `lugo.md` | ~8 | Diferidos (Fusco, Figueira, CastroCandaz…) · corrección Torre de Núñez · pistas capital |
| `ciudad-real.md` | 3 | Olivapalacios, Pago Piedrabuena, COLIVAL (Campo de Calatrava) · doble faceta El Progreso |
| `a-coruna.md` | 3 | Queixeiros sin rastro digital — ⚠ fichero en curso de otro agente |
| `festa-do-queixo.md` | ~50 pistas | ~34 productores de fuera de Galicia (triar al abrir cada provincia) + corte 2 gourmet (17) |
| `integracion.md` | — | Ledger fase B + residuales heredados de docs borrados |

For unresolved candidates, keep enough evidence for another agent to continue
without restarting:
- status: `unverified`, `accepted`, `rejected`, or `already-present`
- source URL or search route used
- duplicate check result
- final slug when accepted or already present

Once accepted, structured provenance belongs in `data/evidence/**`; prune
routine source detail from candidate notes.

## Cómo encontrar el registro real de una DO/DOP (aprendizajes, pasada do-huecos 2026-07)

Destilado de 26 lotes contra consejos reguladores. El ledger de aquella pasada
(`do-huecos.md`) se borró al cerrarse (2026-07-13); el detalle por lote vive en
el historial git y el resumen en `integracion.md` → «Resumen de lo integrado».

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

## Cómo integrar un candidato al CSV (aprendizajes, fase B 2026-07)

Destilado de ~22 lotes de integración (~152 altas). Ledger por lote en
`integracion.md` → Bitácora.

**Provincia = donde produce/vende, según la web propia, NO el registro.** El
registro de un consejo lista a menudo la sede fiscal, y a veces sitúa mal a un
operador de otra provincia. Contrastar el municipio con la web propia siempre; si
chocan, manda la web/planta. Casos: *Oliflix* (registro DOP Bajo Aragón la puso en
Mequinenza/Zaragoza; su web dice Flix/Tarragona) · *Hermanos Cárdeno* (registro
Cumbres Mayores; web Fuentes de León/Badajoz) · *Miguel y María* (sede Segovia,
fábricas en 2 provincias) · *Ontañón* (inscrita en Navarra, es riojana). Y
correcciones de municipio dentro de provincia por la ficha del propio operador
(Alba Romero→Cala no Jabugo; Al Alma del Olivo→La Guardia no Sonseca; Ozalder→
Larraga no Lerín; Heredad Ansón→Muel no Cariñena).

**`verificado` vs `parcial` (regla de rigor):** `verificado` exige una **fuente
verificadora leída EN VIVO** (tipo `official-site`/`store`/`social`/`google-maps`/
`marketplace`) que confirme identidad + actividad + municipio. Si la web propia no
carga (SSL/cert/403/401/DNS/dominio aparcado/hosting suspendido) o es una SPA que
no renderiza, tope **`parcial`** aunque el registro y varios directorios lo
confirmen. Solo-registro → `parcial`. Los dominios muertos son constantes en las
colas (muchas coops viejas siguen certificadas con la web caída → `parcial`
legítimo).

**`Venta online=sí` solo con checkout propio o colectivo visto en vivo.**
Marketplace de terceros (SondeLugo, A tenda do Avó, Bigcrafters, Mentta) → `no
comprobado`. Tienda «en mantenimiento», carrito sin checkout operativo, o portal
tras verificación de edad que no deja ver la tienda → `no comprobado`. La tienda
del grupo matriz que vende el producto de la bodega SÍ cuenta (Valcarlos→Grupo
Faustino).

**Grupos y maquila:** bodegas/almazaras de **terroir con nombre propio** de grupos
de calidad SÍ se integran (Valcarlos/Faustino, Bodegas Olimpia/Vitilia, El
Molinillo/Nortia); la exclusión de «gran grupo» es solo para **industrial/masa**
(Grupo Montes Norte, La Fallera/Maicerías, Herba/Ebro Foods). Una marca cuyo
dominio **redirige al sitio del grupo** es una etiqueta del grupo, no una entidad
propia → exclusión (Doña Isabella→Marqués del Atrio). Cooperativas de 1er grado que
muelen para el socio pero cuya **marca y tienda son la coop de 2º grado** → maquila
/B2B, **descartar** y quedarse con la de 2º grado (Campo de Montiel).

**Evidencia (`data/evidence/**`):** el tipo de fuente válido es `official-site`
(el validador rechaza `store`). Un `keep` `verificado` con `VO=no` necesita el
claim `online-sales`; un `parcial` necesita `municipality` en alguna fuente
(el registro del consejo lo aporta). Warnings de evidencia no bloquean.

**Geocodificación y homónimos:** `municipios.json` colapsa homónimos (Cascante/
Teruel, La Guardia/Jaén, Ocaña/Almería, Zurukuain no existe→usar Yerri); un script
simple da falso `BLOQ >100km`, pero **el audit los resuelve con el override por
comunidad** — fijar las coords al municipio correcto y confiar en `audit-csv.js`.
Nominatim con «calle, CP municipio» a veces casa a cientos de km (Ctra. Tarazona→
205 km): validar ≤15 km contra el centroide y caer al centroide del municipio si
falla. Varias filas de un mismo municipio sin dirección comparten centroide (se
acepta como fallback).

**Gates sin npx:** si `npx pnpm` no va (caché npm corrupta), correr directo
`bash scripts/check-csv-contract.sh`, `node scripts/check-images.mjs`,
`node scripts/check-evidence.mjs` (= `verify:data`) y sus variantes `-changed`.

**Rendimiento por tipo de lote:** oro = **aceite/jamón/queso DOP con web+tienda**
(secaderos Jabugo 10/10 verificado+VO=sí, DOP Montes de Toledo, Sierra de Cazorla/
Segura, queserías Manchego). Cuando se agota ese pool, el resto son **colas de
registro sin web** (`parcial` fino, coords a centroide) o **descartes por grupo/
maquila** → verificar 1-a-1, no padear en bloque.
