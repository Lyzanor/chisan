# Candidatos — Navarra

> Fichero creado en la pasada **DO menos cubiertas** (`docs/candidates/es/do-huecos.md`).
> Formato estándar de `docs/candidates/README.md`.
>
> ⚠ **Nota**: existió un bloque previo de la *pasada de cobertura de capitales*
> (2026-07-08, foco Pamplona/Iruña) que nunca llegó a commitearse y se perdió al
> cambiar de rama el árbol de trabajo. De él sobrevive lo anotado en el ledger de
> aquella pasada: la capital tiene **8 filas**, no 4, porque el municipio figura
> con **dos grafías** («Pamplona» y «Pamplona / Iruña») → unificar el criterio de
> `municipio` al integrar. Si hace falta, rehacer esa parte.

## DO Navarra — bodegas (lote 23 de do-huecos, corte 1)

> **Hueco real, y la fuente buena no es la del consejo.** `navarrawine.com` solo
> publica **27 bodegas** (las que tienen ficha de enoturismo), pero la DO agrupa
> **~85**. El registro completo lo publica el **organismo de control, INTIA**
> (Instituto Navarro de Tecnologías e Infraestructuras Agroalimentarias) en el PDF
> *«Listado de Operadores certificados DO NAVARRA»* — **77 filas** con razón
> social, dirección (CP + municipio), teléfono, fax, email y web.
>
> Dedup contra `navarra.csv` el 2026-07-09 (dominio + nombre plegando acentos,
> **exigiendo que la fila del CSV sea de categoría `Bodega`**): **26 ya en CSV**,
> **51 netas** (34 con web). Este corte escribe **26**; el resto queda abajo.
> Estado: **`unverified`**.
>
> **Fuente**: `intiasa.es/web/sites/default/files/assets/files/certificacion/VN ListadoBodegasCertificadas.pdf`
> — la URL viva devuelve la home (el fichero se movió); se recuperó por **Wayback**
> (snapshot 2024-07-11). El listado está fechado a **31/12/2023**, así que las
> certificaciones posteriores no aparecen (ver nota). Contrastado con las 27 fichas
> del consejo.

### Ribera Baja y Ribera Alta (11)

- [x] **Bodegas Viña Magaña** ‹→ bodegas-vina-magana-barillas (verificado, VO n/c)› — Bodega. Barillas. · 948 850 034 ·
  <https://www.vinamagana.com>.
- [x] **Bodega Ntra. Sra. del Romero** (marca **Malón de Echaide**) ‹→ bodega-malon-de-echaide-cascante (verificado, VO sí; ⚠ homónimo Cascante del Río en municipios.json → coords fijadas a Navarra)› — Bodega.
  Cascante (Ctra. Tarazona, 33). · 948 851 411 · <https://www.bodegasdelromero.com>.
  Cooperativa. ⚠ el consejo la lista por la marca, no por la razón social.
- [x] **Bodegas Marqués de Montecierzo** ‹→ bodega-marques-de-montecierzo-castejon (verificado, VO sí; ecológico)› — Bodega. Castejón. · 948 814 414 ·
  <https://marquesdemontecierzo.com>.
- [x] **Bodega Cirbonera** (marca **Dominio Lasierpe**) ‹→ bodega-cirbonera-dominio-lasierpe-cintruenigo (verificado, VO sí)› — Bodega. Cintruénigo.
  · 948 811 033 · <https://www.dominiolasierpe.com>. Cooperativa con marca propia.
- [x] **Bodegas Corellanas** ‹→ bodegas-corellanas-corella (verificado, VO sí)› — Bodega. Corella (Santa Bárbara, 29). · 948 780 029 ·
  <https://bodegascorellanas.com>.
- [x] **Viña Zorzal Wines** ‹→ vina-zorzal-wines-corella (parcial; web SPA no legible)› — Bodega. Corella. · 948 780 617 ·
  <https://www.zorzalwines.com>. ⚠ existe una segunda entidad, *Proyecto Zorzal,
  S.L.* (mismo teléfono) → una sola fila.
- [x] **Bodegas Camino del Villar** (marca **Viña Aliaga**) ‹→ bodegas-camino-del-villar-vina-aliaga-corella (parcial; web SPA no legible)› — Bodega. Corella.
  · 948 401 321 · <https://www.vinaaliaga.com>.
- [x] **Bodega y Viñas Valdelares** ‹→ bodega-vinas-valdelares-carcar (parcial; web no accesible)› — Bodega. Cárcar (Eje del Ebro, km 60).
  · 656 849 602 · <https://www.valdelares.com>.
