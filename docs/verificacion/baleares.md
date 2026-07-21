# Verificación provincial de Baleares

Ledger para planificar y reanudar la primera revisión profunda de
`data/csv/illes-balears/baleares.csv`. El CSV es la fuente de verdad. La
evidencia estructurada se crea en `data/evidence/illes-balears/baleares.jsonl`
al cerrar el lote BAL-01.

El procedimiento general sigue `docs/VERIFICATION_TECHNIQUES.md`; los contratos
viven en `docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md` y
`docs/EDITORIAL_POLICY.md`. Este documento contiene el contexto provincial y una
worklist congelada para trabajar un solo lote sin cargar toda la provincia.

## Estado inicial

- Inicio: **2026-07-21**.
- Snapshot: **168 filas**; **42 `verificado`**, **13 `parcial`** y **113
  `pendiente`**.
- Venta online: **20 `sí`**, 0 `no` y **148 `no comprobado`**. Las 20 `sí` son
  heredadas y **ninguna tiene `Canal de venta`**: hay que reauditarlas una a una
  y darles canal o bajarlas, como en la pasada ZA-R5 de Zamora.
- Categorías: **Bodega 51**, Lácteos y quesos 37, Pan y pastelería 17, Fruta y
  verdura 16, Aceite 15, Charcutería 12, Otros 10, Cerveza artesana 4, Licores 2,
  Miel 2, Frutos secos 2. Vino y queso concentran el 52 % del catálogo.
- Territorio: **Mallorca 117, Menorca 33, Eivissa 13, Formentera 5**; 53
  municipios. Palma 17 filas, Ciutadella 8, Alaior 7, Es Mercadal 6.
- Enlaces: web 159/168, Instagram 150/168, Facebook 104/168, teléfono 167/168 y
  correo 131/168.
- Coordenadas: 155/168.
- Calidad inicial: contrato **OK, 0 errores**; calidad **0 errores y 0
  warnings**; geo sin saltos ni avisos >15 km. **Ninguna puerta detecta el
  problema real de esta provincia** (ver estratos), así que las métricas verdes
  no valen como prueba de nada aquí.
- Evidencia inicial: no existe el JSONL provincial y Baleares no figura en
  `data/evidence/coverage.json`.
- Imágenes: 80/168. No se hace enriquecimiento masivo en esta pasada.
- No existe `docs/candidates/baleares.md`. No se añaden candidatos salvo petición
  explícita: el objetivo es cerrar las 168 filas heredadas.

## Tres estratos de procedencia

El CSV parece sano con las métricas baratas habituales —0 coordenadas en el
centroide municipal, 0 coordenadas exactamente repetidas, 0 descripciones
literalmente idénticas— pero el volcado está interpolado, no copiado. Cruzando
descripción, coordenadas y horario aparecen tres estratos disjuntos que se
comportan de forma muy distinta y determinan cuánto trabajo cuesta cada fila:

| Estrato | Filas | Firma | Estado heredado |
|---|---:|---|---|
| **A · volcado sintético** | 94 | Descripción plantilla «Productor local artesanal de {productos} en {municipio}, Islas Baleares. Fiel al compromiso de proximidad y comercio justo.» | 94 `pendiente` |
| **B · verificado por directorio** | 21 | Descripción «… con {producto} y presencia pública contrastada en directorios o canales oficiales.» | 18 `verificado`, 3 `parcial` |
| **C · redactada a mano** | 53 | Descripción específica del productor | 24 `verificado`, 19 `pendiente`, 10 `parcial` |

Lo que hace peligroso al estrato A no es la descripción, sino lo que la
acompaña: **las 94 filas tienen coordenadas sintéticas y 86 tienen horario
inventado**. La correlación es perfecta (94/94), así que son datos generados,
no recogidos.

