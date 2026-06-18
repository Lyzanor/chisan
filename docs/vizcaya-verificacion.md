# Verificación provincial de Vizcaya

Ledger inicial para planificar y reanudar la revisión profunda de
`data/csv/pais-vasco/vizcaya.csv`. El CSV es la fuente de verdad. La evidencia
estructurada por fila debe vivir en `data/evidence/pais-vasco/vizcaya.jsonl` a
medida que se revise cada lote.

## Estado

- Inicio: 2026-06-16.
- Snapshot inicial: 188 filas; 0 `verificado`, 84 `parcial`, 104 `pendiente`.
- Venta online inicial: 32 `sí`, 24 `no`, 132 `no comprobado`.
- `Canal de venta`: 0/188 filas informado. Las 32 filas con
  `Venta online=sí` deben reauditarse y quedar con canal (`ecommerce`,
  `whatsapp`, `email`, `telefono`, `suscripcion` o `marketplace`) o corregirse.
- Imágenes: 51/188 filas con `imagen`, 137 sin imagen. Revisar imágenes después
  de estabilizar identidad y `slug`.
- Evidencia inicial: no existe `data/evidence/pais-vasco/vizcaya.jsonl` y
  Vizcaya no está en cobertura estricta (`data/evidence/coverage.json` solo
  incluye `pais-vasco/alava`).
- Tras el lote 1: 185 filas; 12 `verificado`, 97 `parcial`, 76 `pendiente`.
  Venta online: 35 `sí`, 26 `no`, 124 `no comprobado`; 3 filas con canal.
  `data/evidence/pais-vasco/vizcaya.jsonl` tiene 25 registros `keep`, 2
  `merge` y 1 `purge`.
- Tras el lote 2: 185 filas; 16 `verificado`, 93 `parcial`, 76 `pendiente`.
  Venta online: 35 `sí`, 29 `no`, 121 `no comprobado`; 4 filas con canal.
  `data/evidence/pais-vasco/vizcaya.jsonl` tiene 30 registros `keep`, 2
  `merge` y 1 `purge`.
- Tras los lotes 3-6: 181 filas; 55 `verificado`, 78 `parcial`, 48
  `pendiente`. Venta online: 49 `sí`, 38 `no`, 94 `no comprobado`; 31 filas
  con canal. `data/evidence/pais-vasco/vizcaya.jsonl` tiene 84 registros
  `keep`, 2 `merge` y 5 `purge`.
