# Toyama — candidatos

- CSV: `data/csv/jp/chubu/toyama.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/toyama> (20 bodegas, leído 2026-08-04). Gremio: 富山県酒造組合, <http://www.toyama-sake.or.jp/>.
- Estado: cola abierta, 14 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Masuda Shuzoten | 桝田酒造店 | Toyama |
| Fumigiku Shuzo | 富美菊酒造 | Toyama |
| Tamaasahi Shuzo | 玉旭酒造 | Toyama |
| Fukutsuru Shuzo | 福鶴酒造 | Toyama |
| Kiyoto Shuzojo | 清都酒造場 | Takaoka |
| Ginban Shuzo | 銀盤酒造 | Kurobe |
| Kuroda Shuzo | 黒田酒造 | Oyabe |
| Sanshoraku Shuzo | 三笑楽酒造 | Nanto |
| Narimasa Shuzo | 成政酒造 | Nanto |
| Takazawa Shuzojo | 高澤酒造場 | Himi |
| Tateyama Shuzo | 立山酒造 | Tonami |
| Chiyozuru Shuzo | 千代鶴酒造 | Namerikawa |
| Hongo Shuzo | 本江酒造 | Uozu |
| Hayashi Shuzojo | 林酒造場 | Asahi ⚠ |

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
