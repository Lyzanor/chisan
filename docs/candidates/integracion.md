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
> (`do-huecos.md`, `cuenca.md` y demás docs ya integrados se borraron en la
> reordenación del 2026-07-13; ver «Resumen de lo integrado» y el historial git.)

## Resumen de lo integrado (consolidación 2026-07-13)

> Reordenación de la carpeta (2026-07-13): los docs de candidatos **totalmente
> integrados** se borraron (viven en el historial git); sus residuales están en
> la sección «Residuales heredados» de abajo. Los ledgers de *verificación* que
> estaban aquí por error (`asturias.md`, `guipuzcoa.md`, `la-rioja.md`) se
> movieron a `docs/verificacion/`.

Altas de la **fase B** (verificación e integración de candidatos de fase A),
rondas 0–3, 2026-07-10 → 2026-07-12. Detalle por lote en la Bitácora.

| Provincia | Altas | Fuente principal | Estado del doc |
|---|---:|---|---|
| Ourense | 67 | DO Ribeiro / Valdeorras / Monterrei / Ribeira Sacra | queda cola (ver doc) |
| Córdoba | 47 | Montilla-Moriles + 4 DOP aceite + Pedroches | queda cola (ver doc) |
| Lugo | 43 | DO Ribeira Sacra (26 + 17 micro-colleiteiros) + provincia | queda cola corta |
| Teruel | 29 | DOP Jamón Teruel + Aceite Bajo Aragón + capital | queda cola |
| S.C. Tenerife | 27 | 5 DO insulares + capital | queda cola grande |
| Navarra | 26 | DO Navarra (registro INTIA) | queda cola sin web |
| Jaén | 23 | DOP Sierra Mágina / Cazorla / Segura | queda cola sin web |
| Huelva | 18 | DOP Jabugo + DO Condado | queda cola coops |
| Zaragoza | 18 | DO Cariñena / Borja / Calatayud + Bajo Aragón | queda corte 2 Cariñena |
| Valencia | 16 | DO Utiel-Requena + DOP Arroz de Valencia | queda cola sin web |
| Toledo | 15 | DOP Montes de Toledo + Queso Manchego | queda cola coops |
| A Coruña | 7 | DOP Tetilla/Arzúa-Ulloa + Festa do Queixo | ⚠ en curso otro agente |
| Ciudad Real | 4 | DOP Montes de Toledo + Queso Manchego | queda 3 diferidas |
| Soria | 4 | Ribera del Duero soriana | ✅ doc borrado |
| Cuenca | 3 | DOP Queso Manchego (+7 correcciones) | ✅ doc borrado |
| Albacete | 1 | DOP Queso Manchego | ✅ doc borrado |
| Pontevedra | 1 | Festa do Queixo (Leite Ulla) | ✅ doc borrado |
| **Total fase B** | **≈349** | | |

Pasadas anteriores con doc en esta carpeta, también consolidadas:

- **Tarragona — Rutes del Vi** (jun-2026): ~195 altas (Terra Alta 17, DO
  Tarragona 10, Conca 18+1, Montsant 44, DOQ Priorat 106) — ✅ doc borrado,
  histórico en git; verificación en `docs/verificacion/tarragona.md`.
- **Lácteos y quesos 10 provincias** (2026-07-04): 27 altas en 8 provincias —
  ✅ doc borrado (cerrada; residuales = 22 `parcial` upgradeables y 27 sin
  imagen, ya anotados en la memoria de esa pasada).
- **Madrid heladerías** (2026-07-03): 9 altas — doc vivo (`madrid.md`), quedan
  10 pendientes de filtro estricto.
- **do-huecos.md** (fase A, ledger de descubrimiento): ⚑ cerrada y traspasada
  aquí el 2026-07-10 — ✅ doc borrado; los aprendizajes viven en el README.

## Residuales heredados de docs borrados (2026-07-13)

- **Cuenca** — posible alta aparte: **Lacto-Ganadera Río Mayor, S.L.** (marca
  «Ciudad de Huete», <https://quesoshuete.com/>, tel. 969 371 041, tienda
  online) si se confirma unidad productiva distinta de la S.A.T. Río Mayor de
  Caracenilla (`lacto-ganadera-rio-mayor-quesos-la-ermita-huete`).
- **Albacete** — `quesos-vega-sotuelamos-chinchilla-de-montearagon`: el CSV usa
  `vegamancha.com`, el consejo publica `vegasotuelamos.com` (casi vacía);
  confirmar cuál vive y si «Vega Mancha» es su marca. Además 2 filas DOP con
  `Venta online=sí` sin canal (`don-eusebio`, `vega-sotuelamos`) → pasada
  «completar verificados + VO».
- **Soria** — 7 filas de `soria.csv` no aparecen en el registro DO Ribera
  (¿otra razón social o Vinos de la Tierra?): `vinedos-y-bodegas-gormaz-*`,
  `dominio-de-es-*`, `vino-taruguin-*`, `bodegas-senorio-de-aldea-*`,
  `bodega-aranda-de-vries-ines`, `monte-pinos-almazan`, `pressumia-olvega`.
  Revisión aparte, no urgente.
- **Pontevedra** — 2 pistas de fase A sin resolver concello/web: *Embruxo
  Pontevedra* (Aceite Embruxo) y *Rafael González Goyanes* (Chocolates Castelo
  do Sobroso, probable Ponteareas). También listadas en el corte 2 de
  `festa-do-queixo.md`.
- **Tarragona** — 2 pendientes del histórico Rutes del Vi: **Mas de la Creu**
  (Celler Vidbertus, real; municipio por fijar — l'Espluga vs Barberà de la
  Conca, resolver vía `masdelacreu.com` antes de crear fila) y **Gason Expert**
  (= Bodegas Totó Marqués, municipio/web no fiables). Dudoso encaje: *Unió
  Fruits SCCL* (coop de fruta, dup-of `cellers-unio-reus`).
- **Toledo** — las 3 queserías Manchego diferidas de `cuenca.md` se movieron a
  `toledo.md` (sección propia).

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

Tamaño objetivo **~10-12 candidatos por lote** (bajado desde 12-16 tras la ronda
0: cada bodega/almazara cuesta ~3 fetches —identidad+actividad, checkout,
municipio— más geocodificación, y ~⅔ de las notas de fase A traen algún dato
erróneo o una decisión no anticipada, así que no se pueden integrar en bloque).
Los cortes exactos se deciden al abrir cada provincia. Estados: `pendiente` /
`en curso` / `hecho (fecha, conteos)`.

**Reglas de orden (ronda 0 → aprendizaje):**
- **Barato antes que voluminoso.** Priorizar ficheros con alta tasa de web
  propia (verificación rápida, más `verificado`) y las provincias que cierran
  fichero. El volumen puro es mal criterio de arranque.
- **Trampas al final.** Los ficheros con muchos ⚠ (grupos sin resolver,
  municipios «a confirmar») van después, con más oficio acumulado.
- **Separar «con web» de «sin web» dentro de cada provincia.** Los candidatos
  sin rastro digital caen casi siempre en `parcial` con solo contacto; agruparlos
  en el **último lote** de su provincia (o diferirlos) en vez de repartirlos.
- **Vigilar el equilibrio de categorías del CSV destino** antes de volcar una DO
  entera: ver la nota de Ourense en la ronda 1.

### Ronda 0 — pilotos y ficheros pequeños (cierran fichero)

| Orden | Provincia | Alcance | Abiertos | Lotes | Estado |
|---|---|---|---|---|---|
| 0.1 | Cuenca | DOP Manchego: 3 altas + 7 correcciones a filas existentes | 3 | 1 | hecho (2026-07-10): 3 altas, 7 corr., 1 merge |
| 0.2 | Pontevedra | Festa do Queixo: Leite Ulla | 1 | 1 | hecho (2026-07-10): 1 alta |
| 0.3 | Soria | Ribera del Duero soriana (2 con pista VO=sí) | 4 | 1 | hecho (2026-07-10): 4 altas, 3 munic. corregidos |
| 0.4 | Albacete | queserías DOP Manchego (fichero `albacete.md` creado) | 2→1 | 1 | hecho (2026-07-10): 1 alta, 4 rechazos, 2 corr. |
| 0.5 | A Coruña | 2 DOP + 5 Festa do Queixo | 7 | 1 | hecho (2026-07-10): 7 altas |

**Ronda 0 cerrada** (2026-07-10): 16 altas, 9 correcciones, 4 rechazos, 1 merge.
Residual de la ronda: `alimentos-ruta-xacobea-o-pino` (⚠ Grupo TGT) sigue **sin
revisar** — es una decisión de purga/mantener sobre una fila existente, no un
candidato; va a la 2ª pasada junto con los 3 queixeiros «sin rastro digital» de
la zona C de la feria (`a-coruna.md`).

### Ronda 1 — reordenada 2026-07-10 (barato→caro, no por volumen)

Orden anterior era Ourense→Córdoba→Tenerife (por volumen). Reordenada a
**Tenerife→Ourense→Córdoba**: Tenerife tiene 30/31 con web y cierra fichero;
Córdoba concentra las trampas (19 bloques con ⚠, grupo Pérez Barquero sin
resolver) → al final.

