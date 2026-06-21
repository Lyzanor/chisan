# Verificación Guipúzcoa

> Documento de trabajo para iniciar la verificación completa de
> `data/csv/pais-vasco/guipuzcoa.csv`.
>
> Generado el 2026-06-18 desde el CSV actual, sin nueva investigación web. Estas
> notas no son fuente de verdad ni evidencia estructurada: las decisiones que
> cambien CSV deben quedar en `data/evidence/pais-vasco/guipuzcoa.jsonl`.

## Foto inicial

- CSV: `data/csv/pais-vasco/guipuzcoa.csv`.
- Filas: 174 productores en 60 municipios.
- Estado editorial: 91 `pendiente`, 83 `parcial`, 0 `verificado`.
- Venta online: 26 `sí`, 16 `no`, 132 `no comprobado`.
- `Canal de venta`: 174 vacíos; los 26 `Venta online=sí` necesitan backfill.
- Cobertura de campos: 150 con web, 120 con teléfono, 91 con correo, 74 con alguna red social, 94 con imagen, 174 con Google Maps.
- Riesgos actuales: 24 sin web, 80 sin imagen, 135 warnings de calidad, sin errores bloqueantes en el audit de calidad.
- Evidencia: Guipúzcoa no está todavía en cobertura estricta; `coverage.json` solo exige `pais-vasco/alava` y `pais-vasco/vizcaya`.

## Objetivo de la verificación

1. Confirmar existencia y actividad actual de cada productor.
2. Resolver `verificacion`: `verificado`, `parcial` o decisión de baja/fusión cuando proceda.
3. Resolver `Venta online`: `sí`, `no` o `no comprobado`; si queda `sí`, rellenar `Canal de venta`.
4. Revisar nombre, municipio, categoría, productos estrella, contacto, web, redes, Google Maps, coordenadas e imagen.
5. Registrar cada decisión relevante en `data/evidence/pais-vasco/guipuzcoa.jsonl`.
6. Al final del pase, dejar la provincia preparada para entrar en cobertura estricta de evidencia.

## Criterio por fila

- `verificado`: fuente oficial vigente del productor o registro sectorial fiable más una ubicación consistente; para venta online, checkout/canal vivo comprobado en el sitio o canal propio.
- `parcial`: existe evidencia razonable, pero falta confirmación directa, actividad reciente clara o un campo dinámico.
- `pendiente`: solo debe permanecer si se aplaza explícitamente la fila por falta de tiempo o bloqueo.
- `Venta online=sí`: requiere canal real actual; usar `Canal de venta` con `ecommerce`, `whatsapp`, `email`, `telefono`, `suscripcion` o `marketplace`.
- `Venta online=no`: usar cuando la fuente indica venta directa/local sin canal remoto, o cuando la tienda no existe tras comprobación suficiente.
- Bajas/fusiones: documentar en evidencia antes de eliminar o fusionar; no dejar la decisión solo en estas notas.

## Fuentes de arranque

- Bodegas: DO Getariako Txakolina, webs oficiales, Google Maps, tienda propia.
- Sidra: Euskal Sagardoa, asociaciones/directorios de sagardotegiak, webs oficiales, Google Maps.
- Quesos/lácteos: DOP Idiazabal, Artzai Gazta, Baserrikoa/Euskal Produktuak, webs oficiales.
- Producto Eusko Label y baserri: Eusko Label, Baserrikoa, Euskal Produktuak, azoka/feria municipal.
- Pescado y conservas: cofradías, webs oficiales, Google Maps, registros sectoriales fiables.
- Obradores y cerveza: web propia, tienda online, Google Maps, redes activas y directorios locales solo como apoyo.

## Lotes principales

