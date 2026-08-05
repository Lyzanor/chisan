# Nagano — candidatos

- CSV: `data/csv/jp/chubu/nagano.csv` (32 filas).
- Fuente: 長野県酒造組合 <https://www.nagano-sake.or.jp/breweries/>, que reparte
  sus miembros en diez áreas (Kitaazumi, Matsumoto, Kiso, Iida, Nakano, Nagano,
  Ueda, Saku, Suwa, Ina) y **publica el dominio de cada bodega en la propia ficha
  del área**, junto con dirección y teléfono. Una lectura por área basta.
- Estado: **⚑ CANDIDATOS DEL LISTADO AGOTADOS** el 2026-08-05. Las 22 bodegas del
  xlsx, las 10 de la primera mordida al censo y Tamamura Honten están integradas.

## Descartes

- **明科酒造 (Akashina Shuzo, Azumino)**: cerrada entre 2012 y 2014. Estaba en el
  corte alfabético de sake-times, que no marca las bajas — el censo del gremio no
  la lista y por ahí se cazó.
- **Hokto Corporation**: cotizada de cultivo industrial de setas con plantas en
  varias prefecturas. Descarte por escala, no por origen.

## Trampas resueltas en la pasada

- **Nakano** es municipio de Nagano y barrio de Tokio, a 130 km: error bloqueante.
  Resuelto en `data/reference/municipality-overrides.json`.
- **Dominios que el gremio publica y ya no valen**: `miyamazakura.com` (Furuya) no
  resuelve — el vigente es `furuya-shuzou.com`; `ueda.ne.jp/~okazaki` (Okazaki) da
  error de certificado — el vigente es `shinshu-kirei.com`; `asamadake.co.jp`
  redirige a `.com`. Comprobar el dominio antes de copiarlo del gremio.
- **Un 403 o una verificación de edad no son un sitio muerto**: Higashiiida
  (`motooi.com`), Furuya y Totsuka (`kanchiku.com`) sirven, pero no se dejan leer
  en automático, y por eso quedan en `parcial`.
- **`ookuni.com`** resuelve pero sirve una página de prohibido en el puerto 444:
  la fila se queda sin `web`.
- **La tienda puede estar en el dominio a pelo o en el `www`, no en los dos**:
  `masumi.jp` es una portada por defecto del proveedor y `www.masumi.jp` es la
  tienda real.
- **Razón social ≠ marca**: 薄井商店 firma ya como 白馬錦酒造; 市野屋 vende bajo
  Ryusuisen y no bajo el Kinrankurobe que lista el gremio; 高橋助作酒造店 se llama
  a sí misma Matsuwo. La fila lleva el nombre público actual.
- **木内醸造 (Kiuchi Jyouzou, Saku)** no tiene nada que ver con **木内酒造**
  (Kiuchi Brewery, Naka, Ibaraki), el de Hitachino Nest.

## Qué falta

- **El resto del censo de sake**: el gremio lista ~80 bodegas y aquí hay 31. Sin
  recorrer quedan las áreas de **Kiso** e **Iida** enteras, y los miembros que no
  estaban en el listado dentro de las ocho ya leídas — entre ellos 芙蓉酒造 y
  木内醸造 (Saku), 豊島屋 y 諏訪大津屋本家酒造 y 舞姫 (Suwa), 長野銘醸 y 西飯田酒造店
  y 尾澤酒造場 y 松葉屋本店 y 高澤酒造 y 坂井銘醸 y 天法酒造 (Nagano), los cinco de
  Ueda, ocho de Matsumoto, tres de Kitaazumi, seis de Nakano y siete de Ina.
- **Todo lo que no es sake**: soba, miso de Shinshu, manzana, uva y **vino** de
  Chikumagawa/Kikyogahara, wasabi de Azumino, oyaki. Ninguna fuente localizada aún.
- Imágenes: 32/32 filas sin `imagen`.
