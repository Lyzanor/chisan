# Verificación provincial de Zamora

Ledger para planificar y reanudar la primera revisión profunda de
`data/csv/castilla-y-leon/zamora.csv`. El CSV es la fuente de verdad. La
evidencia estructurada se crea en
`data/evidence/castilla-y-leon/zamora.jsonl` al cerrar el lote 1.

El procedimiento general sigue `docs/VERIFICATION_TECHNIQUES.md`; los contratos
viven en `docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md` y
`docs/EDITORIAL_POLICY.md`. Este documento contiene el contexto provincial y una
worklist congelada para que un modelo económico con razonamiento bajo pueda
trabajar un solo lote sin cargar toda la provincia.

## Estado inicial

- Inicio: **2026-07-10**.
- Snapshot: **171 filas**; **0 `verificado`**, **2 `parcial`** y **169
  `pendiente`**.
- Venta online: **0 `sí`**, 0 `no` y **171 `no comprobado`**; `Canal de venta`
  vacío en las 171 filas. No hay anomalías heredadas de `sí`, pero cada tienda
  propia vigente que aparezca durante la revisión debe quedar como `sí` y con
  canal.
- Categorías: **Bodega 96**, Lácteos y quesos 22, Charcutería 13, Trufa y setas
  12, Legumbres 7, Harinas y cereales 5, Fruta y verdura 3, Aceite 2, Miel 2,
  Chocolate 2, Licores 2, Frutos secos 2, Cerveza artesana 1, Huevos 1 y Pescado
  1. Vino concentra el 56 % del catálogo y se divide por denominación y
  territorio.
- Territorio: Toro 38 filas, Zamora 28, Fermoselle 14, Fuentesaúco 10, Morales
  de Toro 8 y una cola larga provincial. Normalizar variantes como `Morales Del
  Vino`/`Morales del Vino`, `Santibañez`/`Santibáñez` y el municipio mal formado
  `, Benavente` solo cuando la fuente confirme el valor correcto.
- Enlaces: web 171/171, Google Maps 171/171, Instagram 75/171, Facebook 74/171,
  teléfono 121/171 y correo 97/171. **60 webs apuntan a
  `alimentosdezamora.info`**: es un directorio institucional, no la web propia de
  cada productor.
- Coordenadas: 168/171. Faltan en `baltasar-moralejo-e-hijos-s-r-l-coreses`,
  `industrias-lacteas-benaventanas-s-a-ilbesa-benavente` y
  `lacteas-zamoro-s-l-santibanez-de-vidriales`.
- Warnings iniciales: `horticola-majia-zamora` cae a 15,4 km del centroide de
  Zamora y a 0,4 km de Fresno de la Ribera;
  `quesos-campostera-zamora` cae a 49,6 km de Zamora y a 0,9 km de Villalpando.
  Ambos se resuelven o justifican en su lote.
- Calidad inicial: contrato **OK, 0 errores y 0 warnings**; calidad **0 errores y
  2 warnings**. Hay 136 avisos opcionales suprimidos.
- Evidencia inicial: no existe el JSONL provincial y Zamora no figura en
  `data/evidence/coverage.json`.
- Imágenes: 86/171. Se conservan las válidas, se mueven al corregir un `slug` y
  se eliminan si se purga su fila. No se hace enriquecimiento masivo en esta
  pasada; primero se estabilizan identidad y slugs.
- No existe `docs/candidates/zamora.md`. No se añaden candidatos durante esta
  primera pasada salvo petición explícita: el objetivo es cerrar las 171 filas
  heredadas.

## Reglas duras para Zamora

1. **Reauditar las 171 filas.** Las 2 filas `parcial` (`morcillas-ramiro-zamora`
   y `queso-beato-de-tabara-olmillos-de-castro`) no se dan por buenas: deben
   quedar con evidencia actual igual que las 169 pendientes.
2. **Un directorio no basta para `verificado`.** `Alimentos de Zamora`, un
   consejo regulador o una marca de garantía apoyan identidad, pertenencia o
   localización y normalmente topan en `parcial`. Para `verificado` hace falta
   además una fuente de tipo verificable que sostenga identidad, actividad
   productora actual y municipio: web/tienda/red oficial, Maps fiable o
   marketplace atribuible al productor.
3. **La inscripción vinícola no demuestra actividad actual ni venta.** Usa los
   consejos de Toro, Arribes, Tierra del Vino y Valles de Benavente como ancla de
   contraste. Si solo queda la ficha del consejo, conserva `parcial`. Una web
   caída no prueba cierre.
4. **Distinguir bodega productora de marca, consultor, hotel o comercio.** Revisar
   especialmente `bernardo-farina-enologia-creativa-moraleja-del-vino`,
   `marcelino-ibericos-corrales-del-vino` y
   `tierra-dulce-moraleja-del-vino`; sus nombres/webs sugieren consultoría,
   charcutería y chocolate, respectivamente. Recategoriza si existe productor
   real; purga solo con evidencia firme de fuera de alcance.
5. **Toro ocupa cuatro lotes.** El consejo confirma pertenencia, pero la fuente
   propia debe confirmar la unidad productiva zamorana. Marcas de grupos con
   varias bodegas no se geolocalizan en la sede corporativa. Venta por terceros
   no convierte `Venta online` en `sí`.
6. **Arribes cruza Zamora y Salamanca.** Verifica que la bodega del CSV tenga
   unidad productiva en Fermoselle/Zamora; no basta con aparecer en el consejo
   común. Fusiona nombres históricos solo si la identidad es inequívoca.