- [x] **Vidmundi** (marca **Finca La Cantera**) ‹→ vidmundi-finca-la-cantera-murchante (verificado, VO sí)› — Bodega. Murchante.
  <https://www.fincalacantera.com>.
- [x] **Bodegas Azpea** ‹→ bodegas-azpea-lumbier (verificado, VO sí)› — Bodega. Lumbier. · 948 880 433 · <https://www.bodegasazpea.com>.
- [x] **Bodegas Ontañón** ‹DIFERIDO: es fundamentalmente riojana (sede Avda. de Aragón 3, Logroño; grupo Ontañón Familia); solo tiene bodega inscrita en Navarra → fuera de provincia› — Bodega. Fitero. · 948 776 056 · <https://www.ontanon.es>.
  ⚠ grupo riojano con bodega inscrita en Navarra; confirmar encaje de tamaño.

### Tierra Estella, Valdizarbe y Ribera Alta (9)

- [x] **Vinecultor** (marca **Laderas de Montejurra**) ‹→ vinecultor-laderas-de-montejurra-dicastillo (parcial; dominio repurposado como revista)› — Bodega. Dicastillo
  (Ctra. Sesma, 3). <https://www.laderasdemontejurra.com>.
- [x] **José Pueyo Granada** (marca **Bodegas Armendáriz**) ‹→ bodegas-armendariz-falces (parcial; web 404)› — Bodega. Falces.
  · 948 734 135 · <https://www.bodegasarmendariz.com>.
- [x] **Viña Valdorba** ‹→ vina-valdorba-garinoain (parcial; web caída)› — Bodega. Garinoain. · 659 098 794 ·
  <https://www.bodegasvaldorba.com>.
- [x] **Bodegas Macaya s. XXI** ‹→ bodegas-macaya-larraga (parcial; cert caducado)› — Bodega. Larraga. · 948 711 549 ·
  <https://www.bodegasmacaya.com>.
- [x] **SAT García García 734 NA** (marca **Bodega Ozalder**) ‹→ bodega-ozalder-larraga (parcial; municipio = Larraga por INTIA, no Lerín)› — Bodega. Larraga
  (Ctra. Berbinzana, 21B). · 661 705 573 / 948 926 036 · <https://www.ozalder.es>.
  ⚠ la ficha del consejo la sitúa en **Lerín**; INTIA dice **Larraga** (CP 31251).
  Confirmar antes de integrar.
- [x] **Viñedos y Bodegas Alconde** ‹→ vinedos-y-bodegas-alconde-lerin (verificado, VO sí)› — Bodega. Lerín. · 948 530 058 ·
  <https://www.bodegasalconde.com>.
- [x] **Bodegas Fernández de Arcaya** ‹→ bodegas-fernandez-de-arcaya-los-arcos (parcial; cert mal configurado)› — Bodega. Los Arcos. · 948 640 811 ·
  <https://www.fernandezdearcaya.com>.
- [x] **Bodegas Valcarlos** ‹→ bodegas-valcarlos-los-arcos (verificado, VO sí; Grupo Faustino, bodega de terroir)› — Bodega. Los Arcos (Ctra. de la Circunvalación s/n).
  · 948 640 806 · <https://www.bodegasvalcarlos.com>. Inaugurada en 2001.
- [x] **Bodega Coop. La Cruz** (marca **Belardi**) ‹→ bodega-cooperativa-la-cruz-belardi-maneru (verificado, VO n/c)› — Bodega. Mañeru. · 948 341 002 ·
  <https://www.vinobelardi.com>.

### Baja Montaña y resto (6)

- [x] **Viñedos y Bodegas de Mendigorría** (marca **Lúculo**) ‹→ vinedos-y-bodegas-de-mendigorria-luculo (parcial; web 404)› — Bodega.
  Mendigorría. <https://www.luculo.es>. ⚠ el dedup por nombre la confundió con
  `fresas-de-mendigorria-mendigorria` (fruta): son distintas.
- [x] **Proyecto Unsi** (marca **Unsi Wines**) ‹→ proyecto-unsi-wines-olite (verificado, VO sí)› — Bodega. Olite / Erriberri.
  · 689 482 741 · <https://www.unsiwines.com>.
- [x] **Bodegas San Martín** (Sdad. Coop.) ‹→ bodegas-san-martin-san-martin-de-unx (verificado, VO sí; coop 1914)› — Bodega. San Martín de Unx.
  · 948 738 294 · <https://www.bodegasanmartin.com>. Tienda en bodega. ⚠ el dedup
  por nombre la confundió con una **charcutería de Arbizu** («…Etayo San Martín»):
  son distintas.
