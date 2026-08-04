# Nara — candidatos

- CSV: `data/csv/jp/kansai/nara.csv` (25 filas, todas altas de esta pasada).
- Fuente: 奈良県酒造組合 (Nara Sake Brewers Association), <https://yamato-umazake.com/brewery-introduction/> — los 26 miembros del gremio, con marca, municipio y dominio propio.
- Estado: **25 de 26 integradas** en el CSV el 2026-08-04 como `parcial`. Queda 1: Yoshimura Shuzo (Uda), dejada fuera porque su única URL es una ruta de hosting de proveedor (`begin.or.jp/~inadoya`) y hay que localizar dominio vivo.

Todo lo de abajo es `unverified`: sale del listado del gremio, no de la web del
productor. Antes de pasar a CSV, abrir el dominio y confirmar identidad,
actividad y municipio; solo-registro sostiene `parcial`. El rōmaji de `nombre` y
`municipio` es propuesta a confirmar contra la propia web.

Categoría para todos: `Sake` (`Bodega` quedó retirada el 2026-08-04).

| nombre (rōmaji propuesto) | 社名 | marca | municipio | web |
|---|---|---|---|---|
| Imanishi Seibee Shoten | 今西清兵衛商店 | 春鹿 Harushika | Nara | harushika.com |
| Nara Toyosawa Shuzo | 奈良豊澤酒造 | 豊祝 Hoshuku | Nara | nara-toyosawa.jp |
| Kuramoto Shuzo | 倉本酒造 | 金嶽 Kingake | Nara | kuramoto-sake.com |
| Ueda Shuzo | 上田酒造 | 嬉長 Kicho | Ikoma | ueda-syuzou.com |
| Kikutsukasa Jozo | 菊司醸造 | 菊司 Kikutsukasa | Ikoma | kikutsukasa.pro |
| Nakamoto Shuzoten | 中本酒造店 | 山鶴 Yamatsuru | Ikoma | yamaturu.com |
| Inada Shuzo | 稲田酒造 | 黒松稲天 Kuromatsu Inaten | Tenri | inaten.com |
| Nakatani Shuzo | 中谷酒造 | 朝榮 Asaka | Yamatokoriyama | sake-asaka.co.jp |
| Kita Shuzo | 喜多酒造 | 御代菊 Miyokiku | Kashihara | miyokiku.com |
| Kawai Shuzo | 河合酒造 | 出世男 Shusseotoko | Kashihara | facebook.com/syusseotoko (sin web propia) |
| Sawada Shuzo | 澤田酒造 | 歓喜光 Kankiko | Kashiba | kankiko.jp |
| Okura Honke | 大倉本家 | 金鼓 Kinko | Kashiba | kinko-ookura.com |
| Umenoyado Shuzo | 梅乃宿酒造 | 梅乃宿 Umenoyado | Katsuragi | umenoyado.com |
| Choryo Shuzo | 長龍酒造 | 吉野杉の樽酒 | Koryo | choryo.jp |
| Yucho Shuzo | 油長酒造 | 風の森 Kaze no Mori | Gose | yucho-sake.jp |
| Katsuragi Shuzo | 葛城酒造 | 百楽門 Hyakurakumon | Gose | hyakurakumon-sake.com |
| Chiyo Shuzo | 千代酒造 | 櫛羅 Kujira | Gose | chiyoshuzo.co.jp |
| Yamamoto Honke | 山本本家 | 松の友 Matsu no Tomo | Gojo | matsunotomo.com |
| Gojo Shuzo | 五條酒造 | 五神 Goshin | Gojo | sake-goshin.com |
| Imanishi Shuzo | 今西酒造 | みむろ杉 Mimurosugi | Sakurai | imanishisyuzou.com |
| Nishiuchi Shuzo | 西内酒造 | 談山 Tanzan | Sakurai | nara-tanzan.com |
| Yoshimura Shuzo | 芳村酒造 | 千代乃松 Chiyonomatsu | Uda | begin.or.jp/~inadoya |
| Kubo Honke Shuzo | 久保本家酒造 | 初霞 Hatsugasumi | Uda | kubohonke.com |
| Kitamura Shuzo | 北村酒造 | 猩々 Shojo | Yoshino | kitamurasyuzou.co.jp |
| Kitaoka Honten | 北岡本店 | 八咫烏 Yatagarasu | Yoshino | kitaoka-honten.com |
| Fujimura Shuzo | 藤村酒造 | 万代老松 Mandai Oimatsu | Shimoichi | yoshino-umazake.com |

## Trampas vistas
- `Koryo` es 広陵町 dentro de 北葛城郡, y `Yoshino`/`Shimoichi` están dentro de
  吉野郡: el `municipio` del CSV es el町, no el郡.
- Dos dominios son frágiles: `begin.or.jp/~inadoya` (hosting de proveedor, no
  dominio propio) y la ficha de Facebook de Kawai Shuzo. Si no cargan, tope
  `parcial`, no purga.

## Qué falta
- Nada de fuera del sake: el gremio solo cubre bodegas. Nara tiene además té de
  Yamato, kudzu de Yoshino y persimón; sin fuente institucional localizada aún.