7. **Lácteos es un lote de alto riesgo.** La DOP Queso Zamorano publica una lista
   actual mucho más corta que las 22 filas del CSV. Las cinco URLs de `gff.co.uk`
   son fichas de directorio de tercero y no justifican actividad actual. Busca
   duplicados de marca/razón social y no confundas ganadería o central lechera
   con quesería elaboradora.
8. **Charcutería, harina, garbanzo y setas:** los listados de marca/IGP prueban
   adhesión o certificación, no necesariamente venta directa. Entran obradores,
   industrias elaboradoras, molinos/envasadores productores y operadores
   micológicos reales; salen sellos, asociaciones, distribuidores puros y
   comercios sin elaboración.
9. **Venta online solo con pedido remoto vigente.** Tienda propia funcional
   implica `sí` + `ecommerce`; pedido explícito por correo/teléfono/WhatsApp usa
   el canal correspondiente. Catálogo sin checkout, formulario genérico,
   enoturismo o marketplace de tercero se mantiene `no comprobado`.
10. **Resolver geografía con fuentes, no con intuición.** Completa las tres filas
    sin coordenadas cuando exista una localización fiable. Resuelve los warnings
    de Hortícola Majia y Quesos Campostera; si la fuente institucional mantiene
    el municipio pero la fábrica está en otro término, documenta la excepción.
11. **Slugs estables salvo identidad incorrecta.** Si se corrige un slug
    existente en Git, actualiza CSV, imagen, documentación y añade `merge` del
    viejo al nuevo. Una recategorización por sí sola no cambia el slug.
12. **No ampliar alcance durante la pasada.** Sin candidatos nuevos ni
    enriquecimiento masivo de imágenes. Al cerrar, 0 `pendiente`; cada
    `parcial` y cada `no comprobado` residual debe tener motivo conocido en la
    evidencia.

## Fuentes provinciales de cotejo

Estas fuentes reducen búsqueda repetida, pero no sustituyen la fuente propia
necesaria para `verificado` ni la comprobación dinámica de venta:

| Sector | Fuente común | Uso y límite |
|---|---|---|
| D.O. Toro | `https://www.dotoro.com/bodegas/` | Bodegas inscritas y municipio; consejo regulador, por sí solo `parcial`. |
| D.O. Arribes | `https://doarribes.es/bodegas/` | Bodegas adheridas de Zamora y Salamanca; comprobar unidad zamorana. |
| D.O. Tierra del Vino | `https://www.tierradelvino.net/?page_id=51` | Directorio actual con direcciones/contactos; varias filas heredadas no aparecen y requieren triaje. |
| D.O.P. Valles de Benavente | `https://vallesdebenavente.org/` | Lista actual de Andrea Gutiérrez, Otero, Viriatus y Verdes; útil para detectar nombres obsoletos. |
| D.O.P. Queso Zamorano | `https://quesozamorano.com/empresas/` | Queserías inscritas actuales; supporting, no prueba venta. |
| M.G. Chorizo Zamorano | `https://chorizozamorano.com/empresas_elaboradoras` | Industrias elaboradoras adheridas; contrasta cada web propia. |
| M.G. Harina Tradicional Zamorana | `https://www.harinatradicionalzamorana.com/nosotros/` | Asociación y fabricantes de harina; confirmar molino/empresa actual. |
| M.G. Setas de Castilla y León | `https://www.setasdecastillayleon.com/` | Alcance y operadores certificados; no asumir que toda razón social histórica sigue activa. |
| I.G.P. Garbanzo de Fuentesaúco | `https://www.mapa.gob.es/es/alimentacion/temas/calidad-diferenciada/dop-igp/legumbres/IGP_gfuentesauco.aspx` | Existencia de la IGP y órgano de gestión; buscar elaborador/envasador concreto. |
| Diputación | `https://alimentosdezamora.info/Presentacion_ES.html` | Descubrimiento institucional de sellos/productos; una ficha genérica no verifica actividad actual. |

## Plan y worklist congelada

Los lotes 1-15 cubren exactamente los **171 slugs iniciales sin solaparse**. No
recalcular la membresía si una fila se purga, fusiona o recategoriza: los slugs
están congelados debajo. El lote 16 es el cierre transversal.

