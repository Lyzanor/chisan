# Tokyo — candidatos

- CSV: `data/csv/jp/kanto/tokyo.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/tokyo> (11 bodegas, censo completo). Gremio: 東京都酒造組合, <http://www.tokyosake.or.jp/>.
- Estado: cola abierta, 11 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Tokio tiene 11 bodegas y diez de ellas están en el **Tama occidental**, no en la
ciudad: es agricultura de montaña a una hora de Shinjuku. Categoría: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Ishikawa Shuzo | 石川酒造 | Fussa |
| Tamura Shuzojo | 田村酒造場 | Fussa |
| Ozawa Shuzo | 小澤酒造 | Ome |
| Ozawa Shuzojo | 小澤酒造場 | Hachioji |
| Maihime / Tokyo Hachioji Shuzo | 舞姫（東京八王子酒造） | Hachioji |
| Toshimaya Shuzo | 豊島屋酒造 | Higashimurayama |
| Nakamura Shuzo | 中村酒造 | Akiruno |
| Nozaki Shuzo | 野﨑酒造 | Akiruno |
| Noguchi Shuzoten | 野口酒造店 | Fuchu |
| Wakamatsu / Tokyo Port Brewery | 若松（東京港醸造） | Minato |
| Koyama Shuzo | 小山酒造 | Kita ⚠ |

## Trampas
- **Tokio no es un municipio.** Ya avisado en el `README.md` de esta carpeta: el
  `municipio` es el barrio especial (`Kita`, `Minato`) o la ciudad del Tama
  (`Fussa`, `Ome`, `Hachioji`, `Akiruno`, `Fuchu`, `Higashimurayama`). Nunca
  «Tokyo» a secas.
- ⚠ **小山酒造 (Kita, marca 丸真正宗)** dejó de elaborar. Un listado la sigue
  arrastrando; **exige evidencia reciente** antes de escribir la fila — y si
  confirmadamente cesó, es purga documentada, no `parcial`.
- **小澤酒造 (Ome, marca 澤乃井) y 小澤酒造場 (Hachioji, marca 桑の都)** son dos
  empresas distintas del mismo apellido. No fusionar.
- **東京港醸造 (Minato)** elabora en un edificio de cuatro plantas en Shibadaimon:
  es real y es la única bodega del centro. No descartarla por «no puede haber una
  bodega ahí».
- **Minimal Bean to Bar Chocolate** sigue en la bandeja del `README.md` sin barrio
  resuelto: es candidata de Tokio y se cierra resolviendo eso.

## Qué falta
- Nada de fuera del sake: falta **té de Tama**, wasabi de Okutama, 小松菜 (que
  toma el nombre de Komatsugawa, Edogawa), 江戸前 海苔 y pescado, y **las islas**
  — Ogasawara (café y el cacao de Hahajima, ver `saitama.md`), Hachijojima,
  Izu-Oshima (sal, ashitaba) — que son Tokio y no aparecen por ningún lado.

## Lote JAS ecológico nacional — 2026-08-08

Veinte candidatos adicionales, sin coincidencia normalizada con el CSV ni con las tablas anteriores de esta prefectura. Fuente principal: registro vigente de operadores con certificación orgánica JAS del Ministerio de Agricultura (MAFF), estado a 2026-06-30: <https://www.maff.go.jp/j/jas/attach/xls/jas_business_operators-148.xlsx>. Se han retenido únicamente `認証生産行程管理者` (responsables certificados del proceso de producción) con centro productivo en la prefectura y certificación de producto agrícola, ganadero o alimento transformado; se excluyeron importadores y meros fraccionadores. La certificación y la dirección del centro son evidencia de descubrimiento, no sustituyen la comprobación de identidad pública, actividad actual, productos concretos, municipio vigente ni canal de venta.

| Nombre oficial del operador | Centro productivo declarado | Dirección del centro | Tipo JAS | Nº de certificación |
|---|---|---|---|---|
| 横井醸造工業（株）　他 | 横井醸造工業（株）　他 | 東京都江東区新木場4-2-17　他 | 有機加工食品 | 第1053号 |
| 恵泉女学園大学 | 恵泉女学園大学　教育農場 | 東京都町田市小野路字笠松4007、4004-1、4004-2 | 有機農産物 | 01-043 |
| 丸成商事株式会社 | 丸成商事株式会社　本社工場　他 | 東京都練馬区豊玉北1-5-3　他 | 有機加工食品 | 第1169号 |
| 株式会社　遠藤製餡　東村山工場 | （株）遠藤製餡　東村山工場　他 | 東京都東村山市久米川町5-36-5　他 | 有機加工食品 | JE000912-PR0024-0 |
| （株）保谷納豆 | （株）保谷納豆　東村山工場 | 東京都東村山市青葉町2-39-9 | 有機加工食品 | 第1013号 |
| （有）菅谷食品　青梅工場 | （有）菅谷食品　青梅工場 | 東京都青梅市友田町1-1010-1 | 有機加工食品 | JS010228PR-0305-0 |
| 第一コーヒー株式会社 | 第一コーヒー株式会社 他 | 東京都港区東麻布3-10-1 | 有機加工食品 | 第1046号 |
| （株）珈琲実験室 | （株）珈琲実験室他 | 東京都八王子市大和田町2-19-11他 | 有機加工食品 | JK010228PR-0326-0 |
| ロストロジャパン | ロストロジャパン | 東京都渋谷区富ヶ谷１－１４－２０　サウスピア１０Ｂ | 有機加工食品 | カ-07-08 |
| 海の精株式会社 | 海の精株式会社元町工場 | 東京都大島町元町５７５ | 有機加工食品 | カ-08-09 |
| 株式会社　リアルフーズ | 株式会社　リアルフーズ | 東京都大田区大森東２－２６－２８ | 有機加工食品 | カ-09-01 |
| 丸和食品株式会社 | 丸和食品株式会社 | 東京都練馬区富士見台4 ‐1 2 ‐1 1 | 有機加工食品 | AFASSEQ-AP-090801 |
| 株式会社ピーエスアイ | 株式会社ピーエスアイ | 東京都大田区東糀谷4-3-16 | 有機加工食品 | 10-059B |
| 株式会社リーフル | 株式会社リーフル | 東京都杉並区阿佐ヶ谷南1丁目8番5号　OSAWAビル | 有機加工食品 | MPJP1681 |
| 株式会社マゴメ | 株式会社マゴメ　本社工場　他 | 東京都八王子市千人町4-9-22 | 有機加工食品 | AFASSEQ-AP-120401 |
| 薬糧開発株式会社　セントラルキッチン | 薬糧開発株式会社　他 | 東京都大田区東糀谷1丁目5番地13号　他 | 有機加工食品 | MPJP1721 |
| ヤナガワファーム | 河村松本　他 | 東京都青梅市今井5-2440-30　他 | 有機農産物 | A13-062801 |
| 株式会社生活の木 | 株式会社生活の木　他 | 東京都渋谷区神宮前6-3-8他 | 有機加工食品 | AFASSEQ-AP-140601 |
| 株式会社大和 | 株式会社大和　商品室 | 東京都中央区日本橋堀留町1-10-19第一川端ビル6階 | 有機加工食品 | B14-072501 |
| 世田谷畑人 | B　他 | 東京都世田谷区大蔵1-256-1　他 | 有機農産物 | A16-042801 |
