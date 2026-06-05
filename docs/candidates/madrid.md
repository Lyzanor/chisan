# Madrid — notas de candidatos / scratch

Evidencia temporal de la verificación de geolocalización con Google Places (junio 2026). No es fuente de verdad; podar al resolver.

## Cierres — RESUELTO
Verificado (Google `businessStatus` + estado de la web):
- **Eliminados (7)** — CLOSED_PERMANENTLY + web caída o inexistente: `cervecera-peninsula-alcobendas`, `bodegas-antonio-benito-colmenar-de-oreja`, `panesthesia-pelayos-de-la-presa`, `fructum`, `quesos-helechal`, `queseria-los-cantares-valdemanco`, `queseria-maliciosa-el-boalo`.
- **Mantenidos**: `grupo-avimosa` (web activa, empresa operativa >100 años; el "cerrado" de Google era una sublista obsoleta «Deliave»; Venta online fijado a `no`). `queseria-ciriaco-colmenar-de-oreja` (solo CLOSED_TEMPORARILY).
- `madreamiga-madrid`: el "cerrado" era de su place_id erróneo («Madreamiga Teruel»); el obrador de Madrid sigue activo. Sin cambios.

## Duplicados — RESUELTO (fusionados)
- `cooperativas-arganda` → eliminado, se conserva `aceitera-de-arganda`.
- `gabarrera-becerril` → eliminado, se conserva `cervezas-gabarrera-becerril-de-la-sierra` (con su correo traspasado).
- `the-one-getafe` → eliminado, se conserva `the-one-beer-getafe`.

## Pins dudosos (place_id quitado, coords a centroide) — verificar identidad si se retoman
- `miel-tia-pili-manzanares-el-real` — place_id era "Miel Pablo de la Quintana" (Soto del Real): otro apicultor.
- `vino-de-arren` — era "La Mansiega Casa Tere" (mismo pueblo).
- `panirest` — era "ALMOR ALIMENTACIÓN, S.A." (mismo pueblo).
- `aceite-oleollano-morata-de-tajuna` — era "Oleosan 1929" en Yebra (Guadalajara): nombre y provincia distintos.

## Filas sin verificación Google fiable (Text Search no resolvió o dio otro negocio)
Geolocalización sin confirmar; verificar por web cuando se retomen:
- `senda-verde-aranjuez`, `amor-y-miel-bustarviejo`, `sabores-mademi-valdemorillo`, `mermeladas-cucumi-madrid` — Text Search sin resultado.
- `la-quince-brewing-madrid` — Text Search devolvió "Brew Wild Pizza Bar" (no es su obrador; La Quince es real, verificar dirección propia).
- `te-traigo-la-huerta-fuentiduena-de-tajo` — devolvió "Tómate la Huerta" a 85 km (otra empresa).
- `ganados-garcia-del-valle-guadalix-de-la-sierra` — devolvió "Piensos Vicente García" (coincidencia de apellido, dudoso).

## pan-delirio — RESUELTO
Cadena con varios obradores (Juan Bravo 21·28006, Profesor Waksman 8·28036, Naranjo 7·28039, ECI Castellana). La dirección del CSV "C. San Cesáreo 28021" era errónea. Fijado al principal: `Madrid - Salamanca`, C. de Juan Bravo 21, coords 40.432866,-3.681117.
