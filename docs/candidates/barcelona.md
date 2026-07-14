# Candidatos — Barcelona (pasada «flujo 2026»)

> Fichero creado el 2026-07-14 como ledger de la **pasada de ampliación por
> flujo** de Barcelona. El catálogo BCN está maduro (2.491 filas, 1ª pasada de
> verificación completa, ~80% dedup en barridos genéricos), así que esta pasada
> NO barre registros-foto-fija: busca el **flujo** (productores nacidos
> 2024-2026 y deltas de fuentes vivas) y se blinda contra re-evaluar
> descartados. Formato estándar de `docs/candidates/README.md`.
> **Aviso de coordinación**: solo esta pasada escribe aquí; añadir secciones
> nuevas sin tocar las anteriores.

## Protocolo por sesión

1. Abrir la tabla «Estado de lotes» y coger el primer lote `pendiente` (o
   continuar el `en curso`). Respetar el GO/NO-GO tras el lote 1.
2. Descubrir candidatos de la fuente del lote y pasarlos por el **triple
   filtro**, en este orden: (a) sección «Descartados — no re-evaluar» de este
   fichero, (b) dedup contra `data/csv/catalunya/barcelona.csv` (dominio +
   teléfono normalizado + marca Y razón social con acentos plegados y guarda
   de categoría), (c) gate de encaje (abajo).
3. Anotar cada candidato en su sección de lote con estado
   (`unverified`/`accepted`/`rejected`/`already-present`), fuente y motivo.
4. Verificar 1-a-1 e integrar según el flujo del README (evidencia JSONL,
   `check:csv:changed` iterando, `verify:data` al cerrar; si `npx` falla,
   scripts directos con `bash`/`node`).
5. Actualizar la tabla de estado + Bitácora, y la memoria de sesión si cambia
   el estado global de la pasada.

## Reglas fijas de la pasada

- **Gate de encaje**: productor real con marca propia (dominio que redirige al
  grupo = etiqueta del grupo → fuera); no maquila ni grupo industrial/masa; no
  distribuidor/retail puro; provincia y municipio según **su propia web**, no
  el registro/fuente. Además, por ser pasada de recientes: **señal de
  actividad viva** ≤ 6 meses (post, reseña, venta) — sin ella, no alta.
- **`verificado` vs `parcial`**: `verificado` exige fuente viva leída en vivo
  que confirme identidad + actividad + municipio; web propia caída/SPA sin
  render → tope `parcial`. Solo-fuente-secundaria → `parcial`.
- **`Venta online=sí`** solo con checkout propio (o del grupo matriz de
  calidad) visto en vivo; marketplaces de terceros → `no comprobado`.
- **Regla de parada por veta**: si una fuente rinde < ~1 alta por cada 5-6
  candidatos revisados de forma sostenida, cerrar el lote con
  `descartado (yield)` y pasar al siguiente.
- **Trazabilidad**: anotar la fuente en cada alta (columna «Fuente» de la
  bitácora) para aprender qué veta rinde en Barcelona.
- **Snapshots (frente B)**: al cruzar una fuente viva, guardar el listado
  crudo (nombre·municipio·web) en `docs/candidates/barcelona-snapshot-[fuente].md`
  para que la siguiente pasada sea un diff, no un re-triaje.

## Estado de lotes

Frentes: **0** blindaje · **A** nacidos 2024-2026 (eje temporal explícito) ·
**B** fuentes vivas por deltas.

