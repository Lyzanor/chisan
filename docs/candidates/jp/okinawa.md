# Okinawa — candidatos

- CSV: `data/csv/jp/kyushu-okinawa/okinawa.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: listado de 酒造所 de おきなわ物語 (portal oficial de turismo de la prefectura), <https://www.okinawastory.jp/feature/awamori/list> (leído 2026-08-04). Gremio: 沖縄県酒造組合, <https://www.okinawa-awamori.or.jp/> — **47 酒造所 y 1 cooperativa**; su certificado TLS fallaba el 2026-08-04, ver README.
- Estado: cola abierta, 20 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Aquí el gremio no es de sake ni de shochu: es de **泡盛 (awamori)**, destilado de
arroz índico con koji negro, con Indicación Geográfica (琉球泡盛) y unos 500 años
de historia. Categoría para todas: `Destilados y licores`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Zuisen Shuzo | 瑞穂酒造 | Naha |
| Shikina Shuzo | 識名酒造 | Naha |
| Ishikawa Shuzojo | 石川酒造場 | Nishihara ⚠ |
| Chatan Choro Shuzo | 北谷長老酒造 | Chatan |
| Shinzato Shuzo | 新里酒造 | Okinawa |
| Higa Shuzo | 比嘉酒造 | Yomitan |
| Kamimura Shuzo | 神村酒造 | Uruma |
| Taikoku Shuzo | 泰石酒造 | Uruma |
| Sakiyama Shuzosho | 崎山酒造廠 | Kin |
| Kin Shuzo | 金武酒造 | Kin |
| Onna Shuzosho | 恩納酒造所 | Onna |
| Sakimoto Shuzo | 咲元酒造 | Onna ⚠ |
| Ryusen Shuzo | 龍泉酒造 | Nago |
| Tsukayama Shuzosho | 津嘉山酒造所 | Nago |
| Helios Shuzo | ヘリオス酒造 | Nago |
| Yamakawa Shuzo | 山川酒造 | Motobu |
| Nakijin Shuzo | 今帰仁酒造 | Nakijin |
| Takazato Shuzosho | 田嘉里酒造所 | Ogimi |
| Izena Shuzosho | 伊是名酒造所 | Izena |
| Iheya Shuzo | 伊平屋酒造所 | Iheya |

## Trampas
- ⚠ **石川酒造場 (Nishihara, Okinawa)** no es 石川酒造 (Fussa, Tokio), en
  `tokyo.md`. Y ojo: **石川** es además un barrio de うるま市 y el nombre de una
  prefectura entera (`ishikawa.md`). Tres cosas, un rōmaji.
- ⚠ **咲元酒造 era de Shuri (Naha) y se trasladó a Onna**: según qué listado se
  lea sale en un municipio o en otro. Confirmar el actual antes de fijar
  coordenadas — es el patrón «sede vs. planta» que ya avisa `hokkaido.md`.
- **Okinawa no es una isla**: Izena, Iheya y las que faltan (Miyako, Ishigaki,
  Yonaguni, Kume) están a 100-500 km de Naha. El gate geográfico las marcará
  lejos del centroide de la capital y **es correcto**.
- **与那国島** tiene el 花酒, el único destilado de 60° legal en Japón, y las tres
  destilerías de la isla no están en esta tabla.
- Los municipios de Okinawa llevan mucho 村 (Ogimi, Izena, Iheya, Onna,
  Yomitan): no convertirlos en 町 al escribir.

## Qué falta
- **~27 酒造所 del gremio sin listar**: esta tabla son 20 de 47. Faltan enteras
  las islas Miyako, Yaeyama (Ishigaki, Yonaguni, Taketomi) y Kumejima, además
  del sur de la isla principal (Itoman, Tomigusuku, Nanjo).
- Sin abrir, y Okinawa es la prefectura con la despensa más distinta del país:
  **黒糖 (azúcar moreno)**, que solo pueden hacer ocho islas y tiene productores
  identificables; **シークヮーサー de Ogimi**; 海ぶどう; 島とうがらし y コーレー
  グース; 紅芋 de Yomitan; ゴーヤー; 沖縄そば (con gremio propio); 石垣牛 y
  あぐー豚; 塩 de Miyako e Ishigaki.
