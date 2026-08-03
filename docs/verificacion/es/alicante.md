# Alicante · verificación — snapshot de mantenimiento

Primera pasada profunda **cerrada el 2026-06-29** (lotes 1-8, commit `6ca678b`; provincia partía
«virgen»: 104 filas todas `pendiente`). Detalle por lote en
`git log --follow -p -- docs/verificacion/es/alicante.md`; procedencia por fila en
`data/evidence/comunitat-valenciana/alicante.jsonl`. La verdad es el CSV; cerrar la pasada no
cierra el catálogo y las afirmaciones dinámicas caducan.

## Estado actual tras segunda pasada (2026-07-28)

- Filas: **98** (104 iniciales; 3 fusiones + 4 purgas… ver abajo) · verificado **84** · parcial
  **14** · **pendiente 0**.
- `Venta online`: **58 `sí` (58/58 con canal: 56 ecommerce, 2 marketplace) · 0 `no` · 40
  `no comprobado`**.
- Coordenadas 98/98 (geocodificadas las que faltaban, validación ≤15 km o centroide).
- Evidencia: 105 decisiones al cierre de esta pasada. **Está en `coverage.json`**.
- Imágenes: 47/98 al cierre.

## Segunda pasada residual

- Los cuatro `pendiente` se localizaron en fichas individuales de Saborigen:
  **M. Rosario García**, **Frutas SIN**, **Finca El Serrat** y **María Rosario
  Ortega Pérez**. Las fichas confirman producción propia, municipio y contacto.
  Los cuatro pasan a `parcial`, no a `verificado`, porque solo hay fuente
  institucional y no una web, red propia o ficha primaria viva.
- Los 10 `parcial` previos conservan su techo real; entre ellos **La Rectoria de Pego**, **Selma**, y **Aitana
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

- Ya no quedan `pendiente`; revalidar en campo o por teléfono los cuatro
  `parcial` de la segunda pasada sería una mejora, no un bloqueo de cobertura.
- Recomprobar los 58 `Venta online=sí` (última comprobación 2026-06-29) y los 40 `no comprobado`.
- Imágenes pendientes: ~51 filas.

## Ola 3 · cierre de la banda 1–40 (2026-07-29)

- Se revisaron las **40** filas residuales: **24** pasan a `no`, **15**
  permanecen `no comprobado` por tienda averiada/estacional, dominio caído o
  reventa independiente, y **1** se purga. Alicante queda con **97 filas**:
  58 `sí`, 24 `no` y 15 `no comprobado`.
- **Aitana Espirulina** sale del CSV y se elimina su imagen: su propia web
  declara que ya no produce espirulina y mantiene únicamente talleres, visitas
  y actividad educativa.
- **Turrones Picó** recibe la dirección real de fábrica, teléfono, correo y
  horario oficiales.
- **Chocolates Clavileño** deja atrás la descripción genérica y completa sede,
  teléfono y correo publicados por el fabricante. Su web sigue siendo catálogo
  sin pedido B2C, por lo que se registra `no`.
