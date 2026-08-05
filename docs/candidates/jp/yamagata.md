# Yamagata — candidatos

- CSV: `data/csv/jp/tohoku/yamagata.csv` (22 filas: 21 bodegas más Tsuruoka Beikoku, cereal).
- Fuentes: 山形県酒造組合, <http://yamagata-sake.or.jp/pages/162/> — mapa de los 47 socios, **con ficha por bodega que sí publica el dominio** (`/pages/NN/`); y el censo de SAKETIMES, <https://jp.sake-times.com/sakagura/yamagata> (53).
- Estado: ⚑ **PASADA CERRADA** el 2026-08-05. Las 21 de la cola integradas (16 `verificado`, 5 `parcial`); queda **una**, 菊勇 (Sakata), sin ficha localizada en el gremio. Evidencia en `data/evidence/jp/tohoku/yamagata.jsonl`.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Kikuisami | 菊勇 | Sakata ⚠ sin ficha en el mapa del gremio |

## Integradas 2026-08-05 (21) — cola vaciada

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
| Rokkasen | Higashine | verificado · venta sí |
| Kosaka Shuzo | Yonezawa | verificado · venta sí |
| Chiyokotobuki Toraya | Sagae | verificado · venta sí |
| Watarai Honten | Tsuruoka | verificado · venta sí |
| Shindo Shuzoten | Yonezawa | verificado · sin tienda |
| Shuho Shuzojo | Yamagata | verificado · sin tienda |
| Otokoyama Shuzo | Yamagata | verificado · sin tienda |
| Takenotsuyu | Tsuruoka | verificado · sin tienda |
| Furusawa Shuzo | Sagae | verificado · sin tienda |
| Fumotoi Shuzo | Sakata | verificado · sin tienda |
| Kotobuki Toraya Shuzo | Yamagata | **parcial** · web con JS |
| Kato Kahachiro Shuzo | Tsuruoka | **parcial** · URL caduca |

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


## Cierre de la pasada (2026-08-05)

Las 12 fichas restantes salieron de una tacada porque **el gremio publica el
dominio de las doce**. Después bastó un barrido leyendo el cuerpo de cada web.

- ⚠ **Contar palabras de tienda en el HTML da falsos positivos.** Dos de seis
  candidatas a `Venta online=sí` se cayeron al mirar los enlaces reales:
  男山酒造 daba cuatro coincidencias que eran **ficheros CSS de Wix**, y 古澤酒造
  doce que eran **rutas de blog** (`/blog/category/foodshop/`). Hay que extraer
  el href, no contar la palabra.
- ⚠ **加藤嘉八郎酒造 se declara a sí misma sitio antiguo** en su portada
  (「当サイトは旧サイトとなります」) y el gremio sigue publicando esa URL. Es el
  segundo registro con dominio caduco tras Sakai en `kagawa.md`. Se queda
  `parcial` con el enlace viejo hasta localizar el vigente.
- **寿虎屋酒造 sirve el cuerpo vacío**: se pinta con JavaScript, como el buscador
  del gremio de Hiroshima. `parcial`.
- **千代寿虎屋 (Sagae) y 寿虎屋酒造 (Yamagata) son dos empresas**, como avisaba
  este fichero: direcciones, teléfonos y municipios distintos. Confirmado.

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