| # | Lote | Filas | Estado | Foco |
|---|---|---:|---|---|
| 1 | D.O. Toro · Toro A | 13 | Hecho | Primer bloque de bodegas en Toro; JSONL creado y CSV actualizado. |
| 2 | D.O. Toro · Toro B | 13 | Hecho | Segundo bloque de bodegas en Toro; JSONL ampliado y CSV actualizado. |
| 3 | D.O. Toro · Toro C | 10 | Hecho | Resto de bodegas en Toro; JSONL ampliado y CSV actualizado. |
| 4 | D.O. Toro · Morales de Toro y El Pego | 10 | Hecho | Ocho Morales + dos El Pego; JSONL ampliado y CSV actualizado. |
| 5 | D.O. Toro · resto territorial | 9 | Hecho | 9 revisadas: 6 verificado, 3 parcial; 2 ventas online resueltas; 0 purgas/fusiones/recategorizaciones. |
| 6 | D.O. Arribes · Fermoselle | 13 | Hecho | 9 conservadas: 2 verificado, 7 parcial; 0 ventas online resueltas; 4 purgas `other-province`; 0 cierres, fusiones o recategorizaciones. Ribera de Pelazas y Terrazgo quedan parciales por falta de cierre actual suficientemente fiable. |
| 7 | D.O. Tierra del Vino | 11 | Hecho | 11 revisadas: 4 verificado, 7 parcial; 1 venta online resuelta; 0 purgas, cierres, fusiones o recategorizaciones. La lista oficial actual incluye los 11 nombres. |
| 8 | Valles de Benavente + Aliste | 10 | Hecho | 10 revisadas: 6 verificado, 4 parcial; 4 ventas online resueltas; 0 purgas, cierres, fusiones o recategorizaciones. La lista oficial actual se usó como apoyo y no hubo purgas por omisión. |
| 9 | Vino residual + cerveza/licores | 10 | Hecho | 10 revisadas: 8 verificado, 2 parcial; 2 ventas online resueltas; 2 recategorizaciones (Marcelino Ibéricos → Charcutería, Tierra Dulce → Chocolate); 0 purgas/cierres/fusiones. |
| 10 | Charcutería | 13 | Hecho | 13 revisadas: 7 verificado, 6 parcial; 4 ventas online resueltas; 1 recategorización (Prado Concejo → Miel); 0 purgas, cierres o fusiones. Morcillas Ramiro reauditada desde parcial. |
| 11 | Lácteos y quesos A | 11 | Hecho | 11 revisadas: 10 conservadas (6 verificado, 4 parcial) y 1 merge a quesos-revilla-coreses; 2 ventas online resueltas en las filas conservadas; 0 purgas o cierres. Gestión Agro Ganadera/La Antigua queda separada por falta de identidad inequívoca; Vicente Pastor queda documentada para contraste con su contraparte del lote 12. |
| 12 | Lácteos y quesos B | 11 | Hecho | 9 filas conservadas: 7 verificado y 2 parcial; 3 ventas online resueltas; 1 merge de queserias-vicente-pastor-zamora a queseria-vicente-pastor-morales-del-vino y 1 corrección de slug de Queso del Duero a Toro con registro merge. Quesos Revilla quedó completada como target vigente, se añadieron las 3 coordenadas ausentes y Beato fue reauditado. Quesos Campostera se purgó por cierre documentado de la fábrica. |
| 13 | Trufa y setas | 12 | Hecho | 6 verificado y 6 parcial; 3 ventas online resueltas (Anda, Gabemar y Hongos de Zamora); 3 recategorizaciones a `Conservas vegetales` (Anda, Gabemar y Faúndez); 0 purgas/fusiones. Se corrigieron municipios y coordenadas de Anda, Gabemar, Faúndez, Frutas Silvestres y Setas, Nando Silvestre y Prodeza cuando hubo fuente suficiente. Eurohongo, Micozamora, Natur Silver y Productos Silvestres Sierra de la Culebra quedan parciales por evidencia propia actual insuficiente, sin inferir cierre. |
| 14 | Harinas y legumbres | 12 | Hecho | 7 filas conservadas: 3 verificado y 4 parcial; 4 purgas `other-province` (Álvarez Legumbres, Hijo de Macario Marcos, Legumbres Montes y Legumer Precocinados) con registro ITACyL 2026 que identifica la misma razón social y centro vigente fuera de Zamora; 1 merge del molino de piedra genérico con Carbajo Hermanos en Cerecinos de Campos; 0 ventas online resueltas. Se corrigió la unidad/municipio de Carbajo y se conservaron como parciales Coperblanc, Molinos Zamoranos, Agroalimentaria de la Guareña y J. Pedraz por falta de fuente propia actual suficiente. |
| 15 | Resto alimentario | 13 | Hecho | 9 verificado, 4 parcial; 3 ventas online resueltas; 2 cambios de slug (Pentanux → Toro y Singular → Carbellino); 1 recategorización (Hortícola Majia → Fruta y verdura); 0 purgas. |
| 16 | Cierre transversal | Todas | Pendiente | 0 pendientes, evidencia, venta, geo, dedup, imágenes y `verify:data`. |

### Membresía exacta por lote

**Lote 1 (13):** `bodega-a-velasco-e-hijos-s-l-toro`,
`bodega-bernard-magrez-toro`, `bodega-bucrana-toro`,
`bodega-campo-de-toro-s-l-toro`, `bodega-caserio-de-duenas-toro`,
`bodega-cyan-toro`, `bodega-divina-proporcion-toro`,
`bodega-la-vina-del-abuelo-toro`, `bodega-latarce-toro`,
`bodega-liberalia-enologica-s-l-toro`, `bodega-sobreno-s-a-toro`,
`bodega-vatan-toro`, `bodega-vetus-toro`.

**Lote 2 (13):** `bodegas-bigardo-toro`, `bodegas-campo-eliseo-toro`,
`bodegas-carodorum-toro`, `bodegas-covitoro-toro`,
`bodegas-diez-gomez-toro`, `bodegas-dominio-del-bienamado-toro`,
`bodegas-frontaura-s-l-u-toro`, `bodegas-monte-la-reina-toro`,
`bodegas-piedra-toro`, `bodegas-rodriguez-y-sanzo-toro`,
`bodegas-torreduero-s-a-toro`, `bodegas-valbusenda-toro`,
`bodegas-vinaguarena-s-l-toro`.