- **Coordenadas sintéticas (94).** Se generaron dando **una longitud fija por
  municipio y variando solo la latitud**: las cuatro bodegas de Binissalem
  comparten `lon 2.8357000`, las cinco filas de Alaior comparten `lon
  4.1326000`, y así en 25 municipios que suman 81 filas; las 13 restantes son
  únicas en su municipio pero tienen la misma huella de 7 decimales terminados
  en `000`. Por eso pasan el geo-check —caen dentro del término— y por eso no
  son la finca. Las 61 coordenadas de aspecto real (estratos B y C) sí se
  conservan salvo prueba en contra.
- **Horarios inventados (86).** «Lun-Vie 09:00–19:00» para una bodega o
  «Lun-Vie 09:00–14:00» para una finca no salen de ninguna fuente. Se vacían o
  se sustituyen por el horario publicado; `Consultar web o redes sociales` es
  preferible a un horario falso.
- **El estrato B no está verificado.** Su propia descripción admite que la
  prueba fue «presencia en directorios», que según la regla 3 topa en `parcial`.
  Las 18 `verificado` de este estrato se reauditan como si fueran pendientes y
  bajan a `parcial` si no aparece fuente propia.
- **El estrato C es el único punto de partida fiable**, y aun así se reaudita.

Consecuencia práctica: el recuento heredado de 42 `verificado` es optimista —18
vienen de directorio— y las 113 `pendiente` incluyen 94 filas cuya dirección,
horario y coordenadas hay que rehacer, no solo confirmar.

## Anomalías detectadas en la auditoría previa

Cada una se resuelve en el lote al que pertenece su fila; aquí solo quedan
listadas para no volver a descubrirlas.

1. **Tres pares con el mismo teléfono**, probables duplicados o dos fichas de la
   misma unidad productiva:
   `cooperativa-de-soller-soller` / `cooperativa-de-soller-citricos-soller`,
   `formatges-de-son-jover-inca` / `finca-son-jover-huerta-inca`,
   `sa-teulera-petra` / `finca-eco-sa-teulera-huerta-petra`. Los tres pares
   comparten además dominio o razón social. Decidir `merge` o justificar por qué
   son dos filas legítimas (p. ej. quesería y huerta separadas).
2. **13 filas sin `lat`/`lon`**: `hort-de-sant-patrici-s-l-ferreries`,
   `dos-perellons-palma`, `son-caravinya-ciutadella-de-menorca`,
   `oli-de-santanyi-santanyi`,
   `antonio-nadal-ros-bodegas-and-vinedos-binissalem`,
   `sa-nostra-mel-mel-de-can-mari-sant-joan-de-labritja`,
   `embutidos-estrany-inca`, `forn-i-pastisseria-gelabert-llubi`,
   `forn-can-jeroni-formentera`, `celler-can-axartell-pollenca`,
   `celler-son-juliana-santa-maria-del-cami`, `peix-sec-formentera-formentera`
   y `mel-de-formentera-formentera`.
3. **`Santa Gertrudis de Fruitera` no es municipio**, es parroquia de Santa
   Eulària des Riu, y por eso `can-caus-santa-gertrudis` se salta el geo-check.
   Se arregla como «Isso» en Albacete o «Fornillos» en Zamora: municipio oficial,
   coordenadas de la parroquia y `merge` del slug. Lo mismo con
   `granja-artina-san-rafael`, cuyo slug apunta a Sant Rafel de sa Creu
   (parroquia de Sant Antoni de Portmany).
4. **Grafías inconsistentes del mismo municipio**: `Maó`/`Mahón`,
   `Ciutadella`/`Ciutadella de Menorca`, `Ibiza`/`Eivissa`. Unificar a la forma
   oficial en catalán (`Maó`, `Ciutadella de Menorca`, `Eivissa`) sin tocar
   slugs, que no dependen de la grafía.
5. **Categoría `Otros` como cajón de sastre (10 filas)**: gin, palo, hierbas,
   sal, refrescos y miel están ahí. Recategorizar a `Licores`, `Miel` o a una
   categoría válida de `npx pnpm list:categories` cuando la fuente lo sostenga;
   `flor-de-sal-des-trenc` y `salinas-de-ibiza` probablemente necesiten
   `Sal` o el `Otros` justificado.
