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

> ✅ **Lote 1.2a integrado 2026-07-10** (`integracion.md`): las 12 de más valor
> (marca consolidada + web), todas **`verificado`**. Con `Venta online=sí`
> (ecommerce): Viña Meín, Docampo, Pazo do Mar, A Vilerma, Cuñas Davia, Nairoa,
> Sanclodio (7). Varias son de grupos de calidad (Viña Meín→Alma Carraovejas,
> Vilerma→José Pariente, Sanclodio→Matarromera): se mantienen por ser unidades de
> terroir; su VO=sí es vía la tienda oficial del grupo.

- [x] **Viña Meín – Emilio Rojo** — **accepted → `vina-mein-emilio-rojo-leiro`**
  (`verificado`, `sí`). Leiro; hoy del grupo Alma Carraovejas.
- [x] **Bodegas Docampo** — **accepted → `bodegas-docampo-ribadavia`**
  (`verificado`, `sí`). Ribadavia; tienda propia (56-171 €).
- [x] **Bodegas Cunqueiro** — **accepted → `bodegas-cunqueiro-castrelo-de-mino`**
  (`verificado`, `no comprobado`). 3ª gen. desde 1920.
- [x] **Bodegas O'Ventosela** — **accepted → `bodegas-oventosela-leiro`**
  (`verificado`, `no comprobado`). ⚠ municipio corregido: desde 2008 en San
  Clodio (**Leiro**), no Ribadavia.
- [x] **Adegas Pazo do Mar** — **accepted → `adegas-pazo-do-mar-toen`**
  (`verificado`, `sí`). Toén. ⚠ grupo: la fila `pazo-das-tapias-monterrei` usa
  este mismo dominio de la matriz — no fusionadas (bodegas distintas); pendiente
  darle a Pazo das Tapias su propia web si la tiene.
- [x] **Pazo de Vieite** — **accepted → `pazo-de-vieite-leiro`** (`verificado`,
  `no comprobado`). Leiro, 10 ha propias.
- [ ] **Pazo Lalón** — Bodega. Leiro. (Web propia a confirmar; ficha del consejo
  sin dominio.) → **pendiente** (sin web, corte posterior).
- [x] **Pazo Tizón** — **accepted → `pazo-tizon-boboras`** (`verificado`,
  `no comprobado`). Boborás; web enfocada a eventos.
- [x] **Vilerma** — **accepted → `a-vilerma-leiro`** (`verificado`, `sí`). Leiro;
  del grupo José Pariente.
- [x] **Cuñas Davia** — **accepted → `cunas-davia-cenlle`** (`verificado`, `sí`).
  Cenlle (Adegas Valdavia); tienda propia (45-150 €).
- [x] **Eduardo Peña** — **accepted → `bodega-eduardo-pena-castrelo-de-mino`**
  (`verificado`, `no comprobado`). Castrelo de Miño (Barral).
- [x] **Nairoa** — **accepted → `bodegas-nairoa-a-arnoia`** (`verificado`, `sí`).
  A Arnoia; tienda propia.
- [x] **Viñedos Sanclodio** — **accepted → `vinedos-sanclodio-leiro`**
  (`verificado`, `sí`). Leiro (Gomariz); del grupo Matarromera.
> ✅ **Lote 1.2b integrado 2026-07-10** (resto del corte 1): 9 altas (8
> `verificado` + 1 `parcial`); con `Venta online=sí`: Antonio Montero, Ladeiras,
> Casar de Vide. **Rechazo:** El Paraguas (otra provincia). **Diferidos:** GRM
> (503) y Pazo Lalón (sin web).

- [x] **Bodega Alanís** — **accepted → `bodega-alanis-cenlle`** (`verificado`,
  `no comprobado`). Barbantes (Cenlle), 1910; del grupo Bodegas Gallegas.
- [x] **Señorío de Beade (Beade Primacía)** — **accepted →
  `senorio-de-beade-beade`** (`verificado`, `no comprobado`). Beade, desde 1987.
- [x] **Terras do Castelo** — **accepted → `terra-do-castelo-beade`**
  (`verificado`, `no comprobado`). Beade; del grupo Martín Códax (email
  administracion@martincodax.com).
- [x] **Bodegas Val de Souto** — **accepted →
  `bodegas-val-de-souto-castrelo-de-mino`** (`verificado`, `no comprobado`).
  Souto (Castrelo de Miño), 1,6 ha propias.