| Lote | Alcance | Filas | Pendiente | Parcial | Venta online `no comprobado` | Riesgo inicial |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| 1 | Bodega / txakoli | 22 | 8 | 14 | 12 | Cerrado 2026-06-18; 22 `verificado` |
| 2 | Sidra | 38 | 16 | 22 | 33 | Cerrado 2026-06-18; 35 `verificado`, 3 `parcial` |
| 3 | Lácteos y quesos | 51 | 38 | 13 | 44 | Cerrado 2026-06-18; 48 filas conservadas y 3 fusiones |
| 4 | Mar y sal | 10 | 4 | 6 | 6 | Cerrado 2026-06-18; 9 `verificado`, 1 `parcial` |
| 5 | Vegetal / despensa | 21 | 10 | 11 | 14 | Cerrado 2026-06-18; 11 `verificado`, 10 `parcial` |
| 6 | Cárnicos / huevos / patés | 11 | 8 | 3 | 10 | Cerrado 2026-06-19; 5 `verificado`, 6 `parcial` |
| 7 | Obradores / cerveza / miel | 21 | 7 | 14 | 13 | Cerrado 2026-06-19; 19 conservadas y 2 bajas |

Total inicial: 174 filas. Tras cerrar los lotes 2-5 quedan 171 filas por las
3 fusiones documentadas en lácteos y quesos. Tras cerrar los lotes 6-7 quedan
169 filas: 122 `verificado`, 47 `parcial` y 0 `pendiente`.

## Lote 1 - Bodega / txakoli

Estado inicial: 22 filas, 8 pendientes, 14 parciales, 8 con `Venta online=sí` y sin `Canal de venta`.

Estado 2026-06-18: cerrado. Las 22 filas quedaron `verificado`; 15 con `Venta online=sí`, 6 con `Venta online=no` y 1 con `Venta online=no comprobado` (`bodega-elkano-getaria`, web propia no accesible durante la revisión).

Comando de arranque:

```bash
npx pnpm list:province guipuzcoa --categoria "Bodega"
```

Trabajo:

- [x] Contrastar todas las bodegas contra DO Getariako Txakolina y web oficial.
- [x] Confirmar si cada web tiene tienda, formulario de compra, reservas no alimentarias o solo información.
- [x] Backfill de `Canal de venta` para los `sí`: `ecommerce`, `email` o `telefono` según fuente comprobada.
- [ ] Revisar imágenes pendientes en un pase visual posterior; no se aplicaron imágenes automáticas en este lote.
- [x] Evidencia mínima por fila: existencia/actividad, pertenencia DO si aplica, venta online y decisión de `verificacion`.

Notas de cierre:

- `bodega-gorosti-flysch-txakolina-zumaia`: se mantiene el slug estable, pero el municipio/dirección pasan a Deba porque web oficial y DO lo sitúan en Elorriaga / Itziar-Deba.
- `bodega-elkano-getaria`: queda `verificado` con DO + social oficial, pero `Venta online=no comprobado` porque la web propia no respondió y no se localizó canal remoto fiable.
- Los canales con carrito se codificaron como `ecommerce`; los formularios o pedidos por contacto se codificaron como `email`/`telefono`.

## Lote 2 - Sidra

Estado inicial: 38 filas, 16 pendientes, 22 parciales, 33 con `Venta online=no comprobado`, 5 sin web, 14 sin imagen.

Estado 2026-06-18: cerrado. Las 38 filas quedaron revisadas; 35 `verificado`
y 3 `parcial`. Venta online: 23 `sí`, 12 `no`, 3 `no comprobado`; los 23
`sí` tienen `Canal de venta`.

Subdividir para no mezclar decisiones:

- 2A: Astigarraga (9), Hernani (5), Donostia / San Sebastián (4).
- 2B: Usurbil (3), Aduna (2), Aia (2), Andoain (2).
- 2C: Altzaga, Asteasu, Ataun, Errenteria, Irun, Legorreta, Ordizia, Tolosa, Urnieta, Zerain, Zestoa.

Comando de arranque:

```bash
npx pnpm list:province guipuzcoa --categoria "Sidra"
```

Trabajo:

- [x] Verificar actividad real de sidrería/productor, no solo restaurante de temporada.
- [x] Separar venta de botella/productos de reserva de mesa; reserva no justifica `Venta online=sí`.
- [x] Usar Euskal Sagardoa y web oficial como fuente primaria cuando existan.
- [x] Las filas sin web requieren confirmación con Google Maps, directorio sectorial o fuente municipal fiable; si solo queda un listado genérico, mantener `parcial`.

Notas de cierre:

