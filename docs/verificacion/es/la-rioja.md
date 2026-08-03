# Verificación La Rioja

> Documento de trabajo para iniciar la verificación completa de
> `data/csv/la-rioja/la-rioja.csv`.
>
> Generado el 2026-06-19 desde el CSV actual, sin nueva investigación web. Estas
> notas no son fuente de verdad ni evidencia estructurada: las decisiones que
> cambien CSV deben quedar en `data/evidence/la-rioja/la-rioja.jsonl`.

## Foto inicial

- CSV: `data/csv/la-rioja/la-rioja.csv`.
- Filas: 416 productores en 95 municipios y 18 categorías.
- Estado editorial: 410 `pendiente`, 5 `parcial`, 1 `verificado`.
- Venta online: 415 `no comprobado`, 1 `no`, 0 `sí`.
- `Canal de venta`: 416 vacíos; cuando se marque `Venta online=sí`, rellenar canal en el mismo pase.
- Cobertura de campos: 351 con web, 407 con teléfono, 308 con correo, 178 con alguna red social, 278 con imagen, 416 con Google Maps.
- Completitud: progreso 74,8%; gaps actuales frente a objetivo: `Venta online`, redes sociales y `verificacion`.
- Riesgos actuales: 65 sin web, 138 sin imagen, 246 warnings de calidad y 0 errores en el audit de calidad.
- Evidencia: el ledger existe con 6 registros; quedan 410 filas del CSV sin evidencia propia. La Rioja no está todavía en cobertura estricta de `coverage.json`.
- Validación de contexto: `check:csv:changed` y `check:evidence:changed` pasan en el árbol actual, que incluye cambios previos en La Rioja y otras provincias.

## Filas ya revisadas

| Slug | Estado | Venta online | Nota |
| --- | --- | --- | --- |
| `heladeria-della-sera-logrono` | `verificado` | `no` | Evidencia oficial de obrador y ausencia de tienda online. |
| `gutisgan-26-sl-alberite` | `parcial` | `no comprobado` | Identidad y actividad láctea por directorio/registro; falta fuente oficial. |
| `la-revuelta-sc-aldeanueva-de-ebro` | `parcial` | `no comprobado` | Actividad ganadera documentada, sin fuente primaria. |
| `las-estanquillas-sat-alfaro` | `parcial` | `no comprobado` | Actividad láctea actual por fuentes secundarias. |
| `hermanos-martinez-falcon-scpp-calahorra` | `parcial` | `no comprobado` | Identidad, actividad y contacto por fuentes secundarias. |
| `faustino-martinez-luquin-y-otros-calahorra` | `parcial` | `no comprobado` | Actividad láctea por directorios empresariales; sin web oficial. |

## Objetivo de la verificación

1. Confirmar existencia y actividad actual de cada productor.
2. Resolver `verificacion`: `verificado`, `parcial` o decisión documentada de baja/fusión.
3. Resolver `Venta online`: `sí`, `no` o `no comprobado`; si queda `sí`, rellenar `Canal de venta`.
4. Revisar nombre, municipio, categoría, productos estrella, contacto, web, redes, Google Maps, coordenadas e imagen.
5. Registrar cada decisión relevante en `data/evidence/la-rioja/la-rioja.jsonl`.
6. Al final del pase, dejar la provincia preparada para entrar en cobertura estricta de evidencia.

## Criterio por fila

- `verificado`: fuente oficial vigente del productor o registro sectorial fiable más ubicación consistente; para venta online, canal vivo comprobado en web/canal propio.
- `parcial`: evidencia razonable de identidad o actividad, pero falta fuente primaria, actividad reciente clara o confirmación de un campo dinámico.
- `pendiente`: solo debe permanecer si se aplaza explícitamente por bloqueo o falta de tiempo.
- `Venta online=sí`: requiere compra o pedido remoto real; usar `Canal de venta` con `ecommerce`, `whatsapp`, `email`, `telefono`, `suscripcion` o `marketplace`.
- `Venta online=no`: usar cuando no hay canal remoto tras revisión suficiente o la fuente limita la venta a tienda física/directa.
- Bajas/fusiones: documentar con evidencia antes de eliminar o fusionar; no dejar la decisión solo en estas notas.

