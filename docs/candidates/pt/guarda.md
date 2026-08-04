# Guarda — candidatos

- CSV: `data/csv/pt/centro/guarda.csv` (12 filas, todas altas de esta pasada).
- Fuente: Confraria do Queijo Serra da Estrela, <https://www.confrariaqueijoserradaestrela.com/produtores-2> — productores con dirección y contacto, ordenados por concelho. Ficha del producto y organismo certificador (Kiwa Sativa) en <https://tradicional.dgadr.gov.pt/pt/cat/queijos-e-produtos-lacteos/31-queijo-da-serra-da-estrela>.
- Estado: **las 12 integradas** en el CSV el 2026-08-04 como `parcial`, con dirección y teléfono. Ojo: la fuente venía truncada, así que la cola no está agotada — ver «Qué falta».

Categoría para todos: `Lácteos y quesos`.

| nombre | municipio | dirección | contacto |
|---|---|---|---|
| Américo Manuel Coito | Celorico da Beira | Quinta S. João, Minhocal, 6360-110 | 271 878 621 · 961 028 764 · americo.coito@gmail.com |
| Francisco José Abrantes Granjal | Celorico da Beira | Quinta da Ronda – Serrado, Minhocal, 6360-110 | 271 878 472 · 966 623 222 |
| Casa Agrícola dos Arais, Lda | Celorico da Beira | Rua dos Arais, Vide Entre Vinhas, 6360-200 | 271 743 189 · 963 441 434 · c.a.arais@gmail.com |
| Queijaria Tia Amélia | Celorico da Beira | Av. Srª das Dores 37, Mesquitela, 6360-100 | 938 414 141 · queijaria_tia_amelia@hotmail.com |
| Carlos Aires Frias | Fornos de Algodres | Fuinhas, 6370-311 | 271 709 602 · 915 937 148 |
| João Júlio Gomes Campos | Fornos de Algodres | Rua da Escola, Queiriz, 6370-373 | 271 789 186 · 965 247 276 |
| Carlos e Fernanda Lopes | Fornos de Algodres | Cadoiço | 969 738 447 · carlosefernanda.lopes@gmail.com |
| Lactoceleiro | Fornos de Algodres | Quinta Lameira da Loba, Juncais, 6370-391 | 271 700 140 · geral@lactoceleiro.pt |
| Queijaria da Caramuja, Lda | Gouveia | Quinta da Caramuja, 6290-332 | 966 549 640 |
| Queijaria Ponte dos Cavaleiros | Gouveia | Arcozelo da Serra | 961 256 042 · pontedoscavaleiros@hotmail.com |
| Queijaria S. Cosme | Gouveia | Vila Nova de Tázem, 6290-632 | 238 487 167 · 917 604 704 · quintasaocosme@sapo.com |
| Queijaria Tradicional da Ângela | Gouveia | Quinta da Bandoiva, R. Barão Predonda, Paços da Serra, 6290-241 | 238 494 710 |

Notas de integración:
- Varios son **personas físicas**, no marcas: el `nombre` de la fila debe ser la
  marca pública cuando exista (Queijaria X) y solo entonces el nombre del titular
  (`docs/CSV_CONTRACT.md`, convenciones de identidad).
- Casi ninguno tiene web; la mayoría se sostendrá en `parcial`. `Lactoceleiro`
  sí parece tener dominio (`lactoceleiro.pt` por el correo).
- Las direcciones son de aldea (Minhocal, Queiriz, Cadoiço, Paços da Serra): el
  `municipio` del CSV es el concelho, y las coordenadas caerán en centroide salvo
  que se geocodifique la dirección concreta.

## Qué falta
- **La lista está truncada en la fuente**: la página corta después de Nelas.
  Faltan los productores de los concelhos de Guarda que no aparecen — Seia,
  Manteigas, Trancoso, Aguiar da Beira y la propia Guarda — y son parte de la
  zona DOP. Reabrir la página y paginar antes de dar el frente por cerrado.
- Los productores de Mangualde y Nelas que sí trae la fuente están en
  `docs/candidates/pt/viseu.md`, no aquí.
- Sin abrir en el distrito: vino DOC **Beira Interior**, Queijo Serra da Estrela
  Velho, maçã da Beira Alta, cordero da Serra da Estrela, mel.
