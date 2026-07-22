# Verificación provincial de Badajoz

Ledger para planificar y reanudar la primera revisión profunda de
`data/csv/extremadura/badajoz.csv`. El CSV es la fuente de verdad; la evidencia
estructurada se crea en `data/evidence/extremadura/badajoz.jsonl` al cerrar
BAD-01.

Procedimiento en `docs/VERIFICATION_TECHNIQUES.md`; contratos en
`docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md` y `docs/EDITORIAL_POLICY.md`.
Aquí solo va el contexto provincial y la worklist congelada.

## Estado inicial

- Inicio: **2026-07-22**.
- Snapshot: **447 filas**; **0 `verificado`**, **52 `parcial`**, **395
  `pendiente`**. Es la provincia más grande sin ninguna pasada.
- Venta online: **28 `sí`**, 0 `no`, 419 `no comprobado`. Las 28 `sí` son
  heredadas y **ninguna tiene `Canal de venta`**.
- Categorías: Charcutería 100, Pan y pastelería 75, Aceite 64, Bodega 60,
  Lácteos y quesos 44, Fruta y verdura 37, Despensa artesanal 30, Miel 21,
  Aperitivos 5, Cerveza artesana 5, Huevos 4, Otros 2.
- Territorio: 98 municipios. Almendralejo 38, Badajoz 28, Mérida 22, Castuera 21,
  Monesterio 17, Don Benito 17, Montijo 15, Zafra 12, Villafranca de los Barros 12.
- Enlaces: `Google Maps` 447/447, dirección 447/447, productos estrella 447/447,
  web 293, Facebook 194, teléfono 416, correo 172, Instagram 124.
- Coordenadas: 445/447. Imágenes: 200/447.
- Puertas: contrato **OK, 0 errores**; calidad **444 warnings** (441 de
  descripción boilerplate + 3 geo >15 km); **12 filas se saltan el geo-check**
  por municipio ausente de `municipios.json`.
- No existe el JSONL provincial y Badajoz no figura en `data/evidence/coverage.json`.
- No existe `docs/candidates/badajoz.md`. Esta pasada **no añade filas**: el
  objetivo es cerrar las 447 heredadas.

## Tres estratos de procedencia

A diferencia de Baleares, aquí el volcado **no es sintético: es un scrape real**,
y buena parte tiene además respaldo institucional. La huella separa el CSV en
tres bloques disjuntos:

| Estrato | Filas | Firma | Estado heredado |
|---|---:|---|---|
| **A1 · Catálogo de la Diputación + Places** | 136 | slug idéntico al del catálogo provincial, `Google Maps` con `place_id=` | 136 `pendiente` |
| **A2 · solo Places** | 255 | `place_id=` sin ficha en el catálogo | 255 `pendiente` |
| **B · integración manual previa** | 56 | `Google Maps` con `query=` textual, coords redondeadas | 52 `parcial`, 4 `pendiente` |