| Orden | Provincia | Alcance | Abiertos | Lotes | Estado |
|---|---|---|---|---|---|
| 1.1 | S.C. Tenerife | **✅ HECHA** (1.1a Tacoronte 9 + 1.1b Orotava/Güímar/Ycoden 12 + 1.1c Abona 4/capital 2 + correcciones): 27 altas, 1 merge (Agüita), 3 diferidas, 1 ya presente (Sotera=Anaga). Fichero cerrado | 31 | 3/3 | hecho (2026-07-10) |
| 1.2 | Ourense | **Ribeiro (39) + Valdeorras (10) + Monterrei l10 (9) + Ribeira Sacra (9) hechos** = 67 altas (+Gaia en fase C). Falta: Monterrei resto l17 (13, solo-tel, baja prioridad). Diferidos: ~16 (incl. Envínate por duplicado con Tenerife). Corrección `pazo-das-tapias` ✅ (fase C: →`pazo-das-tapias-verin`) | 100 | ~7 (7/7 núcleo) | casi |
| 1.3 | Córdoba | **✅ CERRADA**: 1.3a-f = 47 altas (Montilla-Moriles, DOP Baena/Priego/Lucena, Pedroches jamón, registro Montilla). Diferidos documentados: COVAP, La Embajada, Gracia Hermanos, Oleollanos/Montoro-Adamuz DCOOP, 7 del registro Montilla sin web | 65 | 6/6 | hecho (2026-07-10) |

> **Nota de producto — Ourense (1.2):** de los 100 candidatos, 99 son bodegas.
> El CSV está hoy en 75 filas (26 bodegas, 35%); tras integrar quedaría en 175
> con 125 bodegas = **71% del catálogo provincial**. Es fiel a la realidad
> (4 DO, ~300 bodegas inscritas) pero convierte el mapa sin filtrar en una guía
> de vino. Decisión del usuario (2026-07-10): **integrar entera**, priorizando
> por valor de compra (bodega con tienda online antes que ficha de registro).

### Ronda 2 — prioridad 2 del traspaso

| Orden | Provincia | Alcance | Abiertos | Lotes | Estado |
|---|---|---|---|---|---|
| 2.1 | Teruel | **2.1a (7) + 2.1b jamón (9) + 2.1c aceite Bajo Aragón (13) hechos** = 29 altas. Falta: resto jamón secaderos (~5, DNS/redirección) + Melocotón La Arenosa (1). Núcleo cerrado | 51 | ~1 (3/4) | casi |
| 2.2 | Jaén | **2.2a Sierra Mágina (11) + 2.2b Cazorla (7) & Segura (5) hechos** (23 altas). Falta: resto Segura (13, mayoría solo-teléfono/sin web propia). ⚠ homónimos coops «San …», «La Vicaría» y «Ntra. Sra. de la Cabeza» (Huesa≠Campillo) | 38 | ~23 (2/3) | en curso |
| 2.3 | Lugo | **2.3a Prov. (5) + 2.3b RS corte 1 (11) + 2.3c RS corte 2 (10) hechos** = 26 altas. Núcleo cerrado; queda solo la cola de ~23 micro-colleiteiros de nombre personal sin web (nota «corte 2» del doc). Diferidos: Fusco/Finca Cuarta≈prior-de-panton, CastroCandaz≈virxen-dos-remedios, Finca A Figueira (concello?), Maruxas→a-coruna; corrección `torre-de-nunez-o-corgo` | 30 | ~0 (3/3) | ✅ núcleo |
| 2.4 | Huelva | **2.4a Jabugo (12) + 2.4b Condado (13) + 2.4c Jabugo corte2 (3) hechos** = 18 altas (15 verif —7 VO=sí— + 3 parcial), 3 rechazos/dups, 9 diferidos. Falta: solo coops Condado sin web (confirmar granel). ✅ Jabugo cerrado | 28 | ~0 | ✅ núcleo |
| 2.5 | Navarra | **2.5a/b/c hechos** (Ribera 10 + Tierra Estella 9 + Baja Montaña 6) = **25 altas** (14 verif —11 VO=sí— + 11 parcial; 1 diferida Ontañón→Rioja). **Corte INTIA cerrado.** Quedan cortes siguientes del doc (grupos grandes, sin web, post-2023) + correcciones `mendiko-aibar-oibar`/`bodega-otazu-otazu` | 26 | ~0 (3/3) | ✅ núcleo |
| 2.6 | Zaragoza | **2.6a Bajo Aragón (8) + 2.6b Cariñena (9) + 2.6c Borja & Calatayud (8) hechos** = 18 altas (10 verif —2 con VO=sí— + 8 parcial), 2 rechazos, 5 diferidos (2 B2B Bajo Aragón + 3 coops sin web Borja). **Fichero cerrado salvo diferidos** | 25 | 0 (3/3) | ✅ núcleo |
| 2.7 | Valencia | **2.7a Utiel-Requena (14) + 2.7b Arroz de Valencia (4) hechos** = 16 altas (8 verif —3 VO=sí— + 8 parcial; diferidas BVC≈Coviñas, Sentencia). Falta: Utiel-Requena sin web (7) → corte 3 | 25 | ~1 (2/3) | en curso |

### Ronda 3 — prioridad 3 del traspaso

| Orden | Provincia | Alcance | Abiertos | Lotes | Estado |
|---|---|---|---|---|---|
| 3.1 | Toledo | **3.1a aceite (11) + 3.1b queserías Manchego (4) hechos** = 15 altas (13 verif —9 VO=sí— + 2 parcial; diferidas IFAMA + 3 queserías sin web + 7 coops aceite sin web). Falta: aceite sin web + 3 queserías sin web | 19+? | ~1 (2/3) | en curso |
| 3.2 | Ciudad Real | **3.2a aceite (2) + 3.2b queserías Manchego (2) hechos** = 4 altas (3 verif —3 VO=sí— + 1 parcial). Queserías: 2 altas (Iniesta, Cabrera); las otras 3 ya en CSV (La Gaitana, Aldonza&Don Ismael, Rocinante). 5 Campo de Montiel descartadas + 3 provinciales diferidas | 10+? | ~0 (2/2) | ✅ núcleo |

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

- 2026-07-13 — **Fase C, lote 15 — Ourense, DO Ribeiro corte 3 (3er lote, 3 altas
  parcial)**: *Adega O Veleiro* (Cenlle/Laias), *Javier Estévez Abeledo* (Beade,
  vinos naturales), *Viña do Penedo S.L.* (Leiro) — ya sin web, solo registro con
  contacto. **Corte 3 agotado en su contenido útil (17 altas, lotes 13-15)**; el
  resto son colleiteiros solo-registro sin web ni contacto → diferidos (no padear).
  Gates verdes 0/0.
- 2026-07-13 — **Fase C, lote 14 — Ourense, DO Ribeiro corte 3 (2º lote, 7 altas)**:
  5 `verificado` con web (*Adegas do Rexurdir*/Cenlle, *Xulia Bande-Son de Arrieiro*/
  Leiro, *Agás do Tempo*/Ribadavia —tienda, VO=sí—, *Fernando Cibeira*/Beade,
  *Bodegas Gómez Sanmartín-Bodegosa*/Castrelo de Miño) + 2 `parcial` (*Viña
  Carpazal*/Cenlle, *Emilio Docampo Diéguez*/Ribadavia —⚠ distinto de Bodegas
  Docampo S.A. ya en CSV—). Corte 3 acumula 14 altas (lotes 13+14); ~20
  colleiteiros por triar. Gates verdes 0/0.
- 2026-07-13 — **Fase C, lote 13 — Ourense, DO Ribeiro corte 3 (7 altas)**: 3
  `verificado` (*Adegas Laudes*/Cenlle-Esposende —web—; *Casal do Canteiro*/Castrelo
  de Miño —web+tienda VO=sí—; *Adega César García*/Ribadavia-Ventosela —1930,
  fundadora DO, tienda VO=sí—) + 4 `parcial` (*Adega do Moucho* —Oro Decanter 2017—,
  *Arco da Vella/A Adega de Eladio*/Beade, *Adega do Cesteiro*/Toén-Puga, *Adegas
  Cenlle*; solo registro del consejo). El corte 3 (~34 «sin dominio») abre con
  buen rendimiento: la etiqueta seguía siendo incompleta. Quedan ~27 colleiteiros
  por triar. Gates verdes 0/0.
- 2026-07-13 — **Fase C, lote 12 — Ourense, DO Monterrei resto (8 altas)**: 3
  `verificado` con web propia (*Quinta Soutullo*/Oímbra, *Vinos Lara*/Verín-Cabreiróa,
  *Serra de Alén*/Verín-Feces de Abaixo) + 5 `parcial` (*Terra de Godello* —cert.
  2025—, *Madrevella*/Tamagos, *Couto Mixto* —Xico de Mandín, Parker—, *Ramón
  Bigotes* —2023—, *Valderello*/Monterrei; solo registro del consejo). Municipios
  resueltos: casi todos parroquias de **Verín** (Cabreiróa, Feces de Abaixo,
  Tamagos, Mandín, Mourazos); Oímbra para Quinta Soutullo/Terra de Godello;
  Monterrei para Valderello. **Diferidas**: Daniel Fernández, Abeledos, Manuel
  Vázquez Losada (sin rastro); Minius (marca de Valmiñor); Tapias Mariñán (posible
  dup con Pazo das Tapias). Gates verdes 0/0. Con esto **Monterrei queda cerrada**.
