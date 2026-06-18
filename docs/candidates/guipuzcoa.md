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
| 2 | Sidra | 38 | 16 | 22 | 33 | bloque grande; dividir por municipios sidreros |
| 3 | Lácteos y quesos | 51 | 38 | 13 | 44 | mayor carga pendiente; 12 sin web, 32 sin imagen |
| 4 | Mar y sal | 10 | 4 | 6 | 6 | revisar cofradías, conserveras y venta directa |
| 5 | Vegetal / despensa | 21 | 10 | 11 | 14 | piparras, huerta, legumbre, aceite y eco |
| 6 | Cárnicos / huevos / patés | 11 | 8 | 3 | 10 | 4 sin web; alto riesgo de directorio antiguo |
| 7 | Obradores / cerveza / miel | 21 | 7 | 14 | 13 | varias ventas online; confirmar canales y actividad |

Total: 174 filas.

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

Subdividir para no mezclar decisiones:

- 2A: Astigarraga (9), Hernani (5), Donostia / San Sebastián (4).
- 2B: Usurbil (3), Aduna (2), Aia (2), Andoain (2).
- 2C: Altzaga, Asteasu, Ataun, Errenteria, Irun, Legorreta, Ordizia, Tolosa, Urnieta, Zerain, Zestoa.

Comando de arranque:

```bash
npx pnpm list:province guipuzcoa --categoria "Sidra"
```

Trabajo:

- Verificar actividad real de sidrería/productor, no solo restaurante de temporada.
- Separar venta de botella/productos de reserva de mesa; reserva no justifica `Venta online=sí`.
- Usar Euskal Sagardoa y web oficial como fuente primaria cuando existan.
- Las filas sin web requieren confirmación con Google Maps, directorio sectorial o fuente municipal fiable; si solo queda un listado genérico, mantener `parcial`.

## Lote 3 - Lácteos y quesos

Estado inicial: 51 filas, 38 pendientes, 13 parciales, 44 con `Venta online=no comprobado`, 12 sin web, 32 sin imagen.

Subdividir por concentración:

- 3A: Idiazabal, Olaberria, Segura, Zerain, Zegama, Ordizia, Lazkao, Gabiria, Ataun, Zaldibia.
- 3B: Oñati, Aretxabaleta, Eskoriatza, Mutiloa, Legazpi, Antzuola, Eibar, Elgoibar, Soraluze, Mutriku.
- 3C: Aia, Azpeitia, Beizama, Asteasu, Berastegi, Donostia / San Sebastián, Errenteria, Leaburu, Oiartzun, Orendain, Orexa, Urnieta.

Comando de arranque:

```bash
npx pnpm list:province guipuzcoa --categoria "Lácteos y quesos"
```

Trabajo:

- Contrastar DOP Idiazabal/Artzai Gazta cuando el producto estrella lo menciona.
- Revisar si son productores con elaboración propia o solo tiendas/espacios de venta.
- Resolver las 12 filas sin web con fuentes oficiales o sectoriales; si no hay actividad actual, marcar para baja/fusión.
- No completar imágenes en bloque con `--apply`: revisar candidato por productor y aplicar solo logos/fotos de marca reales.

## Lote 4 - Mar y sal

Incluye `Pescado y conservas`, `Pescado y marisco` y `Sal`: 10 filas, 4 pendientes, 6 parciales.

Comandos:

```bash
npx pnpm list:province guipuzcoa --categoria "Pescado y conservas"
npx pnpm list:province guipuzcoa --categoria "Pescado y marisco"
npx pnpm list:province guipuzcoa --categoria "Sal"
```

Trabajo:

- Confirmar que la fila representa productor/obrador/cofradía con producto propio, no solo comercio o restaurante.
- En conserveras, distinguir tienda online propia de marketplace o catálogo sin compra.
- Revisar coordenadas de puerto/obrador cuando la dirección sea genérica.

## Lote 5 - Vegetal / despensa

Incluye `Fruta y verdura`, `Despensa artesanal`, `Conservas vegetales`, `Productos ecológicos`, `Legumbres` y `Aceite`: 21 filas, 10 pendientes, 11 parciales.

Comandos:

```bash
npx pnpm list:province guipuzcoa --categoria "Fruta y verdura"
npx pnpm list:province guipuzcoa --categoria "Despensa artesanal"
npx pnpm list:province guipuzcoa --categoria "Legumbres"
```

Trabajo:

- Revisar piparras/Ibarra y alubia de Tolosa contra fuentes sectoriales o municipales.
- Confirmar si las huertas/eco tienen venta directa, feria, suscripcion, WhatsApp o ecommerce.
- No elevar a `verificado` una explotación que solo aparece en una noticia antigua sin fuente actual.

## Lote 6 - Cárnicos / huevos / patés

Incluye `Charcutería`, `Huevos` y `Patés`: 11 filas, 8 pendientes, 3 parciales, 4 sin web.

Comandos:

```bash
npx pnpm list:province guipuzcoa --categoria "Charcutería"
npx pnpm list:province guipuzcoa --categoria "Huevos"
npx pnpm list:province guipuzcoa --categoria "Patés"
```

Trabajo:

- Separar productor/ganadero de carnicería minorista sin producción propia.
- Confirmar carne Eusko Label, granja, obrador o elaboración propia con fuente fiable.
- Las filas sin web requieren especial cuidado: Google Maps y directorio local no bastan para `verificado` si no prueban producción propia.

## Lote 7 - Obradores / cerveza / miel

Incluye `Pan y pastelería`, `Dulces`, `Chocolate`, `Helados`, `Miel` y `Cerveza artesana`: 21 filas, 7 pendientes, 14 parciales.

Comandos:

```bash
npx pnpm list:province guipuzcoa --categoria "Pan y pastelería"
npx pnpm list:province guipuzcoa --categoria "Cerveza artesana"
npx pnpm list:province guipuzcoa --categoria "Miel"
```

Trabajo:

- Confirmar elaboración propia frente a tienda/cafetería.
- Revisar tiendas online de obradores y cerveceras; si hay venta, rellenar `Canal de venta`.
- Para miel, priorizar apicultor/marca propia y evitar fichas comerciales sin trazabilidad.

## Pases transversales

### Venta online y canal

Hay 26 filas con `Venta online=sí` y `Canal de venta` vacío. Al cerrar cada lote, corregir el canal en la misma edición. Si el canal no se puede confirmar, bajar `Venta online` a `no comprobado` y documentar evidencia.

### Evidencia

Crear `data/evidence/pais-vasco/guipuzcoa.jsonl` al empezar el primer lote real. Cada fila resuelta debe tener evidencia para:

- existencia o actividad del productor;
- pertenencia a DOP/IGP/Eusko Label/directorio cuando sea el soporte principal;
- venta online y canal cuando se cambie o confirme;
- baja, fusión o cambio de `verificacion`.

### Imágenes

80 filas no tienen `imagen`. El cierre de provincia no necesita forzar imagen para todas, pero cada lote debe:

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