- Modo: primera pasada profunda en curso. Lotes 1-12 cubren las 188 filas
  iniciales sin solaparse; el lote 13 es auditoría transversal de cierre.

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`. Cada lote debe
revisar identidad, actividad productora, municipio, enlaces conservados, venta
online y canal; editar solo sus filas; añadir evidencia JSONL para decisiones
materiales; y cerrar con `npx pnpm verify:data`.

## Reglas duras para Vizcaya

1. No promover automáticamente las 84 filas `parcial`: no hay ninguna fila
   `verificado`, por lo que toda la provincia requiere primera auditoría real.
2. Las 32 filas con `Venta online=sí` están en cuarentena editorial hasta
   confirmar un pedido remoto vigente y registrar `Canal de venta`.
3. En txakoli y sidra, separar productor/bodega o sidrería elaboradora de
   restaurante, experiencia turística, marca comercial o simple punto de venta.
4. En panaderías, pastelerías, dulces, cafés y charcutería, confirmar obrador o
   elaboración propia; una tienda, cafetería, carnicería o despacho no basta por
   sí solo.
5. En conservas, pescado y marisco, distinguir elaborador/conservera de
   distribuidor, pescadería o mayorista.
6. En huerta, fruta, huevos, miel, carne y lácteos, distinguir explotación o
   transformador de comercio local o marca sin producción verificable.
7. Un registro, consejo regulador, ruta turística o directorio sectorial
   confirma como máximo existencia o pertenencia sectorial. Para `verificado`
   hace falta fuente propia, perfil oficial, ficha individual fiable o presencia
   pública suficiente y actual.
8. Un sitio HTTP, certificado roto, timeout o bloqueo no prueba baja. Contrastar
   con búsqueda, perfil oficial, Maps, registro o fuente local antes de borrar
   web, venta o fila.
9. No añadir nuevos candidatos durante esta primera pasada salvo decisión
   explícita. Primero cerrar la calidad de las 188 filas heredadas.

## Flujo por lote

1. Antes de empezar:

   ```bash
   git status --short
   npx pnpm list:province vizcaya
   ```

2. Tomar el primer lote `⬜` de la worklist y listar sus filas:

   ```bash
   python3 - <<'PY'
   import csv

   PATH = "data/csv/pais-vasco/vizcaya.csv"
   CATS = {"Lácteos y quesos"}  # ajustar por lote
   rows = list(csv.DictReader(open(PATH, encoding="utf-8", newline="")))
   sel = [r for r in rows if r["categoria"] in CATS]
   sel.sort(key=lambda r: (
       r["verificacion"] != "pendiente",
       r["verificacion"] != "parcial",
       r["Venta online"] != "sí",
       r["web"] == "",
       r["slug"],
   ))
   for r in sel:
       print(
           r["slug"], "|", r["verificacion"], "| VO=", r["Venta online"],
           "|", r["municipio"], "| web=", bool(r["web"]),
           "| ig=", bool(r["Instagram"]), "| maps=", bool(r["Google Maps"])
       )
   PY
   ```

3. Priorizar dentro del lote: `pendiente`, luego `parcial`, luego
   `Venta online=sí`, luego filas con web/red/Maps dudosos.
4. Investigar hasta evidencia suficiente. No recopilar datos opcionales si no
   cambian la decisión.
5. Editar quirúrgicamente el CSV con parser, preservando LF y tocando solo los
   `slug` del lote.
6. Crear o actualizar una línea en `data/evidence/pais-vasco/vizcaya.jsonl`
   para cada fila con alta de evidencia, cambio de `verificacion`, cambio de
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

- Txakoli de Bizkaia: Consejo Regulador de la DOP Bizkaiko Txakolina y listados
  de bodegas (`https://bizkaikotxakolina.eus/`).
- Quesos: DOP Idiazabal (`https://www.quesoidiazabal.eus/`) y Artzai Gazta
  (`https://www.artzai-gazta.eus/es/`).
- Calidad vasca: Eusko Label / HAZI para carne, huevos, miel, leche, huerta y
  productos transformados (`https://euskolabel.hazi.eus/es/nuestros-productos/`).
- Ecológico: Ekolurra/ENEEK y su censo de operadoras (`https://ekolurra.eus/es/`);
  REGOE estatal (`https://www.mapa.gob.es/es/alimentacion/temas/produccion-eco/regoe`).
- Sidra: Euskal Sagardoa, Sagardoa Route y fuentes propias de cada sidrería.
- Conservas y pesca: webs propias, asociaciones conserveras, directorios
  empresariales solo como apoyo y fichas oficiales de industria cuando ayuden a
  confirmar elaboración.
- Contexto local secundario: Bizkaia Turismo, ayuntamientos, comarcas,
  mercados de productores, Slow Food Bilbao-Bizkaia y prensa local reciente.

## Worklist inicial

Leyenda: `⬜` pendiente, `🟨` en curso, `✅` hecho. Los lotes 1-12 cubren las
188 filas sin solaparse. El lote 13 puede revisar filas ya tocadas.

