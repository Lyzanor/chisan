# Akita — candidatos

- CSV: `data/csv/jp/tohoku/akita.csv` (6 filas, altas del 2026-08-05).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/akita> (42 bodegas, leído 2026-08-04). Gremio: 秋田県酒造組合, <http://www.osake.or.jp/>.
- Estado: **6 integradas** el 2026-08-05 (4 `verificado`, 2 `parcial`). Evidencia en `data/evidence/jp/tohoku/akita.jsonl`.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Akita Jozo | 秋田醸造 | Akita |
| Akita Shuzo | 秋田酒造 | Akita |
| Nawa Shoten | 那波商店 | Akita |
| Akita Seishu | 秋田清酒 | Daisen |
| Kariho Shuzo | 刈穂酒造 | Daisen |
| Dewatsuru Shuzo | 出羽鶴酒造 | Daisen |
| Fukunotomo Shuzo | 福乃友酒造 | Daisen |
| Suzuki Shuzoten | 鈴木酒造店 | Daisen |
| Azakura Shuzo | 阿櫻酒造 | Yokote |
| Asamai Shuzo | 浅舞酒造 | Yokote |
| Ryozeki Shuzo | 両関酒造 | Yuzawa |
| Akita Meijo | 秋田銘醸 | Yuzawa |
| Tenju Shuzo | 天寿酒造 | Yurihonjo |
| Fukurokuju Shuzo | 福禄寿酒造 | Gojome |
| Yamamoto Shuzoten | 山本酒造店 | Happo |
| Kodama Jozo | 小玉醸造 | Katagami |

## Integradas 2026-08-05 (6)

| bodega | municipio | resultado |
|---|---|---|
| Akita Shurui Seizo (Takashimizu) | Akita | verificado · venta sí |
| Kimura Shuzo (Fukukomachi) | Yuzawa | verificado · venta sí |
| Hiraizumi Honpo | Nikaho | verificado · sin carrito |
| Saiya Shuzoten (Yuki no Bosha) | Yurihonjo | verificado · **venta = no** |
| Aramasa Shuzo | Akita | **parcial** · sin web |
| Hinomaru Jozo | Yokote | **parcial** · solo Instagram |

⚠ **`Daisen` resolvía al Daisen de Tottori** (大山町) en vez de 大仙市, a 600 km:
error bloqueante, y **cinco bodegas de la cola de arriba están en Daisen**.
Resuelto el 2026-08-05 en `municipality-overrides.json` (chugoku vs tohoku),
antes de escribir esas filas.

- **齋彌酒造店 es el primer `Venta online = no` explícito del país**, no un «no
  comprobado»: su propia web declara que no hace envío minorista y remite a
  tienda especializada. Merece la pena distinguirlo — la mayoría de los «no
  comprobado» de esta pasada son falta de dato, éste es un hecho.
- **新政酒造 no tiene dominio propio activo** (`aramasa.jp` no responde) pese a
  ser de las marcas más buscadas del país y el origen de la levadura kyokai nº 6.
  Sexto caso del patrón tras Hiroki, Takagi, Aihara, Suminoe y Heiko.
- **日の丸醸造 solo tiene Instagram.** Sirve de enlace externo, pero no permite
  leer actividad, así que se queda `parcial`.

## Trampas
- **秋田県醗酵工業 (Yuzawa)** es industria de alcohol/destilado a granel, no una
  bodega de marca: triar antes de escribir fila.
- Seis 社名 empiezan por 秋田 y son empresas distintas (秋田酒造 ≠ 秋田酒類製造 ≠
  秋田醸造 ≠ 秋田清酒 ≠ 秋田銘醸 ≠ 秋田誉酒造). Casar por 社名 completo.
- **喜久水酒造 (Kikusui Shuzo, Noshiro)** no es 菊水酒造 (Kikusui, Shibata,
  Niigata), ya listada en `niigata.md`. Rōmaji casi idéntico, dos empresas.
- 仙北郡美郷町 y 南秋田郡五城目町 son 町 dentro de 郡: el `municipio` es Misato,
  Gojome — no el 郡.

## Qué falta
- Las ~20 bodegas restantes del censo.
- Sin abrir: きりたんぽ, いぶりがっこ (encurtido ahumado, con GI propia), arroz
  Akitakomachi, 稲庭うどん de Yuzawa (fideos con denominación y muchos obradores).
