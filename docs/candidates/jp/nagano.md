# Nagano — candidatos

- CSV: `data/csv/jp/chubu/nagano.csv` (77 filas).
- Fuente: 長野県酒造組合. **Lee las fichas japonesas, `/intro/<area>/`, no las inglesas
  `/breweries/<area>/`**: las inglesas pierden bodegas, romanizan mal y traducen
  razones sociales por marcas. Diez áreas: Kitaazumi, Matsumoto, Kiso, Iida,
  Nakano, Nagano, Ueda, Saku, Suwa, Ina.
- Estado: **⚑ CENSO DE SAKE CERRADO** el 2026-08-05. Las 76 bodegas del gremio
  están integradas (77 filas = 76 + Tamamura Honten, que entra como cervecera).

## Descartes

- **明科酒造 (Akashina Shuzo, Azumino)**: cerrada entre 2012 y 2014. Solo la
  listaba un directorio que no marca las bajas.
- **山清酒造 (Sansei Shuzo, Chikuhoku)**: aparece en la ficha inglesa del área de
  Matsumoto y **no** en la japonesa. Sin web y sin rastro reciente: no se da de
  alta hasta confirmar que sigue.
- **芙蓉酒造協同組合**: misma dirección, teléfono y web que 芙蓉酒造（株）. Dos
  figuras jurídicas sobre una unidad productiva, una sola fila.
- **Hokto Corporation**: cotizada de setas con plantas en varias prefecturas.

## Trampas resueltas

- **La marca 雲山 (Unzan) no identifica a un productor.** La crearon en 1960 seis
  bodegas con embotelladora común (雲山銘醸) y desde los noventa solo la elabora
  **西之門よしのや**. El gremio se la sigue atribuyendo además a **山形屋** y
  **坂井銘醸**, que quedan sin marca propia acreditada y son las dos candidatas a
  revisar en 2ª pasada.
- **Homónimos entre municipios de Nagano y de fuera**, todos en
  `municipality-overrides.json`: `nakano` (Nagano / barrio de Tokio, 130 km) e
  `ikeda` (Kitaazumi / Gifu, misma región `chubu`, por eso el `municipio` lleva el
  distrito: `Ikeda (Kitaazumi)`).
- **Homónimo de Nagano contra sí misma**: 木祖村 y 木曽町 romanizan los dos como
  «Kiso» y son municipios distintos a 20 km. Se escriben `Kisomura` y `Kisomachi`,
  con override cada uno.
- **Dominios del gremio caducados** (7 de 76): `miyamazakura.com` (Furuya, no
  resuelve → `furuya-shuzou.com`), `ueda.ne.jp/~okazaki` (Okazaki, certificado →
  `shinshu-kirei.com`), `fukumuryo.co.jp` (Kutsukake, no resuelve →
  `kutsukake-sake.com`), `shopdaiya.jp` (Toda, 404 → `todashuzo.jp`),
  `mcci.or.jp/www/yoikana/` (Yoikana, 404 → `yoikana.com`), `asamadake.co.jp`
  (redirige a `.com`) y la ficha de Tenpo Shuzo, que apunta a una licorería ajena.
- **`https://www.sakagura.co.jp/` sirve el sitio de reclutamiento de un grupo
  industrial ajeno**; el de Sakai Meijo es el `http://`. Comprobar los dos esquemas.
- **Un 403, una verificación de edad o un timeout no son un sitio muerto**:
  Higashiiida, Furuya, Totsuka, Yoshinoya, Fuyo, Nakazen y Kikusui sirven pero no
  se dejan leer, y por eso quedan en `parcial`.
- **Razón social ≠ marca**: 薄井商店 firma ya como 白馬錦酒造; 市野屋 vende bajo
  Ryusuisen y no bajo el Kinrankurobe del gremio; 高橋助作酒造店 se llama a sí
  misma Matsuwo; 戸田酒造 no es «Suwa Otsuya Honke Shuzo».
