# Candidatos — Córdoba

> Origen: pasada **DO menos cubiertas** (`docs/candidates/do-huecos.md`). Cada
> sección corresponde a un lote de esa pasada. **Estado: `unverified`** —
> deduplicado contra `data/csv/andalucia/cordoba.csv` por nombre normalizado (y
> web/teléfono donde constaban). Antes de integrar: re-deduplicar con
> `npx pnpm list:province cordoba`, confirmar actividad/dirección/web, aplicar
> las reglas duras de triaje del ledger y decidir `verificacion` y `Venta online`.

## DO Montilla-Moriles (lote 1 de do-huecos)

> Fuente de partida: registro de operadores del Consejo Regulador
> (<https://www.montillamoriles.es/es/la-denominacion/operadores-inscritos.html>,
> paginado por JS) + directorio *We Love Montilla Moriles*
> (<https://welovemontillamoriles.es/bodegas-lagares-tonelerias/>, 37 bodegas +
> 17 lagares + 8 tonelerías) + fichas del Consejo. Dedup 2026-07-09.
> **Ya en el CSV (excluidas):** Alvear, Robles, El Monte, Hathor, La Aurora
> (coop.), Ruiz-Canela (Lucena), Lagar La Primilla, Lagar Los Raigones, Montes y
> Compañía. **Tonelerías excluidas** (fabricantes de barricas, B2B, no vendible
> al consumidor). Municipio = donde se produce (17 municipios de la DO en el sur
> de Córdoba).

### Bodegas con web/venta confirmada (prioridad)

- [ ] **Bodegas Pérez Barquero** — Bodega. Montilla.
  <https://perezbarquero.com/> · 957 650 500. Fundada 1905, marca histórica de la
  DO con tienda online → pista `Venta online=sí`. ⚠ **Grupo**: comparte propiedad
  con **Bodegas Gracia (Gracia Hermanos)**, **Compañía Vinícola del Sur** y
  **Tomás García** (140 ha). Antes de crear varias filas, confirmar qué marcas
  venden con escaparate propio y cuáles son solo B2B/graneles del grupo.
- [ ] **Bodegas Cruz Conde** — Bodega. Montilla (Ronda del Canillo, 4).
  <https://www.bodegascruzconde.es/> · tienda <http://tienda.bodegascruzconde.com/>
  · 957 651 250. Tienda online activa → pista `Venta online=sí`.
- [ ] **Bodegas Toro Albalá** — Bodega. Aguilar de la Frontera.
  <https://www.toroalbala.com/> · fundada 1922. PX de largo envejecimiento muy
  reputados; enoturismo y venta → pista `Venta online=sí`.
- [ ] **Bodegas Doblas** — Bodega. Moriles.
  <https://www.bodegasdoblas.com/tienda/>. Tienda online propia → pista
  `Venta online=sí`. ⚠ En el registro figura como **A. Doblas Martos**
  (bodegas@adoblasmartos.com, 957 537 942): confirmar si es la misma entidad.
- [ ] **Lagar Blanco** — Bodega/Lagar. Sierra de Montilla (Montilla).
  <https://www.lagarblanco.es/>. Lagar familiar con enoturismo y venta → pista
  `Venta online=sí`.
- [ ] **Lagar de Santa Magdalena** — Bodega/Lagar. Moriles.
  <https://www.vinoslagardesantamagdalena.com/>. Lagar con soleras y enoturismo
  → pista `Venta online=sí`.
- [ ] **Bodegas Delgado** — Bodega. Puente Genil (C. Cosano, 2).
  fino@bodegasdelgado.com · 957 600 085. Marca «Segunda Bandera». Confirmar web y
  venta.
- [ ] **Bodegas Jesús Nazareno (BJN)** — Bodega (cooperativa con marca propia).
  Baena (Av. Cañete de las Torres, 33). <https://www.bjn1963.com/> ·
  bjn@bjn1963.com · 957 670 225. ⚠ Cooperativa: entra si vende con marca de
  consumo (marca BJN); confirmar tienda/venta al público.

### Bodegas del registro (municipio a confirmar)

- [ ] **Bodegas Navarro** — Bodega. Montilla. Marca histórica de la DO; confirmar
  web oficial y venta.
- [ ] **Bodegas Gracia (Gracia Hermanos)** — Bodega. Montilla. ⚠ Mismo grupo que
  Pérez Barquero: no crear fila hasta resolver el aviso de grupo de arriba.
