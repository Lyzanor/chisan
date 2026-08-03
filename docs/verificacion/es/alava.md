# Verificación provincial de Álava

Ledger inicial para planificar y reanudar la revisión profunda de
`data/csv/pais-vasco/alava.csv`. El CSV es la fuente de verdad. La evidencia
estructurada por fila debe vivir en `data/evidence/pais-vasco/alava.jsonl` a
medida que se revise cada lote.

## Estado

- Inicio: 2026-06-16.
- Snapshot inicial: 133 filas; 61 `verificado`, 8 `parcial`, 64 `pendiente`.
- Venta online inicial: 41 `sí`, 19 `no`, 73 `no comprobado`.
- `Canal de venta`: 0/133 filas informado. Las 41 filas con `Venta online=sí`
  deben reauditarse y quedar con canal (`ecommerce`, `whatsapp`, `email`,
  `telefono`, `suscripcion` o `marketplace`) o corregirse.
- Imágenes: 58/133 filas con `imagen`, 75 sin imagen. Revisar imágenes después
  de estabilizar identidad y `slug`.
- Evidencia inicial: no existía `data/evidence/pais-vasco/alava.jsonl` y
  Álava no estaba en cobertura estricta.
- Tras el lote 8 final: `data/evidence/pais-vasco/alava.jsonl` tiene 131
  registros `keep`, 1 `merge` y 1 `purge`. Álava queda añadida a cobertura
  estricta en `data/evidence/coverage.json`.
- Tras el lote 8 final: 131 filas; 108 `verificado`, 23 `parcial`,
  0 `pendiente`. Venta online: 81 `sí`, 15 `no`, 35 `no comprobado`;
  81 filas con canal.
- Modo: pasada provincial cerrada. Lotes 1-8 cerrados.

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`. Cada lote debe
revisar identidad, actividad productora, municipio, enlaces conservados, venta
online y canal; editar solo sus filas; añadir evidencia JSONL para decisiones
materiales; y cerrar con `npx pnpm verify:data`.

## Reglas duras para Álava

1. No dar por buenas las 61 filas `verificado` heredadas: se reauditan cuando
   llegue su lote o en el cierre transversal.
2. Una ficha de registro, consejo regulador o ruta turística confirma como
   máximo existencia o pertenencia sectorial. Para `verificado` hace falta
   fuente propia, Google Maps real, perfil oficial o marketplace vigente.
3. Las 41 filas con `Venta online=sí` no tienen canal. Hasta que se confirme un
   mecanismo de pedido remoto vigente, el `sí` queda en cuarentena editorial.
4. En lácteos, legumbres, huerta, huevos y carne, distinguir productor de
   tienda, carnicería o distribuidor. Revender producto local no basta.
5. En bodegas, separar bodega/productor de marca, distribuidora, wine bar,
   experiencia turística o restaurante.
6. Un sitio HTTP, certificado roto, timeout o bloqueo no prueba baja. Contrastar
   con búsqueda, perfil oficial, Maps o registro antes de blanquear.
7. No añadir candidatos nuevos durante esta primera planificación salvo que el
   lote lo pida explícitamente. Primero cerrar la calidad de las 133 filas.

## Flujo por lote

1. Antes de empezar:

   ```bash
   git status --short
   npx pnpm list:province alava
   ```

2. Tomar el primer lote `⬜` de la worklist y listar sus filas:

   ```bash
   python3 - <<'PY'
   import csv

   PATH = "data/csv/pais-vasco/alava.csv"
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
   `Venta online=sí`, luego `verificado` con enlaces/canales dudosos.
4. Investigar hasta evidencia suficiente. No recopilar datos opcionales si no
   cambian la decisión.
5. Editar quirúrgicamente el CSV con parser, preservando LF y tocando solo los
   `slug` del lote.
6. Crear o actualizar una línea en `data/evidence/pais-vasco/alava.jsonl` para
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

- Bodegas Rioja Alavesa: DOCa Rioja, directorio de bodegas y zona Rioja Alavesa
  (`https://riojawine.com/es/`).
