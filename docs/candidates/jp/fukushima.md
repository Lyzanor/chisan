# Fukushima — candidatos

- CSV: `data/csv/jp/tohoku/fukushima.csv` (9 filas, altas del 2026-08-04).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/fukushima> (63 bodegas, leído 2026-08-04). Gremio: 福島県酒造協同組合, <http://www.sake-fukushima.jp/>.
- Estado: **9 integradas** el 2026-08-04 (7 `verificado`, 2 `parcial`); quedan 8 de la tabla y ~46 del censo. Evidencia en `data/evidence/jp/tohoku/fukushima.jsonl`.

Fukushima es la prefectura con más oros del 全国新酒鑑評会 de la última década:
el pool de bodegas con marca y tienda propia es de los mejores del país.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Akebono Shuzo | 曙酒造 | Aizubange |
| Toyokuni Shuzo | 豊国酒造 | Aizubange |
| Takahashi Shosaku Shuzoten | 高橋庄作酒造店 | Aizuwakamatsu |
| Nagurayama Shuzo | 名倉山酒造 | Aizuwakamatsu |
| Yumegokoro Shuzo | 夢心酒造 | Kitakata |
| Ohara Shuzo | 小原酒造 | Kitakata |
| Sasanokawa Shuzo | 笹の川酒造 | Koriyama |
| Kokken Shuzo | 國権酒造 | Minamiaizu |
| Kaito Otokoyama Shuzo | 開当男山酒造 | Minamiaizu |
| Hanaizumi Shuzo | 花泉酒造 | Minamiaizu |
| Eisen Shuzo | 榮川酒造 | Bandai |
| Matsuzaki Shuzo | 松崎酒造 | Ten'ei |
| Ohki Daikichi Honten | 大木代吉本店 | Yabuki |

## Integradas 2026-08-04 (9) — salidas de la cola de arriba

| bodega | municipio | resultado |
|---|---|---|
| Suehiro Shuzo | Aizuwakamatsu | verificado · venta sí |
| Niida Honke | Koriyama | verificado · venta sí |
| Yamatogawa Shuzoten | Kitakata | verificado · venta sí |
| Homare Shuzo | Kitakata | verificado · venta sí |
| Ninki Shuzo | Nihonmatsu | verificado · venta sí |
| Miyaizumi Meijo | Aizuwakamatsu | verificado · sin venta directa |
| Tsurunoe Shuzo | Aizuwakamatsu | verificado · sin carrito |
| Okunomatsu Shuzo | Nihonmatsu | **parcial** · web ilegible |
| Hiroki Shuzo Honten | Aizubange | **parcial** · sin web |

**El portal de la prefectura no sirve para el dominio.** `fukunosake.com` tiene
ficha por bodega con dirección y teléfono de las 55, pero **no publica la web de
ninguna** — comprobado en el listado y en una ficha suelta. Sirve para dirección,
municipio y contacto; el dominio hay que buscarlo bodega a bodega.

- **廣木酒造本店 (Hiroki) no tiene web propia**, y eso que su marca es de las más
  buscadas de Japón. Vende solo por distribuidor autorizado. Sin enlace externo
  no puede pasar de `parcial`: la fama no sustituye a la fuente.
- **宮泉銘醸 declara en su propia web que las fechas de venta las fija cada tienda
  autorizada**, o sea que no vende directo. Eso es un `no comprobado` razonado,
  no una falta de datos.
- **奥の松酒造 sirve su web pero devolvió solo el título**, sin cuerpo legible:
  confirma dominio vivo y propiedad, no actividad. Dirección y contacto salen del
  directorio de empresas del ayuntamiento de Nihonmatsu. Se queda `parcial`.
- **末廣酒造 tiene dos kura** (Kaeigura en Aizuwakamatsu, Hakushigura en
  Aizumisato). La fila toma la sede.

## Trampas
- **大七酒造 (Daishichi, Nihonmatsu)** ya está en la bandeja del `README.md` de
  esta carpeta: no volver a proponerla como nueva.
- **豊國酒造 (Furudono, 石川郡) y 豊国酒造 (Aizubange, 河沼郡) son dos empresas
  distintas** que solo se diferencian en un kanji (國/国). No fusionar filas.