- **木内醸造 (Saku)** no tiene nada que ver con **木内酒造** (Naka, Ibaraki), el de
  Hitachino Nest.
- **`shoplist` / `shops` suele ser la lista de tiendas concertadas**, no tienda
  propia: Hokuan, Ono, Kasuga y Daishinshu se quedan en `no comprobado` por eso.

## Qué falta

- **2ª pasada**: 21 filas en `parcial` (las de arriba), Yoshinoya sin coordenadas
  (el geocodificador oficial no tiene Nishinomoncho) y las dos candidatas a purga.
- **Todo lo que no es sake**: soba, miso de Shinshu, manzana, uva y **vino** de
  Chikumagawa/Kikyogahara, wasabi de Azumino, oyaki. Ninguna fuente localizada aún
  — es el hueco grande de la prefectura.
- Imágenes: 77/77 filas sin `imagen`.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| ゴールドパック株式会社あずみ野工場 | ゴールドパック株式会社　あずみ野工場 | 長野県安曇野市掘金烏川1984ｰ1 | 有機加工食品 | MPJP1198 |
| 加藤浩一 | 1　他 | 長野県佐久市三分上の田39　他 | 有機農産物 | 06A-019 |
| 細井正博 | 1　他 | 長野県安曇野市豊科南穂高3644　他 | 有機農産物 | S-002 |
| 宮田兼任 | 3　他 | 長野県北安曇郡松川村196-4　他 | 有機農産物 | S-028 |
| 村山大蔵 | 2　他 | 長野県大町市平85　　他 | 有機農産物 | S-033 |
| 飯沼博 | 6　他 | 長野県安曇野市豊科南穂高2380　他 | 有機農産物 | S-161 |
| 木島平有機米研究会 | 丸山勝敏　１　他 | 長野県下高井郡木島平村大字往郷大塚沖9260-1･2　他 | 有機農産物 | S-148 |
| みたけ食品工業株式会社 | みたけ食品工業株式会社　駒ヶ根工場　他 | 長野県駒ヶ根市下平292-35　他 | 有機加工食品 | 第1018号 |
| 森原英之 | 1 | 長野県佐久市春日野宇樽3745 | 有機農産物 | 07A-004 |
| （株）水宗園本舗 | 水宗園本舗安曇野工場　他 | 長野県安曇野市豊科高家2287-30　他 | 有機加工食品 | 2007M-5 |
| 有限会社　八ヶ岳ナチュラファーム | 3-1（梓原）　他 | 長野県南佐久郡川上村梓山梓原300-1他 | 有機農産物 | 100052711 |
| 真木聡志 | 真木聡志 | 長野県佐久市下平尾下大久保597 他 | 有機農産物 | 07102 |
| 内堀醸造株式会社 アルプス工場 | （株）内掘醸造アルプス工場　他 | 長野県上伊那郡飯島町田切160-355　他 | 有機加工食品 | 07-047B |
| 田嶋克次（でんぷく農場） | 圃場1 | 長野県佐久市田口字東反田3953-1 | 有機農産物 | 08A-003 |
| 塩尻有機栽培研究会 | 保育園南　他 | 長野県塩尻市塩尻町233　他 | 有機農産物 | NA-08061201 |
| 農事組合法人野沢農産生産組合 | １他 | 長野県野沢温泉村豊郷字蟹明3177　他 | 有機農産物 | A-08-0070 |
| 株式会社タスク | 株式会社タスク有機食品工場 | 長野県長野市信州新町水内3381 | 有機加工食品 | MPJP1594 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/nagano.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **ChFun** — Cheese Fun! — 全国チーズ工房ガイド, <https://cheese-fun.jp/guide/>
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **1** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 信州とみ (ゆらり館) | Tomi | Cerveza | JBA | yurarikan.com | sociedad municipal de promoción, triar; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |

**Ya integrado, no volver a proponer:** 玉村本店 (Tamamura Honten) y 麗人酒造 ya están en `nagano.csv`; el 麗人 de la lista de cerveza es el mismo obrador.

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/nagano.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/nagano.php> (nombre, dirección y web propia de cada socio)
  - **全国乾麺協同組合連合会** — 製麺技士の居る工場一覧, <https://www.kanmen.com/factory/>
