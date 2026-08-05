# Yamagata — candidatos

- CSV: `data/csv/jp/tohoku/yamagata.csv` (10 filas: 9 bodegas del 2026-08-05 más Tsuruoka Beikoku, cereal).
- Fuentes: 山形県酒造組合, <http://yamagata-sake.or.jp/pages/162/> — mapa de los 47 socios, **con ficha por bodega que sí publica el dominio** (`/pages/NN/`); y el censo de SAKETIMES, <https://jp.sake-times.com/sakagura/yamagata> (53).
- Estado: **9 integradas** el 2026-08-05 (7 `verificado`, 2 `parcial`); quedan 13 de la tabla y ~31 del censo. Evidencia en `data/evidence/jp/tohoku/yamagata.jsonl`.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Shindo Shuzoten | 新藤酒造店 | Yonezawa |
| Kosaka Shuzo | 香坂酒造 | Yonezawa |
| Otokoyama Shuzo | 男山酒造 | Yamagata |
| Shuhou Shuzojo | 秀鳳酒造場 | Yamagata |
| Kotobuki Toraya Shuzo | 寿虎屋酒造 | Yamagata |
| Chiyokotobuki Toraya | 千代寿虎屋 | Sagae |
| Furusawa Shuzoten | 古澤酒造 | Sagae |
| Kikuisami | 菊勇 | Sakata |
| Fumotoi Shuzo | 麓井酒造 | Sakata |
| Watarai Honten | 渡會本店 | Tsuruoka |
| Takenotsuyu | 竹の露 | Tsuruoka |
| Kato Kahachiro Shuzo | 加藤嘉八郎酒造 | Tsuruoka |
| Rokkasen | 六歌仙 | Higashine |

## Integradas 2026-08-05 (9) — salidas de la cola de arriba

| bodega | municipio | resultado |
|---|---|---|
| Dewazakura Shuzo | Tendo | verificado · venta sí |
| Tatenokawa Shuzo | Sakata | verificado · venta sí |
| Kojima Sohonten | Yonezawa | verificado · venta sí |
| Yonetsuru Shuzo | Takahata | verificado · venta sí |
| Gassan Shuzo | Sagae | verificado · venta sí |
| Mitobe Shuzo | Tendo | verificado · venta sí |
| Sakata Shuzo | Sakata | verificado · sin carrito |
| Takagi Shuzo | Murayama | **parcial** · sin web |
| Kamenoi Shuzo | Tsuruoka | **parcial** · sin web |

**Aquí el gremio sí es la palanca, al revés que en Fukushima.** El mapa de socios
(`/pages/162/`) enlaza una ficha por bodega y esa ficha **publica el dominio
propio**, además de dirección y teléfono. Una llamada por bodega en vez de dos.
Ojo con las rutas: `/publics/index/NN/` redirige 301 a `/pages/NN/`.

- ⚠ **Que el campo web del registro esté vacío no significa que no haya web.**
  酒田酒造 aparece con «—» en el dominio, pero el gremio sí publicaba su correo:
  el dominio de ese correo (`jokigen.com`, que es su marca) resultó ser su web
  propia, con la misma dirección y el mismo teléfono. Tirar del correo antes de
  dar por perdida una bodega.
- ⚠ **La lectura de `yonetsuru.com` devolvió otro municipio** («Yamabe-machi»)
  conservando el número de calle. El gremio la sitúa en Takahata, que es lo que
  se escribió. Es el mismo ruido de lectura que en Ayakiku (`kagawa.md`): cuando
  la web y el registro chocan en municipio y coincide el número, manda el registro.
- **高木酒造, la casa de 十四代, no tiene web ni correo.** Igual que Hiroki en
  Fukushima: dos de las marcas más buscadas del país son `parcial` por no tener
  dónde enlazar.

## Trampas
- **寿虎屋酒造 (Yamagata) y 千代寿虎屋 (Sagae) son dos empresas** con el mismo
  「虎屋」: casar por 社名 completo y municipio.
- **後藤酒造店 y 後藤康太郎酒造店**, ambas en 高畠町, misma trampa.
- Los 郡 del interior (東置賜郡, 西置賜郡, 東田川郡, 西村山郡, 飽海郡) no son
  municipio: la fila lleva el 町/村 — Takahata, Kawanishi, Shonai, Kahoku, Yuza.
- **オードヴィ庄内 (Sakata)** es la destilería de un grupo (Eau de Vie): mirar si
  tiene marca e identidad propias antes de darla de alta.

## Qué falta
- Las ~30 bodegas restantes del censo.
- Sin abrir: cereza sato-nishiki y pera La France (Yamagata es la primera de
  Japón en ambas), ternera de Yonezawa, 玉こんにゃく, soba de Murayama, y el
  **vino de Takahata/Nan'yo**, que tiene bodegas históricas y no hay ninguna.