- 2026-07-13 — **Fase C, lote 11 — Navarra, DO Navarra «sin web INTIA» (6 altas,
  TODAS verificado)** — desmiente la señal de agotamiento del lote 10: la etiqueta
  «sin web» del registro INTIA vuelve a ser falsa, las 6 tienen web propia:
  *Navarrsotillo* (Andosilla, biodinámico Demeter, leída en vivo) · *Anton Agirre/
  Ubeta* (Ablitas, garnacha eco) · *Coduvina/Dominio de Milagro* (Milagro, 150 ha) ·
  *Bodegas Aguirre* (Falces, años 30) · *Viña Palacios* (Olite) · *Monasterio de la
  Oliva* (Carcastillo, cisterciense). Todas VO=nc (ninguna con carrito propio
  confirmado). **Diferida**: *Raúl Pérez Cía. de Vinos* (San Martín de Unx) — web
  en obras, identidad de producción navarra vs registro fiscal del enólogo del
  Bierzo sin aclarar. Quedan las coops sin web (Artajona, Ángel de la Guarda,
  San Cristóbal, Iturgaiz, San Miguel=alias Eslava). Gates verdes 0/0.
- 2026-07-13 — **Fase C, lote 10 — Huelva, DO Condado bodegas sin web (4 altas
  parcial)**: bodegas familiares reales de Bollullos con vino embotellado,
  confirmadas por el registro del consejo/Ruta del Vino pero sin web propia legible:
  *Bodegas Acosta* (1922; dominio DNS caído), *Bodegas Villarán* (A. Villarán S.A.),
  *José y Miguel Martín, S.L.*, *Bodegas Juncales* (1946). **Descartes**: *López
  Cuesta*=Contreras Ruiz (ya en CSV); *Vitivinícola Manzanillera* diferida (granel/
  mosto dominante); *Camacho*/*Escolar* no localizadas; ⚠ *Virgen de España*(Beas)=
  Olibeas y *Santa María Salomé*(Bonares) son coops de **aceite**, no bodegas.
  **Aprendizaje**: el Condado es región de granel/mosto → rendimiento bajo (mucho
  descarte, altas finas). Gates verdes (las 2 warnings de calidad son filas
  preexistentes). **Señal de agotamiento del pool**: a partir de aquí las colas
  restantes (Navarra INTIA sin web, Ourense Monterrei solo-tel, coops granel) son
  cada vez más finas.
- 2026-07-13 — **Fase C, lote 9 — Jaén, DOP Sierra de Segura corte final (5 altas)**:
  2 `verificado` VO=sí (*Agrosegura*/Agrolea —tienda propia, la mayor coop de la
  comarca; *San Isidro de Siles*/El Puntal de Siles —tienda propia) + 3 `parcial`
  (*San Isidro Labrador*/Benatae, *San Juan Bautista*/Puente de Génave, *San
  Bartolomé*/Villarrodrigo —solo registro). ⚠ **Dedup evitado**: la coop «Ntra.
  Sra. de la Asunción» está **absorbida en Agrosegura** (fusión de 1998) → no se
  crea fila. **Sierra de Segura queda esencialmente cerrada** (lotes 8+9 = 13
  altas); residuales sin verificar: Milagros, Nazaret/Chiclana, Gutamarta.
  Homónimos «San Isidro» resueltos por municipio (Benatae/Siles ≠ Huelma). Gates
  verdes.
- 2026-07-13 — **Fase C, lote 8 — Jaén, DOP Sierra de Segura «resto sin web» (8
  altas, TODAS verificado)** — lote de alto rendimiento inesperado: **5 con VO=sí
  ecommerce** (Oleofer/Tierras de Tavara, San Juan de la Cruz/Orobeas, San Marcos/
  Natao, Santa Teresa/Aceibes, San Francisco/Arroyo del Ojanco) + **3 VO=nc**
  (El Carrascal S.A., La Vicaría, Virgen del Campo/Génave). **Aprendizaje clave**:
  la etiqueta «sin web/solo-teléfono» de fase A era falsa — casi todas tienen marca
  y tienda propias; **ser socia de Olivar de Segura (2º grado) NO impide la venta
  directa con marca propia** (revisar el supuesto de maquila 1-a-1, no excluir en
  bloque). Homónimos resueltos por municipio: San Marcos Beas≠Torres; San Francisco
  Arroyo≠Begíjar/Mancha Real; La Vicaría almazara≠quesería; Virgen del Campo Génave≠
  Sierra de Génave≠Chorro de Oro/Torres. Validadas 2 tiendas en vivo (Aceibes, Natao)
  → patrón confirmado. Gates verdes (la 1 warning de calidad es fila preexistente).
- 2026-07-13 — **Fase C, lote 7 — Toledo, coops aceite DOP Montes de Toledo «sin
  web» (7 altas)**: **3 verificado** — *San Sebastián de Belvís* (VO=sí ecommerce,
  tienda propia) · *San Sebastián de El Romeral* (VO=sí ecommerce, marca Sierra de
  El Romeral) · *Jaramontes/Sierranava* (web viva, VO=nc, tienda en dominio aparte).
  **4 parcial** (solo registro del consejo): *San Sebastián de Pusa* (Santa Ana de
  Pusa) · *Oleícola Montes de Toledo* (Mazarambroz) · *Olivar del Cristo*
  (Villamuelas) · *Antigua de Los Navalmorales* (⚠ homónima distinta de la Antigua
  de Mora ya en CSV; **Olimora es de la de Mora**, no de esta). Aprendizaje: la
  etiqueta «sin web» de fase A estaba incompleta — 3 de 7 sí tenían web/tienda al
  buscarlas. Las 3 queserías Manchego toledanas siguen diferidas (necesitan releer
  `categories` del registro, estructura cambiada). Gates verdes (contrato 0/0,
  calidad 0 warnings, evidencia 0 issues).
- 2026-07-13 — **Fase C, lote 6 — Valencia, DO Utiel-Requena cola «sin web» + corte 2
  (7 altas)**: **4 verificado** — *Sentencia* (Los Pedrones, VO=sí ecommerce con
  checkout confirmado) · *Mitos* (El Azagador, web viva, confirma actividad que el
  registro dudaba) · *Lupanda* (boutique Requena) · [*Pigar* resultó
  **already-present** → no fila]. **4 parcial** (solo registro/FB, sin web propia
  legible): *Carlos Cárcel* (Rebollar, ⚠ distinta de Ernesto Cárcel/Cárcel de Corpa
  ya en CSV) · *Palmera* (Utiel) · *Bru & JL* (⚠ municipio corregido a **Caudete de
  las Fuentes**, no Utiel) · *Escuadra* (Los Isidros). **Rechazado**: *BVC Bodegas*
  — confirmada independiente de Coviñas, pero es el brazo español del négociant
  francés Calvet (B2B/export, sin marca km0) → no fila. ⚠ **Dedup fallido**: Pigar
  ya existía y el `grep -c` no lo delató (solo conté, no listé las líneas) → lo
  pilló el gate de slug duplicado; fila+evidencia retiradas. Geo-warnings de
  Sentencia (17 km) y Escuadra (18 km) son **esperados** (pedanías lejanas de la
  enorme Requena), no defectos. Gates verdes (contrato 0/0, evidencia 0 issues).
- 2026-07-13 — **Fase C, lote 5 — Lugo, diferidos 1-a-1 (1 alta + 2 resueltos
  sin fila)**: *Finca A Figueira* → `finca-a-figueira-chantada` (`parcial` — el
  consejo la sitúa en San Fiz de Asma, **Chantada (Lugo)**; la duda del prefijo
  986 era el teléfono del titular; 1,65 ha/4.000 kg, coords del consejo a 4,3 km
  del centroide). *Fusco/Finca Cuarta* (Rubén Moure) → **already-present** =
  `prior-de-panton-panton` (la marca nació con esa bodega, misma unidad
  productiva, ~380.000 L hoy). *Bodegas CastroCandaz* → **no fila**: proyecto
  Raúl Pérez/Rodrigo Méndez sin bodega propia estable; la marca ya está en
  `adega-virxen-dos-remedios-o-savinao` (atribución del registro del consejo) →
  fila propia = marca duplicada. Con esto **la cola de diferidos de Lugo queda
  resuelta** (ED V 2015 sigue descartado por marca/identidad finas). Gates verdes.
