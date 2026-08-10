# Yamagata — candidatos

- CSV: `data/csv/jp/tohoku/yamagata.csv` (22 filas: 21 bodegas más Tsuruoka Beikoku, cereal).
- Fuentes: 山形県酒造組合, <http://yamagata-sake.or.jp/pages/162/> — mapa de los 47 socios, **con ficha por bodega que sí publica el dominio** (`/pages/NN/`); y el censo de SAKETIMES, <https://jp.sake-times.com/sakagura/yamagata> (53).
- Estado: ⚑ **PASADA CERRADA** el 2026-08-05. Las 21 de la cola integradas (16 `verificado`, 5 `parcial`); queda **una**, 菊勇 (Sakata), sin ficha localizada en el gremio. Evidencia en `data/evidence/jp/tohoku/yamagata.jsonl`.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Kikuisami | 菊勇 | Sakata ⚠ sin ficha en el mapa del gremio |

## Integradas 2026-08-05 (21) — cola vaciada

| bodega | municipio | resultado |
|---|---|---|
| Dewazakura Shuzo | Tendo | verificado · venta sí |
| Tatenokawa Shuzo | Sakata | verificado · venta sí |
| Kojima Sohonten | Yonezawa | verificado · venta sí |
| Yonetsuru Shuzo | Takahata | verificado · venta sí |
| Gassan Shuzo | Sagae | verificado · venta sí |
| Mitobe Shuzo | Tendo | verificado · venta sí |
| Sakata Shuzo | Sakata | verificado · sin carrito |
| Takagi Shuzo | Murayama | **parcial** · sin web |
| Kamenoi Shuzo | Tsuruoka | **parcial** · sin web |
| Rokkasen | Higashine | verificado · venta sí |
| Kosaka Shuzo | Yonezawa | verificado · venta sí |
| Chiyokotobuki Toraya | Sagae | verificado · venta sí |
| Watarai Honten | Tsuruoka | verificado · venta sí |
| Shindo Shuzoten | Yonezawa | verificado · sin tienda |
| Shuho Shuzojo | Yamagata | verificado · sin tienda |
| Otokoyama Shuzo | Yamagata | verificado · sin tienda |
| Takenotsuyu | Tsuruoka | verificado · sin tienda |
| Furusawa Shuzo | Sagae | verificado · sin tienda |
| Fumotoi Shuzo | Sakata | verificado · sin tienda |
| Kotobuki Toraya Shuzo | Yamagata | **parcial** · web con JS |
| Kato Kahachiro Shuzo | Tsuruoka | **parcial** · URL caduca |

**Aquí el gremio sí es la palanca, al revés que en Fukushima.** El mapa de socios
(`/pages/162/`) enlaza una ficha por bodega y esa ficha **publica el dominio
propio**, además de dirección y teléfono. Una llamada por bodega en vez de dos.
Ojo con las rutas: `/publics/index/NN/` redirige 301 a `/pages/NN/`.

- ⚠ **Que el campo web del registro esté vacío no significa que no haya web.**
  酒田酒造 aparece con «—» en el dominio, pero el gremio sí publicaba su correo:
  el dominio de ese correo (`jokigen.com`, que es su marca) resultó ser su web
  propia, con la misma dirección y el mismo teléfono. Tirar del correo antes de
  dar por perdida una bodega.
- ⚠ **La lectura de `yonetsuru.com` devolvió otro municipio** («Yamabe-machi»)
  conservando el número de calle. El gremio la sitúa en Takahata, que es lo que
  se escribió. Es el mismo ruido de lectura que en Ayakiku (`kagawa.md`): cuando
  la web y el registro chocan en municipio y coincide el número, manda el registro.
- **高木酒造, la casa de 十四代, no tiene web ni correo.** Igual que Hiroki en
  Fukushima: dos de las marcas más buscadas del país son `parcial` por no tener
  dónde enlazar.


## Cierre de la pasada (2026-08-05)

Las 12 fichas restantes salieron de una tacada porque **el gremio publica el
dominio de las doce**. Después bastó un barrido leyendo el cuerpo de cada web.

- ⚠ **Contar palabras de tienda en el HTML da falsos positivos.** Dos de seis
  candidatas a `Venta online=sí` se cayeron al mirar los enlaces reales:
  男山酒造 daba cuatro coincidencias que eran **ficheros CSS de Wix**, y 古澤酒造
  doce que eran **rutas de blog** (`/blog/category/foodshop/`). Hay que extraer
  el href, no contar la palabra.
- ⚠ **加藤嘉八郎酒造 se declara a sí misma sitio antiguo** en su portada
  (「当サイトは旧サイトとなります」) y el gremio sigue publicando esa URL. Es el
  segundo registro con dominio caduco tras Sakai en `kagawa.md`. Se queda
  `parcial` con el enlace viejo hasta localizar el vigente.
