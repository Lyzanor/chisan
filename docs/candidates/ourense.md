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

## DO Valdeorras + DO Monterrei (lote 10 de do-huecos)

> Fuentes de partida (vía navegador): listado oficial de bodegas DO Valdeorras
> (PDF del consejo, <https://dovaldeorras.gal/en/bodegas/> → «Registered
> vineyards», 24 bodegas con web; el registro completo son ~43, el resto por
> volcar) + directorio DO Monterrei (<https://www.domonterrei.wine/en/wineries/>,
> 29 adegas; municipio por CP de cada ficha, web propia buscada aparte). Dedup
> 2026-07-09. **Ya en el CSV (excluidas):** Valdeorras — A Coroa, Alan de Val,
> Quinta da Peza, Godeval, Joaquín Rebolledo, Rafael Palacios, Roandi, Viña
> Somoza, Virxe de Galir/Pagos de Galir; Monterrei — Gargalo, Ladairo, Crego e
> Monaguillo, Pazo das Tapias, Fragas do Lecer/Boo Rivero, Vía Arxéntea, Pazos del
> Rey.
>
> **Corte del lote (regla de tope 15–25):** ~37 net-new. Escritas 15 Valdeorras
> (con web) + 10 Monterrei; el resto de Monterrei y las Valdeorras fuera del PDF
> quedan en la nota final.

### DO Valdeorras (15)

> Concello por bodega a confirmar en integración (comarca de Valdeorras: A Rúa,
> O Barco, Vilamartín, Petín, Larouco, Rubiá, O Bolo, Carballeda). Web del PDF
> oficial → casi todas con venta/tienda, confirmar `Venta online`.

- [ ] **Valdesil** — Bodega. Vilamartín de Valdeorras. <https://www.valdesil.com/>.
  Referencia del godello de Valdeorras.
- [ ] **Viñaredo (Viña Redo)** — Bodega. Valdeorras (confirmar concello).
  <https://www.vinaredo.com/>.
- [ ] **Bodegas Carballal** — Bodega. Valdeorras (confirmar).
  <https://www.bodegascarballal.com/>.
- [ ] **Adega Melillas** — Bodega. Valdeorras (confirmar).
  <https://www.adegamelillas.com/>.
- [ ] **Adega Avelina** — Bodega. Valdeorras (confirmar).
  <https://www.adegaavelina.com/>.
- [ ] **Cepado** — Bodega. Valdeorras (confirmar). <https://www.cepado.com/>.
- [ ] **Adega da Pinguela** — Bodega. Valdeorras (confirmar).
  <https://www.adegadapinguela.com/>.
- [ ] **Casal Novo** — Bodega. Valdeorras (confirmar). <https://www.casalnovo.es/>.
- [ ] **Ladera Sagrada** — Bodega. Valdeorras (confirmar).
  <https://www.laderasagrada.es/>.
- [ ] **Manuel Corzo** — Bodega. Valdeorras (confirmar).
  <https://www.manuelcorzo.es/>.
- [ ] **Vinos Ruchel** — Bodega. Valdeorras (confirmar).
  <https://www.vinosruchel.com/>.
- [ ] **Sampayolo** — Bodega. Valdeorras (confirmar). <https://www.sampayolo.com/>.
- [ ] **Bodegas D. Berna** — Bodega. Valdeorras (confirmar).
  <https://www.bodegasdberna.com/>.
- [ ] **Bodegas Eladio Santalla** — Bodega. Valdeorras (confirmar).
  <https://www.bodegaseladiosantalla.com/>.
- [ ] **Jorge Ordóñez (proyecto Valdeorras)** — Bodega. Valdeorras (confirmar).
  <https://www.jorgeordonez.es/>. ⚠ Négociant/grupo Jorge Ordóñez (Málaga) con
  proyectos en varias DO; confirmar bodega/marca propia de Valdeorras y encaje.

### DO Monterrei (10)

- [ ] **Quinta da Muradella** — Bodega. Verín. Referencia de Monterrei (José Luis
  Mateo, ecológico desde 2005). Web propia a confirmar (vende vía distribuidores).
- [ ] **Quinta do Buble** — Bodega. Oímbra (Casas dos Montes).
  <https://www.quintadobuble.com/> · 988 422 960.
- [ ] **Adega Trasdovento** — Bodega. Oímbra (Casas dos Montes).
  <https://adegatrasdovento.es/>. Marcas Trasdovento, Quérote, Alto do Bocelo.
- [ ] **Bodega Tabú** — Bodega. Oímbra (O Rosal). <https://bodegastabu.com/>.
- [ ] **Pazo de Valdeconde** — Bodega. Monterrei (Mourazos).
  <https://pazodevaldeconde.es/>. Enoturismo.
- [ ] **Franco Basalo** — Bodega. Castrelo do Val (confirmar).
  <https://www.francobasalo.es/>. Vino «Estela do Val».
- [ ] **Castro de Lobarzán** — Bodega. Monterrei (Vilaza). Marcas «Lobarzán» /
  «Lobarzán IS». Web propia a confirmar.
- [ ] **Triay** — Bodega. Monterrei. Web propia a confirmar.
- [ ] **Father 1943** — Bodega. Comarca de Monterrei (concello a confirmar, CP
  32627). Web propia a confirmar. Bodega certificada recientemente por la DO.
- [ ] **Terras do Cigarrón** — Bodega. Monterrei (Albarellos). ⚠ Marca
  comercializada por el grupo Adegas Galegas / Martín Códax; confirmar si es
  entidad con venta propia o solo marca de grupo antes de crear fila.

> **Resto (siguiente(s) corte(s), datos en las fuentes):** Monterrei —
> Abeledos, Couto Mixto, Daniel Fdez., Madrevella, Manuel Vázquez Losada, Minius
> (O Cabildo), Quinta Soutullo, Ramón Bigotes, Serra de Alén, Tapias Mariñán,
> Terra de Godello, Vinos Lara. Valdeorras — las bodegas del registro completo
> (~43) que no están en el PDF resumido (volcar del listado oficial del consejo).