- [ ] **Bodegas Luque** — Bodega. Doña Mencía. PX y generosos DO Montilla-Moriles;
  confirmar web y venta.
- [ ] **Bodegas Del Pino** — Bodega. Montalbán de Córdoba. Confirmar web/venta.
- [ ] **Bodegas Bonilla (Aragón Bonilla Hermanos)** — Bodega. Aguilar de la
  Frontera (C. Ancha, 127). bodegasbonilla@hotmail.com · 957 660 760.
- [ ] **Bodegas Galán Portero** — Bodega. Montilla/Moriles (confirmar). Ficha:
  <https://www.montillamoriles.es/bodegas/listado/galan-portero/>.
- [ ] **Bodegas Único** — Bodega. Montilla (confirmar). Confirmar web/venta.
- [ ] **Bodegas Sillero** — Bodega. Confirmar municipio, web y venta.
- [ ] **Bodegas El Pujío** — Bodega. Confirmar municipio, web y venta.
- [ ] **Bodegas Maillo** — Bodega. Confirmar municipio, web y venta.
- [ ] **Bodegas Mora Chacón** — Bodega. Confirmar municipio, web y venta.
- [ ] **Bodegas El Gallo** — Bodega. Montilla (confirmar). Confirmar web/venta.
- [ ] **Lagar Cañada Navarro** — Bodega/Lagar. Sierra de Montilla (Montilla).
  Confirmar web y venta.
- [ ] **Bodegas Cabriñana / Lagar Cabriñana (Rockera Cabriñana)** — Bodega/Lagar.
  Sierra de Montilla (Montilla). bodegascabrillana@gmail.com · 957 335 386.
  Confirmar web y venta.

> ⚠ **Cooperativas del registro (triar aparte):** «Bodegas La Unión», «Bodegas
> N. Sra. Rosario», «Bodegas San Acacio» (Montemayor), «Bodegas San Jerónimo»,
> «Bodegas Vitivinícola Local» (Aguilar), «Bodegas La Purísima. Vinolea» aparecen
> marcadas como cooperativas (C) en el directorio. Entran **solo** si venden con
> marca de consumo propia (tienda física/online). Verificar una a una antes de
> crear fila; excluir las que sean sección de servicios/graneles.
> ⚠ **Navisa** (Montilla) es industrial/graneles: verificar si tiene marca de
> consumo antes de considerarla.

## DOP Baena + DOP Priego de Córdoba (aceite, lote 2 de do-huecos)

