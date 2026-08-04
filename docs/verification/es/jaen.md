# Verificación provincial de Jaén

Ledger inicial para planificar y reanudar la revisión profunda de
`data/csv/andalucia/jaen.csv`. El CSV es la fuente de verdad. La evidencia
estructurada por fila vive en `data/evidence/andalucia/jaen.jsonl` y se amplía a
medida que se revise cada lote.

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`; este documento no
lo duplica, solo fija el snapshot, las particularidades de Jaén y el plan de
lotes. Los contratos viven en `docs/CSV_CONTRACT.md`,
`docs/EVIDENCE_CONTRACT.md` y `docs/EDITORIAL_POLICY.md`.

Este ledger está pensado para que cualquier agente pueda seguirlo de forma
autónoma: lee "Reglas duras para Jaén", "Flujo por lote" y la fila del lote en
curso; no necesitas releer el manual entero por lote.

## Estado inicial

- Inicio: 2026-07-03.
- Snapshot inicial: **145 filas**; **7 `verificado`**, **2 `parcial`** y **136
  `pendiente`**.
- Venta online inicial: **3 `sí`**, 0 `no` y **142 `no comprobado`**.
- `Canal de venta`: **1/145 filas informado**. Solo
  `los-tres-manantiales-marmolejo` tiene `Venta online=sí` con
  `Canal de venta=ecommerce` y evidencia JSONL. Los otros 2 `sí` heredados
  (`embutidos-artesanos-la-abuela-laura-frailes` y
  `pasteleria-pascuala-navas-de-san-juan`) están en `pendiente` y sin canal:
  tratarlos como anomalía de venta hasta reauditar.
- Evidencia inicial: `data/evidence/andalucia/jaen.jsonl` existe con **1
  registro** (`los-tres-manantiales-marmolejo`, `keep`, 2026-06-30). Las otras 8
  filas no pendientes no tienen evidencia local suficiente y deben reauditarse en
  su lote.
- `data/evidence/coverage.json`: Jaén no está marcada como provincia con cobertura
  estricta.
- Imágenes: **0/145 filas con `imagen`** y la carpeta
  `public/productores/andalucia/jaen/` no tiene assets. No enriquecer imágenes
  hasta estabilizar identidad, `slug`, fusiones y purgas.
- Enlaces iniciales: 111/145 con `web`, 75/145 con `Instagram`, 14/145 con
  `Facebook`, 145/145 con `Google Maps`, 143/145 con `telefono`, 138/145 con
  `correo`, 145/145 con `direccion` y 145/145 con `lat`/`lon`.
- Calidad inicial:
  - `node scripts/audit-csv.js --mode=contract data/csv/andalucia/jaen.csv`
    devuelve **0 errores, 0 warnings, status OK**.
  - `node scripts/audit-csv.js --mode=quality --summary-only
    data/csv/andalucia/jaen.csv` devuelve **0 errores, 2 warnings** y 63 avisos
    suprimidos por opcionales ausentes.
- Warnings iniciales de geo-check:
  - `mo-molina-olivares-jaen`: 32,5 km de Jaén; centroide más cercano Alcaudete
    (0,6 km).
  - `panaderia-panciencia-segura-de-la-sierra`: 16,3 km de Segura de la Sierra;
    centroide más cercano Génave (0,0 km).
- Modo: primera pasada profunda. Prioridad: cerrar identidad, alcance, municipio,
  venta online y evidencia de las 145 filas heredadas antes de añadir candidatos
  nuevos.

Reparto por categoría del snapshot inicial:

| Categoría | Filas |
|---|---:|
| Aceite | 44 |
| Charcutería | 28 |
| Pan y pastelería | 25 |
| Aperitivos | 14 |
| Lácteos y quesos | 8 |
| Bodega | 6 |
| Miel | 6 |
| Aromáticas y condimentos | 4 |
| Conservas | 4 |
| Cerveza artesana | 3 |
| Fruta y verdura | 2 |
| Café | 1 |

## Avance tras lote 1

- Lote 1 cerrado: 2026-07-03.
- Snapshot tras lote 1: **145 filas**; **22 `verificado`**, **2 `parcial`** y
  **121 `pendiente`**.
- Venta online tras lote 1: **15 `sí`**, 0 `no` y **130 `no comprobado`**.
- `Canal de venta`: **13/145 filas informado**. Las 12 ventas `sí` resueltas en
  lote 1 quedan con `Canal de venta=ecommerce`; siguen pendientes las dos
  anomalías heredadas de La Abuela Laura y Pastelería Pascuala hasta sus lotes.
- Evidencia tras lote 1: **17 registros JSONL** en
  `data/evidence/andalucia/jaen.jsonl` (1 inicial + 15 `keep` del lote 1 + 1
  `merge` por corrección de slug).
- Decisiones clave del lote 1:
  - 15/15 filas cerradas como `verificado`; 0 purgas.
  - 12/15 con venta online `sí` vía `ecommerce`.
  - 3/15 quedan con venta online `no comprobado`: `arte-oleum-beas-de-segura`,
    `el-torito-bravo-aceite-de-oliva-virgen-extra-campillo-de-arenas` y
    `s-c-a-san-antonio-abad-arquillos`.
  - `s-c-a-san-antonio-abad-carcheles` se corrige a
    `s-c-a-san-antonio-abad-arquillos`; la fuente oficial sitúa la cooperativa en
    Arquillos, no en Cárcheles.
  - Se normalizan direcciones/contactos de Unolivo, Cortijo de la Torre, Haza La
    Centenosa, Pradolivo, Oleícola San Francisco, La Perla de Mágina, Trujal del
    Mágina, Aceites Sierra Sur, SCA San Roque de Cárcheles y Vadolivo.
  - La antigua web de Virgen de la Campiña se sustituye por la página canónica de
    El Trovador para la Cooperativa Agraria San Roque de Arjonilla.

## Avance tras lotes 2-5

- Lotes 2-5 cerrados: 2026-07-03.
- Snapshot tras lotes 2-5: **145 filas**; **63 `verificado`**, **17 `parcial`**
  y **65 `pendiente`**.
- Venta online tras lotes 2-5: **48 `sí`**, 0 `no` y **97 `no comprobado`**.
- `Canal de venta`: **47/145 filas informado**. Queda una anomalía heredada
  fuera de estos lotes (`pasteleria-pascuala-navas-de-san-juan`) hasta el lote 7.
- Evidencia tras lotes 2-5: **73 registros JSONL** en
  `data/evidence/andalucia/jaen.jsonl`.
- Decisiones clave:
  - Aceite II: 13/14 filas `verificado`, 1 `parcial`, 11 ventas online
    resueltas.
  - Aceite III: 14/15 filas `verificado`, 1 `parcial`, 12 ventas online
    resueltas; `los-tres-manantiales-marmolejo` queda revalidado.
  - Charcutería I: 9/14 filas `verificado`, 5 `parcial`, 7 ventas online
    resueltas; `embutidos-artesanos-la-abuela-laura-frailes` queda como
    `marketplace` y ya no tiene canal vacío.
  - Charcutería II: 6/14 filas `verificado`, 8 `parcial`, 5 ventas online
    resueltas.
  - `cooperativa-hortofruticola-san-marcos-torres` pasa de `Charcutería` a
    `Fruta y verdura` porque la fila describe cerezas de Torres, no cárnicos.
  - `mo-molina-olivares-jaen` se verifica por web oficial y Degusta Jaén, pero se
    conserva documentado el warning geográfico: la ficha institucional sostiene
    Jaén capital y a la vez publica una coordenada cerca de Alcaudete.
  - Se normalizan enlaces/canales de venta para Don Verde Vida, Sensolive, Pico
    Cabañas, Oleocampo, Bravoleum, Toledano/La Fábrica, Carnes J. Madrid y
    Embutidos Gómez.

## Avance tras lotes 6-11

- Lotes 6-11 cerrados: 2026-07-03.
- Snapshot tras lotes 6-11: **145 filas**; **118 `verificado`**, **27
  `parcial`** y **0 `pendiente`**.
- Venta online tras lotes 6-11: **78 `sí`**, 0 `no` y **67 `no comprobado`**.
- `Canal de venta`: **78/145 filas informado** y no queda ningún `sí` sin canal.
- Evidencia tras lotes 6-11: **147 registros JSONL** en
  `data/evidence/andalucia/jaen.jsonl` (145 `keep` activos + 2 correcciones de
  slug/identidad).
- Decisiones clave:
  - Pan y pastelería: 19/25 filas `verificado`, 6 `parcial`, 7 ventas online
    resueltas; `pasteleria-pascuala-navas-de-san-juan` queda con
    `Canal de venta=ecommerce`.
  - Aperitivos: 13/14 filas `verificado`, 1 `parcial`, 6 ventas online
    resueltas; se corrige la dirección de `patatas-fritas-el-artesano-de-martos-martos`
    a Martos.
  - Lácteos, quesos, miel y chocolates: 10/14 filas `verificado`, 4 `parcial`,
    6 ventas online resueltas; `artechoc-baeza`, `apisierra-miel-y-chocolates-pozo-alcon`
    y `chocolivate-sabiote` se recategorizan fuera de `Miel` genérico.
  - Bodega/bebidas/café: 10/10 filas `verificado`, 7 ventas online resueltas;
    `vermut-papatan-torreperogil` y `vermut-loa-ubeda` pasan a `Vermut`, y
    `aguas-sierra-cazorla-villanueva-del-arzobispo` pasa a
    `Agua mineral natural`.
  - Conservas/aromáticas/fruta: 9/11 filas `verificado`, 2 `parcial`, 5 ventas
    online resueltas; `la-mar-sala-jaen` pasa a `Pescado y marisco` y
    `llano-la-venta-peal-de-becerro` corrige la dirección heredada de Cazorla a
    Peal de Becerro.
  - `panaderia-panciencia-segura-de-la-sierra` se corrige a
    `panaderia-panciencia-genave`; la fuente oficial y la dirección corresponden
    a Génave. Con ello desaparece su geo-warning.
  - Se eliminan enlaces no válidos o tomados por contenido ajeno:
    `panaderiaminutos.es` en La Morenita, `pasteleriaexcelsior.es` en Excelsior
    y el blogspot heredado de Garrapiñadas Vega.
  - Queda un único warning de calidad, ya documentado desde el lote 2:
    `mo-molina-olivares-jaen`.

## Cierre total tras lote 12

- Lote 12 cerrado: 2026-07-03.
- Snapshot final de la pasada: **145 filas**; **118 `verificado`**, **27
  `parcial`** y **0 `pendiente`**.
- Venta online final: **78 `sí`**, 0 `no` y **67 `no comprobado`**. Todas las
  ventas `sí` tienen `Canal de venta`.
- Evidencia final: **147 registros JSONL**; 145 `keep` activos y 2 correcciones
  de slug/identidad (`s-c-a-san-antonio-abad-carcheles` ->
  `s-c-a-san-antonio-abad-arquillos` y
  `panaderia-panciencia-segura-de-la-sierra` -> `panaderia-panciencia-genave`).
- `data/evidence/coverage.json` incluye `andalucia/jaen`: la cobertura de
  evidencia queda marcada como estricta/advisory para la provincia.
- Deduplicación final: sin duplicados normalizados `nombre + municipio` ni webs
  repetidas en Jaén.
- Calidad final: 0 errores y 1 warning aceptado/documentado:
  `mo-molina-olivares-jaen`. Degusta Jaén publica `C/ Encinas 34, Jaén` y la
  ficha institucional mantiene municipio Jaén, pero el enlace Maps heredado cae
  cerca de Alcaudete y no se encontró geocodificación pública fiable para mover
  coordenadas. Se normaliza la dirección textual a `C/ Encinas 34` y se conserva
  el warning hasta tener fuente de localización mejor.
- Completitud: quedan gaps planificados en `web`, `Venta online` e `imagen`;
  no bloquean el cierre editorial. Las imágenes siguen a 0/145 por decisión
  explícita de no enriquecer hasta estabilizar identidad y `slug`.

## Zonas de Jaén para lotear

- **Sierra Sur y Alcalá**: Alcalá la Real, Alcaudete, Frailes, Noalejo,
  Valdepeñas de Jaén, Cabra del Santo Cristo, Campillo de Arenas, Cárcheles y
  entorno. Aceite, queserías, embutidos, vino y obradores.
- **Sierra Mágina y centro-sur**: Cambil, Huelma, Jimena, Mancha Real, Torres,
  Jamilena y Martos. Aceite DOP Sierra Mágina, panadería y pequeños elaboradores.
- **Campiña Norte, Andújar y La Loma**: Andújar, Arjona, Arjonilla, Bailén,
  Baeza, Begíjar, Jabalquinto, Lahiguera, Torredelcampo, Torredonjimeno, Úbeda,
  Villatorres y Villanueva de la Reina. Almazaras, snacks, panadería y cárnicos.
- **Capital y área metropolitana**: Jaén y su entorno inmediato. Concentra 16
  filas y mezcla almazaras/marcas, cárnicos, obradores, aperitivos y posibles
  errores de municipio.
- **Sierra de Cazorla, Segura y Las Villas**: Beas de Segura, Cazorla, La Puerta
  de Segura, Orcera, Peal de Becerro, Pozo Alcón, Puente de Génave, Quesada,
  Santiago-Pontones, Segura de la Sierra, Siles, Villacarrillo y Villanueva del
  Arzobispo. Aceite DOP, cordero/embutido, miel, queserías y obradores.
- **El Condado y norte**: La Carolina, Navas de San Juan, Santisteban del Puerto,
  Vilches y Montizón. Aromáticas, conservas, aceite, dulces y posibles productores
  de escala pequeña con poca huella web.

## Reglas duras para Jaén

1. **Reauditar también las filas no pendientes.** Hay 7 `verificado` y 2
   `parcial`, pero solo una fila tiene evidencia JSONL. Cuando llegue su lote,
   cada una debe quedar con evidencia `keep`, mantenerse/ajustarse o degradarse si
   la fuente no sostiene identidad, actividad productora y municipio.
2. **No admitir `sí` sin canal.** Los 3 `sí` heredados ya están resueltos:
   `los-tres-manantiales-marmolejo`, `embutidos-artesanos-la-abuela-laura-frailes`
   y `pasteleria-pascuala-navas-de-san-juan` tienen evidencia y `Canal de venta`.
   En el cierre final, cualquier nuevo `sí` debe entrar con canal demostrado.
3. **Aceite domina la provincia.** Entran almazaras, cooperativas con actividad
   oleícola real, fincas/productores con elaboración propia o marcas ligadas a
   molino. Distinguir de envasador, comercializadora, distribuidor, marca blanca o
   industrial B2B sin productor Km0 claro.
4. **Los consejos y sellos apoyan, no sustituyen.** DOP/IGP y registros sectoriales
   sirven para existencia y encaje, pero `verificado` necesita fuente propia, ficha
   individual fiable o match claro de entidad, actividad y municipio.
5. **Vigilar categorías arrastradas.** `Aguas Sierra Cazorla` no debería cerrarse
   como `Bodega` sin revisar si corresponde a bebidas/agua; vermuts pueden requerir
   `Licores` o `Bebidas`; `Heladería Lalola` puede ser `Helados`; `Artechoc` y
   `Chocolivate` pueden estar mejor fuera de `Miel`; `Salinas Don Diego` en
   `Pan y pastelería` exige revisión de alcance real.
6. **Charcutería no equivale a carnicería.** Mantener carnicerías solo si hay
   obrador, secadero, elaboración propia o marca productora acreditada. Si solo es
   despacho/minorista, máximo `parcial` o purga según evidencia.
7. **Pan y pastelería exige obrador.** Confirmar horno, confitería, obrador o
   fabricación propia. Cafeterías, despachos y puntos de venta sin elaboración
   demostrada no deben cerrarse como `verificado`.
8. **Aperitivos mezcla artesanos e industria.** Patatas, aceitunas, garrapiñadas,
   pistachos y snacks deben revisarse por unidad productiva local. Un grupo
   alimentario nacional o marca adquirida no queda dentro por defecto si la
   actividad local/productora no es clara.
9. **Lácteos y quesos son el bloque heredado más avanzado.** No asumir que los 6
   `verificado` son definitivos: añadir evidencia completa, revisar los 2
   `parcial` y confirmar venta remota sin rellenar canales por inercia.
10. **Miel, chocolate y aromáticas requieren productor real.** Confirmar apicultor
    con colmenas propias, elaborador de chocolate/confitería, cultivo/envasado de
    aromáticas o actividad agrícola propia; no basta un comercio gourmet.
11. **Geo-warnings.** `panaderia-panciencia-genave` quedó corregida a Génave.
    El único warning activo es `mo-molina-olivares-jaen`, ya documentado; si el
    cierre final localiza geocodificación exacta, corregir con fuente, no a ojo.
12. **No añadir candidatos nuevos durante esta pasada** salvo decisión explícita.
    Primero cerrar las 145 filas heredadas, evidencia, deduplicación y preparación
    de imágenes.

## Fuentes de cotejo iniciales

Orientan la búsqueda; no sustituyen la comprobación de una fuente propia o ficha
real cuando la decisión sea `verificado`. Confirma el dominio oficial al citarlo.

- **Degusta Jaén / Diputación de Jaén** y sellos provinciales como Jaén Selección:
  anclas útiles de descubrimiento y contraste provincial.
- **IGP Aceite de Jaén**, **DOP Sierra de Cazorla**, **DOP Sierra Mágina** y
  **DOP Sierra de Segura**: almazaras, cooperativas, marcas amparadas y contexto
  oleícola.
- **Vino de la Tierra / IGP Sierra Sur de Jaén** y fuentes de bodegas locales:
  Marcelino Serrano, Campoameno, vermuts y bebidas; revisar recategorizaciones.
- **IGP Cordero Segureño** y fuentes de Sierra de Segura/Cazorla: apoyo para
  cárnicos, pero no sustituye prueba de obrador/secadero o venta.
- **Gusto del Sur / Calidad Certificada / Landaluz / CAAE**: registros andaluces
  útiles para existencia, certificación y razón social; por sí solos suelen
  sostener como máximo `parcial`.
- Webs, tiendas, perfiles oficiales y fichas reales de Google Maps ya presentes
  en el CSV: primera fuente si pertenecen claramente al productor.
- Ayuntamientos, comarcas, turismo de Sierra Mágina, Sierra de Segura/Cazorla,
  Sierra Sur, prensa local y ferias agroalimentarias: fuentes secundarias para
  resolver dudas, nunca sustituto único si actividad productora, municipio o venta
  quedan materialmente dudosos.

## Plan de ejecución

Lotes agrupados por sector y riesgo. Tamaño objetivo: 10-15 filas salvo cierre.
Los lotes 1-11 cubren el snapshot inicial de 145 sin solaparse; el lote 12 es
cierre transversal.

1. **Lotes 1-3: Aceite (44 filas).** Sector dominante. Dividir en tres bloques en
   el orden actual de la categoría para cerrar rápido DOP/IGP, almazaras,
   cooperativas y marcas. Resolver el geo-warning de `mo-molina-olivares-jaen` en
   el lote 2 y reauditar `los-tres-manantiales-marmolejo` en el lote 3.
2. **Lotes 4-5: Charcutería (28 filas).** Separar obrador/secadero/productor de
   carnicería o despacho; resolver el `sí` heredado de La Abuela Laura en el lote
   4.
3. **Lotes 6-7: Pan y pastelería (25 filas).** Obradores de Jaén/Linares y resto
   provincial; resolver el `sí` heredado de Pastelería Pascuala y el geo-warning
   de `panaderia-panciencia-segura-de-la-sierra` en el lote 7.
4. **Lote 8: Aperitivos (14 filas).** Patatas, aceitunas, garrapiñadas,
   pistachos y snacks; triaje de industria/grupo vs elaborador local.
5. **Lote 9: Lácteos y quesos + Miel (14 filas).** Reauditar los 8 lácteos y
   cerrar apicultores/chocolate/miel con fuente propia o `parcial` documentado.
6. **Lote 10: Bodega + Cerveza artesana + Café (10 filas).** Bodegas, vermuts,
   cerveza y café; recategorizar agua/vermut cuando corresponda.
7. **Lote 11: Conservas + Aromáticas y condimentos + Fruta y verdura (11 filas).**
   Lote heterogéneo para gazpacho, conservas, ajo, stevia, aromáticas, hortícola
   y San Marcos; distinguir productor/elaborador de comercio o distribuidor.
8. **Lote 12: cierre transversal.** Objetivo: 0 pendientes, `Canal de venta` en
   todos los `sí`, evidencia coherente para filas activas, purgas/fusiones
   documentadas, deduplicación, geo-warnings resueltos o aceptados e imágenes
   listas para enriquecimiento posterior.

## Worklist inicial

Leyenda: `Pendiente`, `En curso`, `Hecho`. Los lotes parten por categoría en el
orden actual del CSV; **congela los `slug` al iniciar cada lote**. Si un lote
fusiona, purga o recategoriza filas, recalcula los bloques siguientes antes de
iniciarlos. El lote 12 es auditoría transversal y puede revisar filas ya tocadas.

Las columnas `Pend./Parcial/Verif./VO=sí` reflejan el **contenido inicial del
lote**, no el resultado; se actualizan al cerrar cada lote.

| # | Lote | Alcance | Filas | Pend. | Parcial | Verif. | VO=sí | Estado | Notas iniciales |
|---|---|---|---:|---:|---:|---:|---:|---|---|
| 1 | Aceite I | Primeras 15 filas de `Aceite` en orden CSV | 15 | 0 | 0 | 15 | 12 | Hecho | Cerrado el 2026-07-03: 15 `verificado`, 12 `ecommerce`, 3 venta `no comprobado`; corrección de slug/municipio San Antonio Abad Cárcheles -> Arquillos; 0 purgas. |
| 2 | Aceite II | Siguientes 14 filas de `Aceite` | 14 | 0 | 1 | 13 | 11 | Hecho | Cerrado el 2026-07-03: `nuestro-aroma-cazorla` queda `parcial`; se acepta/documenta el geo-warning de `mo-molina-olivares-jaen`; 0 purgas. |
| 3 | Aceite III | Resto de `Aceite` | 15 | 0 | 1 | 14 | 12 | Hecho | Cerrado el 2026-07-03: `senorio-de-las-almenas-ubeda` queda `parcial`; `los-tres-manantiales-marmolejo` revalidado; 0 purgas. |
| 4 | Charcutería I | Primeras 14 filas de `Charcutería` | 14 | 0 | 5 | 9 | 7 | Hecho | Cerrado el 2026-07-03: La Abuela Laura queda `sí` vía `marketplace`; carnicerías sin fuente fuerte quedan `parcial`; 0 purgas. |
| 5 | Charcutería II | Resto de `Charcutería` congelado al inicio | 14 | 0 | 8 | 6 | 5 | Hecho | Cerrado el 2026-07-03: San Marcos recategorizado a `Fruta y verdura`; carnicerías sin fuente fuerte quedan `parcial`; 0 purgas. |
| 6 | Pan y pastelería I | Primeras 13 filas de `Pan y pastelería` | 13 | 0 | 3 | 10 | 4 | Hecho | Cerrado el 2026-07-03: recategorizadas La Cremería (`Helados`), Salinas Don Diego (`Sal`) y Churro Fácil (`Churrería`); La Morenita y Barranco quedan `parcial`; 0 purgas. |
| 7 | Pan y pastelería II | Resto de `Pan y pastelería` | 12 | 0 | 3 | 9 | 3 | Hecho | Cerrado el 2026-07-03: Pascuala queda `sí` con `ecommerce`; Panciencia se corrige a Génave; Excelsior pierde web comprometida; 0 purgas. |
| 8 | Aperitivos | `Aperitivos` | 14 | 0 | 1 | 13 | 6 | Hecho | Cerrado el 2026-07-03: Santo Reino validado como fábrica jiennense de Grupo Apex; El Artesano corrige dirección a Martos; Supli queda `parcial`; 0 purgas. |
| 9 | Lácteos, quesos y miel | `Lácteos y quesos`, `Miel` | 14 | 0 | 4 | 10 | 6 | Hecho | Cerrado el 2026-07-03: Lalola pasa a `Helados`; Artechoc a `Chocolate y dulces`; Apisierra/Chocolivate a `Miel y chocolates`; 0 purgas. |
| 10 | Bodega, cerveza y café | `Bodega`, `Cerveza artesana`, `Café` | 10 | 0 | 0 | 10 | 7 | Hecho | Cerrado el 2026-07-03: Papatán y LOA pasan a `Vermut`; Aguas Sierra Cazorla pasa a `Agua mineral natural`; 0 purgas. |
| 11 | Conservas, aromáticas y fruta | `Conservas`, `Aromáticas y condimentos`, `Fruta y verdura` | 11 | 0 | 2 | 9 | 5 | Hecho | Cerrado el 2026-07-03: La Mar Salá pasa a `Pescado y marisco`; Llano la Venta corrige dirección a Peal; San Marcos se mantiene `parcial`; 0 purgas. |
| 12 | Cierre transversal provincial | Todas | 145 | 0 | 27 | 118 | 78 | Hecho | Cerrado el 2026-07-03: 0 pendientes, cobertura de evidencia estricta, deduplicación limpia, único warning aceptado (`mo-molina-olivares-jaen`) e imágenes pospuestas para fase posterior. |

## Flujo por lote

1. Antes de empezar:

   ```bash
   git status --short
   npx pnpm list:province jaen
   ```

2. Tomar el primer lote `Pendiente` de la worklist y congelar sus `slug` antes de
   investigar. Para lotes por categoría, usar el orden actual del CSV dentro de
   esas categorías:

   ```bash
   node --input-type=module - <<'JS'
   import fs from "node:fs";
   import { parse } from "csv-parse/sync";

   const PATH = "data/csv/andalucia/jaen.csv";
   const CATS = new Set(["Aceite"]); // ajustar por lote

   const rows = parse(fs.readFileSync(PATH, "utf8"), {
     columns: true,
     skip_empty_lines: true,
   });

   for (const r of rows.filter((row) => CATS.has(row.categoria))) {
     console.log(
       r.slug, "|", r.verificacion, "| VO=", r["Venta online"],
       "|", r.municipio, "| web=", Boolean(r.web),
       "| ig=", Boolean(r.Instagram), "| maps=", Boolean(r["Google Maps"])
     );
   }
   JS
   ```

3. Priorizar dentro del lote: duplicados/fusiones, no productores, categorías
   materialmente erróneas, warnings de municipio/coordenadas, `sí` sin canal,
   enlaces ajenos/directorios, luego pendientes con fuente propia fácil.
4. Investigar hasta evidencia suficiente. Detenerse cuando identidad, actividad
   productora, municipio y venta remota estén decididos.
5. Editar quirúrgicamente el CSV con parser, preservando LF y tocando solo los
   `slug` del lote.
6. Añadir o sustituir una línea JSONL para cada fila con alta de evidencia, cambio
   de `verificacion`, cambio de `Venta online`, canal, purga o fusión. Para una
   fila `verificado`, la evidencia debe sostener `identity`, `producer-activity`
   y `municipality`, no solo `online-sales`.
7. Validar durante la iteración:

   ```bash
   npx pnpm check:csv:changed
   npx pnpm check:evidence:changed
   git diff --check
   ```

8. Al cerrar un lote o un bloque de lotes:

   ```bash
   npx pnpm verify:data
   ```

9. Actualizar este ledger: snapshot si cambia, estado del lote, fecha y nota corta
   con verificadas, parciales, purgas/fusiones, ventas resueltas y residuales.

## Criterios de cierre de la pasada

- 0 filas `pendiente`, salvo razón explícita documentada para pausar.
- Cada residual `parcial` tiene motivo conocido y evidencia JSONL coherente.
- Cada fila activa tiene evidencia `keep`; cada purga/fusión tiene registro
  `purge`/`merge`.
- Cada `Venta online=sí` tiene `Canal de venta` y evidencia de pedido remoto
  vigente; los dos `sí` heredados sin canal quedan resueltos.
- No quedan enlaces ajenos, dominios aparcados, fichas Maps genéricas como prueba
  fuerte ni categorías/municipios claramente erróneos sin corregir.
- Los geo-warnings iniciales quedan corregidos, aceptados con motivo o trasladados
  a override si el problema es de centroide.
- No quedan duplicados aparentes sin decisión explícita.
- Las imágenes se enriquecen solo después de estabilizar identidad y `slug`.
- `npx pnpm verify:data` pasa antes del cierre provincial.
- Las 145 filas iniciales quedan cerradas y la evidencia cubre filas activas,
  purgas y fusiones; `andalucia/jaen` queda añadido a
  `data/evidence/coverage.json`.

## Decisiones que deben quedar especialmente anotadas

- Grandes aceiteras, envasadores o marcas: por qué entran como productor Km0 o por
  qué salen por escala/actividad B2B/distribución.
- Promociones de DOP/IGP/directorio a `verificado`: qué fuente individual supera
  el techo de `parcial`.
- Los 2 `sí` heredados sin canal y cualquier nuevo `no comprobado` -> `sí`.
- Cambios de categoría en bebidas, vermuts, helados, chocolate/miel, salinas,
  aromáticas o aperitivos.
- Carnicería-despacho vs obrador/secadero en `Charcutería`.
- Obrador real vs despacho/cafetería en `Pan y pastelería`.
- Cualquier fila verificada sin web propia: fuente exacta que sostiene identidad,
  actividad y municipio.
- Purgas por no productor, industrial/B2B, duplicado, cierre, otra provincia o
  ausencia suficientemente contrastada.
- Normalizaciones de municipio y resolución de los geo-warnings de Jaén/Alcaudete
  y Segura de la Sierra/Génave.

## JA-13 — Ola 3: venta sin resolver

Revisión cerrada el 2026-07-29 sobre las **81 filas** que seguían con
`Venta online=no comprobado`: **11 pasan a `sí` y 70 permanecen sin resolver**
tras revisar sus canales actuales.

Las once resoluciones son ecommerce propio: Tierra de Frontera, Productos
Paqui, Casa Bigote, SCA Encarnación, Apisierra, Aceites Sola Romero, Productos
Urbano, Patatas Fritas Domi, Aguas Sierra Cazorla, Aceites El Carrascal y la
Cooperativa La Vicaría.

Mejoras editoriales asociadas:

- **Bioandalus** mezclaba la calle de su fábrica con el municipio y código
  postal de Navas de San Juan. La web oficial sitúa las naves 4-6 en el
  polígono Condado de Santisteban, 23250 Santisteban del Puerto; se corrigen
  dirección, correo, productos y descripción.
- **Apisierra** ya no es un catálogo roto: estrenó una tienda Prestashop con
  mieles, chocolates y mermeladas. Se incorporan sus mieles reales a
  `productos estrella`, se sustituye el teléfono y se resume la descripción.
- Santo Reino se enlaza a la ficha vigente de Grupo Apex y se elimina la
  afirmación heredada de una tienda no comprobada. Martínez Premium recupera
  su dominio y correo actuales, pero su tienda declara que no hay productos.
- Se retira el dominio sin DNS de Solana de Cárchel sin degradar actividad ni
  inferir que no vende.
- No se confundió scaffolding con comercio: Pistachos del Guadiana expone
  productos WooCommerce de demostración ajenos al pistacho; San Antonio Abad
  muestra «No se encontraron productos»; Obrador La Panadería anuncia
  «Próximamente» y la tienda embebida de Virgen del Campo falla. Todos siguen
  `no comprobado`.

## JA-14 — Ola 3: residual y saneamiento de fichas

Decisiones cerradas el 2026-07-31 sobre las 70 filas pendientes tras JA-13:
**2 pasan a `sí`, 10 a `no` y 58 permanecen `no comprobado`**.

- **Ajos El Nene** publica un procedimiento para solicitar presupuesto de sus
  productos por teléfono o correo; se acreditan ambos canales y se incorpora
  el correo comercial.
- **Stevia del Condado** publica pedidos mínimos, precios y condiciones a
  través del departamento comercial; se acreditan email y teléfono.
- Los diez `no` proceden de canales oficiales vivos revisados sin compra ni
  instrucciones de pedido: Anabella, San Antonio Abad, Olivar de Castro, Santo
  Reino/Grupo Apex, Diego Angulo, Panadería Ortega, Torrefrío, Panadería La
  Plaza, Bioandalus y Levasa.
- Tiendas temporalmente indisponibles, dominios con fallo técnico y reventa
  independiente siguen en `no comprobado`, conforme a la política editorial.

Mejoras editoriales asociadas:

- **Stevia del Condado** producía una mezcla entre domicilio fiscal y fábrica:
  las instalaciones de producción y envasado están en Santisteban del Puerto,
  no en Navas de San Juan. Se corrigen slug, municipio, dirección, mapa,
  horario, contacto, gama y descripción, con `merge` trazable.
- **Aceite Diego Angulo** sitúa sus fincas Cerro Palomino y Artesones en
  Villanueva de la Reina, no en Lahiguera. Se corrigen slug, municipio,
  dirección, mapa y descripción, dejando `merge` desde la URL antigua.
- Se resumen descripciones desproporcionadas y se precisan productos de
  Esencia Andalusí, Productos Mata, Productos Campos, Bigopan, Anabella,
  Obrador La Panadería, Salinas Don Diego, La Plaza y otros obradores.
- Chocolivate queda descrito como obrador de chocolate artesano con aceite de
  oliva, respaldado por Degusta Jaén y su presencia en la feria de 2026. Sigue
  `parcial` y con venta no comprobada por falta de canal primario.
- `plantilla-cruzada` baja de 7 a 0. También se eliminan las dos descripciones
  duplicadas detectadas en Panadería Medina y Panadería Panciencia; solo queda
  el geo-warning histórico y documentado de MO Molina Olivares.

Estado tras JA-14: **185 filas**; **0 `pendiente`, 38 `parcial`, 147
`verificado`**. Venta online: **116 `sí`, 11 `no`, 58 `no comprobado`**.
Evidencia acumulada: **185 `keep` y 4 `merge`**.