- Estado: **10 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 大西屋 | 伊那市 | Dulces y repostería | 和菓子協会 | http://www.oonishiya.com/ | 伊那市美すず 358-3 |
| 花柳 | 松本市 | Dulces y repostería | 和菓子協会 | http://shop.hanayagi.cc/ | 松本市深志 3-7-49 |
| 千登勢菓子店 | 高遠町 | Dulces y repostería | 和菓子協会 | http://www.takato-chitose.com | 上伊那郡高遠町小原 553-4 |
| キッセイ商事㈱ 澤志庵製麺所 | 塩尻市 | Pan y cereal | 全乾麺 | https://www.kissei-shoji.co.jp/ | 機械製乾めん |
| ㈱沢製麺 | 箕輪町 | Pan y cereal | 全乾麺 | http://www.sawaseimen.co.jp/ | 機械製乾めん |
| ㈱おびなた | 長野市 | Pan y cereal | 全乾麺 | https://www.obinata.co.jp/ | 機械製乾めん |
| 柄木田製粉㈱ | 長野市 | Pan y cereal | 全乾麺 | http://www.karakida.co.jp/ | 機械製乾めん |
| 信州戸隠そば㈱ | 長野市 | Pan y cereal | 全乾麺 | https://shinshusoba.net/ | 機械製乾めん |
| 戸隠松本製麺㈱ | 長野市 | Pan y cereal | 全乾麺 | http://www.soba-matsumoto.com/ | 機械製乾めん |
| ㈱小妻屋本店 | 須坂市 | Pan y cereal | 全乾麺 | http://kozumaya.ocnk.net/ | 機械製乾めん |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/chubu/nagano.csv`.
- Fuente: **食べチョク**, listado de productores de la prefectura, <https://www.tabechoku.com/producers/nagano> (dos páginas, leídas el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: el enlace de abajo es la ficha del mercado, y el dominio hay que cosecharlo antes de cada alta.
- La categoría es **provisional**: sale de la descripción de la ficha, no de una comprobación. `⚠ por decidir` es que el texto no daba para clasificar.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura. Sake excluido a propósito: ya es el 56% del catálogo japonés.