- 2026-07-13 — **Fase C, lote 4 — Ciudad Real, pasada provincial Campo de
  Calatrava (3 altas + 1 upgrade)** — **cierra el fichero**: *Olivapalacios* →
  `olivapalacios-palacio-de-los-olivos-almagro` (`verificado`, VO=sí — ⚠ municipio
  corregido a **Almagro**, finca Los Palacios/CM-4107; la nota decía Bolaños; nº1
  EVOO World Ranking picual) · *Pago Piedrabuena* →
  `pago-piedrabuena-ballesteros-de-calatrava` (`parcial` — web con 403 técnico) ·
  *COLIVAL* → `colival-valdepenas` (`verificado`, VO=sí — resuelto el ⚠: la coop
  tiene marcas de consumo propias Valdenvero/Sierra Prieta y tienda operativa).
  **Upgrade**: *Cooperativa El Progreso* (Villarrubia de los Ojos) — fila legacy
  `pendiente` con web-directorio (apoloybaco) → web real `bodegaselprogreso.com`
  (vino Viña Xétar + AOVE DOP Montes de Toledo, tienda con checkout), categoría
  **«Aceite y bodega»**, `verificado` VO=sí. Gates verdes (las 3 warnings de
  calidad son filas preexistentes, anotadas en el doc). **Ciudad Real cerrada del
  todo**: 8 altas acumuladas (4 fase B + 3 fase C) + 1 upgrade.
- 2026-07-13 — **Fase C, lote 3 — correcciones Galicia (2 filas, 2 merges)**:
  *Adega Pazo das Tapias*: slug `pazo-das-tapias-monterrei` →
  **`pazo-das-tapias-verin`** — la finca As Tapias está en **Pazos, parroquia de
  Verín** (ficha del consejo DO Monterrei, CP 32619; mismo patrón que Valdeconde→
  Mourazos); web propia asignada (`pazodastapias.com`, en vez del dominio de la
  matriz `pazodomar.com`), pero el dominio tiene **bucle de redirección https↔http**
  → no legible en vivo, sube solo a `parcial` (desde `pendiente`). *Torre de
  Núñez*: slug `torre-de-nunez-o-corgo` → **`torre-de-nunez-lugo`** — la planta
  principal y sede (Torre de Núñez de Conturiz, S.L.) está en **Conturiz, concello
  de Lugo** (la dirección del CSV ya lo decía, mal etiquetada como O Corgo, donde
  está la 2ª planta); tienda online con checkout leída en vivo → **`verificado`,
  VO=sí ecommerce** (desde `pendiente`). Familiar 2ª gen (~130 empl.), no gran
  grupo de masa → se mantiene. Ambos con registro `merge` + imagen `.webp`
  renombrada. Gates verdes; las 2 warnings de calidad de Lugo son filas
  preexistentes (Mel Casa Miranda, A Carqueixa — anotadas en `lugo.md` para 2ª
  pasada). **Correcciones señaladas por las pasadas: todas resueltas** (Navarra 3 +
  Galicia 2).
- 2026-07-13 — **Fase C, lote 2 — correcciones a filas existentes (Navarra, 3)**:
  no son altas, son fixes de las señaladas por la pasada INTIA. *Bodega Mendiko*
  (`mendiko-aibar-oibar`): categoría **Aceite → «Aceite y vino»** (es bodega
  ecológica de vino que también hace aceite, confirmado por su web en vivo), sube a
  **verificado**. *Bodega Otazu* (`bodega-otazu-otazu`): municipio **Otazu →
  Etxauri** (concejo de Etxauri; D.O.P. Pago de Otazu; coords a ~1 km del centroide).
  *Bodegas Lezaun* (`bodegas-lezaun-lacar-lakar`): municipio **«Lácar / Lakar» →
  Yerri** (Lácar es concejo del valle de Yerri; coords a ~6 km del centroide).
  Slugs sin cambiar (sin merges/renombres). Evidencia actualizada (3 keep). Gates
  verdes (contrato 0/0, calidad 0/0, evidencia 0 issues). Pendientes similares en
  otras provincias: Ourense `pazo-das-tapias-monterrei` (web propia), Lugo
  `torre-de-nunez-o-corgo` (municipio Conturiz/Lugo + VO).
- 2026-07-13 — **Fase C, lote 1 «último oro con web» (parte 2: Tenerife)**: 14
  altas (**6 verificado, 3 con VO=sí ecommerce; 8 parcial**). **5 de DO
  Tacoronte-Acentejo/Abona**: Hacienda de Acentejo (verif) y La Baldesa (verif,
  desde 1959) con web legible; Riaba, Finca Vegas y Tierras de Aponte `parcial`
  (webs JS/en construcción). **Correcciones de municipio**: Riaba = La Victoria de
  Acentejo (no Tacoronte); *Risco de las Vegas* = razón social **extinguida**, hoy
  **Finca Vegas** en **Granadilla de Abona** (no Arona). **9 de DOP Islas
  Canarias**: **Bodegas Ferrera** (Arafo, eco+cerveza, VO=sí) y **Piedra Fluida**
  (La Orotava, viñedo más alto de Europa, VO=sí) con tienda operativa; Pago de los
  Cercados, Finca El Ancón (⚠ homónimo con la quesería El Ancón de Tacoronte →
  slug `bodega-finca-el-ancon-la-orotava`), Alejandro Gallo & Quíquere y Atrevino
  `verificado` sin tienda; Tabares4 (tel +32, perfil négociant), Vinos 1861 y
  Mataznos 33 (sin web propia) `parcial`. Gates verdes (contrato 0/0, evidencia 0
  issues; la única warning de calidad es una fila preexistente de La Palma).
  **Fin del lote 1** (18 altas totales: 4 en 1a + 14 aquí).
- 2026-07-13 — **Fase C, lote 1 «último oro con web» (parte 1: Córdoba + Ourense)**:
  4 altas. **Córdoba (3, aceite de Montoro — leads con tienda del lote 1.3d)**:
  *Aceites Rosán* (`verificado`, VO=sí ecommerce — almazara familiar, tienda
  operativa 3,20-4,70 €) · *Aceites Campolio* (`verificado`, VO=sí ecommerce —
  Industria Aceitera de Montoro S.A./1973, pequeña 0-10 empl., tienda WooCommerce
  por caja: entra por marca+tienda propias, no es gran grupo) · *Lagar de Quirós*
  (`parcial`, VO=no comprobado — almazara de finca real, pero su web
  `molinodequiros.es` tiene el **DNS caído** confirmado por curl → sin verificador
  en vivo). **Ourense (1)**: *Queixería Gaia* (`verificado`, VO=sí ecommerce —
  S. Coop. Galega de Xinzo de Limia, quesos de cabra desde 2020; resuelto que la
  fila es el productor, no la comercializadora Ysabelle). Gates verdes (contrato
  0/0, calidad 0/0, evidencia 0 issues). Falta la parte 2 del lote: Tenerife
  (5 bodegas con web + DOP Islas Canarias ~9).

- 2026-07-12 — **Lote 2.5d — Navarra, DO Navarra certificadas tras 2023 (2)**: 1
  alta (*Bodegas Olimpia*/Cáseda, `verificado` VO n/c — del grupo Vitilia pero
  bodega de terroir con nombre propio, regla de grupos de calidad). **1 excluida**:
  *Doña Isabella* — `donaisabella.es` redirige a `grupomarquesdelatrio.com` → es
  marca del **gran grupo Marqués del Atrio** (ya señalado como excluido en varios
  ficheros). *Hacienda Logos* ya estaba anotada como marca de Bodegas Escudero
  (excluida). **Confirmación del fin del pool de alto valor**: incluso las
  «post-2023 con web» son marcas de grupo; lo que resta en todas las provincias
  son colas de registro sin web/contacto o descartes por grupo/maquila.
- 2026-07-12 — **Lote 2.3d — Lugo, DO Ribeira Sacra micro-colleiteiros (17)**: 17
  altas `parcial` (colleiteiros de nombre personal con marca registrada, sin web;
  coords al centroide del concello —11 en Sober—). Batch de cobertura del corte 2
  del doc: identidad/municipio/marca del registro del consejo, sin verificación web
  (no la tienen). Saltados 4: 3 sin marca (Álvarez Rodríguez, Castro Sesse, Pérez
  Pérez) y ED V 2015 (marca «Fusco» colisiona con Rubén Moure). Con esto **Lugo
  queda esencialmente cerrado** (43 altas en total: 2.3a/b/c/d). Fin del pool de
  alto valor: lo que resta en otras provincias son colas de registro similares.
- 2026-07-12 — **Lote 2.7b — Valencia, DOP Arroz de Valencia (4)**: 4 altas (2
  `verificado` VO n/c: *Arrocerías Antonio Tomás*/Sollana —1962— y *Arroces J.
  Montoro*/Rafelbuñol —1940—, ambas con web propia leída en vivo sin carrito; 2
  `parcial`: *Arroces E. Lozano*/Alginet —1957, sin web— y *Arroces y Cereales/
  ARCESA*/Oliva —industrial, secado en Sueca). El consejo no publica direcciones →
  municipios resueltos por búsqueda (Antonio Tomás=Sollana, Montoro=Rafelbuñol,
  Lozano=Alginet, ARCESA=Oliva). Categoría «Arroz». Excluidas ya anotadas: La
  Fallera (Maicerías) y Herba (Ebro Foods), grandes grupos.