**Lote 3 (10):** `bodegas-y-vinedos-la-guardesa-de-toro-toro`,
`bodegas-y-vinedos-maires-toro`, `dominio-del-bendito-s-l-toro`,
`farina-s-l-toro`, `frutos-villar-bodegas-toro`, `gil-luna-s-l-toro`,
`luis-medina-toro`, `palacio-de-villachica-toro`,
`quinta-de-la-quietud-toro`, `valdigal-toro`.

**Lote 4 (10):** `bodega-dalmacio-gallego-gutierrez-morales-de-toro`,
`bodega-vocarraje-morales-de-toro`,
`bodegas-alonso-conde-s-l-morales-de-toro`, `bodegas-coral-duero-el-pego`,
`bodegas-mazas-morales-de-toro`, `bodegas-vega-sauco-morales-de-toro`,
`cuatro-mil-cepas-s-l-el-pego`, `francisco-casas-s-a-morales-de-toro`,
`moises-gran-vino-morales-de-toro`, `pagos-del-rey-s-l-morales-de-toro`.

**Lote 5 (9):** `bodega-la-presa-sanzoles`,
`bodega-numanthia-valdefinjas`, `bodega-quadravia-venialbo`,
`bodega-ramon-ramos-ii-venialbo`, `bodega-valmartin-s-l-argujillo`,
`campina-s-coop-cyl-valdefinjas`,
`galindo-san-millan-bodega-y-vinedos-el-pinero`,
`teso-la-monja-s-l-valdefinjas`, `vina-zangarron-s-l-sanzoles`.

**Lote 6 (13):** `bodega-almaroja-fermoselle`,
`bodega-arribes-del-duero-soc-coop-fermoselle`,
`bodega-cooperativa-virgen-de-la-bandera-fermoselle`,
`bodega-la-casita-del-vinador-fermoselle`, `bodega-la-setera-fermoselle`,
`bodega-ocellvm-dvrii-fermoselle`, `bodegas-las-fontanicas-fermoselle`,
`bodegas-las-gavias-fermoselle`, `bodegas-ribera-de-pelazas-fermoselle`,
`bodegas-vina-romana-fermoselle`, `hacienda-zorita-fermoselle`,
`quinta-las-velas-fermoselle`, `terrazgo-bodegas-de-crianza-fermoselle`.

**Lote 7 (11):** `alizan-bodegas-y-vinedos-moraleja-del-vino`,
`bodega-guillermo-freire-moraleja-del-vino`,
`bodega-vina-escuderos-villamor-de-los-escuderos`,
`bodega-vinas-del-cenit-villanueva-de-campean`,
`bodega-vinas-zamoranas-coreses`,
`bodegas-casaseca-villamor-de-los-escuderos`,
`bodegas-el-soto-villanueva-de-campean`, `bodegas-seleccionadas-armando-roales`,
`bodegas-teso-blanco-cabanas-de-sayago`,
`bodegas-teso-la-encina-villamor-de-los-escuderos`,
`microbodega-rodriguez-moran-villamor-de-los-escuderos`.

**Lote 8 (10):** `bodega-aliste-figueruela-de-abajo`,
`bodega-andrea-gutierrez-ferreras-fuente-encalada`,
`bodega-castillo-de-vidriales-quiruelas-de-vidriales`,
`bodega-cooperativa-el-tesoro-brime-de-urz`,
`bodega-francisco-gonzalez-benavente`, `bodega-mitus-villalpando`,
`bodegas-otero-s-a-benavente`,
`bodegas-verdes-s-l-santibanez-de-vidriales`,
`cepas-de-la-culebra-riofrio-de-aliste`, `la-mela-sejas-de-aliste`.

**Lote 9 (10):** `bernardo-farina-enologia-creativa-moraleja-del-vino`,
`bodega-siesto-sanzoles`, `bodegas-ramayal-ferreruela-de-tabara`,
`castro-mendi-san-blas`, `cervato-villardeciervos`,
`marcelino-ibericos-corrales-del-vino`, `tierra-dulce-moraleja-del-vino`,
`villaveza-toro`, `bendita-locura-morales-del-vino`, `vermutto-toro`.

**Lote 10 (13):** `carnicas-diaz-de-zamora-s-l-morales-del-vino`,
`carnicas-jose-montero-el-puente-de-sanabria-galende`,
`carnicas-la-culebra-santa-eulalia-de-rionegro`,
`embutidos-mayoral-la-boveda-de-toro`,
`embutidos-turista-s-l-embutidos-duero-roales-del-pan`,
`embutidos-y-jamones-lema-s-l-santibanez-de-vidriales`,
`hijos-de-dionisio-sanchez-s-l-fuentesauco`,
`industrias-carnicas-ele-s-l-roales-del-pan`, `juan-jose-ledesma-s-a-zamora`,
`melquiades-rodriguez-s-a-coreses`, `paulino-iglesias-encalado-coreses`,
`prado-concejo-fonfria`, `morcillas-ramiro-zamora`.

**Lote 11 (11):** `alonso-santos-de-pedro-fariza`,
`consorcio-promocion-de-ovino-soc-coop-villalpando`,
`gestion-agro-ganadera-s-l-zamora`, `hijas-de-justo-torrero-zamora`,
`hijos-de-salvador-rodriguez-sta-cristina-de-la-polvorosa`, `hircus-zamora`,
`lacteas-castellano-leonesas-fresno-de-la-ribera`, `lacteas-revilla-zamora`,
`lacteos-dehesa-de-la-guadana-granja-de-moreruela`,
`queseria-la-antigua-de-fuentesauco-fuentesauco`,
`queseria-vicente-pastor-morales-del-vino`.

