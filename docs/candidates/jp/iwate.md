# Iwate — candidatos

- CSV: `data/csv/jp/tohoku/iwate.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/iwate> (22 bodegas, leído 2026-08-04). Gremio: 岩手県酒造組合, <http://www.ginga.or.jp/~syuzou/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Nanbu Bijin | 南部美人 | Ninohe |
| Asabiraki | あさ開 | Morioka |
| Akabu Shuzo | 赤武酒造 | Morioka |
| Kikunotsukasa Shuzo | 菊の司酒造 | Morioka |
| Sakuragao Shuzo | 桜顔酒造 | Morioka |
| Azumamine Shuzoten | 吾妻嶺酒造店 | Shiwa |
| Tsuki no Wa Shuzoten | 月の輪酒造店 | Shiwa |
| Hirota Shuzoten | 廣田酒造店 | Shiwa |
| Takahashi Shuzoten | 高橋酒造店 | Shiwa |
| Kawamura Shuzoten | 川村酒造店 | Hanamaki |
| Kikuzakari Shuzo | 喜久盛酒造 | Kitakami |
| Sekinoichi Shuzo | 世嬉の一酒造 | Ichinoseki |
| Iwanoi Shuzo | 磐乃井酒造 | Ichinoseki |
| Ryoban Shuzo | 両磐酒造 | Ichinoseki |
| Iwate Meijo | 岩手銘醸 | Oshu |
| Suisen Shuzo | 酔仙酒造 | Rikuzentakata |
| Kamihei Shuzo | 上閉伊酒造 | Tono |
| Hamachidori | 浜千鳥 | Kamaishi |
| Senkin Shuzo | 泉金酒造 | Iwaizumi |
| Washinoo | わしの尾 | Hachimantai |

## Trampas
- **紫波町 (Shiwa) concentra cuatro bodegas** con apellidos frecuentes
  (高橋, 廣田): casar por 社名 completo, no por apellido.
- 世嬉の一 hace además cerveza (いわて蔵ビール) en la misma casa: es **una fila**,
  no dos, con la `categoria` que pese.

## Qué falta
- Las ~8 bodegas restantes del censo.
- Sin abrir: wanko-soba y fideos de Morioka, 南部鉄器 (no alimentario), lácteos de
  Kuzumaki, marisco de Sanriku, 醤油/味噌 de Hanamaki.