- 2026-07-12 — **Lote 2.4c — Huelva, DOP Jabugo secaderos corte 2 (3)**: 3 altas
  (2 `verificado` VO n/c: *Pedro Parra e Hijos*/MONTJAM-ONOFRE/El Repilado-Jabugo
  —marca propia, entra pese a hacer maquila— y *Enrique Castaño Guijarro*/Cumbres
  Mayores —línea Summun, web punycode `xn--jamonesenriquecastao-m7b.es`, checkout
  no confirmado; 1 `parcial`: *Jamones Benito e Hijos S.L.*/Jabugo —inscrita en la
  DOP pero es del grupo Ibéricos Benito de Arahal/Sevilla —+Guijuelo—, la web es la
  del grupo, no la de esta S.L.). **Jabugo cerrado** (13 altas en 2.4a+2.4c).
- 2026-07-12 — **Lote 3.2b — Ciudad Real, DOP Queso Manchego queserías (2)**: 2
  altas, ambas `verificado` VO=sí ecommerce: *Quesos Iniesta* (Félix Iniesta,
  Herencia) y *Quesos Cabrera* (Cabrera Gallego, Manzanares, +90 años). Las otras
  3 candidatas del §Pistas **ya estaban en el CSV** (dedup: *Ricardo Corrales* =
  `quesos-la-gaitana-herencia`, *Aldonza y Don Ismael* = fila de Piedrabuena,
  *Rocinante* = fila de Malagón, que además cae por grupo). **Ciudad Real cerrada**
  (3.2a+3.2b): 4 altas.
- 2026-07-12 — **Lote 3.1b — Toledo, DOP Queso Manchego queserías (4)**: 4 altas,
  todas `verificado` (3 con VO=sí ecommerce: Quesos El Consuelo/S.A.T. La Cañada
  Real Soriana/Madridejos —ganadería 1938—, Quesos Barrajón/Quintanar de la Orden
  y Gallego Sanz/Villanueva de Alcardete —1955—; + Pérez Arquero/Ocaña, VO n/c —web
  informativa). Verificadas por su propia web (más fiable que el campo `categories`
  del registro). **Método**: el array `places` del registro Manchego ya **no viene
  en `content.rendered`** de `/wp-json/wp/v2/pages/10148` (estructura cambiada
  desde el 2026-07-09) → se usó la lista ya capturada en `cuenca.md` §Pistas + web
  propia. El `/wp-json` da 301→`-L`. **Homónimo**: Ocaña (Almería/Toledo) resuelto
  por el override, coords fijadas a Ocaña/Toledo. **3 diferidas** sin web (Reino/
  Madridejos, Martal/El Toboso —«Industrias Alimentarias», posible madurador—,
  Palomares/La Puebla de Almoradiel): falta releer `categories` (elaborador vs
  madurador) del registro.
- 2026-07-12 — **Lote 3.2a — Ciudad Real, DOP Montes de Toledo parte CR (2)**: 2
  altas (1 `verificado` VO=sí: *Dehesa El Molinillo*/Retuerta del Bullaque —Nortia
  Agricultural, marcas El Molinillo/Navalices, tienda propia; el ⚠ «grupo
  inversor» se resuelve: vende producto propio; 1 `parcial`: *Aceites Moraga*/
  Judisan/Fuente el Fresno —hosting suspendido, venta directa en almazara,
  confirmada por el consejo). **5 descartadas por regla dura maquila/B2B**: las
  cooperativas de Campo de Montiel (San Gregorio/Almedina, San Bartolomé/Santa
  Cruz de los Cáñamos, San José/Villamanrique, San Isidro Labrador/Villanueva de
  la Fuente, Olivarera San Isidro/Torrenueva) muelen para el socio pero su aceite
  lo comercializa la coop de 2º grado ya en CSV, sin marca ni venta propia. **3
  diferidas** (Olivapalacios, Pago Piedrabuena, COLIVAL) por ser de Campo de
  Calatrava, fuera de las dos DOP del lote → pasada provincial. Nuevo
  `ciudad-real.jsonl`. Homónimos «San Gregorio»/«San Isidro» ya en CSV (otros
  municipios) confirmados en el dedup, como avisaba el doc.
- 2026-07-12 — **Lote 3.1a — Toledo, DOP Montes de Toledo aceite con web (12)**:
  11 altas (9 `verificado`, 6 con VO=sí ecommerce: Aceites Consuegra, Toletum/
  Nambroca, Tesoro de Guarrazar/Guadamur, Las Saleras/Los Navalucillos, Óleo
  Quirós/Mascaraque —premiada— y Al Alma del Olivo/La Guardia; + El Paraíso/Gálvez,
  COTOAL/El Carpio —tienda en mantenimiento— y Aceites Toledo/Los Yébenes, VO n/c;
  2 `parcial`: Umbrión/Madridejos y La Olivarera/Los Navalmorales, web caída/cert).
  Otro lote de aceite DOP de alto rendimiento (cornicabra, casi todas con tienda).
  **1 diferida**: *IFAMA* — su web es la del grupo Arzuaga Navarro (Ribera del
  Duero), sin identidad ni tienda de AOVE Toledo. **Correcciones de municipio**:
  *Al Alma del Olivo* está en **La Guardia** (finca El Torrao), no Sonseca —
  homónimo La Guardia (Jaén/Toledo) resuelto por el override; *Aceites Toledo* es
  empresa independiente desde 1954, no brazo comercial de la coop de Mora.
- 2026-07-12 — **Lote 2.7a — Valencia, DO Utiel-Requena embotelladoras con web
  (14)**: 12 altas (6 `verificado`, 3 con VO=sí ecommerce: Iranzo/Caudete —eco sin
  sulfitos—, De Noemí/Fuenterrobles, Emilio Clemente/Requena; + Carré/Requena,
  Casas de Moya/Utiel —checkout no operativo— y Latorre/Venta del Moro, VO n/c; 6
  `parcial` con web caída/bloqueada —403/401/cert/DNS/parked—: Cárcel de Corpa,
  Castaro, Ladrón de Lunas, Sebirán, Pedro Moreno 1940, Dagón, confirmadas por el
  registro de embotelladoras certificadas). **2 diferidas**: *BVC Bodegas*
  comparte teléfono con Coviñas (coop enorme) → confirmar independencia; *Sentencia*
  no verificada aún. Correcciones de web: Noemí→denoemi.com, Latorre→
  bodegaslatorre.com. El resto (7 sin web + 4 de arroz sin dirección) va al corte 2.
- 2026-07-12 — **Lote 2.5c — Navarra, DO Navarra Baja Montaña (6)**: 6 altas (4
  `verificado`, 3 con VO=sí ecommerce: Unsi/Olite —garnacha de montaña de Gonzalo
  Celayeta—, Bodegas San Martín/San Martín de Unx —coop de 1914— y Ayerra/San
  Martín de Unx; + Aroa Bodegas —Zurukoain/valle de Yerri, ecológica-biodinámica,
  sin carrito, VO n/c; 2 `parcial`: Lúculo/Mendigorría —web 404— y Asensio/Sesma
  —web 403—). Aroa: municipio administrativo = **Yerri** (Zurukoain es concejo, no
  está en municipios.json); coords al centroide de Yerri. **Navarra INTIA cerrada:
  25 altas en 3 lotes.**
- 2026-07-12 — **Lote 2.5b — Navarra, DO Navarra Tierra Estella/Valdizarbe (9)**:
  9 altas (3 `verificado`: Alconde/Lerín y Valcarlos/Los Arcos —ambas VO=sí
  ecommerce—, y Coop La Cruz/Belardi/Mañeru —VO n/c—; 6 `parcial` porque su web
  está caída, repurposada o mal configurada: Vinecultor/Laderas de Montejurra
  —dominio ahora es una revista digital—, Armendáriz —404—, Viña Valdorba, Macaya
  —cert caducado—, Ozalder —no legible— y Fernández de Arcaya —cert mal—,
  confirmadas por INTIA). Confirmada la corrección: **Ozalder está en Larraga**
  (INTIA), no Lerín. *Valcarlos* es de Grupo Faustino pero se integra (bodega de
  terroir de grupo de calidad, no industrial-masa). Patrón del corte: las bodegas
  cooperativas más viejas de Tierra Estella tienen la web muerta pero siguen
  certificadas → parcial legítimo por registro.
- 2026-07-12 — **Lote 2.5a — Navarra, DO Navarra bodegas Ribera Baja/Alta (11)**:
  10 altas (7 `verificado` con web propia leída en vivo, **6 con VO=sí
  ecommerce**: Malón de Echaide/Cascante, Montecierzo/Castejón, Dominio Lasierpe/
  Cintruénigo, Corellanas/Corella, Finca La Cantera/Murchante, Azpea/Lumbier; +
  Viña Magaña/Barillas sin carrito, VO n/c; 3 `parcial` porque su web es una SPA
  o no cargó: Viña Zorzal, Viña Aliaga —ambas Corella— y Valdelares/Cárcar,
  confirmadas por el registro INTIA). **1 diferida**: *Bodegas Ontañón* es
  fundamentalmente riojana (sede en Logroño), solo con bodega inscrita en Navarra
  → fuera de provincia. **Trampa de homónimo**: Nominatim geocodificó «Ctra.
  Tarazona, Cascante» a 205 km, y municipios.json tiene el homónimo *Cascante del
  Río* (Teruel); las coords de Malón de Echaide se fijaron a Cascante/Navarra y el
  audit las validó vía el override. Fuente INTIA = organismo de control (mejor que
  el consejo, que solo publica 27 fichas de enoturismo de ~85 bodegas).