## Fuentes de arranque

- Bodegas: directorio del Consejo Regulador DOCa Rioja, webs oficiales, Google Maps, tienda propia y registros societarios solo como apoyo.
- Aceite: DOP Aceite de La Rioja, almazaras/trujales, webs oficiales y Google Maps.
- Conservas y huerta: Alimentos de La Rioja, DOP Peras de Rincón de Soto, webs de conserveras, registros sectoriales y Google Maps.
- Lácteos y quesos: DOP Queso Camerano, webs oficiales, registros ganaderos/empresariales y prensa reciente solo como apoyo cuando no exista fuente primaria.
- Charcutería: IGP Chorizo Riojano, webs oficiales, carnicerías/obradores con elaboración propia y Google Maps.
- Dulces y panadería: especialidades locales como mazapán de Soto y fardelejos; confirmar que la fila es obrador/productor, no solo comercio.
- Miel, cerveza, hidromiel, café y chocolate: web propia, tienda/canal real, redes activas y Google Maps.

## Lotes principales

| Lote | Alcance | Filas | Pendiente | Parcial | Verificado | Venta online `no comprobado` | Sin web | Sin imagen | Riesgo inicial |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | Bodega Rioja Alta / Haro-Sonsierra-Tirón | 84 | 0 | 19 | 65 | 19 | 18 | 28 | Cerrado el 2026-06-19; quedan parciales sin fuente primaria o web propia. |
| 2 | Bodega Najerilla / Cenicero-Fuenmayor-Navarrete | 115 | 0 | 30 | 85 | 30 | 29 | 47 | Cerrado el 2026-06-19; parciales por falta de fuente primaria o web propia actual. |
| 3 | Bodega Logroño / Iregua-Leza-Jubera | 39 | 0 | 5 | 34 | 5 | 5 | 11 | Cerrado el 2026-06-19; ajustadas webs oficiales y tiendas comprobadas. |
| 4 | Bodega Rioja Oriental / Cidacos-Alhama-Ebro | 60 | 0 | 17 | 43 | 17 | 15 | 26 | Cerrado el 2026-06-19; retirados enlaces e imágenes cruzadas. |
| 5 | Bodega suelta pendiente de encaje | 5 | 0 | 0 | 5 | 0 | 0 | 2 | Cerrado el 2026-06-19; todas las filas quedan verificadas. |
| 6 | Conservas / huerta / fruta / legumbres | 21 | 0 | 0 | 21 | 0 | 0 | 6 | Cerrado el 2026-06-19; 16 con venta online confirmada y 5 sin canal remoto. |
| 7 | Lácteos y quesos | 18 | 0 | 7 | 11 | 7 | 8 | 14 | Cerrado el 2026-06-19; quedan parciales sin fuente primaria actual. |
| 8 | Charcutería / cárnicos | 22 | 0 | 3 | 19 | 3 | 6 | 9 | Cerrado el 2026-06-19; corregidas webs aparcadas, redes e imágenes cruzadas. |
| 9 | Aceite / frutos secos | 18 | 0 | 10 | 8 | 10 | 6 | 7 | Cerrado el 2026-06-19; verificadas tiendas claras y parciales donde solo hay Maps/fuente no primaria. |
| 10 | Obradores, helados, chocolate y café | 20 | 0 | 10 | 10 | 11 | 6 | 11 | Cerrado el 2026-06-19; retiradas webs no propias e imágenes placeholder. |
| 11 | Cerveza, miel e hidromiel | 14 | 0 | 10 | 4 | 10 | 9 | 9 | Cerrado el 2026-06-19; canales online solo en miel/hidromiel con fuente oficial. |

