# Verificación provincial de Tarragona

Ledger mínimo para reanudar la revisión profunda de
`data/csv/catalunya/tarragona.csv`. El CSV sigue siendo la fuente de verdad y la
evidencia por fila vive en `data/evidence/catalunya/tarragona.jsonl`. El
procedimiento general es `docs/es/VERIFICATION_TECHNIQUES.md`.

## Estado

- **Lote O3-venta (2026-07-31):** 13 fichas investigadas; **10 decisiones
  cerradas** (`6 sí` por ecommerce propio y `4 no`) y 3 tiendas técnicamente
  incompletas que permanecen `no comprobado`. La cola baja **120 → 110** y el
  CSV queda en 315 filas: **248 `verificado` y 67 `parcial`**. Además de
  clasificar la venta se mejoran descripción, URL o contacto de Vidafruits,
  Sarral/Portell, Bondria y La Placeta. Sarral, Bondria y Bundó no se fuerzan:
  el primero desvía carrito y pago a portada, el segundo no expone compra
  activa y el tercero declara temporalmente deshabilitados los pedidos web.
- Inicio de la pasada profunda no-vino: 2026-06-23.
- Snapshot inicial: 314 filas; 176 `verificado`, 70 `parcial`, 68 `pendiente`.
  `Venta online`: 145 `sí`, 41 `no`, 128 `no comprobado`.
- **Snapshot de cierre (2026-06-23):** 314 filas; **242 `verificado`, 72 `parcial`,
  0 `pendiente`**. `Venta online`: 160 `sí`, 44 `no`, 110 `no comprobado`. Tarragona
  queda alineada con Barcelona, Girona y Lleida (todas con 0 `pendiente`).
- Antecedente (vino): la expansión de cellers de las DO catalanas
  (Terra Alta, DO Tarragona, Conca de Barberà, Montsant, DOQ Priorat) dejó las
  176 `verificado` + 70 `parcial`; su detalle y descartes están en
  `docs/candidates/es/tarragona.md` y en el ledger Git. Los 68 `pendiente` son
  productores *legacy* no-vino anteriores a esa expansión, con ficha de Google
  Maps y, casi todos, web y teléfono, pero sin pasar por verificación.
- Objetivo de la pasada: cerrar los 68 `pendiente` (identidad/actividad/municipio
  + venta online), revisar los `no comprobado` del vino y dejar las cuatro
  provincias catalanas consistentes (Barcelona, Girona y Lleida ya cerradas con
  0 `pendiente`).

Cada lote revisa identidad, actividad productora, municipio, enlaces y venta
online; edita solo sus filas; añade evidencia JSONL y cierra con
`npx pnpm check:csv:changed`. La pasada se cierra con `npx pnpm verify:data`.

## Worklist (68 pendientes, por zona)

| Lote | Zona / categoría | Filas | Estado |
|---|---|---:|---|
| 1 | Delta de l'Ebre — arroz/pescado/sal | 10 | ✅ 2026-06-23 |
| 2 | Delta — miel/aceite/verdura | 5 | ✅ 2026-06-23 |
| 3 | Reus + Baix Camp — vermut/frutos secos/fruta/aceite/pescado | 15 | ✅ 2026-06-23 |
| 4 | Conca de Barberà + Alt Camp — cellers/fruta/aromáticas/aceite | 12 | ✅ 2026-06-23 |
| 5 | Tarragonès + Baix Penedès — aceite/bodega/café/especias | 11 | ✅ 2026-06-23 |
| 6 | Priorat + Ribera d'Ebre legacy — cellers/miel/olives/carne | 10 | ✅ 2026-06-23 |
| 7 | Cervezas artesanas + quesos dispersos | 5 | ✅ 2026-06-23 |
| 8 | Repaso `Venta online = no comprobado` del vino (~89 Bodega) | ~20 | 🔁 parcial 2026-06-23 |
| 9 | Cierre: 3 cellers diferidos de Conca + consistencia | 3 | ✅ 2026-06-23 |

## Cierre y residuales conocidos

Lote 9 (2026-06-23):

