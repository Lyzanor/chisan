# Hyogo — candidatos

- CSV: `data/csv/jp/kansai/hyogo.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: 灘五郷酒造組合 (Nada Gogo Sake Brewers Association), <https://www.nadagogo.ne.jp/brewery/> — los 25 miembros (24 de sake, 1 de encurtidos), agrupados por los cinco 郷.
- Estado: cola abierta, 25 sin integrar (2026-08-04). **Ninguna entró en el CSV**: el gremio no publica el dominio de sus socios y una fila sin ningún enlace no aporta.

Nada es la mayor zona sakera de Japón y toda ella cae en dos municipios:
神戸市 (Kobe) y 西宮市 (Nishinomiya). Los cinco 郷 son barrios, no municipios:
西郷/御影郷/魚崎郷 están en Kobe (灘区 y 東灘区), 西宮郷/今津郷 en Nishinomiya.
Para el CSV, `municipio` = `Kobe` o `Nishinomiya`.

Categoría: `Sake` salvo la última fila.

| nombre (rōmaji propuesto) | 社名 | marca | 郷 | municipio |
|---|---|---|---|---|
| Sawanotsuru | 沢の鶴 | 沢の鶴 | 西郷 | Kobe |
| Hakutsuru Shuzo | 白鶴酒造 | 白鶴 | 御影郷 | Kobe |
| Kikumasamune Shuzo | 菊正宗酒造 | 菊正宗 | 御影郷 | Kobe |
| Kenbishi Shuzo | 剣菱酒造 | 剣菱 | 御影郷 | Kobe |
| Kobe Shushinkan | 神戸酒心館 | 福寿 Fukuju | 御影郷 | Kobe |
| Izumi Shuzo | 泉酒造 | 仙介・琥泉 | 御影郷 | Kobe |
| Yasufuku Matashiro Shoten | 安福又四郎商店 | 大黒正宗 | 御影郷 | Kobe |
| Ota Shuzo | 太田酒造 | 千代田蔵 | 魚崎郷 | Kobe ⚠ |
| Takara Shuzo | 宝酒造 | 松竹梅 | 魚崎郷 | Kobe ⚠ |
| Hamafukutsuru Meijo | 浜福鶴銘醸 | 浜福鶴 | 魚崎郷 | Kobe |
| Sakuramasamune | 櫻正宗 | 櫻正宗 | 魚崎郷 | Kobe |
| Nihonsakari | 日本盛 | 日本盛 | 西宮郷 | Nishinomiya |
| Kokusan Shuzo | 國産酒造 | 灘自慢 Nadajiman | 西宮郷 | Nishinomiya |
| Kitani Shuzo | 木谷酒造 | 喜一 Kiichi | 西宮郷 | Nishinomiya |
| Motonoda Shuzo | 本野田酒造 | 金鷹 Kintaka | 西宮郷 | Nishinomiya |
| Hakutaka | 白鷹 | 白鷹 | 西宮郷 | Nishinomiya |
| Tatsuuma-Honke Shuzo | 辰馬本家酒造 | 白鹿 Hakushika | 西宮郷 | Nishinomiya |
| Shochikubai Shuzo | 松竹梅酒造 | 灘一 Nadaichi | 西宮郷 | Nishinomiya ⚠ |
| Osawa Honke Shuzo | 大澤本家酒造 | 寳娘 Takaramusume | 西宮郷 | Nishinomiya |
| Kitayama Shuzo | 北山酒造 | 島美人 Shimabijin | 西宮郷 | Nishinomiya |
| Mandai Osawa Jozo | 万代大澤醸造 | 德若 Tokuwaka | 西宮郷 | Nishinomiya |
| Ozeki | 大関 | 大関 | 今津郷 | Nishinomiya |
| Imazu Shuzo | 今津酒造 | 扇正宗 Ogimasamune | 今津郷 | Nishinomiya |
| Takashima Shurui Shokuhin | 髙嶋酒類食品 | 甲南漬 Konanzuke | 御影郷 | Kobe — categoría `Condimentos` (encurtidos en sake kasu, no bodega) |

⚠ Antes de dar de alta:
- **太田酒造** tiene su sede en 草津市 (Shiga) y en Nada opera el 灘工場; **宝酒造**
  tiene sede en Kioto. Si la unidad de Nada no es una entidad con marca e
  identidad propias, la fila correcta puede ser la de su prefectura de origen, no
  Hyogo. Verificar antes de meterlas aquí (`docs/EDITORIAL_POLICY.md`, grupos).
- **松竹梅酒造** (marca 灘一, Nishinomiya) es empresa distinta de **宝酒造** (marca
  松竹梅). Nombres casi idénticos: no fusionar filas.

## Qué falta
- Hyogo es mucho más que Nada: falta el resto del gremio prefectural
  (兵庫県酒造組合連合会, <https://hyogo-sake.or.jp/>), que agrupa las otras zonas
  (播州, 但馬, 丹波…). Ese listado es el siguiente lote natural.
- Sin abrir: carne de Tajima/Kobe, 明石 pescado, 淡路 cebolla, soja/miso.
