# Yamanashi — candidatos

- CSV: `data/csv/jp/chubu/yamanashi.csv` (3 filas, todas altas de esta pasada).
- Origen: listado aportado por el usuario, `listado_125_productores_locales_japon.xlsx` (2026-08-04).
- Estado: **las 3 integradas** en el CSV el 2026-08-04 como `parcial`. Cola vacía; el valor de este fichero es ahora el «Qué falta».

| nombre | municipio | categoría | A/B | web |
|---|---|---|---|---|
| Chuo Budoshu / Grace Wine | Koshu (Katsunuma) | Vino | A | grace-wine.com |
| Marufuji Winery / Rubaiyat | Koshu (Katsunuma) | Vino | A | rubaiyat.jp |
| UCHU Brewing | Hokuto | Cerveza | B | uchubrewing.com |

Katsunuma es un barrio de **Koshu**: el `municipio` de la fila es Koshu.
Las dos bodegas llevan doble denominación (razón social / marca): el `nombre` es
la marca pública — Grace Wine, Rubaiyat — y la razón social va solo si no hay
marca distinta (`docs/CSV_CONTRACT.md`).

## Sake (12, pasada 2026-08-04)

Frente nuevo: este fichero solo tenía vino. Fuentes: 日本酒造組合中央会
<https://japansake.or.jp/sakagura/jp/yamanashi/> (12, censo completo) y
<https://jp.sake-times.com/sakagura/yamanashi>, que coinciden fila a fila.
Gremio: 山梨県酒造組合, <http://www.yamanashi-sake.jp/> («12 酒蔵» en portada).
Ninguna trae dominio. Categoría: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Yamanashi Meijo | 山梨銘醸 | Hokuto |
| Takenoi Shuzo | 武の井酒造 | Hokuto |
| Yamaki Shuzoten | 八巻酒造店 | Hokuto |
| Tanizakura Shuzo | 谷櫻酒造 | Hokuto |
| Sasaichi Shuzo | 笹一酒造 | Otsuki |
| Ide Jozoten | 井出醸造店 | Fujikawaguchiko |
| Yorozuya Jozoten | 萬屋醸造店 | Fujikawa |
| Okubo Shuzoten | 大久保酒造店 | Fujikawa |
| Yoro Shuzo | 養老酒造 | Yamanashi |
| Taikan Shuzo | 太冠酒造 | Minami-Alps |
| Yokouchi Shuzoten | 横内酒造店 | Minami-Alps |
| Yokoyama Shuzoten | 横山酒造店 | Nanbu |
| Udezumo Shuzo | 腕相撲酒造 | Fuefuki ⚠ |
| Sun Foods | サン・フーズ | Koshu ⚠ |

⚠ **腕相撲酒造** parece errata («pulso, echar un pulso») pero **las dos fuentes
independientes lo escriben igual**, así que no se corrige de oficio: se confirma
contra la propia bodega antes de escribir la fila.
⚠ **サン・フーズ (Koshu)** y **福徳長酒類 韮崎工場 (Nirasaki)** son plantas de
grupo, no casas con marca propia: triar. Sun Foods embotella además vino, así
que puede colisionar con la tabla de arriba.
- 北杜市 concentra cuatro de las doce. **Ojo con 北杜 (Hokuto, Yamanashi) vs 北斗
  (Hokuto, Hokkaido)**, que ya aparece en `hokkaido.md`: mismo rōmaji, distinto
  kanji y distinta punta del país. Una fuente escribió 北斗市 por 北杜市.

## Qué falta
Yamanashi es **la** prefectura del vino japonés (Koshu es la uva y la DOP de
facto) y aquí hay dos bodegas. Frentes abiertos:
- 山梨県ワイン酒造組合 y el sello **GI Yamanashi**: ahí está el censo real, con
  ~80 bodegas concentradas en Koshu, Fuefuki y Yamanashi-shi.
- Fruta: melocotón y uva de mesa de Fuefuki/Yamanashi, ciruela.
- Sin abrir: hoto, abalorio de miso, agua mineral del Fuji, whisky de Hakushu.