- Txakoli de Álava: DOP Arabako Txakolina / Txakoli de Álava, listado de
  bodegas (`https://txakolidealava.eus/`).
- Quesos: DOP Idiazabal, productores (`https://www.quesoidiazabal.eus/`);
  Artzai Gazta (`https://www.artzai-gazta.eus/es/`); ruta del queso de
  Alava Turismo como apoyo secundario.
- Calidad vasca: Eusko Label / HAZI para miel, legumbres, huevos, verduras,
  aceite, patata y carne (`https://euskolabel.hazi.eus/es/nuestros-productos/`).
- Ecológico: Ekolurra/ENEEK y su censo de operadoras (`https://ekolurra.eus/es/`);
  REGOE estatal (`https://www.mapa.gob.es/es/alimentacion/temas/produccion-eco/regoe`).
- Aceite de Rioja Alavesa: APRORA (`https://aprora.eus/`) como contexto
  sectorial, sin convertirlo automáticamente en verificación individual.
- Contexto local secundario: Slow Food Araba (`https://slowfoodaraba.com/`),
  ayuntamientos, cuadrillas, Araba Turismo y noticias locales recientes.

## Worklist inicial

Leyenda: `⬜` pendiente, `🟨` en curso, `✅` hecho. Los lotes 1-7 cubren las 133
filas sin solaparse. El lote 8 es una auditoría transversal de cierre y puede
revisar filas ya tocadas.

| # | Lote | Filas | Pend. | Parcial | Verif. | VO=sí | Estado | Notas iniciales |
|---|---|---:|---:|---:|---:|---:|---|---|
| 1 | Lácteos y quesos | 28 | 22 | 4 | 2 | 0 | ✅ | 2026-06-16: 15 `verificado`, 13 `parcial`, 0 purgas; 11 ventas remotas con canal; se retiraron webs de directorio del campo `web`. |
| 2 | Bodegas y txakoli pendientes/parciales | 14 | 13 | 1 | 0 | 1 | ✅ | 2026-06-16: 13 `verificado`, 1 `parcial`; 10 ventas remotas con canal. Arzabro queda parcial por falta de presencia propia activa. |
| 3 | Aceite, legumbres, fruta y verdura | 23 | 14 | 1 | 8 | 4 | ✅ | 2026-06-16: 22 filas conservadas, 1 merge; 13 `verificado`, 9 `parcial`; 8 ventas remotas con canal. Etxeko Baratza absorbe el duplicado de Txema Martínez de Antoñana. |
| 4 | Cerveza, sidra, carne, huevos y charcutería | 15 | 7 | 1 | 7 | 6 | ✅ | 2026-06-16: 14 `verificado`, 1 `parcial`; 12 ventas remotas con canal. Hnos. Martínez Crespo y Basabe Baserria pasan a `Carne`. |
| 5 | Pan, pastelería, chocolate y despensa | 20 | 6 | 0 | 14 | 7 | ✅ | 2026-06-16: 19 filas conservadas, 1 purga por cierre; 18 `verificado`, 1 `parcial`; 14 ventas remotas con canal. Alonso Okindegia se elimina por cierre a finales de 2024. |
| 6 | Miel | 10 | 2 | 1 | 7 | 5 | ✅ | 2026-06-16: 8 `verificado`, 2 `parcial`, 0 pendientes; 5 ventas remotas con canal. Inés Iturrate y Samuel Etxebarria quedan parciales por falta de fuente propia. |
| 7 | Bodegas y txakoli ya verificados | 23 | 0 | 0 | 23 | 18 | ✅ | 2026-06-16: 23 `verificado`; 16 ventas remotas con canal, 4 `no`, 3 `no comprobado`. Se corrigen Azpillaga, Cándido Besa y Gil Berzal a `no comprobado`; El Mozo pasa a `sí`. |
| 8 | Cierre transversal provincial | 131 | 0 | 27 | 104 | 76 | ✅ | 2026-06-16: cierre final con 4 promociones a `verificado`, 5 ventas remotas resueltas y cobertura estricta activada para Álava. Snapshot final: 108 `verificado`, 23 `parcial`, 81 ventas con canal. |

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
- Bodegas con tienda de experiencias pero sin venta de vino: no contar como
  `Venta online=sí` para producto.