- [x] **Ladeiras do Ribeiro** — **accepted → `ladeiras-do-ribeiro-ribadavia`**
  (`verificado`, `sí`). Ribadavia; marca Seika, tienda propia.
- [x] **Vinos Antonio Montero** — **accepted →
  `vinos-antonio-montero-castrelo-de-mino`** (`verificado`, `sí`). Castrelo de
  Miño; tienda propia (72-108 €).
- [x] **Bodegas El Paraguas** — **rejected: other-province**. La web sitúa la
  bodega en **Cobas, Ferrol (A Coruña)**, no en Ribadavia/Ribeiro (error de fase
  A). Es una bodega real, pero de A Coruña → anotar como candidato de `a-coruna`,
  no crear en Ourense.
- [x] **Adega Manuel Formigo (Finca Teira)** — **accepted →
  `adega-manuel-formigo-finca-teira-beade`** (`verificado`, `no comprobado`).
  Beade; viticultores/elaboradores con fincas propias.
- [x] **Luis Anxo Rodríguez Vázquez (Viña de Martín)** — **accepted →
  `luis-anxo-rodriguez-vina-de-martin-a-arnoia`** (`parcial`, `no comprobado`).
  Os Pasás, Paixón (A Arnoia); colleiteiro de referencia desde 1988, 3,7 ha. Sin
  web propia, solo venta vía terceros → parcial.
- [ ] **Bodegas GRM (Grupo Reboreda-Morgadío / Campante)** — Bodega. Toén.
  <https://bodegasgrm.com/>. → **diferido**: web dio 503 en la revisión; grupo
  mediano (Campante) borderline por tamaño → reabrir en corte posterior.
- [x] **Casar de Vide** — **accepted → `bodega-casar-de-vide-castrelo-de-mino`**
  (`verificado`, `sí`). Castrelo de Miño (Vide); del grupo Matarromera —
  mantenida con el mismo criterio que Sanclodio (bodega de terroir de grupo de
  calidad); VO=sí vía la tienda oficial del grupo (precios confirmados).

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

## DO Ribeiro — corte 2 (lote 16 de do-huecos)

> Continúa el lote 9: de las ≈59 fichas restantes del directorio
> `ribeiro.wine/es/bodegas-y-colleiteiros` (89 en total; 24 escritas en el lote 9,
> 6 ya en CSV), este corte escribe las **24 con web comercial propia**. Método del
> lote 9: `fetch` same-origin de cada ficha → nombre, concello (de la dirección
> real) y dominio propio (descartando el enlace genérico `wineinmoderation.eu` del
> pie). Dedup contra `ourense.csv` el 2026-07-09: las 24 son netas. Estado:
> **`unverified`**. Las ~34 fichas sin dominio propio (colleiteiros pequeños)
> quedan en **nota corte 3**.

> ✅ **Lote 1.2c integrado 2026-07-10** (corte 2, primera mitad): 11 altas (10
> `verificado` + 1 `parcial`); VO=sí en Pousadoiro, Celme, Terra Minei, Razamonde.
> Diferidos por web caída/vacía: Manuel Rojo, Quinta do Avelino, Tear dos Dodi
> (DNS muerto), Lancero (WordPress vacío), Bodegas Villanueva (grupo multi-DO
> enredado con fila de Pontevedra). Quedan sin abrir 8 del corte 2.

- [x] **Adega Catro Ferrados** — **accepted → `adega-catro-ferrados-toen`**
  (`verificado`, `no comprobado`). ⚠ municipio corregido: **Puga (Toén)**, no
  Ribadavia.
- [x] **Adega do Demo** — **accepted → `adega-do-demo-ribadavia`** (`parcial`,
  `no comprobado`). Web dio 503 temporal → sin primario legible.
- [ ] **Adega Manuel Rojo** — A Arnoia. → **diferido**: dominio adegamanuelrojo.com
  no resuelve (DNS muerto). Buscar rastro alternativo en corte posterior.
- [x] **Adega Pousadoiro** — **accepted → `adega-pousadoiro-castrelo-de-mino`**
  (`verificado`, `sí`). Barral (Castrelo de Miño); tienda propia.
- [x] **Adegas Celme** — **accepted → `adegas-celme-castrelo-de-mino`**
  (`verificado`, `sí`). Astariz (Castrelo de Miño), ecológica; tienda propia.
- [x] **Terra Minei** — **accepted → `terra-minei-castrelo-de-mino`**
  (`verificado`, `sí`). Prado (Castrelo de Miño), desde 1956; tienda propia.