- **寿虎屋酒造 sirve el cuerpo vacío**: se pinta con JavaScript, como el buscador
  del gremio de Hiroshima. `parcial`.
- **千代寿虎屋 (Sagae) y 寿虎屋酒造 (Yamagata) son dos empresas**, como avisaba
  este fichero: direcciones, teléfonos y municipios distintos. Confirmado.

## Trampas
- **寿虎屋酒造 (Yamagata) y 千代寿虎屋 (Sagae) son dos empresas** con el mismo
  「虎屋」: casar por 社名 completo y municipio.
- **後藤酒造店 y 後藤康太郎酒造店**, ambas en 高畠町, misma trampa.
- Los 郡 del interior (東置賜郡, 西置賜郡, 東田川郡, 西村山郡, 飽海郡) no son
  municipio: la fila lleva el 町/村 — Takahata, Kawanishi, Shonai, Kahoku, Yuza.
- **オードヴィ庄内 (Sakata)** es la destilería de un grupo (Eau de Vie): mirar si
  tiene marca e identidad propias antes de darla de alta.

## Qué falta
- Las ~30 bodegas restantes del censo.
- Sin abrir: cereza sato-nishiki y pera La France (Yamagata es la primera de
  Japón en ambas), ternera de Yonezawa, 玉こんにゃく, soba de Murayama, y el
  **vino de Takahata/Nan'yo**, que tiene bodegas históricas y no hay ninguna.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 農事組合法人 庄内協同ファーム | 五十嵐英一　43　他 | 山形県東田川郡三川町大字押切新田字深田15-5　他 | 有機農産物 | AFASSEQ-AA-000902 |
| 渡部陽一 | 2　他 | 山形県新庄市昭和867-2-ロ　他 | 有機農産物 | S-040 |
| 石井昭一 | 1　他 | 山形県新庄市大字昭和199-1　他 | 有機農産物 | S-147 |
| 有限会社ファーマーズクラブ赤とんぼ | オオウナジタ1他 | 山形県東置賜郡高畠町大字高畠大畦下2-2990-1他 | 有機農産物 | AFASSEQ-AA-011101 |
| 株式会社おきたま興農舎 | 安部慎一郎 1　他 | 山形県米沢市窪田町西川崎2134-イ　他 | 有機農産物 | 13 |
| ネットワーク21　代表 菅原弘行 | 菅原弘行 ①　他 | 山形県東田川郡三川町大字押切新田字前興39　他 | 有機農産物 | 12 |
| 高畠ワイン有機ぶどう研究会 | （株）高畠ワイナリー８ | 山形県東置賜郡高畠町大字元和田2752 | 有機農産物 | JT040924FA-0755-0 |
| 井上克浩 | №1　他 | 山形県鶴岡市渡前字大坪80番地　他 | 有機農産物 |  |
| 株式会社丸十大屋 | （株）丸十大屋　他 | 山形県山形市十日町3-10-1　他 | 有機加工食品 | 01-018B |
| 農事組合法人　山形おきたま産直センター | 新関拓也　2　他 | 山形県南陽市金沢万平193-ニ・ホ、194-2　他 | 有機農産物 | S-101 |
| 工藤　賢悦 | 野草人　工藤農場 | 山形県東置賜郡高畠町大字亀岡字石転シ4593　他 | 有機農産物 | 01-053 |
| 川西自然農法グループ | 高橋健次 1 他 | 山形県東置賜郡川西町大字堀金字萩ノ目1173-2 他 | 有機農産物 | 2006F-13 |
| 庄内自然農法研究会 | 菅原賢信　他 | 山形県鶴岡市古郡字杉ノ崎139　 他 | 有機農産物 | 2000F-9 |
| 山形有機うまいもん研究会 | 伊藤藤夫 4 他 | 山形県東置賜郡川西町堀金438 他 | 有機農産物 | 2001F-39 |
| 佐久間優 | 1　他 | 山形県鶴岡市常磐木字臼井10-11-（1）他 | 有機農産物 | 18 |
| 農事組合法人太ももの会　代表 渋谷嘉明 | 1　他 | 山形県酒田市広野昭和91-1　他 | 有機農産物 | 17 |
| 石井　光司 | 石井光司　UF-1　他 | 山形県鶴岡市添川字洗田91－イ　他 | 有機農産物 | JA70417FA-1048-13 |
| 岡部農園　代表 岡部栄一 | ①　他 | 山形県鶴岡市羽黒町大字仙道一本松72-1-3-(1)　他 | 有機農産物 | 19 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/tohoku/yamagata.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **0** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
