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

## DO Ribeiro — corte 2 (lote 16 de do-huecos)

> Continúa el lote 9: de las ≈59 fichas restantes del directorio
> `ribeiro.wine/es/bodegas-y-colleiteiros` (89 en total; 24 escritas en el lote 9,
> 6 ya en CSV), este corte escribe las **24 con web comercial propia**. Método del
> lote 9: `fetch` same-origin de cada ficha → nombre, concello (de la dirección
> real) y dominio propio (descartando el enlace genérico `wineinmoderation.eu` del
> pie). Dedup contra `ourense.csv` el 2026-07-09: las 24 son netas. Estado:
> **`unverified`**. Las ~34 fichas sin dominio propio (colleiteiros pequeños)
> quedan en **nota corte 3**.

- [ ] **Adega Catro Ferrados** — Bodega. Ribadavia. <http://www.vinoribeiro4ferrados.com/>.
- [ ] **Adega do Demo** — Bodega. Ribadavia. <http://www.adegadodemo.wine>.
- [ ] **Adega Manuel Rojo** — Bodega/colleiteiro. A Arnoia. <https://www.adegamanuelrojo.com>.
- [ ] **Adega Pousadoiro** — Bodega. Castrelo de Miño. <https://pousadoiro.wine>.
- [ ] **Adegas Celme** (Adegas Celme, S.L.) — Bodega. Castrelo de Miño. <http://www.adegascelme.com/>.
- [ ] **Terra Minei** (Adegas Francisco Fernández Sousa) — Bodega. Castrelo de
  Miño. <http://www.terraminei.com/>.
- [ ] **Adegas Maleiga** — Bodega. Beade. <https://maleiga.com/>.
- [ ] **Quinta do Avelino** (Adegas Parente García) — Bodega. Cenlle. <http://www.parentegarcia.com>.
- [ ] **Tear dos Dodi** (Amalia Diéguez Martínez) — Bodega/colleiteiro. A Arnoia.
  <http://www.teardosdodi.com>.
- [ ] **Boas Vides** (Antonio Míguez Amil) — Bodega/colleiteiro. Ribadavia. <http://www.boasvides.com>.
- [ ] **Bodegas Loeda** (Bodegas Loeda, S.L.) — Bodega. Ribadavia. <http://www.bodegasloeda.com/>.
- [ ] **Bodegas Peña** (marca **Lancero**) — Bodega. Castrelo de Miño. <http://www.lancero.es>.
- [ ] **Bodegas Villanueva** — Bodega. Castrelo de Miño. <http://www.bodegasvillanueva.com>.
- [ ] **Castro Rei** (Castro Rei, S.L.) — Bodega. Ribadavia. <http://www.bodegacastrorei.com>.
- [ ] **Dominio de Razamonde** — Bodega. Cenlle. <https://www.dominioderazamonde.com/>.
- [ ] **Eduardo Bravo** — Bodega/colleiteiro. Ribadavia. <http://www.eduardobravo.es/>.
- [ ] **Eloi Lorenzo** — Bodega/colleiteiro. A Arnoia. <http://www.eloilorenzo.es/>.
- [ ] **Granxa D'Outeiro** — Bodega. Ribadavia. <https://www.granxadouteiro.com/>.
- [ ] **Iria Otero** (Iria Otero Mazoy) — Bodega/colleiteiro. Leiro. <http://www.iriaotero.com>.
- [ ] **Pateiro Vinos de Guarda** (Iván Vázquez Pateiro) — Bodega. Ribadavia.
  <http://www.pateirovinosdeguarda.com>.
- [ ] **Lagar do Meréns** — Bodega. A Arnoia. <http://www.lagardomerens.com/>.
- [ ] **Mauro Estévez** — Bodega/colleiteiro. A Arnoia. <http://mauroestevez.com/>.
- [ ] **Adega Gandarela** (Penedo Estévez, Manuel) — Bodega/colleiteiro.
  Ribadavia. <http://gandarela.es/>.
- [ ] **Adega O Cotarelo** — Bodega/colleiteiro. Cenlle.
  <https://adega-o-cotarelo.negocio.site>. ⚠ web ligera (Google Business), confirmar venta.

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