6. **Nombres sospechosos de mala transcripción**: `short-des-pont-manacor`
   (¿*Sa Cort des Pont*?) y `dairy-merce-costitx`. Confirmar razón social real
   antes de dar por buena la identidad.
7. **Siete filas sin web** (`dairy-merce-costitx`,
   `formatgeria-es-collet-manacor`, `fet-a-son-garrova-sant-llorenc`,
   `binigafull-ciutadella`, `algendaret-nou-mao`, `granja-artina-san-rafael`,
   `ses-cabretes-santa-eularia`) y dos con directorio por web. Ausencia de web no
   es cierre; el techo suele ser `parcial`.

## Reglas duras para Baleares

1. **Reauditar las 168 filas.** Las 42 `verificado` y 13 `parcial` heredadas no
   se dan por buenas: necesitan evidencia actual igual que las 113 pendientes.
   Las 18 `verificado` del estrato B son prioritarias, porque su estado procede
   de una comprobación que la regla 3 no admite.
2. **En el estrato A no se confirma: se rehace.** Dirección, horario y
   coordenadas de esas 94 filas son generados. Sustituir por el dato publicado
   por la fuente propia, y **vaciar** el campo cuando la fuente no lo publique.
   Un horario plausible sin fuente es un dato falso servido al usuario; una
   coordenada sintética que cae dentro del término municipal es peor que la
   ausencia, porque el geo-check la da por buena. No copiar la coordenada
   sintética a `geo-provenance` para «legalizarla»: o se corrige con la
   ubicación real, o se vacía.
3. **Un directorio no basta para `verificado`.** Un consejo regulador, `Illes
   Balears Qualitat`, el CBPAE o una guía turística sostienen identidad,
   pertenencia o localización y topan en `parcial`. Para `verificado` hace falta
   además fuente de tipo verificable que sostenga identidad, actividad
   productora actual y municipio.
4. **La inscripción en D.O. no demuestra actividad actual ni venta.** Binissalem
   y Pla i Llevant son ancla de contraste, no prueba. Una web caída no prueba
   cierre; confírmalo por otra vía antes de tocar la fila.
5. **Distinguir productor de restaurante, hotel, agroturismo o tienda.** Baleares
   está lleno de fincas que son alojamiento con viña o con rebaño. Entra quien
   elabora; no entra el establecimiento que solo sirve o revende. Vigilar
   especialmente Torralbenc, Es Fangar, Castell Miquel, Can Caus y las
   cooperativas con supermercado propio.
6. **Insularidad: el municipio manda sobre la marca.** Muchas marcas mallorquinas
   embotellan o maduran fuera de su municipio nominal, y varias fincas dan
   dirección de la finca y sede social en Palma. Geolocaliza la unidad
   productiva, no la oficina.
7. **Parroquias no son municipios.** Sant Rafel, Santa Gertrudis, Jesús, Sant
   Climent, Fornells, s'Alqueria Blanca, Portocolom y similares son entidades
   menores: usa el municipio oficial y deja las coordenadas del núcleo real.
8. **Queso Mahón-Menorca: separar quesería elaboradora de ganadería.** La DOP
   distingue queso artesano (elaborado en la propia finca) de industrial. Una
   explotación que solo entrega leche a Coinga no es productor vendible; se triaja
   y se poda igual que las filas REGA de Girona.
9. **Venta online solo con pedido remoto vigente.** Tienda propia funcional
   implica `sí` + `ecommerce`; pedido explícito por correo, teléfono o WhatsApp
   usa su canal. Catálogo sin checkout, formulario genérico, enoturismo,
   reserva de visita o marketplace de tercero se queda `no comprobado`. Las 20
   `sí` heredadas se auditan una a una en su lote.