Total: 416 filas.

## Cierre final

Cierre 2026-06-19:

- Provincia completa: 416 filas revisadas, 0 `pendiente`, 303 `verificado` y 113 `parcial`.
- Venta online final: 156 `sí`, 146 `no` y 114 `no comprobado`; todos los `sí` tienen `Canal de venta`.
- Evidencia completa: 416 registros `keep` en `data/evidence/la-rioja/la-rioja.jsonl`.
- Se añade `la-rioja/la-rioja` a cobertura estricta de evidencia.
- Limpieza de imágenes: se eliminaron 37 assets de La Rioja que ya no referenciaba el CSV tras retirar placeholders, imágenes cruzadas, iconos de redes, logos de certificación o financiación pública.

## Lote 1 - Bodega Rioja Alta / Haro-Sonsierra-Tirón

Estado inicial: 84 filas, todas `pendiente` y con `Venta online=no comprobado`.

Cierre 2026-06-19:

- 84 filas revisadas: 65 `verificado`, 19 `parcial` y 0 `pendiente`.
- Venta online: 40 `sí`, 25 `no` y 19 `no comprobado`; todos los `sí` tienen `Canal de venta`.
- Cobertura residual: 18 sin web y 28 sin imagen.
- Evidencia escrita para las 84 filas en `data/evidence/la-rioja/la-rioja.jsonl`.
- Fuentes de trabajo: [DOCa Rioja](https://riojawine.com/es/), [directorio de operadores certificados 2025](https://riojawine.com/wp-content/uploads/2025/07/20250721-dp1003-0-directorio-de-operadores-certificados.pdf), webs oficiales, tiendas online y Google Maps.
- Correcciones editoriales: `bolumburu-ormaechea-carlos-gimileo` se corrigió a Gimileo conservando el slug; se retiraron enlaces o imágenes cruzadas de `vinos-pinedo-anguciana`, `castillo-perez-domingo-briones`, `jesus-fernando-gomez-cruzado-briones`, `muga-foncea-cesar-oscar-haro` y `mendoza-lardi-s-l-bodegas-san-vicente-de-la-sonsierra`.

Subdividir:

- 1A: Haro y San Vicente de la Sonsierra: 43 filas.
- 1B: Briones, Briñas, Cuzcurrita de Río Tirón, Ollauri, Sajazarra, Anguciana, Gimileo, Tirgo, Torremontalbo, Fonzaleche, Galbárruli y Rodezno: 41 filas.

Comando de arranque:

```bash
npx pnpm list:province la-rioja --categoria "Bodega"
```

Trabajo:

- [x] Contrastar cada bodega con DOCa Rioja y web oficial cuando exista.
- [x] Resolver alias de marca frente a razón social antes de tocar `slug`.
- [x] Confirmar si la web vende vino, solo ofrece enoturismo o solo muestra catálogo.
- [x] Rellenar `Canal de venta` en el mismo cambio que cualquier `Venta online=sí`.
- [x] Escribir evidencia por fila: identidad, actividad, municipio, venta online y decisión de verificación.

## Lote 2 - Bodega Najerilla / Cenicero-Fuenmayor-Navarrete

Estado inicial: 115 filas, todas `pendiente` y con `Venta online=no comprobado`.

Cierre 2026-06-19:

- 115 filas revisadas: 85 `verificado`, 30 `parcial` y 0 `pendiente`.
- Venta online: 44 `sí`, 41 `no` y 30 `no comprobado`; todos los `sí` tienen `Canal de venta`.
- Cobertura residual: 29 sin web y 47 sin imagen.
- Evidencia escrita para las 115 filas en `data/evidence/la-rioja/la-rioja.jsonl`.
- Fuentes de trabajo: [DOCa Rioja](https://riojawine.com/es/), [directorio de operadores certificados 2025](https://riojawine.com/wp-content/uploads/2025/07/20250721-dp1003-0-directorio-de-operadores-certificados.pdf), webs oficiales, tiendas online y Google Maps.
- Correcciones editoriales: se retiraron enlaces o imágenes cruzadas de operadores sin web propia confirmada; se actualizaron webs y tiendas oficiales como Artoje, Benés, Heras Cordón, Finca Valpiedra, Tritium y Cornelio; Bodegas AGE queda `parcial` sin URL antigua.

Subdividir:

- 2A: Fuenmayor, Cenicero y Navarrete: 47 filas.
- 2B: San Asensio, Ábalos, Badarán, Cordovín, Hormilla, Hormilleja y Huércanos: 44 filas.
- 2C: Baños de Río Tobía, Uruñuela, Nájera, Alesanco, Arenzana de Abajo, Sotés, Azofra, Baños de Rioja, Bobadilla y Ventosa: 24 filas.

Trabajo:

- [x] Priorizar los municipios con muchas bodegas y muchas imágenes ya existentes: Fuenmayor, San Asensio, Cenicero, Navarrete y Ábalos.
- [x] Revisar posibles duplicados entre cooperativa, marca comercial y bodega visitable.
- [x] Verificar coordenadas cuando Google Maps apunte a finca, hotel-bodega o centro de visitas.
- [x] Dejar evidencia de cualquier fusión o baja antes de editar CSV.

## Lote 3 - Bodega Logroño / Iregua-Leza-Jubera

Estado inicial: 39 filas, todas `pendiente` y con `Venta online=no comprobado`.

Cierre 2026-06-19:

- 39 filas revisadas: 34 `verificado`, 5 `parcial` y 0 `pendiente`.
- Venta online: 18 `sí`, 16 `no` y 5 `no comprobado`; todos los `sí` tienen `Canal de venta`.
- Cobertura residual: 5 sin web y 11 sin imagen.
- Evidencia escrita para las 39 filas en `data/evidence/la-rioja/la-rioja.jsonl`.
- Fuentes de trabajo: [DOCa Rioja](https://riojawine.com/es/), [directorio de operadores certificados 2025](https://riojawine.com/wp-content/uploads/2025/07/20250721-dp1003-0-directorio-de-operadores-certificados.pdf), webs oficiales, tiendas online y Google Maps.
- Correcciones editoriales: se actualizaron webs y tiendas como Valoria, Viña Ijalba, Cuna de Reyes, San Esteban y Macrobert & Canals; se retiraron enlaces no propios o malformados en proyectos que quedan `parcial`.

Subdividir:

- 3A: Logroño y Entrena: 22 filas.
- 3B: Albelda de Iregua, Alberite, Murillo de Río Leza, Nalda, Ribafrecha, Villamediana de Iregua, Leza de Río Leza, Lagunilla del Jubera y Sojuela: 17 filas.

Trabajo:

- [x] Distinguir sede social, viñedo y punto de venta cuando la bodega opera desde Logroño.
- [x] Validar proyectos pequeños o de autor con web/social activa antes de elevar a `verificado`.
- [x] Revisar las bodegas sin web con DOCa Rioja, Google Maps y registros solo como apoyo.

## Lote 4 - Bodega Rioja Oriental / Cidacos-Alhama-Ebro

Estado inicial: 60 filas, todas `pendiente` y con `Venta online=no comprobado`.

Cierre 2026-06-19:

- 60 filas revisadas: 43 `verificado`, 17 `parcial` y 0 `pendiente`.
- Venta online: 19 `sí`, 24 `no` y 17 `no comprobado`; todos los `sí` tienen `Canal de venta`.
- Cobertura residual: 15 sin web y 26 sin imagen.
- Evidencia escrita para las 60 filas en `data/evidence/la-rioja/la-rioja.jsonl`.
- Fuentes de trabajo: [DOCa Rioja](https://riojawine.com/es/), [directorio de operadores certificados 2025](https://riojawine.com/wp-content/uploads/2025/07/20250721-dp1003-0-directorio-de-operadores-certificados.pdf), webs oficiales, tiendas online y Google Maps.
- Correcciones editoriales: se actualizaron Copaboca/Dunviro, Casa La Rad, D. Mateos, San Miguel, Laetus, Real Rubio y Señorío de Yerga; se retiraron enlaces e imágenes cruzadas de Cicerón, Baigorri/Cicerón, Víctor Ausejo, Fuente Rubia/Librares, Sáenz/Faustino, Santos/Hetube, Cosecheros/Sáenz, Montesa/Finca Montote, Los Vegales y Marrodán.

Subdividir:

- 4A: Aldeanueva de Ebro y Alcanadre: 23 filas.
- 4B: Tudelilla, Alfaro, El Villar de Arnedo, Autol, Ausejo, Calahorra, Arnedo, Grávalos, Quel, Rincón de Soto, Cervera del Río Alhama y El Redal: 37 filas.

Trabajo:

- [x] Confirmar actividad actual de cooperativas y marcas familiares.
- [x] Revisar si el canal online corresponde a vino propio o a marketplace/distribuidor externo.
- [x] Documentar bajas/fusiones cuando la fuente solo sostenga una marca absorbida.

## Lote 5 - Bodega suelta pendiente de encaje

Incluye 5 filas: Agoncillo, Cárdenas, Galilea y Hervías.

Cierre 2026-06-19:

- 5 filas revisadas: 5 `verificado`, 0 `parcial` y 0 `pendiente`.
- Venta online: 3 `sí`, 2 `no` y 0 `no comprobado`; todos los `sí` tienen `Canal de venta`.
- Cobertura residual: 0 sin web y 2 sin imagen.
- Evidencia escrita para las 5 filas en `data/evidence/la-rioja/la-rioja.jsonl`.
- Fuentes de trabajo: [DOCa Rioja](https://riojawine.com/es/), [directorio de operadores certificados 2025](https://riojawine.com/wp-content/uploads/2025/07/20250721-dp1003-0-directorio-de-operadores-certificados.pdf), webs oficiales, tiendas online y Google Maps.
- Correcciones editoriales: Bodegas La Eralta queda `verificado/no`; Nestares Eguizábal, La Bodeguita Escondida y los restantes productores del lote quedan con decisión de venta online resuelta.

Trabajo:

- [x] Cerrar `bodegas-la-eralta-agoncillo` con Rioja Media / Logroño si se trabaja por proximidad.
- [x] Cerrar las dos filas de Cárdenas con Najerilla si se trabaja por municipio.
- [x] Cerrar Galilea y Hervías con el lote regional que tenga fuentes más próximas.
- [x] No dejarlas para el final sin evidencia: son pocas, pero dos no tienen web.

## Lote 6 - Conservas / huerta / fruta / legumbres

Incluye `Conservas`, `Conservas y mermeladas`, `Fruta y verdura`, `Legumbres` y `Despensa artesanal`: 21 filas.

Cierre 2026-06-19:

- 21 filas revisadas: 21 `verificado`, 0 `parcial` y 0 `pendiente`.
- Venta online: 16 `sí`, 5 `no` y 0 `no comprobado`; todos los `sí` tienen `Canal de venta`.
- Cobertura residual: 0 sin web y 6 sin imagen.
- Evidencia escrita para las 21 filas en `data/evidence/la-rioja/la-rioja.jsonl`.
- Fuentes de trabajo: webs oficiales, tiendas online, páginas de pedidos, Google Maps y referencias sectoriales para productos protegidos o marcas colectivas.
- Correcciones editoriales: se retiraron imágenes falsas de `conservas-tarvis-s-a-alberite`, `conservas-serrano-s-l-calahorra`, `conservas-jjj-rincon-de-soto` y `conservas-huerta-de-tormantos-tormantos`; `conservas-marnal-tricio` y `la-huerta-del-oja-santurde-de-rioja` quedan con pedido por contacto documentado.

Comandos:

```bash
npx pnpm list:province la-rioja --categoria "Conservas"
npx pnpm list:province la-rioja --categoria "Fruta y verdura"
npx pnpm list:province la-rioja --categoria "Legumbres"
```

Trabajo:

- [x] Confirmar que cada fila representa productor/obrador y no solo marca de distribución.
- [x] Comprobar tiendas online de conserveras; si solo hay catálogo, no marcar `sí`.
- [x] Revisar DOP/IGP o marcas colectivas cuando sustenten producto estrella.
- [x] Mantener evidencia clara de producto propio, ubicación y venta.

## Lote 7 - Lácteos y quesos

Estado inicial: 18 filas, 13 `pendiente`, 5 `parcial`, 18 con `Venta online=no comprobado`.

Cierre 2026-06-19:

- 18 filas revisadas: 11 `verificado`, 7 `parcial` y 0 `pendiente`.
- Venta online: 5 `sí`, 6 `no` y 7 `no comprobado`; todos los `sí` tienen `Canal de venta`.
- Cobertura residual: 8 sin web y 14 sin imagen.
- Evidencia escrita para las 18 filas en `data/evidence/la-rioja/la-rioja.jsonl`.
- Fuentes de trabajo: webs oficiales, redes sociales oficiales, registros o directorios sectoriales, prensa local solo como apoyo y Google Maps.
- Correcciones editoriales: `queseria-el-alto-cidakos-arnedillo` se actualizó de Facebook a web oficial con tienda; `lacteos-martinez-s-l-queso-los-cameros-haro` queda con ecommerce confirmado y sin imagen falsa; `queserias-la-eralta-tio-sanz-bergasa` queda `Venta online=no` al no confirmar pedido directo de queso; `gutisgan-26-sl-alberite`, `la-revuelta-sc-aldeanueva-de-ebro`, `las-estanquillas-sat-alfaro`, `hermanos-martinez-falcon-scpp-calahorra`, `faustino-martinez-luquin-y-otros-calahorra`, `ganados-pizarro-laguna-de-cameros` y `queseria-artesanal-tondeluna-ojacastro` quedan `parcial`.

Comando:

```bash
npx pnpm list:province la-rioja --categoria "Lácteos y quesos"
```

Trabajo:

- [x] Cerrar primero las 5 parciales ya documentadas: decidir si pueden subir a `verificado` o si quedan `parcial`.
- [x] Contrastar Queso Camerano, webs oficiales, redes y Google Maps.
- [x] Las explotaciones sin web requieren fuente reciente; un directorio empresarial no basta para `verificado`.
- [x] Revisar imágenes después de resolver identidad, no antes.

## Lote 8 - Charcutería / cárnicos

Estado inicial: 22 filas, todas `pendiente`.

Cierre 2026-06-19:

- 22 filas revisadas: 19 `verificado`, 3 `parcial` y 0 `pendiente`.
- Venta online: 13 `sí`, 6 `no` y 3 `no comprobado`; todos los `sí` tienen `Canal de venta`.
- Cobertura residual: 6 sin web y 9 sin imagen.
- Evidencia escrita para las 22 filas en `data/evidence/la-rioja/la-rioja.jsonl`.
- Fuentes de trabajo: IGP Chorizo Riojano, webs oficiales, redes sociales oficiales, marketplace local cuando identificaba al productor, Google Maps y directorios solo como apoyo.
- Correcciones editoriales: se retiró la web aparcada de `embutidos-bueyo-albelda-de-iregua`; `embutidos-la-artesana-briones` y `embutidos-artesanos-angel-jalon-viguera` conservan red social en la columna correcta; `embutidos-senora-julia-viguera` queda con ecommerce confirmado y sin imagen falsa; `embutidos-bueyo-albelda-de-iregua`, `embutidos-briones-s-l-briones` y `morcillas-san-martin-hormilla` quedan `parcial`.

Comando:

```bash
npx pnpm list:province la-rioja --categoria "Charcutería"
```

Trabajo:

- [x] Confirmar obrador o elaboración propia.
- [x] Usar IGP Chorizo Riojano y web oficial cuando aplique.
- [x] Distinguir venta online de lotes/embutidos frente a simple formulario de contacto.
- [x] Marcar `parcial` si solo hay Google Maps o directorios sin fuente del productor.

## Lote 9 - Aceite / frutos secos

Incluye `Aceite` y `Frutos secos`: 18 filas.

Cierre 2026-06-19:

- 18 filas revisadas: 8 `verificado`, 10 `parcial` y 0 `pendiente`.
- Venta online: 6 `sí`, 2 `no` y 10 `no comprobado`; todos los `sí` tienen `Canal de venta`.
- Cobertura residual: 6 sin web y 7 sin imagen.
- Evidencia escrita para las 18 filas en `data/evidence/la-rioja/la-rioja.jsonl`.
- Fuentes de trabajo: webs oficiales, tiendas online, Google Maps y fuentes de apoyo cuando no existía fuente primaria revisable.
- Correcciones editoriales: se retiró la imagen falsa de certificación en `andres-garcia-e-hijos-s-l-quel`; quedan `parcial` los trujales y aceites sin fuente primaria actual o con web no revisable en este pase.

Comandos:

```bash
npx pnpm list:province la-rioja --categoria "Aceite"
npx pnpm list:province la-rioja --categoria "Frutos secos"
```

Trabajo:

- [x] Contrastar almazaras y trujales con DOP Aceite de La Rioja o fuentes oficiales.
- [x] Validar frutos secos con web/registro/fuente local fiable y ubicación.
- [x] Revisar si la venta remota es tienda propia, contacto por teléfono/email o marketplace.

## Lote 10 - Obradores, helados, chocolate y café

Incluye `Dulces y repostería`, `Pan y pastelería`, `Helados`, `Chocolate` y `Café`: 20 filas.

Cierre 2026-06-19:

- 20 filas revisadas: 10 `verificado`, 10 `parcial` y 0 `pendiente`.
- Venta online: 6 `sí`, 3 `no` y 11 `no comprobado`; todos los `sí` tienen `Canal de venta`.
- Cobertura residual: 6 sin web y 11 sin imagen.
- Evidencia escrita o conservada para las 20 filas en `data/evidence/la-rioja/la-rioja.jsonl`.
- Fuentes de trabajo: webs oficiales, tiendas online, redes existentes, Google Maps y fuentes de apoyo para obradores sin web propia.
- Correcciones editoriales: `cumpanis-panaderia-ecologica-logrono` pierde una web no propia y una imagen de financiación pública; se retiraron imágenes falsas de `pasteleria-la-clavelina-arnedo` y `chocolates-artesanos-penaquel-quel`; `mazapanes-de-soto-vda-de-manuel-redondo-soto-en-cameros` queda verificado con ecommerce, pero se anota que su web contiene enlaces spam ajenos.

Comandos:

```bash
npx pnpm list:province la-rioja --categoria "Dulces y repostería"
npx pnpm list:province la-rioja --categoria "Pan y pastelería"
npx pnpm list:province la-rioja --categoria "Helados"
```

Trabajo:

- [x] Mantener `heladeria-della-sera-logrono` como referencia de evidencia completa.
- [x] Confirmar obrador propio antes de `verificado`.
- [x] Resolver `Venta online` con especial cuidado: encargos por teléfono/email pueden ser `sí` solo si la fuente lo sostiene.
- [x] Revisar panes/dulces tradicionales con fuentes oficiales o del propio productor, no solo turismo genérico.

## Lote 11 - Cerveza, miel e hidromiel

Incluye `Cerveza artesana`, `Miel` e `Hidromiel`: 14 filas.

Cierre 2026-06-19:

- 14 filas revisadas: 4 `verificado`, 10 `parcial` y 0 `pendiente`.
- Venta online: 4 `sí`, 0 `no` y 10 `no comprobado`; todos los `sí` tienen `Canal de venta`.
- Cobertura residual: 9 sin web y 9 sin imagen.
- Evidencia escrita para las 14 filas en `data/evidence/la-rioja/la-rioja.jsonl`.
- Fuentes de trabajo: webs oficiales de apicultores e hidromiel, tiendas online, redes sociales cuando eran el único canal localizado y Google Maps.
- Correcciones editoriales: `la-marmita-microcerveceria-artesanal-camprovin`, `miel-penabeja-ochanduri` y `el-praeno-santa-marina` mueven redes sociales fuera de `web`; `miel-la-panda-sorzano` pierde enlaces de Mentta que no pertenecían al productor; se retiraron imágenes de iconos o marketplace.

Comandos:

```bash
npx pnpm list:province la-rioja --categoria "Cerveza artesana"
npx pnpm list:province la-rioja --categoria "Miel"
npx pnpm list:province la-rioja --categoria "Hidromiel"
```

Trabajo:

- [x] Confirmar actividad actual con web oficial o redes activas.
- [x] Revisar apicultores sin web con fuentes recientes; si no hay fuente primaria, mantener `parcial`.
- [x] Separar hidromiel/cerveza con ecommerce real de formularios informativos.

## Orden recomendado

1. Cerrar lotes 7, 6, 8, 9, 10 y 11 para resolver las 113 filas no bodega y crear patrón de evidencia.
2. Cerrar bodegas por región: lote 1, lote 2, lote 3, lote 4 y lote 5.
3. Hacer un pase de imágenes solo después de cerrar identidad/verificación; usar `npx pnpm enrich:images --provincia la-rioja` en dry-run y aplicar por `--slug` únicamente cuando el candidato sea inequívoco.
4. Revisar gaps de redes sociales solo si hay fuente oficial clara; no añadir redes dudosas para cumplir porcentaje.
5. Ejecutar `npx pnpm check:csv:changed` y `npx pnpm check:evidence:changed` durante la iteración.
6. Antes de cerrar el pase completo, ejecutar `npx pnpm verify:data`.

## Cierre de cada lote

- Actualizar CSV y evidencia en el mismo cambio.
- El lote no se considera cerrado si quedan filas `pendiente` sin una nota de bloqueo.
- Los `Venta online=sí` deben tener `Canal de venta`.
- Las bajas/fusiones deben quedar explicadas en evidencia JSONL.
- Al cerrar un lote, anotar aquí fecha, resultado y riesgos residuales.

## Ola 3 · venta sin resolver (2026-07-29)

- La cola baja de **114 a 106**: se confirman **5** canales remotos y se retiran **3** filas que
  no debían contar como productores independientes. Estado actual de venta: **161 `sí` · 146
  `no` · 106 `no comprobado`**.
- Ecommerce confirmado y campos enriquecidos para Isul, Miel Llaría, Chocolates Peñaquel y Abel
  Mendoza; Bodegas Gregorio Martínez admite pedidos por correo o teléfono y envíos nacionales.
- Dos categorías `Aceite` ocultaban duplicados: `cornelio-vega-vella-navarrete` se fusiona en
  `bodegas-cornelio-dinastia-s-l-navarrete` y `valbornedo-navarrete` en
  `senorio-de-valbornedo-s-coop-navarrete`. Las filas supervivientes reciben vinos, descripción,
  dirección y contacto reales.
- `cafe-electi-logrono` se elimina: la fuente propia y la actividad empresarial sostienen una
  tienda especializada, no tostado ni elaboración propia.
- Estado editorial actual: **413 filas · 308 `verificado` · 105 `parcial` · 0 `pendiente`**.
  Quedan actualizados CSV y los diez registros de evidencia afectados.