- 2026-07-12 — **Lote 2.4b — Huelva, DO Condado (vino/vinagre/vino naranja,
  13)**: 5 altas (3 `verificado`: Diezmo Nuevo/Moguer —casa de 1770, VO=sí— y
  Marqués de Villalúa/Villalba del Alcor —viñedo de 1495, VO=sí—, ambas con
  tienda propia; Bodegas Díaz/Bollullos —pedidos por teléfono, VO n/c—; 2
  `parcial`: Vinícola Valverdejo/Gibraleón —web caída— y Bodegas Rubio 1893/Luis
  Felipe/La Palma —brandy + vinagre DOP, categoría Licores, portal con age-gate).
  **1 rechazo por dup**: *Bodegas López Cuesta S.A.* es la razón social de
  **Bodegas Contreras Ruiz** (ya en CSV) — mismas marcas Édalo/Villa Barredero/
  Vallehondo y tel 959416426. **7 diferidos** (bodegas/coops de Bollullos/Almonte/
  Manzanilla sin web ni marca de consumo confirmada: Villarán, Camacho, Acosta,
  Juncales, José y Miguel Martín, Escolar, Manzanillera → confirmar marca vs
  granel). Dudas ya anotadas sin tocar (Doñana≈Privilegio, Espina≈Sauci, Clemente
  Neble extinguida). Con esto Huelva queda cerrada salvo el corte 2 de Jabugo.
- 2026-07-12 — **Lote 2.4a — Huelva, DOP Jabugo secaderos corte 1 (12)**: **10
  altas, TODAS `verificado` + VO=sí ecommerce** — el lote de mayor rendimiento de
  la fase: secaderos familiares de la DOP Jabugo con tienda online propia leída en
  vivo (Lazo/Cortegana, Sierra Mayor/Corteconcepción, Domecq/Cortegana, Velázquez/
  Aroche, Cortegana Ibérico, Oro Viejo/Higuera, Alba Romero/Cala, Maximiliano/
  Jabugo, Sierra de Jabugo/Jabugo, Olalla/Santa Olalla del Cala). **2 diferidas
  por conflicto de provincia** (patrón Oliflix): *Hermanos Cárdeno* — su web
  (cardeno.es) da Fuentes de León (Badajoz), tel 924, sin reclamar DOP Jabugo; y
  *Miguel y María* — sede/tel en Segovia (921), fábricas en dos provincias.
  **Corrección de municipio**: *Alba Romero* (Los Romeros de Jabugo) está en
  **Cala** (C/ Jabugo 1, 21270), no Jabugo. La corrección pendiente de
  `jamones-tartessos-huelva` se revisó y se deja como está: la fila ya está
  verificada y geolocalizada en su tienda oficial de Huelva (place_id real) con la
  curación en Cumbres Mayores documentada en la descripción; cambiar el municipio
  degradaría a un centroide y rompería el geo-check.
- 2026-07-12 — **Lote 2.3c — Lugo, DO Ribeira Sacra corte 2 (adegas sin web)**:
  10 altas (2 `verificado` con web propia leída en vivo: *Alvaredos-Hobbs*/Quiroga
  —Paul Hobbs, distribución→VO n/c— y *Rectoral de Gundivós*/Sober —oleiro+adega,
  vino en barro Ámboa—; 8 `parcial` confirmadas solo por el registro del consejo:
  Aborixe, Bodega Ribada, Tolo do Xisto, Regal López/Gaela, Albarduxe, Losada
  Fernández, Terrazas de Outeiro, Adegas Salvadur). **2 diferidos nuevos**:
  *Bodegas CastroCandaz* (Quiroga) es el mismo proyecto Raúl Pérez/Rodrigo Méndez
  ya integrado como Virxen dos Remedios (marcas Castro Candaz/Demo/Pazo de Bexán)
  → no duplicar; *Finca A Figueira* tiene el concello sin confirmar y teléfono con
  prefijo 986 (Pontevedra) → verificar provincia. Con esto el **núcleo de Lugo
  queda cerrado** (26 altas en 2.3a/b/c); solo resta la cola de ~23
  micro-colleiteiros de nombre personal sin web.
- 2026-07-12 — **Lote 2.3b — Lugo, DO Ribeira Sacra corte 1 (11 con web)**: 11
  altas (5 `verificado`, **4 con VO=sí ecommerce**: Alouviño, Adegas Amedo,
  Bodega Soutelo y Val da Lenda —todas con carrito propio leído en vivo—; +
  Virxen dos Remedios/O Saviñao, web sin carrito → VO n/c; 6 `parcial`: Saiñas,
  Marcelino, Pincelo, Régoa, Diego de Lemos, Cividade —dominios caídos o con cert
  incorrecto, confirmados por el registro del Consejo Regulador). **Corrección de
  dominio**: la web viva de Soutelo es **bodegasoutelo.com** (Shopify), no el
  `.es` del registro (DNS caído). **Diferido**: *Fusco/Finca Cuarta* (Rubén
  Moure) — la marca «Finca Cuarta» ya está en `prior-de-panton-panton`, mismo
  viñateiro; confirmar titularidad antes de duplicar. Patrón del corte: muchos
  colleiteiros de Ribeira Sacra tienen el dominio del registro muerto pero siguen
  activos en el consejo → parcial legítimo. ⚠ marca «Castro Candaz» compartida
  (Virxen dos Remedios vs Bodegas CastroCandaz de Quiroga, en el corte 2).
- 2026-07-12 — **Lote 2.3a — Lugo, provincia (6)**: 5 altas (2 `verificado` con
  web propia leída en vivo: *Panadería Fraga*/Palas de Rei y *Embutidos
  Hermelino*/O Valadouro —porco celta, 1939—; 3 `parcial` sin web propia,
  documentados por prensa/institución: *As Fadegas* —horta eco de Ribadeo, vende
  en mercado, VO=no—, *Pingas de Gaia* —apicultor de San Simón da Costa/Vilalba—
  y *Céltico*/Muras —porco celta). **Maruxas de Nata redirigida a `a-coruna`**: la
  granja está en Monterroso (Lugo) pero el obrador y la tienda están en San
  Sadurniño (A Coruña) → manda el obrador. Los 3 parcial son filas finas (sin
  web/teléfono) pero productores reales documentados; SondeLugo es marketplace de
  terceros → no sube VO. Nuevo `lugo.jsonl`.
- 2026-07-11 — **Lote 2.6c — Zaragoza, DO Campo de Borja (5) + DO Calatayud
  (3)**: 5 altas (4 `verificado`, de las cuales **2 con VO=sí ecommerce**:
  *La Cerrada/Vinos Atrevidos* —vino natural, Calatayud— y *Esteban Castejón*
  —Ibdes—, ambas con carrito propio leído en vivo; + Vinos del Viento/Cooper
  Cellars/Pozuelo de Aragón y Agustín Cubero/Calatayud, sin carrito; 1 `parcial`:
  *Bodega Picos*/Magallón, web con certificado compartido incorrecto). **3
  diferidos** por ser coops sin web con duda granel/marca propia (Agrícola de
  Borja, Santa Ana Crianzas y Viñedos, Ntra. Sra. Niño Perdido/Tabuenca) → 2ª
  pasada. Corrección: *Agustín Cubero* está hoy en **Calatayud** (Pol. La
  Charluca), aunque nació en Godojos en 1881. **Zaragoza cerrada** salvo esos 3
  diferidos: 18 altas en 3 lotes (2.6a/b/c).
- 2026-07-11 — **Lote 2.6b — Zaragoza, DO Cariñena (9)**: 8 altas (4
  `verificado` con web propia leída en vivo: Familia Navascués, Manuel Moneva,
  Gran Viu/Viñedos y Bodegas Pablo —todas en Almonacid de la Sierra— y Luis Marín
  /Cariñena; 4 `parcial`: IGnius/Sanz Soguero —web con SSL roto—, Heredad Ansón,
  Romeo Yrisarri y Zazurca). **1 rechazo**: *Bodegas Grandes Vinos* es la empresa
  que elabora la marca **Gran Ducay**, ya en el CSV como
  `bodegas-gran-ducay-carinena` → alias. **Corrección de municipio**: *Heredad
  Ansón* está en **Muel**, no Cariñena (su propia web /Localizacion/ y Turismo de
  Zaragoza lo confirman). Todas VO=no comprobado (bodegas con web informativa, sin
  carrito). Método: **npx quedó inservible** (caché de npm corrupta, «File
  exists» en cacache) → los gates se corren con `bash scripts/check-csv-contract.sh`,
  `node scripts/check-images.mjs`, `node scripts/check-evidence.mjs` directamente
  (todos verdes: 50 CSV OK, imágenes OK, evidencia 0 issues).
