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

## Qué falta
- El gremio de sake de Saitama (`japansake.or.jp/sakagura/en/saitama/`) lista
  bastantes más bodegas que la única que trae el listado.
- Sin abrir: té de Sayama (de los tres grandes de Japón, y no aparece ninguno),
  fideos udon de Musashino, negi de Fukaya, batata de Kawagoe.