- **榮川酒造株式会社 (Bandai) y 榮川酒造合資会社 (Minamiaizu)**: misma trampa, la
  forma societaria es lo único que las separa en el listado.
- 会津 se reparte en muchos municipios de nombre parecido — 会津若松市,
  会津坂下町, 会津美里町, 南会津町 — y el `municipio` no es «Aizu».
- La franja costera (いわき, y los municipios evacuados tras 2011) exige evidencia
  reciente de actividad: aquí «sigue abierta» no es un trámite.

## Qué falta
- Las ~40 bodegas restantes del censo.
- Sin abrir: melocotón de Fukushima (segunda de Japón), 会津の味噌・醤油,
  きゅうり/アスパラ, 喜多方ラーメン, 会津本郷焼 (no alimentario).

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| あいづ有機農法生産組合 | 横山歩 2 | 福島県会津若松市神指町榎木檀24 | 有機農産物 | JS000828FA-2041 |
| 渡部よしの | 1　他 | 福島県喜多方市山都町三津合字千咲原5846-65　他 | 有機農産物 | S-141 |
| やまろく米出荷協議会 | 安斎正代　１ 他 | 福島県二本松市渋川字神社前19　他 | 有機農産物 | AFASSEQ-AA-000903 |
| 日本果実加工株式会社　白河工場 | 日本果実加工株式会社　白河第2工場、第3工場　他 | 福島県白河市東深仁井田字道山2-4　他 | 有機加工食品 | MPJP1428-01 |
| 山吉青果食品株式会社　桑折工場 | 山吉青果食品株式会社　桑折工場 | 福島県伊達郡桑折町大字万正寺字宮ノ西1-1 | 有機加工食品 | 第1167号 |
| ＦＥＮネット | 五十嵐正康　ほ場1　他 | 福島県河沼郡会津坂下町大字坂本字大沢71-1、72　他 | 有機農産物 | 2001F-20 |
| ゆうきの会 | 大竹久雄 ほ場4 他 | 福島県喜多方市熱塩加納町米岡字上野前8 他 | 有機農産物 | 2005F-13 |
| 自然農法風の会 | 農業法人（有）自然農法無の会 ほ場103 他 | 福島県大沼郡会津美里町松沢字中原292 他 | 有機農産物 | 2001F-1 |
| 農園　やいこばあちゃん　大平周一 | 岡下　他 | 福島県石川郡石川町大字南山形字羽貫田387Ｋ　他 | 有機農産物 | 福島県認定第9号 |
| 会津自然塾　代表者 鹿野義治 | 鹿野敏子 自宅前畑①　他 | 福島県大沼郡会津美里町字高田前川原3478　他 | 有機農産物 | 福島県認証第6号 |
| 三坂　勲 | 10 菅田100　他 | 福島県相馬郡飯舘村臼石字菅田100　他 | 有機農産物 | 福島県認定第4号 |
| 菊地浩美 | 山田第一ほ場 | 福島県双葉郡双葉町山田字北田6 | 有機農産物 | 福島県認定第14号 |
| かぼちゃランド若月　若月芳則 | 酒田有機圃場 | 福島県双葉郡浪江町大字酒田字原131 | 有機農産物 | 福島県認定第13号 |
| 髙橋庄作酒造店　髙橋庄作 | 試験田　他 | 福島県会津若松市門田町大字一ノ堰字羽黒46 他 | 有機農産物 | 福島県認定第19号 |
| 相馬有機推進の会　若松清一 | 前の田上　他 | 福島県相馬市山上字堀坂73-2　他 | 有機農産物 | 福島県認定第24号 |
| 成田有機農園　成田 守 | 上の水田の西　他 | 福島県郡山市日和田町字鶴見坦128　他 | 有機農産物 | 福島県認定第27号 |
| ゆず太郎の郷　松本広行 | 柚子南　他 | 福島県双葉郡楢葉町大字井出字槻26　他 | 有機農産物 | 福島県認証第43号 |
| 猪苗代ブルーベリーれいちゃん農場　野矢 健正 | ブルーベリー園１ | 福島県耶麻郡猪苗代町大字川桁字林口2 | 有機農産物 | 福島県認定第47号 |
| アクツフーズ(株) | アクツフーズ（株）第一工場・倉庫　他 | 福島県石川郡古殿町竹貫字千足52・54・56　他 | 有機加工食品 | JA090915PR-1087-0 |

