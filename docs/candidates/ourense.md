# Candidatos — Ourense

> Origen: pasada **DO menos cubiertas** (2026-07). Los lotes de DO Ribeiro,
> Valdeorras, Monterrei, Ribeira Sacra y la Festa do Queixo quedaron integrados en
> las fases B y C (≈67 altas); lo integrado está en `data/csv/galicia/ourense.csv`
> y el detalle por lote, en el historial git. Aquí solo queda la cola sin
> resolver. Dedup rehecho el 2026-08-03: las 23 entradas de abajo siguen sin fila.

## DO Ribeiro — diferidas por rastro digital muerto (7)

Todas salieron del directorio del Consello Regulador
(`ribeiro.wine/es/wineries`, 89 adegas/colleiteiros). Se difirieron porque su
dominio no resuelve o su web está vacía: sin fuente verificadora en vivo, el
tope sería `parcial`. Buscar rastro alternativo (redes, distribuidores, prensa)
antes de crear fila.

- [ ] **Pazo Lalón** — Bodega. Leiro. Ficha del consejo sin dominio.
- [ ] **Adega Manuel Rojo** — A Arnoia. `adegamanuelrojo.com` no resuelve (DNS
  muerto).
- [ ] **Quinta do Avelino** (Parente García) — Cenlle. `parentegarcia.com` no
  resuelve (DNS muerto).
- [ ] **Tear dos Dodi** — A Arnoia. `teardosdodi.com` no resuelve (DNS muerto).
- [ ] **Adega O Cotarelo** — Cenlle. `adega-o-cotarelo.negocio.site` da 404 (web
  ligera caída).
- [ ] **Bodegas Peña** (marca Lancero) — Castrelo de Miño. `lancero.es` es un
  WordPress vacío (post de bienvenida por defecto). ⚠ **Entidad distinta** de
  Bodega Eduardo Peña (`bodega-eduardo-pena-castrelo-de-mino`, mismo concello, ya
  en CSV): no fusionar por apellido.
- [ ] **Bodegas GRM (Grupo Reboreda-Morgadío / Campante)** — Bodega. Toén.
  <https://bodegasgrm.com/> dio 503 en la revisión. ⚠ Grupo mediano (Campante),
  borderline por tamaño → decidir encaje al reabrir.

## DO Ribeiro — grupo por resolver (1)

- [ ] **Bodegas Villanueva** — Castrelo de Miño. Es un **grupo multi-DO** (Rías
  Baixas / Ribeiro / Ribera / Rioja, 4 bodegas) y su dominio está enredado con la
  fila de Pontevedra `adega-pazo-das-barreiras`. Resolver esa relación antes de
  crear fila en Ourense.

## DO Valdeorras — resto del registro (5)

Con web propia localizada, sin verificar.

- [ ] **Bodegas Carballal** — <https://www.bodegascarballal.com/>.
- [ ] **Adega Avelina** — <https://www.adegaavelina.com/>.
- [ ] **Ladera Sagrada** — <https://www.laderasagrada.es/>.
- [ ] **Bodegas Eladio Santalla** — <https://www.bodegaseladiosantalla.com/>.
- [ ] **Jorge Ordóñez (proyecto Valdeorras)** — <https://www.jorgeordonez.es/>.
  ⚠ Négociant/grupo Jorge Ordóñez (Málaga) con proyectos en varias DO; confirmar
  bodega y marca propias de Valdeorras, y el encaje.

> ⚠ **Valdeorras, ~19 bodegas más: DIFERIDO por fuente.** El listado de
> `dovaldeorras.gal/bodegas/` se renderiza 100% por JS tras un age-gate (ni en el
> HTML ni en `wp-json`; no hay custom post type). El lote 10 usó el **PDF oficial**
> del consejo para 24 bodegas; el resto necesita ese PDF o un navegador → reabrir
> en una sesión con navegador disponible.

## DO Monterrei — colleiteiros sin web (6)

Del directorio `domonterrei.wine/adegas/`. La ficha del consejo expone la web y
la dirección **del propio consejo** en Verín, no las de la adega: hay que buscar
concello y web reales en verificación.

- [ ] **Franco Basalo** — Castrelo do Val (confirmar).
  <https://www.francobasalo.es/>. Vino «Estela do Val».
- [ ] **Abeledos** — Concello a confirmar. · 616 571 938.
- [ ] **Daniel Fernández** — Bodega/colleiteiro. · 988 590 864.
- [ ] **Manuel Vázquez Losada** — Bodega/colleiteiro. · 686 764 371.
- [ ] **Minius** — Oímbra. ⚠ La marca «Minius Godello» la elabora y comercializa
  **Adegas Valmiñor** (grupo de Rías Baixas); confirmar si es entidad con venta
  propia o solo marca de grupo.
- [ ] **Tapias Mariñán** — · 988 411 693. ⚠ Posible relación con Pazo das Tapias
  y Pazo de Valdeconde (marcas «Tapias»), ambas ya en CSV; cuidar duplicado.

## DO Ribeira Sacra (Ribeiras do Sil) — colleiteiros (4)

Del CSV oficial del Consello (`ribeirasacra.org/bodegas_csv.php`).

- [ ] **Envínate** — A Teixeira. <https://envinate.es/> · 682 207 160. Marca
  «Lousas»; el equipo trabaja también en Canarias y Almansa, pero la base gallega
  es A Teixeira.
- [ ] **Álvarez Rodríguez, Juan Alberto (Adega Sollío)** — A Teixeira. Marca
  «Sollío». · 639 787 637. Web propia a confirmar.
- [ ] **Vázquez Rodríguez, José** — A Teixeira. Marcas «Século» y «Triscelle».
  · 629 818 701. Web propia a confirmar.
- [ ] **Os Pacios** — Bodega/colleiteiro. A Teixeira (Abeleda). · 684 037 926.
  Producción pequeña (5.000 kg); confirmar marca propia y venta.

## Avisos reutilizables

⚠ **Municipio = concello de la adega**, tomado de la dirección real de la ficha,
no de la sede del consejo (Ribadavia en Ribeiro, Verín en Monterrei). Este error
ya obligó a corregir Castro Rei a Laias (Cenlle).

⚠ **El resto del registro de Ribeira Sacra (~73 adegas) es de provincia de
Lugo** → no se abre aquí; es pista para `lugo.md`.