- 2026-07-11 — **Lote 2.6a — Zaragoza, Aceite del Bajo Aragón + Melocotón de
  Calanda (8)**: 5 altas (2 `verificado`: Granja Brunet/Fabara y La Chipranesca/
  Chiprana, ambas con web propia leída en vivo; 3 `parcial`: Fruma/Maella —web
  fruma.es no cargó por SSL, confirmada por 2 registros DOP + directorio—,
  Compromiso de Caspe y San Sebastián/Fayón —solo-registro DOP, sin web). **1
  rechazo**: *Oliflix* — el registro DOP la listó como Mequinenza (Zaragoza) pero
  su propia web (oliflix.net) sitúa la empresa en **Flix, Tarragona** (C/ Costa
  del Graner, 43750, tel 977) → cross-provincia, va a `tarragona.md`. **2
  diferidos** por B2B sin marca de consumo: *Frutícola Bajoaragonesa* (S.C. de 2º
  grado = central hortofrutícola) y *Frumaspi Agrícola* (sin web ni rastro).
  Aprendizaje: **el registro de un consejo puede ubicar mal a un operador de otra
  provincia** (Oliflix/Flix) — contrastar siempre el municipio con la web propia,
  como con las pedanías. VO=no comprobado por defecto en aceites cuya web es
  informativa (Brunet revende su AOVE en «A tenda do Avó», terceros → no basta).
- 2026-07-11 — **Lote 2.2b — Jaén, DOP Sierra de Cazorla (7) + Sierra de Segura
  (5 con web)**: 12 altas (9 `verificado`+VO=sí ecommerce, 3 `parcial` por fallo
  técnico de la web —cert/403— confirmadas solo por el consejo regulador). Cazorla
  entero (Aceites Cazorla/Azorla, Chilluévar/Cañamares, Aceitex/Sta Julia,
  Rotalaya, Santo Tomás, Guadalentín/Olizumo, Hueoliva) + las 5 de Segura con
  tienda (Oro Tradicional, Sierra de Génave, Chorro de Oro, Cortijo La Zarza, The
  Green Gold/Oh!). ⚠ homónimo resuelto: «Ntra. Sra. de la Cabeza» de **Huesa**
  (`cooperativa-hueoliva-huesa`) ≠ la de Campillo de Arenas del lote 2.2a. Sierra
  de Génave desbloqueada: tiene marca propia (Oro de Génave/Olivero) + tienda, no
  vende solo vía Olivar de Segura. Fuentes de consejo:
  desierracazorla.es/almazaras + dosierradesegura.com. Nota de método: el tipo de
  fuente de evidencia válido es `official-site`, no `store` (el validador lo
  rechaza). Resto de Segura (13, solo-teléfono) queda para un corte posterior.
- 2026-07-10 — **Lote 2.2a — Jaén, DOP Sierra Mágina aceite (13)**: 11 altas (9
  `verificado`+VO=sí, 2 `parcial` por web 500/DNS). Otro bloque de aceite de alto
  rendimiento (cooperativas con marca propia y tienda). Corrección: Oleozumo está
  en Mancha Real, no Bedmar. San Roque y El Torito Bravo ya estaban en el CSV.
- 2026-07-10 — **Lote 2.1c — Teruel, DOP Aceite del Bajo Aragón (15)**: 13 altas
  (5 `verificado`: La Calandina, Mazaleón, Torre Gachero con tienda + Palacio de
  Andilla y Marchenica con web; 8 `parcial`: cooperativas del Matarraña sin web
  propia). La Masada Roya ya estaba en el CSV. Filtrado a solo Teruel (10
  empresas de aceite de la DOP están en Zaragoza — Belchite/Caspe/Fabara/Fayón/
  Maella — que van a `zaragoza.md`). Doble DOP (aceite+melocotón de Calanda)
  anotada en La Calandina y Marchenica.
- 2026-07-10 — **Lote 2.1b — Teruel, DOP Jamón secaderos (21)**: 9 altas (7
  `verificado`+VO=sí: Josanz, Casa Domingo, Casa Vieja, Peñarroya, Pastor, El
  Rullo, La Monrealense; 2 `parcial`: El Calamochino y Sierra de Mora por web
  caída/en obras). **El registro «Nuestra Gente» del consejo trae mucho ruido de
  terceros**: rechazados Torico de Teruel (Valls, Tarragona), Bodegas Gargallo
  (comercializador de Valencia), Campodulce (industria sin DOP Teruel), Fuenjamón
  (bar). Diferidos por DNS/redirección: JAELCA, Barriendo, Carbó. Pendientes ~5.
- 2026-07-10 — **Lote 2.1a — Teruel, capital + provincia (jamón/trufa/cerveza)**:
  7 altas (6 `verificado` + 1 `parcial`; VO=sí en Rokelin, La Chaparra, De Trufa
  en Trufa, Jamón Mudéjar). ⚠ grupo resuelto: Elaborados Las Torres = Jamón Mudéjar
  (misma empresa → 1 fila). Rechazos: Ordio Minero (produce en Zaragoza→otra
  provincia), Jamones Albarracín (maquila B2B sin marca de consumo); La Tartuferia
  diferida (comercializadora). Arranca ronda 2. Evidencia `aragon/teruel.jsonl`
  creada.
- 2026-07-10 — **Lote 1.3f — Córdoba, registro Montilla sin web (14)**: 6 altas
  (4 `verificado`+VO=sí: Navarro 1830, Del Pino, Galán Portero, Luque 1920; 2
  `parcial`: El Gallo, Bonilla). Muchas del registro «sin web» sí la tienen
  (Navarro, Del Pino, Galán Portero, Luque, El Gallo) — buscar el dominio antes
  de dar por perdida. Gracia Hermanos diferida (grupo Pérez Barquero). 7 sin
  web/municipio fiable diferidas (Único, Sillero, El Pujío, Maillo, Mora Chacón,
  Cañada Navarro, Cabriñana). **Córdoba cerrada**: 47 altas en 6 lotes.
- 2026-07-10 — **Lote 1.3e — Córdoba, DOP Los Pedroches jamón (8)**: 6 altas (5
  `verificado`+VO=sí, Agroibérica `parcial` por TLS). Las charcuterías del jamón
  DOP venden con tienda propia (buen rendimiento). **Excluida COVAP** (gran grupo
  cooperativo industrial, regla dura). **La Embajada del Jamón** confirmada como
  productor (secadero propio, premio Encina de Oro) pero **diferida por municipio
  sin confirmar** («Polígono Industrial Cárnico» no geocodifica). Correcciones:
  Dehesa de Campo Alto está en Espiel; Navalpedroche y Jarote en Villanueva de
  Córdoba (confirmados por directorios).
- 2026-07-10 — **Lote 1.3d — Córdoba, DOP Lucena (4) + Montoro-Adamuz (7)**: solo
  4 altas (Coop. de Lucena, Araceli parcial, La Unión de Montilla, Madre del Sol).
  **La DOP Montoro-Adamuz está dominada por cooperativas DCOOP de granel sin marca
  de consumo propia** → casi todas diferidas (Oleollanos, Olivarera de Montoro,
  Merced, San Antonio Abad, Santiago Apóstol, del Guadiato): entra solo el que
  vende con tienda/marca propia (regla dura del ledger). La Unión de Montilla se
  crea con categoría «Aceite y bodega» (una fila para aceite DOP Lucena + vino
  Montilla-Moriles), resolviendo el cruce con el lote 1. Detectados 3 leads
  net-new de aceite con tienda fuera de la lista (Rosán, Campolio, Lagar de
  Quirós) para una pasada futura.
- 2026-07-10 — **Lote 1.3c — Córdoba, DOP Priego (9) + resto Baena (2)**: 11 altas
  (10 `verificado` + 1 `parcial`; 9 con VO=sí). **Rechazo**: «Aceite la niña de
  mis ojos» (osaceite.es) es un distribuidor de Gijón, no una almazara de Córdoba.
  Monteoliva (Cabra) = DOP Baena, distinta de Monteoliva Cordobesa (Montilla);
  ⚠ homónimo de «Cabra» con Castel de Cabra (Teruel) resuelto por override. San
  Isidro (Toxar/Fuente-Tójar) distinta de la de Castro del Río. Otro lote de aceite
  de alto rendimiento (casi todas con tienda propia).
- 2026-07-10 — **Lote 1.3b — Córdoba, DOP Baena aceite (12 almazaras)**: 12 altas,
  **todas `verificado` + `Venta online=sí` ecommerce** (las cooperativas
  olivareras de la DOP venden con tienda propia → lote de máximo rendimiento).
  Correcciones de municipio: Sucesores de Hnos. López → Luque, Olivarera San
  Isidro → Castro del Río (resuelve el ⚠ homónimo con la de Fuente Tójar).
  Quedan 3 Baena para el próximo corte (Monteoliva/Cabra, Capricho Andaluz,
  osaceite).
- 2026-07-10 — **Lote 1.3a — Córdoba, Montilla-Moriles con web/venta (8)**: 8
  altas (7 `verificado` + 1 `parcial` Cruz Conde por fallos de web; VO=sí en
  Doblas, Santa Magdalena, BJN). **⚠ grupo Pérez Barquero resuelto**: se crea solo
  su fila (marca/escaparate propios, la web no menciona el grupo); Gracia Hermanos
  diferida. Correcciones: Doblas = A. Doblas Martos; Delgado marca «Segunda Bota»
  (no Bandera). BJN cooperativa con tienda propia → se mantiene. Arranca ronda 1.3
  (Córdoba); Ourense queda con cola de baja prioridad (Monterrei l17 + Festa Gaia).
