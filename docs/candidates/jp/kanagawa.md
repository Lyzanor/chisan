# Kanagawa — candidatos

- CSV: `data/csv/jp/kanto/kanagawa.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/kanagawa> (13 bodegas, censo completo). Gremio: 神奈川県酒造組合, <http://www.kanagawa-jizake.or.jp/>.
- Estado: cola abierta, 13 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Las 13 bodegas de Kanagawa están en el **oeste rural** (Ashigara, Hadano, Atsugi)
y ninguna en Yokohama ni Kawasaki. Categoría: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Izumibashi Shuzo | 泉橋酒造 | Ebina |
| Kumazawa Shuzo | 熊澤酒造 | Chigasaki |
| Kikkawa Jozo | 吉川醸造 | Isehara |
| Kanai Shuzoten | 金井酒造店 | Hadano |
| Koganei Shuzo | 黄金井酒造 | Atsugi |
| Oyataka Shuzo | 大矢孝酒造 | Aikawa |
| Kubota Shuzo | 久保田酒造 | Sagamihara |
| Shimizu Shuzo | 清水酒造 | Sagamihara |
| Ishii Jozo | 石井醸造 | Oi |
| Inoue Shuzo | 井上酒造 | Oi |
| Kawanishiya Shuzoten | 川西屋酒造店 | Yamakita |
| Seto Shuzoten | 瀬戸酒造店 | Kaisei |
| Nakazawa Shuzo | 中澤酒造 | Matsuda |

## Trampas
- **熊澤酒造 (Chigasaki)** hace sake *y* 湘南ビール: es **una fila**, con la
  `categoria` que pese, no dos (misma regla que Kiuchi en `ibaraki.md`).
- 足柄上郡 y 愛甲郡 no son municipio: la fila lleva el 町 — Oi, Yamakita, Kaisei,
  Matsuda, Aikawa. **石井醸造 e 井上酒造 comparten municipio (Oi)** y apellido
  parecido: casar por 社名.
- **久保田酒造 (Sagamihara)** no es 久保田 (marca de 朝日酒造, Nagaoka, Niigata) ni
  窪田酒造 (Noda, Chiba). Tres cosas distintas con el mismo rōmaji.

## Qué falta
- Ninguna: el censo de sake está completo aquí. Lo que falta es todo lo demás.
- Sin abrir: 湘南 pescado (shirasu de Enoshima), 三浦 verdura (daikon, col),
  **ternera de Yokohama**, 崎陽軒/中華街 (comida preparada), 小田原 kamaboko y
  himono (un gremio propio y bien documentado), té de Ashigara, 足柄 wasabi.