- Panaderías, pastelerías, carnicerías y tiendas: documentar por qué son
  elaboradores/productores dentro de alcance.
- Cambios de `Venta online=sí` heredado a `no` o `no comprobado`.
- Purgas por no productor, cierre, duplicado, otra provincia o entidad sin
  rastro suficiente.

## Lote 1: lácteos y quesos

Revisado el 2026-06-16 mediante webs propias, perfiles oficiales, DOP
Idiazabal, Artzai Gazta, Araba Market, directorios institucionales y
marketplaces cuando aportaban venta remota.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `atxeta-gazta-oleta`, `larrabe-quesos-aguiniga`, `queseria-zabaleta-munain` |
| `verificado`, venta por `telefono\|whatsapp` | `queseria-karobi-inoso`, `queseria-buruaga-arditegia-etxabarri-ibina`, `queseria-basterra-goiuri`, `queseria-ziorregi-inoso` |
| `verificado`, venta por `telefono\|email` | `la-leze-ilarduia`, `patxi-lopez-de-uralde-larrea` |
| `verificado`, venta por `whatsapp` | `harana-gazta-san-vicente-de-arana` |
| `verificado`, venta `no` | `soloitza-aiara`, `queseria-zelaitxo-anua` |
| `verificado`, venta por `marketplace` | `azkarra-gazta-galarreta` |
| `verificado`, venta por `telefono\|email\|whatsapp` | `queseria-izoria-aiara` |
| `verificado`, venta `no comprobado` | `bostibaieta-iruri-legutio`, `sat-olano-eguino`, `queseria-moraita-laguardia` |
| `parcial`, venta por `marketplace` | `queseria-eguralde-alava` |
| `parcial`, venta `no comprobado` | `mertxe-ibarrola-aiara`, `aixtra-ardibide-araia`, `maria-isabel-alava-basabe-zigoitia`, `ruiz-de-zarate-cantal-abornicano`, `unai-lekuona-araia`, `julen-karasatorre-aramburu-arriola`, `quesos-ibar-artziniega`, `gordoan-felix-etxezarreta-gordoa`, `izaro-felix-lekuona-albeniz`, `quesos-kerixara-oleta` |

### Excepciones

- Las fichas apoyadas solo por DOP Idiazabal, Artzai Gazta, ayuntamientos,
  prensa o directorios de premios quedan `parcial`, aunque el productor parezca
  real. No se fuerza `verificado` sin fuente propia, perfil oficial o ficha
  verificadora suficiente.
- Se retiraron del campo `web` varias URLs de directorios o terceros:
  Turismo Euskadi, Araba Market, Gorbeialdea/Asparrena, Ruta del Vino,
  Guild of Fine Food y World Cheese Awards. Esas fuentes quedan en el JSONL,
  no como web del productor.
- `la-leze-ilarduia` conserva su web propia aunque carga con contenido mínimo:
  DOP Idiazabal y Artzai Gazta enlazan el dominio y sostienen identidad,
  municipio, actividad y canales de reparto/envío.
- `queseria-eguralde-alava` queda `parcial` por falta de presencia propia, pero
  se marca `Venta online=sí` porque El Fogón de Álava mantiene una ficha de
  producto comprable.
- `soloitza-aiara` pasa a `Venta online=no`: su web propia remite a puntos de
  venta y contacto, pero no ofrece pedido remoto comprobable.
- En el lote 8 se elevan `bostibaieta-iruri-legutio` y `sat-olano-eguino` a
  `verificado` porque la DOP Idiazabal enlaza sus perfiles oficiales; no se
  fuerza venta remota.
- En el lote 8 se resuelve venta remota para `azkarra-gazta-galarreta` por
  marketplace y para `queseria-izoria-aiara` por pedidos telefónicos, e-mail y
  WhatsApp publicados por el Ayuntamiento de Vitoria-Gasteiz.

## Lote 2: bodegas y txakoli pendientes/parciales

