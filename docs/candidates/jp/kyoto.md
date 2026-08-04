# Kioto — candidatos

- CSV: `data/csv/jp/kansai/kyoto.csv` (15 filas, la única prefectura de Japón revisada fila a fila). Dedup hecho: quedan fuera 佐々木酒造 (Sasaki), 向井酒造 (Mukai), 玉乃光 (Tamanohikari) y 白嶺 (Hakurei), ya en el CSV.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/kyoto> (51 bodegas, leído 2026-08-04). Gremio: 京都府酒造組合, <http://kyoto-sake.sakura.ne.jp>.
- Estado: cola abierta, 15 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Kioto es la segunda zona sakera de Japón por volumen (Fushimi), y el CSV solo
tiene tres bodegas. Categoría para todas: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Gekkeikan | 月桂冠 | Kyoto (伏見) |
| Kizakura | 黄桜 | Kyoto (伏見) |
| Kitagawa Honke | 北川本家 | Kyoto (伏見) |
| Kinshi Masamune | キンシ正宗 | Kyoto |
| Saito Shuzo | 齊藤酒造 | Kyoto |
| Shotoku Shuzo | 招德酒造 | Kyoto (伏見) |
| Kyohime Shuzo | 京姫酒造 | Kyoto (伏見) |
| Kyodo Shuzo | 共同酒造 | Kyoto |
| Koyama Honke Shuzo | 小山本家酒造 | Kyoto ⚠ |
| Joyo Shuzo | 城陽酒造 | Joyo |
| Oishi Shuzo | 大石酒造 | Kameoka |
| Kinoshita Shuzo | 木下酒造 | Kyotango |
| Kumano Shuzo | 熊野酒造 | Kyotango |
| Ikeda Shuzo | 池田酒造 | Maizuru |
| Shiraito Shuzo | 白糸酒造 | Miyazu |

## Trampas
- ⚠ **小山本家酒造** tiene su sede en **さいたま市 (Saitama)** — está en
  `saitama.md` — y en Fushimi opera una planta. Si la unidad de Kioto no tiene
  marca e identidad propias, la fila correcta es la de Saitama, no ésta
  (`docs/EDITORIAL_POLICY.md`, grupos).
- **伏見 (Fushimi) es un 区 de la ciudad de Kioto**, no un municipio: la fila lleva
  `Kyoto`. Lo mismo que ya se resolvió para Uji y las casas de té del CSV.
- **月桂冠 y 黄桜** son grupos grandes con distribución nacional: entran por
  terroir e identidad propia, no se descartan por tamaño, pero conviene decidirlo
  explícitamente y no por inercia.
- **木下酒造 (Kyotango, marca 玉川)** no es 木下醸造所 (Taragi, Kumamoto), que está
  en `kumamoto.md`.
- 京丹後市 y 宮津市 son el **norte marítimo** (Tango), a 100 km de Fushimi: no
  asumir que «Kioto» es la ciudad al geocodificar.

## Qué falta
- Las ~36 bodegas restantes del censo.
- El CSV de Kioto ya cubre bien té (Uji), condimentos y dulces. Sin abrir:
  **京野菜** (verdura tradicional con marca propia y productores identificables),
  湯葉/豆腐, 京漬物 más allá de las dos casas ya presentes, y **sake de Tango**,
  que es una zona distinta de Fushimi y no aparece en el CSV.
