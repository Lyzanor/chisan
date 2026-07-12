# Candidatos — Cuenca

> Fichero creado en la pasada **DO menos cubiertas** (`docs/candidates/do-huecos.md`).
> Formato estándar de `docs/candidates/README.md`.

## DOP Queso Manchego — queserías de Cuenca (lote 21 de do-huecos)

> Fuente: **registro de fabricantes del Consejo Regulador**
> (`quesomanchego.es/en/manufacturers/`). La lista se pinta con un mapa Leaflet,
> pero los **65 fabricantes van embebidos como JSON** (array `places`) en el
> contenido de la página, accesible por `wp-json/wp/v2/pages/10148`: traen razón
> social, dirección, municipio, **provincia**, CP, teléfono, email, web y
> coordenadas. Reparto: Ciudad Real 21 · Toledo 19 · Albacete 13 · **Cuenca 12**.
>
> Dedup contra `cuenca.csv` el 2026-07-09 (dominio, teléfono y nombre plegando
> acentos antes de quitar genéricos). De las 12 conquenses: **7 ya en CSV**, **2
> son alias de filas existentes** (ver abajo) → **3 netas**. Estado:
> **`unverified`**. El hueco vuelve a ser pequeño: `cuenca.csv` ya tenía 13
> queserías.

### Candidatos (3) — ✅ integrados 2026-07-10 (fase B, lote 0.1 de `integracion.md`)

- [x] **Quesos Piqmar** — **accepted → `quesos-piqmar-casas-de-haro`**
  (`verificado`): la web oficial confirma elaboración propia («elaboramos
  artesanalmente nuestro propio queso»), lo que resuelve la duda «Comercial…».
  Tienda con política de envíos pero sin checkout visible → `Venta
  online=no comprobado`.
- [x] **Cooperativa San Pedro de Magaceda** — **accepted →
  `cooperativa-san-pedro-de-magaceda-villamayor-de-santiago`** (`parcial`):
  coop quesera desde 1981 (consejo + directorios); su web está viva pero
  bloquea el fetch (403) → sin primario accesible.
- [x] **Queserías López Espada** — **accepted →
  `queserias-lopez-espada-fuente-de-pedro-naharro`** (`verificado`): web
  oficial confirma elaboración artesanal; sin tienda → `Venta online=no`.
  Coordenadas a centroide (Nominatim no resuelve la calle Emilia Jarobo).

### Alias detectados — NO son altas

> Las dos «nuevas» que quedaban resultaron ser la **razón social** de filas que ya
> están en el CSV. Es exactamente el riesgo que avisaba la worklist (homónimos y
> alias entre las cuatro provincias manchegas): el registro del consejo lista
> razones sociales, el CSV usa marcas.

- **S.A.T. OVEMAN nº 403 CM** (Villaescusa de Haro) = **Quesería Villadharo**
  (`queseria-villadharo-villaescusa-de-haro`, web `villadharo.es`). Rebaño de
  ~10.000 ovejas manchegas + Lacaune; segunda marca **«Cerro del Ángel»**.
- **Poves Redondo, S.L.L.** (San Clemente) = **Quesos La Aldea**
  (`quesos-la-aldea-san-clemente`). Su email de contacto es
  `quesoslaaldea@gmail.com`; constituida en 2017, con 3 marcas registradas.

### Correcciones a filas existentes — ✅ aplicadas 2026-07-10 (fase B, lote 0.1)

- ✅ `quesera-campo-rus-s-l-cuenca` → **slug corregido** a
  `quesera-campo-rus-santa-maria-del-campo-rus` (registro `merge` en evidencia);
  la web-directorio gff.co.uk sustituida por <https://queseracamporus.com/>
  (tienda online viva) → `verificado`, `Venta online=sí`. El municipio ya
  estaba bien en el CSV.
- ✅ `quesos-sanabria-s-l-villamayor-de-santiago` → web real
  <https://quesosanabria.com/> + teléfono/email del consejo. El dominio corta
  el fetch directo (ECONNRESET) pero está vivo (indexado, FB propio) → `parcial`.
- ✅ `queseria-villadharo-villaescusa-de-haro` — ya estaba aplicada (la
  descripcion menciona S.A.T. Oveman y Cerro del Ángel); el registro confirma
  Camino de Rada, 3.
- ✅ `quesos-la-aldea-san-clemente` — razón social Poves Redondo, S.L.L. en
  descripcion + teléfono/email del consejo (el email confirma el alias) →
  `parcial`.