Revisado el 2026-06-16 con webs propias, tiendas, DOCa Rioja, DOP Txakoli de
Álava, ayuntamientos, Araba Market, UAGA y perfiles oficiales.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `astobiza-okondo`, `bodegas-luberri-monje-amestoy-elciego`, `bodegas-ondalan-oyon-oion`, `bodegas-garcia-de-olano-paganos`, `bodegas-frias-del-val-villabuena-de-alava`, `bodegas-laukote-laguardia` |
| `verificado`, venta por `ecommerce\|telefono\|whatsapp` | `bodegas-cordoba-martinez-lapuebla-de-labarca` |
| `verificado`, venta por `ecommerce\|whatsapp` | `berarte-bodegas-y-vinedos-villabuena-de-alava`, `bodegas-otero-y-ruiz-de-alegria-banos-de-ebro` |
| `verificado`, venta por `marketplace` | `tellaetxe-txakoli-amurrio` |
| `verificado`, venta por `telefono\|whatsapp` | `bodegas-perez-basoco-villabuena-de-alava` |
| `verificado`, venta `no comprobado` | `bodega-cooperativa-san-sixto-yecora`, `casa-rojanda-elciego` |
| `parcial`, venta `no comprobado` | `bodega-arzabro-delika` |

### Excepciones

- `bodega-arzabro-delika` queda `parcial`: el dominio histórico no resuelve y
  solo se mantuvieron DOP Txakoli de Álava/UAGA como evidencia secundaria.
- `casa-rojanda-elciego` se conserva como bodega familiar con web de vinos e
  Instagram propio, pero sin venta remota actual comprobada.
- Se retiraron del campo `web` los enlaces que eran consejo, ayuntamiento,
  directorio o marketplace cuando no eran web propia del productor.
- En el lote 8 `bodegas-perez-basoco-villabuena-de-alava` pasa a venta remota
  por teléfono y WhatsApp publicada en Araba Market.

## Lote 3: aceite, legumbres, fruta y verdura

Revisado el 2026-06-16 con fuentes propias, APRORA, Araba Market, UAGA,
Visit Lautada, prensa pública y perfiles oficiales.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `erroiz-lanciego-lantziego`, `trujal-almazara-de-oyon` |
| `verificado`, venta por `whatsapp` | `trujal-de-moreda-casa-del-aceite-equidad-moreda-de-alava` |
| `verificado`, venta por `telefono\|email` | `bodegas-molina-perez-villabuena-de-alava` |
| `verificado`, venta por `telefono\|whatsapp` | `productos-eguinatur-egileor`, `etxeko-baratza-santa-cruz-de-campezo` |
| `verificado`, venta por `email\|telefono\|suscripcion` | `tierra-papel-tijera-salcedo` |
| `verificado`, venta por `telefono\|whatsapp\|suscripcion` | `lureder-amurrio` |
| `verificado`, venta `no` | `garlan-vitoria-gasteiz`, `udapa-vitoria-gasteiz` |
| `verificado`, venta `no comprobado` | `aceites-arrolan-lanciego`, `cooperativa-nuestra-senora-de-ocon-bernedo`, `larrateko-puentelarra` |
| `parcial`, venta `no comprobado` | `miguel-angel-lopez-de-vicuna-matauko`, `javier-araico-tuyo`, `amparo-martinez-de-alegria-san-millan-narbaiza`, `teo-subijana-ortiz-oreitia`, `ramon-lopez-de-arcaute-hijona`, `javier-castillo-audikana`, `jesus-maria-rios-espejo-barrikat`, `ivan-abajo-idoia-lagran`, `jon-atiega-adana` |
| `merge` | `txema-martinez-de-antonana-orbiso` → `etxeko-baratza-santa-cruz-de-campezo` |

### Excepciones

- El duplicado `txema-martinez-de-antonana-orbiso` se fusiona en
  `etxeko-baratza-santa-cruz-de-campezo`: UAGA y Araba Market apuntan al mismo
  proyecto/contacto de Txema/Edurne.