| nombre | municipio | categoría (provisional) | ficha | qué hace, según la fuente |
|---|---|---|---|---|
| 信州あゆ　臼田養魚場 | 上田市 | Pescado | https://www.tabechoku.com/producers/21897 | こんにちは！創業130年、臼田養魚場の5代目、臼田雄司です。 |
| 安曇野ファミリー農産 果物部門4年連続1位&殿堂入り&りんごグランプリ2025最高金賞1位 信州りんご 幻のりんご | 安曇野市 | Pescado | https://www.tabechoku.com/producers/21528 | りんごグランプリ2025最高金賞1位🍎✨食べチョクアワード4年連続果物部門1位&殿堂入り🍎100,000件以上のご注文&20,000件以上の |
| ぶどう園さんすけ | 松本市 | Pescado | https://www.tabechoku.com/producers/3077274 | 3ガク都〈山岳・音楽・学問〉の街・信州松本で、3人の元気な息子達と同じように愛情を込めた美味しいぶどうを作っています。 |
| くりのみ園 | 小布施町 | Carne | https://www.tabechoku.com/producers/20587 | くりのみ園は、栽培において農薬不使用・自家鶏糞堆肥を使用した自然循環農法で野菜や米を作っています。 |
| ハヤシファーム | 飯田市 | Carne | https://www.tabechoku.com/producers/20911 | 長野県飯田市で豚肉の生産と販売を行っています。 |
| 宮澤きのこ園 | 上田市 | Setas | https://www.tabechoku.com/producers/24325 | 長野県上田市できのこ農家を50年。 |
| 宮入きのこ園 | 山ノ内町 | Setas | https://www.tabechoku.com/producers/21745 | 世界中の誰もが知っている“スノーモンキー”で有名な町。緑と温泉が豊かな山ノ内町で『ぶなしめじ』の栽培を経営しています。品質・食味・食感にこだ |
| キノコ村 | 須坂市 | Setas | https://www.tabechoku.com/producers/24009 | キノコ村は、長野県須坂市・菅平高原のふもとの山里にて３０数年、個性があって、おいしいキノコの栽培に取り組んでおります。もとになる種菌から育成 |
| KTM ファーム | 信濃町 | Legumbres | https://www.tabechoku.com/producers/21425 | KTMファームは、東京から2014年信濃町に移住したグラフィックデザイナーが立ち上げた農園です。地元の方々に支えられ、移住2年目、2015年 |
| 信州塩尻 つむぐ農園 | 塩尻市 | Condimentos | https://www.tabechoku.com/producers/20624 | 長野県の自然豊かな山間地で、土地柄や気候に合わせた季節の野菜やハーブを育てています。 |
| 丸六穂高わさび問屋 | 安曇野市 | Condimentos | https://www.tabechoku.com/producers/3078876 | 創業1900年、安曇野穂高と松本で清らかな湧水と自然を守り、守られつつ、わさびを育ててきました。 |
| 小布施牧場 | 小布施町 | Lácteos y quesos | https://www.tabechoku.com/producers/25300 | 栗と葛飾北斎と美しい町並みで知られる長野県小布施町の郊外にある、ジャージー牛の牧場です。ジャージー牛乳は、高タンパクでビタミンやミネラルなど |
| カエルフルーツカンパニー | 小布施町 | Frutos secos | https://www.tabechoku.com/producers/22368 | 私たちは栗と葛飾北斎で有名な小布施町で果物農家をしているIターン農家です。 |
| 八ヶ岳ルバーブハウス/ハコブネプロジェクト | 富士見町 | Cerveza | https://www.tabechoku.com/producers/28414 | 八ヶ岳山麓、長野県富士見町で「赤いルバーブ」を栽培しています。赤いルバーブに魅せられて移住を決意し73歳から農業に挑戦。生ルバーブをはじめビ |
| こばやしや | 上田市 | Pan y cereal | https://www.tabechoku.com/producers/25017 | 信州・長野県上田市で曽祖父〜祖父〜父親と100年続く米農家。最近、やっと継ぐ決意をいたしました。作り手も消費者も皆んながHappy!!｢美味 |
| のろまん農場 | 中野市 | Pan y cereal | https://www.tabechoku.com/producers/20298 | 年間約60品種の桃を栽培する変態桃農家です。標高2,000ｍを超える山々に囲まれた自然豊かな地域で、果樹農家を営んでおります。食べた方々の心 |
| 軽井沢 ohanami farm | 軽井沢町 | Pan y cereal | https://www.tabechoku.com/producers/27329 | 長野県軽井沢町長倉の地でおひさまコーン(とうもろこし)、大和ルージュ(赤いとうもろこし)、白い妖精(白とうもろこし)、ズッキーニ、カラーピー |
| つながり自然農園 | 佐久市 | Fruta y verdura | https://www.tabechoku.com/producers/20049 | 長野県佐久市、標高約700mの内山地区。里山らしい自然ゆたかなこの町に、つながり自然農園はあります。 |
| 石農園 | 長野市 | Fruta y verdura | https://www.tabechoku.com/producers/28793 | 石農園は小布施町に果樹を中心とした栽培を行っております。 |
| 新実農園 | 飯田市 | Fruta y verdura | https://www.tabechoku.com/producers/22899 | ◇ご挨拶 |
| 信州安曇野　銀乃果 | 安曇野市 | ⚠ por decidir | https://www.tabechoku.com/producers/26749 | ようこそ、銀乃果(ぎんのか)へ！ |
| TURUTA | 小布施町 | ⚠ por decidir | https://www.tabechoku.com/producers/26093 | 私達にご興味頂きありがとうございます。 |