10. **Slugs estables salvo identidad incorrecta.** Al corregir un slug existente
    en Git, actualiza CSV, imagen, documentación y añade `merge` del viejo al
    nuevo. Una recategorización por sí sola no cambia el slug.
11. **No ampliar alcance durante la pasada.** Sin candidatos nuevos ni
    enriquecimiento masivo de imágenes. Al cerrar, 0 `pendiente`; cada `parcial`
    y cada `no comprobado` residual debe tener motivo conocido en la evidencia.

## Fuentes provinciales de cotejo

Reducen búsqueda repetida, pero no sustituyen la fuente propia necesaria para
`verificado` ni la comprobación dinámica de venta.

| Sector | Fuente común | Uso y límite |
|---|---|---|
| D.O. Binissalem | `https://binissalemdo.com/` | Bodegas inscritas y municipio; consejo regulador, por sí solo `parcial`. |
| D.O. Pla i Llevant | `https://plaillevantmallorca.es/` | Bodegas del llano y levante mallorquín; contrastar unidad productiva. |
| Vi de la Terra Mallorca / Serra de Tramuntana-Costa Nord | `https://www.illesbalearsqualitat.es/` | Bodegas fuera de las dos D.O.; sello institucional, no prueba actividad. |
| D.O.P. Oli de Mallorca | `https://www.olidemallorca.es/` | Almazaras y marcas inscritas; separar almazara de marca embotelladora. |
| D.O.P. Queso Mahón-Menorca | `https://www.quesomahonmenorca.com/` | Queserías artesanas e industriales inscritas; distingue artesano de industrial. |
| I.G.P. Sobrasada de Mallorca | `https://www.sobrasadademallorca.org/` | Industrias elaboradoras adheridas; contrastar web propia. |
| I.G.P. Ensaimada de Mallorca | `https://www.ensaimadademallorca.org/` | Obradores inscritos; muchos forns de Palma dependen de esta lista. |
| D.O. Ametlla / Almendra Mallorquina | `https://www.illesbalearsqualitat.es/` | Marca de calidad; útil para Besso y Ametlla+. |
| Gin de Mahón | `https://www.illesbalearsqualitat.es/` | Única D.G. de ginebra española; ancla para Xoriguer. |
| Vi de la Terra Eivissa / Formentera | `https://www.illesbalearsqualitat.es/` | Bodegas pitiusas; el catálogo es corto y cerrado. |
| CBPAE (ecológico balear) | `https://www.cbpae.org/` | Operadores certificados; registro de certificación, `parcial` como techo. |
| Producte Balear / Illes Balears Qualitat | `https://www.illesbalearsqualitat.es/` | Descubrimiento institucional; una ficha genérica no verifica actividad actual. |

## Plan y worklist congelada

Los lotes BAL-01..BAL-16 cubren exactamente los **168 slugs iniciales sin
solaparse**. No recalcular la membresía si una fila se purga, fusiona o
recategoriza: los slugs están congelados debajo. BAL-17 es el cierre transversal.