| # | Lote | Filas | Pend. | Parcial | Verif. | VO=sí | Estado | Notas iniciales |
|---|---|---:|---:|---:|---:|---:|---|---|
| 1 | Lácteos y quesos pendientes | 28 | 28 | 0 | 0 | 0 | ✅ | 2026-06-16: 12 `verificado`, 13 `parcial`, 2 merge y 1 purga; 3 ventas remotas con canal. Se blanquea el dominio secuestrado de Vista Alegre y se retiran duplicados Kerixara/Santamañe/Gallastegi. |
| 2 | Lácteos y quesos parciales | 5 | 0 | 5 | 0 | 1 | ✅ | 2026-06-18: 4 pasan a `verificado`, `unzalu-ingunza-abadino` queda `parcial`; `biribil-brothers-bilbao` conserva venta remota por email/teléfono y `granja-murrieta-galdames` pasa a `no` porque la tienda sigue sin checkout. |
| 3 | Bodegas pendientes | 16 | 16 | 0 | 0 | 1 | ✅ | 2026-06-18: 12 `verificado`, 4 `parcial`; 10 ventas remotas con canal. Uriondo y Amunategi quedan parciales por depender de DOP/directorio sin fuente propia activa. |
| 4 | Bodegas parciales y vermut | 15 | 0 | 15 | 0 | 4 | ✅ | 2026-06-18: 9 `verificado`, 6 `parcial`; se reauditan todos los `sí`. Lvre Wines actualiza Bizkai Barne y Lapazaran pasa de Durango a Muxika. |
| 5 | Sidra | 8 | 0 | 8 | 0 | 2 | ✅ | 2026-06-18: 3 `verificado`, 5 `parcial`; Etxerriaga baja a `no` porque la tienda heredada no tiene checkout de producto. |
| 6 | Pescado y conservas | 19 | 12 | 7 | 0 | 6 | ✅ | 2026-06-18: 14 `verificado`, 1 `parcial`, 4 purgas por no productor; 11 ventas online con canal. |
| 7 | Pan y pastelería | 17 | 10 | 7 | 0 | 2 | ⬜ | Confirmar obrador propio y venta remota; cuidado con panaderías/despachos sin producción verificable. |
| 8 | Dulces | 19 | 10 | 9 | 0 | 3 | ⬜ | Bilbao concentra muchas filas; verificar continuidad, obrador y canales en pastelerías, heladerías y turronerías. |
| 9 | Fruta, verdura y legumbres | 17 | 5 | 12 | 0 | 6 | ⬜ | Revisar explotación propia, ecológico/Eusko Label, cestas o marketplace. Incluye `legumbres-guillermo-mungia`. |
| 10 | Miel, huevos y caracoles | 15 | 6 | 9 | 0 | 2 | ⬜ | Fuentes sectoriales pueden dejar residuales `parcial`; comprobar canales directos antes de mantener `sí` o `no`. |
| 11 | Charcutería y despensa artesanal | 14 | 8 | 6 | 0 | 3 | ⬜ | Riesgo alto de comercios o restauración. Confirmar elaboración propia, obrador, matadero o producto transformado. |
| 12 | Cerveza, café, destilados y licores | 15 | 9 | 6 | 0 | 2 | ⬜ | Cerveceras, tostadores y destilería: revisar producción local y si la tienda vende producto, no solo hostelería o eventos. |
| 13 | Cierre transversal provincial | 188 | 104 | 84 | 0 | 32 | ⬜ | Revisar residuales `parcial`, todos los `Venta online=sí`, canales, duplicados, imágenes, evidencia y posible cobertura estricta. |

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
- Las purgas/fusiones tienen registro JSONL tipo `purge` o `merge` y, si había
  imagen, se elimina la imagen referenciada.
- `npx pnpm verify:data` pasa antes de dar por cerrado cualquier lote y antes
  del cierre provincial.

## Decisiones que deben quedar especialmente anotadas

- Promociones desde registro sectorial a `verificado`: explicar qué fuente
  propia o ficha real supera el techo de `parcial`.
- Cualquier productor sin web propia que quede `verificado`: indicar la fuente
  verificadora concreta.
- Bodegas o sidrerías con tienda de experiencias o reservas, pero sin venta de
  producto: no contar como `Venta online=sí`.
- Obradores, panaderías, pastelerías, cafeterías, carnicerías y pescaderías:
  documentar por qué son elaboradores/productores dentro de alcance.
- Cambios de `Venta online=sí` heredado a `no` o `no comprobado`.
- Purgas por no productor, cierre, duplicado, otra provincia o entidad sin
  rastro suficiente.

