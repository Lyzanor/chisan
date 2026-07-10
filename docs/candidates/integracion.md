# Integración de candidatos → CSV (fase B) — ledger de lotes

> Origen: la fase A (descubrimiento) quedó cerrada el 2026-07-10 en
> `do-huecos.md` («⚑ PASADA CERRADA»): **463 candidatos `unverified`** en 16
> ficheros de esta carpeta (incluyen las secciones «Capital» de la pasada de
> capitales 2026-07-08), más 13 queserías DOP Manchego anotadas en
> `cuenca.md` §Pistas y aún sin traspasar a Toledo/Ciudad Real/Albacete.
> Este documento es el ledger de la **fase B**: verificar cada candidato e
> integrarlo en `data/csv/**` con la fila completa, o resolverlo con motivo.
> Los candidatos siguen viviendo en `docs/candidates/[provincia].md`; aquí solo
> van la worklist, el flujo estándar y la bitácora.

## Flujo por lote (un lote = una provincia = un commit)

0. `git status --short`: no pisar provincias activas de otro agente (a
   2026-07-10: `zamora.csv` está en curso ajeno — no tocar).
1. Re-dedup contra el CSV vivo: `npx pnpm list:province [provincia]` + `rg`
   por dominio y teléfono normalizados; cruzar **marca Y razón social**
   plegando acentos antes de quitar genéricos; exigir categoría coherente al
   casar por nombre.
2. Verificar cada candidato por web (orden de coste: web oficial → Google
   Maps → registro/consejo → redes). Resultado por entrada: **alta** ·
   **rejected** (motivo) · **already-present** (→ slug) · **diferido** (sin
   rastro digital suficiente; queda anotado).
3. Alta = fila con las 20 columnas trabajadas (criterios abajo). `imagen`
   queda vacía: las imágenes son una pasada aparte (`enrich:images`, nunca en
   bloque).
4. Evidencia: un registro `keep` por alta en
   `data/evidence/[comunidad]/[provincia].jsonl` con
   `reviewedBy: claude-integracion-2026-07` y claims según
   `docs/EVIDENCE_CONTRACT.md`. Una corrección de slug lleva registro `merge`
   (slug viejo → nuevo).
5. Candidate note del lote: marcar `- [x] … — accepted → slug` /
   `rejected — motivo` / `already-present → slug`; podar lo resuelto y dejar
   contexto suficiente en lo diferido.
6. Gates: `npx pnpm check:csv:changed` (+ `check:evidence:changed`) mientras
   se itera; `npx pnpm verify:data` antes de commitear.
7. Commit solo con los ficheros del lote:
   `Integración candidatos: [provincia] lote N — X altas, Y resueltos, Z correcciones`.
   Push = deploy a producción: confirmarlo aparte.

## Criterios de decisión (operativos)

- **Alta mínima**: identidad + municipio productivo confirmados y ≥1 enlace
  verificable (web, Google Maps, Instagram o Facebook). Solo-registro sin más
  rastro → no se da de alta; queda como diferido. Campo vacío > invención.
- **`verificacion`**: fuente verificadora (web/tienda/social oficial o ficha
  GMaps) que confirme identidad + actividad + municipio → `verificado`;
  solo registro/consejo/directorio/prensa → tope `parcial`.
- **`Venta online=sí`** solo con canal comprobado en vivo al integrar
  (checkout, WhatsApp de pedidos, pedido por email/teléfono anunciado). Las
  pistas «Tienda online → sí» de fase A son pistas. `sí` ⇒ rellenar
  `Canal de venta`; reventa de terceros no es `sí`.
- **lat/lon**: geocodificar y validar ≤15 km contra el centroide de
  `municipios.json`; si no hay punto fiable, centroide del municipio.
  Municipio = unidad productiva, no sede fiscal.
- **Reglas duras heredadas de fase A** (respetar los ⚠ por entrada): grandes
  grupos/industriales/mataderos y maquila-B2B → no alta; cooperativas solo
  con marca de consumo propia; un dominio que no casa con el nombre suele ser
  la matriz del grupo, no un cruce.
- Formatos: `telefono` E.164 (`+34…`), `Google Maps` en formato place/search
  API, `descripcion` factual ≥30 caracteres, slug `nombre-municipio` estable.

## Worklist

Tamaño objetivo ~12-16 candidatos por lote; los cortes exactos se deciden al
abrir cada provincia siguiendo sus secciones. Estados: `pendiente` /
`en curso` / `hecho (fecha, conteos)`.

### Ronda 0 — pilotos y ficheros pequeños (cierran fichero)

| Orden | Provincia | Alcance | Abiertos | Lotes | Estado |
|---|---|---|---|---|---|
| 0.1 | Cuenca | DOP Manchego: 3 altas + 7 correcciones a filas existentes | 3 | 1 | hecho (2026-07-10) |
| 0.2 | Pontevedra | Festa do Queixo: Leite Ulla | 1 | 1 | pendiente |
| 0.3 | Soria | Ribera del Duero soriana (2 con pista VO=sí) | 4 | 1 | pendiente |
| 0.4 | Albacete | 2 queserías DOP Manchego (crear `albacete.md` desde `cuenca.md` §Pistas) | 2 | 1 | pendiente |
| 0.5 | A Coruña | 2 DOP + 5 Festa do Queixo; revisar ⚠ Grupo TGT | 7 | 1 | pendiente |

