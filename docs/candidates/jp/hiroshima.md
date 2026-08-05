# Hiroshima — candidatos

- CSV: `data/csv/jp/chugoku/hiroshima.csv` (9 filas, altas del 2026-08-05).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/hiroshima> (56 bodegas, leído 2026-08-04). Gremio: 広島県酒造組合, <http://www.hirosake.or.jp/>.
- Estado: **9 integradas** el 2026-08-05 (7 `verificado`, 2 `parcial`); quedan 7 de la tabla y ~40 del censo. Evidencia en `data/evidence/jp/chugoku/hiroshima.jsonl`.

**西条 (Saijo), en Higashihiroshima, es una de las tres capitales del sake de
Japón** junto a Nada (Hyogo) y Fushimi (Kioto), con las bodegas alineadas en una
sola calle. Categoría para todas: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Umeda Shuzojo | 梅田酒造場 | Hiroshima |
| Ikuma Shuzo | 生熊酒造 | Shobara |
| Kitamura Jozojo | 北村醸造場 | Shobara |
| Ono Shuzo | 小野酒造 | Kitahiroshima ⚠ |
| Aseed Brew | アシードブリュー | Fukuyama |
| Kawamoto Eisuke | 川本英介 | Akiota |

## Integradas 2026-08-05 (9) — salidas de la cola de arriba

| bodega | municipio | resultado |
|---|---|---|
| Kamotsuru Shuzo | Higashihiroshima | verificado · venta sí |
| Kamoizumi Shuzo | Higashihiroshima | verificado · venta sí |
| Imada Shuzo Honten | Higashihiroshima | verificado · venta sí |
| Enoki Shuzo | Kure | verificado · venta sí |
| Etajima Meijo | Etajima | verificado · venta sí |
| Nakao Jozo | **Takehara** | verificado · venta sí |
| Kanemitsu Shuzo | Higashihiroshima | verificado · sin carrito |
| Kyokuho Shuzo | Hiroshima | **parcial** · web bloqueada |
| Aihara Shuzo | Kure | **parcial** · sin web |

**El buscador del gremio no sirve**: `hirosake.org/app/service?brewery` se pinta
con JavaScript y en plano no devuelve nada. Hiroshima cuesta como Fukushima, una
búsqueda por bodega — no como Yamagata.

- **Imada Shuzo Honten sale de la bandeja del `README.md`** de esta carpeta: ya
  está en el CSV y no debe volver a proponerse. Su dominio público es el de la
  marca, `fukucho.jp`, no la razón social.
- **Nakao Jozo (Takehara) no estaba en la tabla**: salió del mismo censo al
  cazar dominios. Su web falla por HTTPS con **el certificado de `bizmw.com`, el
  mismo hosting que Morii Shokuhin en Nara**, y responde 200 por HTTP. Ese
  proveedor ya ha dado dos falsos muertos: probar HTTP antes de descartar.
- **旭鳳酒造 devuelve 403 con cuerpo mínimo**: bloqueo de bot, no sitio muerto
  (tercer caso tras Yamahisa). Sin poder leer la ficha se queda `parcial`.
- **相原酒造 (Ugo no Tsuki) no tiene web propia.** Tercer caso del patrón, tras
  Hiroki en Fukushima y Takagi en Yamagata: marcas muy valoradas y sin dónde
  enlazar, todas `parcial`.

## Trampas
- **今田酒造本店 (Imada Shuzo Honten, Higashihiroshima)** ya está en la bandeja
  del `README.md` de esta carpeta: no volver a proponerla como nueva.
- ⚠ **北広島町 (Kitahiroshima, Hiroshima) no es 北広島市 (Kitahiroshima,
  Hokkaido)**. Mismo nombre, 1.400 km. Si la fila se escribe con el municipio a
  secas, el gate geográfico la manda a Hokkaido y es error bloqueante —
  o peor, resuelve al centroide equivocado sin quejarse.
- ⚠ **金光酒造 (Higashihiroshima)** no es 金光酒造 (Yamaguchi-shi), en
  `yamaguchi.md`. Mismo 社名, prefecturas vecinas.
- **アシードブリュー (Fukuyama)** es filial de un grupo de bebidas (Aseed Holdings):
  candidata a descarte por masa, mirar si tiene marca de sake propia.
- **川本英介** es un nombre de persona como razón social: confirmar el nombre
  comercial de la bodega antes de escribir el `nombre` de la fila.
- 西条 es un barrio de 東広島市 (Higashihiroshima), no un municipio; y hay un
  **西条市 (Saijo)** que es una ciudad de Ehime, en `ehime.md`.

## Qué falta
- Las ~43 bodegas restantes del censo, empezando por el resto de la calle de
  Saijo, que son las que tienen tienda y venta online.
- Sin abrir: **牡蠣 (ostra)** — Hiroshima produce en torno al 60% del nacional y
  hay cofradías y criaderos con marca; **レモン de Setoda/Ikuchijima** (casi todo
  el limón japonés); もみじ饅頭 (decenas de obradores en Miyajima), 広島菜漬,
  お好み焼き のソース (Otafuku y las casas pequeñas), 比婆牛.
