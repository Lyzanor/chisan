# Verificación provincial de Navarra

Ledger inicial para planificar y reanudar la revisión profunda de
`data/csv/navarra/navarra.csv`. El CSV es la fuente de verdad. La evidencia
estructurada por fila debe vivir en `data/evidence/navarra/navarra.jsonl` a
medida que se revise cada lote.

## Estado

- Inicio: 2026-06-19.
- Snapshot inicial: 274 filas; 0 `verificado`, 106 `parcial`,
  168 `pendiente`.
- Venta online inicial: 57 `sí`, 0 `no`, 217 `no comprobado`.
- `Canal de venta`: 0/274 filas informado. Las 57 filas con
  `Venta online=sí` deben reauditarse y quedar con canal (`ecommerce`,
  `whatsapp`, `email`, `telefono`, `suscripcion` o `marketplace`) o corregirse.
- Imágenes: 220/274 filas con `imagen`, 54 sin imagen. Hay archivos en
  `public/productores/navarra/` y en `public/productores/navarra/navarra/`; no
  revisar ni enriquecer imágenes hasta estabilizar identidad, `slug` y purgas.
- Evidencia inicial: no existe `data/evidence/navarra/navarra.jsonl` y Navarra
  no está en cobertura estricta (`data/evidence/coverage.json` contiene Álava,
  Vizcaya, Guipúzcoa y La Rioja).
- Modo: primera pasada profunda pendiente. Prioridad: cerrar calidad de las 274
  filas heredadas antes de añadir candidatos nuevos.
- Tras el lote 1: 273 filas; 15 `verificado`, 117 `parcial`, 141
  `pendiente`. Venta online: 66 `sí`, 1 `no`, 206 `no comprobado`; 9 filas con
  canal. `data/evidence/navarra/navarra.jsonl` tiene 26 registros `keep` y 1
  `merge`.
- Tras los lotes 2-5: 271 filas; 87 `verificado`, 95 `parcial`, 89
  `pendiente`. Venta online: 79 `sí`, 1 `no`, 191 `no comprobado`; 52 filas
  con canal. La evidencia de Navarra tiene 128 registros. Lácteos queda sin
  pendientes (41 `verificado`, 32 `parcial`); bodegas queda en 29 `verificado`
  y 1 `parcial`; bebidas y cerveza quedan en 16 `verificado` y 5 `parcial`.
- Tras los lotes 6-9: 271 filas; 138 `verificado`, 94 `parcial`, 39
  `pendiente`. Venta online: 88 `sí`, 1 `no`, 182 `no comprobado`; 78 filas
  con canal. La evidencia de Navarra tiene 211 registros. Quedan cerradas sin
  pendientes conservas, encurtidos, condimentos, mermeladas, aceite, frutos
  secos, fruta y verdura, legumbres/cereales, huevos revisados y otros.
- Tras los lotes 10-11: 271 filas; 160 `verificado`, 111 `parcial`, 0
  `pendiente`. Venta online: 96 `sí`, 1 `no`, 174 `no comprobado`; 90 filas
  con canal. La evidencia de Navarra tiene 260 registros. Carne, charcutería y
  miel quedan cerradas sin pendientes; los residuales `parcial` son
  principalmente productores personales/directorios sin fuente propia fuerte o
  entidades con alcance asociativo.
- Tras el lote 12: 271 filas; 174 `verificado`, 97 `parcial`, 0
  `pendiente`. Venta online: 98 `sí`, 1 `no`, 172 `no comprobado`; las 98
  filas con venta remota tienen canal. La evidencia de Navarra tiene 274
  registros. Panadería, pastelería y dulces quedan sin pendientes: se corrigen
  a `Dulces` Garrarte y El Caserío, se normalizan webs en Chocolates Subiza y
  Heladería Nalia, y Pedro Mayo baja a `no comprobado` al no verse compra
  directa activa.
