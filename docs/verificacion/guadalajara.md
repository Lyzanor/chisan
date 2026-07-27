# Verificación provincial de Guadalajara

Ledger de la provincia. El CSV es la fuente de verdad y la evidencia por decisión
vive en `data/evidence/castilla-la-mancha/guadalajara.jsonl`. Los contratos
aplicables son `docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md` y
`docs/EDITORIAL_POLICY.md`.

## Estado

✅ **Cerrada el 2026-07-27.** **61 filas** (de 62; −1 fusión): 50 `verificado`,
11 `parcial`, **0 `pendiente`**. Venta online: **45 `sí` (45/45 con canal), 1
`no`, 15 `no comprobado`**. Evidencia: 67 registros — **61 `keep` (cobertura
61/61)**, 2 `purge`, 4 `merge`. **Cero avisos de data-quality.** En
`data/evidence/coverage.json`.

Seis de las 62 filas llegaban sin registro de evidencia y cinco de ellas tenían
`Venta online = sí` sin canal; ese fue el grueso del cierre.

## Hallazgos del cierre

- **Un duplicado claro, fusionado**: `queseria-artesana-castillo-de-hita` y
  `queseria-de-hita-hita` eran la misma casa —misma calle y número (C. Soria, 19,
  Hita), mismo teléfono, mismo dominio, coordenadas a quince metros y el mismo
  horario de visita—. Su web lo confirma: es «Quesería Artesana de Hita», de Luis
  Coracho Dorado, y usa «Castillo de Hita» como marca.
- **Dos filas usaban `alimentosdeguadalajara.es` como `web` propia**, que es la
  tienda de la marca alimentaria de la Diputación, no la del productor. Se
  corrigió: Pastelería Marian tiene web propia (`pasteleriamarian.com`) y Maramel
  se quedó sin `web`. **La tienda provincial sí cuenta como canal**, pero como
  escaparate colectivo (`marketplace`), no como tienda propia.
- **Maramel es una marca sin productor identificable**: la ficha de la tienda
  provincial describe la miel y su precio (6,45 € los 500 g) pero no dice quién
  la produce, y no hay web ni rastro propio. Techo `parcial`.
- **Tres filas subieron a `verificado` con canal demostrado**: Bodegas Alto de
  Pioz (bodega y viñedo propios en La Alcarria, tienda de 11 a 24 €), Oleosan
  1929 (almazara propia en Yebra, cuarta generación) y Frutos Secos Orozco (tueste
  propio y venta directa de fábrica). En Alto de Pioz la `web` apuntaba a una
  subpágina de visitas: se llevó a la raíz.

## Residuales

- **Encaje anotado — Burcol**: empresa familiar de Cabanillas del Campo desde
  1990, con IFS Food y certificación ecológica y tienda propia, pero su actividad
  declarada es «limpieza, selección, envasado y distribución» de legumbre y
  arroz, no cultivo. Queda `parcial`. **Para León se decidió que envasar cuenta
  como producir, por excepción de provincia**; si ese criterio se extiende a
  Guadalajara, esta fila sube.
- **Duda de municipio en Frutos Secos Orozco**: su portada dice elaborar «en
  Mazuecos, Guadalajara» pero la página de contacto solo publica la dirección de
  la capital. Se conservó el municipio del volcado.
- 24 de 61 filas sin imagen y 13 sin web.
