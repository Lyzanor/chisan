# Akita — candidatos

- CSV: `data/csv/jp/tohoku/akita.csv` (6 filas, altas del 2026-08-05).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/akita> (42 bodegas, leído 2026-08-04). Gremio: 秋田県酒造組合, <http://www.osake.or.jp/>.
- Estado: **6 integradas** el 2026-08-05 (4 `verificado`, 2 `parcial`). Evidencia en `data/evidence/jp/tohoku/akita.jsonl`.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Akita Jozo | 秋田醸造 | Akita |
| Akita Shuzo | 秋田酒造 | Akita |
| Nawa Shoten | 那波商店 | Akita |
| Akita Seishu | 秋田清酒 | Daisen |
| Kariho Shuzo | 刈穂酒造 | Daisen |
| Dewatsuru Shuzo | 出羽鶴酒造 | Daisen |
| Fukunotomo Shuzo | 福乃友酒造 | Daisen |
| Suzuki Shuzoten | 鈴木酒造店 | Daisen |
| Azakura Shuzo | 阿櫻酒造 | Yokote |
| Asamai Shuzo | 浅舞酒造 | Yokote |
| Ryozeki Shuzo | 両関酒造 | Yuzawa |
| Akita Meijo | 秋田銘醸 | Yuzawa |
| Tenju Shuzo | 天寿酒造 | Yurihonjo |
| Fukurokuju Shuzo | 福禄寿酒造 | Gojome |
| Yamamoto Shuzoten | 山本酒造店 | Happo |
| Kodama Jozo | 小玉醸造 | Katagami |

## Integradas 2026-08-05 (6)

| bodega | municipio | resultado |
|---|---|---|
| Akita Shurui Seizo (Takashimizu) | Akita | verificado · venta sí |
| Kimura Shuzo (Fukukomachi) | Yuzawa | verificado · venta sí |
| Hiraizumi Honpo | Nikaho | verificado · sin carrito |
| Saiya Shuzoten (Yuki no Bosha) | Yurihonjo | verificado · **venta = no** |
| Aramasa Shuzo | Akita | **parcial** · sin web |
| Hinomaru Jozo | Yokote | **parcial** · solo Instagram |

⚠ **`Daisen` resolvía al Daisen de Tottori** (大山町) en vez de 大仙市, a 600 km:
error bloqueante, y **cinco bodegas de la cola de arriba están en Daisen**.
Resuelto el 2026-08-05 en `municipality-overrides.json` (chugoku vs tohoku),
antes de escribir esas filas.

- **齋彌酒造店 es el primer `Venta online = no` explícito del país**, no un «no
  comprobado»: su propia web declara que no hace envío minorista y remite a
  tienda especializada. Merece la pena distinguirlo — la mayoría de los «no
  comprobado» de esta pasada son falta de dato, éste es un hecho.
- **新政酒造 no tiene dominio propio activo** (`aramasa.jp` no responde) pese a
  ser de las marcas más buscadas del país y el origen de la levadura kyokai nº 6.
  Sexto caso del patrón tras Hiroki, Takagi, Aihara, Suminoe y Heiko.
- **日の丸醸造 solo tiene Instagram.** Sirve de enlace externo, pero no permite
  leer actividad, así que se queda `parcial`.

## Trampas
- **秋田県醗酵工業 (Yuzawa)** es industria de alcohol/destilado a granel, no una
  bodega de marca: triar antes de escribir fila.
- Seis 社名 empiezan por 秋田 y son empresas distintas (秋田酒造 ≠ 秋田酒類製造 ≠
  秋田醸造 ≠ 秋田清酒 ≠ 秋田銘醸 ≠ 秋田誉酒造). Casar por 社名 completo.
- **喜久水酒造 (Kikusui Shuzo, Noshiro)** no es 菊水酒造 (Kikusui, Shibata,
  Niigata), ya listada en `niigata.md`. Rōmaji casi idéntico, dos empresas.
- 仙北郡美郷町 y 南秋田郡五城目町 son 町 dentro de 郡: el `municipio` es Misato,
  Gojome — no el 郡.