- Tras el lote 13: 271 filas; 174 `verificado`, 97 `parcial`, 0
  `pendiente`. Venta online: 98 `sí`, 1 `no`, 172 `no comprobado`; las 98
  filas con venta remota tienen canal. Las 271 filas activas tienen evidencia
  `keep` y el ledger conserva 3 tombstones de fusión/purga. Navarra queda en
  cobertura estricta. El cierre corrige dos place IDs heredados que apuntaban a
  municipios ajenos, añade el override de Artieda navarro, completa direcciones
  o contactos de varios parciales y deja los avisos residuales como brechas
  opcionales no bloqueantes.

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`. Cada lote debe
revisar identidad, actividad productora, municipio, enlaces conservados, venta
online y canal; editar solo sus filas; añadir evidencia JSONL para decisiones
materiales; y cerrar con `npx pnpm verify:data`.

## Reglas duras para Navarra

1. No promocionar automáticamente las 106 filas `parcial`: la provincia no tiene
   ninguna fila `verificado`, por lo que todo requiere primera auditoría real.
2. Las 57 filas con `Venta online=sí` están en cuarentena editorial hasta
   confirmar un pedido remoto vigente y registrar `Canal de venta`.
3. En quesos y lácteos, distinguir quesería/ganadería elaboradora de registro
   DOP, marca comercial, tienda o distribuidor. DOP Roncal, DOP Idiazabal,
   Artzai Gazta o registros artesanos apoyan existencia, pero no sustituyen una
   fuente propia o ficha individual suficiente para `verificado`.
4. En bodegas, separar productor/bodega de enoturismo, restaurante, wine bar,
   marca de grupo o simple punto de venta. Una tienda de visitas o experiencias
   no prueba venta online de producto.
5. En pacharán, licores, sidra y cerveza, confirmar elaborador real y canal de
   pedido; no confundir distribuidor, grupo industrial o evento turístico con
   productor local verificable.
6. En conservas, aceite, fruta, verdura, frutos secos, miel y legumbres,
   distinguir explotación o transformador de cooperativa genérica, mayorista,
   comercializadora o marca sin producción demostrable en Navarra.
7. En carnicerías, charcutería y carne, documentar por qué la entidad elabora o
   cría. Una tienda o carnicería solo entra si hay elaboración propia o unidad
   productiva dentro de alcance.
8. Revisar con especial cuidado municipios bilingües, entidades singulares y
   grafías heredadas (`Pamplona / Iruña`, `Olite / Erriberri`,
   `Puente la Reina / Gares`, mayúsculas o variantes). Corregir solo con fuente
   fiable y mantener el control de centroides.
9. Un sitio HTTP, certificado roto, timeout o bloqueo no prueba baja. Contrastar
   con búsqueda, perfil oficial, Maps, registro o fuente local antes de borrar
   web, venta o fila.
10. No añadir nuevos candidatos durante esta primera pasada salvo decisión
    explícita. Primero cerrar la calidad de las 274 filas heredadas.

## Flujo por lote

1. Antes de empezar:

   ```bash
   git status --short
   npx pnpm list:province navarra
   ```

2. Tomar el primer lote `⬜` de la worklist y listar sus filas. Para los tres
   lotes de lácteos, congelar primero los `slug` por orden actual de la
   categoría; para el resto basta el filtro por categoría/estado indicado:

   ```bash
   node --input-type=module - <<'JS'
   import fs from "node:fs";
   import { parse } from "csv-parse/sync";

   const PATH = "data/csv/navarra/navarra.csv";
   const CATS = new Set(["Lácteos y quesos"]); // ajustar por lote
   const rows = parse(fs.readFileSync(PATH, "utf8"), {
     columns: true,
     skip_empty_lines: true,
   });

   const sel = rows.filter((r) => CATS.has(r.categoria));
   sel.sort((a, b) => (
     (a.verificacion !== "pendiente") - (b.verificacion !== "pendiente") ||
     (a.verificacion !== "parcial") - (b.verificacion !== "parcial") ||
     (a["Venta online"] !== "sí") - (b["Venta online"] !== "sí") ||
     (a.web === "") - (b.web === "") ||
     a.slug.localeCompare(b.slug, "es")
   ));

   for (const r of sel) {
     console.log(
       r.slug, "|", r.verificacion, "| VO=", r["Venta online"],
       "|", r.municipio, "| web=", Boolean(r.web),
       "| ig=", Boolean(r.Instagram), "| maps=", Boolean(r["Google Maps"])
     );
   }
   JS
   ```

3. Priorizar dentro del lote: `pendiente`, luego `parcial`, luego
   `Venta online=sí`, luego filas con web/red/Maps dudosos.
4. Investigar hasta evidencia suficiente. No recopilar datos opcionales si no
   cambian la decisión.
5. Editar quirúrgicamente el CSV con parser, preservando LF y tocando solo los
   `slug` del lote.
6. Crear o actualizar una línea en `data/evidence/navarra/navarra.jsonl` para
   cada fila con alta de evidencia, cambio de `verificacion`, cambio de
   `Venta online`, canal, purga o fusión.
7. Validar durante la iteración:

   ```bash
   npx pnpm check:csv:changed
   npx pnpm check:evidence:changed
   ```

8. Al cerrar el lote:

   ```bash
   npx pnpm verify:data
   ```

9. Actualizar este ledger: snapshot si cambia, estado del lote, fecha y una
   nota corta con verificadas, parciales, purgas/fusiones y residuales.

## Fuentes de cotejo iniciales

Estas fuentes orientan la búsqueda, pero no sustituyen la comprobación de una
fuente propia o ficha real cuando la decisión sea `verificado`.

- Calidad Navarra: Reyno Gourmet / INTIA, Alimentos Artesanos de Navarra,
  registros de empresas adheridas y fichas sectoriales.
- Ecológico: CPAEN/NNPEK, Navarra Ecológica y REGOE estatal.
- Quesos: DOP Queso Roncal, DOP Idiazabal, Artzai Gazta, asociaciones
  queseras y fuentes propias de cada quesería.
- Bodegas: DOP Navarra, DOCa Rioja cuando corresponda a zona navarra, Vinos de
  Pago, rutas de vino como apoyo secundario y webs propias de bodega.
- Conservas y verduras: IGP Espárrago de Navarra, DOP Pimiento del Piquillo de
  Lodosa, IGP Alcachofa de Tudela, productores de conservas y fichas propias.
- Aceite, frutos secos y condimentos: DOP Aceite de Navarra, trujales,
  cooperativas, registros de calidad y fuentes propias.
- Bebidas: IGP Pacharán Navarro, elaboradores de licores, sidrerías navarras,
  cerveceras con obrador propio y fichas oficiales o propias.
- Carne y charcutería: IGP Ternera de Navarra, IGP Chistorra de Navarra,
  explotaciones, obradores y carnicerías con elaboración propia demostrada.
- Contexto local secundario: ayuntamientos, comarcas, turismo de Navarra,
  mercados de productores, prensa local reciente y directorios sectoriales
  solo como apoyo.

## Worklist inicial

Leyenda: `⬜` pendiente, `🟨` en curso, `✅` hecho. Los lotes 1-12 cubren el
snapshot inicial de 274 filas sin solaparse. Si un lote fusiona o purga filas,
recalcular los siguientes bloques antes de iniciarlos. El lote 13 es una
auditoría transversal de cierre y puede revisar filas ya tocadas.

| # | Lote | Filas | Pend. | Parcial | Verif. | VO=sí | Estado | Notas iniciales |
|---|---|---:|---:|---:|---:|---:|---|---|
| 1 | Lácteos y quesos I | 26 | 26 | 0 | 0 | 0 | ✅ | 2026-06-19: 14 filas del bloque pasan a `verificado`, 11 a `parcial` y `queseria-autxitxia-elizondo` se fusiona en `queseria-tienda-autxitxia-elizondo`, que queda `verificado`. Se resuelven 9 ventas remotas con canal, Pirineki queda `Venta online=no`, y se retiran enlaces no oficiales o dudosos en Larramendi, Txantrea, Granja El Moro, Aztal y Señorena. |
| 2 | Lácteos y quesos II | 25 | 25 | 0 | 0 | 0 | ✅ | 2026-06-20: bloque cerrado sin pendientes. Larrezabal, Aldaia, Sustrai, Las Tres Sierras, Etxelekua y Ardiarana quedan `verificado` con venta remota y canal cuando procede; Agotzaina pasa a `Huevos`; varios productores quedan `parcial` por techo de directorio, Maps o ausencia de fuente propia; se retiran webs muertas o ajenas. |
| 3 | Lácteos y quesos III y parciales | 26 | 22 | 4 | 0 | 1 | ✅ | 2026-06-20: bloque cerrado sin pendientes. Enaquesa, Dorrea, Kaiolar, Ekia, Larra, Valle del Baztán, Poxtiñenea, Legarra, Goshua, Postres Ultzama, Jeingenekoa, Mikaela, Kamiku y Biointegra quedan `verificado`; Kabila Enea se purga por no productor; Kortaria se fusiona con Infernuko Gasna; Biointegra se corrige a Roncesvalles. |
| 4 | Bodegas | 27 | 0 | 27 | 0 | 21 | ✅ | 2026-06-20: 29/30 bodegas quedan `verificado` y Domaines Lupier queda `parcial`. Las 21 ventas remotas conservadas tienen canal `ecommerce`; se rebajan a `no comprobado` ventas no demostradas en webs de visita, catálogo o sin checkout claro. |
| 5 | Bebidas, sidra, pacharán, licores y cerveza | 24 | 6 | 18 | 0 | 8 | ✅ | 2026-06-20: bebidas y cerveza cerradas; quedan 13/17 `Bebidas` y 3/4 `Cerveza artesana` en `verificado`. Baines, Ordoki, Naparbier, Las Cadenas, La Navarra, Azanza, Usua y La Vasconia quedan con canal; Amatria, Biurko y Baztango Xurie pasan a `Bodega`; Ekosagar, Morlaco, Xorta y Martitxonea quedan parciales o con web rota/no oficial limpiada. |
| 6 | Conservas, encurtidos, condimentos y mermeladas | 21 | 2 | 19 | 0 | 10 | ✅ | 2026-06-20: bloque cerrado sin pendientes; quedan 19 `verificado` y 2 `parcial`. Se verifican todas las conservas y aceitunas/encurtidos con fuente propia; 12 ventas remotas quedan con canal. Casa Amézqueta y Mermeladas Irular quedan parciales por techo de directorio/registro y se limpian webs heredadas sin DNS. |
| 7 | Aceite y frutos secos | 16 | 10 | 6 | 0 | 5 | ✅ | 2026-06-20: bloque cerrado sin pendientes; quedan 12 `verificado` y 4 `parcial`. Artajo, Trujal Mendía, La Maja, Cooperativa de Ablitas, Urzante, Benitoren y Allotarra quedan con canal `ecommerce`; Mendiko se mantiene parcial por cruce aceite/bodega y Valle Arga queda `no comprobado` por stock agotado. |
| 8 | Fruta y verdura pendientes | 29 | 29 | 0 | 0 | 0 | ✅ | 2026-06-20: bloque cerrado sin pendientes; 12 `verificado` y 17 `parcial`. El Puente Viejo, Baratzan Blai y La Casa Arriba quedan con venta remota y canal; productores personales sin fuente propia fuerte quedan parciales con Localtokikoa/registro; se corrigen grafías de Puente la Reina y Villanueva de Aezkoa. |
| 9 | Fruta y verdura parciales, legumbres, cereales, huevos y otros | 18 | 9 | 8 | 0 | 2 | ✅ | 2026-06-20: bloque cerrado sin pendientes en el estado actual, con 9 `verificado` y 9 `parcial`. Incluye Agotzaina ya resuelta en lote 2; se verifican Elkea, Ecológicos Aranda, Artotxiki, La Mejor Cereza, Moreno Amatria, FHF, Castel-Ruiz y San Blas; Huevos Irulegi y Queen Country Hops quedan parciales por fuente de directorio. |
| 10 | Charcutería y carne | 30 | 24 | 6 | 0 | 2 | ✅ | 2026-06-21: bloque cerrado sin pendientes; quedan 12 `verificado` y 18 `parcial`. Beitikotx, Indakoa, Aralarko, San Miguel, Juan Flores, Iriguibel y Finca Sarbil quedan con venta remota y canal; Biga conserva evidencia por Facebook/Localtokikoa pero se limpia `bigaulzama.es` por dominio en venta; Zunbeltz queda parcial por alcance asociativo/test agrario. |
| 11 | Miel | 19 | 15 | 4 | 0 | 2 | ✅ | 2026-06-21: bloque cerrado sin pendientes; quedan 10 `verificado` y 9 `parcial`. Andiaga, Gorena, 111.44, Ezti Tanta y Baigorri quedan con venta remota y canal; Ezkurdi se corrige a `ezkurdi.com` tras detectar web heredada ajena; APIDENA/Erlekoi queda parcial y baja a `no comprobado` al no confirmarse pedido online directo. |
| 12 | Pan, pastelería y dulces | 14 | 0 | 14 | 0 | 6 | ✅ | 2026-06-21: bloque cerrado; 14/14 pasan a `verificado`. Se confirman canales en Pastas Beatriz, Garrarte, Casa Vidaurre, Pastelería Ángela, El Caserío, Casa Salinas, Regino Sola y Casa Urrutia; Malkorra, Pedro Mayo, Subiza, Ubagua, Lakabeko y Nalia quedan sin venta remota demostrada. |
| 13 | Cierre transversal provincial | 271 | 0 | 97 | 174 | 98 | ✅ | 2026-06-21: cierre final de la pasada. Se revisan duplicados aparentes, place IDs, municipios, canales y cobertura de evidencia; Ternera Ecológica de Petilla y David Azcona recuperan coordenadas coherentes con Sangüesa/Ancín, Baratzan Blai queda cubierto por override de Artieda navarro, y se completan direcciones/contactos en Cooperativa Santiago Apóstol, Anatxoenea, Xorta, Martitxonea y Elkarkide. Navarra entra en cobertura estricta con 271 `keep` y 3 tombstones. |

## Criterios de cierre de la pasada

- 0 filas `pendiente`, salvo que se documente una razón explícita para pausar
  la provincia antes de cierre.
- Cada residual `parcial` tiene motivo conocido y evidencia JSONL coherente.
- Cada `Venta online=sí` tiene `Canal de venta` y evidencia de pedido remoto
  vigente.
- Cada `Venta online=no` o `no comprobado` revisado tiene una razón clara en la
  evidencia o en la nota del lote cuando sea una excepción material.
- No quedan enlaces ajenos, dominios aparcados, fichas Maps genéricas usadas
  como prueba fuerte ni horarios que remitan a canales inexistentes.
- Las categorías quedan normalizadas al conjunto válido del contrato; cualquier
  etiqueta heredada dudosa se corrige o se documenta en el lote.
- Las purgas/fusiones tienen registro JSONL tipo `purge` o `merge` y, si había
  imagen, se elimina la imagen referenciada.
- Al final de la pasada, Navarra se añade a `data/evidence/coverage.json` solo
  cuando todas las filas conservadas tienen evidencia.
- `npx pnpm verify:data` pasa antes de dar por cerrado cualquier lote y antes
  del cierre provincial.

## Decisiones que deben quedar especialmente anotadas

- Promociones desde registro sectorial a `verificado`: explicar qué fuente
  propia o ficha real supera el techo de `parcial`.
- Cualquier productor sin web propia que quede `verificado`: indicar la fuente
  verificadora concreta.
- Bodegas, sidrerías, destilerías y cerveceras con reservas de visitas, pero
  sin venta de producto: no contar como `Venta online=sí`.
- Cooperativas, asociaciones, carnicerías, panaderías, pastelerías y tiendas:
  documentar por qué son productores/elaboradores dentro de alcance.
- Cambios de `Venta online=sí` heredado a `no` o `no comprobado`.
- Purgas por no productor, cierre, duplicado, otra provincia o entidad sin
  rastro suficiente.
- Imágenes heredadas que no sean logo/producto/local real de la entidad
  conservada; revisar después de estabilizar filas y antes de cobertura final.
