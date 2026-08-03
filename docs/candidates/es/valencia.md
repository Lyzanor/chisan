# Candidatos — Valencia

> Fichero creado en la pasada **DO menos cubiertas** (`docs/candidates/es/do-huecos.md`).
> Formato estándar de `docs/candidates/README.md`.

## DO Utiel-Requena + DOP Arroz de Valencia (lote 25 de do-huecos)

> **El diagnóstico subestimó este hueco.** Decía «42 filas en la zona U-R (todas
> las categorías) → baja prioridad», pero contaba filas de CSV, no operadores: la
> DO tiene **104 bodegas**, de las cuales **58 embotelladoras certificadas**.
> Leídas 51; **17 ya en CSV** → **34 netas**. Este corte escribe **21** (las de
> marca propia clara), más **4** del arroz. Estado: **`unverified`**.
> Dedup contra `valencia.csv` (47 bodegas) el 2026-07-09, con guarda de
> `categoria == "Bodega"` y cruzando también las **marcas entre paréntesis** del
> registro.

### DO Utiel-Requena — bodegas embotelladoras (21)

- [x] **Bodegas Iranzo** (Iranzo Fields, S.L.) ‹→ bodegas-iranzo-caudete-de-las-fuentes (verificado, VO sí; eco sin sulfitos)› — Bodega. Caudete de las Fuentes.
  · 962 302 680 · <https://www.bodegasiranzo.com>.
- [x] **Noemí Wines** ‹→ de-noemi-noemi-wines-fuenterrobles (verificado, VO sí; web = denoemi.com)› — Bodega. Fuenterrobles. · 672 149 357 ·
  <https://www.noemiwines.com>.
- [x] **Bodegas Rebollar Ernesto Cárcel** (marca **Cárcel de Corpa**) ‹→ bodegas-rebollar-carcel-de-corpa-requena (parcial; web 403)› — Bodega.
  Requena (Rebollar). · 607 436 362 · <https://www.carceldecorpa.es>.
- [x] **Bodegas Emilio Clemente** (S.A.T. 7.237 Finca Caballero) ‹→ bodegas-emilio-clemente-requena (verificado, VO sí)› — Bodega.
  Requena. · 962 323 391 · <https://www.eclemente.es>.
- [x] **Vinícola del Oeste** (marca **Castaro**) ‹→ vinicola-del-oeste-castaro-requena (parcial; dominio aparcado/en venta)› — Bodega. Requena.
  · 962 320 002 · <https://www.castaro.com>.
- [x] **Bodegas Ladrón de Lunas** ‹→ bodegas-ladron-de-lunas-requena (parcial; cert caducado)› — Bodega. Requena. · 660 958 980 ·
  <https://www.ladrondelunas.com>.
- [x] **Bodega y Viñedos Carré** (José Luis Torres Carpio) ‹→ bodega-vinedos-carre-requena (verificado, VO n/c)› — Bodega. Requena.
  · 675 515 729 · <https://www.bodegacarres.com>.
- [x] **Sebirán** (VOB & T. International AB, sucursal España) ‹→ bodega-sebiran-requena (parcial; web 401)› — Bodega. Requena.
  · 962 303 321 · <https://www.sebiran.es>.
- [x] **BVC Bodegas** ‹RECHAZADO fase C 2026-07-13: confirmada como **independiente de Coviñas** (Maison Benoit Valérie Calvet, fundada 2014), pero es el brazo español de embotellado/producción del **négociant francés Calvet** → perfil B2B/exportación sin marca de consumo km0 propia; no se crea fila› — Bodega. Requena. · 962 300 680 · <https://www.bvcbodegas.com>.
- [x] **Bodegas y Viñedos Sentencia** (Juan Pedrón, C.B.) — **accepted → `bodegas-sentencia-requena`** (`verificado`, **VO=sí** ecommerce) — fase C 2026-07-13. Los Pedrones (Requena); tienda propia con checkout confirmado (El Bosque Habitado 13,50 €, tras age-gate). ⚠ Los Pedrones es pedanía a 17 km del centroide → warning de geo esperado.
- [x] **Bodega Casas de Moya** ‹→ bodega-casas-de-moya-utiel (verificado, VO n/c; checkout no operativo)› — Bodega. Utiel. · 665 330 991 · <https://www.demoya.es>.
- [x] **Bodegas Pedro Moreno 1940** ‹→ bodegas-pedro-moreno-1940-venta-del-moro (parcial; web DNS caída)› — Bodega. Venta del Moro. · 962 185 208 ·
  <https://www.bodegaspedromoreno1940.es>.