- `larrateko-puentelarra` pierde el blog del campo `web` porque devuelve 404;
  queda `verificado` por perfil/ficha real, pero sin venta online vigente.
- Los agricultores individuales soportados solo por UAGA quedan `parcial`,
  aunque UAGA indique teléfono o WhatsApp: no se convierte una ficha de 2020 en
  canal dinámico actual.

## Lote 4: cerveza, sidra, carne, huevos y charcutería

Revisado el 2026-06-16 con webs propias, Araba Market, Mercado de Abastos,
UAGA, perfiles oficiales, tiendas especializadas y fichas Maps.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `sidreria-kuartango-zuazo-de-kuartango`, `sidreria-iturrieta-aramaio`, `garagart-vitoria-gasteiz`, `naturokela-ondategi`, `byra-cerveza-artesana-nanclares-de-la-oca` |
| `verificado`, venta por `telefono\|whatsapp\|email` | `baias-fabrica-de-cerveza-oiardo` |
| `verificado`, venta por `telefono\|whatsapp` | `hnos-martinez-crespo-quintana`, `carniceria-alfonso-agurain`, `granja-arangutxi-mezkia` |
| `verificado`, venta por `whatsapp\|email` | `basabe-baserria-lezama` |
| `verificado`, venta por `telefono` | `carniceria-julen-karasatorre-agurain` |
| `verificado`, venta por `marketplace` | `falken-brewing-vitoria-gasteiz` |
| `verificado`, venta por `telefono\|email` | `isma-carne-ecologica-maturana` |
| `verificado`, venta `no` | `carniceria-acebo-vitoria-gasteiz`, `hobea-zalduondo` |

### Excepciones

- `hnos-martinez-crespo-quintana` y `basabe-baserria-lezama` cambian de
  `Charcutería` a `Carne` porque las fuentes describen explotación ganadera y
  carne ecológica, no obrador de charcutería.
- En el lote 8 `granja-arangutxi-mezkia` pasa a `verificado`: Araba Market
  documenta producción/pedido y se conserva el perfil social público de la
  granja como enlace externo.
- En el lote 8 `byra-cerveza-artesana-nanclares-de-la-oca` incorpora tienda
  propia con carrito en el campo `web` y pasa a venta por `ecommerce`.
- `carniceria-acebo-vitoria-gasteiz` se conserva por elaboración artesanal
  documentada, pero sin venta remota.
- `falken-brewing-vitoria-gasteiz` se conserva como cervecera nómada con venta
  por marketplace, no por tienda propia.

## Lote 5: pan, pastelería, chocolate y despensa

Revisado el 2026-06-16 con webs propias, tiendas, Araba Market, catálogo
Aiaraldea, prensa local, perfiles oficiales y fichas Maps.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `conservas-artesanas-victofer-vitoria-gasteiz`, `confituras-goya-vitoria-gasteiz`, `artepan-vitoria-gasteiz`, `panaderia-barrihuelo-elciego`, `fundacion-valle-salado-anana`, `la-trufa-de-alava-santa-cruz-de-campezo`, `delika2-delika`, `mamia-vitoria-gasteiz`, `trufas-lorea-vitoria-gasteiz` |
| `verificado`, venta por `telefono` | `mendialdeko-ogia-maeztu`, `pasteleria-nalda-vitoria-gasteiz` |
| `verificado`, venta por `telefono\|whatsapp` | `panaderia-mateo-laguardia` |
| `verificado`, venta por `whatsapp` | `beltzitina-anucita-anuntzeta` |
| `verificado`, venta por `ecommerce\|telefono` | `pasteleria-txistu-vitoria-gasteiz`, `panaderia-la-torre-zuaza` |
| `verificado`, venta `no` | `pastelerias-dastaketa-laudio`, `el-talo-vitoria-gasteiz`, `pasteleria-sosoaga-vitoria-gasteiz` |
| `verificado`, venta `no comprobado` | `panaderia-samia-agurain` |
| `purge` | `panaderia-alonso-penacerrada` |

### Excepciones

- `panaderia-alonso-penacerrada` se elimina por cierre: EITB anunció el cierre
  a finales de 2024 y fuentes posteriores la listan como cerrada.
