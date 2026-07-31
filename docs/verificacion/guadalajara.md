# Verificación provincial de Guadalajara

Ledger de la provincia. El CSV es la fuente de verdad y la evidencia por decisión
vive en `data/evidence/castilla-la-mancha/guadalajara.jsonl`. Los contratos
aplicables son `docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md` y
`docs/EDITORIAL_POLICY.md`.

## Estado

✅ **Cerrada el 2026-07-27; mantenimiento V-01 el 2026-07-29.** **61 filas**
(de 62; −1 fusión): 52 `verificado`, 9 `parcial`, **0 `pendiente`**. Venta
online: **53 `sí` (53/53 con canal), 5 `no`, 3 `no comprobado`**. Evidencia:
67 registros — **61 `keep` (cobertura
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
- **Venta online residual tras V-01**: Nectarius conserva una mención de tienda
  en AECOC Trade, pero `nectarius.es` no resuelve; La Huerta del Lobo solo tiene
  catálogo institucional y contacto, sin pedido remoto explícito; la tienda
  antigua de Quesos Seguntino ya no resuelve y su canal social no demuestra un
  mecanismo vigente. Los tres siguen `no comprobado` por bloqueo material.
- 24 de 61 filas sin imagen y 13 sin web.

## Ola 3 · residual corto (2026-07-31)

- Se reabren los dos casos que quedaban en `no comprobado` para mejorar la
  ficha, no para forzar la decisión. **Nectarius** recupera su dominio oficial
  vigente (`nectarius.net`), seis floraciones DOP, identidad y descripción
  propias, y sube a `verificado`. Su catálogo muestra precios y carrito, pero
  el modo catálogo oculta la compra y no deja un checkout usable: sigue
  correctamente en `no comprobado`.
- **Quesos Seguntino** incorpora el teléfono y correo publicados por su perfil
  oficial. La última actividad visible es de 2021 y la antigua tienda sigue
  caída, por lo que conserva el techo `parcial` y la venta sin resolver.
- Snapshot: 61 filas; 53 `verificado`, 8 `parcial`; venta 53 `sí`, 6 `no` y
  2 `no comprobado`.