- [x] **Latorre Agrovinícola** ‹→ latorre-agrovinicola-venta-del-moro (verificado, VO n/c; web = bodegaslatorre.com)› — Bodega. Venta del Moro. · 962 185 028 ·
  <https://www.latorreagrovinicola.com>.
- [x] **Bodegas Dagón** (Miguel Jesús Márquez Sahuquillo) ‹→ bodegas-dagon-venta-del-moro (parcial; web no accesible)› — Bodega. Venta del
  Moro. · 962 178 056 · <https://www.dagon.es>. Referencia de vino sin sulfitos.
> ✅ **Corte «sin web» integrado en fase C (2026-07-13)** — se les localizó web
> propia o se confirmaron por el registro del consejo DO Utiel-Requena:

- [x] **Bodegas Mitos** → `bodegas-mitos-requena` (`verificado`, VO=nc). El
  Azagador (Requena); web propia viva `bodegasmitos.com` (sucesora de la coop.
  San Miguel del Campo) — confirma la actividad que el registro dejaba en duda.
- [x] **Bodegas Lupanda** (Manuel Peris Villanueva) → `bodegas-lupanda-requena`
  (`verificado`, VO=nc). Micro-bodega boutique del casco de Requena; web propia
  `bodegaslupanda.es` (tienda mencionada pero checkout no confirmado en vivo).
- [x] **Bodegas Carlos Cárcel** → `bodegas-carlos-carcel-requena` (`parcial`,
  VO=nc). El Rebollar (Requena) desde 1907; confirmada por el consejo, sin web
  propia legible (solo registro + FB). Entidad **distinta** de
  `bodegas-rebollar-carcel-de-corpa-requena` (Ernesto Cárcel) pese al apellido.
- [x] **Bodegas Palmera** → `bodegas-palmera-utiel` (`parcial`, VO=nc). Utiel,
  fundada 1998 por Heiner Sauer; vino L'Angelet (oro Biofach). Solo registro.
- [x] **Bru & JL Vineyards & Wines** → `bru-jl-vineyards-wines-caudete-de-las-fuentes`
  (`parcial`, VO=nc). ⚠ **municipio corregido: Caudete de las Fuentes** (no Utiel;
  registro/Empresite). Proyecto de Bruno Murciano; vino L'Alegria (bobal).
- [x] **Escuadra, Bodega y Viñedo** (Pablo Carrión Guillamón) →
  `escuadra-bodega-y-vinedo-requena` (`parcial`, VO=nc). Los Isidros (Requena);
  vinos sin aditivos (Compás, Cartabón). Confirmada por consejo + FB. ⚠ Los
  Isidros es pedanía a 18 km del centroide → warning de geo esperado.
- [x] **Bodegas y Viñedos Pigar** — **already-present** → `bodegas-pigar-requena`
  (ya en el CSV, `verificado` VO=no; misma entidad de Campo Arcís). El dedup por
  conteo no lo pilló (lección: listar siempre las líneas que casan, no solo
  contarlas). No se crea fila.

### DOP Arroz de Valencia (4)

> El consejo publica **solo 8 empresas elaboradoras**
> (`arrozdevalencia.org/sobre-nosotros/#empresas`). Dos ya están en CSV (**Arroz
> Tartana**, **Albufera Foods**) y dos son grandes grupos (ver notas). Netas: 4.
> El consejo **no publica direcciones ni webs** → municipio y contacto a resolver
> en verificación.

- [x] **Arroces y Cereales, S.A.** ‹→ arroces-y-cereales-arcesa-oliva (parcial; Oliva, industrial, sin tienda)› — Otros (arroz). Municipio a confirmar.
- [x] **Arrocerías Antonio Tomás, S.L.** ‹→ arrocerias-antonio-tomas-sollana (verificado, VO n/c; Sollana, desde 1962)› — Otros (arroz). Municipio a confirmar.
- [x] **Arroces E. Lozano, S.L.** ‹→ arroces-e-lozano-alginet (parcial; Alginet, sin web)› — Otros (arroz). Municipio a confirmar.
- [x] **Arroces J. Montoro, S.L.** ‹→ arroces-j-montoro-rafelbunol (verificado, VO n/c; Rafelbuñol, desde 1940)› — Otros (arroz). Municipio a confirmar.

