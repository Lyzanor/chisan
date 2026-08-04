# Hiroshima — candidatos

- CSV: `data/csv/jp/chugoku/hiroshima.csv` (0 filas). Dedup: nada que cruzar en el CSV, pero ver la nota sobre Imada.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/hiroshima> (56 bodegas, leído 2026-08-04). Gremio: 広島県酒造組合, <http://www.hirosake.or.jp/>.
- Estado: cola abierta, 13 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

**西条 (Saijo), en Higashihiroshima, es una de las tres capitales del sake de
Japón** junto a Nada (Hyogo) y Fushimi (Kioto), con las bodegas alineadas en una
sola calle. Categoría para todas: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Kamotsuru Shuzo | 賀茂鶴酒造 | Higashihiroshima |
| Kamoizumi Shuzo | 賀茂泉酒造 | Higashihiroshima |
| Kanemitsu Shuzo | 金光酒造 | Higashihiroshima ⚠ |
| Aihara Shuzo | 相原酒造 | Kure |
| Enoki Shuzo | 榎酒造 | Kure |
| Umeda Shuzojo | 梅田酒造場 | Hiroshima |
| Kyokuho Shuzo | 旭鳳酒造 | Hiroshima |
| Ikuma Shuzo | 生熊酒造 | Shobara |
| Kitamura Jozojo | 北村醸造場 | Shobara |
| Etajima Meijo | 江田島銘醸 | Etajima |
| Ono Shuzo | 小野酒造 | Kitahiroshima ⚠ |
| Aseed Brew | アシードブリュー | Fukuyama |
| Kawamoto Eisuke | 川本英介 | Akiota |

## Trampas
- **今田酒造本店 (Imada Shuzo Honten, Higashihiroshima)** ya está en la bandeja
  del `README.md` de esta carpeta: no volver a proponerla como nueva.
- ⚠ **北広島町 (Kitahiroshima, Hiroshima) no es 北広島市 (Kitahiroshima,
  Hokkaido)**. Mismo nombre, 1.400 km. Si la fila se escribe con el municipio a
  secas, el gate geográfico la manda a Hokkaido y es error bloqueante —
  o peor, resuelve al centroide equivocado sin quejarse.
- ⚠ **金光酒造 (Higashihiroshima)** no es 金光酒造 (Yamaguchi-shi), en
  `yamaguchi.md`. Mismo 社名, prefecturas vecinas.
- **アシードブリュー (Fukuyama)** es filial de un grupo de bebidas (Aseed Holdings):
  candidata a descarte por masa, mirar si tiene marca de sake propia.
- **川本英介** es un nombre de persona como razón social: confirmar el nombre
  comercial de la bodega antes de escribir el `nombre` de la fila.
- 西条 es un barrio de 東広島市 (Higashihiroshima), no un municipio; y hay un
  **西条市 (Saijo)** que es una ciudad de Ehime, en `ehime.md`.

## Qué falta
- Las ~43 bodegas restantes del censo, empezando por el resto de la calle de
  Saijo, que son las que tienen tienda y venta online.
- Sin abrir: **牡蠣 (ostra)** — Hiroshima produce en torno al 60% del nacional y
  hay cofradías y criaderos con marca; **レモン de Setoda/Ikuchijima** (casi todo
  el limón japonés); もみじ饅頭 (decenas de obradores en Miyajima), 広島菜漬,
  お好み焼き のソース (Otafuku y las casas pequeñas), 比婆牛.
