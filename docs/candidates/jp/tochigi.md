# Tochigi — candidatos

- CSV: `data/csv/jp/kanto/tochigi.csv` (1 fila: Coco Farm & Winery, vino). Dedup: ninguna de abajo solapa.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/tochigi> (37 bodegas, leído 2026-08-04). Gremio: 栃木県酒造組合, <http://sasara.lib.net/>.
- Estado: cola abierta, 15 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Inoue Seikichi Shoten | 井上清吉商店 | Utsunomiya |
| Utsunomiya Shuzo | 宇都宮酒造 | Utsunomiya |
| Iinuma Meijo | 飯沼銘醸 | Tochigi |
| Ohira Shuzo | 大平酒造 | Tochigi |
| Sagara Shuzo | 相良酒造 | Tochigi ⚠ |
| Aizawa Shuzo | 相澤酒造 | Sano |
| Abe Shuzoten | 阿部酒造店 | Motegi |
| Ikejima Shuzo | 池島酒造 | Otawara |
| Kikunosato Shuzo | 菊の里酒造 | Otawara ⚠ |
| Katayama Shuzo | 片山酒造 | Nikko |
| Kumakubo Shoten | 熊久保商店 | Nasushiobara |
| Kojima Shuzoten | 小島酒造店 | Shioya |
| Kobayashi Shuzo | 小林酒造 | Oyama |
| Sanpuku Shuzo | 三福酒造 | Oyama |
| Shimazaki Shuzo | 島崎酒造 | Nasukarasuyama |
| Shiraai Shuzo | 白相酒造 | Nakagawa |

## Trampas
- ⚠ **La fuente usa municipios disueltos en las fusiones Heisei**: 湯津上村
  (菊の里酒造) es hoy 大田原市 y 岩舟町 (相良酒造) es hoy 栃木市. `data/reference/`
  excluye de Wikidata todo lo que tiene fecha de disolución, así que si se escribe
  el nombre viejo **la fila no tiene puerta geográfica**: el audit la salta y la
  cuenta como skipped, no como comprobada (`AGENTS.md`, invariantes). Escribir el
  municipio actual.
- 那須郡 y 塩谷郡 no son municipio: la fila lleva el 町 (Nakagawa, Shioya).

## Qué falta
- Las ~21 bodegas restantes del censo.
- Sin abrir: fresa Tochiotome (Tochigi es la primera de Japón desde hace 50 años),
  **yuba de Nikko**, 干瓢 (kanpyo, casi todo el nacional), ternera de Nasu, lácteos
  de Nasu, y las bodegas de vino más allá de Coco Farm.