**Lote 12 (11):** `queserias-de-zamora-morales-del-vino`,
`queserias-vicente-pastor-zamora`, `queso-del-duero-s-a-zamora`,
`quesos-campostera-zamora`, `quesos-revilla-coreses`,
`baltasar-moralejo-e-hijos-s-r-l-coreses`,
`industrias-lacteas-benaventanas-s-a-ilbesa-benavente`,
`lacteas-cobreros-s-a-zamora`,
`lacteas-zamoro-s-l-santibanez-de-vidriales`,
`quesos-pablo-alonso-martin-villalpando`,
`queso-beato-de-tabara-olmillos-de-castro`.

**Lote 13 (12):** `conservas-anda-s-l-zamora`,
`conservas-gabemar-s-l-zamora`, `conservas-vegetales-faundez-s-l-zamora`,
`ecoespora-el-pinero`, `eurohongo-s-l-zamora`,
`frutas-silvestres-y-setas-s-l-zamora`, `hongos-de-zamora-s-l-zamora`,
`micozamora-gourmet-s-l-l-zamora`, `nando-silvestre-s-l-zamora`,
`natur-silver-zamora`, `prodeza-s-l-zamora`,
`productos-silvestres-sierra-de-la-culebra-s-l-zamora`.

**Lote 14 (12):** `carbajo-hermanos-s-a-zamora`,
`coperblanc-zamorana-s-a-zamora`, `gabino-bobo-s-a-zamora`,
`molino-de-piedra-en-cerecinos-de-campos-cerecinos-de-campos`,
`molinos-zamoranos-s-a-zamora`,
`agroalimentaria-de-la-guarena-s-l-fuentesauco`,
`alvarez-legumbres-s-l-fuentesauco`,
`cooperativa-los-zamoranos-fuentesauco`,
`hijo-de-macario-marcos-s-l-fuentesauco`, `j-pedraz-s-c-fuentesauco`,
`legumbres-montes-s-l-fuentesauco`, `legumer-precocinados-s-l-fuentesauco`.

**Lote 15 (13):** `el-regalo-de-atenea-formariz`,
`la-colmenita-de-aliste-vinas`, `horticola-majia-zamora`,
`douroliva-fermoselle`, `ajo-bovedano-la-boveda-de-toro`,
`come-frutos-del-bosque-robleda`, `esparragos-corrales-fuentesauco`,
`almendras-pentanux-zamora`, `frutos-secos-dibel-guarrate`,
`los-huevos-de-la-abuela-villalpando`, `chocolate-refart-zamora`,
`miel-fuente-la-muela-san-juan-del-rebollar`,
`singular-by-grenoucerie-zamora`.

## Flujo mecánico por lote

1. Leer solo `AGENTS.md`, las reglas duras de este ledger, el lote en curso y
   las secciones necesarias de los contratos. No cargar CSV/JSONL completos en
   la conversación.
2. Ejecutar `git status --short`. Si ya hay cambios ajenos en Zamora, detener el
   lote; no mezclar dos agentes sobre la misma provincia.
3. Localizar únicamente los slugs del lote con `rg`. Investigar primero la fuente
   común del sector y luego una fuente propia por fila. Ampliar solo ante
   contradicción, purga/fusión o venta dinámica.
4. Para cada slug tomar exactamente una decisión: `verificado`, `parcial`,
   purga o fusión. Actualizar datos factuales que la fuente sostenga; no rellenar
   opcionales por intuición.
5. Resolver `Venta online` solo si se comprueba pedido remoto actual. Dejar
   `no comprobado` cuando no se vea una vía válida; no convertir ausencia de
   tienda en `no`.
6. Editar el CSV con parser CSV, preservando las 20 columnas y LF. Añadir una
   línea JSONL por decisión con `reviewedBy: "codex-zamora-2026-07"` y fecha real
   de revisión. Para `verificado`, los sources deben cubrir `identity`,
   `producer-activity` y `municipality` y contener al menos un tipo verificable.
7. Actualizar la fila de la worklist: estado, fecha, recuentos finales,
   ventas resueltas, purgas/fusiones/recategorizaciones y excepciones.
8. Validar antes de abandonar el lote:

   ```bash
   npx pnpm check:csv:changed
   npx pnpm check:evidence
   npx pnpm check:evidence:changed
   git diff --check
   git diff --stat
   ```

9. No hacer commit ni iniciar el lote siguiente si falla una puerta. Mantener un
   solo lote en curso para que una interrupción tenga un punto de reanudación
   inequívoco.

## Cierre transversal: lote 16

La pasada se considera cerrada cuando:

- quedan **0 `pendiente`** y cada `parcial` tiene motivo y evidencia coherentes;
- cada fila activa tiene el último `keep` y cada purga/fusión conserva su
  tombstone; el ledger cubre el CSV actual;
- todos los `Venta online=sí` tienen canal y la dependencia del canal existe
  (`ecommerce`/web, `email`/correo, `telefono|whatsapp`/teléfono);
- las tres faltas de coordenadas y los dos warnings iniciales están resueltos o
  documentados, sin saltos bloqueantes;
- no hay duplicados normalizados de nombre+municipio, webs ajenas/repetidas ni
  slugs/imágenes desalineados;
- `data/evidence/coverage.json` incluye `castilla-y-leon/zamora` solo después de
  confirmar cobertura de todas las filas activas;