| # | Lote | Filas | Estado | Foco |
|---|---|---:|---|---|
| BAL-01 | D.O. Binissalem · Binissalem y Consell | 9 | ✅ 2026-07-21 | 8 verificado, 1 parcial; 2 ventas online resueltas (Ferrer y Antonio Nadal Ros) y 1 caída (Can Fumat); 1 merge por municipio erróneo (Ava Vins a Sencelles); 1 dominio secuestrado retirado (Biniagual). |
| BAL-02 | D.O. Binissalem · Santa Maria, Sencelles, Santa Eugènia | 10 | Pendiente | Incluye 1 VO=sí y Son Juliana sin coordenadas. |
| BAL-03 | D.O. Pla i Llevant A · Felanitx, Llucmajor, Manacor, Algaida, Montuïri | 9 | Pendiente | Bodegas del llano; vigilar marca vs bodega. |
| BAL-04 | D.O. Pla i Llevant B · Petra, Porreres, Muro, Sta. Margalida, Santanyí | 7 | Pendiente | Incluye Mesquida Mora (VO=sí). |
| BAL-05 | Vi de la Terra · Tramuntana, Pollença, Palma | 9 | Pendiente | Fuera de D.O.; Can Axartell sin coordenadas y VO=sí. |
| BAL-06 | Aceite · D.O.P. Oli de Mallorca | 13 | Pendiente | Almazara vs marca; par duplicado Cooperativa de Sóller; Oli de Santanyí VO=sí sin coordenadas. |
| BAL-07 | Charcutería · I.G.P. Sobrasada de Mallorca | 12 | Pendiente | Obrador vs carnicería; Ferriol VO=sí; Estrany sin coordenadas. |
| BAL-08 | Lácteos y quesos · Mallorca | 11 | Pendiente | 3 sin web; nombres dudosos (Short des Pont, Dairy Mercè); par Son Jover y par Sa Teulera. |
| BAL-09 | Fruta y verdura · Mallorca | 13 | Pendiente | Cooperativas con supermercado; contrapartes de los pares duplicados. |
| BAL-10 | Pan y pastelería · I.G.P. Ensaimada | 13 | Pendiente | Forns de Palma; Fornet de la Soca VO=sí; Gelabert sin coordenadas ni web propia. |
| BAL-11 | Licores, sal, bebidas, cerveza y frutos secos · Mallorca | 11 | Pendiente | 6 recategorizaciones probables desde `Otros`; 5 VO=sí. |
| BAL-12 | Menorca · D.O.P. Mahón-Menorca A (Alaior y Ciutadella) | 12 | Pendiente | Coinga es industrial; Binigafull sin web; Cavalleria Nova VO=sí y parcial. |
| BAL-13 | Menorca · D.O.P. Mahón-Menorca B (Es Mercadal, Ferreries, Maó, Sant Lluís) | 11 | Pendiente | Hort de Sant Patrici con web de directorio; Algendaret sin web. |
| BAL-14 | Menorca · resto (vino, aceite, cerveza, gin, miel, pastelería, hortícola) | 10 | Pendiente | 4 VO=sí; grafía `Mahón`; Torralbenc es hotel-bodega. |
| BAL-15 | Eivissa | 13 | Pendiente | 2 slugs con parroquia; Sa Nostra Mel con web de directorio; 2 VO=sí. |
| BAL-16 | Formentera | 5 | Pendiente | Catálogo cerrado; 3 sin coordenadas, 2 sin web, Peix Sec VO=sí. |
| BAL-17 | Cierre transversal | Todas | Pendiente | 0 pendientes, evidencia, venta, geo, dedup, imágenes y `verify:data`. |

### BAL-01 — D.O. Binissalem, Binissalem y Consell

Ocho de las nueve quedan `verificado` y Ava Vins en `parcial`. Incidencias
reutilizables en el resto de la provincia:

- **Un dominio caducado puede volver como otra cosa.** `bodegabiniagual.com` se
  re-registró el 2025-06-22 vía Gname.com y hoy hace 301 a `gas138go.com`, un
  portal de apuestas indonesio. La bodega existe y sigue inscrita en la D.O.: el
  problema era solo el dominio. Se sustituyó por `finca-biniagual.com` y se
  vació el correo, que colgaba del dominio secuestrado. Es el mismo patrón de
  brainapple.es en Burgos y Destraperlo en Cádiz: **comprobar a dónde redirige
  cada web, no solo que responda 200.**
- **El listado del consejo no cubre a todos.** Cuatro filas del lote —Tianna
  Negre, Ribas, Ava Vins y Antonio Nadal Ros— no están en el registro de la D.O.
  Binissalem y sin embargo son bodegas reales: embotellan bajo IGP Mallorca o
  Vi de la Terra. **Ausencia del consejo no es motivo de purga**; obliga a buscar
  la denominación correcta.
