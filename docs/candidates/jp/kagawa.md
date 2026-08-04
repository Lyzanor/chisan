# Kagawa — candidatos

- CSV: `data/csv/jp/shikoku/kagawa.csv` (15 filas: 6 bodegas + 9 casas de salsa de soja, altas del 2026-08-04).
- Fuentes: 香川県酒造組合, <https://sanuki-sake.com/> (6 miembros, censo completo, **con dominio**) y 小豆島醤油協同組合, <https://shima-shoyu.com/> (14 socios + 4 casas de la isla fuera del gremio). Ambas leídas 2026-08-04.
- Estado: **sake ✅ integrado** (las 6) y **醤油 ✅ 9 de 18** (2026-08-04). Quedan 9 sin dominio localizado.

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

## 醤油 de Shodoshima — 9 integradas de 18 (2026-08-04)

Categoría `Condimentos`. Siete `verificado`, una `parcial` y una fuera.
Cinco con tienda propia.

| casa | municipio | resultado |
|---|---|---|
| Shokin Shoyu | Shodoshima | verificado · venta sí |
| Yamasan Shoyu | Shodoshima | verificado · venta sí |
| Kinryo Shoyu | Shodoshima | verificado · venta sí |
| Takahashi Shoten (Yamamo) | Shodoshima | verificado · venta sí |
| Takesan | Shodoshima | verificado · venta sí |
| Yamaroku Shoyu | Shodoshima | verificado · venta sin comprobar |
| Sakai Shoyu Kogyo | Shodoshima | verificado · venta sin comprobar |
| Yamahisa | Shodoshima | **parcial** · dominio con WAF |
| Yamahira Shoyuten | **Tonosho** | verificado · venta sí |

Lo que salió al abrirlas:
- **El dominio de 左海醤油工業 que publica la prensa está mudado.**
  `sakaishoyu.web.fc2.com` responde 200 pero es un aviso de renovación que salta
  a `sakai-syouyu.info`. Un 200 no basta: hay que leer el cuerpo. Su web propia
  además corrige el número de la calle (2125, no 2128).
- **ヤマヒサ devuelve 403 incluso con user-agent de navegador**, pero sirve cuerpo:
  es un WAF, no un sitio muerto (`AGENTS.md`). Sin poder leer su ficha se queda
  `parcial`, no se purga.
- **ヤマロク no publica carrito** pese a ser la casa más conocida de la isla fuera
  de Japón: se distribuye por terceros, así que su venta online no está
  comprobada. La fama no es evidencia de canal.
- **マルキン醤油 queda fuera**: es marca del grupo Morita (`moritakk.com`),
  descarte por masa. Su museo en la isla es visita, no obrador independiente.

**Sin dominio localizado, siguen en cola (9):** 丸島醤油, 小豆島醤油, 島醸,
元屋商店, 小豆島馬越醤油, 金大醤油 (socias del gremio) y 富士大醤油,
大森醤油醸造所 (Tonosho, fuera del gremio), más マルキン si se reconsidera.

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
