# Kioto — candidatos

- CSV: `data/csv/jp/kansai/kyoto.csv` (23 filas: 15 previas más 8 bodegas del 2026-08-05).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/kyoto> (51 bodegas, leído 2026-08-04). Gremio: 京都府酒造組合, <http://kyoto-sake.sakura.ne.jp>.
- Estado: **8 integradas** el 2026-08-05, todas `verificado`, 5 con tienda propia. Evidencia en `data/evidence/jp/kansai/kyoto.jsonl`.

Kioto es la segunda zona sakera de Japón por volumen (Fushimi), y el CSV solo
tiene tres bodegas. Categoría para todas: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Kyohime Shuzo | 京姫酒造 | Kyoto (伏見) |
| Kyodo Shuzo | 共同酒造 | Kyoto |
| Koyama Honke Shuzo | 小山本家酒造 | Kyoto ⚠ |
| Kumano Shuzo | 熊野酒造 | Kyotango |
| Ikeda Shuzo | 池田酒造 | Maizuru |
| Shiraito Shuzo | 白糸酒造 | Miyazu |

## Integradas 2026-08-05 (8) — todas verificado

| bodega | municipio | resultado |
|---|---|---|
| Kizakura | Kyoto (Fushimi) | verificado · venta sí |
| Kitagawa Honke | Kyoto (Fushimi) | verificado · venta sí |
| Saito Shuzo (Eikun) | Kyoto (Fushimi) | verificado · venta sí |
| Shotoku Shuzo | Kyoto (Fushimi) | verificado · venta sí |
| Kinshi Masamune | Kyoto (Fushimi) | verificado · venta sí |
| Kinoshita Shuzo (Tamagawa) | Kyotango | verificado · sin carrito |
| Joyo Shuzo | Joyo | verificado · sin carrito |
| Oishi Shuzo (Okinazuru) | Kameoka | verificado · sin carrito |

**El gremio de Fushimi (`fushimi.or.jp/brewery/`) lista sus 22 socios pero no
publica el dominio de ninguno**: sirve para censo y municipio, no para enlace.

- ⚠ **月桂冠 (Gekkeikan) queda fuera por masa.** Es de los mayores productores de
  sake del mundo, con planta en California; el «Qué falta» pedía decidirlo
  explícitamente y esta es la decisión (`docs/EDITORIAL_POLICY.md`, grupos).
  **黄桜 sí entra**: es grande pero de identidad local — un solo kura en Fushimi,
  cerveza artesana propia y planta visitable. La línea se traza en escala
  industrial y deslocalización, no en facturación.
  Su dominio, además, no respondió ni por HTTP ni por HTTPS desde aquí.
- **松竹梅 (Takara) sigue fuera** por lo ya anotado en `hyogo.md`: su sede es
  Kioto pero su unidad de Nada es planta de grupo.
- **Dos webs sirven en codificación antigua** — `eikun.com` en Shift_JIS y
  `okinazuru.co.jp` en EUC-JP — y el título llega ilegible al leerlas como UTF-8.
  El cuerpo sí se lee: no son sitios rotos.
- **La tienda de Kitagawa Honke no se enlaza desde su portada**, así que el
  barrido de hrefs no la vio; la confirmó abrir `shop-tomio.com` directamente.

## Trampas
- ⚠ **小山本家酒造** tiene su sede en **さいたま市 (Saitama)** — está en
  `saitama.md` — y en Fushimi opera una planta. Si la unidad de Kioto no tiene
  marca e identidad propias, la fila correcta es la de Saitama, no ésta
  (`docs/EDITORIAL_POLICY.md`, grupos).
- **伏見 (Fushimi) es un 区 de la ciudad de Kioto**, no un municipio: la fila lleva
  `Kyoto`. Lo mismo que ya se resolvió para Uji y las casas de té del CSV.
- **月桂冠 y 黄桜** son grupos grandes con distribución nacional: entran por
  terroir e identidad propia, no se descartan por tamaño, pero conviene decidirlo
  explícitamente y no por inercia.
- **木下酒造 (Kyotango, marca 玉川)** no es 木下醸造所 (Taragi, Kumamoto), que está
  en `kumamoto.md`.
- 京丹後市 y 宮津市 son el **norte marítimo** (Tango), a 100 km de Fushimi: no
  asumir que «Kioto» es la ciudad al geocodificar.

## Qué falta
- Las ~36 bodegas restantes del censo.
- El CSV de Kioto ya cubre bien té (Uji), condimentos y dulces. Sin abrir:
  **京野菜** (verdura tradicional con marca propia y productores identificables),
  湯葉/豆腐, 京漬物 más allá de las dos casas ya presentes, y **sake de Tango**,
  que es una zona distinta de Fushimi y no aparece en el CSV.