- [x] **Adegas Maleiga** — **accepted → `adegas-maleiga-beade`** (`verificado`,
  `no comprobado`). Beade; INTRE y LAPSO.
- [ ] **Quinta do Avelino** (Parente García) — Cenlle. → **diferido**: dominio
  parentegarcia.com no resuelve (DNS muerto).
- [ ] **Tear dos Dodi** — A Arnoia. → **diferido**: dominio teardosdodi.com no
  resuelve (DNS muerto).
- [x] **Boas Vides** — **accepted → `boas-vides-ribadavia`** (`verificado`,
  `no comprobado`). Ribadavia, desde 1993.
- [x] **Bodegas Loeda** — **accepted → `bodegas-loeda-ribadavia`** (`verificado`,
  `no comprobado`). Sampaio (Ribadavia), 3 generaciones.
- [ ] **Bodegas Peña** (Lancero) — Castrelo de Miño. → **diferido**: lancero.es es
  un WordPress vacío (post de bienvenida por defecto).
- [ ] **Bodegas Villanueva** — Castrelo de Miño. → **diferido**: es un **grupo
  multi-DO** (Rías Baixas/Ribeiro/Ribera/Rioja, 4 bodegas) y su dominio está
  enredado con la fila de Pontevedra `adega-pazo-das-barreiras` (ya hay tarea en
  curso). Resolver esa relación antes de crear fila en Ourense.
- [x] **Castro Rei** — **accepted → `bodega-castro-rei-ribadavia`**
  (`verificado`, `sí`). Sampaio (Ribadavia); tienda propia.
- [x] **Dominio de Razamonde** — **accepted → `dominio-de-razamonde-cenlle`**
  (`verificado`, `sí`). Razamonde (Cenlle); tienda propia.
- [x] **Eduardo Bravo** — **accepted → `eduardo-bravo-ribadavia`** (`parcial`,
  `no comprobado`). Ribadavia; web en reforma, identidad por redes.
- [x] **Eloi Lorenzo** — **accepted → `adega-eloi-lorenzo-a-arnoia`**
  (`verificado`, `no comprobado`). Aponte (A Arnoia); vinos naturales.
- [x] **Granxa D'Outeiro** — **accepted → `granxa-douteiro-ribadavia`**
  (`verificado`, `no comprobado`). Ribadavia; Francelus y Granxa d'Outeiro.
- [x] **Iria Otero** — **accepted → `iria-otero-leiro`** (`parcial`,
  `no comprobado`). Leiro; web con 403 (técnico).
- [x] **Pateiro Vinos de Guarda** — **accepted →
  `pateiro-vinos-de-guarda-carballeda-de-avia`** (`verificado`, `sí`). ⚠ municipio
  corregido: **Carballeda de Avia**, no Ribadavia. Marca El Patito Feo.
- [x] **Lagar do Meréns** — **accepted → `lagar-do-merens-a-arnoia`**
  (`verificado`, `no comprobado`). A Arnoia; premiados.
- [x] **Mauro Estévez** — **accepted → `mauro-estevez-a-arnoia`** (`parcial`,
  `no comprobado`). A Arnoia; web con poca información.
- [x] **Adega Gandarela** — **accepted → `adega-gandarela-cenlle`**
  (`verificado`, `sí`). ⚠ municipio corregido: **Laias (Cenlle)**, no Ribadavia.
  Tienda propia + turismo rural.
- [ ] **Adega O Cotarelo** — Cenlle. <https://adega-o-cotarelo.negocio.site>
  → **diferido**: la página de Google Business da 404 (web ligera caída).

> **Corte 3 (resto ~34, sin dominio propio en la ficha — solo enlace genérico
> `wineinmoderation.eu`):** colleiteiros pequeños del mismo directorio, p. ej.
> Adega As Pegas, Adega do Cesteiro, Adega do Veleiro, Adega Viña Carpazal,
> Adegas Cenlle, Adegas do Rexurdir, Adegas Laudes, Ameijeiras Vázquez,
> Xulia Bande (`sondearrieiro`), Bodegas Gómez Sanmartín, Brixón, Bruno López,
> Casal do Canteiro, César M. García, Elisa Collarte, D'Vagar Adegas, Emilio
> Docampo, Eulogio Collarte, Fernando Cibeira, Adega do Moucho (Francisco
> García), Heredeiros de Avelino Lorenzo, Agás do Tempo (Jesús Freijido), Javier
> Estévez, La Chica de Ayer, Montero & Rey, Viña San Esteban (Rodríguez
> Domínguez), Arco da Vella (Benito Eladio Rodríguez), Secretos de Familia,
> Sotelo Barroso, Bodegas Uceira, Viña do Penedo, Adega Joaquín Vázquez… Buscar
> web fuera del registro en un corte posterior. ⚠ **Dominio do Bibei** queda
> fuera (es Ribeira Sacra, tratado en el lote 11).

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