## Categorías infrarrepresentadas — pasada 2026-08-10

- CSV destino: `data/csv/jp/tohoku/fukushima.csv`.
- Alcance: categorías con poca o ninguna fila en el catálogo japonés (queso, cerveza artesana, condimentos, aceite, conservas, fruta, dulces, vino). No toca `Sake` ni `Destilados y licores`.
- Fuentes de esta tanda:
  - **JBA** — 全国地ビール醸造者協議会 — 会員リスト, <http://www.beer.gr.jp/member/>
  - **JWA** — 日本ワイナリー協会 — ワイナリーマップ, <https://www.winery.or.jp/winery-map/>
  - **Shokunin** — 職人醤油 — 提携蔵元一覧, <https://s-shoyu.com/kuramoto-list/>
- Estado: revisión cerrada el 2026-08-10; **1** casos retenidos con motivo individual y sin publicar.

| nombre (fuente) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 清水産業 (猪苗代ビール) | Inawashiro | Cerveza | JBA | — | sin dominio en la fuente; revisado 2026-08-10: el padrón confirma el nombre, pero falta una fuente primaria actual que atribuya la cerveza a esta unidad |

## Categorías infrarrepresentadas — 2ª pasada 2026-08-10

- CSV destino: `data/csv/jp/tohoku/fukushima.csv`.
- Alcance: verticales que el catálogo japonés casi no tiene y que en Japón son evidentes — dulce tradicional, senbei/arare, fideo seco, pescado elaborado, té, seta, embutido, miel, conserva y fruta. Fuera `Sake` y `Destilados y licores`; fuera también cerveza y vino, que los barrió la pasada anterior del mismo día.
- Fuentes de esta tanda:
  - **全国和菓子協会** — 会員店リンク, <https://www.wagashi.or.jp/zenkoku_link/fukushima.php> (nombre, dirección y web propia de cada socio)
  - **全国乾麺協同組合連合会** — 製麺技士の居る工場一覧, <https://www.kanmen.com/factory/>
- Estado: **21 `unverified`** (2026-08-10). Deduplicados por dominio contra el CSV en HEAD. `municipio` va en japonés porque es lo que publica la fuente: el rōmaji es trabajo de la integración, no de esta nota.