- `sarasola-asteasu`, `alorrenea-sagardotegia-astigarraga` e `itxasburu-sagardotegia-hernani` quedan `parcial/no comprobado` por falta de fuente primaria suficiente o web no concluyente.
- La venta de botella en Sagardoa Route/Euskal Sagardoa se codificó como `marketplace`; tiendas propias como `ecommerce`.
- Las webs de restaurante/reserva sin compra remota de producto quedaron `Venta online=no`.

## Lote 3 - Lácteos y quesos

Estado inicial: 51 filas, 38 pendientes, 13 parciales, 44 con `Venta online=no comprobado`, 12 sin web, 32 sin imagen.

Estado 2026-06-18: cerrado. Se conservan 48 filas y se documentan 3 fusiones.
Resultado de las filas conservadas: 25 `verificado`, 23 `parcial`, 15 con
`Venta online=sí` y canal cumplimentado.

Subdividir por concentración:

- 3A: Idiazabal, Olaberria, Segura, Zerain, Zegama, Ordizia, Lazkao, Gabiria, Ataun, Zaldibia.
- 3B: Oñati, Aretxabaleta, Eskoriatza, Mutiloa, Legazpi, Antzuola, Eibar, Elgoibar, Soraluze, Mutriku.
- 3C: Aia, Azpeitia, Beizama, Asteasu, Berastegi, Donostia / San Sebastián, Errenteria, Leaburu, Oiartzun, Orendain, Orexa, Urnieta.

Comando de arranque:

```bash
npx pnpm list:province guipuzcoa --categoria "Lácteos y quesos"
```

Trabajo:

- [x] Contrastar DOP Idiazabal/Artzai Gazta cuando el producto estrella lo menciona.
- [x] Revisar si son productores con elaboración propia o solo tiendas/espacios de venta.
- [x] Resolver las 12 filas sin web con fuentes oficiales o sectoriales; si no hay actividad actual, marcar para baja/fusión.
- [ ] No completar imágenes en bloque con `--apply`: revisar candidato por productor y aplicar solo logos/fotos de marca reales.

Notas de cierre:

- Fusionados como duplicados: `ander-barandiaran-mujika-idiazabal` -> `gaztanaditxulo-gaztandegia-idiazabal`, `eneko-goiburu-segura` -> `ondarre-gazta-segura` y `berastegi-elkartea-sc-azpeitia` -> `xoxote-gazta-azpeitia`.
- Las fuentes de registro sectorial sin web oficial actual se mantienen `parcial`; las webs/tiendas oficiales pasan a `verificado` cuando sostienen identidad, actividad y municipio.
- No se aplicaron imágenes en este pase.

## Lote 4 - Mar y sal

Incluye `Pescado y conservas`, `Pescado y marisco` y `Sal`: 10 filas, 4 pendientes, 6 parciales.

Estado 2026-06-18: cerrado. Las 10 filas quedaron revisadas; 9 `verificado`
y 1 `parcial`. Venta online: 8 `sí`, 1 `no`, 1 `no comprobado`; los 8 `sí`
tienen canal.

Comandos:

```bash
npx pnpm list:province guipuzcoa --categoria "Pescado y conservas"
npx pnpm list:province guipuzcoa --categoria "Pescado y marisco"
npx pnpm list:province guipuzcoa --categoria "Sal"
```

Trabajo:

- [x] Confirmar que la fila representa productor/obrador/cofradía con producto propio, no solo comercio o restaurante.
- [x] En conserveras, distinguir tienda online propia de marketplace o catálogo sin compra.
- [x] Revisar coordenadas de puerto/obrador cuando la dirección sea genérica.

Notas de cierre:

- `itsasoko-lasarte-oria` mantiene el slug estable, pero queda como `Itsasoko / Txangu2 Gourmet` con sede corregida a Irun.
- `conservas-oliveri-getaria` queda `parcial/no comprobado`: hay web del grupo, pero no fuente suficiente para cerrar venta remota actual de conserva propia.
- Sal de Dorleta queda `sí/marketplace` por la venta enlazada desde la web oficial del museo.

## Lote 5 - Vegetal / despensa

Incluye `Fruta y verdura`, `Despensa artesanal`, `Conservas vegetales`, `Productos ecológicos`, `Legumbres` y `Aceite`: 21 filas, 10 pendientes, 11 parciales.

