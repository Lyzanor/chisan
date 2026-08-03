# Candidatos — Córdoba

> Origen: pasada **DO menos cubiertas** (2026-07). Los lotes de Montilla-Moriles,
> DOP Baena, DOP Priego, DOP Lucena, DOP Montoro-Adamuz y DOP Los Pedroches
> quedaron integrados en las fases B y C (≈47 altas); lo integrado está en
> `data/csv/andalucia/cordoba.csv` y el detalle por lote, en el historial git.
> Aquí solo queda la cola sin resolver. Dedup rehecho el 2026-08-03: las 15
> entradas de abajo siguen sin fila.

## DO Montilla-Moriles — bodegas de registro sin web/venta localizada (8)

Salieron del registro del Consejo Regulador y del directorio *We Love Montilla
Moriles*. Se difirieron en el lote 1.3f por no encontrarles web, venta ni
municipio fiable: son fichas de registro. Antes de integrar hay que confirmar
municipio, actividad y marca de consumo.

- [ ] **Bodegas Gracia (Gracia Hermanos)** — Bodega. Montilla. ⚠ Misma propiedad
  que Pérez Barquero (ya en CSV): no crear fila hasta confirmarle escaparate y
  marca propios.
- [ ] **Bodegas Único** — Bodega. Montilla (confirmar).
- [ ] **Bodegas Sillero** — Bodega. Confirmar municipio, web y venta.
- [ ] **Bodegas El Pujío** — Bodega. Confirmar municipio, web y venta.
- [ ] **Bodegas Maillo** — Bodega. Confirmar municipio, web y venta.
- [ ] **Bodegas Mora Chacón** — Bodega. Confirmar municipio, web y venta.
- [ ] **Lagar Cañada Navarro** — Bodega/Lagar. Sierra de Montilla (Montilla).
- [ ] **Bodegas Cabriñana / Lagar Cabriñana (Rockera Cabriñana)** — Bodega/Lagar.
  Sierra de Montilla (Montilla). bodegascabrillana@gmail.com · 957 335 386.

## DOP Montoro-Adamuz + DOP Lucena — coops diferidas por granel/DCOOP (6)

Se difirieron en el lote 1.3d: son cooperativas del grupo **DCOOP/Cordoliva**,
que comercializa buena parte del aceite a granel/B2B. **Entran solo si venden
con marca de consumo propia** (tienda física u online); si solo aportan aceituna
o granel a DCOOP, se descartan por la regla dura. Confirmar caso a caso.

- [ ] **Cooperativa Olivarera de San José 'Oleollanos' S.C.A.** — Aceite. Los
  Llanos de Rute (Rute).
- [ ] **S.C.A. Olivarera de Montoro** — Aceite. Montoro.
- [ ] **S.C.A. Olivarera Ntra. Sra. de la Merced** — Aceite. Villafranca de
  Córdoba (confirmar).
- [ ] **S.C.A. del Campo San Antonio Abad** — Aceite. Villaviciosa de Córdoba
  (confirmar).
- [ ] **S.C.A. Olivarera Santiago Apóstol** — Aceite. Villanueva del Rey. ⚠ **Una
  sola cooperativa**: el registro la parte en «San Rafael» y «Santiago» y una
  nota antigua de este fichero llegó a listarlas como dos candidatos. Es la misma
  entidad, en Villanueva del Rey, y vende vía DCOOP/Cordoliva. (No confundir con
  la pastelería «San Rafael 1920» de Córdoba, ya en CSV.)
- [ ] **S.C.A. Olivarera del Guadiato** — Aceite. Espiel (confirmar).

## DOP Los Pedroches (1)

- [ ] **Delicias Ibéricas por el Mundo S.L. (La Embajada del Jamón)** —
  Charcutería (jamón ibérico DOP). <https://laembajadadeljamon.com/>. Confirmado
  como **productor** con secadero propio (premio Encina de Oro); diferida porque
  su dirección («Polígono Industrial Cárnico») no geocodifica → reabrir con el
  municipio exacto.

## Avisos reutilizables

⚠ **Excluida (gran grupo):** **COVAP, S.C.A.** (Pozoblanco) — grupo cooperativo
industrial del Valle de los Pedroches (jamón, lácteos, piensos). Regla dura de
grandes grupos: no crear fila, pese a tener marca de consumo y tienda propias.

⚠ **Cooperativas de Montilla-Moriles a triar aparte:** «Bodegas La Unión»,
«Bodegas N. Sra. Rosario», «Bodegas San Acacio» (Montemayor), «Bodegas San
Jerónimo», «Bodegas Vitivinícola Local» (Aguilar) y «Bodegas La Purísima.
Vinolea» figuran como cooperativas (C) en el directorio. Entran **solo** con
marca de consumo propia. **Navisa** (Montilla) es industrial/graneles.

⚠ **Tonelerías excluidas**: fabricantes de barricas, B2B, no vendible al
consumidor.

⚠ **Homónimos y grupos que rompen el dedup:** Monteoliva de Cabra ≠ Monteoliva
Cordobesa de Montilla · Olivarera San Isidro de Castro del Río (DOP Baena) ≠ la
San Isidro de Fuente-Tójar (DOP Priego) · «Muela-Olives» es la envasadora del
mismo grupo que Mueloliva · Aceites Fuente Grande (Lucena) es la sociedad
agraria del grupo de Gomeoliva. Todas ya en CSV con slug propio.

⚠ **Rechazados por solo comercialización:** «Aceite la niña de mis ojos»
(`osaceite.es` es un distribuidor de Gijón) y «Sponex / Olivasi (OLIVA SÍ)»
(comercializadora-selectora que no reclama producción propia).
