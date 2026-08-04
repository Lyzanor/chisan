# Fukushima — candidatos

- CSV: `data/csv/jp/tohoku/fukushima.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/fukushima> (63 bodegas, leído 2026-08-04). Gremio: 福島県酒造協同組合, <http://www.sake-fukushima.jp/>.
- Estado: cola abierta, 17 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Fukushima es la prefectura con más oros del 全国新酒鑑評会 de la última década:
el pool de bodegas con marca y tienda propia es de los mejores del país.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Hiroki Shuzo Honten | 廣木酒造本店 | Aizubange |
| Akebono Shuzo | 曙酒造 | Aizubange |
| Toyokuni Shuzo | 豊国酒造 | Aizubange |
| Suehiro Shuzo | 末廣酒造 | Aizuwakamatsu |
| Miyaizumi Meijo | 宮泉銘醸 | Aizuwakamatsu |
| Tsurunoe Shuzo | 鶴乃江酒造 | Aizuwakamatsu |
| Takahashi Shosaku Shuzoten | 高橋庄作酒造店 | Aizuwakamatsu |
| Nagurayama Shuzo | 名倉山酒造 | Aizuwakamatsu |
| Yamatogawa Shuzoten | 大和川酒造店 | Kitakata |
| Yumegokoro Shuzo | 夢心酒造 | Kitakata |
| Homare Shuzo | ほまれ酒造 | Kitakata |
| Ohara Shuzo | 小原酒造 | Kitakata |
| Okunomatsu Shuzo | 奥の松酒造 | Nihonmatsu |
| Ninki Shuzo | 人気酒造 | Nihonmatsu |
| Niida Honke | 仁井田本家 | Koriyama |
| Sasanokawa Shuzo | 笹の川酒造 | Koriyama |
| Kokken Shuzo | 國権酒造 | Minamiaizu |
| Kaito Otokoyama Shuzo | 開当男山酒造 | Minamiaizu |
| Hanaizumi Shuzo | 花泉酒造 | Minamiaizu |
| Eisen Shuzo | 榮川酒造 | Bandai |
| Matsuzaki Shuzo | 松崎酒造 | Ten'ei |
| Ohki Daikichi Honten | 大木代吉本店 | Yabuki |

## Trampas
- **大七酒造 (Daishichi, Nihonmatsu)** ya está en la bandeja del `README.md` de
  esta carpeta: no volver a proponerla como nueva.
- **豊國酒造 (Furudono, 石川郡) y 豊国酒造 (Aizubange, 河沼郡) son dos empresas
  distintas** que solo se diferencian en un kanji (國/国). No fusionar filas.
- **榮川酒造株式会社 (Bandai) y 榮川酒造合資会社 (Minamiaizu)**: misma trampa, la
  forma societaria es lo único que las separa en el listado.
- 会津 se reparte en muchos municipios de nombre parecido — 会津若松市,
  会津坂下町, 会津美里町, 南会津町 — y el `municipio` no es «Aizu».
- La franja costera (いわき, y los municipios evacuados tras 2011) exige evidencia
  reciente de actividad: aquí «sigue abierta» no es un trámite.

## Qué falta
- Las ~40 bodegas restantes del censo.
- Sin abrir: melocotón de Fukushima (segunda de Japón), 会津の味噌・醤油,
  きゅうり/アスパラ, 喜多方ラーメン, 会津本郷焼 (no alimentario).