- `npx pnpm verify:data` y `git diff --check` terminan correctamente;
- el resumen final de este ledger registra filas, estados, ventas/canales,
  evidencia, purgas/fusiones, warnings aceptados e imágenes pospuestas.

## Resumen final de lote 16

- **Filas activas:** 159; `verificado` 104, `parcial` 55, `pendiente` 0.
- **Venta online:** 49 `sí`, todas con canal de venta; 110 sin venta online
  resuelta y sin canal dependiente.
- **Evidencia:** 174 registros únicos: 159 `keep` activos y 15 tombstones,
  desglosados en 9 `purge` y 6 `merge`. La cobertura active↔latest keep es
  exacta y `castilla-y-leon/zamora` queda incorporada a `coverage.json`.
- **Identidad y enlaces:** sin duplicados normalizados de nombre+municipio ni
  slugs; las URLs repetidas son fichas/directorios institucionales compartidos
  y no duplican productores.
- **Geografía:** las 3 coordenadas inicialmente ausentes están completas; el
  warning inicial de Campostera desaparece con su purga y el de Hortícola Majia
  queda corregido con coordenadas del término de Zamora, sin errores bloqueantes.
- **Imágenes:** rutas y archivos referenciados correctos; se posponen imágenes
  no referenciadas de filas purgadas o fusionadas, sin huérfanos bloqueantes.
- **Gates:** `check:csv:data-quality` de Zamora, `check:images`,
  `check:evidence`, `check:csv:changed`, `check:evidence:changed`,
  `verify:data` y `git diff --check` pasan.

## Segunda pasada: rescate de webs de directorio (lotes ZA-R)

La primera pasada se cerró en una rama que nunca aterrizó en `main`; se aplicó
el 2026-07-21. Al auditarla apareció el hueco que la cerró en falso: **37 filas
conservaban un directorio como `web` propia** (33 de ellas
`alimentosdezamora.info`), con la descripción, el horario y las coordenadas del
volcado institucional. Ese estado no cumple la definición de completado que usan
Albacete, Granada o Cádiz, así que la provincia se retoma por lotes.

Regla del bloque: por cada fila, buscar el dominio propio; si no existe uno vivo,
**vaciar `web`** en vez de conservar el directorio, y ajustar el techo de
verificación a la fuente que quede. Una ficha de directorio o de consejo
regulador sostiene `parcial`, nunca `verificado`.

| # | Lote | Filas | Estado | Saldo |
|---|---|---:|---|---|
| ZA-R1 | Arribes/Fermoselle + Morales de Toro | 10 | ✅ 2026-07-21 | 2 purgas a Salamanca, 2 traslados a Villar del Buey, 1 verificado nuevo, 1 recategorización |
| ZA-R2 | Tierra del Vino, Valles de Benavente y Villamor | 14 | ✅ 2026-07-21 | 4 verificado (2 con tienda propia), 10 parcial, 0 purgas |
| ZA-R3 | Lácteos, legumbres, setas y conservas | 13 | ✅ 2026-07-21 | 4 verificado, 1 merge, 6 correcciones de municipio/slug |
| ZA-R4 | Harineras, geo-check y slugs desalineados | 18 | ✅ 2026-07-21 | 1 merge, 5 slugs corregidos, 8 municipios devueltos al geo-check, 1 override de referencia arreglado |
| ZA-R5 | Auditoría de los `Venta online=sí` y cierre | 53 | ✅ 2026-07-21 | 53/53 confirmadas; 2 webs corregidas |

### ZA-R1 — Arribes/Fermoselle y Morales de Toro

Las diez filas eran volcado puro: misma descripción plantilla, sin dirección ni
teléfono y —las nueve de Fermoselle— con **las mismas coordenadas**, las del
centroide del municipio.

- `verificado`: Cooperativa Virgen de la Bandera (web propia viva) y La Setera.
- `parcial`: AlmaRoja, Ocellvm Dvrii, Las Fontanicas, Hacienda Zorita Natural
  Reserve, Terrazgo y Dalmacio Gallego.
- `Venta online=sí` + `ecommerce`: La Setera.
- `purge:other-province`: La Casita del Viñador y Ribera de Pelazas, ambas
  traspasadas a `docs/candidates/salamanca.md`.
- `merge` por municipio erróneo: La Setera y Terrazgo, de `-fermoselle` a
  `-villar-del-buey`.

Incidencias reutilizables:

- **Fornillos de Fermoselle no es municipio, es pedanía de Villar del Buey.** Dos
  bodegas lo daban como Fermoselle. Es el mismo error que «Isso» en Albacete y se
  arregla igual: municipio oficial, coordenadas de la pedanía y `merge` del slug.
- **La D.O. Arribes cruza Zamora y Salamanca**, así que su listado común mete
  bodegas salmantinas en el CSV zamorano. La primera pasada purgó cuatro por esa
  vía y dejó dos que también lo eran. Estar en la denominación no sitúa la bodega.
- **Un dominio caído no es una bodega cerrada, pero tampoco es `verificado`.**
  `almaroja.com` no responde por tres vías distintas (WebFetch, navegador y
  `curl`, timeout en 443) y la bodega sigue viva en el mercado: la fila baja a
  `parcial` y se queda con su Facebook oficial. Cuidado con `almaroja.es`, que
  **no es suyo**: hoy sirve un agregador gastronómico.