- **Biniali es llogaret de Sencelles, no de Consell.** Ava Vins estaba en el
  municipio equivocado y su web del volcado (`avavins.com`) ni siquiera tiene
  registro DNS; el dominio real es `ava-vi.es`. Municipio, dirección, teléfono,
  correo y coordenadas rehechos, con `merge` a `ava-vins-sencelles`.
- **Las direcciones sintéticas se inventan calles plausibles.** Vins Nadal no
  está en «Carrer Ramon y Cajal» sino en Ramon Llull, y Tianna Negre no está en
  «Camí des Marjals» sino en Camí des Mitjans. Ambas calles existen en el pueblo,
  así que el error no se detecta sin abrir la web del productor.
- **Formulario de contacto no es venta online.** Can Fumat baja de `sí` a `no
  comprobado`: catálogo sin carrito y formulario genérico. En cambio Ferrer
  (tienda propia con envío a Baleares, península y UE) y Antonio Nadal Ros
  (carrito y pasarela activos) suben a `sí` + `ecommerce`.
- **Fallo de fetch ≠ web muerta.** `www.bodegaribas.com` da error de certificado
  porque el altname solo cubre el dominio sin `www`; el sitio está vivo. Ese
  fallo no debe leerse como baja.

### Membresía exacta por lote

**BAL-01 (9):** `bodegas-jose-luis-ferrer-binissalem`, `vins-nadal-binissalem`,
`bodega-biniagual-binissalem`, `ava-vins-consell`, `bodega-ribas-consell`,
`celler-tianna-negre-binissalem`, `ca-n-verdura-viticultors-binissalem`,
`antonio-nadal-ros-bodegas-and-vinedos-binissalem`, `celler-can-fumat-binissalem`.

**BAL-02 (10):** `macia-batle-santa-maria-del-cami`,
`jaume-de-puntiro-santa-maria-del-cami`,
`7103-petit-celler-santa-maria-del-cami`, `binigrau-sencelles`,
`celler-son-prim-sencelles`, `celler-ca-sa-padrina-sencelles`,
`celler-sebastia-pastor-santa-maria-del-cami`, `vinya-taujana-santa-eugenia`,
`celler-can-ramis-sencelles`, `celler-son-juliana-santa-maria-del-cami`.

**BAL-03 (9):** `can-majoral-algaida`, `pere-seda-manacor`,
`vins-miquel-gelabert-manacor`, `toni-gelabert-manacor`,
`bodegas-bordoy-llucmajor`, `bodegas-vi-rei-llucmajor`,
`4-kilos-vinicola-felanitx`, `bodega-blanca-terra-montuiri`,
`armero-i-adrover-vinicultors-felanitx`.

**BAL-04 (7):** `bodegas-miquel-oliver-petra`, `butxet-viticultors-muro`,
`can-coleto-petra`, `bodega-can-feliu-porreres`,
`galmes-i-ribot-santa-margalida`, `celler-mesquida-mora-porreres`,
`celler-son-alegre-santanyi`.

**BAL-05 (9):** `bodegas-xaloc-pollenca`, `bodegas-mortitx-escorca`,
`castell-miquel-alaro`, `bodega-son-mayol-palma`, `bodegas-can-xanet-pollenca`,
`celler-son-vives-banyalbufar`, `celler-can-vidalet-pollenca`,
`celler-can-axartell-pollenca`, `celler-son-puig-puigpunyent`.

**BAL-06 (13):** `aubocassa-manacor`, `son-moragues-valldemossa`,
`oli-solivellas-alcudia`, `treurer-algaida`, `son-naava-montuiri`,
`oli-son-catiu-lloseta`, `cooperativa-de-soller-soller`, `son-mir-palma`,
`finca-es-fangar-felanitx`, `oli-de-sant-joan-sant-joan`, `sa-cadernera-palma`,
`son-mesquidassa-felanitx`, `oli-de-santanyi-santanyi`.

