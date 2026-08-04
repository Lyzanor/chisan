# Ibaraki — candidatos

- CSV: `data/csv/jp/kanto/ibaraki.csv` (13 filas, todas altas de esta pasada).
- Origen: listado aportado por el usuario, `listado_125_productores_locales_japon.xlsx` (consolidado 2026-08-04), bloque de Ibaraki. Fuentes que cita: el portal de exportación de la prefectura <https://exports.pref.ibaraki.jp/en/company/> (ficha por empresa), 日本酒造組合中央会 <https://japansake.or.jp/sakagura/en/ibaraki/> y web propia.
- Estado: **13 integradas** en el CSV el 2026-08-04 como `parcial` — las que traen dominio propio. Quedan 21: 8 con solo ficha del portal de exportación, 3 sin municipio usable, 2 órganos colectivos, 1 filial industrial (Calbee) y las 6 bodegas del gremio sin web localizada.

`A`/`B` es la clasificación del listado de origen: **A** = productor de origen
(explotación propia, cooperativa, transformación ligada a materia prima
regional); **B** = productor real y arraigado del que **solo valen los productos
concretos con origen local verificable**. Una `B` no es una fila peor, es una
fila que hay que acotar antes de escribirla.

| nombre | municipio | categoría | A/B | web / fuente |
|---|---|---|---|---|
| Isemata Beikoku Seifun | Hitachiota | Pan y cereal | A | soba-isemata.com |
| Iijima Chikusan | Hokota | Carne | A | iijima1129.co.jp |
| Iiyama Seicha | Yachiyo | Té e infusiones | A | ficha exports.pref.ibaraki.jp (id 715446) |
| Sashima Tea Producer Export Council | Yachiyo | Té e infusiones | A | sashimacha.jp ⚠ es un consejo exportador, no un productor |
| Hitachi Fugetsudo | Hitachi | Dulces y repostería | A | ficha exports.pref.ibaraki.jp (id 715380) |
| Fujita Apple Orchard | Daigo | Fruta y verdura | A | applefujita-llc.com |
| Fukasaku Farm | Hokota | Fruta y verdura | A | fukasaku.com |
| Terunuma | Tokai | Fruta y verdura | A | ficha exports.pref.ibaraki.jp (id 714729) |
| Nemoto Tsukemono | Mito | Conservas | A | nemotuke.com |
| Ibaraki Mogitate Factory | Ibaraki (町) | Comida preparada | A | ficha exports.pref.ibaraki.jp (id 715034) |
| Tsukuba Gingko Production Association | Ishioka | Frutos secos | A | tsukuba-gingko.com ⚠ asociación de productores |
| Aoki Brewing | Koga | Sake | B | japansake.or.jp (gremio) |
| Kiuchi Brewery 1823 | Naka | Sake | B | kiuchibrewery.co.jp ⚠ ver nota |
| Sudo Honke | Kasama | Sake | B | japansake.or.jp (gremio) |
| Yoshikubo Sake Brewery | Mito | Sake | B | japansake.or.jp (gremio) |
| Raifuku Sake Brewing | Chikusei | Sake | B | japansake.or.jp (gremio) |
| Nishioka-Honten | Sakuragawa | Sake | B | japansake.or.jp (gremio) |
| Tsukinoi Shuzouten | Oarai | Sake | B | japansake.or.jp (gremio) |
| Komatsu Suisan | Kitaibaraki | Pescado | B | shirasu.com |
| Nemotoen | Bando | Té e infusiones | B | nemotoen.com |
| Fujiya / Tsukuba Purin | Sakuragawa | Dulces y repostería | B | ficha exports.pref.ibaraki.jp (id 715108) |
| Hanamizuki | Tsukuba | Dulces y repostería | B | ficha exports.pref.ibaraki.jp (id 715270) |
| Kamejirushi Confectionery | Mito | Dulces y repostería | B | kamejirushi.co.jp |
| Kogetsuan | ⚠ sin municipio | Dulces y repostería | B | ficha exports.pref.ibaraki.jp (id 715050) |
| Kasyo Miyakawa | Daigo | Dulces y repostería | B | ficha exports.pref.ibaraki.jp (id 715184) |
| Calbee Kaitsuka Sweet Potato | Kasumigaura | Fruta y verdura | B | exports.pref.ibaraki.jp ⚠ filial de Calbee |
| Daruma Foods | ⚠ sin municipio | Legumbres | B | ficha exports.pref.ibaraki.jp (id 714641) |
| Higeta Shokuhin | ⚠ sin municipio | Legumbres | B | ficha exports.pref.ibaraki.jp (id 714756) |
| Kozawa Foods | Naka | Legumbres | B | kozawafoods.jp |
| Kurosawa Shoyuten | Hitachinaka | Condimentos | B | fujini-shouyu.co.jp |
| Shibanuma Soy Sauce | Tsuchiura | Condimentos | B | shibanuma.com |
| Anko no Machi | Kitaibaraki | Comida preparada | B | ficha exports.pref.ibaraki.jp (id 715220) |
| Meiri Shurui | Mito | Destilados y licores | B | meirishurui.com |
| Kiuchi Brewing and Distilling / Hitachino Nest | Naka | Cerveza | B | kiuchibrewery.co.jp ⚠ ver nota |

## Trampas de este bloque

- **Kiuchi son dos filas del listado y una sola empresa** (木内酒造, Naka): sake e
  Hitachino Nest. El propio xlsx lo admite («125 registros / 124 entidades»).
  La identidad del catálogo es `slug` dentro del área, así que **es una fila**,
  con `categoria` `Sake` o `Cerveza` según lo que pese, no dos.
- **Ojo con el otro Kiuchi**: 木内醸造 (Kiuchi Jyouzou, marca Hatsuuguisu) está en
  Saku, Nagano, y es una empresa distinta. Casar por municipio, no por apellido.
- **Tres filas traen «Ibaraki» como localidad**, que es la prefectura, no un
  municipio. Y hay dos «Ibaraki» reales en Japón: 茨城町 (esta prefectura) y
  茨木市 en Osaka. Resolver el municipio antes de escribir la fila, o el gate
  geográfico la manda al otro extremo del país.
- **Sashima Tea Producer Export Council** y **Tsukuba Gingko Production
  Association** son órganos colectivos: entran solo si comercializan marca propia
  (`docs/EDITORIAL_POLICY.md`), y si no, se sustituyen por sus socios.
- **Calbee Kaitsuka** es filial de un grupo industrial cotizado: candidata a
  descarte por masa, salvo que la línea de batata local se sostenga sola.
- Las fichas `exports.pref.ibaraki.jp` son de un portal de exportación: confirman
  identidad y localización, no actividad ni venta online. Solo sostienen `parcial`.

## Qué falta
- El bloque de sake son 7 bodegas y el gremio de Ibaraki lista bastantes más.
  El listado de origen es una **selección**, no el censo: medir contra
  `japansake.or.jp/sakagura/en/ibaraki/`.
- Ningún dominio comprobado en vivo, y varias filas solo traen la ficha del
  portal: encontrar la web propia es el primer trabajo de cada lote.
