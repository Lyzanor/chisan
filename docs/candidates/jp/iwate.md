# Iwate — candidatos

- CSV: `data/csv/jp/tohoku/iwate.csv` (6 filas, altas del 2026-08-05).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/iwate> (22 bodegas, leído 2026-08-04). Gremio: 岩手県酒造組合, <http://www.ginga.or.jp/~syuzou/>.
- Estado: **6 integradas** el 2026-08-05, todas `verificado`, 5 con tienda propia — el mejor ratio de venta directa de la pasada. Evidencia en `data/evidence/jp/tohoku/iwate.jsonl`.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Kikunotsukasa Shuzo | 菊の司酒造 | Morioka |
| Sakuragao Shuzo | 桜顔酒造 | Morioka |
| Azumamine Shuzoten | 吾妻嶺酒造店 | Shiwa |
| Tsuki no Wa Shuzoten | 月の輪酒造店 | Shiwa |
| Hirota Shuzoten | 廣田酒造店 | Shiwa |
| Takahashi Shuzoten | 高橋酒造店 | Shiwa |
| Kawamura Shuzoten | 川村酒造店 | Hanamaki |
| Kikuzakari Shuzo | 喜久盛酒造 | Kitakami |
| Iwanoi Shuzo | 磐乃井酒造 | Ichinoseki |
| Ryoban Shuzo | 両磐酒造 | Ichinoseki |
| Iwate Meijo | 岩手銘醸 | Oshu |
| Kamihei Shuzo | 上閉伊酒造 | Tono |
| Senkin Shuzo | 泉金酒造 | Iwaizumi |
| Washinoo | わしの尾 | Hachimantai |

## Integradas 2026-08-05 (6) — todas verificado

| bodega | municipio | resultado |
|---|---|---|
| Nanbu Bijin | Ninohe | verificado · venta sí |
| Sekinoichi Shuzo | Ichinoseki | verificado · venta sí |
| Suisen Shuzo | **Ofunato** ⚠ | verificado · venta sí |
| Akabu Shuzo | **Morioka** ⚠ | verificado · venta sí |
| Hamachidori | Kamaishi | verificado · venta sí |
| Asabiraki | Morioka | verificado · sin carrito |

⚠ **Dos de las seis cambiaron de municipio por el tsunami de 2011**, y el
candidato las daba en el sitio antiguo:
- **酔仙酒造** era de Rikuzentakata; aquel kura fue destruido y hoy elabora en el
  Ofunato-gura. La fila toma **Ofunato**, porque el área es donde se produce.
- **赤武酒造** era de Otsuchi y se reconstruyó en **Morioka**.

Es el segundo caso de sede contra planta tras Niizawa en `miyagi.md`, y aquí
son dos de seis: **en la costa de Tohoku hay que confirmar el municipio actual
antes de escribir la fila**, no dar por buena la dirección histórica.

- **世嬉の一 elabora sake y la cerveza Iwate Kura en el mismo recinto**: una sola
  fila, con la categoría que pesa, como ya se decidió para Kiuchi en `ibaraki.md`.
- **Cinco de seis con tienda propia** es el mejor ratio de venta directa de toda
  la pasada. La costa de Iwate vende online porque su mercado local se hundió.

## Trampas
- **紫波町 (Shiwa) concentra cuatro bodegas** con apellidos frecuentes
  (高橋, 廣田): casar por 社名 completo, no por apellido.
- 世嬉の一 hace además cerveza (いわて蔵ビール) en la misma casa: es **una fila**,
  no dos, con la `categoria` que pese.

## Qué falta
- Las ~8 bodegas restantes del censo.
- Sin abrir: wanko-soba y fideos de Morioka, 南部鉄器 (no alimentario), lácteos de
  Kuzumaki, marisco de Sanriku, 醤油/味噌 de Hanamaki.