## Lote 1: lácteos y quesos pendientes

Revisado el 2026-06-16 mediante webs propias, perfiles oficiales, Artzai Gazta,
DOP Idiazabal, Esnekigileak, directorios municipales/comarcales, marketplaces y
fuentes recientes cuando había riesgo de baja o duplicidad.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `mantequerias-santi-zamudio`, `queseria-lusuri-orozko` |
| `verificado`, venta por `telefono` | `vascolac-zamudio` |
| `verificado`, venta `no` | `santana-esnekiak-kortezubi`, `askibil-igorre` |
| `verificado`, venta `no comprobado` | `bizkaia-esnea-karrantza`, `lacteas-karrantza-ambasaguas`, `quesos-amalur-karrantza`, `larruz-markina-xemein`, `txikinena-berriatua`, `isusi-anaiak-guenes`, `onandi-mallabia` |
| `parcial`, venta `no comprobado` | `vista-alegre-baserria-karrantza`, `baskaran-barinako-esnekixek-markina-xemein`, `barroeta-gazta-markina-xemein`, `quesos-malatsa-orozko`, `errotik-amorebieta-etxano`, `queso-padilla-otxandio`, `otxauntz-otxandio`, `queseria-ipinaburu-zeanuri`, `txonde-areatza`, `ulibarri-artzaiak-gordexola`, `altunosteko-gaztaitegia-zeanuri`, `mugarra-izurtza`, `queseria-azkueta-zeberio` |
| `merge` | `santamane-elkartea-s-l-markina-xemein` → `baskaran-barinako-esnekixek-markina-xemein`; `queseria-gallastegi-mallabia` → `onandi-mallabia` |
| `purge` | `kerixara-otxandio` por otra provincia; la ficha alavesa `quesos-kerixara-oleta` ya existe. |

### Excepciones

- `vista-alegre-baserria-karrantza`: el dominio heredado responde con contenido
  ajeno de casino y se elimina del CSV. Ekolurra publicó en noviembre de 2024
  que Vista Alegre ya no gestiona la quesería, aunque la granja ecológica sigue
  activa; queda `parcial` hasta aclarar la marca/elaborador actual.
- `kerixara-otxandio`: tienda oficial y Artzai Gazta sitúan Kerixara en Oleta,
  Araba. Se elimina de Vizcaya como `other-province` sin tocar la fila de
  Álava.
- `santamane-elkartea-s-l-markina-xemein`: duplicaba Baskaran/Santamañe. Se
  conserva el slug con datos más completos de Baskaran y queda como `parcial`
  por falta de fuente propia.
- `queseria-gallastegi-mallabia`: duplicaba Onandi/Gallastegi Agirrebeitia.
  Se fusiona en `onandi-mallabia`.
- `askibil-igorre`, `queseria-lusuri-orozko`, `txikinena-berriatua`,
  `isusi-anaiak-guenes` y `onandi-mallabia` quedan con coordenada provisional
  de centroide municipal porque no se localizó un punto exacto defendible en
  fuente pública.
- `mantequerias-santi-zamudio` se marca con venta por `ecommerce` porque su
  tienda propia mantiene categorías y carrito. `queseria-lusuri-orozko` pasa a
  venta por `ecommerce` por tienda WooCommerce propia.
- `vascolac-zamudio` se marca con venta por `telefono`: la web publica teléfono
  de pedidos para canal HORECA. Revisar en cierre si se quiere separar venta
  remota B2B de venta directa a consumidor.

## Lote 2: lácteos y quesos parciales

Revisado el 2026-06-18 con webs propias, páginas de producto/contacto,
Artzai Gazta, DOP Idiazabal, Esnekigileak y directorios comarcales.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `email|telefono` | `biribil-brothers-bilbao` |
| `verificado`, venta `no` | `bizkaigane-elkartea-errigoiti`, `queseria-anbe-abadino`, `granja-murrieta-galdames` |
| `parcial`, venta `no` | `unzalu-ingunza-abadino` |