### DO Valdeorras (15) — ✅ integrado 2026-07-10 (lote 1.2e)

> **10 altas, todas `verificado`**; 7 con `Venta online=sí` (Valdesil, Melillas,
> Cepado, Pinguela, Ruchel, Sampayolo, d'Berna) y 3 `no comprobado` (Viñaredo,
> Casal Novo, Manuel Corzo). Concellos confirmados por web/consejo. **Diferidos
> (5):** Bodegas Carballal y Ladera Sagrada (DNS muerto), Bodegas Eladio Santalla
> (www muerto, reintentar sin www), Adega Avelina (403, municipio sin confirmar) y
> **Jorge Ordóñez** (négociant de Málaga; no se confirmó bodega física ni marca
> propia de Valdeorras → no crear sin resolver encaje). Slugs:
> `valdesil-vilamartin-de-valdeorras`, `adega-melillas-a-rua`,
> `adega-o-cepado-rubia`, `adega-da-pinguela-petin`,
> `bodegas-ruchel-vilamartin-de-valdeorras`, `bodegas-sampayolo-petin`,
> `bodegas-d-berna-vilamartin-de-valdeorras`,
> `vinaredo-bodega-santa-marta-o-barco-de-valdeorras`,
> `casal-novo-adega-o-casal-rubia`, `manuel-corzo-vina-corzo-o-bolo`.
>
> Concello por bodega (comarca de Valdeorras). Web del PDF oficial → casi todas
> con venta/tienda.

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

### DO Monterrei (10) — ✅ integrado 2026-07-10 (lote 1.2f)

> **9 altas** (3 `verificado` + 6 `parcial`); VO=sí en Tabú y Triay. Diferido:
> **Franco Basalo** (dominio muerto). Correcciones/resoluciones: **Pazo de
> Valdeconde está en Verín (Mourazos), no Monterrei**; Terras do Cigarrón
> confirmada como cooperativa real (no solo marca de Adegas Galegas); Father 1943
> es la 30ª bodega de la DO (nueva, 2026). Muradella queda `parcial` por no tener
> web propia (referencia mundial, vende vía distribuidores). Slugs:
> `quinta-do-buble-oimbra`, `bodega-tabu-oimbra`, `quinta-da-muradella-verin`,
> `bodegas-triay-oimbra`, `adega-trasdovento-oimbra`, `pazo-de-valdeconde-verin`,
> `castro-de-lobarzan-monterrei`, `father-1943-verin`,
> `terras-do-cigarron-monterrei`.

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

## DO Ribeira Sacra — municipios ourensanos (lote 11 de do-huecos)

> Fuente de partida: **CSV oficial del Consello Regulador** (descarga
> `ribeirasacra.org/bodegas_csv.php`, ~89 adegas con dirección, subzona, marcas,
> web y teléfono). Filtrado a **provincia de Ourense** (concellos con «(Ourense)»
> en la dirección): 16 adegas, casi todas en la subzona **Ribeiras do Sil** (más
> Quiroga-Bibei y un par en A Peroxa). Dedup 2026-07-09. **Ya en el CSV
> (excluidas):** Adega Ponte da Boga (Castro Caldelas), Adega Vella (A Teixeira),
> Ronsel do Sil (Parada de Sil). Quedan **13 net-new**. El resto del registro
> (~73 adegas) es de **provincia de Lugo** → no se abre aquí; anotar como pista
> para `lugo.md` sin tocarlo.