> Fuente de partida: registro de empresas del Consejo Regulador DOP Baena
> (<https://www.dobaena.com/nuestras-empresas-y-marcas/>, 17 entidades con web) +
> registro AOVE del Consejo Regulador DOP Priego de Córdoba
> (<https://www.dopriegodecordoba.es/empresas-aove/>, 10 almazaras + 6
> envasadoras/comercializadoras). Dedup 2026-07-09 por dominio y nombre
> normalizado. **Ya en el CSV (excluidas):** Peña de Baena, Olivarera Ntra. Sra.
> de Guadalupe (Baena), Almazaras de la Subbética (Carcabuey), Gomeoliva (Priego).
> Casi todas las inscritas son cooperativas olivareras que **sí** entran (venden
> con marca propia en tienda de almazara/online), pero hay que **confirmar caso a
> caso** que no sean solo sección de graneles/servicios. Municipio = donde está la
> almazara. **Corte del lote:** escritas las 24 almazaras con producción propia;
> las envasadoras/comercializadoras puras de Priego quedan como nota al pie para
> triar por producción propia (posible siguiente corte).

### DOP Baena — almazaras/olivareras (15)

- [ ] **S.C.A. Olivarera Ntra. Sra. del Rosario** — Aceite. Nueva Carteya.
  <https://aceitedelrosario.es/>. Cooperativa con marca propia; pista tienda →
  `Venta online` a confirmar.
- [ ] **S.C.A. Olivarera Ntra. Sra. de la Consolación (El Henazar)** — Aceite.
  Doña Mencía. <https://tienda.elhenazar.es/>. Tienda online → pista `Venta online=sí`.
- [ ] **S.C.A. Olivarera Almazara de Luque** — Aceite. Luque.
  <https://almazaradeluque.com/>.
- [ ] **Sucesores de Hnos. López, S.A.** — Aceite. Baena. <https://aceiteshl.com/>.
- [ ] **S.C.A. Olivarera Ntra. Sra. del Perpetuo Socorro (Zuheroliva)** — Aceite.
  Zuheros. <https://zuheroliva.com/>.
- [ ] **Orobaena, S.A.T.** — Aceite. Baena. <https://orobaena.es/>.
- [ ] **S.C.A. Olivarera San Isidro** — Aceite. Baena.
  <https://olivarerasanisidro.es/>. ⚠ Homónimo con «Olivarera San Isidro» de
  Fuente Tójar (DOP Priego, abajo): entidades distintas, cuidar slug/municipio.
- [ ] **Núñez de Prado Oliva Virgen S.L.** — Aceite. Baena.
  <https://nunezdeprado.com/>. Marca histórica (aceite «flor», ecológico).
- [ ] **S.C.A. Olivarera Germán Baena** — Aceite. Baena. <https://germanbaenascoa.es/>.
- [ ] **S.C.A. de Labradores y Ganaderos (Aceites Albendín)** — Aceite.
  Albendín (Baena). <https://aceitesalbendin.es/>.
- [ ] **S.C.A. Nuestra Sra. de la Salud** — Aceite. Castro del Río (confirmar).
  <https://aceitesdelasalud.com/>.
- [ ] **Cortijo de Suerte Alta S.L.** — Aceite. Baena. <https://suertealta.es/>.
  Aceite ecológico de finca; pista `Venta online`.
- [ ] **S.C.A.O. Virgen de la Sierra (Monteoliva)** — Aceite. Cabra.
  <https://monteoliva.com/>. ⚠ Colisión de nombre de marca con «Monteoliva
  Cordobesa S.L.» (Montilla), ya en CSV: entidades distintas (esta es Cabra, DOP
  Baena), cuidar slug.
- [ ] **Capricho Andaluz S.L.** — Aceite. Baena (confirmar).
  <https://caprichoandaluz.com/>.
- [ ] **Aceite la niña de mis ojos** — Aceite. Confirmar municipio.
  <https://osaceite.es/>.

### DOP Priego de Córdoba — almazaras (9)

- [ ] **Almazara de Muela / Mueloliva, S.L.** — Aceite. Priego de Córdoba.
  <https://www.mueloliva.es/>. Marca «Venta del Barón», premiada; tienda → pista
  `Venta online=sí`.
- [ ] **D3Olivo Biotechnology (Aroden)** — Aceite. Carcabuey.
  <https://www.aroden.com/>.
- [ ] **Manuel Molina Muñoz e Hijos** — Aceite. Almedinilla.
  <https://www.aceitesmanuelmolina.com/>.
- [ ] **Marín Serrano El Lagar, S.L.** — Aceite. Carcabuey. <https://www.ellagar.es/>.
- [ ] **S.C.A. Ntra. Sra. del Carmen de Almedinilla (Olibracana)** — Aceite.
  Almedinilla. <https://www.olibracana.es/>.
- [ ] **S.C.A. Olivarera La Purísima** — Aceite. Priego de Córdoba.
  <https://www.coopurisimapriego.com/>.
- [ ] **S.C.A. Olivarera Ntra. Sra. del Carmen (Zamoranos)** — Aceite. Zamoranos
  (Priego de Córdoba). <https://www.cooperativazamoranos.com/>.
- [ ] **S.C.A. Olivarera San Isidro (Toxar)** — Aceite. Fuente Tójar.
  <https://www.cooperativatoxar.es/>. ⚠ Ver homónimo San Isidro de Baena arriba.
- [ ] **Sucesores de Morales Morales, S.L.** — Aceite. Priego de Córdoba.
  <https://www.sucesoresdemorales.com/>.

> ⚠ **Envasadoras/comercializadoras de DOP Priego (triar por producción propia
> antes de crear fila — posible siguiente corte):** «Aceites Vizcántar»
> (<https://www.aceitesvizcantar.com/>), «Magna Legatum / Legatum AOVE»
> (<https://www.legatumaove.com/>), «Sponex / Olivasi» (<https://www.olivasi.com/>),
> «X 37 Grados Norte / XY Aceite» (<https://www.xyaceitedeoliva.com/>). Entran solo
> si producen con marca propia y venden al consumidor; excluir las que sean solo
> envasado/comercialización B2B. «Muela-Olives» del registro es la envasadora del
> mismo grupo que Mueloliva (no duplicar).
