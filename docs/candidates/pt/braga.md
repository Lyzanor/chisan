# Braga — candidatos

- CSV: `data/csv/pt/norte/braga.csv` (1 filas, todas altas de esta pasada).
- Fuente: Rota dos Vinhos Verdes (CVRVV), consulta por concelho en <http://rota.vinhoverde.pt/pt/consulta-de-aderentes>; subregión Cávado (Esposende, Barcelos, Braga, Vila Verde, Amares, Terras de Bouro).
- Estado: **1 integrada** (Quinta D'Amares) el 2026-08-04. Las otras dos siguen fuera: Adega do Alto Cávado sin concelho y Quinta da Raza sin fuente propia.

Este fichero está más para dejar la ruta abierta que por lo que trae. La consulta
de aderentes de la CVRVV, que es la fuente buena del distrito, pinta el listado
con JavaScript y no devuelve nada en HTML plano: hay que ir al endpoint que hay
detrás (el patrón está en `docs/candidates/README.md`, «el endpoint de datos
detrás del JS»). Hasta entonces esto es lo que hay. Categoría: `Vino`.

| nombre | concelho | pista |
|---|---|---|
| Quinta D'Amares | Amares | 55 ha junto al Mosteiro de Rendufe; Loureiro, Alvarinho, Arinto |
| Adega do Alto Cávado (Cavagri, CRL) | a confirmar | cooperativa de la subregión Cávado |
| Quinta da Raza | Celorico de Basto | productor de Vinho Verde, concelho de este distrito |

Las tres salen de prensa sectorial y resúmenes de ruta, no de un registro:
ninguna es utilizable sin abrir su web y confirmar identidad, actividad y
concelho.

## Qué falta
Prácticamente todo. El distrito son catorce concelhos y da mucho más que vino:
- **Vinho Verde**, subregiones Cávado y Ave — vía endpoint de la CVRVV.
- **Barcelos**: la feira semanal más grande del norte; loza, pan, doçaria.
- **Guimarães** y **Braga**: doçaria conventual (tortas, bolos), tostadores.
- **Terras de Bouro / Gerês**: mel do Parque Nacional, carne barrosã, fumeiro.
- **Vitela de Lafões / carne barrosã DOP** y **presunto de Barroso**.