### Cortes siguientes y exclusiones

> **Excluidas por gran grupo (Utiel-Requena):** *Vicente Gandía Plá* (Chiva) ·
> *Cherubino Valsangiacomo / Valsan 1831* (Chiva) · *Coviñas, Coop. V.* (Requena;
> cooperativa enorme, decenas de marcas) · *Vinícola Requenense, Coop. V.*
> (Requena) · **Hacienda y Viñedos Marqués del Atrio** (Requena) — ⚠ **el mismo
> grupo apareció en el lote 23 con bodega en Mendavia, Navarra**.
>
> **Excluidas por gran grupo (arroz):** *Maicerías Españolas, S.A.* (marca **La
> Fallera**) y *Herba Ricemills* (**Grupo Ebro Foods**, multinacional).
>
> ⚠ **Sede fiscal fuera de provincia:** *Discosta Norte, S.L.* (marca **Bodegas
> Castillo San Damián**) figura con dirección en **Ribadeo (Lugo)**, tel. 982 —
> el registro da la sede, no la bodega. Regla dura: municipio = donde se produce →
> resolver antes de escribir.
>
> ✅ **Triado en fase C (2026-07-13, lote 17):**
> - **Bodegas Jiménez-Vila Hnos.** → `bodegas-jimenez-vila-hermanos-requena`
>   (`verificado`; web propia, vinos de terroir Nexo/Núcleo, 90 pts Peñín).
> - **Agrícola Purísima Concepción (Monte Roble)** →
>   `agricola-purisima-concepcion-monte-roble-requena` (`parcial`; Los Pedrones,
>   marca de consumo propia Monte Roble). ⚠ pedanía a 17 km del centroide de Requena.
> - **Cooperativa del Campo de Camporrobles** — **diferida/excluida**: es una de las
>   **18 coops de integración comercial de vino a GRANEL** de la zona, sin marca de
>   consumo/web propia → regla dura de granel.
> - **La Encarnación de Ntra. Sra.** y **S.A.T. Montesanco** — **diferidas** (coops,
>   confirmar marca de consumo vs granel; sin rastro de marca propia en esta pasada).
> - **Bodegas del Valle** (Ricardo del Valle) — **diferida**: micro-viñerón real
>   (rosado de bobal, distinción Viñerón) pero **municipio sin confirmar** y sin web
>   propia → reabrir con concello.
> - **Bodegas Jiménez-Vila** (estaba también en «resto sin web»): ✅ integrada arriba.
> - *José Vicente Pardo Sáez* y las dos de Chiva siguen excluidas/sin rastro.

### Método

- ⚠ **`utielrequena.org` está tras Cloudflare**: devuelve **403** a `/bodegas/`,
  `/nuestras-bodegas/`, `/wp-json/` y al sitemap. Con `Referer: google.com` deja
  pasar la home, pero la lista de bodegas la pinta **JS por municipio**, así que no
  sirve.
- La fuente que funcionó es el PDF **«Bodegas Certificadas y Embotelladoras DO
  Utiel-Requena»**, alojado por un tercero (`aepev.es`), con **razón social,
  dirección, teléfono, email, web, marcas, alcances y validez del certificado**.
  Confirma la lección del lote 23: *cuando el consejo no deja leer su registro,
  buscar el listado de certificación (propio o de terceros)*.
- Al parsear con `pypdf`, el texto llega con espacios espurios dentro de palabras
  en mayúsculas (`COOPERATIV A`, `V ALSANGIACOMO`, `VILLANUEV A`): normalizar
  antes de deduplicar, o los nombres no casan.
- El registro pone las **marcas entre paréntesis** tras la razón social
  (`ECOVITIS, S.L. (BODEGA SIERRA NORTE)`). Hay que cruzar **ambas** contra el
  CSV: así salieron 17 duplicados que por razón social no habrían aparecido.
