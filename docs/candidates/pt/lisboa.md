# Lisboa — candidatos

- CSV: `data/csv/pt/lisboa-e-vale-do-tejo/lisboa.csv` (3 filas, todas altas de esta pasada).
- Fuente: Rota dos Vinhos de Bucelas, Carcavelos e Colares, <http://www.rotadosvinhosbcc.com/bcc/pt/> (concelhos de Loures, Cascais, Oeiras y Sintra) y <http://rotadosvinhosdeportugal.pt/en/routes/bucelas-carcavelos-and-colares/>.
- Estado: **3 integradas** en el CSV el 2026-08-04 como `parcial` (Adega Regional de Colares, ManzWine, Quinta Sant'Ana). Quedan Adegas Ribamar y Caves Visconde de Salreu, sin fuente propia localizada.

Categoría para todos: `Vino`.

| nombre | concelho | pista |
|---|---|---|
| Adega Regional de Colares | Sintra | cooperativa más antigua de Portugal (1931); DOP Colares |
| Adegas Ribamar | Sintra | Colares |
| Caves Visconde de Salreu | Sintra | Colares |
| ManzWine | Mafra | Cheleiros |
| Quinta Sant'Ana | Mafra | Gradil |

Notas de integración:
- `sintra` y `mafra` no colisionan con ningún municipio español; `oeiras` y
  `loures` tampoco. Sin overrides que tocar.
- Colares es una DOP diminuta (viña en arena sobre la costa): las tres primeras
  son casi todo lo que queda, así que conviene verificarlas bien antes que buscar
  volumen.

## Qué falta
Es el distrito con más población del país y está en cero. Frentes abiertos:
- **Bucelas DOP** (Loures): la ruta lo cubre pero la fuente no nombró productores.
  Museu do Vinho e da Vinha de Bucelas como punto de entrada.
- **Carcavelos DOP** (Oeiras/Cascais): vino generoso casi extinto, pocas fincas.
- **DOC/IG Lisboa** en los concelhos del norte del distrito — Torres Vedras,
  Alenquer, Arruda dos Vinhos, Óbidos, Lourinhã (esta con **aguardente DOC**,
  categoría `Destilados y licores`).
- Ciudad de Lisboa: pastelaria y conservas históricas, ginjinha, tostadores de
  café, cervecerías artesanas. Aquí el riesgo no es encontrar, es distinguir
  productor de tienda o franquicia turística.
