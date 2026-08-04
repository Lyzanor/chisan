# Viana do Castelo — candidatos

- CSV: `data/csv/pt/norte/viana-do-castelo.csv` (4 filas, todas altas de esta pasada).
- Fuentes: Rota do Alvarinho de Monção & Melgaço, <https://www.rotadoalvarinho.pt/>; portal VinhAlvarinho, <https://www.vinhalvarinho.pt/>; Rota dos Vinhos Verdes (CVRVV), consulta por concelho en <http://rota.vinhoverde.pt/pt/consulta-de-aderentes>.
- Estado: **4 integradas** en el CSV el 2026-08-04 como `parcial` (Soalheiro, Anselmo Mendes, Quintas de Melgaço, Palácio da Brejoeira). Quedan 12: PROVAM por ser agrupación, y 11 sin concelho confirmado.

Monção y Melgaço son la subregión del Alvarinho y ambos concelhos están en este
distrito. La fuente habla de **más de 50 productores** en la subregión: lo de
abajo es la punta, no el censo. Categoría para todos: `Vino`.

| nombre | concelho | pista |
|---|---|---|
| Quinta de Soalheiro | Melgaço | primera marca de Alvarinho de Melgaço (1982); viñas de 1974 |
| Anselmo Mendes Vinhos | Monção | quinta en Monção y vinos de Melgaço |
| PROVAM – Produtores de Vinhos Alvarinho Monção, Lda | Monção | agrupación de productores; visitas de 90 min ⚠ |
| Quintas de Melgaço | Melgaço | vinhalvarinho.pt |
| Palácio da Brejoeira | Monção | Alvarinho histórico de la casa |
| Adega do Sossego | Monção o Melgaço (a confirmar) | — |
| Alvaianas | Monção o Melgaço (a confirmar) | — |
| Casa de Midão | Monção o Melgaço (a confirmar) | — |
| Casa de Cerdedo | Monção o Melgaço (a confirmar) | — |
| Dom Salvador | Monção o Melgaço (a confirmar) | — |
| Dona Paterna | Monção o Melgaço (a confirmar) | — |
| Encosta dos Castelos | Monção o Melgaço (a confirmar) | — |
| Quinta da Pigarra | Monção o Melgaço (a confirmar) | — |
| Quinta das Pereirinhas | Monção o Melgaço (a confirmar) | — |
| Quinta do Regueiro | Monção o Melgaço (a confirmar) | — |
| Reguengo de Melgaço | Melgaço | el topónimo lo sitúa, confirmar igual |

⚠ **PROVAM** es una agrupación de productores: si comercializa marca propia entra
como fila; si solo agrupa a socios que ya tienen la suya, es duplicado.

Notas de integración:
- Las once filas «a confirmar» salen de un resumen de la ruta, no de un registro:
  confirmar existencia, concelho y actividad una a una antes de tocar el CSV.
- **`melgaco` y `moncao` no colisionan con ningún municipio español**, así que el
  gate geográfico funciona sin override.

## Qué falta
- **El censo real**: la consulta de aderentes de la CVRVV filtra por concelho,
  pero pinta los resultados con JavaScript y no se ve en HTML plano. Hay que
  atacar el endpoint que hay detrás, no la página.
- El distrito es mucho más que Alvarinho: faltan Viana do Castelo, Ponte de Lima,
  Arcos de Valdevez, Caminha, Ponte da Barca, Paredes de Coura.
- Sin abrir: sarrabulho y fumeiro do Minho, mel do Parque de Montesinho/Peneda,
  pescado y sargaço de Caminha, doçaria conventual de Viana.