- [x] **Bodegas Ayerra** ‹→ bodegas-ayerra-san-martin-de-unx (verificado, VO sí)› — Bodega. San Martín de Unx. · 948 738 190 ·
  <https://www.bodegasayerra.com>.
- [x] **Asensio Viñedos y Bodegas** ‹→ asensio-vinedos-y-bodegas-sesma (parcial; web 403)› — Bodega. Sesma. · 618 720 613 ·
  <https://www.bodegasasensio.com>. ⚠ el dedup la confundió con
  `conservas-asensio-larraga` (conservas): son distintas.
- [x] **Aroa Bodegas** ‹→ aroa-bodegas-yerri (verificado, VO n/c; ecológica, Zurukoain/valle de Yerri)› — Bodega (ecológica). Zurukuain. · 948 921 867 ·
  <https://www.aroawines.com>.

### Cortes siguientes — 21 anotadas de las 25 restantes (datos ya capturados)

> ⚠ **Recuento reconciliado el 2026-08-03.** El corte 1 dejó **25 restantes**,
> pero abajo solo hay **21 fichas** (9 grupos/fuera + 6 integradas en fase C + 6
> pendientes, una de ellas alias de otra). Faltan por anotar **4 bodegas** del PDF
> de INTIA: al reabrir el corte 2, releer el listado antes de darlo por completo.
> Los 6 pendientes de abajo siguen sin fila (dedup rehecho el 2026-08-03).

> **Con web, diferidas por ser grupos grandes o de fuera (9)** — decidir por regla
> dura antes de escribirlas: *Bodegas y Viñedos Artazu* (Artazu; web `artadi.com` →
> **Grupo Artadi**, Rioja Alavesa) · *Bodegas Manzanos* (Azagra, `manzanos.com`,
> grupo grande) · *Bodegas Escudero* (Castejón y Monteagudo, `familiaescudero.com`;
> sede en Grávalos, La Rioja; teléfono 941) · *Bodegas Gran Feudo* (Cintruénigo,
> `granfeudo.com` → **Familia Chivite**, ya en CSV como `bodegas-chivite-villatuerta`)
> · *Grupo Vitilia* (Pamplona, `vitilia.es`; sus instalaciones están en **Obanos** →
> es la razón social de «Bodegas Pagos de Obanos») · *Bodegas Príncipe de Viana*
> (Murchante, `principedeviana.com`) **y su planta de Cadreita**, que es
> «**Finca Albret**» (`fincaalbret.com`) → grupo grande, dos filas del registro ·
> *Bodega Cosecheros Reunidos* (Olite, `cosecheros.com`, cooperativa grande) ·
> *Hacienda y Viñedos Marqués del Atrio* (Mendavia) · *Bodegas Caudalia*
> (**Nájera, La Rioja** → fuera de provincia, excluir).
>
> **Sin web en el registro (12 anotadas)** — ✅ **6 integradas en fase C
> (2026-07-13, lote 11), todas `verificado`** (la etiqueta «sin web» de INTIA era
> errónea: todas tienen web propia al buscarlas):
> - **Anton Agirre** (Ablitas) → `bodega-ubeta-anton-agirre-ablitas` (web
>   ubetawines.com, garnacha eco).
> - **Navarrsotillo** (Andosilla) → `bodegas-navarrsotillo-andosilla` (biodinámico
>   Demeter, web leída en vivo).
> - **Bodega Monasterio de la Oliva** (Carcastillo) →
>   `bodega-monasterio-de-la-oliva-carcastillo` (monasterio cisterciense, garnacha eco).
> - **Bodegas Aguirre** (Falces) → `bodegas-aguirre-falces` (web bodegasaguirre.es).
> - **Coduvina** (Milagro) → `bodega-dominio-de-milagro-coduvina-milagro` (proyecto
>   Dominio de Milagro, 150 ha, web dominiodemilagro.es).
> - **Viña Palacios** (Olite) → `vina-palacios-olite` (David Palacios/Izaskun Oria,
>   garnacha, web vinapalacios.es).
>
> **Pendientes del corte (coops sin web + murky, baja prioridad):** Cooperativa
> Agrícola de Artajona · Coop. Ángel de la Guarda (Berbinzana) · Bodega San
> Cristóbal (Cirauqui) · Pedro Iturgaiz Lacunza (Cirauqui) · Coop. San Miguel
> (Eslava, = Bodega Eslava, alias ya anotado) · **Raúl Pérez Compañía de Vinos**
> (San Martín de Unx) → **diferida**: su web raulperez.com está en obras y la
> identidad como bodega de producción navarra (vs registro fiscal del enólogo del
> Bierzo) no está clara; participa en la marca colectiva «El Vino de los Aromas».
>
> **Certificadas después del 31/12/2023** (están en la web del consejo pero no en el
> PDF de INTIA): *Bodegas Olimpia* (Cáseda, `bodegasolimpia.com`) ‹→ bodegas-olimpia-caseda (verificado, VO n/c; grupo Vitilia pero terroir con nombre propio)› · *Doña Isabella* ‹EXCLUIDA: donaisabella.es redirige a grupomarquesdelatrio.com → marca del gran grupo Marqués del Atrio›
> (Corella, `donaisabella.es`, 948 379 994) · *Hacienda Logos* (marca de Bodegas
> Escudero). Verificar y añadir en el corte 2.

