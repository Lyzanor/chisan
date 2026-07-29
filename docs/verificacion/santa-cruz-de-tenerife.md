# Verificación provincial de Santa Cruz de Tenerife

Pasada editorial por lotes sobre `data/csv/canarias/santa-cruz-de-tenerife.csv`.
El CSV es la fuente de verdad; la procedencia vive en
`data/evidence/canarias/santa-cruz-de-tenerife.jsonl`. Este ledger solo conserva
avance, riesgos locales y límites de cada lote.

## Definición de completado

- Cero filas `pendiente`; `parcial` es un resultado válido cuando la mejor
  evidencia disponible no permite `verificado`.
- Cada fila revisada resuelve identidad, actividad productora, municipio y
  alcance antes de decidir su estado.
- `Venta online=sí` exige un mecanismo remoto operativo y su canal; un catálogo,
  una tienda física o la reventa por terceros no bastan.
- Purgas, fusiones y cambios materiales de slug dejan evidencia trazable y
  actualizan imágenes y notas afectadas.
- Se cierran los candidatos y se ejecuta `npx pnpm verify:data`.

## Estado

- Snapshot inicial (2026-07-19): **151 filas**; **24 `verificado`**, **18
  `parcial`** y **109 `pendiente`**. Venta online: **9 `sí`** y **142 `no
  comprobado`**. Evidencia previa: **42 registros**, procedentes sobre todo de
  las integraciones de candidatos vitivinícolas de julio.
- Tras SC-01: **151 filas**; **35 `verificado`**, **19 `parcial`** y **97
  `pendiente`**. Venta online: **15 `sí`** y **136 `no comprobado`**. Se
  resolvieron 12 bodegas: 11 verificadas y Envínate parcial; 6 ecommerce; se
  corrigieron dos identidades geográficas con `merge`.
- Tras SC-02: **149 filas**; **41 `verificado`**, **27 `parcial`** y **81
  `pendiente`**. Venta online: **18 `sí`** y **131 `no comprobado`**. Se
  resolvieron las 16 bodegas restantes: 6 verificadas, 8 parciales y 2 filas
  absorbidas por duplicidad; hubo cuatro correcciones adicionales de slug por
  municipio y tres canales de venta remota confirmados.
- Tras SC-03: **147 filas**; **41 `verificado`**, **30 `parcial`** y **76
  `pendiente`**. Venta online: **18 `sí`** y **129 `no comprobado`**. De las
  cinco filas de aceite, tres quedan parciales, Oleoteide se fusiona con
  Cumbres de Abona y la ficha sintética Finca Las Manchas se purga. Lercaro se
  corrige de La Orotava a Tacoronte y OleoTenerife a Oleoarona.
- Tras SC-04: **140 filas**; **43 `verificado`**, **33 `parcial`** y **64
  `pendiente`**. Venta online: **18 `sí`** y **122 `no comprobado`**. De las 12
  primeras queserías, Montesdeoca y Benijos quedan verificadas, Pinolere, La
  Florida y Palmera parciales, la antigua Quesería de Arico se purga por cierre
  y otras seis filas por inexistencia o falta de actividad comercial propia.
- Tras SC-05: **134 filas**; **45 `verificado`**, **37 `parcial`** y **52
  `pendiente`**. Venta online: **18 `sí`** y **116 `no comprobado`**. De las 12
  queserías restantes, El Guanche y la Cooperativa Ganaderos de El Hierro quedan
  verificadas; Luna de Awara, Las Cuevas, Aborigen y Sotera quedan parciales. Se
  purgan cinco fichas sintéticas o sin unidad comercial y se absorbe el pack
  genérico Queso Herreño y Gofio en la cooperativa real.
- Tras SC-06: **125 filas**; **49 `verificado`**, **39 `parcial`** y **37
  `pendiente`**. Venta online: **21 `sí`** y **104 `no comprobado`**. De las 15
  filas de charcutería se conservan seis: Madre del Agua, Meat Boutique,
  Discarten y Montesano quedan verificadas; La Peña y Boutique de la Carne,
  parciales. Se purgan nueve fichas sintéticas o fuera de alcance y se corrige
  el centro productor de Montesano de La Laguna a El Rosario.
- Tras SC-07: **115 filas**; **52 `verificado`**, **44 `parcial`** y **19
  `pendiente`**. Venta online: **23 `sí`** y **92 `no comprobado`**. De las 18
  filas de pan y pastelería se conservan ocho: Sana Locura, La Casa del Panadero
  y Zulay quedan verificadas; 100% Pan, La Princesa, Casa Egon, Las Cabezadas y
  Barco de La Virgen, parciales. Se purgan diez fichas sintéticas, La Casa del
  Panadero se corrige a su obrador de Puerto de la Cruz, Zulay al de
  Fuencaliente y Las Cabezadas de El Paso a Barlovento; Sana Locura y Zulay
  aportan dos canales remotos confirmados.