- **Diferidos de Conca resueltos:** `mas-de-la-pansa-barbera-de-la-conca` **integrado**
  (`parcial`, `sí`/marketplace); **Mas de la Creu** confirmado real (Celler Vidbertus)
  pero con municipio por fijar (l'Espluga de Francolí vs Barberà de la Conca) antes de
  crear fila; **Abadia de Poblet rechazado** (marca de Celler Tintoré, no productor
  propio). Detalle en `docs/candidates/es/tarragona.md`.
- **Duplicado fusionado:** `mas-martinet-assessoraments-falset` → `mas-martinet-viticultors-falset`
  (misma web/IG/teléfono/municipio; registro `merge` en la evidencia). 314→313→314 filas
  tras la fusión y el alta de Mas de la Pansa.
- **Dedup revisado (no fusionados, distintos por DO/municipio o marca de grupo):**
  Torres (Milmanda/Priorat), Grup Unió (Nuts/Cellers), Morlanda (`vinas-del-montsant-marca`
  vs `viticultors-del-priorat-bellmunt`), y varios teléfonos compartidos por mismo
  enólogo/grupo (Acústic/Ritme, Clos Mogador/Spectacle). Vigilar en mantenimiento.

Residuales no bloqueantes (mantenimiento):

- **~58 `Bodega` `no comprobado` con web** sin revisar individualmente (Lote 8 parcial);
  identidad ya `verificado`, muchas probablemente comprables vía marketplace.
- **21 filas `Venta online = sí` sin `Canal de venta`** (heredadas de la expansión de
  vino; `Canal` es warning-only y se backfillea de forma incremental por contrato).
- **Mas de la Creu** pendiente de alta cuando se fije el municipio.

## Criterio de Venta online + repaso del vino (2026-06-24)

Se fija el criterio **"canal propio o colectivo"** para `Venta online=sí`: vale la
tienda propia/agrobotiga, el `whatsapp`/`email`/`telefono` del propio productor o la
tienda oficial de su DO/cooperativa. La **reventa por tiendas de terceros
independientes** (vinotecas, marketplaces genéricos como Vinissimus/Bodeboca) **no**
basta → `no comprobado`. Formalizado en `docs/EDITORIAL_POLICY.md`,
`docs/es/VERIFICATION_TECHNIQUES.md`, el evaluador `scripts/editorial-policy.mjs`
(valor `reseller-only`) y un caso en `data/evals/editorial-policy-cases.json`
(`verify:ai` verde, 15 casos).

Aplicación a Tarragona:

- **`marketplace` queda solo en canales colectivos:** `celler-laurona-falset` y
  `estones-vins-falset` (botiga oficial DO Montsant). Revertidas a `no comprobado`
  por ser solo reventa independiente: oli-cocons, mel-de-gratallops, cervesa-rosita,
  vendrell-rived, joan-ametller, mas-martinet, terroir-al-limit, mas-la-mola,
  mas-de-la-pansa. `celler-pasanau` → `ecommerce` (tienda propia `shop.cellerpasanau.com`).
- **Backfill de los 21 `sí` sin `Canal`:** 20 con `ecommerce` (tienda propia o
  agrobotiga colectiva; Mel de Cal Mare vía coop Fet a la Conca; Lafou vía la tienda
  del grupo Roqueta `vinotecaorigen.com`; Molí de Rué `ecommerce|whatsapp`). El
  re-audit cazó **Altavins** (su "Shop" es un enlace roto) → `no comprobado`.
- **Repaso del residual (muestra de 8):** `les-vinyes-del-convent` → `sí`/ecommerce;
  los demás (pinellense, pallarades, terra-de-vinyaters, sileo, bernaví…) se quedan
  `no comprobado` (solo info/contacto). El ~25 % de flip confirma que el residual es
  mayormente correcto bajo el criterio.

Estado tras el repaso: **242 `verificado` / 72 `parcial` / 0 `pendiente`**;
`Venta online`: **151 `sí` / 44 `no` / 119 `no comprobado`**.

**Residual de mantenimiento (no bloqueante):** ~56 `Bodega no comprobado` con web por
auditar una a una bajo el criterio (esperable que solo una minoría tenga canal propio).
El criterio ya está formalizado, así que cualquier agente puede continuarlo de forma
consistente.

## Lotes

<!-- Cada lote se documenta abajo a medida que se cierra. -->

### Lote 1 — Delta de l'Ebre: arroz/pescado/sal (2026-06-23)

10 `verificado` (todas con web oficial que confirma identidad/actividad/municipio).
Venta online auditada producto a producto:

| Resultado | Slugs |
|---|---|
| `verificado`, venta `sí` (`ecommerce`) | `lo-nostre-arros-amposta`, `moli-de-rafelet-deltebre`, `riet-vell-amposta`, `granja-luisiana-deltebre` |
| `verificado`, venta `no` (B2B/mayorista o solo informativa) | `cambra-arrossera-del-montsia-amposta`, `explotacions-marines-fangar-la-rapita`, `sal-flor-del-delta-infosa-la-rapita`, `acuicultura-del-delta-lametlla-de-mar` |
| `verificado`, venta `no comprobado` | `arrossaires-del-delta-de-lebre-deltebre`, `fepromodel-deltebre` |

Notas: `granja-luisiana` vende por su tienda Shopify `granjaluisianagourmet.com`.
`arrossaires` tiene web institucional/socios y marcas propias en webs separadas
(venta de marca por terceros no confirmada como canal propio). `fepromodel`
baja de `sí`→`no comprobado`: pedidos por contacto y retail Bonpreu/Esclat, pero
sin checkout demostrable. Infosa y Acuidelta son B2B sin tienda a consumidor.

### Lote 2 — Delta: miel/aceite/verdura (2026-06-23)

| Resultado | Slugs |
|---|---|
| `verificado`, venta `sí` (`ecommerce`) | `mel-muria-el-perello`, `mel-del-perello-lavi-lluis-el-perello`, `colome-mulet-olis-campredo` |
| `verificado`, venta `no comprobado` | `verdures-ecologiques-joan-castella-amposta` |
| `parcial`, venta `sí` (`marketplace`) | `oli-cocons-amposta` |

Notas: Mel del Perelló (Apícola Brull Casanova) vende por `rebostavilluis.com`.
Joan Castellà reparte cistelles a domicili desde 1996 pero su web `.asp` no tiene
carrito y el canal de pedido no es demostrable. `oli-cocons` no tiene web/redes
propias: identidad por directorios + GMaps (de ahí `parcial`) y su garrafa se
vende en el marketplace `productescatalans.cat`.

### Lote 3 — Reus + Baix Camp (2026-06-23)

13 `verificado` + 2 `parcial`.

| Resultado | Slugs |
|---|---|
| `verificado`, venta `sí` (`ecommerce`) | `vermut-miro-reus`, `de-muller-reus`, `vermut-yzaguirre-el-morell`, `fruitacasa-reus`, `cooperativa-agricola-de-riudecanyes-riudecanyes`, `mel-flavia-les-borges-del-camp`, `olis-sole-mont-roig-del-camp`, `coselva-la-selva-del-camp`, `moli-doli-mas-montseny-el-morell`, `cooperativa-agricola-de-cambrils-cambrils` |
| `verificado`, venta `no comprobado` | `unio-nuts-reus`, `oli-tastam-mont-roig-del-camp`, `celler-mas-den-baiget-lalbiol` |
| `parcial`, venta `no comprobado` | `hortavella-mont-roig-del-camp`, `confraria-de-pescadors-de-cambrils-cambrils` |

Notas: Yzaguirre vende en `bodegasyzaguirre.com` y Olis Solé en `olidoliva.es`
(dominios de marca propios). `unio-nuts` es B2B; `oli-tastam` reparte a domicilio
sobre pedido pero sin canal remoto explícito. `celler-mas-den-baiget`: añadidos
IG/FB. **Dudas de encaje (`parcial`):** `hortavella` figura como comercio
mayorista de fruta/verdura (CNAE 4631) — estatus de productor sin confirmar;
`confraria-de-pescadors-de-cambrils` gestiona la llotja (venta mayorista/subasta),
sin canal a consumidor confirmable (`pescacambrils.com` es web turística).

### Lote 4 — Conca de Barberà + Alt Camp (2026-06-23)

12 `verificado` (9 con venta online).

| Resultado | Slugs |
|---|---|
| `verificado`, venta `sí` (`ecommerce`) | `aromis-montblanc`, `hortus-aprodiscae-montblanc`, `agricola-de-la-conca-montblanc`, `adernats-vinicola-de-nulles-nulles`, `celler-dasca-vives-valls`, `celler-mas-vicenc-cabra-del-camp`, `cellers-blanch-puigpelat`, `cooperativa-de-valls-valls`, `mel-dolz-montbrio-del-camp` |
| `verificado`, venta `no comprobado` | `agrobullo-subirana-olea-montblanc`, `vidafruits-botarell`, `formatges-la-vall-del-brugent-capafonts` |

Notas: `aromis` es azafrán ecológico (Concaromis SL). `hortus-aprodiscae` es el
proyecto agroecológico de APRODISCA (CET) con tienda en `aprodisca.org/tienda`.
`adernats` redirige a su tienda `adernats-shop.com`. `formatges-la-vall-del-brugent`
(rebaño propio de cabras): añadido FB, venta física sin tienda online.

### Lote 5 — Tarragonès + Baix Penedès (2026-06-23)

11 `verificado` (5 con venta online).

| Resultado | Slugs |
|---|---|
| `verificado`, venta `sí` | `cellers-avgvstvs-forvm-el-vendrell` (ecommerce), `torclum-la-bisbal-del-penedes` (ecommerce), `ceolpe-llorenc-del-penedes` (whatsapp), `agricola-de-vila-seca-vila-seca` (email), `la-botiga-del-cafe-tarragona` (ecommerce), `especies-a-ma-tarragona` (ecommerce) |
| `verificado`, venta `no comprobado` | `caves-reverte-salomo`, `horta-cal-marxant-la-pobla-de-montornes`, `horta-blanch-altafulla`, `vinyes-del-terrer-vila-seca`, `dalmau-hermanos-y-cia-tarragona` |

Notas de **encaje productor confirmado** (no son meras tiendas): `la-botiga-del-cafe`
tuesta café propio desde 1966; `especies-a-ma` elabora a mano sus mezclas de sal +
aromáticas; `dalmau-hermanos` elabora vinos de licor/mistelas desde 1830.
`agricola-de-vila-seca` acepta pedidos por formulario/email + transferencia.
`vinyes-del-terrer`: web actualizada a `terrer.net`; `caves-reverte`: añadido IG.

### Lote 6 — Priorat + Ribera d'Ebre legacy (2026-06-23)

10 `verificado` (5 con venta online).

| Resultado | Slugs |
|---|---|
| `verificado`, venta `sí` | `celler-mas-del-boto-alforja` (whatsapp), `celler-masroig-el-masroig` (ecommerce), `celler-vall-llach-porrera` (ecommerce), `mel-de-gratallops-gratallops` (marketplace), `lanjub-vinebre` (ecommerce) |
| `verificado`, venta `no comprobado` | `olives-blai-peris-bot`, `donum-deus-bot`, `lactics-casa-portella-vandellos-i-lhospitalet-de-linfant`, `formatges-serra-del-tormo-la-torre-de-lespanyol`, `formatgeria-laura-rasquera` |

Notas: `donum-deus` = carne de cabra montés de caza (marca propia, B2B). `mel-de-gratallops`
sin web propia, venta vía marketplaces (Cal Porxo / Priorat Natur). `lactics-casa-portella`
baja de sí→no comprobado (botiga no resoluble). `formatgeria-laura`: web con error 500
(no se blanquea), añadido FB. `celler-masroig` vende por su agrobotiga externa.

### Lote 7 — Cervezas artesanas + quesos dispersos (2026-06-23)

5 `verificado` (3 con venta online).

| Resultado | Slugs |
|---|---|
| `verificado`, venta `sí` | `les-clandestines-montferri` (ecommerce), `cervesa-rosita-alcover` (marketplace), `formatges-sant-gil-dalbio-llorac` (ecommerce) |
| `verificado`, venta `no comprobado` | `formatgeria-marvall-el-vendrell`, `twins-craft-beer-tarragona` |

Notas: `cervesa-rosita` web actualizada a `rosita.beer`; `formatges-sant-gil-dalbio`
web actualizada a su tienda `botiga.santgil.com` (35 años, premios Lactium/Salón
Gourmets). `marvall` (rebaño propio) y `twins` (brewpub propio) venden físico/B2B.

**Con esto, los 68 `pendiente` quedan en 0** (65 `verificado` + 3 `parcial`:
`oli-cocons`, `hortavella`, `confraria-de-pescadors-de-cambrils`). Tarragona pasa
a 241 `verificado` / 73 `parcial` / 0 `pendiente`, alineada con Barcelona, Girona
y Lleida.

### Lote 8 — Repaso de `Venta online` del vino (2026-06-23, parcial)

Pasada de cierre profundo sobre las ~89 `Bodega` con `Venta online = no comprobado`
heredadas de la expansión de vino (su `no comprobado` venía de webs que no cargaban:
age-gate/Cloudflare/TLS). Revisados ~20; **11 pasan a `sí`** (criterio del contrato:
tienda propia o ficha vigente comprable en un tercero / marketplace):

| Resultado | Slugs |
|---|---|
| `sí` (`ecommerce`, tienda propia) | `celler-batea-batea`, `cooperativa-falset-marca-falset`, `mas-igneus-gratallops`, `terra-dominicata-la-morera-de-montsant`, `la-conreria-dscala-dei-la-morera-de-montsant` |
| `sí` (`marketplace`) | `celler-laurona-falset`, `celler-pasanau-la-morera-de-montsant`, `celler-joan-ametller-la-morera-de-montsant`, `mas-la-mola-poboleda`, `terroir-al-limit-torroja-del-priorat`, `mas-martinet-assessoraments-falset` |

`celler-batea` y `cooperativa-falset-marca` además **suben `parcial`→`verificado`**
al confirmar su tienda propia. Sin carrito y se mantienen `no comprobado`:
`cooperativa-vinicola-de-sarral` (Portell), `celler-cal-pla`, `succes-vinicola`,
`portal-del-priorat`, `cellers-tane`.

**Residual conocido (no bloqueante):** quedan ~58 `Bodega` `no comprobado` con web
sin revisar individualmente esta pasada (muchas con age-gate/Cloudflare). Son filas
ya `verificado` de identidad; la mayoría son probablemente comprables vía marketplace.
Es un repaso de mantenimiento que puede continuar por tandas; no es `pendiente`.
Las otras tres provincias catalanas también conservan `no comprobado` residual.

## Imágenes / logos (P3) — 2026-06-24

Primera tanda de la brecha de imágenes (Tarragona era la peor: 29 %). Método:
`scripts/enrich-producer-images.py` en dry-run con `--report`, triaje por slug y
`--apply` **solo** de los logos verificados a ojo, con
`--asset-provincia "catalunya/tarragona"` (la ruta canónica; el script escribe
top-level por defecto). **Aviso:** el `csv.writer` del script reescribe el CSV con
CRLF; hay que reconvertir a LF tras el `--apply` (`perl -i -pe 's/\r\n/\n/g'`) o
`check:csv` falla. Verificado que el diff solo toca la columna `imagen` (110 altas,
0 cambios en otros campos).

- **Cobertura: 91 → 201 / 314 (29 % → 64 %).** +110 logos, todos revisados en su
  canvas final (contact sheets); ninguno es basura.
- **27 candidatos rechazados** (el scorer los rankea alto como "logo"; se dejan en
  blanco a propósito): 11 sellos PRTR «Pla/Plan de Recuperación», bandera UE
  (`cellers-domenys`), euro-hoja eco (`maius-viticultors`), Generalitat
  (`vinicola-del-priorat`), CCPAE ×3 (`celler-cesca-vicent`, `celler-hidalgo-albert`,
  `vinya-janine`), DOQ Priorat ×2 (`cellers-de-scala-dei`, `cartoixa-de-montsalvat`),
  Premis Vinari (`castell-dor`), International Wine Challenge (`celler-de-lera`),
  PDR.cat (`sant-josep-vins`), CookieYes (`celler-devinssi`), Wine in Moderation
  (`alvarez-duran`), «Logos-Publicidad/Candidatura» (`celler-crivelle-i-valls`,
  `celler-mas-de-les-vinyes`), foto de barricas (`celler-balmaprat`), y logos de
  **otra marca**: La Cistella del Ebre (`celler-pedrola`), Vinitum (`mas-la-mola`),
  Bodegas Iberian (`bodegas-vinedos-cal-grau`).
- **2 residuales reintentables** (logo real, fallo de red puntual, no se tocó `web`):
  `costers-del-siurana` (TLS caducado en obac.es) y `terres-de-vidalba`
  (read timeout en terresdevidalba.com).
- **Posible duplicado detectado:** `vinas-del-montsant-marca` (Viñas del Montsant) y
  `viticultors-del-priorat-bellmunt-del-priorat` (Viticultors del Priorat) comparten
  `web=morlanda.com` y el mismo logo Morlanda. Revisar en una pasada de verificación
  (fuera del alcance de imágenes).
- Quedan ~75 filas sin imagen: 36 sin `web`, ~39 sin candidato aceptable
  (favicon/404/solo foto). Gate `verify:data` OK. Pendiente: Barcelona (39 %) y
  Lleida (46 %).