## Qué falta
- Las ~20 bodegas restantes del censo.
- Sin abrir: きりたんぽ, いぶりがっこ (encurtido ahumado, con GI propia), arroz
  Akitakomachi, 稲庭うどん de Yuzawa (fideos con denominación y muchos obradores).

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 有限会社　正八 | H-5,6　他 | 秋田県南秋田郡大潟村西野22-18　他 | 有機農産物 | AFASSEQ-AA-050701 |
| 安部ファーム | F-11-1　他 | 秋田県南秋田郡大潟村方上6-5　他 | 有機農産物 | AFASSEQ-AA-030904 |
| イー・ファーム 遠藤暁 | G17-2 他 | 秋田県南秋田郡大潟村方上34-3、34-49　他 | 有機農産物 | AFASSEQ-AA-040901 |
| 有限会社花咲農園 | F7-4　他 | 秋田県南秋田郡大潟村方上26-32　他 | 有機農産物 | AFASSEQ-AA-010702 |
| 秋田ふるさと農業協同組合　有機米生産グループ | 橋本暁 | 秋田県横手市平鹿町中吉田字田ノ植39(一時利用)　他 | 有機農産物 | 600606P02A |
| 内田　一 | 4　他 | 秋田県南秋田郡大潟村東4-13　他 | 有機農産物 | S-085 |
| 大潟村げんき有機部会 | 相馬時博　2　他 | 秋田県南秋田郡大潟村東野38-24　他 | 有機農産物 | S-093 |
| 大潟村自然農法研究会 | １　他 | 秋田県南秋田郡大潟村字東野3-8　他 | 有機農産物 | 有機農産物認証生産第4号 |
| サン・ライス『有機の会』 | T-1A　他 | 秋田県南秋田郡大潟村字方口54-1　他 | 有機農産物 | 有機農産物認証生産第5号 |
| 株式会社OGURA | 株式会社OGURA | 秋田県大館市比内町扇田字倉下5-1 | 有機加工食品 | 011114-001 |
| 有限会社　サンファーム | B-18-①　他 | 秋田県南秋田郡大潟村字方口33-7　他 | 有機農産物 | 100093002 |
| 有限会社ライス秋田 | 方上12-10 | 秋田県南秋田郡大潟村方上12-10 | 有機農産物 | 100093007 |
| 早津　一仁 | 早津農園 | 秋田県南秋田郡大潟村字東野4-15①　他 | 有機農産物 | 00-002 |
| 有限会社粋き活き農場 | F-15 A　他 | 秋田県南秋田郡大潟村方上23-3　他 | 有機農産物 | 100052701 |
| オーリア21有機農産物生産部会 | １　他 | 秋田県南秋田郡大潟村字方口19-14  他 | 有機農産物 | 有機農産物認証生産第11号 |
| 株式会社秋田ニューバイオファーム | 株式会社秋田ニューバイオファーム | 秋田県由利本荘市西目町沼田字新道下４９０－５ | 有機加工食品 | JIAFE-OP-0006 |
| 今野農園・今野克久 | 10(Ｄ-2)　他 | 秋田県南秋田郡大潟村東野44-14　他 | 有機農産物 | AFASSEQ-AA-090801 |
| 白神郷ふたつい有機クラブ | 1　他 | 秋田県能代市二ツ井町切石字新田240　他 | 有機農産物 | S-214 |
| かたっこ米 | １　他 | 秋田県南秋田郡大潟村西野16-31,32　他 | 有機農産物 | 有機農産物認証生産第23号 |
| 有限会社北浦郷 | １　他 | 秋田県仙北市角館町八割字内山383　他 | 有機農産物 | 有機農産物認証生産第24号 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/tohoku/akita.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **2** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| わらび座 (田沢湖ビール) | ⚠ Semboku | Cerveza | JBA | warabi.co.jp | la fuente se leyó «Senbon»; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |
| あきた野ワイナリー (森吉山ファーム) | ⚠ | Vino | JWA | — | el índice no publica municipio; revisado 2026-08-10: la ficha institucional no aporta contacto o web primaria suficiente para verificar actividad actual |

**Ya integrado, no volver a proponer:** 浅舞酒造 ya está en `akita.csv` como `Sake`.
