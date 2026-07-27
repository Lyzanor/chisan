# Verificación provincial de Cuenca

Ledger de la provincia. El CSV es la fuente de verdad y la evidencia por decisión
vive en `data/evidence/castilla-la-mancha/cuenca.jsonl`. Los contratos aplicables
son `docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md` y
`docs/EDITORIAL_POLICY.md`.

## Estado

✅ **Cerrada el 2026-07-27.** **118 filas**: 86 `verificado`, 32 `parcial`, **0
`pendiente`**. Venta online: **56 `sí` (56/56 con canal), 22 `no`, 40 `no
comprobado`**. Evidencia: 130 registros — **118 `keep` (cobertura 118/118)**, 4
`purge`, 8 `merge`. **Cero avisos de data-quality.** En
`data/evidence/coverage.json`.

Era la provincia más cerca de estar hecha de las tres de Castilla-La Mancha: solo
faltaba una fila sin evidencia y dos descripciones de plantilla.

## Hallazgos del cierre

- **Quesería Villadharo** era la única fila sin registro de evidencia. Tiene
  quesería propia en Camino de Rada, 3 (Villaescusa de Haro) y tienda con precios
  —manchego DOP curado artesano a 56 €—: pasa a `verificado` con canal.
- **Dos S.A.T. de Mota del Cuervo compartían descripción de plantilla** (San
  Miguel y Santa Rita). Son bodegas distintas, con calle y teléfono propios; se
  reescribieron las descripciones con su dirección real.

## Residuales

- **Posible duplicado sin resolver**: `antonio-fernandez-penalver-mota-del-cuervo`
  y `s-a-t-2309-santa-ana-mota-del-cuervo` comparten teléfono (967 180 089) y
  usan correos del mismo titular (`empresasfernandez@` y `empresasfdez@terra.es`),
  pero tienen direcciones distintas y son figuras jurídicas distintas, y ambas
  aparecen por separado en listados sectoriales. **No se fusionaron**: compartir
  titular no prueba la misma unidad productiva. Añadido: la dirección que trae la
  fila de Antonio Fernández Peñalver (C. Don Sabino, 7) coincide con la de una
  ferretería del mismo nombre en el pueblo, así que puede ser la dirección
  equivocada. Conviene resolverlo en una segunda pasada.
- 32 `parcial` y 27 filas sin web; 66 de 118 sin imagen.
