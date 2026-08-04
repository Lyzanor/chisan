# Saitama — candidatos

- CSV: `data/csv/jp/kanto/saitama.csv` (4 filas, todas altas de esta pasada).
- Origen: listado aportado por el usuario, `listado_125_productores_locales_japon.xlsx` (2026-08-04).
- Estado: **4 integradas** el 2026-08-04 como `parcial`. Queda Matsuoka Brewing, que el gremio lista sin dominio.

| nombre | municipio | categoría | A/B | web |
|---|---|---|---|---|
| Venture Whisky / Chichibu Distillery | Chichibu | Destilados y licores | B | ichirosmalt.com |
| COEDO Brewery | Kawagoe | Cerveza | B | coedobrewery.com |
| Maeda Foods | Satte | Pan y cereal | B | maedashokuhin.co.jp |
| Matsuoka Brewing | Ogawa | Sake | B | japansake.or.jp (gremio) |
| Hiratsuka Confectionery / Tokyo Cacao | Soka | Chocolate | A | hiratsuka-seika.co.jp ⚠ ver nota |

⚠ **Tokyo Cacao** está a caballo entre dos prefecturas: el cacao se cultiva en
**Hahajima (Ogasawara, Tokio)** y el obrador que lo transforma es Hiratsuka
Seika en **Soka (Saitama)**. El origen lo marcó «Tokio / Saitama» sin resolver.
Una fila, no dos: decidir si pesa el cultivo (→ `jp/kanto/tokyo.csv`, municipio
Ogasawara) o el obrador (→ aquí). El catálogo sitúa por dónde se produce y
vende, así que lo más probable es Soka, con el origen en `descripcion`.

## Sake: el gremio, por fin (14, pasada 2026-08-04)

Fuentes: 日本酒造組合中央会 <https://japansake.or.jp/sakagura/jp/saitama/> (pág. 1
de 3) y el gremio prefectural 埼玉県酒造組合 <https://www.saisake.com/kuramoto/>.
Ninguna trae dominio. Categoría: `Sake`. Excluida 松岡醸造, ya arriba.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Yao Honten | 矢尾本店 | Chichibu |
| Buko Shuzo | 武甲酒造 | Chichibu |
| Taisei Chichibu Kikusui | タイセー秩父菊水酒造所 | Chichibu |
| Takizawa Shuzo | 滝澤酒造 | Fukaya |
| Fujihashi Tozaburo Shoten | 藤橋藤三郎商店 | Fukaya |
| Maruyama Shuzo | 丸山酒造 | Fukaya |
| Seiun Shuzo | 晴雲酒造 | Ogawa |
| Gonda Shuzo | 権田酒造 | Kumagaya |
| Kanbai Shuzo | 寒梅酒造 | Kuki |
| Ishii Shuzo | 石井酒造 | Satte |
| Fujisaki Sohei Shoten | 藤﨑摠兵衛商店 | Nagatoro |
| Asahara Shuzo | 麻原酒造 | Moroyama |
| Koyama Honke Shuzo | 小山本家酒造 | Saitama |
| Yokozeki Shuzoten | 横関酒造店 | Misato |
| Seiryu Shuzo | 清龍酒造 | ⚠ sin municipio en la fuente |

**キング醸造 羽生工場 (Hanyu)** es planta de un grupo de Hyogo: triar.
**寒梅酒造 (Kuki, Saitama)** no es 寒梅酒造 (Osaki, Miyagi), en `miyagi.md`.

## Qué falta
- El gremio de sake de Saitama (`japansake.or.jp/sakagura/en/saitama/`) lista
  bastantes más bodegas que la única que trae el listado.
- Sin abrir: té de Sayama (de los tres grandes de Japón, y no aparece ninguno),
  fideos udon de Musashino, negi de Fukaya, batata de Kawagoe.