- Tras SC-08: **105 filas**; **60 `verificado`**, **45 `parcial`** y **0
  `pendiente`**. Venta online: **28 `sí`** y **77 `no comprobado`**. Se
  conservan nueve de las 19 filas: La Molineta, Tacoa, Chutney, Isla Verde,
  Salinas de Fuencaliente, COPLACA, FAST e Imendi quedan verificadas y Molino
  El Sauzal, parcial. Se purgan nueve fichas sintéticas o denominaciones
  geográficas sin productor, y Flor de Sal se integra como producto de las
  Salinas; cinco canales remotos quedan confirmados.
- Tras SC-09 (cierre): **105 filas**; **59 `verificado`**, **46 `parcial`** y
  **0 `pendiente`**. Se auditaron las 42 integraciones recientes y su coherencia
  con la evidencia; Presas Ocampo baja a parcial porque solo conserva respaldo
  institucional/regulatorio inspeccionable. Las tres pistas de Anaga sin enlace
  verificable quedan cerradas sin alta. La provincia no dispone aún de imágenes
  locales; es un hueco opcional de enriquecimiento, no un bloqueo editorial.

## Reglas y riesgos locales

1. La provincia contiene cuatro islas. Confirmar siempre la unidad productiva y
   el municipio; no asumir que «Tenerife» identifica un municipio válido.
2. En vino, distinguir bodega, finca y marca. Altos de Trevejos tiene viñedos en
   Vilaflor, pero la bodega está en San Miguel de Abona. Una marca inscrita en
   varias DO no crea varias unidades productivas.
3. Los consejos reguladores son fuentes de apoyo y por sí solos dejan la fila en
   `parcial`. Una web propia caída o ilegible no demuestra cierre.
4. La tienda colectiva de una cooperativa o grupo cuenta cuando vende por cuenta
   del productor; la reventa de una vinoteca independiente no.
5. En queserías, no convertir explotaciones REGA ni premios aislados en
   productores vendibles sin identidad comercial actual.
6. Las filas de miel DOP, plátano, sal y gofio pueden representar entidades
   colectivas o productos; confirmar que existe una unidad productiva o
   comercializadora dentro del alcance antes de mantenerlas.

## Worklist

Los límites se congelan por categoría y orden del CSV. Si una fusión o purga
altera el recuento, se conserva el conjunto de slugs previsto y se documenta el
cambio, sin incorporar hallazgos ajenos al lote activo.

| Lote | Alcance | Pendientes al abrir | Estado | Resultado |
|---|---|---:|---|---|
| SC-01 | Primeras bodegas, `bodegas-monje-el-sauzal` → antiguo `bodegas-el-penitente-la-orotava` | 12 | ✅ 2026-07-19 | 11 verificadas, 1 parcial, 6 ecommerce; merges de Altos de Trevejos a San Miguel de Abona y El Penitente a Arautava |
| SC-02 | Bodegas restantes, `bodega-crater-el-sauzal` → `bodegas-insulares-licores-tacoronte` | 16 | ✅ 2026-07-19 | 6 verificadas, 8 parciales y 2 duplicados fusionados; 4 slugs geográficos corregidos; 3 canales remotos confirmados |
| SC-03 | Aceites | 5 | ✅ 2026-07-19 | 3 parciales, 1 marca fusionada con su cooperativa y 1 ficha sintética purgada; 2 identidades geográficas corregidas |
| SC-04 | Queserías, primera mitad | 12 | ✅ 2026-07-19 | 2 verificadas, 3 parciales y 7 purgas; 1 de las parciales corrige slug y municipio; Quesería de Arico cerrada desde 2010 |
| SC-05 | Queserías, segunda mitad | 12 | ✅ 2026-07-19 | 2 verificadas, 4 parciales, 5 purgas y 1 duplicado absorbido; 5 identidades o slugs corregidos |
| SC-06 | Charcutería | 15 | ✅ 2026-07-19 | 4 verificadas, 2 parciales y 9 purgas; Montesano corregida a El Rosario; 3 canales remotos confirmados |
| SC-07 | Pan y pastelería | 18 | ✅ 2026-07-19 | 3 verificadas, 5 parciales y 10 purgas; La Casa del Panadero, Zulay y Las Cabezadas corrigen municipio; 2 ventas remotas confirmadas |
| SC-08 | Despensa: otros, cerveza y miel | 19 | ✅ 2026-07-19 | 8 verificadas, 1 parcial, 9 purgas y 1 producto duplicado; 5 ventas remotas confirmadas; cero pendientes |
| SC-09 | Auditoría transversal, 42 filas ya no pendientes y candidatos diferidos | 42 + 3 candidatos | ✅ 2026-07-19 | Evidencia y decisiones coherentes salvo Presas Ocampo, corregida a parcial; candidatos sin fuente cerrados sin alta; imágenes opcionales pendientes de enriquecimiento |

## Incidencias reutilizables

