# Gifu — candidatos

- CSV: `data/csv/jp/chubu/gifu.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/gifu> (58 bodegas, leído 2026-08-04). Gremio: 岐阜県酒造組合, <http://www.gifu-sake.or.jp/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Oita Shuzoten | 老田酒造店 | Takayama |
| Kawajiri Shuzojo | 川尻酒造場 | Takayama |
| Kaba Shuzojo | 蒲酒造場 | Hida |
| Otsubo Shuzoten | 大坪酒造店 | Hida |
| Okuhida Shuzo | 奥飛騨酒造 | Gero |
| Iwamura Jozo | 岩村醸造 | Ena |
| Ena Jozo (Sango) | 恵那醸造 三郷工場 | Ena |
| Ena Jozo | 恵那醸造 | Nakatsugawa |
| Ohashi Shuzo | 大橋酒造 | Nakatsugawa |
| Adachi Shuzo | 足立酒造 | Gifu |
| Ikedaya Shuzo | 池田屋酒造 | Ibigawa ⚠ |
| Otsuka Shuzo | 大塚酒造 | Ikeda ⚠ |
| Kikukawa | 菊川 | Kakamigahara |
| Gyokusendo Shuzo | 玉泉堂酒造 | Yoro |

## Trampas
- ⚠ **池田屋酒造 (Ibigawa, Gifu)** no es 池田屋酒造 (Itoigawa, Niigata), la de
  謙信, ya en `niigata.md`. Mismo 社名, dos empresas.
- ⚠ **大塚酒造 (Ikeda, Gifu)** no es 大塚酒造 (Komoro, Nagano), ya en `nagano.md`.
  Misma trampa. Y **池田町 (Ikeda)** existe además en Nagano y Fukui.
- **恵那醸造 son dos entradas y una empresa**: sede en Nakatsugawa y 三郷工場 en
  Ena. Una fila, en el municipio donde produce — no dos.
- **`mino` ya está desambiguado** en `data/reference/municipality-overrides.json`
  frente a su homónimo español (`AGENTS.md` de Japón): las filas de 美濃市 pasan
  el gate sin tocar nada.
- 揖斐郡 y 養老郡 no son municipio: la fila lleva el 町.

## Qué falta
- Las ~44 bodegas restantes del censo, y **Hida/Takayama concentra las más
  visitables** (varias con tienda propia y venta online: pool de alto valor).
- Sin abrir: **飛騨牛** (una de las tres grandes carnes de Japón, con marca
  registrada y ganaderías identificables), 富有柿 de Motosu, 朴葉味噌, 鮎 del
  Nagara (pesca con cormorán, patrimonio), 和菓子 de Gifu, 岐阜提灯 (no alimentario).
