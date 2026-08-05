# Nagano — candidatos

- CSV: `data/csv/jp/chubu/nagano.csv` (77 filas).
- Fuente: 長野県酒造組合. **Lee las fichas japonesas, `/intro/<area>/`, no las inglesas
  `/breweries/<area>/`**: las inglesas pierden bodegas, romanizan mal y traducen
  razones sociales por marcas. Diez áreas: Kitaazumi, Matsumoto, Kiso, Iida,
  Nakano, Nagano, Ueda, Saku, Suwa, Ina.
- Estado: **⚑ CENSO DE SAKE CERRADO** el 2026-08-05. Las 76 bodegas del gremio
  están integradas (77 filas = 76 + Tamamura Honten, que entra como cervecera).

## Descartes

- **明科酒造 (Akashina Shuzo, Azumino)**: cerrada entre 2012 y 2014. Solo la
  listaba un directorio que no marca las bajas.
- **山清酒造 (Sansei Shuzo, Chikuhoku)**: aparece en la ficha inglesa del área de
  Matsumoto y **no** en la japonesa. Sin web y sin rastro reciente: no se da de
  alta hasta confirmar que sigue.
- **芙蓉酒造協同組合**: misma dirección, teléfono y web que 芙蓉酒造（株）. Dos
  figuras jurídicas sobre una unidad productiva, una sola fila.
- **Hokto Corporation**: cotizada de setas con plantas en varias prefecturas.

## Trampas resueltas

- **La marca 雲山 (Unzan) no identifica a un productor.** La crearon en 1960 seis
  bodegas con embotelladora común (雲山銘醸) y desde los noventa solo la elabora
  **西之門よしのや**. El gremio se la sigue atribuyendo además a **山形屋** y
  **坂井銘醸**, que quedan sin marca propia acreditada y son las dos candidatas a
  revisar en 2ª pasada.
- **Homónimos entre municipios de Nagano y de fuera**, todos en
  `municipality-overrides.json`: `nakano` (Nagano / barrio de Tokio, 130 km) e
  `ikeda` (Kitaazumi / Gifu, misma región `chubu`, por eso el `municipio` lleva el
  distrito: `Ikeda (Kitaazumi)`).
- **Homónimo de Nagano contra sí misma**: 木祖村 y 木曽町 romanizan los dos como
  «Kiso» y son municipios distintos a 20 km. Se escriben `Kisomura` y `Kisomachi`,
  con override cada uno.
- **Dominios del gremio caducados** (7 de 76): `miyamazakura.com` (Furuya, no
  resuelve → `furuya-shuzou.com`), `ueda.ne.jp/~okazaki` (Okazaki, certificado →
  `shinshu-kirei.com`), `fukumuryo.co.jp` (Kutsukake, no resuelve →
  `kutsukake-sake.com`), `shopdaiya.jp` (Toda, 404 → `todashuzo.jp`),
  `mcci.or.jp/www/yoikana/` (Yoikana, 404 → `yoikana.com`), `asamadake.co.jp`
  (redirige a `.com`) y la ficha de Tenpo Shuzo, que apunta a una licorería ajena.
- **`https://www.sakagura.co.jp/` sirve el sitio de reclutamiento de un grupo
  industrial ajeno**; el de Sakai Meijo es el `http://`. Comprobar los dos esquemas.
- **Un 403, una verificación de edad o un timeout no son un sitio muerto**:
  Higashiiida, Furuya, Totsuka, Yoshinoya, Fuyo, Nakazen y Kikusui sirven pero no
  se dejan leer, y por eso quedan en `parcial`.
- **Razón social ≠ marca**: 薄井商店 firma ya como 白馬錦酒造; 市野屋 vende bajo
  Ryusuisen y no bajo el Kinrankurobe del gremio; 高橋助作酒造店 se llama a sí
  misma Matsuwo; 戸田酒造 no es «Suwa Otsuya Honke Shuzo».
- **木内醸造 (Saku)** no tiene nada que ver con **木内酒造** (Naka, Ibaraki), el de
  Hitachino Nest.
- **`shoplist` / `shops` suele ser la lista de tiendas concertadas**, no tienda
  propia: Hokuan, Ono, Kasuga y Daishinshu se quedan en `no comprobado` por eso.

## Qué falta

- **2ª pasada**: 21 filas en `parcial` (las de arriba), Yoshinoya sin coordenadas
  (el geocodificador oficial no tiene Nishinomoncho) y las dos candidatas a purga.
- **Todo lo que no es sake**: soba, miso de Shinshu, manzana, uva y **vino** de
  Chikumagawa/Kikyogahara, wasabi de Azumino, oyaki. Ninguna fuente localizada aún
  — es el hueco grande de la prefectura.
- Imágenes: 77/77 filas sin `imagen`.