- **Frontos:** la venta y atención física en bodega están temporalmente
  cerradas, pero la actividad y visitas siguen vigentes; sus vinos continúan
  disponibles en la tienda oficial del grupo. No interpretar el aviso como
  cierre empresarial.
- **Envínate:** el consejo de la DO confirma identidad, actividad y Santiago del
  Teide, pero el dominio propio no fue legible en la revisión del 2026-07-19;
  queda `parcial`, no purgada.
- **Tajinaste:** la mención «Tienda – Wine Bar» describe la tienda física; no se
  infiere venta online.
- **Vega Norte:** su tienda declara estar en fase de pruebas y los productos
  figuran sin existencias; no se infiere ecommerce aunque exista carrito.
- **Tendal / Castro y Magán:** son marca y razón social de una sola bodega en
  Tijarafe. La antigua fila de Los Llanos de Aridane era un duplicado.
- **Aceites:** Oleoteide es una marca de Cumbres de Abona, no una segunda
  unidad productiva. Lercaro corresponde a José Antonio Acosta Rodríguez en
  Tacoronte; la fila heredada confundía la marca con Casa Lercaro de La
  Orotava. La identidad real de Arona es Oleoarona, no OleoTenerife.
- **Quesería de Arico:** no confundir referencias históricas o directorios
  empresariales replicados con actividad actual. La Administración confirmó
  suspensión, cancelación sanitaria e instalaciones cerradas sin actividad ni
  personal; se purga como cierre permanente.
- **El Cabrito:** la finca agroecológica es real, pero sus lácteos estacionales
  abastecen la cocina del hotel y no constituyen una quesería comercial con
  producto vendible bajo esa identidad.
- **Queserías SC-05:** Luna de Awara pertenece a Garafía, no a Tijarafe; El
  Guanche elabora El Isorano en Guía de Isora; y Queso Herreño corresponde a la
  Sociedad Cooperativa Ganaderos de El Hierro en El Majano, Valverde, no a una
  quesería de la Cooperativa del Campo de Frontera. El Granel es un topónimo y
  una antigua explotación puesta en venta, no una marca activa acreditada.
- **Charcutería:** Montesano produce en La Esperanza, municipio de El Rosario;
  El Ortigal es una atribución errónea. COAGATE sí existe en El Ortigal Bajo,
  pero la fila de Arafo inventaba ubicación y actividad cárnica comercial. El
  Chango localizado corresponde a Maracena (Granada), no a La Laguna. Madre del
  Agua, Meat Boutique y Discarten publican mecanismos actuales de pedido remoto.
- **Pan y pastelería:** La Casa del Panadero tiene tiendas en varios municipios,
  pero su obrador está en Puerto de la Cruz; Zulay nació y mantiene el obrador
  de referencia en Fuencaliente, no en su tienda de Los Llanos. La web de Las
  Cabezadas usa teléfono y campos de plantilla: la identidad repostera se
  conserva en su ubicación documentada de Barlovento como `parcial`, pero no se
  publican esos contactos ni se infiere pedido remoto.
- **Despensa:** Miel de Tenerife DOP, Miel de La Palma, Miel de El Hierro y
  Miel de Palma son denominaciones colectivas o geográficas, no productores;
  las marcas reales deben tener ficha propia. El Molino de Las Tricias cesó la
  molienda en 1953 y hoy es museo. Flor de Sal de Fuencaliente es producto de
  las Salinas, no otra unidad. COPLACA y FAST sí cumplen como organizaciones que
  acondicionan y comercializan la producción de sus socios.
- **Presas Ocampo:** una ficha institucional vigente y el registro de la DO
  sostienen identidad y actividad, pero no sustituyen una fuente directa para
  `verificado`; el fallo TLS de su dominio tampoco demuestra cierre. Se conserva
  como `parcial` y sin venta remota confirmada.

## Mantenimiento · ola 3 de venta online (2026-07-29)

- Revisadas las **77** filas que seguían en `Venta online=no comprobado`: el
  saldo queda en **30 `sí` · 75 `no comprobado`**. El estado editorial pasa a
  **60 `verificado` · 45 `parcial`**.
- **Tajinaste** tiene una tienda oficial operativa con vinos en stock, precio y
  carrito. **La Calabacera** se corrige de forma material: la ficha ahora
  prioriza sus cajas semanales de fruta, verdura y aromáticas ecológicas
  propias, con pedido por teléfono o email y reparto en Tenerife, sin perder la
  actividad vitivinícola de Bodega Estrada.
- Se reescribieron cinco descripciones de plantilla. También se retiraron los
  dominios sin DNS de **Zacatín** y **Molino de Gofio La Salud**, y la web 404
  de **Las Cabezadas**; para el molino se recuperaron teléfono y correo
  públicos actuales.
- Permanecen sin resolver los escaparates sin producto comprable, la tienda en
  pruebas de Vega Norte, productos agotados o con precio cero, y enlaces a
  reventa de terceros. Los fallos técnicos aislados tampoco se trataron como
  cierre ni como ausencia de venta.
