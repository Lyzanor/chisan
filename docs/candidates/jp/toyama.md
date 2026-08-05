# Toyama — candidatos

- CSV: `data/csv/jp/chubu/toyama.csv` (5 filas, altas del 2026-08-05).
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/toyama> (20 bodegas, leído 2026-08-04). Gremio: 富山県酒造組合, <http://www.toyama-sake.or.jp/>.
- Estado: **5 integradas** el 2026-08-05, todas `verificado`; quedan 9 de la tabla. Evidencia en `data/evidence/jp/chubu/toyama.jsonl`.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Tamaasahi Shuzo | 玉旭酒造 | Toyama |
| Fukutsuru Shuzo | 福鶴酒造 | Toyama |
| Kiyoto Shuzojo | 清都酒造場 | Takaoka |
| Ginban Shuzo | 銀盤酒造 | Kurobe |
| Kuroda Shuzo | 黒田酒造 | Oyabe |
| Narimasa Shuzo | 成政酒造 | Nanto |
| Chiyozuru Shuzo | 千代鶴酒造 | Namerikawa |
| Hongo Shuzo | 本江酒造 | Uozu |
| Hayashi Shuzojo | 林酒造場 | Asahi ⚠ |

## Integradas 2026-08-05 (5) — todas verificado

| bodega | municipio | resultado |
|---|---|---|
| Masuda Shuzoten (Masuizumi) | Toyama | verificado · sin carrito |
| Fumigiku Shuzo (Haneya) | Toyama | verificado · sin carrito |
| Tateyama Shuzo | Tonami | verificado · sin carrito |
| Sanshoraku Shuzo | Nanto | verificado · sin carrito |
| Takazawa Shuzojo | Himi ⚠ | verificado · sin carrito |

⚠ **高澤酒造場 perdió su kura en el terremoto de Noto de enero de 2024** y está
reconstruyendo con micromecenazgo. Sigue activa, así que no es purga, pero es el
mismo aviso que las bodegas de Wajima en `ishikawa.md`: aquí «sigue abierta»
exige evidencia reciente y hay que revisarla en la próxima pasada.

- **Ninguna de las cinco publica carrito.** Toyama es, de las prefecturas
  recorridas, la que menos venta directa tiene: cinco de cinco sin tienda.
- **El gremio de Toyama no publica dominios**, al contrario que el de Yamagata:
  sus páginas `/pages/NN/` dan el listado de socios y los datos de la propia
  asociación, no la ficha con web de cada bodega.
- **`tateyamabrewing.jp` no casa con el nombre de la empresa**; se confirmó que
  es suyo por el registro de empresas del ayuntamiento de Tonami.

## Trampas
- ⚠ **朝日町 (Asahi)**: hay municipios llamados Asahi en Toyama, Yamagata, Nagano,
  Mie y Aichi. El de esta fila es 下新川郡朝日町 (Toyama). Comprobar que el
  centroide que resuelve es el de esta prefectura antes de fiarse del gate.
- **三笑楽 y 成政 comparten municipio (Nanto)**, resultado de una fusión Heisei que
  se comió 城端町 y 福光町: la dirección histórica de sus webs puede llevar el
  nombre viejo, que ya no resuelve.

## Qué falta
- Las 6 bodegas restantes del censo.
- Sin abrir: **鱒寿司 (masuzushi) de Toyama**, que tiene decenas de obradores
  artesanos y hasta gremio propio — el frente más claro de la prefectura;
  白えび y ホタルイカ (marisco de la bahía), 昆布〆, 干し柿 de Nanto.