- En el lote 8 `panaderia-la-torre-zuaza` pasa a `verificado`: la web propia
  LA TORRE publica productos artesanos, contacto y formulario de pedido.
- `beltzitina-anucita-anuntzeta` pierde el dominio del campo `web` porque no
  resuelve; se conserva por Instagram y UAGA, con pedido por WhatsApp.
- `pasteleria-txistu-vitoria-gasteiz` y `pasteleria-nalda-vitoria-gasteiz`
  pasan a venta remota por tienda/pedido telefónico documentado.

## Lote 6: miel

Revisado el 2026-06-16 con webs propias, perfiles oficiales, Araba Market,
Ayuntamiento de Vitoria-Gasteiz, Gorbeia Euskadi, Ecocolmena, prensa local y
fichas Maps.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `melapium-igay`, `miel-ameztutxu-albeniz` |
| `verificado`, venta por `telefono\|whatsapp\|marketplace` | `miel-la-atalaya-berantevilla` |
| `verificado`, venta por `telefono\|whatsapp` | `el-guardian-de-las-abejas-urarte` |
| `verificado`, venta `no` | `aldeko-eztia-aramaio`, `la-casa-de-la-miel-alavesa-vitoria-gasteiz` |
| `verificado`, venta `no comprobado` | `aroma-de-abeja-leza`, `istrupiza-baserria-ziorraga` |
| `parcial`, venta por `telefono` | `ines-iturrate-vea-manurga` |
| `parcial`, venta `no comprobado` | `samuel-etxebarria-fresneda` |

### Excepciones

- `aldeko-eztia-aramaio` pasa a `verificado` y cambia el campo `web` desde la
  ficha de Turismo Euskadi al blog propio. Se marca venta `no` porque solo se
  confirmó venta directa/visitas.
- `miel-la-atalaya-berantevilla` pasa a `verificado`; se retira Araba Market
  del campo `web` y se conserva como canal de pedido, junto a El Fogón de
  Álava como marketplace.
- `aroma-de-abeja-leza` retira la entrevista del campo `web`; Instagram y
  Maps sostienen la presencia actual, pero no hay canal remoto comprobado.
- `istrupiza-baserria-ziorraga` retira Gorbeia Euskadi del campo `web`; la
  evidencia encontrada sostiene apicultura/experiencias, no venta remota de
  producto.
- `ines-iturrate-vea-manurga` y `samuel-etxebarria-fresneda` bajan a
  `parcial` porque solo se localizaron directorios institucionales o prensa,
  sin fuente propia actual.

## Lote 7: bodegas y txakoli ya verificados

Revisado el 2026-06-16 con webs propias, tiendas, perfiles oficiales, DOCa
Rioja/ABRA cuando era apoyo sectorial, directorios municipales y marketplaces
vinculados desde la propia bodega.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `bodegas-las-orcas-laguardia`, `bodega-alutiz-samaniego`, `bodegas-araico-villabuena-de-alava`, `bodegas-ostatu-samaniego`, `bodegas-altun-banos-de-ebro`, `bodegas-valdelana-elciego`, `txakoli-garate-laudio`, `artomana-txakolina-amurrio`, `bodegas-mitarte-labastida`, `el-mozo-wines-lanciego`, `heredad-de-aduna-samaniego`, `sierra-de-tolono-elciego`, `bodegas-pujanza-laguardia`, `valserrano-villabuena-de-alava` |
| `verificado`, venta por `marketplace` | `bodega-el-fabulista-laguardia`, `bodegas-bideona-villabuena-de-alava` |
| `verificado`, venta `no` | `bodegas-beltxuri-villabuena-de-alava`, `bat-gara-lezama`, `bodegas-bhilar-elvillar`, `artuke-banos-de-ebro` |
| `verificado`, venta `no comprobado` | `bodegas-azpillaga-urarte-lanciego`, `bodegas-candido-besa-villabuena-de-alava`, `bodegas-gil-berzal-laguardia` |

### Excepciones