- **A1 es el hallazgo que cambia el plan.** El
  [Catálogo de Productores Locales de la Provincia de Badajoz](https://catalogoproductoslocales.dip-badajoz.es/)
  (Diputación) publica 138 fichas, y **136 están en el CSV con el slug idéntico**:
  el catálogo es fuente directa de esas filas. Las dos que faltan son
  `casa-pinito` y `catering-cantueso` (catering, fuera de alcance). Para esas 136
  la identidad, el municipio y el contacto están respaldados por un registro
  institucional; falta la fuente propia que sostenga actividad y venta.
- **El estrato A tiene datos reales, no inventados.** Dirección, coordenadas y
  teléfono vienen de la ficha de Places, no de una plantilla. Se contrastan, no
  se rehacen. 205 filas traen horario y 178 imagen.
- **A2 concentra el riesgo y las purgas.** 255 filas sin respaldo institucional,
  **116 de ellas sin web, ni Instagram, ni Facebook**: solo el pin de Places.
  Por categoría: Charcutería 70, Pan y pastelería 53, Bodega 37, Fruta y verdura
  29, Aceite 19, Despensa artesanal 18, Lácteos y quesos 15, Miel 8, Huevos 4,
  Cerveza artesana 2.
- **Lo que el estrato A no prueba es que la fila sea un productor.** Un scrape
  de Places por categoría arrastra tiendas, carnicerías de barrio, despachos de
  pan, almacenes mayoristas y distribuidores. **65 slugs empiezan por
  `carniceria|charcuteria|panaderia|pasteleria|dulceria|confiteria|horno|obrador`**:
  ahí está el grueso de la duda. El criterio es el de siempre — entra quien
  elabora, no quien solo revende.
- **La descripción es boilerplate por categoría, no por fila.** Seis plantillas
  cubren 367 filas («Productor local de jamones, embutidos o elaborados cárnicos
  de tradición extremeña», etc.). No aportan nada y hay que reescribirlas al
  tocar la fila.
- **El estrato B viene del commit `52233ec`** («Badajoz/Palencia/Valladolid:
  integrar y verificar candidatos»). Son productores con nombre y dominio propio
  plausible, pero se quedaron en `parcial` y con la venta online sin canal: se
  reauditan igual que el resto.

## Anomalías detectadas en la auditoría previa

Cada una se resuelve en el lote de su fila; se listan para no redescubrirlas.

1. **Tres geo-warnings >15 km**: `encina-blanca-de-alburquerque` (21,6 km de
   Alburquerque, más cerca de Herreruela), `almazara-la-cana` (44,4 km de
   Badajoz, a 0,7 km de Puebla de Obando) y `bodegas-vinedos-pozanco-s-l`
   (22,5 km de Mérida, a 5,5 km de Solana de los Barros). En los tres el
   sospechoso es el `municipio`, no la coordenada.
2. **Diez pedanías puestas como municipio** (12 filas), que por eso escapan al
   geo-check: `El Raposo`, `Valdivia`, `Barbaño`, `Zurbarán`, `Helechal`,
   `Gévora`, `Alvarado`, `Pallares`, `Valdebótoa`, `Vivares`. Se corrigen al
   municipio oficial confirmado, como `Isso` en Albacete o `Fornillos` en Zamora.
   Los slugs de Badajoz no llevan municipio, así que **no hay `merge` que hacer**.
3. **Cuatro filas apuntan a `gff.co.uk`** (directorio británico Guild of Fine
   Food) como web: `el-prado-de-llera-s-l-llera`,
   `el-senorio-de-monesterio-s-c-monesterio`, `finca-buenavista-ribera-cb-ribera-del-fresno`
   y `scl-comarcal-agricola-ganadera-castuera-castuera`. No es web propia:
   sostiene identidad, no actividad ni venta.
4. **Cuatro teléfonos repetidos en dos filas cada uno**: `+34924811301`,
   `+34924642026`, `+34924780235`, `+34924222867`. Posibles duplicados o dos
   fichas de la misma unidad productiva.
5. **128 filas `pendiente` sin web, sin Instagram y sin Facebook**: solo tienen
   la ficha de Places. 40 son Pan y pastelería, 22 Charcutería, 17 Fruta y
   verdura, 14 Bodega. Aquí el techo será `parcial` salvo que aparezca fuente
   propia, y varias serán purga.
6. **Seis webs de directorio, blog o site gratuito**: `mermeladas-glasai`,
   `panaderia-pasteleria-lavado-y-lavado`, `quesos-atalaya` (blogspot),
   `carniceria-fabrica-de-embutidos-el-pantano-…`, `queseros-parrenos` (Google
   Sites) y `floralia-miel-espana` (apunta a `apiturismolasiberia.com`).
   Un blog propio sí es fuente propia; comprobar que sigue vivo y es del titular.
7. **`nestle-waters`** está en el CSV como `Otros`. Una multinacional embotelladora
   no es productor de proximidad: candidata clara a purga en BAD-30.
8. **Barrido de webs (2026-07-22)**: de las 293 webs, la mayoría responde 200,
   pero hay un residuo de fallos de conexión y 4xx/5xx. Fallo de fetch **no es
   sitio muerto**: confirmar por otra vía antes de vaciar la URL.

## Reglas duras para Badajoz

1. **Se reauditan las 447 filas.** Las 52 `parcial` heredadas no se dan por
   buenas; necesitan evidencia actual igual que las 395 pendientes.
2. **El scrape de Places se contrasta, no se rehace.** Al contrario que en
   Baleares, dirección y coordenadas del estrato A son reales. Solo se corrigen
   cuando la fuente propia diga otra cosa. El horario de Places sí se revisa: si
   no lo publica la fuente propia ni la ficha vigente, se vacía.
3. **Productor, no punto de venta.** Panadería, pastelería, carnicería y
   charcutería solo entran si elaboran. Un despacho que revende pan de otro
   obrador, una tienda de jamones o un almacén hortofrutícola que solo comercializa
   no son productores. En caso de duda documentada sin resolver: `parcial`, no
   `verificado`; sin rastro de elaboración: purga.
4. **La cooperativa de granel es el caso límite de esta provincia.** Badajoz está
   lleno de cooperativas de aceite y vino que venden a granel a envasadores. Si
   no hay marca propia embotellada/envasada dirigida a consumidor final, se aplica
   el criterio B2B de Albacete: purga. Si la hay, entra.
5. **Un directorio no basta para `verificado`.** `gff.co.uk`, Tasting Extremadura,
   Alimentos de Extremadura o la ficha de Places sostienen identidad y
   localización, y topan en `parcial`. Para `verificado` hace falta además fuente
   propia que sostenga identidad, actividad productora actual y municipio.
6. **La inscripción en D.O.P./I.G.P. no demuestra actividad ni venta.** Es ancla
   de contraste, no prueba.
7. **`Venta online=sí` exige `Canal de venta`.** Tienda propia con checkout,
   pedido por WhatsApp, correo, teléfono o marketplace concreto. Un catálogo PDF
   o un formulario de contacto no es venta online.
8. **Descripción propia al tocar la fila.** Ninguna fila cerrada puede quedarse
   con el boilerplate de categoría.

## Anclas de contraste

- **Catálogo de Productores Locales de la Diputación de Badajoz** —
  `catalogoproductoslocales.dip-badajoz.es/es/productor/<slug>`. El ancla
  principal: 138 fichas con nombre, municipio, dirección, contacto y productos,
  y **slug compartido con el CSV**, así que se cruza sin buscar. Es directorio
  institucional: topa en `parcial`.
- **D.O. Ribera del Guadiana** — `riberadelguadiana.eu` (Almendralejo). Cubre las
  bodegas; la lista pública son ~21 bodegas, muy por debajo de las 60 filas del
  CSV, así que **no sirve como prueba de exclusión**.
- **D.O.P. Queso de la Serena** — consejo regulador en Castuera; 21 municipios de
  La Serena. Ancla para el bloque de Castuera / Cabeza del Buey / Zalamea.
- **D.O.P. Dehesa de Extremadura** — ibérico; ancla del bloque Monesterio /
  Jerez de los Caballeros / Fregenal.
- **D.O.P. Aceite Monterrubio** — almazaras de Monterrubio de la Serena y comarca.
- **I.G.P. Ternera de Extremadura**, **I.G.P. Cordero de Extremadura**.
- **Alimentos de Extremadura / Tasting Extremadura** — directorio de la Junta:
  identidad y pertenencia, topa en `parcial`.

## Worklist congelada (30 lotes)

Orden por categoría y municipio, 15 filas por lote, para que cada lote comparta
registro de contraste. La lista está congelada: si una fila se purga o se fusiona
**no se renumera**, se anota en el cierre del lote.

Leyenda: ⏳ pendiente · ✅ cerrado

### BAD-01 · Aceite — ✅
ermita-del-ara, cooperativa-san-mauro, aceite-finca-la-jacoba, aceite-de-arbequina-victoriano, almazara-la-cana, oleicola-berlanguena, almagral-coop-olivarera-cabeza-del-buey, tentuoliva, cooperativa-al-kasera, aceite-de-oliva-olea-organic, el-lacara, casat-don-benito, cooperativa-olivarera-nuestra-senora-de-las-cruces, ntra-senora-de-las-cruces, vianoleo

### BAD-02 · Aceite — ✅
almazara-de-fuente-de-cantos-s-l, aceites-obreo, coop-olivarera-ntra-sra-de-los-angeles, sociedad-cooperativa-de-colonos-de-gevora, castuo-cooperativa-cooperativa-de-aceite-y-vino, el-turunuelo-aove, naturvie, retamar-aceite-con-alma, aceite-de-oliva-jose-manuel-izquierdo-tena, ntra-senora-de-consolacion, cooperativa-de-hornachos, valdelaseras, cooperativa-santa-quiteria, cooperativa-canchalosa, agrollerena-y-comarca

### BAD-03 · Aceite — ✅
cooperativa-pedro-de-alvarado-lobon, albalata, cooperativa-san-antonio-de-padua, almazara-las-torres, baeturia, aceite-olevm, oliva-nature, cooperativa-san-isidro, aceites-juzgado, la-milagrosa, la-monterrubiana, la-unidad, sabor-de-extremadura, extrema-oliva, aceites-bonet

### BAD-04 · Aceite — ✅
aceites-orellana, aceites-del-pozo, almazara-molero-maza, marquesado-de-obando, aceites-clemen, olivareros-ribera-del-fresno, aceites-villamur-aove-extremadura-santa-amalia-aceite-de-oliva-virgen-extra, aceites-siruela, mundioliva, sol-de-barros, bio-alandre, cooperativa-la-siberia-extremena, alguijuela, almazara-de-villafranca-s-l, almazara-ducoy-olive-oil

### BAD-05 · Aceite / Bodega — ✅
almazara-molino-de-zafra, olivense, aceite-de-oliva-virgen-extra-telesforo-perez, aceites-tome, bodega-cooperativa-soledad-aceuchal, palacio-quemado, encina-blanca-de-alburquerque, bodega-vinicola-las-minitas, bodegas-lopez-morenas, bodegas-marcelino-diaz, bodegas-martinez-paiva, bodegas-oran-y-occidente, bodegas-pena-del-valle, bodegas-periane-s-l, bodegas-romale

### BAD-06 · Bodega — ✅
bodegas-san-antonio-s-a-t, bodegas-sani-primavera-s-l, bodegas-sat-satiba, bodegas-ventura-de-vega-s-l, bodegas-via-de-la-plata, bodegas-vina-extremena, leneus, vina-oliva, viticultores-de-barros, coloma-vinedos-y-bodegas, bodega-otero-vaquera-vinos-bureo, cooperativa-del-campo-san-jose-calamonte, bodega-el-coto-de-galan-s-a, delauvin, bodega-domblasco

### BAD-07 · Bodega — ✅
bodegas-bujillo, bodegas-regajo, bodegas-repite, bodegas-girol-pareja, bodegas-rey-de-los-reyes-sl, bodegas-hijos-de-francisco-escaso, cosecha-extremena, bodegas-garcia-rebollo, bodegas-s-a-t-el-majuelo, hermanos-garcia-triguero-vino-401, bodegas-castelar, bodegas-cortes, bodegas-hermanos-zapata, cooperativa-virgen-de-la-estrella, bodega-valdealto

### BAD-08 · Bodega — ⏳
bodegas-vinedos-pozanco-s-l, vina-santa-marina, bodegas-moreno, bodega-los-castuos, bodega-rosal, bodegas-macario, pago-los-balancines, bodega-puente-ajuda, bodegas-el-maestrino, bodegas-toribio-vina-puebla, bodega-cooperativa-santa-marta-virgen, bodegas-la-pelina, cooperativa-del-campo-san-isidro, bodega-pago-de-las-encomiendas, cave-san-jose

### BAD-09 · Bodega / Charcutería — ⏳
cooperativa-montevirgen, bodegas-cerro-la-barca-s-l, bodegas-angel-ortiz, bodegas-medina-el-convento, dehesa-guadarranque, fabrica-de-embutidos-manuel-guedejo, charcuteria-alfonso, charcuteria-juaqui, elaborados-sanchez-iglesias, jamon-exclusive-s-l, matarrevalva, sabor-encina-tradicion-iberica-pedro-barroso, chacinas-manuel-castillo, embutidos-hidalgo, iberazuaga

### BAD-10 · Charcutería — ⏳
charcuteria-el-paisano, el-corte-de-espin-jamoneria, embutidos-marytere, embutidos-pepe, eurojamon-s-l, ibericos-maxima-natura, la-moncloa-ibericos, mas-que-un-jamon, senorio-de-montanera, jamones-moreno-la-tradicion-del-iberico, jamones-y-embutidos-gallardo, iberico-del-brillante, carniceria-texeira, carniceria-victoriano-perez, ecoextincion

### BAD-11 · Charcutería — ⏳
jamones-guti, jamones-y-embutidos-don-benito, embutidos-pacheco-martinez, jamones-ibericos-cumplido, jamones-ibericos-de-fregenal-de-la-sierra-s-l, tomas-gonzalez-ibericos, viejo-jamon, carnicas-y-embutidos-extremenos-sl, embutidos-guareno-s-l-embutidos-artesanales-en-extremadura, ibericos-en-lonchas, productos-maximo-carnicas-y-embutidos-extremenos-s-l, santa-elena-ibericos, jamones-montanera, carniceria-fabrica-de-embutidos-el-pantano-artesanos-de-herrera-del-duque, industrias-carnicas-el-pantano

### BAD-12 · Charcutería — ⏳
embutidos-serraflor, jamones-y-embutidos-artesanos, jamones-y-embutidos-carrascal, sierra-grande-hornachos-fabrica-de-embutidos-y-salazon-de-jamones, industrias-carnicas-el-bellotero, jamones-emilio-diaz, jamones-jierrito, jamones-y-embutidos-angeles-s-l, jamones-y-embutidos-neila-s-l, juanes-iberico-salvaje, montesano-extremadura, productos-simon, sierra-extremena, comparaibericos, jamon-y-salud

### BAD-13 · Charcutería — ⏳
embutidos-morato, ibericos-bayon, ibericos-de-extremadura, carniceria-charcuteria-retama, carniceria-antonio-carmona, charcuteria-maria-auxiliadora, ibericos-angelito, ibericos-el-capote, ibericos-rodriguez, matadero-iberico-de-merida-s-l, arte-corte, el-culebrin, galan-moreno, ibericos-casa-lucas, ibericos-jose-zoilo

### BAD-14 · Charcutería — ⏳
ibermonesterio, jamon-de-monesterio, jamones-sierra-de-monesterio, tentuiberico, victoriano-contreras-barragan, carniceria-domingo-gordillo, carniceria-martinez-crespo, carniceria-y-embutidos-hermanos-martinez-martin, charcuteria-casa-hernandez, jamon-curado-a-cuchillo-guadyerbas-charcuteria-montijo, degil-ibericos, embutidos-paqui, fabrica-de-embutidos-y-secadero-de-jamones-moya, senorio-porrino, carniceria-manuela-morera

### BAD-15 · Charcutería / Lácteos y quesos — ⏳
embutidos-romero, carniceria-anastasio-nunez-antunez, charcuteria-la-alacena, jamones-y-embutidos-hernandez, productos-del-encinar-sl-jamon-de-bellota-iberico, embutidos-cadenas, fabrica-embutidos-y-jamones-hnos-castano, embutidos-y-jamones-hnos-caceres-rodriguez, ea-group, corte-iberica-fabricacion-y-distribucion, embutidos-silva, ibericos-gomez-rico, iberllota-jamones-ibericos, embutidos-antonio-centeno, dona-leonor-de-alburquerque

### BAD-16 · Lácteos y quesos — ⏳
quesos-moran-piris, quesos-sierra-la-horca, toril-del-cardo, mama-cabra, queseria-el-majadal, artesanos-del-queso, queserex-quesos-de-la-serena, queseria-garcia-risco, quesos-reborto, queseria-artesana-tesoro-de-cabra, comercial-royca, cremositos-del-zujar, castilcerro, covica, granja-queseria-castrum-erat

### BAD-17 · Lácteos y quesos — ⏳
lacteos-de-castuera, quesos-atalaya, quesos-el-guilero, quesos-sanchez-hidalgo, quesos-tena-nunez, quesos-y-tortas-de-la-serena, scl-comarcal-agricola-ganadera-castuera-castuera, serena-pura, simon-romero, hmm-quesos-y-jamones-ibericos, quesos-de-la-sierra, queseria-hermanos-zapata-leche-cruda-de-cabra, quesos-roniel, queseros-parrenos, el-prado-de-llera-s-l-llera

### BAD-18 · Lácteos y quesos / Pan y pastelería — ⏳
quesos-dona-ines-s-l, quesos-marina, el-senorio-de-monesterio-s-c-monesterio, queseria-artesanal-abuela-cecilia, quesos-rufino-afinadores, queseria-utrero, primitivo-sanchez, finca-buenavista-ribera-cb-ribera-del-fresno, queseria-buena-vista, quesos-santiago-madera, queseria-tierra-de-barros, quesos-pinto, jarropa-y-sita-queseria-artesana, obrador-de-dulces-artesanos-leo, dulces-artesanos-castillo

### BAD-19 · Pan y pastelería — ⏳
panaderia-obrero, clarisas, el-obrador-de-gamero-gil-espacio-de-creacion-artistica, exmesa, horno-virgen-de-guadalupe-s-l, panaderia-pasteleria-bolleria-artesana, pasteleria-artesanos-panvira, el-callejon-de-las-delicias, panaderia-vera, lazaro-pasteleros, panaderia-pasteleria-lavado-y-lavado, panaderia-carrasco-v-generacion, arteluc, la-bruja-dulce, panaderia-dulceria-el-miajon

### BAD-20 · Pan y pastelería — ⏳
panaderia-juan-diaz-moreno, panaderia-confiteria-barrientos-hilinger-s-l, turrones-dos-hermanos, medina-rincon-dulceria-artesana, panaderia-bolleria-j-j, panaderia-francisco-javier-medina-gallego, panaderia-la-gloria, pasteleria-mario-medina, pasteleria-pepi-sanchez, pasteleria-el-pilar, la-tahona-de-meripan-obrador-artesano, obrador-la-abuela-juli, dulces-artesanos-romo, productos-castano-dulceria-panaderia, panaderia-y-pasteleria-luis-macias-e-hijos-s-l

### BAD-21 · Pan y pastelería — ⏳
pasteleria-obrador-canela, pasteleria-mauro, chocolate-moro, panaderia-makana, panaderia-pasteleria-avalos, raices-pasteleria-argentina, santa-clara-dulces-artesanos, panaderia-el-valle-horno-los-remedios, pasteleria-arte-dulce-golosa-obrador, dulces-artesanos-capricho-extremeno-cb, obrador-artesano, dulceria-san-jose, horno-los-remedios, pasteleria-artesanos-roco, pasteleria-marquesa-de-pinares

### BAD-22 · Pan y pastelería — ⏳
pasteleria-tradicion-extremena-s-l, horno-monesterio, abocao-pasteleria, la-cuba, obrador-oliva-sin-gluten, dulces-ruiz, dulceria-la-chimenea, panaderia-artesana-garrido-e-hijas, panaderia-dulceria-la-espiga, pasteleria-casa-fuentes, panaderia-concepcion, panaderia-obreo, panaderia-pasteleria-aguilera, panaderia-collado-cebrino, freeglut

### BAD-23 · Pan y pastelería / Fruta y verdura — ⏳
la-abuela-laly, dulceria-dolores, pasteleria-angel-cascales, pasteleria-artesanal-la-siberia, panaderia-asensio, panaderia-ortiz, pasteleria-oron-y-chaves, el-horno-del-seron, obrador-artesano-quintana, la-cercana-pasteleria-artesanal, obrador-el-colibri, dulce-el-cristo, dulces-el-cristo-de-zalamea-s-l, ajos-hnos-trejo, ajos-montejano

### BAD-24 · Fruta y verdura — ⏳
ajos-tierra-de-barros, cooperativa-extremena-de-ajos-de-aceuchal-s-c, interajos-s-l, rudasil-s-l-venta-de-ajos-al-por-mayor, exproa-extremena-de-productos-agricolas-2011-s-l-fabrica, frutas-pulido, extremeno-aragonesa-agricola-s-a-exaasa-frutaria, frubardo, frutas-albemar-s-l, frutas-nina, frutas-kora, frutas-azamar-s-l, frutas-the-origen, cooperativa-del-campo-san-pedro, frutas-nuevo-sanabria

### BAD-25 · Fruta y verdura — ⏳
frutas-fernandez-s-l, frutaex, frutas-belinda, frutas-marin, frutas-montijo, frutas-aranzazu, frutas-jesus-de-la-o-s-l, frutas-verea, fuensana-bio, frutas-biomova, frutas-nene, central-hortofruticola-el-canito, global-pahica-frutas-nacri, frutakia, cooperativa-agricola-san-isidro

### BAD-26 · Fruta y verdura / Despensa artesanal — ⏳
frutas-diez, frutas-ramos-benitez-s-l, cooperativa-san-miguel-de-vivares, frutas-hermanos-rodriguez-elmutilao, tany-nature, aceitunas-dominguez-s-a, aceitunas-gonga, aceitunas-guadalquivir-almendralejo, aceitunas-hermanos-barroso-s-l, aceitunas-jope-s-l-u-sede-av-presidente-juan-carlos-rodriguez-ibarra-31, aceitunas-julio-alvarez-martin, aceitunas-olivexma, aceitunas-rama-jimenez-s-l, aceitunas-roman-duran, envasados-de-aceitunas-prado

### BAD-27 · Despensa artesanal — ⏳
fabrica-de-aceitunas-hoyca-s-l, aceitunas-flores-y-victoria, aceitunas-pepe, green-spirit, aceitunas-y-encurtidos-oliber, cultivando-empleo, pambiotica, cooperativa-de-aceitunas-soc-cop-rio-retin, iberex, productos-del-tito-rodrigo, conservas-martinete, aceitunas-y-cereales-carmona-s-l, hacienda-el-vedado, sol-de-valdivia, aceitunas-aguedo

### BAD-28 · Despensa artesanal / Miel — ⏳
aceitunas-fernandez, aceitunas-lopez, s-coop-san-isidro, transa, villacruz, miel-de-lazaro, germel, miel-solar-by-tesela-natura, valles-de-anam, miel-cuarta-generacion, abeja-obrera, apicola-laparra, apicola-solven, cooperativa-montemiel, floralia-miel-espana

### BAD-29 · Miel / Cerveza artesana — ⏳
miel-calabresa, miel-los-juanes, sibermiel, artesanos-virgen-de-extremadura, miel-la-siberia, bavymiel, euromiel-s-coop-de-2-grado, miel-de-juan-alvarez, miel-y-mostaza, el-encinar-del-porrino, miel-de-valverde-de-leganes, cerveza-piporra-artesana, cerveza-ballut, cerveza-de-monesterio, cerveza-extremadura-jacha-jigo-jiguera

### BAD-30 · Cerveza artesana / Aperitivos / Huevos / Otros — ⏳
sevebrau, territorios, la-turruca, roman-duran, el-conchito, patatas-fritas-mm, granja-avicola, huevos-guillen-cantos-blancos-sur, huevos-camperos-en-higuera-la-real-huevos-camperos-el-dornero, huevos-hermanos-martin-gomez-c-b-inoxa-extremadura, nestle-waters, mermeladas-glasai

## Cierres de lote

Una línea por lote al cerrarlo: filas resueltas, purgas/fusiones y lo que quede
abierto. Sin tablas de estado derivado.

- **BAD-01** (2026-07-22): 15 filas → 14. **11 `verificado`, 3 `parcial`, 0
  pendientes**; 10 `Venta online=sí` todas con canal, 1 `no` comprobado.
  1 fusión (`ntra-senora-de-las-cruces` → `cooperativa-olivarera-nuestra-senora-de-las-cruces`,
  mismo teléfono y correo). Correcciones: `lacanaaove.com` **secuestrado** por un
  portal chino de apuestas → web vaciada y municipio corregido a Puebla de Obando
  (resuelve un geo-warning); `aceitelajacoba.es` en NXDOMAIN → `aceitelajacoba.com`;
  `almagral.com` → `almagral.es`; dos correos personales sustituidos por los de rol
  publicados. Abiertas: `ermita-del-ara` (web tras reto Anubis, tienda propia sin
  comprobar), `almazara-la-cana` y `aceite-de-oliva-olea-organic` (sin rastro
  digital propio; candidatas a purga si la 2ª pasada no encuentra actividad).
- **BAD-02** (2026-07-22): 15 filas → 14. **11 `verificado`, 3 `parcial`, 0
  pendientes**; 11 `Venta online=sí` todas con canal. 1 purga:
  `agrollerena-y-comarca` (CNAE 4621, comercio al por mayor de cereales y
  aceitunas, sin almazara ni marca envasada — el caso B2B de Albacete).
  Correcciones: municipio `Gévora` → Badajoz y `Helechal` → Benquerencia de la
  Serena (ambas pedanías; el geo-skip baja de 12 a 10 filas); teléfono relleno
  `+34924000000` de Castúo sustituido por el real; dirección de `naturvie`
  movida de Oliva de Mérida a Guareña; `coopdehornachos.com` en NXDOMAIN →
  vaciada; typo «La Codesera» → La Codosera (venía del propio catálogo de la
  Diputación). El barrido de webs dio falso positivo en `almazaralosangeles.com`,
  que responde 200 al reintentar.
- **BAD-03** (2026-07-22): 15 filas, sin purgas ni fusiones. **13 `verificado`,
  2 `parcial`, 0 pendientes**; 13 `Venta online=sí` con canal y 1 `no`.
  `cooperativa-san-isidro` estaba sin web y tiene sitio propio con tienda
  (`coopsanisidro.com`): añadidos web, teléfono y correo. Dos abiertas:
  `oliva-nature` (el catálogo la registra en Mérida pero su olivar está en la
  sierra de Montánchez, Cáceres — sede y unidad productiva en provincias
  distintas) y `aceites-bonet` (Iberinform la marca inactiva mientras el
  catálogo la sigue listando; candidata a purga por cierre).
- **BAD-04** (2026-07-22): 15 filas, sin purgas ni fusiones. **12 `verificado`,
  3 `parcial`, 0 pendientes**; 10 `Venta online=sí` con canal y 3 `no`.
  Dos municipios corregidos por contradicción interna de la propia fila:
  `almazara-molero-maza` (Puebla de la Calzada → Lobón, que era lo que ya decía
  su dirección) y `almazara-ducoy-olive-oil` (Villalba de los Barros → Fuente
  del Maestre, cuyo CP 06360 ya traía el volcado). `bio-alandre` parecía web
  cruzada y no lo es: `bioalandre.com` está muerto y `crolivareros.com` es su
  propia tienda. `almazara-de-villafranca-s-l` llegaba sin teléfono, sin web y
  con la dirección reducida al municipio; se rescató del registro de Infaoliva.
- **BAD-05** (2026-07-22): 15 filas, sin purgas ni fusiones. **10 `verificado`,
  5 `parcial`, 0 pendientes**; 9 `Venta online=sí` con canal. Cierra el bloque
  de aceite (BAD-01..05, 75 filas) y abre el de bodegas.
  `encina-blanca-de-alburquerque` y `bodegas-lopez-morenas` entraban sin web y
  ambas tienen sitio propio vivo. Tres dominios muertos vaciados
  (`olivense.com`, `penadelvalle.es`, `madiaz.com`). **Aparecen los primeros
  casos límite de granel**: `bodegas-periane-s-l` (doce millones de litros a
  granel, pero inscrita en la D.O.) y `bodega-vinicola-las-minitas` (S.A.T. de
  1.250 ha sin marca embotellada); ambas quedan en `parcial` como candidatas a
  purga B2B, sin cerrar porque sus webs devuelven 500 y 403 y un bloqueo técnico
  no es prueba. Se mantiene el geo-warning de `encina-blanca`: la bodega está en
  el km 85 de la EX-324 y el término de Alburquerque es enorme.
- **BAD-06** (2026-07-22): 15 filas → 14. **10 `verificado`, 4 `parcial`, 0
  pendientes**; 9 `Venta online=sí` con canal y 1 `no`. 1 purga:
  `bodega-el-coto-de-galan-s-a`, por triple motivo — sociedad **en liquidación**,
  no es bodega de vino sino jamonera (la fila estaba además catalogada como
  Bodega) y `elcotodegalan.es` está **secuestrado** por un portal indonesio de
  casino. Segundo dominio secuestrado de la provincia. `bodegas-vina-extremena`
  entraba sin web: `vinexsa.com` murió y el sitio vivo es
  `bodegassanivinexsa.com`. `coloma-vinedos-y-bodegas` pasa de Alvarado (poblado
  de colonización) a Badajoz; el aviso geo de 15,7 km que deja es correcto y no
  se corrige. `vina-oliva` es cooperativa de segundo grado y mueve granel, pero
  envasa con marca y tiene tienda al consumidor, así que no entra en el criterio
  de purga B2B.
- **BAD-07** (2026-07-22): 15 filas → 14. **8 `verificado`, 6 `parcial`, 0
  pendientes**; 7 `Venta online=sí` con canal y 1 `no`. 1 purga:
  `bodegas-cortes`, que **lo dice su propia web** — dejó de elaborar vino y hoy
  es distribuidor oficial de Heineken para la Campiña Sur.
  `bodegas-rey-de-los-reyes-sl` traía la web como `wwwbodegasreydelosreyes.es`,
  sin el punto tras el www; con el dominio bien escrito responde y tiene tienda.
  Primera bajada de `Venta online`: `cooperativa-virgen-de-la-estrella` pasa de
  `sí` a `no comprobado` porque su tienda está en modo mantenimiento (503), que
  es incertidumbre y no negativa. Las 6 `parcial` son todas bodegas de Guareña,
  Fuente del Maestre y Hornachos sin web propia.
