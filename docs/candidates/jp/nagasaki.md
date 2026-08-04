# Nagasaki — candidatos

- CSV: `data/csv/jp/kyushu-okinawa/nagasaki.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/nagasaki> (16 bodegas, leído 2026-08-04). Gremio: 長崎県酒造組合, <http://nagasaki-sake.sakura.ne.jp/>.
- Estado: cola abierta, 13 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`, salvo lo que se indique. El rōmaji de `nombre` y
`municipio` es propuesta a confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Imazato Shuzo | 今里酒造 | Hasami |
| Umegae Shuzo | 梅ケ枝酒造 | Sasebo |
| Senryu Shuzo | 潜龍酒造 | Sasebo |
| Nishimuta Shuzo | 西牟田酒造 | Sasebo |
| Fukuda Shuzo | 福田酒造 | Hirado |
| Mori Shuzojo | 森酒造場 | Hirado |
| Omoya Shuzo | 重家酒造 | Iki ⚠ |
| Kawachi Shuzo | 河内酒造 | Tsushima |
| Kinokawa | 杵の川 | Isahaya |
| Urakawa Shuzo | 浦川酒造 | Minamishimabara |
| Aimusume Shuzo | あい娘酒造 | Unzen |
| Ito Shuzojo | 伊藤酒造場 | Unzen |
| Kato Shuzojo | 加藤酒造場 | Shimabara ⚠ |

## Trampas
- ⚠ **La fuente sitúa 加藤酒造場 en 南高来郡有明町, que ya no existe**: se fusionó
  en 2006 en 島原市 (Shimabara). Escribir el nombre viejo deja la fila sin puerta
  geográfica (`AGENTS.md`). Ya visto en `tochigi.md`, `tokushima.md` y
  `fukuoka.md`: en Kyushu esta trampa es sistemática.
- ⚠ **壱岐 (Iki) es la cuna del 麦焼酎** y tiene Indicación Geográfica propia
  (壱岐焼酎). 重家酒造 hace las dos cosas: si su producto identitario es el
  shochu, la `categoria` es `Destilados y licores`, no `Sake`.
- **太田酒造場** aparece en la fuente **sin municipio**: resolver antes de
  escribir. Y no es 太田酒造 (Kusatsu, Shiga) ni 太田酒造場 (Wakasa, Tottori),
  ambas ya en esta carpeta.
- **La prefectura son 971 islas**: Iki, Tsushima y Hirado son áreas insulares a
  50-130 km de Nagasaki. Al geocodificar caerán lejos del centroide de la capital
  — es correcto, no un error que «corregir» moviendo `municipio`.

## Qué falta
- Las 3 bodegas restantes del censo, y **el gremio de shochu de Iki**, que es un
  frente aparte y con GI.
- Sin abrir: **カステラ** — Nagasaki es donde entró y hay casas de tres siglos
  (Fukusaya, Bunmeido y decenas de obradores pequeños), el frente más obvio;
  びわ (níspero, primera de Japón), 五島うどん y 五島の椿油, 島原そうめん,
  長崎和牛, あごだし (caldo de pez volador), 波佐見焼 (cerámica).
