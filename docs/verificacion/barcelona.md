# Barcelona · verificación — snapshot de mantenimiento

Pasada profunda **cerrada el 2026-06-22** (lotes 1-368: toda la cola de `pendiente`, normalización
de grafías y dedup). Detalle por lote en `git log --follow -p -- docs/verificacion/barcelona.md`.
La verdad es el CSV; tras el cierre, la pasada de ampliación «flujo 2026» (julio, ledger en
`docs/candidates/barcelona.md`) subió el catálogo a ~2.545 filas. Recuentos vivos:
`npx pnpm list:province barcelona` **acotado** con `--categoria`/`--pendientes` (no volcarlo entero).

## Estado final de la pasada (2026-06-22)

- Filas: **2.483** · verificado **1.710** · parcial **773** · pendiente **0** (snapshot inicial
  2.973/35/16/2.922; **490 purgadas**).
- Los 773 `parcial` son mayoritariamente filas de registro DAR sin presencia propia: techo real,
  no promover sin fuente primaria leída en vivo.
- Imágenes (tanda 2026-06-24): 1.092/2.483 con logo (44%); ~250 inspeccionables sin candidato
  limpio + ~1.000 sin web.
- Barcelona no está en `data/evidence/coverage.json`; la evidencia se añade al re-decidir filas.

## Reglas locales (no revertir sin nueva evidencia)

- **Grafías canónicas ya unificadas** (2026-06-22; no reabrir): Subirats · Font-rubí ·
  l'Espunyola · Bigues i Riells del Fai · Olèrdola · Castelladral (+ el Mujal→Navàs) · Sallent
  (Cabrianes) · Seva · Cal Rosal repartido entre Berga/Olvan según el lado real · Canet de Mar
  (La Montnegre) · Mollet del Vallès (Gallecs) · la Garriga · la Roca del Vallès · el Papiol ·
  la Nou de Berguedà · l'Esquirol · Vilobí del Penedès.
- **No re-normalizar** los «Municipi (nucli)» consistentes (Granollers (Palou), Sant Cugat
  (Valldoreix), Salelles (Manresa)…) ni núcleos/EMD con identidad propia (Segur de Veciana,
  Valls de Torroella, Bellaterra, Castelltallat): no son duplicados y mapearlos al municipio padre
  resta findability. Los «Barcelona - <districte>» geo-resuelven vía el split « - » de
  `lookupCentroid`.
- **Dedup registre↔marca** (patrón que más purgas dio): misma persona/teléfono/email que una fila
  de marca existente → purgar la de registro. Caso ancla: Ca n'Ustrell (purgada «Domingo Garcia,
  Josep Oriol», email traspasado a la fila de marca).
- Coordenadas corregidas a conciencia: Família Catasús → centroide de Subirats; Masia Fontirons
  (l'Espunyola, con web propia).
- Imágenes: el mismo asset/URL en marcas distintas = basura compartida (47 slugs purgados; p. ej.
  `parc_logo.png` del Parc Agrari en 20 filas del Prat); el mismo asset en sedes de una misma
  marca es legítimo.

## Fuentes locales y límites

- **DAR venda de proximitat**: `node scripts/match-dar.mjs "<municipio>"`; dataset completo
  `curl "https://analisi.transparenciacatalunya.cat/resource/xmyy-7xqi.csv?$limit=5000"`.
  Match (apellidos **y** municipi, plegando acentos) = existe → `parcial`; no prueba venta online.
  Sin DAR y sin web propia → justifica purga (registro voluntario: no constar no prueba
  inexistencia).
- Fuentes comarcales útiles: espaiagraribaixatordera.cat (Alt Maresme) · llucanesataula.cat y
  turisme.llucanes.cat (Lluçanès) · parcnaturalcollserola.cat + Festa de la Cirera (el Papiol) ·
  agrariavalles.coop (DOP mongeta del ganxet) · directori de cellers de Sta. Margarida i els
  Monjos · llista oficial Productes de Palou (Granollers).

## Para otros agentes (cross-provincia)

- Tarragona: `bodega-el-grial-sl` (El Perelló), **Cellers Avgvstvs Forvm** y **Jané Ventura**
  (El Vendrell) y **Bodega Can Marlès** (El Montmell) se purgaron de Barcelona; candidatas a
  `tarragona.csv`.
- Girona: **Hort Viu** (Les Planes d'Hostoles) candidata real; **L'Espigall** (Lladó) es
  consultoría agroambiental con producción menor en DAR — baja prioridad, solo si vende.
- Lleida: **Ferro Falgueras** (miel, Tremp) candidato; **Celler del Miracle** quedó `parcial` en
  barcelona.csv pero el Santuari del Miracle está en Riner (Solsonès) — revisar si debe moverse.
- Vilafranca: posible dup Forn Sant Joan vs Pastisseria Trens (mismo C/ Sant Joan 9).

## Mantenimiento (al retomar)

- Recomprobar los `Venta online=sí` (última pasada masiva 2026-06-22; la ampliación de julio
  revisó los suyos) y vigilar los 773 `parcial` de registro.
- Candidatos DAR no integrados: movidos a `docs/candidates/barcelona.md` § «Herencia del ledger
  de verificación» — deduplicar contra el CSV antes de usar.
- Imágenes: ~250 candidatas inspeccionables pendientes de triaje manual.
