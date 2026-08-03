# Candidatos — Córdoba

> Origen: pasada **DO menos cubiertas** (2026-07). Los lotes de Montilla-Moriles,
> DOP Baena, DOP Priego, DOP Lucena, DOP Montoro-Adamuz y DOP Los Pedroches
> quedaron integrados en las fases B y C (≈47 altas); lo integrado está en
> `data/csv/andalucia/cordoba.csv` y el detalle por lote, en el historial git.
>
> **⚑ COLA CERRADA 2026-08-03: 9 de las 15 entradas integradas, 6 descartadas.**

## Descartadas: las 6 cooperativas de DCOOP (regla dura, confirmada)

`Oleollanos` (Rute) · `Olivarera de Montoro` · `Ntra. Sra. de la Merced`
(Villafranca) · `San Antonio Abad` (Villaviciosa) · `Santiago Apóstol`
(Villanueva del Rey) · `Olivarera del Guadiato` (Espiel).

Ninguna envasa con marca de consumo propia, que era la condición de entrada. Las
dos que tienen web propia lo dicen ellas mismas:

- **Santiago Apóstol** (`olivareravillanuevadelrey.com`): «DCOOP y Cordoliva son
  la marca comercial del aceite que produce» — no hay marca propia ni venta
  directa.
- **Oleollanos** (`oleollanos.com`): «pertenecemos desde 1998 al grupo DCOOP»; el
  sitio es un portal de servicios al socio (entregas, facturación), sin catálogo,
  sin marca y sin tienda.

Y la tienda de la propia DOP Montoro-Adamuz (`montoro-adamuz.org/tienda/`) vende
**«AOVE DOP Montoro-Adamuz · DCOOP Selección»**: el envasado de la comarca es
colectivo y de grupo, no de cada almazara. No reabrir salvo que alguna lance
marca propia.

## Correcciones que salieron de esta cola (reutilizables)

⚠ **El registro del consejo de Montilla-Moriles corrige municipios.** El listado
vivo está en `montillamoriles.es/bodegas/` (51 fichas, cada una con dirección,
teléfono y email propios en `/bodegas/listado/<slug>/`). Tres de los ocho
candidatos tenían el municipio mal:

- *Bodegas Único* → **Unico Vinagres y Salsas**, en **Doña Mencía**, y **no es
  una bodega de vino**: es elaboradora de vinagre balsámico de Pedro Ximénez
  (soleras de 1923; marcas UniCo, Sotolongo, Sol & Tierra, Sacristía). Entró con
  categoría `Salsas` y tienda propia.
- *Bodegas Sillero* → **La Rambla**, no Montilla.
- *Lagar Cañada Navarro* → el consejo publica una **dirección administrativa en
  la capital** (C/ Amparo, Córdoba 14003); la unidad productiva es el lagar de la
  **Sierra de Montilla**, dentro del término de Montilla. Dirección fiscal ≠
  unidad productiva.

⚠ **Dos bodegas reales que ya no están en el registro vivo.** *Bodegas El Pujío*
(finca El Pujío, **Puente Genil**, fundada en 2002 por Agustín Reina Galán) y
*Mora Chacón de Lucena* (**Lucena**, fundada en 1891, proveedora de la Casa Real
desde 1864) no aparecen en las 51 fichas del consejo, pero sí en directorios de
la denominación. Entraron como `parcial`.

⚠ **Resuelto el aviso de propiedad compartida:** *Bodegas Gracia* (Gracia Hnos.,
S.A.U.) comparte propiedad con Pérez Barquero, ya en el CSV, pero tiene web,
domicilio y cartera de marcas propias en Montilla (Viñaverde, Corredera, María
del Valle, PX Dulce Viejo, Tauromaquia, Montearruit) → ficha independiente, no
duplicado.

⚠ **Diferida por geocodificación, resuelta por municipio:** *La Embajada del
Jamón* estaba parada porque «Polígono Industrial Cárnico» no geocodificaba. El
municipio es **Villanueva de Córdoba** (14440) y con eso entra; su web confirma
secadero natural propio, el premio Encina de Oro DOP Los Pedroches y tienda con
carrito → `verificado`, `Venta online=sí`.

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