| nombre (社名) | municipio | categoría | fuente | web | notas |
|---|---|---|---|---|---|
| 大正堂製菓 | いわき市 | Dulces y repostería | 和菓子協会 | https://www.instagram.com/taishodo1967/ | いわき市錦町江栗 2-31 |
| みよし | いわき市 | Dulces y repostería | 和菓子協会 | https://j-miyoshi.jp/index.html | いわき市平谷川瀬 1-11-3 |
| 玉家玉振堂 | 二本松市 | Dulces y repostería | 和菓子協会 | https://gtamaya.com/ | 二本松市竹田 1-77 |
| 玉嶋屋 | 二本松市 | Dulces y repostería | 和菓子協会 | https://tamasimaya.com/ | 二本松市本町 1-88 |
| 四季菓匠長岡家 | 会津坂下町 | Dulces y repostería | 和菓子協会 | https://www.wagashi-nagaokaya.jp/ | 河沼郡会津坂下町字逆水 23-2 |
| 太郎庵 | 会津坂下町 | Dulces y repostería | 和菓子協会 | https://www.taroan.co.jp/ | 河沼郡会津坂下町福原前 4108-1 |
| 熊野屋 | 会津若松市 | Dulces y repostería | 和菓子協会 | https://kumadango.net/ | 会津若松市日新町 12-23 |
| 手づくり菓子工房 大野屋 | 桑折町 | Dulces y repostería | 和菓子協会 | https://r.goope.jp/ohnoya/ | 伊達郡桑折町本町 3 |
| 日乃出屋物産店 | 猪苗代町 | Dulces y repostería | 和菓子協会 | http://www.oishisazukuri.com/ | 耶麻郡猪苗代町大字蚕養字沼尻山甲 2855-131 |
| 白河菓匠大黒屋 | 白河市 | Dulces y repostería | 和菓子協会 | http://www.s-daikokuya.jp/ | 白河市中町 44 |
| 船橋屋製菓 | 相馬市 | Dulces y repostería | 和菓子協会 | https://www.cestsibon.jp/funabashiya.html | 相馬市中村字大町 73 |
| 福々和本舗 | 福島市 | Dulces y repostería | 和菓子協会 | https://fuku29.co.jp/ | 福島市松浪町 4-18 |
| 松屋清風庵 | 福島市 | Dulces y repostería | 和菓子協会 | https://fukushima028.wixsite.com/matsuya-seihuan | 福島市北町 3-43 |
| 柏屋 | 郡山市 | Dulces y repostería | 和菓子協会 | https://www.usukawa.co.jp/ | 郡山市富久山町久保田字宮田 127-5 |
| 丹波家柿羊羹本舗 | 郡山市 | Dulces y repostería | 和菓子協会 | http://tadafuku.com/shop/tanbaya/ | 郡山市咲田 1-16-5 |
| 郡山銘菓庵大黒屋 | 郡山市 | Dulces y repostería | 和菓子協会 | https://www.koriyama-daikokuya.com/ | 郡山市中町 14-8 |
| お菓子処かど屋 | 郡山市 | Dulces y repostería | 和菓子協会 | https://r.goope.jp/kadoya-nakata/ | 郡山市中田町高倉字下ノ沢 84 |
| かんのや | 郡山市 | Dulces y repostería | 和菓子協会 | https://www.yubeshi.co.jp/ | 郡山市西田町大田字宮木田 3 |
| ㈱奈良屋 | 南会津町 | Pan y cereal | 全乾麺 | https://www.naraya-soba.com/ | 機械製乾めん |
| 池田食品工業㈱ | 福島市 | Pan y cereal | 全乾麺 | http://menno-ikeda.co.jp/ | 機械製乾めん |
| ㈱あらい屋製麺所 | 郡山市 | Pan y cereal | 全乾麺 | http://www.araiya.net/ | 機械製乾めん |

## Venta directa — 3ª pasada 2026-08-10

- CSV destino: `data/csv/jp/tohoku/fukushima.csv`.
- Fuente: **食べチョク**, ficha por productor bajo <https://www.tabechoku.com/producers/fukushima> (listado y ficha leídos el 2026-08-10).
- Techo de la fuente: es un mercado de venta directa, no un padrón. Sostiene identidad, municipio, catálogo de productos y **que el productor vende hoy y lo hace él mismo** — justo lo que un registro no prueba. Lo que no da es el dominio propio: cosecharlo sigue siendo el paso previo a cada alta.
- **22 de 22** llevan la categoría cerrada contra los productos que el productor tiene a la venta; el resto sale de su descripción y queda como provisional. `⚠ por decidir` es que ninguna de las dos daba.
- Mezcla: Fruta y verdura 10, Pan y cereal 5, Miel 2, Huevos 1, Setas 1, Condimentos 1, Aceite 1, Conservas 1.
- Estado: **22 `unverified`** (2026-08-10). Deduplicados por nombre normalizado contra el CSV y contra las tablas anteriores de esta prefectura.