| Lote | Frente | Fuente / alcance | Tamaño est. | Estado | Revisados | Altas |
|---|---|---|---|---|---:|---:|
| 0 | 0 | Reconstruir descartes históricos desde git (`529e83b`, `d58771d`, pasada atípicos) + purgas de `docs/verificacion/barcelona.md` → rellenar «Descartados — no re-evaluar» | — | ✅ 2026-07-14 | 618 slugs + 12 pre-CSV | — |
| 1 | A | **Cata de rendimiento**: muestra Benvinguts a Pagès 2026 (prov. BCN) + prensa comarcal 2025-26 (Regió7, El 9 Nou) | ~20 sonda | pendiente | | |
| — | — | **GO/NO-GO**: si el lote 1 rinde ≥ ~1 alta/5-6 revisados, seguir con 2-7; si no, saltar al frente B | — | — | — | — |
| 2 | A | Benvinguts a Pagès 2026 completo, prov. BCN por comarcas (priorizar Berguedà, Moianès/Lluçanès, Anoia rural) | ~30-50 | pendiente | | |
| 3 | A | Cerveseras: Barcelona Beer Challenge 2025/26 (medallistas nuevos) + GECAN altas recientes | ~15-25 | pendiente | | |
| 4 | A | Vino: Premis Vinari 2025/26 + vino natural (Vella Terra y ferias afines) — debutantes DO Alella / Pla de Bages / Penedès | ~15-25 | pendiente | | |
| 5 | A | Formatgeries: Lactium (Vic) ediciones 2025/26 + Millor Formatge Català | ~10-20 | pendiente | | |
| 6 | A | Verkami: campañas de alimentación 2024-26 en prov. BCN (obradores, cerveseras, formatgeries) | ~10-20 | pendiente | | |
| 7 | A | Prensa comarcal, barrido sistemático por cabecera («obre obrador», «nova formatgeria», «celler nou»… 2025-26): Regió7, El 9 Nou, Nació Digital comarcal, Tot locals, VIA Empresa | ~20-40 | pendiente (condicionado a yield 1-6) | | |
| 8 | A | BORME constituciones 2025-26 CNAE alimentario prov. BCN — red de arrastre, ruidosa | ~30+ brutos | opcional | | |
| 9 | B | Gastroteca.cat: cruce contra CSV + snapshot | ~40 brutos | pendiente | | |
| 10 | B | Xarxa Productes de la Terra (Diputació BCN): cruce + snapshot | ~40 brutos | pendiente | | |
| 11 | B | Mercats de pagès municipals + Slow Food Mercat de la Terra BCN: cruce + snapshot | ~20-30 | pendiente | | |
| 12 | B | CCPAE prov. BCN: si publica fecha de alta, solo altas 2024-26; si no, snapshot para deltas futuros | ~20-40 | pendiente | | |

Colas finas donde priorizar dentro de cada lote (huecos del catálogo actual):
Conservas (7), Frutos secos (9), Aromáticas (9), Harinas (3), Aceitunas y
encurtidos (2), Hidromiel (1), Licores (11), Miel (23), Aceite (28), Pescado
(27, confradías Maresme/Garraf) y tipos emergentes (vino natural,
microdestilerías, espirulina). **Evitar** Pan/Charcutería/Fruta genéricos: el
dedup se come el esfuerzo.

## Descartados — no re-evaluar

> Rellenado en el lote 0 (2026-07-14, git archaeology). Cada entrada: nombre ·
> municipio · motivo del descarte · commit/fuente donde se decidió. Los
> descartes nuevos de esta pasada se añaden aquí también, para que las sesiones
> futuras no los re-pesquen.

**Filas que salieron del CSV (618)** → snapshot completo en
[`barcelona-snapshot-descartados-git.md`](barcelona-snapshot-descartados-git.md)
(purgas de la verificación ~490 + dedup 119 pares `309dffd` + fusiones y
renombres). El filtro (a) del protocolo = grep del candidato **en ese snapshot
y en las tablas de abajo**. Hit en el snapshot → mirar el motivo con
`git show <commit>` antes de decidir: fusión/renombre = ya está (lo confirma el
dedup (b)); «sin rastro en 2026-06» + fuente viva nueva = reconsiderable,
anotándolo aquí.

**Descartes que nunca entraron al CSV** (no aparecen en el snapshot):