- 2026-07-10 — **Lote 1.2g — Ourense, DO Ribeira Sacra ourensana (13 candidatos)**:
  9 altas (4 `verificado` + 5 `parcial`; VO=sí en Pombares y Aba Solleira).
  Resuelto el cruce del lote 9: Dominio do Bibei es Ribeira Sacra (Manzaneda), no
  Ribeiro. **Envínate diferido** por estar ya en el CSV de Tenerife (mismo
  proyecto; una fila en Ourense sería duplicado entre provincias — decisión
  editorial). 3 colleiteiros solo-teléfono diferidos (Sollío, Vázquez, Os
  Pacios). Racha de fallos técnicos de web en la zona (TLS/conexión) → varios
  `parcial`.
- 2026-07-10 — **Lote 1.2f — Ourense, DO Monterrei (lote 10, 10 candidatos)**: 9
  altas (3 `verificado` + 6 `parcial`; VO=sí en Tabú y Triay). **Corrección de
  municipio**: Pazo de Valdeconde está en Verín (Mourazos), no Monterrei.
  Resoluciones de ⚠: Terras do Cigarrón es cooperativa real (se mantiene);
  Muradella queda `parcial` por no tener web propia (referencia mundial pero solo
  distribuidores). Father 1943 = bodega nueva (30ª de la DO, 2026). Diferido:
  Franco Basalo (dominio muerto). Falta el resto del lote 17 (13 adegas, casi
  todas solo con teléfono).
- 2026-07-10 — **Lote 1.2e — Ourense, DO Valdeorras (10 bodegas)**: 10 altas,
  todas `verificado`; 7 con `Venta online=sí` (lote de alto rendimiento: el PDF
  del consejo lleva a bodegas con web y tienda). Municipios confirmados por web
  (Vilamartín, A Rúa, Rubiá, Petín, O Barco, O Bolo). Diferidos 5: Carballal y
  Ladera Sagrada (DNS muerto), Eladio Santalla (www muerto), Avelina (403 sin
  municipio), y Jorge Ordóñez (négociant de Málaga sin bodega/marca propia de
  Valdeorras confirmada). Valdeorras del corte 1 (~19 más) sigue diferido en la
  nota del lote 17 (necesita navegador/PDF).
- 2026-07-10 — **Lote 1.2d — Ourense, DO Ribeiro (corte 2, cierre)**: 7 altas (4
  `verificado`, 3 `parcial`; VO=sí en Castro Rei, Pateiro, Gandarela). **Dos
  correcciones de municipio**: Pateiro está en Carballeda de Avia y Gandarela en
  Laias (Cenlle), no Ribadavia. O Cotarelo diferida (Google Business da 404).
  **Ribeiro cerrado** (39 altas en 4 lotes). Los `parcial` son colleiteiros con
  web en obras/403/escueta (Eduardo Bravo, Iria Otero, Mauro Estévez).
- 2026-07-10 — **Lote 1.2c — Ourense, DO Ribeiro (corte 2, 1ª mitad)**: 11 altas
  (10 `verificado`, 1 `parcial`; VO=sí en Pousadoiro, Celme, Terra Minei,
  Razamonde). Corrección de municipio: Catro Ferrados está en Puga (**Toén**), no
  Ribadavia. **Muchos dominios de colleiteiro muertos**: Manuel Rojo, Quinta do
  Avelino, Tear dos Dodi (DNS ENOTFOUND) y Lancero (WordPress vacío) → diferidos.
  Bodegas Villanueva diferida por ser grupo multi-DO enredado con la fila de
  Pontevedra `adega-pazo-das-barreiras`. Quedan 8 del corte 2 sin abrir.
- 2026-07-10 — **Lote 1.2b — Ourense, DO Ribeiro (resto corte 1)**: 9 altas (8
  `verificado`, 1 `parcial`; VO=sí en Antonio Montero, Ladeiras, Casar de Vide).
  **Rechazo por otra provincia**: Bodegas El Paraguas está en Cobas, Ferrol (A
  Coruña), no en Ribeiro — error de fase A, no se crea en Ourense. **Diferidos**:
  GRM (web 503, grupo borderline) y Pazo Lalón (sin web). Más bodegas de terroir
  de grupos de calidad mantenidas (Bodegas Gallegas→Alanís, Martín Códax→Terra do
  Castelo, Matarromera→Casar de Vide). Corte 1 del Ribeiro cerrado.
- 2026-07-10 — **Lote 1.2a — Ourense, DO Ribeiro (12 bodegas top)**: 12 altas,
  todas `verificado`; 7 con `Venta online=sí` ecommerce. Corregido el municipio
  de O'Ventosela (Ribadavia→Leiro, se mudó en 2008). Criterio: varias bodegas de
  terroir son de grupos de calidad (Alma Carraovejas, José Pariente, Matarromera)
  → se **mantienen** (la exclusión de «gran grupo» es para industriales/masa); su
  VO=sí es vía la tienda oficial del grupo, no reventa de terceros. ⚠ Pazo do Mar
  comparte el dominio de la matriz con la fila Pazo das Tapias: no fusionar. Bug
  propio: 3 filas con la URL de Instagram en la columna Facebook (lo pilló el
  audit) → corregido.
- 2026-07-10 — **Lotes 1.1b y 1.1c — Tenerife (cierre de provincia)**: 1.1b
  Orotava (5)+Güímar (4)+Ycoden (3) = 12 altas (7 `verificado`/5 `parcial`; VO=sí
  en Las Galanas, Tafuriaste, Tempus, Zanata); resueltos ⚠ coop Valle de Güímar
  (marcas propias) y Bodegas Estrada (sí elabora en finca La Calabacera). 1.1c
  Abona (4)+capital (Gofio La Salud, Cervezas Ranilla) = 6 altas; corrección con
  `merge` de Agüita (La Orotava→Santa Cruz, VO=sí ecommerce|suscripcion); dedup
  crítico resuelto (Sotera = fila `queseria-de-anaga`, no se crea); 3 productoras
  de Anaga diferidas sin enlace verificable; revisadas las 2 filas Insulares
  (misma empresa, se mantienen). **Tenerife cerrada: 27 altas.** Aprendizaje:
  «Compra online» que redirige a un tercero (Hermanos Mesa→Vinófilos) NO es VO
  propia; pistas «venta en bodega» del registro Abona son venta física.
- 2026-07-10 — **Lote 1.1a — Tenerife, DO Tacoronte-Acentejo (9 bodegas)**: 9
  altas (4 `verificado`, 5 `parcial`; solo Marba con `Venta online=sí`). Ledger
  `canarias/santa-cruz-de-tenerife.jsonl` creado (dir `data/evidence/canarias/`
  nuevo). Resuelto el ⚠ Calius = marca de Cándido Hernández Pío → 1 sola fila.
  Aprendizajes: muchas webs de bodega isleña son placeholders o JS antiguo
  (El Mocanero, La Isleta) → `parcial` honesto; fallos TLS/conexión (Presas
  Ocampo, Zacatín) son técnicos, no bajas (enlace conservado); reventa en
  marketplaces de terceros ≠ VO propia (Presas Ocampo). Corregidos 3 teléfonos
  usando el de la web sobre el del registro DO.
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
- 2026-07-10 — **Ronda 0 cerrada** (lotes 0.2 a 0.5, 4 provincias): 13 altas más
  (total 16), 2 correcciones más (total 9), 4 rechazos. Ledgers nuevos:
  `soria.jsonl`, `a-coruna.jsonl`, `albacete.jsonl`; `pontevedra.jsonl` ampliado.
  `verify:data` verde (0 issues). Aprendizajes que cambian el método:
  1. **Las pistas `Venta online=sí` de fase A no valen nada.** En el registro de
     Ribera del Duero ese campo contiene *la URL de la web*, no una tienda: La
     Loba la tenía marcada y no vende online (`no`). Confirmar checkout siempre.
  2. **Pedanía ≠ municipio, y no siempre la del pueblo grande de al lado.** Zayas
     de Báscones es de **Alcubilla de Avellaneda** y Matanza de Soria de **San
     Esteban de Gormaz**; la nota de fase A daba SEdG a las dos. Resolver con
     Nominatim (la jerarquía de `display_name` da el municipio) y confirmar.
  3. **Domicilio social ≠ planta** (Brigantia: web da San Sadurniño, la quesería
     está en As Somozas; manda el registro del consejo + el concello).
  4. **No fiarse del resumidor sobre un JSON de registro**: dio 7 y luego 10
     fabricantes de Albacete donde hay 13. `curl` + parseo local. Y las
     **coordenadas del registro pueden estar a 71 km** del municipio: validar.
  5. Los directorios (`gff.co.uk`, `mejordepueblo.com`) siguen apareciendo como
     `web` en filas legacy: al cruzar un registro, revisar también las filas ya
     presentes, no solo las altas.