- ✅ `quesos-parra-jimenez-las-mesas` — razón social Don Merendón, S.L. en
  descripcion + teléfono/email del consejo → `parcial`.
- ✅ `lacto-ganadera-rio-mayor-quesos-la-ermita-huete` — resuelto: hay **dos
  entidades hermanas** con webs y tiendas vivas distintas. La fila es la
  S.A.T. Río Mayor (marca **La Ermita**, Caracenilla; su teléfono es el del
  consejo) → nombre/descripcion/correo actualizados, `verificado`,
  `Venta online=sí`. **Diferido**: posible alta aparte de **Lacto-Ganadera Río
  Mayor, S.L.** (marca «Ciudad de Huete», <https://quesoshuete.com/>,
  tel. 969 371 041, tienda online propia) si se confirma unidad productiva
  distinta de la de Caracenilla.
- ✅ `queserias-chaves-saelices` — al revés de lo esperado: el `.com` del
  consejo **no resuelve**; el `.es` de la fila es el vivo (tienda online,
  sello DOP) → dirección del polígono + teléfono/email añadidos, `verificado`,
  `Venta online=sí`.

### Pistas para las otras tres provincias manchegas (datos ya en mano)

> El mismo JSON trae las inscritas de Toledo, Ciudad Real y Albacete, con web y
> teléfono. Dedup hecho contra sus CSV el 2026-07-09.
>
> ⚠ **Al abrir Toledo y Ciudad Real, releer el registro desde el JSON crudo**: al
> integrar Albacete se comprobó que estos conteos estaban mal (5 anunciadas → 1
> real) y que el campo `categories` (`Leche cruda` / `Leche pasteurizada` /
> `Cámaras de maduración`) distingue elaboradores de simples maduradores. Método
> y trampas en [albacete.md](albacete.md) §Método.

- **Toledo (7 netas de 19)** → integrado lote 3.1b (2026-07-12): **4 altas
  verificado** — S.A.T. La Cañada Real Soriana (`quesos-el-consuelo-madridejos`,
  VO=sí) · Pérez Arquero (`quesos-perez-arquero-ocana`, VO n/c) · Quesos Barrajón
  (`quesos-barrajon-quintanar-de-la-orden`, VO=sí) · Gallego Sanz
  (`quesos-gallego-sanz-villanueva-de-alcardete`, VO=sí). **Diferidas las 3 sin
  web** (Quesos Reino/Madridejos, Indust. Alimentarias Martal/El Toboso, Asoc.
  Ganadera Palomares/La Puebla de Almoradiel): ⚠ el array `places` del registro ya
  no viene en `content.rendered` del wp-json (estructura cambiada) → falta releer
  `categories` para confirmar elaborador vs madurador antes de integrarlas.
- **Ciudad Real (4 netas de 21)** → `ciudad-real.md`: Félix Iniesta
  Moreno-Manzanaro (Herencia, `quesosiniesta.com`) · Cabrera Gallego Antonio
  (Manzanares) · Ricardo Corrales Iniesta (Herencia, `lagaitana.es`) · ⚠ **Quesos
  Despaña / Rocinante** (Malagón) — marca grande, aplicar regla de grupos.
- ✅ **Albacete** → **traspasado y cerrado** en
  [albacete.md](albacete.md) (lote 0.4, 2026-07-10). El conteo de esta nota era
  erróneo: no eran 5 netas sino **1** (Quesos Campayo). Aldonza Gourmet y Spanish
  Cheese figuran solo como `Cámaras de maduración`, **no elaboran** → descartadas
  como no-productor (ojo: *Quesos Aldonza y Don Ismael* sí es fabricante, pero de
  **Piedrabuena, Ciudad Real**). Lactalis y Mantequerías Arias caen por gran
  grupo. Las otras 8 ya estaban en el CSV.

### Método

`quesomanchego.es/queserias/` y `/fabricantes/` dan 404; la ruta viva es
**`/en/manufacturers/`**. La página no imprime la lista en HTML (mapa Leaflet
`wp-leaflet-maps-pro`), pero el array `places` completo está dentro del
`content.rendered` que devuelve **`/wp-json/wp/v2/pages/10148`** — mismo truco de
«el consejo expone los datos aunque la web sea JS» que ya funcionó en Ribeira
Sacra (endpoint CSV) y Melocotón de Calanda (`/autenticos-productores/`).