**BAL-07 (12):** `embutidos-munar-porreres`,
`la-luna-embutidos-de-soller-soller`, `embutidos-el-zagal-felanitx`,
`can-company-llubi`, `carnisseria-can-estela-palma`, `can-pere-joan-inca`,
`sobrasada-de-mallorca-ferrer-algaida`, `sobrasades-sa-caldera-sant-joan`,
`embotits-ferriol-sineu`, `embutidos-estrany-inca`, `carniques-sunyer-manacor`,
`embotits-obrador-can-manxa-felanitx`.

**BAL-08 (11):** `formatges-burguera-campos`,
`formatges-grimalt-lloret-de-vistalegre`, `short-des-pont-manacor`,
`formatgeria-gotes-en-ram-palma`, `formatges-de-son-jover-inca`,
`sa-teulera-petra`, `formatges-lluc-llucmajor`, `sa-cabreta-pollenca`,
`fet-a-son-garrova-sant-llorenc`, `dairy-merce-costitx`,
`formatgeria-es-collet-manacor`.

**BAL-09 (13):** `cooperativa-de-soller-citricos-soller`,
`cooperativa-de-pollenca-pollenca`, `agromart-balear-llucmajor`,
`es-merca-palma`, `sa-vinyassa-ecocitricos-soller`,
`finca-eco-son-barrina-llubi`, `biogranja-la-real-palma`,
`finca-son-jover-huerta-inca`, `finca-eco-sa-teulera-huerta-petra`,
`cooperativa-d-arta-arta`, `illacamp-sat-sa-pobla`, `terracor-manacor`,
`finca-son-mut-nou-llucmajor`.

**BAL-10 (13):** `forn-fondo-palma`, `forn-y-pastisseria-trias-palma`,
`pastisseria-pomar-campos`, `forn-de-la-gloria-palma`,
`forn-santo-cristo-palma`, `pastisseria-lluis-perez-palma`,
`forn-y-pastisseria-ca-na-teresa-palma`, `forn-de-sant-francesc-inca`,
`forn-de-can-joan-de-saigua-palma`, `pastisseria-i-forn-can-salem-algaida`,
`fornet-de-la-soca-palma`, `forn-i-pastisseria-gelabert-llubi`,
`pastisseria-can-xim-pollenca`.

**BAL-11 (11):** `flor-de-sal-des-trenc-campos`, `licores-moya-arta`,
`bodegues-i-destilleries-suau-marratxi`, `destilerias-tunel-marratxi`,
`sullerica-soller`, `mallorca-beer-co-campanet`, `dos-perellons-palma`,
`besso-de-mallorca-porreres`, `ametlla-plus-de-mallorca-son-servera`,
`especias-crespi-palma`, `refrescos-puig-palma`.

**BAL-12 (12):** `coinga-alaior`, `quesos-torralba-alaior`,
`queso-quintana-alaior`, `subaida-alaior`, `son-piris-ciutadella`,
`sant-joan-gran-ciutadella`, `alcaidus-alaior`, `binigarba-ciutadella`,
`binigafull-ciutadella`, `son-caravinya-ciutadella-de-menorca`,
`formatgeria-es-tudons-ciutadella-de-menorca`, `cavalleria-nova-ciutadella`.

**BAL-13 (11):** `tirant-nou-es-mercadal`, `queseria-binibeca-sant-lluis`,
`queso-son-vives-ferreries`, `hort-de-sant-patrici-s-l-ferreries`,
`lluriach-es-mercadal`, `son-mercer-de-baix-ferreries`, `s-arangi-es-mercadal`,
`binillubet-es-mercadal`, `algendaret-nou-mao`, `sa-roqueta-ferreries`,
`quesos-santa-catalina-mao`.

**BAL-14 (10):** `herbera-bakery-ciutadella`,
`pastisseria-can-pons-es-mercadal`, `cooperativa-agricola-de-menorca-alaior`,
`mel-de-menorca-apicultura-menorquina-es-mercadal`, `gin-xoriguer-mahon`,
`grahame-pearce-menorca-mao`, `pastisseria-artesana-lluis-febrer-ferreries`,
`bodega-binifadet-sant-lluis`, `bodega-torralbenc-alaior`,
`son-felip-ciutadella-de-menorca`.

