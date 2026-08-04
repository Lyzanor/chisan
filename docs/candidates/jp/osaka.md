# Osaka — candidatos

- CSV: `data/csv/jp/kansai/osaka.csv` (2 filas: Minoh Beer y Marca Brewing, cerveza). Dedup: ninguna de abajo solapa.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/osaka> (17 bodegas, leído 2026-08-04). Gremio: 大阪府酒造組合, <http://osaka-sake.com/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Akishika Shuzo | 秋鹿酒造 | Nose |
| Goshun | 呉春 | Ikeda ⚠ |
| Kiyotsuru Shuzo | 清鶴酒造 | Takatsuki |
| Kotobuki Shuzo | 寿酒造 | Takatsuki |
| Daimon Shuzo | 大門酒造 | Katano |
| Takashima Shuzo | 高島酒造 | Ibaraki ⚠ |
| Nakao Shuzo | 中尾酒造 | Ibaraki ⚠ |
| Saijo | 西條合資 | Kawachinagano |
| Sakai Meijo | さかい銘醸 | Sakai |
| Kitashoji Shuzoten | 北庄司酒造店 | Izumisano |
| Isaka Shuzojo | 井坂酒造場 | Kishiwada |
| Gancho | 元朝 | Kishiwada |
| Naniwa Shuzo | 浪花酒造 | Hannan |
| Nagataki Shuzo (Yao) | 長瀧酒造 八尾蔵 | Yao |

## Trampas
- ⚠ **茨木市 (Ibaraki, Osaka) no es 茨城県 (Ibaraki, prefectura) ni 茨城町**. Es la
  trampa que ya avisa `ibaraki.md` desde el otro lado, y aquí muerde de verdad:
  dos bodegas de esta tabla están en la Ibaraki equivocada si nadie mira. El
  `area` es Osaka.
- ⚠ **池田市 (Ikeda, Osaka)** convive con 池田町 en Gifu, Nagano y Fukui.
  呉春 es de la de Osaka.
- **中尾酒造 (Ibaraki, Osaka)** no es 中尾酒造店 (Kimino, Wakayama), en
  `wakayama.md`. Y **高島酒造 (Ibaraki, Osaka)** no tiene que ver con 高島市
  (Takashima), que es un municipio de Shiga con tres bodegas en `shiga.md`.
- **秋鹿酒造 (Nose)** cultiva su propio arroz: perfil de terroir, de los que
  suelen salir `verificado` con tienda propia. Empezar el lote por ahí.

## Qué falta
- Las 3 bodegas restantes del censo.
- Osaka es urbana pero no está vacía: sin abrir están **泉州の水なす** (berenjena
  con GI, Kishiwada/Izumisano), 能勢 y 河内 (verdura de montaña), 河内ワイン y
  **柏原の葡萄・ワイン** (zona vitícola histórica, ninguna bodega en el CSV),
  昆布 y 佃煮 de Osaka, 醤油 de Sakai.