### Excepciones

- `queseria-anbe-abadino`: se conserva el slug público, pero el nombre visible
  pasa a `Urien-Anbe`; se reemplaza el dominio heredado sin resolver por la web
  oficial `urienanbe.com`.
- `unzalu-ingunza-abadino`: queda `parcial` porque no se localizó fuente propia.
  Artzai Gazta, Idiazabal y Durangaldea confirman Txori Errota, dirección y
  contacto. La ficha de Idiazabal se retira del campo `web` y queda en
  evidencia.
- `granja-murrieta-galdames`: se marca `verificado`, pero `Venta online=no`;
  aunque las páginas de producto apuntan a compra, `/tienda/` indica que la
  tienda online todavía está en preparación y no hay checkout activo.
- `biribil-brothers-bilbao`: se mantiene `Venta online=sí` por pedido remoto
  vía formulario/email/teléfono. No se marca `ecommerce`.

## Lote 3: bodegas pendientes

Revisado el 2026-06-18 con webs propias, tiendas oficiales, DOP Bizkaiko
Txakolina, perfiles oficiales y páginas de pedido cuando existían.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `doniene-gorrondona-bakio`, `bodegas-itsasmendi-gernika-lumo`, `gorka-izagirre-larrabetzu`, `bodega-berroja-muxika`, `magalarte-lezama-txakolina-lezama`, `magalarte-zamudio-txakolina-zamudio`, `bodega-talleri-berria-morga`, `txakoli-arritxola-durango`, `txakoli-galanta-galdakao` |
| `verificado`, venta por `email|telefono` | `txakoli-butroi-gatika`, `zabala-txakolina-bakio` |
| `verificado`, venta `no` | `txa-txabarri-zalla`, `virgen-de-lorea-zalla` |
| `verificado`, venta `no comprobado` | `ugabe-txakoli-artea` |
| `parcial`, venta `no comprobado` | `amunategi-txakolina-busturia`, `bodega-uriondo-zaratamo` |

### Excepciones

- `virgen-de-lorea-zalla`: se actualiza el nombre visible a
  `Otxaran - Bodegas Virgen de Lorea` y la web a `otxaran.com`; la tienda no
  está activa, así que queda `Venta online=no`.
- `txakoli-butroi-gatika` y `zabala-txakolina-bakio`: tienen pedido remoto por
  formulario/contacto, no carrito. Se registran como `email|telefono`.
- `txakoli-galanta-galdakao`: mantiene `ecommerce|whatsapp` porque la web
  conserva tienda online y también publica pedidos por WhatsApp.
- `ugabe-txakoli-artea`: se promueve a `verificado` por perfil oficial y DOP,
  pero queda sin venta remota comprobada.
- `amunategi-txakolina-busturia` y `bodega-uriondo-zaratamo`: quedan
  `parcial` por depender de DOP/directorio sin fuente propia activa suficiente.

## Lote 4: bodegas parciales y vermut

Revisado el 2026-06-18 reauditaron todos los `Venta online=sí` heredados y los
casos con identidad antigua o web de directorio.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `bodega-gure-ahaleginak-orduna`, `vina-sulibarria-galdames`, `hasi-berriak-ibarrangelu` |
| `verificado`, venta por `marketplace|telefono|email` | `vermut-txurrut-sopuerta` |
| `verificado`, venta `no` | `erdikoetxe-lezama`, `garena-txakolina-dima`, `ados-basarte-bakio`, `txakoli-uriarte-gamiz-fika` |
| `parcial`, venta `no` | `abio-txakolina-bakio`, `bodega-elizalde-mendraka-elorrio`, `bodega-merrutxu-ibarrangelu` |
| `parcial`, venta `no comprobado` | `bodega-bikandi-durango`, `bodega-bizkai-barne-orozko`, `bodegas-lapazaran-durango`, `txakoli-sasines-larrabetzu` |

### Excepciones

- `bodega-bizkai-barne-orozko`: el consejo regulador redirige la ficha antigua
  a `Lvre Wines`. Se actualiza nombre, web y contacto, manteniendo el slug
  estable.
