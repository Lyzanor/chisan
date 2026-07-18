# Alicante · verificación — snapshot de mantenimiento

Primera pasada profunda **cerrada el 2026-06-29** (lotes 1-8, commit `6ca678b`; provincia partía
«virgen»: 104 filas todas `pendiente`). Detalle por lote en
`git log --follow -p -- docs/verificacion/alicante.md`; procedencia por fila en
`data/evidence/comunitat-valenciana/alicante.jsonl`. La verdad es el CSV; cerrar la pasada no
cierra el catálogo y las afirmaciones dinámicas caducan.

## Estado final de la pasada (2026-06-29)

- Filas: **98** (104 iniciales; 3 fusiones + 4 purgas… ver abajo) · verificado **84** · parcial
  **10** · **pendiente 4** (sin rastro digital, a confirmar en campo).
- `Venta online`: **58 `sí` (58/58 con canal: 56 ecommerce, 2 marketplace) · 0 `no` · 40
  `no comprobado`**.
- Coordenadas 98/98 (geocodificadas las que faltaban, validación ≤15 km o centroide).
- Evidencia: 101 registros (94 `keep`, 3 `merge`, 4 `purge`). **NO está en `coverage.json`**,
  exclusivamente por los 4 pendientes residuales.
- Imágenes: 47/98 al cierre.

## Residuales justificados

- **4 `pendiente` sin rastro digital** (productores particulares; ni se parcializan —no hay fuente
  externa— ni se purgan —ausencia de web ≠ inexistencia—; confirmar en campo/mantenimiento):
  **M. Rosario García** (Vega Baja), **Frutas SIN**, **Finca El Serrat** (Relleu),
  **María Rosario Ortega Pérez** (miel, Salinas).
- 10 `parcial` con techo real; entre ellos **La Rectoria de Pego**, **Selma**, y **Aitana
  Espirulina** (cesó la producción; vigilar por si reactiva o cierra del todo).

## Reglas locales (no revertir sin nueva evidencia)

- Fusiones firmes (mismo productor, 2 filas): **Joan Bellod → Bine i Xama** (Beneixama, mismo
  teléfono) · **Rosa Gil → L'Olivateria Bio Olives** (Almudaina) · realineado
  `casa-agricola-pepe-mendoza-lliber` (municipio real Llíber, no L'Alfàs del Pi; tombstone merge).
- Purgas firmes: **Mateo e Hijo** (servicios agrícolas), **Riera d'Agres** (albergue rural),
  **Cervezas Spigha** (cerrada), **Carla Aguilera SL** (vinculada a distribuidora de
  fitosanitarios, sin actividad productora).
- NO fusionar: **Turrones Picó ≠ Hijos de Manuel Picó** (empresas distintas confirmadas);
  **Casa Agrícola Pepe Mendoza ≠ Bodegas Enrique Mendoza** (proyectos distintos). En turrón, las
  grandes marcas son sociedades multi-marca (p. ej. 1880 = Almendra y Miel SA): confirmar sociedad
  antes de fusionar o purgar.
- Webs ajenas/aparcadas ya corregidas a la oficial: **1880**, **Pablo Garrigós**, **Clavileño**,
  **Helados Alacant**, **Melífera** (→melibera.es), **OR d'Olea** (.net→.com), **Algueña**
  (.com→.es). No restaurar dominios viejos.
- **Casa Carmen** entra en alcance por elaborar el licor Cirereta (no por el restaurante).
- Bilingüismo valencià/castellano al deduplicar (Elche/Elx, Xixona, La Vila Joiosa, Monòver…);
  homónimos a vigilar: **Canyada** y **Salinas** (Alt Vinalopó) colisionan con otras provincias.

## Fuentes locales y límites

- Consejos/IGP: DO Alicante, IGP Turrón de Jijona/Alicante, IGP Cerezas de la Montaña de Alicante.
  Apoyan pertenencia, no actividad ni venta.
- **CAECV** (eco valenciano); atípicos emergentes reales (caracoles Helix Donaire, espirulina):
  mismo criterio de verificación que el resto.

## Mantenimiento (al retomar)

- **Prioridad: resolver los 4 `pendiente` sin rastro** (campo/teléfono) → si se cierran, añadir
  `comunitat-valenciana/alicante` a `coverage.json`.
- Recomprobar los 58 `Venta online=sí` (última comprobación 2026-06-29) y los 40 `no comprobado`.
- Imágenes pendientes: ~51 filas.