Estado 2026-06-18: cerrado. Las 21 filas quedaron revisadas; 11 `verificado`
y 10 `parcial`. Venta online: 9 `sí`, 5 `no`, 7 `no comprobado`; los 9 `sí`
tienen canal.

Comandos:

```bash
npx pnpm list:province guipuzcoa --categoria "Fruta y verdura"
npx pnpm list:province guipuzcoa --categoria "Despensa artesanal"
npx pnpm list:province guipuzcoa --categoria "Legumbres"
```

Trabajo:

- [x] Revisar piparras/Ibarra y alubia de Tolosa contra fuentes sectoriales o municipales.
- [x] Confirmar si las huertas/eco tienen venta directa, feria, suscripcion, WhatsApp o ecommerce.
- [x] No elevar a `verificado` una explotación que solo aparece en una noticia antigua sin fuente actual.

Notas de cierre:

- Productores con fuentes oficiales recientes, como Lizardi, Beraseta, Ibarlur, Txumitxa, Zubelzu o Karabeleko, quedaron cerrados con canal cuando procedía.
- Alubia de Tolosa y algunos baserris documentados por fuente municipal, feria o prensa quedan `parcial` si no hay canal propio actual.
- No se aplicaron imágenes en este pase.

## Lote 6 - Cárnicos / huevos / patés

Incluye `Charcutería`, `Huevos` y `Patés`: 11 filas, 8 pendientes, 3 parciales, 4 sin web.

Estado 2026-06-19: cerrado. Las 11 filas quedaron revisadas; 5 `verificado`
y 6 `parcial`. Venta online: 3 `sí`, 3 `no`, 5 `no comprobado`; los 3
`sí` tienen `Canal de venta`.

Comandos:

```bash
npx pnpm list:province guipuzcoa --categoria "Charcutería"
npx pnpm list:province guipuzcoa --categoria "Huevos"
npx pnpm list:province guipuzcoa --categoria "Patés"
```

Trabajo:

- [x] Separar productor/ganadero de carnicería minorista sin producción propia.
- [x] Confirmar carne Eusko Label, granja, obrador o elaboración propia con fuente fiable.
- [x] Las filas sin web requieren especial cuidado: Google Maps y directorio local no bastan para `verificado` si no prueban producción propia.

Notas de cierre:

- `oihanalde-irun`, `ezkurtxerri-getaria` y `basatxerri-zestoa` quedan con `Venta online=sí`; los dos primeros se cierran con tienda oficial y Basatxerri queda `parcial` por depender de BaserriaKm0/Maps para la identidad.
- `euskaber-zaldibia`, `borda-baserria-olaberria` y `pates-zubia-eskoriatza` se cierran con fuente oficial y contacto actualizado.
- `okelgintza-zestoa`, `huevos-gorrotxategi-idiazabal`, `etxezarreta-harategia-lasarte-oria`, `munagorri-harategia-tolosa` y `pineda-harategia-hernani` quedan `parcial/no comprobado` por falta de fuente primaria concluyente.

## Lote 7 - Obradores / cerveza / miel

Incluye `Pan y pastelería`, `Dulces`, `Chocolate`, `Helados`, `Miel` y `Cerveza artesana`: 21 filas, 7 pendientes, 14 parciales.

Estado 2026-06-19: cerrado. De 21 filas iniciales se conservan 19 y se
documentan 2 bajas por `other-province`. Resultado de las filas conservadas:
15 `verificado`, 4 `parcial`; venta online: 10 `sí`, 5 `no`, 4
`no comprobado`; los 10 `sí` tienen `Canal de venta`.

Comandos:

```bash
npx pnpm list:province guipuzcoa --categoria "Pan y pastelería"
npx pnpm list:province guipuzcoa --categoria "Cerveza artesana"
npx pnpm list:province guipuzcoa --categoria "Miel"
```

Trabajo:

- [x] Confirmar elaboración propia frente a tienda/cafetería.
- [x] Revisar tiendas online de obradores y cerveceras; si hay venta, rellenar `Canal de venta`.
- [x] Para miel, priorizar apicultor/marca propia y evitar fichas comerciales sin trazabilidad.

Notas de cierre:

- Bajas documentadas: `mala-gissona-oiartzun` y `bidassoa-basque-brewery-irun`, porque las fuentes actuales sitúan la producción en Noáin, Navarra; la presencia guipuzcoana vigente es taproom/bar, no productor provincial.
- `cervezas-olaneta-errenteria` se conserva como `Destilería Licorera Vasca Olañeta` y pasa de `Cerveza artesana` a `Licores`.
- `lurka-chocolate-donostia-san-sebastian` queda `parcial/no comprobado`: la marca está respaldada por prensa reciente, pero la web propia aparece suspendida.
- `galparsoro-okindegia-donostia-san-sebastian` sube a `verificado/sí` tras confirmar fuente oficial con compra online para recogida.
- `mellifera-larraul` sube a `verificado/no comprobado` tras recuperar fuente oficial activa de apicultura sostenible y productos de la colmena.
- `pagoa-basque-beer-oiartzun` y `cervezas-olaneta-errenteria` siguen `parcial/no comprobado` para un pase futuro con fuente primaria.

## Pases transversales

### Venta online y canal

Al cierre principal hay 85 filas con `Venta online=sí` y todas tienen
`Canal de venta`. Si en un pase futuro no se puede confirmar un canal, bajar
`Venta online` a `no comprobado` y documentar evidencia.

### Evidencia

`data/evidence/pais-vasco/guipuzcoa.jsonl` recoge las decisiones de este pase.
Cada fila resuelta debe tener evidencia para:

- existencia o actividad del productor;
- pertenencia a DOP/IGP/Eusko Label/directorio cuando sea el soporte principal;
- venta online y canal cuando se cambie o confirme;
- baja, fusión o cambio de `verificacion`.

### Imágenes

Tras el cierre principal, 77 filas no tienen `imagen`. El cierre de provincia no necesita forzar imagen para todas, pero cada lote debe:

- validar que las imágenes existentes siguen apuntando a archivos reales;
- buscar imagen solo si hay candidato oficial claro;
- usar `npx pnpm enrich:images --provincia guipuzcoa --apply --slug <slug>` solo tras revisar que el top candidate sea logo/foto genuina.

## Protocolo de cada lote

1. Ejecutar el `list:province` del lote y detectar duplicados obvios antes de investigar.
2. Revisar fuente oficial, registro sectorial y Google Maps por productor.
3. Editar solo las filas del lote en `data/csv/pais-vasco/guipuzcoa.csv`.
4. Escribir o actualizar las líneas correspondientes en `data/evidence/pais-vasco/guipuzcoa.jsonl`.
5. Actualizar o limpiar estas notas si aparece un candidato rechazado, fusionado o ya presente.
6. Validar iteración:

```bash
npx pnpm check:csv:changed
npx pnpm check:evidence:changed
```

7. Validar cierre de provincia:

```bash
npx pnpm verify:data
```

## Registro de avance

| Fecha | Lote | Estado | Notas |
| --- | --- | --- | --- |
| 2026-06-18 | Plan inicial | abierto | Documento creado desde CSV actual; sin verificación web nueva. |
| 2026-06-18 | 1 - Bodega / txakoli | cerrado | 22 filas revisadas; evidencia creada en `data/evidence/pais-vasco/guipuzcoa.jsonl`. |
| 2026-06-18 | 2 - Sidra | cerrado | 38 filas revisadas; 35 `verificado`, 3 `parcial`, sin pendientes. |
| 2026-06-18 | 3 - Lácteos y quesos | cerrado | 48 filas conservadas y 3 fusiones documentadas; sin pendientes. |
| 2026-06-18 | 4 - Mar y sal | cerrado | 10 filas revisadas; venta online/canal cerrado salvo Oliveri `no comprobado`. |
| 2026-06-18 | 5 - Vegetal / despensa | cerrado | 21 filas revisadas; 9 canales de venta completados, sin pendientes. |
| 2026-06-19 | 6 - Cárnicos / huevos / patés | cerrado | 11 filas revisadas; 5 `verificado`, 6 `parcial`, sin pendientes. |
| 2026-06-19 | 7 - Obradores / cerveza / miel | cerrado | 19 filas conservadas y 2 bajas `other-province`; sin pendientes. |
| 2026-06-19 | Cierre principal | cerrado | Guipúzcoa queda en 169 filas, 122 `verificado`, 47 `parcial` y sin `pendiente`; entra en cobertura estricta. |