### Alias detectados — habrían creado 5 duplicados

> Tercer lote seguido con este patrón, y aquí es el más sucio: **el consejo publica
> marcas y el organismo de control publica razones sociales**. Cruzar siempre las
> dos listas.

| Marca (web del consejo) | Razón social (registro INTIA) | Municipio |
|---|---|---|
| Finca Albret | Bodegas Príncipe de Viana, S.L. (planta) | Cadreita |
| Bodega Ozalder | SAT Limitada García García 734 NA | Larraga (⚠ no Lerín) |
| Bodegas Pagos de Obanos | Grupo Vitilia, S.L. (instalaciones en Obanos) | Pamplona / Obanos |
| Bodegas Malón de Echaide | Bodega Ntra. Sra. del Romero, S. Coop. | Cascante |
| Bodega Eslava | Bodega Coop. San Miguel (mismo tel. 948 733 185) | Eslava |

### Correcciones a filas existentes de `navarra.csv`

- ✅ **`mendiko-aibar-oibar`** — corregido fase C 2026-07-13: era **Aceite**, pero
  Bodega Mendiko (Familia Ibero-Azkárate, Aibar) es **bodega ecológica de vino**
  (garnacha/cabernet) que también hace aceite → categoría a **«Aceite y vino»**,
  descripción reescrita, **sube a `verificado`** (web propia leída en vivo).
  VO=no comprobado (venta por contacto/cooperativas, sin checkout).
- ✅ **`bodega-otazu-otazu`** — corregido fase C 2026-07-13: municipio **Otazu →
  Etxauri** (Otazu es concejo de Etxauri; dirección Plaza Señorío de Otazu s/n,
  31174 Etxauri; D.O.P. Pago de Otazu). Coords validan a ~1 km del centroide de
  Etxauri. Se mantiene `verificado`, VO=sí.
- ✅ **`bodegas-lezaun-lacar-lakar`** — corregido fase C 2026-07-13: municipio
  **«Lácar / Lakar» → Yerri** (Lácar es concejo del valle de Yerri/Deierri).
  Coords validan a ~6 km del centroide de Yerri. Se mantiene `verificado`, VO=sí.
- Razones sociales útiles para verificación: `bodegas-maximo-abete-san-martin-de-unx`
  = **Guerinda 2010, S.L.** · `bodega-de-sada-sada` = **Bodega San Francisco
  Javier, Sdad. Coop.** · `bodega-nekeas-anorbe` = **Sociedad Coop. Nequeas** ·
  `bodega-senorio-de-sarria-puente-la-reina` = **Bodega de Sarría, S.A.**

### Método

- El registro **no está en la web del consejo**: `navarrawine.com` expone un CPT
  `bodegas` vía `wp-json/wp/v2/bodegas` con solo **27** entradas (`x-wp-total: 27`).
  La cifra oficial de la DO es ~85 bodegas.
- La fuente buena es el **organismo de control (INTIA)**, no el consejo regulador.
  Generalizable: cuando un consejo delega la certificación en un tercero (INTIA,
  ENAC, entidades autonómicas), ese tercero suele publicar el listado íntegro.
- El PDF trae una segunda dirección tras «**Instalaciones sitas en:**» (planta ≠
  sede fiscal) y **repite la razón social** cuando una empresa tiene varias plantas
  (Príncipe de Viana aparece dos veces). Al parsear, no deduplicar por nombre a
  secas o se pierden bodegas (así se perdían Finca Albret, Ozalder y Pagos de
  Obanos).
- **Guarda de dedup imprescindible**: exigir `categoria == "Bodega"` en la fila del
  CSV. Sin ella, «Bodegas San Martín» matchea una charcutería de Arbizu, «Asensio
  Viñedos y Bodegas» una conservera de Larraga y «Viñedos y Bodegas de Mendigorría»
  una productora de fresas.
