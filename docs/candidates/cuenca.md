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

### Candidatos (3)

- [ ] **Quesos Piqmar** (Comercial Piqmar, S.L.) — Lácteos y quesos. Casas de
  Haro. · 969 380 764 · <https://www.quesospiqmar.com/>. ⚠ «Comercial» en la razón
  social, pero figura como **fabricante inscrito** en la DOP; confirmar
  elaboración propia (no solo envasado).
- [ ] **Cooperativa San Pedro de Magaceda** — Lácteos y quesos. Villamayor de
  Santiago. · 969 139 386 · <http://www.sanpedro-magaceda.es/>. Cooperativa con
  marca propia. ⚠ tercer operador de Villamayor de Santiago (con De la Huz y
  Sanabria, ya en CSV) → cuidar slug.
- [ ] **Queserías López Espada** (Queserías López Espada, S.L.) — Lácteos y
  quesos. Fuente de Pedro Naharro. · 969 125 284 · <http://quesoslopezespada.es/>.

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

### Correcciones a filas existentes de `cuenca.csv` (no tocadas en esta pasada)

> Detectadas al cruzar con el registro oficial. Valen para una pasada de refinado.

- `quesera-campo-rus-s-l-cuenca` — **slug y municipio mal**: el consejo la sitúa
  en **Santa María del Campo Rus** (el slug acaba en `-cuenca` y el municipio está
  truncado como «Santa María del Campo»). Además la `web` apunta a un directorio
  ajeno (`gff.co.uk/directory/...`); la real es <http://queseracamporus.com/>.
- `quesos-sanabria-s-l-villamayor-de-santiago` — `web` también apunta a
  `gff.co.uk/directory/...`; la real es <https://quesosanabria.com/>.
- `queseria-villadharo-villaescusa-de-haro` — añadir razón social **S.A.T.
  Oveman** y la marca **Cerro del Ángel**.
- `quesos-la-aldea-san-clemente` — razón social **Poves Redondo, S.L.L.**
- `quesos-parra-jimenez-las-mesas` — razón social **Don Merendón, S.L.**
- `lacto-ganadera-rio-mayor-quesos-la-ermita-huete` — el consejo la inscribe como
  **S.A.T. Río Mayor**, en **Caracenilla** (pedanía de Huete), con web
  <https://quesoshuete.com/>; el CSV usa `quesoslaermitadecaracenilla.com`.
  Confirmar cuál está viva y si son dos marcas de la misma quesería.
- `queserias-chaves-saelices` — el CSV usa `queseriaschaves.es`, el consejo
  `queseriaschaves.com`. Confirmar.

### Pistas para las otras tres provincias manchegas (datos ya en mano)

> El mismo JSON trae las inscritas de Toledo, Ciudad Real y Albacete, con web y
> teléfono. **No se abren aquí.** Dedup ya hecho contra sus CSV el 2026-07-09.

- **Toledo (7 netas de 19)** → `toledo.md`: S.A.T. La Cañada Real Soriana
  (Madridejos, `quesoselconsuelo.com`) · Explotaciones Ganaderas Pérez Arquero
  (Ocaña, `perezarquero.es`) · Quesos Barrajón (Quintanar de la Orden) · S.A.T.
  Gallego Sanz (Villanueva de Alcardete) · Quesos Reino (Madridejos, sin web) ·
  Indust. Alimentarias Martal (El Toboso, sin web) · Asoc. Ganadera Palomares
  (La Puebla de Almoradiel, sin web).
- **Ciudad Real (4 netas de 21)** → `ciudad-real.md`: Félix Iniesta
  Moreno-Manzanaro (Herencia, `quesosiniesta.com`) · Cabrera Gallego Antonio
  (Manzanares) · Ricardo Corrales Iniesta (Herencia, `lagaitana.es`) · ⚠ **Quesos
  Despaña / Rocinante** (Malagón) — marca grande, aplicar regla de grupos.
- **Albacete (5 netas de 13)** → `albacete.md`: Quesos Campayo (Villarrobledo) ·
  Aldonza Gourmet (Albacete). Los otros tres son **grandes grupos** y caen por
  regla dura: **Lactalis Villarrobledo**, **Mantequerías Arias** y Spanish Cheese
  (Albacete, confirmar).

### Método

`quesomanchego.es/queserias/` y `/fabricantes/` dan 404; la ruta viva es
**`/en/manufacturers/`**. La página no imprime la lista en HTML (mapa Leaflet
`wp-leaflet-maps-pro`), pero el array `places` completo está dentro del
`content.rendered` que devuelve **`/wp-json/wp/v2/pages/10148`** — mismo truco de
«el consejo expone los datos aunque la web sea JS» que ya funcionó en Ribeira
Sacra (endpoint CSV) y Melocotón de Calanda (`/autenticos-productores/`).