- `bodegas-lapazaran-durango`: el municipio heredado era incorrecto; se corrige
  a `Muxika` y se conserva el slug por estabilidad pública.
- `bodega-bikandi-durango` y `bodegas-lapazaran-durango`: las webs propias
  fallaron durante la revisión, pero no se borran por ese motivo; quedan
  `parcial` con fuente reguladora.
- `txakoli-sasines-larrabetzu`: queda pendiente de una revisión específica de
  posible relación con Butroi. No se fusiona sin evidencia directa.
- `vermut-txurrut-sopuerta`: se trata como elaborador de vermut. La venta se
  acredita por marketplace Enkartur y contacto directo, no por tienda propia.

## Lote 5: sidra

Revisado el 2026-06-18 separando elaboración propia de reservas de sidrería o
experiencias de mesa.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `axpe-sagardotegia-markina-xemein` |
| `verificado`, venta `no` | `uxarte-sagardotegia-amorebieta-etxano`, `etxerriaga-sagardotegia-amorebieta-etxano` |
| `parcial`, venta `no` | `eguskiza-sagardotegia-gatika`, `etxebarria-sagardoa-gatika`, `kandi-sagardoa-muxika`, `laka-erdi-sagardoa-berriatua`, `sebastianeko-sagardoa-mendexa` |

### Excepciones

- `etxerriaga-sagardotegia-amorebieta-etxano`: se corrige `Venta online=sí` a
  `no`; la navegación heredada de tienda no ofrecía checkout de producto.
- `uxarte-sagardotegia-amorebieta-etxano`: la web propia confirma sidra
  elaborada allí, pero las reservas de mesa no cuentan como venta online.
- `eguskiza-sagardotegia-gatika`, `etxebarria-sagardoa-gatika`,
  `kandi-sagardoa-muxika`, `laka-erdi-sagardoa-berriatua` y
  `sebastianeko-sagardoa-mendexa` quedan `parcial` porque la fuente disponible
  es directorio sectorial, no fuente propia.

## Lote 6: pescado y conservas

Revisado el 2026-06-18 priorizando Bermeo, Berriatua, Ondarroa y el riesgo de
confundir conservera con pescadería, mayorista o distribuidor.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `conservas-zallo-bermeo`, `conservas-serrats-bermeo`, `conservas-ortiz-ondarroa`, `conservas-aguirreoa-berriatua`, `conservas-olasagasti-markina-xemein`, `conservas-campos-bermeo`, `conservas-arroyabe-bermeo`, `anchoas-royo-bermeo`, `conservas-cusumano-mundaka`, `urdaibai-kontserbak-bermeo` |
| `verificado`, venta por `email|telefono` | `karmelo-toja-bermeo` |
| `verificado`, venta `no` | `keia-ahumados-artesanos-galdakao`, `heisa-berriatua`, `conservas-alegria-berriatua` |
| `parcial`, venta `no comprobado` | `mar-mar-berriatua` |
| `purge` | `pescados-gaizka-basauri`, `pescados-triana-basauri`, `mariscos-ansomar-derio`, `perez-vinas-ortuella` |

### Excepciones

- `pescados-gaizka-basauri`, `pescados-triana-basauri`,
  `mariscos-ansomar-derio` y `perez-vinas-ortuella` se eliminan por
  `not-producer`: las fuentes los sitúan como pescadería, mayorista,
  importador/distribuidor o distribuidor de congelados, no como elaboradores en
  alcance.
- `mar-mar-berriatua`: la web propia está en construcción y solo confirma
  contacto; directorios empresariales apoyan la actividad conservera, así que
  queda `parcial`.
- `conservas-alegria-berriatua`: se corrige `Venta online=sí` a `no`; la web
  confirma conservera, pero no se localizó checkout ni pedido remoto vigente.
- `karmelo-toja-bermeo`: conserva venta remota por formulario/contacto y se
  registra como `email|telefono`, no `ecommerce`.