> ✅ **Lote 1.2g integrado 2026-07-10**: 9 altas (4 `verificado` + 5 `parcial`);
> VO=sí en Pombares y Aba Solleira. **Diferido: Envínate** (ya está en el CSV de
> Tenerife como el mismo proyecto; una fila en Ourense duplicaría entre
> provincias → decisión editorial pendiente). Diferidos phone-only: Adega Sollío,
> Vázquez Rodríguez (Século/Triscelle), Os Pacios. Los `parcial` son por fallo
> técnico de web (Temera TLS, Cachín conexión, Fazenda Prádio) o sin web propia
> (Leirabella, Pereimos/A Corga). Slugs: `dominio-do-bibei-manzaneda`,
> `adega-do-mollon-pombares-nogueira-de-ramuin`, `aba-solleira-a-peroxa`,
> `bodega-caneiro-parada-de-sil`, `bodegas-costoya-temera-a-teixeira`,
> `adega-cachin-a-teixeira`, `fazenda-pradio-a-peroxa`,
> `adega-leirabella-parada-de-sil`, `pereimos-a-corga-a-pobra-de-trives`.

- [ ] **Dominio do Bibei** — Bodega. Manzaneda (subzona Quiroga-Bibei).
  <https://www.dominiodobibei.com/> · 670 704 028. Marcas Lacima, Lalama, Lapola,
  Lapena… Referencia de alta gama. ⚠ Resuelve el cruce del lote 9: figuraba en el
  registro Ribeiro pero su casa está aquí (Ribeira Sacra) → tratar en esta fila,
  no duplicar con Ribeiro.
- [ ] **Envínate** — Bodega. A Teixeira (Ribeiras do Sil). <https://envinate.es/> ·
  682 207 160. Marcas «Lousas» (proyecto de referencia); equipo también en
  Canarias/Almansa, la base gallega es A Teixeira.
- [ ] **Adega do Mollón** — Bodega. Nogueira de Ramuín (Ribeiras do Sil).
  <https://www.pombares.com/> (marca «Pombares») · 988 222 272.
- [ ] **Bodegas Costoya (Temera)** — Bodega. A Teixeira (Ribeiras do Sil).
  <https://www.temera.com/> · 600 417 273. Marcas Alodio (varias), Fraga Fonda,
  Noite Pecha. ⚠ Ojo colisión de marca «Alodio» con Adega Cachín (abajo).
- [ ] **Adega Cachín** — Bodega. A Teixeira (Ribeiras do Sil).
  <https://www.adegacachin.es/> · 619 859 281. Marcas Peza do Rei, Do Pereira,
  Alodio.
- [ ] **Caneiro Núñez, Carlos** — Bodega. Parada de Sil (Ribeiras do Sil).
  <https://sites.google.com/view/bodegacaneiro/inicio> · 646 009 744. Marcas
  Costa do Sil, Viña Dariz.
- [ ] **Spanish Wines by Carlos Rodríguez (Aba Solleira)** — Bodega. A Peroxa.
  <https://www.abasolleira.com/> · 653 328 458. Marca «Aba Solleira».
- [ ] **Seoane Novelle, Javier (Fazenda Prádio)** — Bodega. A Peroxa.
  <https://www.fazendapradio.com/> · 626 554 003.
- [ ] **Alvarez Rodríguez, Juan Alberto (Adega Sollío)** — Bodega. A Teixeira
  (Ribeiras do Sil). Marca «Sollío». · 639 787 637. Web propia a confirmar.
- [ ] **Vázquez Rodríguez, José** — Bodega. A Teixeira (Ribeiras do Sil). Marcas
  «Século», «Triscelle». · 629 818 701. Web propia a confirmar.
- [ ] **Leirabella** — Bodega. Parada de Sil (Sacardebois, Ribeiras do Sil).
  Marcas «Bellaleira», «Martín Lagarón». · 630 882 558. Web propia a confirmar.
- [ ] **Pereimos 2007 (A Corga)** — Bodega. A Pobra de Trives (Quiroga-Bibei).
  Marcas «Corga», «Erea». · 607 504 115. Web propia a confirmar.
- [ ] **Os Pacios** — Bodega/colleiteiro. A Teixeira (Abeleda, Ribeiras do Sil).
  · 684 037 926. Producción pequeña (5.000 kg); confirmar marca propia y venta.

## DO Valdeorras + DO Monterrei — corte 2 (lote 17 de do-huecos)

