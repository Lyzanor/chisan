# Kagawa — candidatos

- CSV: `data/csv/jp/shikoku/kagawa.csv` (6 filas, las 6 bodegas del gremio, altas del 2026-08-04).
- Fuentes: 香川県酒造組合, <https://sanuki-sake.com/> (6 miembros, censo completo, **con dominio**) y 小豆島醤油協同組合, <https://shima-shoyu.com/> (14 socios + 4 casas de la isla fuera del gremio). Ambas leídas 2026-08-04.
- Estado: **sake ✅ integrado** (las 6, 2026-08-04). 醤油 sigue abierto: 18 `unverified`.

Kagawa es la prefectura más pequeña de Japón y solo tiene **6 bodegas de sake**,
así que el grueso de candidatos viene del otro lado: **小豆島 (Shodoshima)**, la
isla del醤油, donde sobreviven ~18 casas en un radio de 5 km.

## Sake — ✅ INTEGRADO 2026-08-04

Las 6 del censo entraron en `data/csv/jp/shikoku/kagawa.csv`: cinco
`verificado` y una `parcial`. Evidencia en `data/evidence/jp/shikoku/kagawa.jsonl`.

| bodega | municipio | resultado |
|---|---|---|
| MORIKUNI | Shodoshima | verificado · venta online sí |
| Nishino Kinryo | Kotohira | verificado · venta online sí |
| Ayakiku Shuzo | Ayagawa | verificado · venta sin comprobar |
| Yushin Shuzo | Ayagawa | verificado · venta sin comprobar ⚠ |
| Kawatsuru Shuzo | Kanonji | verificado · venta sin comprobar |
| Maruo Honten | Kotohira | **parcial** · sin web propia |

Lo que salió al abrirlas:
- ⚠ **Yushin Shuzo es hoy sobre todo una cosmética.** Su negocio principal es el
  extracto Rice Power y su tienda (`ricepowershop.jp`) vende cremas, no bebida.
  Sigue declarando sake artesanal y es socia del gremio, así que entra como
  `Sake`, pero su venta online **no** sostiene la bebida.
- **La lectura automática de `ayakiku.com` devolvió otra razón social
  (「淡路菊水酒造」) y otro municipio (Takamatsu).** La ficha del gremio dice
  綾菊酒造, Ayagawa, 山田下 3393-1 — y coinciden código postal, número y teléfono,
  así que era ruido de lectura, no un cruce de empresas. Ante la duda, manda el
  gremio.
- **`kawatsuru.com/shop/` es un localizador de tiendas físicas**, no un carrito:
  no sostiene `Venta online=sí`.
- **Maruo Honten (悦凱陣) no tiene web propia** pese a ser conocida fuera de Japón:
  entra `parcial` y sin enlace, como las bodegas de Nara del gremio.

## 醤油 de Shodoshima (18) — categoría `Condimentos`

Socios del gremio (14), todos en 小豆島町 (Shodoshima):

| nombre (rōmaji propuesto) | 社名 |
|---|---|
| Yamaroku Shoyu | ヤマロク醤油 |
| Shokin Shoyu | 正金醤油 |
| Marushima Shoyu | 丸島醤油 |
| Takesan | タケサン醤油 |
| Yamahisa | ヤマヒサ |
| Kinryo Shoyu | 金両醤油 |
| Kindai Shoyu | 金大醤油 |
| Yamasan Shoyu | ヤマサン醤油 |
| Sakai Shoyu Kogyo | 左海醤油工業 |
| Takahashi Shoten | 高橋商店 |
| Shodoshima Shoyu | 小豆島醤油 |
| Shimajo | 島醸 |
| Motoya Shoten | 元屋商店 |
| Shodoshima Umakoshi Shoyu | 小豆島馬越醤油 |

Casas de la isla **fuera** del gremio (4) — el propio gremio las publica:

| nombre (rōmaji propuesto) | 社名 | municipio | web |
|---|---|---|---|
| Marukin Shoyu | マルキン醤油 | Shodoshima | ⚠ grupo grande |
| Fujidai Shoyu | 富士大醤油 | Tonosho | |
| Yamahira (Yamaguchi Shoyu) | 山口醤油（ヤマヒラ） | Tonosho | yamahira-soy.com |
| Yamatoichi (Omori Shoyu Jozojo) | 大森醤油醸造所（ヤマトイチ） | Tonosho | |

## Trampas
- ⚠ **`Tonosho` en rōmaji resolvía al municipio equivocado.** 土庄町 (Kagawa) y
  東庄町 (Tōnoshō, Chiba) comparten clave normalizada y ganaba el de Chiba,
  a 480 km: eso es **error bloqueante**, no aviso. Resuelto el 2026-08-04 con una
  entrada `tonosho` en `data/reference/municipality-overrides.json` (kanto vs
  shikoku), así que las cuatro casas de Tonosho ya se pueden escribir.
- **La isla son dos municipios**: 小豆島町 (Shodoshima) y 土庄町 (Tonosho). Las
  cuatro de fuera del gremio están casi todas en Tonosho. No poner «Shodoshima»
  a todo por inercia — y `Shodoshima` es además el nombre de la isla entera.
- **ヤマロク醤油** es la casa de los barriles de madera (木桶) que reactivó el
  oficio y tiene proyección internacional: perfil de `verificado` con venta
  online, buen sitio por donde empezar el lote.
- **マルキン醤油** es de un grupo cotizado (Morita/盛田): candidata a descarte por
  masa, con la matización de que su museo y su marca de isla sí son propios.
- **小豆島酒造 y 森國酒造** son la misma casa con dos nombres: una fila.
- 香川県酒造組合 y el censo de SAKETIMES coinciden en 6: no falta ninguna.

## Qué falta
- **Aceite de oliva de Shodoshima**: la isla es donde se plantó el primer olivo
  de Japón (1908) y hoy hay decenas de almazaras y productores con tienda. Es el
  frente más obvio y no está abierto — y encaja con el catálogo mejor que nada.
- Sin abrir: **讃岐うどん** (el udon que define la prefectura, con obradores y
  harineras propias), 手延べそうめん de Shodoshima, 佃煮 de la isla,
  和三盆 de Higashikagawa (el mismo azúcar artesano que Tokushima),
  オリーブ牛 y オリーブハマチ.