- **La ficha del consejo puede estar a nombre del grupo.** `doarribes.es` inscribe
  Marqués de la Concordia, no «Hacienda Zorita»; la unidad zamorana es la finca
  Natural Reserve de la ctra. Zamora-Fermoselle km 58. La web del grupo es una
  SPA sin contenido rastreable, así que el techo se queda en `parcial`.
- **Una bodega puede haber dejado de serlo.** La Cooperativa Virgen de la Bandera
  paró el vino en 2020 por abandono de viñedo y hoy su producción vigente es AOVE
  de manzanilla: se recategoriza a Aceite y se anota la intención de retomarlo.

### ZA-R2 — Tierra del Vino, Valles de Benavente y Villamor

- `verificado` + ecommerce: Bodegas Casaseca y Bodegas el Soto.
- `verificado`, venta no comprobada: Viñas del Cénit y Teso la Encina.
- `parcial` (10): Alizán, El Tesoro, Francisco González, Guillermo Freire,
  Mitus, Viña Escuderos, Viñas Zamoranas, Armando, Teso Blanco y Rodríguez
  Morán. Ninguna conserva ya el directorio como web.

Incidencias reutilizables:

- **El listado del consejo, leído en crudo, vale más que su resumen.** La página
  de bodegas de `tierradelvino.net` publica dirección, teléfono, correo y web de
  cada bodega, pero solo aparecen al leer el HTML: resolvió de golpe la dirección
  de seis filas y desveló que «Bodega Guillermo Freire» se publica como **Bodega
  Jarreño**.
- **`vinaescuderos.com` está secuestrado.** El dominio con el nombre exacto de la
  cooperativa sirve hoy un blog de marketing digital firmado por «Claire
  Williams». Es la tercera variante del patrón en esta provincia, junto a
  `almaroja.es` y `confiterialamoderna.com` de Albacete: **comprobar siempre que
  el contenido habla del productor antes de guardar un dominio que encaja con el
  nombre**.
- **Dos filas con el mismo teléfono señalan un dato copiado, no siempre un
  duplicado.** Casaseca y Armando compartían el +34980538683; la tienda propia de
  Casaseca publica otro número, así que se corrigió la fila equivocada en vez de
  fusionar dos bodegas distintas.
- **La tienda puede vivir en un subdominio de plataforma.** Casaseca vende en
  `bodegascasaseca.tienda-online.com`, no en un dominio propio: es tienda oficial
  igualmente y acredita el canal.
- **Un checkout no siempre vende el producto de la fila.** Teso la Encina es
  bodega y hotel rural en la misma finca; su carrito es el de la reserva, así que
  la venta de vino queda `no comprobado`.

### ZA-R3 — Lácteos, legumbres, setas y conservas

- `verificado` + ecommerce: Faúndez (Rabanales).
- `verificado`, venta no comprobada: Lácteos Dehesa de la Guadaña, Quesería
  Vicente Pastor y Lácteas Cobreros.
- `parcial` (7): Hijas de Justo Torrero, Agroalimentaria de la Guareña, J.
  Pedraz, Eurohongo, Micozamora, Natur Silver, ProSilvestre y Frutas Silvestres
  y Setas.
- `merge`: Gestión Agro Ganadera → Quesería La Antigua de Fuentesaúco.
- Seis correcciones de municipio con cambio de slug: Justo Torrero (→ La Bóveda
  de Toro), Eurohongo (→ Puebla de Sanabria), Micozamora y Faúndez (→
  Rabanales), Natur Silver (→ Olmillos de Castro), ProSilvestre (→
  Villardeciervos), Cobreros (→ Castrogonzalo) y Frutas Silvestres (→ Trefacio).

Incidencias reutilizables:

- **El correo de la fila delata el dominio propio.** `lacteos@dehesadelaguadana.com`
  y `pastor@vicentepastor.com` estaban en el CSV mientras la columna `web`
  apuntaba al consejo regulador. Antes de buscar por nombre, mirar el correo.
- **Una fila con municipio corregido y slug sin corregir es media corrección.**
  La primera pasada arregló ocho municipios y dejó el slug apuntando a Zamora
  capital. Comparar el sufijo del slug con la columna `municipio` es una
  comprobación de una línea que destapa el desfase entero.
- **San Martín de Tábara no es municipio**: es localidad de Olmillos de Castro
  desde la fusión de 1850. Mismo patrón que Fornillos o Isso.
- **Recogida de leche no es producto vendible.** Gestión Agro Ganadera recoge 20
  millones de litros para más de cincuenta queserías; su propia web anuncia que
  ya es «una sola entidad» con Quesería La Antigua, así que la fila B2B se funde
  en la quesería, que es la que vende.
- **La lista vigente del consejo desempata el techo.** Justo Torrero elabora
  queso zamorano según la prensa, pero ya no está en la lista de empresas del
  C.R.D.O.P.; sin web propia se queda en `parcial`, mientras Dehesa de la Guadaña
  sí sigue inscrita y sostiene el encaje quesero pese a que su web hable sobre
  todo de ganadería.

### ZA-R4 — Harineras, geo-check y slugs desalineados

Cierra la última web de directorio de la provincia y devuelve al geo-check las
ocho filas que se lo saltaban.

- `verificado` + ecommerce: Molinos Zamoranos, con la razón social Harinas
  Gabino Bobo fusionada dentro.
- `merge`: Gabino Bobo → Molinos Zamoranos; y cinco slugs corregidos al
  municipio real (Carbajo Hermanos → Cerecinos de Campos, Conservas Anda → Toro,
  Gabemar → Rabanales, Nando Silvestre y Prodeza → San Vitero).
