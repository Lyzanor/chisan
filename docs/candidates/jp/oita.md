# Oita — candidatos

- CSV: `data/csv/jp/kyushu-okinawa/oita.csv` (1 fila: Hita Tenryosui, bebidas). Dedup: ninguna de abajo solapa.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/oita> (31 bodegas, leído 2026-08-04). Gremio: 大分県酒造組合, <http://www.oita-sake.or.jp/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`, con la salvedad de abajo. El rōmaji de `nombre` y
`municipio` es propuesta a confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Inoue Shuzo | 井上酒造 | Hita |
| Oimatsu Shuzo | 老松酒造 | Hita ⚠ |
| Kuncho Shuzo | クンチョウ酒造 | Hita |
| Kuge Honten | 久家本店 | Usuki |
| Kotegawa Shuzo | 小手川酒造 | Usuki |
| Emoto Shoten | 江本商店 | Usa |
| Oita Meijo | 大分銘醸 | Usa |
| Kubo Shuzo | 久保酒造 | Usa |
| Aso Honten | 麻生本店 | Yufu |
| Daichi Shuzo | 大地酒造 | Saiki |
| Ono Shuzo | 小野酒造 | Kitsuki |
| Kamenoi Shuzo | 亀の井酒造 | Kusu |
| Kayashima Shuzo | 萱島酒造 | Kunisaki |
| Kira Shuzo | 吉良酒造 | Bungoono |

## Trampas
- **`hita` ya está desambiguado** en `data/reference/municipality-overrides.json`
  frente a su homónimo español (`AGENTS.md` de Japón, y ya avisado en el
  `README.md` de esta carpeta por Hita Tenryosui). Las tres bodegas de Hita pasan
  el gate sin tocar nada.
- ⚠ **老松酒造 (Hita, Oita)** es el tercer 老松 del catálogo: los otros son
  伊丹老松酒造 (Itami) y 老松酒造 (Shiso), ambos en `hyogo.md`. Tres empresas.
- **亀の井酒造 (Kusu, Oita)** no es 亀の井酒造 (Tsuruoka, Yamagata), la de
  くどき上手, en `yamagata.md`. Mismo 社名 exacto.
- **小野酒造 (Kitsuki, Oita)** no es 小野酒造 (Kitahiroshima, Hiroshima), en
  `hiroshima.md`.
- ⚠ **Oita es la primera prefectura de Japón en 麦焼酎**, no en sake: varias de
  estas casas hacen las dos cosas y la `categoria` que pesa puede ser
  `Destilados y licores`. Decidir por fila, no por gremio.

## Qué falta
- Las ~17 bodegas restantes del censo, y **三和酒類 (Usa)**, la casa de いいちこ,
  que es el mayor productor de shochu de Japón y no aparece en el censo de sake:
  entra por vertical de destilado, con el triaje de grupo por delante.
- Sin abrir: **かぼす**, del que Oita produce en torno al 97% nacional;
  **乾し椎茸** (shiitake seco, también primera de Japón, con subasta propia);
  関あじ・関さば (pescado de marca con lonja en Saganoseki); 豊後牛; 柚子胡椒
  (nació en Kyushu y hay obradores pequeños); 日田の水と醤油.