> Continúa el lote 10. **Monterrei**: escritas las 13 adegas del directorio
> `domonterrei.wine/adegas/` que faltaban (12 de la nota del lote 10 + **Valderello**,
> nueva). Teléfono propio extraído de cada ficha `/bodegas/<slug>/` (la web y la
> dirección que muestran son las **del consejo** en Verín — como ya avisó el lote
> 10, la ficha no expone web/concello propios → a buscar en verificación).
> Comarca de Monterrei (concellos Verín/Monterrei/Oímbra/Castrelo do Val/Riós/
> Cualedro/Vilardevós). Dedup contra `ourense.csv` el 2026-07-09: las 13 son
> netas. Estado: **`unverified`**.
>
> **Valdeorras resto (~19): DIFERIDO.** El listado de `dovaldeorras.gal/bodegas/`
> se renderiza 100% por JS tras un age-gate (ni en el HTML ni en `wp-json`
> aparecen los nombres; no hay custom post type). El lote 10 usó el **PDF oficial**
> del consejo para 24 bodegas; el resto necesita ese PDF o navegador → reabrir con
> Chrome/Control Chrome en una sesión con navegador disponible.

### DO Monterrei — resto (13)

- [ ] **Abeledos** — Bodega. Comarca de Monterrei (concello a confirmar).
  · 616 571 938. Web propia a confirmar.
- [ ] **Couto Mixto** — Bodega. Comarca de Monterrei. · 636 762 200. Web propia a
  confirmar. ⚠ nombre = territorio histórico (Couto Mixto: Baltar/Calvos/Rubiás);
  confirmar concello y que no sea marca de otra adega.
- [ ] **Daniel Fernández** — Bodega/colleiteiro. Comarca de Monterrei.
  · 988 590 864. Web propia a confirmar.
- [ ] **Madrevella** — Bodega. Monterrei (Tamagos). · 678 755 070. Familiar;
  blancos y tintos. Web propia a confirmar.
- [ ] **Manuel Vázquez Losada** — Bodega/colleiteiro. Comarca de Monterrei.
  · 686 764 371. Web propia a confirmar.
- [ ] **Minius** — Bodega. Oímbra. Web propia a confirmar. ⚠ marca «Minius
  Godello» elaborada/comercializada por **Adegas Valmiñor** (grupo de Rías
  Baixas); confirmar si es entidad con venta propia o solo marca de grupo.
- [ ] **Quinta Soutullo** — Bodega. Oímbra. · 651 488 915. Familia Rivero Pardo,
  desde 2017, >5 ha propias. Web propia a confirmar.
- [ ] **Ramón Bigotes** — Bodega/colleiteiro (Alejandro Ramón Blanco Dijkhoff).
  Comarca de Monterrei. · 634 787 078. Web propia a confirmar.
- [ ] **Serra de Alén** — Bodega. Comarca de Monterrei. · 676 966 322. Web propia
  a confirmar.
- [ ] **Tapias Mariñán** — Bodega. Comarca de Monterrei. · 988 411 693. Web propia
  a confirmar. ⚠ posible relación con Pazo das Tapias/Pazo de Valdeconde (marcas
  «Tapias»); cuidar duplicado al verificar.
- [ ] **Terra de Godello** — Bodega. Comarca de Monterrei. · 608 774 747. Web
  propia a confirmar.
- [ ] **Valderello** — Bodega. Comarca de Monterrei. · 988 411 199. No estaba en
  la nota del lote 10 (alta reciente del registro). Web propia a confirmar.
- [ ] **Vinos Lara** (Bodega Lara) — Bodega. Verín. · 988 413 831. Familiar
  (Godello/Treixadura/Mencía/Arauxa); marca «Lara Godello». Web propia a confirmar.

## Festa do Queixo de Arzúa (pasada `festa-do-queixo.md`)

> Fuente: listaxe oficial de expositores de la 51ª Festa do Queixo (Arzúa, 2026),
> PDF del Concello en `festadoqueixo.org`. Dedup contra `ourense.csv` el
> 2026-07-09 (cruzando razón social y marca): **ya en CSV** — Quesos Feijoo
> (Celanova), Lácteos da Limia / «Galicia Gourmets» (Xinzo de Limia) y Mel Aialma
> (Laza). Neto: **1**. Estado: **`unverified`**.

- [x] **Queixería Gaia** (Queixería Gaia S. Coop. Galega), marca **Gaia Gourmets**
  — **accepted → `queixeria-gaia-xinzo-de-limia`** (`verificado`, `Venta online=sí`,
  `ecommerce`) — fase C, 2026-07-13. Cooperativa quesera de Xinzo de Limia (CIF
  F32506479, Rúa Dous de Maio 43) activa desde 2020; quesos de cabra artesanos.
  Tienda propia con carrito/checkout (`gaiagourmets.com`). ⚠ resuelto: **la fila
  es el productor** (la queixería S. Coop. Galega), no la comercializadora
  Ysabelle Gourmet (que solo es la marca/tienda paraguas).