**BAL-15 (13):** `salinas-de-ibiza-ibiza`, `ses-cabretes-santa-eularia`,
`granja-artina-san-rafael`, `can-caus-santa-gertrudis`,
`ibosim-brewhouse-sant-josep-de-sa-talaia`,
`familia-mari-mayans-sant-antoni-de-portmany`,
`can-miquel-guasch-santa-eularia-des-riu`,
`cooperativa-agricola-sant-antoni-sant-antoni-de-portmany`,
`cooperativa-agricola-santa-eularia-santa-eularia-des-riu`,
`sa-nostra-mel-mel-de-can-mari-sant-joan-de-labritja`,
`can-rich-sant-antoni-de-portmany`, `can-maymo-sant-antoni-de-portmany`,
`ibizkus-santa-eularia-des-riu`.

**BAL-16 (5):** `bodega-terramoll-formentera`,
`bodega-cap-de-barbaria-formentera`, `forn-can-jeroni-formentera`,
`peix-sec-formentera-formentera`, `mel-de-formentera-formentera`.

## Flujo mecánico por lote

1. Leer `AGENTS.md`, las reglas duras de este ledger y el lote en curso. No
   cargar CSV/JSONL completos en la conversación.
2. Ejecutar `git status --short`. Si ya hay cambios ajenos en Baleares, detener
   el lote; no mezclar dos agentes sobre la misma provincia.
3. Localizar únicamente los slugs del lote con `rg`. Investigar primero la fuente
   común del sector y luego una fuente propia por fila.
4. Para cada slug tomar exactamente una decisión: `verificado`, `parcial`, purga
   o fusión. Actualizar datos factuales que la fuente sostenga; no rellenar
   opcionales por intuición.
5. Resolver `Venta online` solo si se comprueba pedido remoto actual. Dejar `no
   comprobado` cuando no se vea vía válida; no convertir ausencia de tienda
   en `no`.
6. Editar el CSV con parser CSV, preservando las 20 columnas y LF. Añadir una
   línea JSONL por decisión con `reviewedBy: "claude-baleares-2026-07"` y fecha
   real de revisión. Para `verificado`, los sources deben cubrir `identity`,
   `producer-activity` y `municipality` y contener al menos un tipo verificable.
7. Actualizar la fila de la worklist: estado, fecha, recuentos finales, ventas
   resueltas, purgas/fusiones/recategorizaciones y excepciones.
8. Validar antes de abandonar el lote:

   ```bash
   npx pnpm check:csv:changed
   npx pnpm check:evidence
   npx pnpm check:evidence:changed
   git diff --check
   ```

9. No hacer commit ni iniciar el lote siguiente si falla una puerta. Mantener un
   solo lote en curso para que una interrupción tenga punto de reanudación
   inequívoco.

## Cierre transversal: BAL-17

La pasada se considera cerrada cuando:

- quedan **0 `pendiente`** y cada `parcial` tiene motivo y evidencia coherentes;
- cada fila activa tiene su último `keep` y cada purga/fusión conserva tombstone;
- todos los `Venta online=sí` tienen canal y la dependencia del canal existe
  (`ecommerce`/web, `email`/correo, `telefono|whatsapp`/teléfono);
- las 13 faltas de coordenadas están resueltas o documentadas, sin saltos
  bloqueantes, y las grafías de municipio quedan unificadas;
- no hay duplicados normalizados de nombre+municipio, webs de directorio como
  web propia ni slugs/imágenes desalineados;
- `data/evidence/coverage.json` incluye `illes-balears/baleares` solo tras
  confirmar cobertura de todas las filas activas;
- `npx pnpm verify:data` y `git diff --check` terminan correctamente;
- el resumen final de este ledger registra filas, estados, ventas/canales,
  evidencia, purgas/fusiones, warnings aceptados e imágenes pospuestas.
