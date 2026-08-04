# Aomori — candidatos

- CSV: `data/csv/jp/tohoku/aomori.csv` (0 filas). Dedup: nada que cruzar en el CSV.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/aomori> (20 bodegas, leído 2026-08-04), contrastado con 酒蔵プレス <https://www.sakagura-press.com/sakebrewery/aomori-sake_14th/>. Gremio: 青森県酒造組合, <http://www.aomori-sake.or.jp/> (no resolvía por HTTPS el 2026-08-04, ver README).
- Estado: cola abierta, 15 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Nishida Shuzoten | 西田酒造店 | Aomori |
| Miura Shuzo | 三浦酒造 | Hirosaki |
| Rikka Shuzo | 六花酒造 | Hirosaki |
| Matsumidori Shuzo | 松緑酒造 | Hirosaki |
| Kaneta Tamada Shuzoten | カネタ玉田酒造店 | Hirosaki |
| Shirakami Shuzo | 白神酒造 | Hirosaki |
| Marutake Shuzoten | 丸竹酒造店 | Hirosaki |
| Yoshii Shuzo | 吉井酒造 | Hirosaki |
| Narumi Jozoten | 鳴海醸造店 | Kuroishi |
| Nakamura Kamekichi | 中村亀吉 | Kuroishi |
| Hato Masamune | 鳩正宗 | Towada |
| Momokawa | 桃川 | Oirase |
| Morita Shobei | 盛田庄兵衛 | Shichinohe |
| Sekinoi Shuzo | 関乃井酒造 | Mutsu |
| Takenami Shuzoten | 竹浪酒造店 | Tsugaru |
| Ozaki Shuzo | 尾崎酒造 | Ajigasawa |
| Kikukoma Shuzo | 菊駒酒造 | Gonohe |

## Trampas
- **八戸酒造 (Hachinohe Shuzo, Hachinohe)** ya está en la bandeja del `README.md`
  de esta carpeta: no volver a proponerla como nueva.
- **合同酒精 八戸工場** y **八戸酒類 (五戸工場 / 八鶴工場)** son plantas de un
  grupo, no bodegas con identidad propia. Triar antes de escribir fila: la
  unidad correcta puede ser el grupo en otra prefectura.
- Las dos fuentes discrepan en municipio para varias: SAKETIMES da 尾崎酒造 en
  「青森市・鰺ヶ沢町」 y 酒蔵プレス no lo sitúa. Manda dónde produce.

## Qué falta
- Las 3-5 bodegas restantes del censo.
- Sin abrir: manzana de Hirosaki (la primera de Japón y no hay ninguna fila),
  sidra, ajo de Takko, vieira y atún de Ōma, 煎餅 de Nanbu.