### Ronda 1 — prioridad 1 del traspaso (volumen, datos ya resueltos)

| Orden | Provincia | Alcance | Abiertos | Lotes | Estado |
|---|---|---|---|---|---|
| 1.1 | Ourense | Ribeiro corte 1 (24) → 2 lotes; Ribeiro corte 2 (24) → 2; Valdeorras (15) → 1; Monterrei (10+13) → 2; Ribeira Sacra (13) → 1; +1 Festa. Corrección: `pazo-das-tapias-monterrei` | 100 | ~8 | pendiente |
| 1.2 | Córdoba | Montilla-Moriles (8+14) → 2 lotes (⚠ resolver grupo Pérez Barquero antes de crear filas); Baena (15) → 1; Priego (9) + Lucena (4) → 1; Montoro-Adamuz (7) + Pedroches (8) → 1 | 65 | ~5 | pendiente |
| 1.3 | S.C. Tenerife | Tacoronte (9) + Orotava (5) → 1 lote; Güímar (4) + Abona (4) + Ycoden (3) + capital (5) + provincia (1) → 1-2. Correcciones: `aguita` (municipio), `bodegas-insulares-licores-tacoronte`, El Penitente→Arautava | 31 | ~2 | pendiente |

### Ronda 2 — prioridad 2 del traspaso

| Orden | Provincia | Alcance | Abiertos | Lotes | Estado |
|---|---|---|---|---|---|
| 2.1 | Teruel | Capital (3) + provincia (12) → 1 lote; Jamón DOP secaderos (21, municipios «a confirmar») → 2; Aceite Bajo Aragón (14) + Melocotón (1) → 1 | 51 | ~4 | pendiente |
| 2.2 | Jaén | Sierra Mágina (13) → 1; Sierra de Segura (18) → 1-2; Cazorla (7) se reparte. ⚠ homónimos de coops «San …» | 38 | ~3 | pendiente |
| 2.3 | Lugo | Provincia (6) + Ribeira Sacra lucense (24) → 2 lotes. Corrección: `torre-de-nunez-o-corgo` | 30 | ~2 | pendiente |
| 2.4 | Huelva | Jabugo secaderos (15) → 1; Condado bodegas (13, 6 «sin web, confirmar») → 1. Corrección: `jamones-tartessos-huelva` (municipio) | 28 | ~2 | pendiente |
| 2.5 | Navarra | Registro INTIA con contacto (11+9+6) → 2 lotes. Correcciones: `mendiko-aibar-oibar` (es bodega DO), `bodega-otazu-otazu` (municipio) | 26 | ~2 | pendiente |
| 2.6 | Zaragoza | Cariñena (9) + Borja (5) + Calatayud (3) → 1-2 lotes (⚠ resolver Gran Ducay↔Grandes Vinos); Aceite Bajo Aragón + Melocotón (8) → 1 | 25 | ~2 | pendiente |
| 2.7 | Valencia | Utiel-Requena embotelladoras (21) → 2 lotes; Arroz de Valencia (4, sin dirección) se reparte | 25 | ~2 | pendiente |

### Ronda 3 — prioridad 3 del traspaso

| Orden | Provincia | Alcance | Abiertos | Lotes | Estado |
|---|---|---|---|---|---|
| 3.1 | Toledo | Montes de Toledo (19, varias coops sin web) + **7 queserías DOP Manchego** desde `cuenca.md` §Pistas | 19+7 | ~2 | pendiente |
| 3.2 | Ciudad Real | Montes de Toledo CR (2) + Campo de Montiel (5, ⚠ socias de coop 2º grado: marca propia o descartar) + pista provincial (3) + **4 queserías DOP Manchego** desde `cuenca.md` (⚠ Rocinante = regla de grupos) | 10+4 | ~1-2 | pendiente |

### Fuera de alcance de esta fase

- Residuales de otras pasadas con dueño propio: `madrid.md` (10 pendientes de
  heladerías, filtro estricto), `guipuzcoa.md` (2, doc de verificación),
  `tarragona.md` (1, histórico Rutes del Vi).
- Cortes de **descubrimiento** pendientes de fase A (no integrar sin abrirlos
  antes): Tenerife 53 + DOP Islas Canarias ~9, Navarra 25, Utiel-Requena 13,
  Ribeiro corte 3 ~34, Cariñena ~16, Valdeorras resto ~19 (diferido).
- Imágenes de las altas nuevas: pasada propia por provincia con
  `enrich:images` (dry-run + por slug).

## Bitácora

- 2026-07-10 — Plan creado; arranca lote 0.1 (Cuenca) como piloto del flujo.
- 2026-07-10 — **Lote 0.1 Cuenca hecho**: 3 altas (2 `verificado` + 1 `parcial`;
  Piqmar, Magaceda, López Espada), 7 correcciones aplicadas (1 ya estaba:
  Villadharo), 1 slug corregido con `merge` (Campo Rus), 1 diferido nuevo
  (Ciudad de Huete/Lacto-Ganadera Río Mayor S.L.). Ledger de evidencia de
  Cuenca creado (10 registros). Aprendizajes: los dominios que publica el
  consejo pueden estar muertos mientras el del CSV vive (Chaves .com vs .es) —
  comprobar ambos antes de «corregir»; webs reales detrás de directorios
  gff.co.uk en 2 filas; «tienda» en menú sin checkout visible NO basta para
  `Venta online=sí` (Piqmar).