| nombre | municipio | categoría | cerrada por | productos a la venta | ficha | notas |
|---|---|---|---|---|---|---|
| 滝桜湖養蜂 滝桜湖つみとりブルーベリー園 | 三春町 | Miel | productos | 【令和7年新蜜です】国産純粋生はちみつ【アカシア蜜】1000ｇ | https://www.tabechoku.com/producers/21208 | 福島県田村郡三春町 |
| 郡山あさか野養蜂場 | 郡山市 | Miel | productos | 【非加熱・無添加】すっきりした甘さ 初夏の百花蜜 150ｇ · 【非加熱・無添加】秋の花たちが奏でる濃密なひとしずく 秋の百花蜜 150g · 【非加熱・無添加】春の香り、ぎゅっと 春の百花蜜 150g | https://www.tabechoku.com/producers/3078130 | 福島県郡山市 |
| おさんぽたまご | 伊達市 | Huevos | productos | 燻製玉子24玉（鶏卵の燻製玉子６個入４パック） · 鶏卵三種４パック(生卵２パック・温泉玉子１パック・燻製玉子１パック) | https://www.tabechoku.com/producers/29598 | repr. 三浦一義 |
| 浜福青果 | 福島市 | Setas | productos | 肉厚ぷりぷり！しいたけたっぷり1kg+おまけ50g | https://www.tabechoku.com/producers/3077708 |  |
| 肉の秋元本店 | 白河市 | Condimentos | productos | 【御中元ギフト】牛タンの三五八漬け 500g入り · 清流豚セット（豚バラブロック1kg・豚肩ロースブロック1kg） · 【白河高原清流豚】バラブロック 1kg | https://www.tabechoku.com/producers/21221 |  |
| 桐の里産業 | 三島町 | Aceite | productos | えごま油(100g)３本セット 三島町産えごまを100％使用！生絞り · 始めよう。健康への新習慣！三島町産えごまを100％使用！生絞り えごま油 ( · 【お試しサイズ】始めよう！健康への新習慣！三島町産えごまを100％使用！生絞 | https://www.tabechoku.com/producers/22557 | 福島県大沼郡三島町 |
| おびすや | 相馬市 | Conservas | productos | 【生食感】おびすやの青のり佃煮食べ比べ 180g×各2p · 【生食感】おびすやの青のり佃煮アサリ入り180g×4p · 【生食感】おびすやのピリカラ青のり佃煮 180g×4p | https://www.tabechoku.com/producers/3078559 | repr. 久田則雄 |
| Bellファーム | 会津若松市 | Pan y cereal | productos | 会津米 令和7年産 虹のきらめき 10キロ （玄米） · 会津米 令和7年産 虹のきらめき 中米 10㎏ （白米） · 会津米 令和7年産 虹のきらめき 10キロ （白米） | https://www.tabechoku.com/producers/3078656 |  |
| 大和川ファーム | 喜多方市 | Pan y cereal | productos | 雪蔵銀ぴか米ミルキークイーン（10kg） · 雪蔵銀ぴか米（ミルキークイーン）5㎏ · 【R8年産新米予約】雪蔵銀ぴか米ミルキークイーン（10kg） | https://www.tabechoku.com/producers/26013 | premio 食べチョクAWARD |
| 西村農園 | 大玉村 | Pan y cereal | productos | 大玉村で育てたる美味しいお米 コシヒカリ 精米5キロ · 新米大玉村で育てたる美味しいお米 コシヒカリ 精米5kg×2袋 | https://www.tabechoku.com/producers/23242 | 福島県安達郡大玉村 |
| グルテンフリーお米のパン工房穂鹿 | 天栄村 | Pan y cereal | productos | グルテンフリー 自然栽培米パン（1斤） · グルテンフリー 自然栽培米パン おすすめ3種セット （プレーン 玄米 砂糖不 · グルテンフリー 自然栽培玄米パン（1斤） | https://www.tabechoku.com/producers/27044 |  |
| 会津猪苗代カンダファーム | 猪苗代町 | Pan y cereal | productos | 【新米予約】ギネス「世界最高米®」原料米認定 白米5キロ 会津産ゆうだい21 · 【新米予約】ギネス認定「世界最高米®」会津産ゆうだい21 白米2キロ 2年連 · 【新米予約】ギネス認定「世界最高米®」2年連続日本一！会津産ゆうだい21【令 | https://www.tabechoku.com/producers/29277 |  |
| フェルムナチュレール・コクブン | 伊達市 | Fruta y verdura | productos | 【再販 数量限定】自然栽培のフランボワーズ (ラズベリー)シロップ · 初物！【ポケットボトル】自然栽培エルダーフラワーのコーディアルシロップ · 【国内希少！】自然栽培の桃のコンフィチュール | https://www.tabechoku.com/producers/20430 |  |
| 三栗野むぎ農園 | 国見町 | Fruta y verdura | productos | 【定期便】旬の野菜セット(定番野菜・イタリア野菜)箱込み1.8kg · 新鮮ツヤツヤのズッキーニ【ゼルダ緑・ジャッロ黄・ライム浅緑】300g×6p · 大入りズッキーニ【ゼルダ緑・ジャッロ黄・ライム薄緑・パリーノ丸】350g×1 | https://www.tabechoku.com/producers/28597 | repr. 三栗野祐司; 福島県伊達郡国見町 |
| まるとう果樹園 | 国見町 | Fruta y verdura | productos | 福島県産モモ『川中島白桃』贈答用5ｋｇ １３～１８玉 クール便 【夏ギフト】 · 福島県産モモ『川中島白桃』贈答用2ｋｇ 6玉 【夏ギフト】 · 福島県産モモ『川中島白桃』贈答用3ｋｇ 9～12玉 クール便 【夏ギフト】 | https://www.tabechoku.com/producers/3079118 | repr. 佐藤　勇輝; 福島県伊達郡国見町 |
| アグリパークとみおか | 富岡町 | Fruta y verdura | productos | 【高糖度｜JGAP取得】完熟シャインマスカット特選３房(500ｇ×3房) · 【高糖度｜JGAP取得】完熟シャインマスカット ２房（５００ｇ×２房） · 【高糖度｜JGAP取得】完熟シャインマスカット お試し1房(500ｇ×1房) | https://www.tabechoku.com/producers/3078744 | repr. 新妻哲二; 福島県双葉郡富岡町大字本岡字本町西632‐1 |
| HANA-MASA | 猪苗代町 | Fruta y verdura | productos | 【朝どれ】フルーツとうもろこし『あまいんです』20本 希少な１番果のみを厳選 · 【朝どれ】フルーツとうもろこし『あまいんです』10本 希少な１番果のみを厳選 · 甘い！雪下キャベツ 5ｋｇ（3-4玉） | https://www.tabechoku.com/producers/28649 | repr. 渡部雅幸 |
| 大野農園 | 石川町 | Fruta y verdura | productos | 【まどか・3kg程度】パリッと硬くて甘くて味が濃い！ · 【梨：幸水・2kg程度】濃厚な甘く瑞々しい和梨 · 【あかつき・2kg程度】人気NO１！福島県のブランド桃 | https://www.tabechoku.com/producers/21306 | repr. 大野栄峰; premio 食べチョクAWARD; 福島県石川郡石川町 |
| まるせい果樹園 | 福島市 | Fruta y verdura | productos | （2026年 予約販売）【朝どれ】お買い得!まるせい果樹園の桃 晩生種【おま · （2026年 予約販売）【夏ギフト】 【朝どれ】 まるせい果樹園の桃【ゆうぞ · （2026年 予約販売） 【朝どれ】まるせい果樹園の桃 梨と桃の詰め合わせ  | https://www.tabechoku.com/producers/27869 | premio 食べチョクAWARD |
| 菱沼農園 | 福島市 | Fruta y verdura | productos | 桃名人厳選 桃【ご家庭用 訳あり商品】白桃約3ｋｇ(8-12玉） · 桃名人厳選 桃【ご家庭用 訳あり商品】白桃約2ｋｇ(5-9玉） · 桃名人厳選 桃 『川中島白桃』2ｋｇ（5-8玉） | https://www.tabechoku.com/producers/20876 | premio 食べチョクAWARD |
| 須藤農彩園 | 郡山市 | Fruta y verdura | productos | 採りたて！シャキシャキ美味いつるありインゲン たっぷり1kg/ · お子さんもパクパク沢山食べちゃう甘いミディトマト フルティカ 1.8kg | https://www.tabechoku.com/producers/24205 | repr. 須藤佳英; 福島県郡山市 |
| 母の味　阿部農縁 あべのうえん | 須賀川市 | Fruta y verdura | productos | 【あかつき】3ｋｇ（8～12玉） 福島の完熟もも · 【あかつき】2ｋｇ（6～9玉） 福島の完熟もも · 【新じゃが】ほくほく男爵いも 2kg｜肉じゃが・ポテトサラダ・カレーに！ | https://www.tabechoku.com/producers/24408 | repr. 寺山　佐智子 |
