# Cádiz · verificación — snapshot de mantenimiento

Primera pasada profunda **cerrada de extremo a extremo el 2026-07-01** (lotes 1-10, cierre commit
`f923aa3`). Detalle por lote en `git log --follow -p -- docs/verificacion/cadiz.md`; procedencia por
fila en `data/evidence/andalucia/cadiz.jsonl`. La verdad es el CSV; cerrar la pasada no cierra el
catálogo y las afirmaciones dinámicas caducan.

## Estado final de la pasada (2026-07-01)

- Filas: **159** (162 iniciales; 2 purgas + 1 fusión) · verificado **145** · parcial **14** ·
  pendiente **0**.
- `Venta online`: **96 `sí` (96/96 con canal, casi todo ecommerce) · 0 `no` · 63 `no comprobado`**.
  La cuarentena inicial de 21 `sí` heredados sin canal quedó resuelta uno a uno.
- Evidencia: 162 registros, 159/159 filas activas cubiertas; **`andalucia/cadiz` en
  `data/evidence/coverage.json`**.
- Imágenes: 52 filas sin `imagen` al cierre.

## Residuales justificados (14 `parcial`)

Techos reales — no promover sin fuente primaria propia leída en vivo:

- Bodegas: **La Mayetería** (Sanlúcar), **Bodega Ambrosio**, **Hermanos Holgado** (Sierra).
- Pescado: **Perumasa**.
- Queserías payoyas sin web: **Mangana**, **La Covacha**, **El Saltillo**, **Como los de antes**.
- 4 **conventos de clausura** (venta por torno, sin canal propio).
- **Salina de La Esperanza** (salina de la UCA, universitaria) y **Licores Grazalemeños** (sin web).

## Reglas locales (no revertir sin nueva evidencia)

- **Alcance del Marco de Jerez**: entra la bodega con **crianza propia** (DO Jerez/Manzanilla/
  Vinagre); almacenista/embotellador sin crianza o marca sin bodega no entra por defecto;
  distribuidor/vinoteca fuera. El Consejo (`sherry.wine`) apoya pertenencia, no actividad ni venta.
  La reventa de sherry por terceros (Vinissimus, Bodeboca, El Corte Inglés) **no** cuenta para
  `sí`. Bodegas fuera del Marco → IGP Vinos de la Tierra de Cádiz (no mezclar sellos).
- Purgas firmes: **Frigoríficos Costa Sur** (mayorista de congelados), **Guadaceite** (envasador/
  distribuidor sin almazara). Fusión: **Salpesca SL** → La Chanca (razón social).
- Marcas hermanas legítimas — no fusionar: **Gadira / El Rey de Oros** (ambas de Productos de
  Almadraba SL); **Bodegas Yuste / Argüeso** (mismo titular desde 2016, bodegas distintas; la web
  de Argüeso es la tienda de Yuste).
- Demociones `sí`→`no comprobado` firmes (solo reventa de terceros o B2B): **Faustino González**,
  **Santa Petronila**, **Andazul**, **Algaeca** (B2B), **Licores Grazalemeños**.
- **Destraperlo**: su dominio fue secuestrado (spam de casino) y se eliminó — no re-enlazar sin
  comprobar propiedad.
- Recategorizaciones hechas: Rives y Destilerías Pico Bodega→**Licores**; Indi&Co Despensa→
  **Licores**; Finca Arcadia Huevos→**Despensa artesanal** (ajo negro eco).
- Municipios corregidos: Guardi→Arcos, Miguel Domecq→Jerez, Doña Casilda→San José del Valle.
- Pescado: conservera/salazonera/elaborador entra; lonja, cofradía, pescadería o distribuidor no.
  «Langostino de Sanlúcar» = marca colectiva, no productor.
- **Payoyo** es marca registrada de una quesería concreta, no la denominación genérica del queso.
- Webs de bodega bloquean WebFetch (age-gate/Cloudflare): un fetch fallido no prueba baja.

## Fuentes locales y límites

- Consejos: `sherry.wine` (Marco), IGP Tierra de Cádiz, DOP Aceite Sierra de Cádiz, IGP Alfajor de
  Medina Sidonia. Apoyan pertenencia, no actividad/venta.
- **Sabor a Cádiz** (Diputación, `gustocadiz.com`): directorio de descubrimiento — sus fichas NO son
  la web del productor (varios enlaces heredados apuntaban ahí y se limpiaron).
- CAAE (operadores eco andaluces), Landaluz, rutas del atún de almadraba (contexto Pescado).

## Mantenimiento (al retomar)

- Recomprobar los 96 `Venta online=sí` (última comprobación 2026-07-01) y los 63 `no comprobado`.
- Imágenes pendientes: 52 filas.
- La pasada no añadió candidatos nuevos (regla de la 1ª pasada); expansión → `docs/candidates/`.
