# Fukushima — candidatos

- CSV: `data/csv/jp/tohoku/fukushima.csv` (9 filas, altas del 2026-08-04).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/fukushima> (63 bodegas, leído 2026-08-04). Gremio: 福島県酒造協同組合, <http://www.sake-fukushima.jp/>.
- Estado: **9 integradas** el 2026-08-04 (7 `verificado`, 2 `parcial`); quedan 8 de la tabla y ~46 del censo. Evidencia en `data/evidence/jp/tohoku/fukushima.jsonl`.

Fukushima es la prefectura con más oros del 全国新酒鑑評会 de la última década:
el pool de bodegas con marca y tienda propia es de los mejores del país.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Akebono Shuzo | 曙酒造 | Aizubange |
| Toyokuni Shuzo | 豊国酒造 | Aizubange |
| Takahashi Shosaku Shuzoten | 高橋庄作酒造店 | Aizuwakamatsu |
| Nagurayama Shuzo | 名倉山酒造 | Aizuwakamatsu |
| Yumegokoro Shuzo | 夢心酒造 | Kitakata |
| Ohara Shuzo | 小原酒造 | Kitakata |
| Sasanokawa Shuzo | 笹の川酒造 | Koriyama |
| Kokken Shuzo | 國権酒造 | Minamiaizu |
| Kaito Otokoyama Shuzo | 開当男山酒造 | Minamiaizu |
| Hanaizumi Shuzo | 花泉酒造 | Minamiaizu |
| Eisen Shuzo | 榮川酒造 | Bandai |
| Matsuzaki Shuzo | 松崎酒造 | Ten'ei |
| Ohki Daikichi Honten | 大木代吉本店 | Yabuki |

## Integradas 2026-08-04 (9) — salidas de la cola de arriba

| bodega | municipio | resultado |
|---|---|---|
| Suehiro Shuzo | Aizuwakamatsu | verificado · venta sí |
| Niida Honke | Koriyama | verificado · venta sí |
| Yamatogawa Shuzoten | Kitakata | verificado · venta sí |
| Homare Shuzo | Kitakata | verificado · venta sí |
| Ninki Shuzo | Nihonmatsu | verificado · venta sí |
| Miyaizumi Meijo | Aizuwakamatsu | verificado · sin venta directa |
| Tsurunoe Shuzo | Aizuwakamatsu | verificado · sin carrito |
| Okunomatsu Shuzo | Nihonmatsu | **parcial** · web ilegible |
| Hiroki Shuzo Honten | Aizubange | **parcial** · sin web |

**El portal de la prefectura no sirve para el dominio.** `fukunosake.com` tiene
ficha por bodega con dirección y teléfono de las 55, pero **no publica la web de
ninguna** — comprobado en el listado y en una ficha suelta. Sirve para dirección,
municipio y contacto; el dominio hay que buscarlo bodega a bodega.

- **廣木酒造本店 (Hiroki) no tiene web propia**, y eso que su marca es de las más
  buscadas de Japón. Vende solo por distribuidor autorizado. Sin enlace externo
  no puede pasar de `parcial`: la fama no sustituye a la fuente.
- **宮泉銘醸 declara en su propia web que las fechas de venta las fija cada tienda
  autorizada**, o sea que no vende directo. Eso es un `no comprobado` razonado,
  no una falta de datos.
- **奥の松酒造 sirve su web pero devolvió solo el título**, sin cuerpo legible:
  confirma dominio vivo y propiedad, no actividad. Dirección y contacto salen del
  directorio de empresas del ayuntamiento de Nihonmatsu. Se queda `parcial`.
- **末廣酒造 tiene dos kura** (Kaeigura en Aizuwakamatsu, Hakushigura en
  Aizumisato). La fila toma la sede.

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
