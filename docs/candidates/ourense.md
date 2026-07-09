# Candidatos — Ourense

> Origen: pasada **DO menos cubiertas** (`docs/candidates/do-huecos.md`). Cada
> sección corresponde a un lote de esa pasada. **Estado: `unverified`** —
> deduplicado contra `data/csv/galicia/ourense.csv` por nombre normalizado.
> Antes de integrar: re-deduplicar con `npx pnpm list:province ourense`, confirmar
> actividad/web y decidir `verificacion` y `Venta online`.

## DO Ribeiro (lote 9 de do-huecos)

> Fuente de partida: directorio oficial de adegas y colleiteiros del Consello
> Regulador (<https://www.ribeiro.wine/es/wineries>, **89 adegas/colleiteiros**),
> leído vía navegador; web propia, municipio y coordenadas extraídos de cada ficha
> del consejo. Dedup 2026-07-09. **Ya en el CSV (excluidas):** Viña Costeira,
> Casal de Armán, Coto de Gomariz, Ramón do Casar, Adega Sameirás, Pazo Casanova.
> Municipio = concello de la adega (tomado de la dirección real de la ficha, no de
> la sede del consejo en Ribadavia).
>
> **Corte del lote (regla de tope 15–25):** 83 net-new. Escritas las **24 adegas
> con web propia y marca consolidada** (casi todas con tienda online → pista
> `Venta online=sí`, confirmar en integración). El resto (≈59, en su mayoría
> colleiteiros pequeños) queda en la nota final para cortes posteriores.

- [ ] **Viña Meín – Emilio Rojo** — Bodega. Leiro. <https://www.vinamein-emiliorojo.com/>.
  Referencia del Ribeiro (treixadura); dos proyectos históricos unidos.
- [ ] **Bodegas Docampo** — Bodega. Ribadavia. <https://www.bodegasdocampo.com/>.
  Histórica y familiar (instalaciones de los años 30).
- [ ] **Bodegas Cunqueiro** — Bodega. Castrelo de Miño. <https://www.bodegascunqueiro.es/>.
- [ ] **Bodegas O'Ventosela** — Bodega. Leiro. <https://www.oventosela.com/>.
- [ ] **Adegas Pazo do Mar** — Bodega. Toén. <https://www.pazodomar.com/>.
- [ ] **Pazo de Vieite** — Bodega. Leiro. <https://www.pazodevieite.es/>.
- [ ] **Pazo Lalón** — Bodega. Leiro. (Web propia a confirmar; ficha del consejo
  sin dominio.)
- [ ] **Pazo Tizón** — Bodega. Boborás. <https://www.pazotizon.com/>.
- [ ] **Vilerma** — Bodega. Leiro. <https://vilerma.com/>. Enoturismo.
- [ ] **Cuñas Davia** — Bodega. Cenlle. <https://vinosdoribeiro.es/>.
- [ ] **Eduardo Peña** — Bodega. Castrelo de Miño. <https://www.bodegaeduardopenha.es/>.
- [ ] **Nairoa** — Bodega. A Arnoia. <https://www.bodegasnairoa.com/>.
- [ ] **Viñedos Sanclodio** — Bodega. Leiro (San Clodio). <https://bodegasanclodio.com/>.
- [ ] **Bodega Alanís** — Bodega. Cenlle (Barbantes, confirmar). <https://www.bodegaalanis.com/>.
  Marca histórica del Ribeiro.
- [ ] **Señorío de Beade (Beade Primacía)** — Bodega. Beade. <https://www.beadeprimacia.com/>.
- [ ] **Terras do Castelo** — Bodega. Beade. <https://www.terradocastelo.com/>.
- [ ] **Bodegas Val de Souto** — Bodega. Castrelo de Miño. <https://www.valdesouto.com/>.
- [ ] **Ladeiras do Ribeiro** — Bodega. Ribadavia. <https://ladeirasdoribeiro.com/>.
- [ ] **Vinos Antonio Montero** — Bodega. Castrelo de Miño. <https://www.antoniomontero.com/>.
- [ ] **Bodegas El Paraguas** — Bodega. Ribadavia (confirmar). <https://www.bodegaselparaguas.com/>.
- [ ] **Adega Manuel Formigo (Finca Teira)** — Bodega/colleiteiro. Beade.
  <https://www.fincateira.com/>.
- [ ] **Luis Anxo Rodríguez Vázquez (Viña de Martín)** — Bodega/colleiteiro.
  A Arnoia. Colleiteiro de referencia («Os Pasás»); web propia a confirmar.
- [ ] **Bodegas GRM (Grupo Reboreda-Morgadío / Campante)** — Bodega. Toén.
  <https://bodegasgrm.com/>. ⚠ Grupo mediano-grande con varias marcas (Gran
  Reboreda, Viña Reboreda); confirma encaje vs tamaño en integración.
- [ ] **Casar de Vide** — Bodega. Castrelo de Miño.
  <https://tienda.matarromera.es/122-bodega-casar-de-vide>. ⚠ Pertenece al **Grupo
  Matarromera** (gran grupo de Castilla y León); confirmar encaje antes de crear
  fila.

> **Resto del registro Ribeiro (≈59, siguiente(s) corte(s) — ya listados en la
> fuente):** mayoría de colleiteiros y adegas pequeñas del directorio
> `ribeiro.wine/es/wineries` (p. ej. Adega As Pegas, Adega Manuel Rojo, Adega do
> Moucho, Adegas Cenlle, Adegas Celme, Adegas Laudes, Bodegas Peña, Bodegas Gómez
> Sanmartín, Bodegas Loeda, Bodegas Nogueiredo, Bodegas Villanueva, Casal do
> Canteiro, Dominio de Razamonde, D'Vagar, Eloi Lorenzo, Emilio Docampo, Granxa
> D'Outeiro, Lagar do Meréns, Uceira, Viña do Penedo…). Al abrir el siguiente
> corte: extraer web/municipio de la ficha (como en este lote) y triar por marca
> propia + venta. ⚠ **Dominio do Bibei** aparece en el registro Ribeiro pero es
> sobre todo **Ribeira Sacra** → tratar en el lote 11, cuidar duplicado.