- `el-mozo-wines-lanciego` cambia de `Venta online=no` a `sí`: la tienda
  propia `tienda.elmozowines.com` mantiene carrito activo.
- `bodegas-azpillaga-urarte-lanciego` cambia de `sí` a `no comprobado`: la web
  HTTP mínima sigue activa, pero no se confirmó tienda propia ni pedido remoto.
- `bodegas-candido-besa-villabuena-de-alava` cambia de `sí` a `no comprobado`:
  la web y fuentes municipales verifican la bodega, pero no tienda o canal de
  pedido.
- `bodegas-gil-berzal-laguardia` cambia de `sí` a `no comprobado`: la web
  oficial está en mantenimiento en 2026; se mantiene la verificación por
  presencia oficial/social y prensa.
- `bodega-el-fabulista-laguardia` y `bodegas-bideona-villabuena-de-alava`
  cuentan como venta por `marketplace`, no `ecommerce`, porque el checkout se
  resuelve fuera del dominio principal de la bodega.
- `bodegas-pujanza-laguardia` y `valserrano-villabuena-de-alava` normalizan el
  campo `web` a los dominios canónicos observados en la auditoría.

## Lote 8: cierre transversal provincial

Revisado el 2026-06-16 como pasada final sobre residuales `parcial`, ventas
`no comprobado`, enlaces ajenos y coherencia evidencia/CSV.

| Resultado | Slugs |
|---|---|
| Promoción a `verificado`, venta `no comprobado` | `bostibaieta-iruri-legutio`, `sat-olano-eguino` |
| Promoción a `verificado`, venta por `telefono\|whatsapp` | `granja-arangutxi-mezkia` |
| Promoción a `verificado`, venta por `ecommerce\|telefono` | `panaderia-la-torre-zuaza` |
| Venta resuelta por `ecommerce` | `byra-cerveza-artesana-nanclares-de-la-oca` |
| Venta resuelta por `telefono\|whatsapp` | `bodegas-perez-basoco-villabuena-de-alava` |
| Venta resuelta por `marketplace` | `azkarra-gazta-galarreta` |
| Venta resuelta por `telefono\|email\|whatsapp` | `queseria-izoria-aiara` |
| Cobertura estricta | `pais-vasco/alava` en `data/evidence/coverage.json` |

### Residuales intencionados

- Quedan 23 `parcial`, todos con evidencia `keep`: principalmente productores
  individuales o queserías sostenidas por DOP/UAGA/directorios, sin fuente
  propia, perfil oficial verificable, Google Maps o marketplace vigente.
- Quedan 35 `no comprobado`: no se fuerza venta remota cuando la web oficial
  solo muestra catálogo, enoturismo, visitas, puntos de venta o contacto
  genérico.
- `julen-karasatorre-aramburu-arriola` y
  `carniceria-julen-karasatorre-agurain` siguen como posible revisión futura:
  no se fusionan en esta pasada sin confirmar que la quesería y la carnicería
  representan el mismo productor público en el CSV.
- El audit de calidad baja de 45 a 36 warnings; las restantes son avisos de
  campos opcionales ausentes o filas parciales, no errores bloqueantes.

## Ola 3 — venta-sin-resolver

- Cerrado el 2026-07-29: se revisaron las 35 ventas `no comprobado` y se
  resolvieron 33: 3 `sí` y 30 `no`.
- Aroma de Abeja y Kerixara pasan a `sí` por `ecommerce`. Nuestra Señora de
  Ocón pasa a `sí` por `telefono|email`, ya que su página oficial de compra
  indica expresamente cursar pedidos por llamada o formulario.
- La tienda propia de Kerixara permite además recuperar su web y correo
  actuales y elevar la ficha a `verificado`.
- Quedan solo Casa Rojanda y Bodegas Gil Berzal en `no comprobado`: la primera
  conserva un fallo TLS que impide revisar su canal de vino y la segunda
  mantiene la web oficial en mantenimiento.
- Snapshot provincial: 109 `verificado`, 22 `parcial`; venta 84 `sí`, 45 `no`
  y 2 `no comprobado`.
