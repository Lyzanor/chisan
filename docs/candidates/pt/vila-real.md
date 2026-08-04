# Vila Real — candidatos

- CSV: `data/csv/pt/norte/vila-real.csv` (11 filas, todas altas de esta pasada).
- Fuentes: Câmara Municipal do Peso da Régua, <https://www.cm-pesoregua.pt/visitar/ver/quintas> (listado municipal de quintas visitables, con coordenadas) y la Rota dos Vinhos do Douro e do Porto del IVDP, <https://www.ivdp.pt/pt/rota-enoturismo/rota-dos-vinhos-do-douro-e-do-porto/>.
- Estado: **11 integradas** en el CSV el 2026-08-04 como `parcial` (las 8 de Régua con sus coordenadas municipales, más Quinta do Portal, Quinta do Crasto y Quinta do Vallado con concelho confirmado). Quedan 4: Lavradores da Feitoria (marca colectiva), Quinta do Pontão, Quinta do Bomfim y Quinta de La Rosa (concelho sin confirmar en fuente propia).

Siete concelhos del distrito están dentro de la Região Demarcada do Douro:
Peso da Régua, Sabrosa, Alijó, Santa Marta de Penaguião, Mesão Frio, Murça y
Vila Real. Es, con diferencia, el distrito con más recorrido de Portugal.

Categoría: `Vino` (`Bodega` y `Aceite y vino` quedaron retiradas).

## Peso da Régua — listado municipal (8, con coordenadas de la fuente)

| nombre | lat, lon | notas de la fuente |
|---|---|---|
| 100 Hectares | 41.174584, -7.729096 | provas, visitas a viñas, tienda |
| Gueda Wines | 41.173583, -7.743044 | visitas con audioguía, provas, tienda, picnics |
| Quinta Dona Matilde | 41.146668, -7.725363 | dentro de la demarcación de 1756 |
| Quinta da Devesa | 41.161419, -7.753150 | familia Fortunato desde 1941 |
| Quinta do Judeu | 41.164820, -7.768825 | tienda; 3 quintas, 27 ha |
| Coimbra de Mattos | 41.184980, -7.688312 | provas, visitas a viñas/museo/adega, tienda |
| Quinta Seara d'Ordens | 41.188376, -7.727637 | visitas a la cava; prova de vino **y aceite** (vino y aceite) |
| Mateus & Sequeira Vinhos (Quinta da Pitarrela) | 41.165232, -7.797021 | sin visitas ni provas |

Las coordenadas vienen del mapa municipal: sirven de partida, pero conviene
cotejarlas con la dirección real antes de fijarlas (`docs/CSV_CONTRACT.md`).

## Resto del distrito — pool de rutas de enoturismo (7, concelho a confirmar)

| nombre | concelho (a confirmar) | pista |
|---|---|---|
| Quinta do Portal | Sabrosa (Celeirós do Douro) | quintadoportal.com · 259 977 100 · geral@quintadoportal.com; vino **y aceite** (vino y aceite) |
| Lavradores da Feitoria | Sabrosa | marca colectiva: 53 socios, 19 quintas ⚠ ver abajo |
| Quinta do Crasto | Sabrosa (Gouvinhas) | referencia clásica de la ruta |
| Quinta do Vallado | Peso da Régua (Vilarinho dos Freires) | hotel de vino desde 2005 |
| Quinta do Pontão | Santa Marta de Penaguião (Cumieira) | 55 ha, grupo H.O. |
| Quinta do Bomfim | Alijó (Pinhão) | del grupo Symington (26 quintas en el Douro) ⚠ |
| Quinta de La Rosa | Alijó (Pinhão) | de las primeras del Douro en vino de mesa |

⚠ Antes de dar de alta:
- **Lavradores da Feitoria** es una comercializadora de socios, no una quinta:
  decidir si la fila es la marca colectiva o cada quinta por separado, no ambas.
- **Symington** gestiona 26 quintas: solo entran las que tienen marca, tienda e
  identidad propias, no cada parcela del grupo (`docs/EDITORIAL_POLICY.md`).
- Estas siete salen de rutas de enoturismo y prensa, no de un registro: el
  concelho es lo primero que hay que confirmar en la web propia, porque las
  fuentes turísticas sitúan por «Douro» o por Pinhão, no por concelho.

## Qué falta
- El registro real: el IVDP publica los **agentes económicos** autorizados del
  Douro y do Porto. Es la fuente exhaustiva del distrito y aún no está abierta;
  medir el hueco contra ella, nunca contra este fichero.
- Fuera del vino: azeite do Douro DOP, Vila Real (bolos, pastelería conventual),
  castaña y miel del Alvão/Marão.
