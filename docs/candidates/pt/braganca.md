# Bragança — candidatos

- CSV: `data/csv/pt/norte/braganca.csv` (4 filas, todas altas de esta pasada).
- Fuente: Câmara Municipal de Mirandela, <https://www.cm-mirandela.pt/pages/1999> — los productores de Alheira de Mirandela IGP reconocidos por el municipio. Ficha del producto en <https://tradicional.dgadr.gov.pt/pt/cat/salsicharia-fumados-presuntos-e-paletas/573-alheira-de-mirandela-igp>.
- Estado: **las 4 integradas** en el CSV el 2026-08-04 como `parcial`, con dirección, teléfono y correo. Cola vacía; el valor de este fichero es ahora el «Qué falta».

Categoría para los cuatro: `Carne`.

| nombre | razón social | municipio | dirección | contacto |
|---|---|---|---|---|
| Alheiras Gracinda | — | Mirandela | Zona Industrial, Rua A 53, 5370-565 | 278 262 830 · geral@alheirasgracinda.pt · facebook.com/agracinda |
| Alheiras Angelina | Alves & Ribeiro, Lda | Mirandela | Rua Quinta da Mouca 138, Vale de Ague, 5370-265 | 278 248 884 · geral@alheirasangelina.com · IG @alheirasangelina |
| Eurofumeiro | Soc. Industrial de Transformação de Carnes, Lda | Mirandela | Zona Industrial Norte, Rua A 32, 5370-565 | 278 265 845 · geral@eurofumeiro.com · eurofumeiro.com |
| Topitéu | Alheiras de Mirandela, Lda | Mirandela | Rua C, Zona Industrial, 5370-565 | 278 201 180 · geral@topiteu.pt · topiteu.pt |

Notas de integración:
- Gracinda y Angelina no traen dominio en la fuente municipal: buscarlo antes de
  dar la web por inexistente (el correo `@alheirasgracinda.pt` implica dominio).
- `Venta online` a `no comprobado` salvo checkout propio visto en vivo. Topitéu
  se vende en tiendas de terceros (p. ej. Vouga Gourmet); eso **no** cuenta.

## Qué falta
El distrito son doce concelhos y solo está tocado Mirandela. Frentes abiertos,
todos con DOP/IGP propia y sin fuente localizada todavía:
- **Fumeiro de Vinhais** (IGP: linguiça, butelo, salpicão, chouriça) — Vinhais.
- **Azeite de Trás-os-Montes DOP** — almazaras del distrito.
- **Castanha da Terra Fria DOP** — Bragança, Vinhais, Vimioso.
- **Queijo Terrincho DOP** — oveja churra da Terra Quente.
- Vino: la CVR de Trás-os-Montes (subregiones Chaves, Valpaços, Planalto Mirandês).