- Ocho municipios corregidos por pedanía o grafía: Figueruela de Abajo →
  Figueruela de Arriba, San Blas → Viñas, Formariz → Villar del Buey, Sejas de
  Aliste → Rábano de Aliste, El Puente de Sanabria → Galende, Santa Eulalia de
  Rionegro → Rionegro del Puente, «Sta. Cristina» → Santa Cristina de la
  Polvorosa y San Juan del Rebollar → San Vitero.

Incidencias reutilizables:

- **Un municipio que el lookup no conoce no da error: desaparece del
  geo-check.** Las ocho filas llevaban una pedanía, una abreviatura («Sta.») o
  el par localidad-municipio en el mismo campo, y ninguna se comprobaba. En
  cuanto se normalizaron, el validador destapó un error real que llevaba
  escondido: la fila de Santa Cristina de la Polvorosa tenía coordenadas a 54 km,
  copiadas del override de Fariza.
- **La referencia compartida también se equivoca.** La entrada `fariza` de
  `data/reference/municipios-overrides.json` apuntaba a 41,516/-5,774, unos 40 km
  al noreste del municipio real (41,418/-6,267, en Sayago). El override existe
  porque Wikidata da «Fariza» como nombre alternativo de **Ariza** (Zaragoza);
  al crearlo se fijó una coordenada equivocada. Corregido, y con él las dos filas
  que lo habían heredado.
- **Regla de slug adoptada en esta pasada**: se renombra el slug cuando su
  sufijo nombra un **municipio equivocado** (casi siempre `-zamora` heredado del
  volcado); se conserva cuando nombra la **localidad real** del productor
  (`-sejas-de-aliste`, `-san-blas`, `-formariz`), que es información buena y
  estable aunque no sea el municipio administrativo.
- **Tres filas con la misma dirección y el mismo teléfono eran dos empresas y
  una marca.** Gabino Bobo, Molinos Zamoranos y Coperblanc compartían
  Ctra. de Villalpando 13. La web de la marca aclara que Molinos Zamoranos es el
  nombre comercial de Gabino Bobo (fusión), mientras Coperblanc es otra sociedad
  del grupo Molinos del Duero —«tres molinos, dos familias»— junto a Carbajo
  Hermanos: tres filas legítimas, no una.

### ZA-R5 — Auditoría de `Venta online=sí` y cierre

Se comprobaron **las 53 filas** con venta declarada, no una muestra: cribado en
bloque de cada `web` buscando señales de tienda (carrito, checkout, WooCommerce,
PrestaShop) y revisión una a una de las que no daban señal. **Las 53 se
confirman.** Dos correcciones de datos:

- Quesos Revilla opera hoy como **Quesos Reviques S.L.**: su dominio redirige
  (301) al nuevo, con tienda propia de precios y carrito. Se actualizan nombre,
  web, teléfono y correo.
- Moisés Gran Vino apuntaba a `heredaduruena.com`, que presenta el certificado
  de `heredaduruena.es`; la web canónica es el `.es`. Es la marca de la familia
  Rodríguez León en la D.O. Toro, con otra bodega en Urueña (Valladolid) bajo
  otra denominación: la fila zamorana sigue a la unidad de Toro.

Incidencia reutilizable: **el cribado en bloque tiene falsos negativos, no
falsos positivos.** Cuatro filas salieron «sin señal» y ninguna era un error de
dato: Chocolate Refart y Faúndez pintan la tienda con JavaScript, Quesos Revilla
redirigía a su dominio nuevo y Paulino Iglesias devuelve 403/500 a `curl` y a
WebFetch pero carga perfectamente en navegador. Sirve para **ordenar el trabajo**,
nunca para degradar una fila.

## Cierre de la segunda pasada (2026-07-21)

- **Filas activas: 155** (159 al aterrizar; −4: 3 purgas y 5 fusiones, con una
  fila nueva por ninguna).
- **Verificación: 106 `verificado`, 49 `parcial`, 0 `pendiente`.**
- **Venta online: 53 `sí` (53/53 con canal y comprobadas en esta pasada), 102
  `no comprobado`, 0 `no`.**
- **Evidencia: 189 registros** — 155 `keep` (cobertura **155/155**), 11 `purge`
  y 23 `merge`.
- **Ninguna fila conserva un directorio como `web` propia** (eran 37) y
  **ninguna queda fuera del geo-check** (eran 8). `check:csv:data-quality` de
  Zamora: 0 errores y 0 warnings. `verify:data` verde sobre los 50 CSV.

### Residuales para la tercera pasada

- **74 filas sin imagen**, casi la mitad del catálogo: el mayor hueco de calidad
  y el trabajo natural siguiente.
- **23 filas sin `web`**, por no tener dominio propio vivo. Varias tienen solo
  Facebook (AlmaRoja, Ocellvm Dvrii, Armando).
- **49 `parcial`**, sobre todo bodegas y operadores micológicos sin fuente
  primaria viva. Encaje a revisar: Eurohongo y Micozamora (comercializadores más
  que transformadores) y Coperblanc (unidad propia dentro del grupo).
- **Bodega Cooperativa El Tesoro** (Brime de Urz): hay noticias de que sus socios
  estudiaron vender la bodega. No consta cierre; conviene reintentarlo.
- **102 `no comprobado`**: mayoritariamente bodegas pequeñas sin tienda. No es
  deuda, es el estado real.
