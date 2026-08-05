# Fukuoka — candidatos

- CSV: `data/csv/jp/kyushu-okinawa/fukuoka.csv` (6 filas, altas del 2026-08-05).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/fukuoka> (70 bodegas, leído 2026-08-04). Gremio: 福岡県酒造組合, <http://www.fukuoka-sake.org/>.
- Estado: **6 integradas** el 2026-08-05 (5 `verificado`, 1 `parcial`). Evidencia en `data/evidence/jp/kyushu-okinawa/fukuoka.jsonl`.

Fukuoka es la tercera prefectura de Japón en número de bodegas, detrás de Hyogo y
Niigata. Categoría para todas: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Asahigiku Shuzo | 旭菊酒造 | Kurume |
| Ikekame Shuzo | 池亀酒造 | Kurume |
| Asahimatsu Shuzo | 旭松酒造 | Yame |
| Ayasugi Shuzojo | 綾杉酒造場 | Fukuoka |
| Izu Honten | 伊豆本店 | Munakata |
| Isonosawa | いそのさわ | Ukiha |
| Umegatani Shuzo | 梅ヶ谷酒造 | Kama |
| Osato Shuzo | 大里酒造 | Kama ⚠ |
| Egashira Shuzo | 江頭酒造 | Omuta |
| Okina Shuzo | 翁酒造 | Koga ⚠ |
| Kataoka Shuzojo | 片岡酒造場 | Toho |
| Ikedaya | 池田屋 | Miyama ⚠ |

## Integradas 2026-08-05 (6)

| bodega | municipio | resultado |
|---|---|---|
| Morinokura | Kurume | verificado · venta sí |
| Wakatakeya Shuzojo | Kurume | verificado · venta sí |
| Yamaguchi Shuzojo (Niwa no Uguisu) | Kurume | verificado · sin carrito |
| Ishikura Shuzo (Hakata Hyakunengura) | Fukuoka | verificado · sin carrito |
| Oga Shuzo | Chikushino | verificado · sin carrito |
| Kitaya | Yame | **parcial** · web sin respuesta |

Cuatro de las seis no estaban en la tabla de arriba: salieron al cazar dominios,
igual que Nakao en `hiroshima.md`. **El censo de la tabla es una selección, no
el padrón** — Fukuoka tiene 70 bodegas.

⚠ **`Kurume` resolvía a Higashikurume, en Tokio**, a 950 km: error bloqueante.
Resuelto el 2026-08-05 con una entrada `kurume` en
`municipality-overrides.json` (kanto vs kyushu-okinawa). Tercer homónimo de la
sesión tras `tonosho` y `kashima`, y el más peligroso porque **Kurume
concentra tres de estas seis bodegas**.

- **大賀酒造 (1673) es la más antigua de la prefectura** y **石蔵酒造 la única que
  sigue elaborando dentro de Hakata**: las dos son perfiles de visita, no de
  venta online.
- **Kitaya no respondió** ni en su dominio principal ni en el de su tienda
  declarada. Se queda `parcial`; reintentar antes de dar el dominio por malo.

## Trampas
- ⚠ **La fuente sitúa 大里酒造 en 嘉穂郡嘉穂町, que ya no existe**: se fusionó en
  2006 en 嘉麻市 (Kama), donde ya está 梅ヶ谷酒造. Wikidata excluye los municipios
  disueltos, así que el nombre viejo deja la fila sin puerta geográfica
  (`AGENTS.md`). Misma trampa que en `tochigi.md` y `tokushima.md`.
- ⚠ **古賀市 (Koga, Fukuoka) no es 古河市 (Koga, Ibaraki)**, donde está 青木酒造
  (`ibaraki.md`). Mismo rōmaji, dos extremos de Honshu/Kyushu.
- ⚠ **池田屋 (Miyama)** es otro de los cuatro `Ikedaya` del catálogo: ver la lista
  en `ehime.md`.
- **旭菊 y 旭松** comparten el 旭 pero no son ninguno de los cuatro 旭酒造 de
  `mie.md`.
- 大賀酒造 (1673) es la bodega más antigua de Kyushu: perfil con historia y
  probable tienda propia, buen sitio por donde empezar el lote.

## Qué falta
- Las ~56 bodegas restantes del censo.
- Sin abrir, y con mucho: **八女茶 (Yame)** — el mejor gyokuro de Japón, con
  productores familiares que venden online; **明太子** (con decenas de casas en
  Hakata, no solo las industriales); あまおう (fresa con marca registrada);
  久留米/博多 ラーメン y sus caldos; 醤油 y 味噌 de Yanagawa; 柳川のうなぎ.