| nombre | municipio real | motivo | fuente |
|---|---|---|---|
| Destilerías MG / Gin Mare | Vilanova i la Geltrú | industrial multinacional (Brown-Forman, ~100 empleados) — exclusión editorial no-km0 | pasada atípicos 2026-06-24 (commits `4e4c5bb`/`613a92d`) |
| Vermut Berichó (Bardinet) | — | solo reventa de terceros, sin elaboración con presencia propia | pasada atípicos 2026-06-24 |
| Kombutxa | Mataró | no es marca distinta: producto de Mūn Ferments, ya en CSV (`mun-kombucha-mun-ferments-sl-mataro`) | pasada atípicos 2026-06-24 |
| Yamaaoi (wasabi) · Castanya de Viladrau | Viladrau = **Girona** | fuera de provincia | pasada atípicos 2026-06-24 |
| Kenshô (sake) | Delta de l'Ebre = **Tarragona** | fuera de provincia | pasada atípicos 2026-06-24 |
| Joan Grill (vins) | Aiguamúrcia/Pla de Manlleu = **Tarragona** | fuera de provincia (aunque vinifique en el Viver de Vilafranca) | pasada atípicos 2026-06-24 |
| Escatafood (garum) · SOLÉS (anxoves) | L'Escala/Empordà = **Girona** | fuera de provincia | pasada atípicos 2026-06-24 |
| Safrà del Montsec · Caviar Nacarii · harinas de cereal antiguo | Montsec/Vall d'Aran/Garrigues = **Lleida** | fuera de provincia | pasada atípicos 2026-06-24 |
| Hofmann — centro Badalona | Badalona | infraestructura de producción/I+D, no fila nueva: la marca ya está (`pastisseria-hofmann-barcelona-ciutat-vella`) | nota candidatos 2026-06-05 (`529e83b`) |
| Parallelo Gelato — Time Out Market | Barcelona | punto de venta, no productor nuevo: ya está (`parallelo-gelato-barcelona-gracia`) | nota candidatos 2026-06-05 (`529e83b`) |

**Alias «ya estaba» que el cruce automático NO caza** (falsos negativos por
nombre corto/slug pegado — no re-añadir):

| nombre en fuentes | fila existente | nota | fuente |
|---|---|---|---|
| «Roca» / AT Roca | `at-roca-pacs-del-penedes` | municipio real Avinyonet del Penedès (slug hereda Pacs); reubicada en lote 89 de verificación | nota Rutes del Vi (`d58771d`) |
| Celler Sant Miquel d'Oló | `celler-sant-miquel-dolo-santa-maria-dolo` | — | nota Rutes del Vi (`d58771d`) |

Contexto útil: los 7 candidatos de la nota de junio (Vibra, Fonik, MCava, A27,
Holy Madre, Hijos de Nata, Baluard El Magatzem) acabaron **todos integrados** —
de las notas históricas de candidatos no queda nada pendiente ni descartado.
Huecos que la pasada atípicos no pudo llenar con productor BCN de marca propia
(no insistir sin señal nueva): castaña, azafrán, trufa/setas frescas
(producción mayorista anónima vía Mercabarna).

## Candidatos por lote

*(las secciones se añaden al abrir cada lote, formato estándar del README:
estado + fuente + resultado del dedup + slug final si acaba en alta)*

## Bitácora

| Fecha | Lote | Sesión/agente | Resultado |
|---|---|---|---|
| 2026-07-14 | — | Claude (planificación) | Creado el ledger; pasada definida en 3 frentes y 13 lotes; pendiente lote 0 |
| 2026-07-14 | 0 | Claude | ✅ Lote 0 cerrado. Arqueología de los 220 commits del CSV → **618 slugs salidos** volcados a `barcelona-snapshot-descartados-git.md` (purgas verificación ~490 + dedup 119 pares + fusiones/renombres). Sección «Descartados» rellenada: 10 descartes pre-CSV de la pasada atípicos + 2 «no añadir fila» de la nota de junio (Hofmann Badalona, Parallelo TOM) + 2 alias «ya estaba» de Rutes del Vi (AT Roca, Sant Miquel d'Oló). Los 7 candidatos de junio 2026 acabaron todos integrados. Siguiente: **lote 1** (cata de rendimiento, GO/NO-GO) |
