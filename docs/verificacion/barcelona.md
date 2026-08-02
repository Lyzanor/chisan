# Barcelona · verificación — snapshot de mantenimiento

Pasada profunda **cerrada el 2026-06-22** (lotes 1-368: toda la cola de `pendiente`, normalización
de grafías y dedup). Detalle por lote en `git log --follow -p -- docs/verificacion/barcelona.md`.
La verdad es el CSV; tras el cierre, la pasada de ampliación «flujo 2026» (julio, ledger en
`docs/candidates/barcelona.md`) subió el catálogo a ~2.545 filas. Recuentos vivos:
`npx pnpm list:province barcelona` **acotado** con `--categoria`/`--pendientes` (no volcarlo entero).

## Estado final de la pasada (2026-06-22)

- Filas: **2.483** · verificado **1.710** · parcial **773** · pendiente **0** (snapshot inicial
  2.973/35/16/2.922; **490 purgadas**).
- Los 773 `parcial` son mayoritariamente filas de registro DAR sin presencia propia: techo real,
  no promover sin fuente primaria leída en vivo.
- Imágenes (tanda 2026-06-24): 1.092/2.483 con logo (44%); ~250 inspeccionables sin candidato
  limpio + ~1.000 sin web.
- Barcelona no está en `data/evidence/coverage.json`; la evidencia se añade al re-decidir filas.

## Reglas locales (no revertir sin nueva evidencia)

- **Grafías canónicas ya unificadas** (2026-06-22; no reabrir): Subirats · Font-rubí ·
  l'Espunyola · Bigues i Riells del Fai · Olèrdola · Castelladral (+ el Mujal→Navàs) · Sallent
  (Cabrianes) · Seva · Cal Rosal repartido entre Berga/Olvan según el lado real · Canet de Mar
  (La Montnegre) · Mollet del Vallès (Gallecs) · la Garriga · la Roca del Vallès · el Papiol ·
  la Nou de Berguedà · l'Esquirol · Vilobí del Penedès.
- **No re-normalizar** los «Municipi (nucli)» consistentes (Granollers (Palou), Sant Cugat
  (Valldoreix), Salelles (Manresa)…) ni núcleos/EMD con identidad propia (Segur de Veciana,
  Valls de Torroella, Bellaterra, Castelltallat): no son duplicados y mapearlos al municipio padre
  resta findability. Los «Barcelona - <districte>» geo-resuelven vía el split « - » de
  `lookupCentroid`.
- **Dedup registre↔marca** (patrón que más purgas dio): misma persona/teléfono/email que una fila
  de marca existente → purgar la de registro. Caso ancla: Ca n'Ustrell (purgada «Domingo Garcia,
  Josep Oriol», email traspasado a la fila de marca).
- Coordenadas corregidas a conciencia: Família Catasús → centroide de Subirats; Masia Fontirons
  (l'Espunyola, con web propia).
- Imágenes: el mismo asset/URL en marcas distintas = basura compartida (47 slugs purgados; p. ej.
  `parc_logo.png` del Parc Agrari en 20 filas del Prat); el mismo asset en sedes de una misma
  marca es legítimo.

## Fuentes locales y límites

- **DAR venda de proximitat**: `node scripts/match-dar.mjs "<municipio>"`; dataset completo
  `curl "https://analisi.transparenciacatalunya.cat/resource/xmyy-7xqi.csv?$limit=5000"`.
  Match (apellidos **y** municipi, plegando acentos) = existe → `parcial`; no prueba venta online.
  Sin DAR y sin web propia → justifica purga (registro voluntario: no constar no prueba
  inexistencia).
- Fuentes comarcales útiles: espaiagraribaixatordera.cat (Alt Maresme) · llucanesataula.cat y
  turisme.llucanes.cat (Lluçanès) · parcnaturalcollserola.cat + Festa de la Cirera (el Papiol) ·
  agrariavalles.coop (DOP mongeta del ganxet) · directori de cellers de Sta. Margarida i els
  Monjos · llista oficial Productes de Palou (Granollers).

## Para otros agentes (cross-provincia)

- Tarragona: `bodega-el-grial-sl` (El Perelló), **Cellers Avgvstvs Forvm** y **Jané Ventura**
  (El Vendrell) y **Bodega Can Marlès** (El Montmell) se purgaron de Barcelona; candidatas a
  `tarragona.csv`.
- Girona: **Hort Viu** (Les Planes d'Hostoles) candidata real; **L'Espigall** (Lladó) es
  consultoría agroambiental con producción menor en DAR — baja prioridad, solo si vende.
- Lleida: **Ferro Falgueras** (miel, Tremp) candidato. **Celler del Miracle** ya
  se trasladó de Barcelona a Riner (Solsonès) en `BCN-V1-d`, con evidencia e
  imagen movidas a la ficha `celler-del-miracle-riner`.
- Vilafranca: posible dup Forn Sant Joan vs Pastisseria Trens (mismo C/ Sant Joan 9).

## Mantenimiento (al retomar)

### Campaña prioritaria BCN-V · Ola 3 (planificada 2026-08-01)

Barcelona se aborda **antes de agotar las demás bandas** y como campaña propia,
no como el último lote grande. Medición de entrada: **2.544 filas**, 1.737
`verificado`, 807 `parcial`, 0 `pendiente` y **833 `Venta online=no
comprobado`**. Es la mayor cola provincial de Ola 3 y el CSV prioritario del
catálogo.

La campaña se divide en tandas de unas 40–70 filas, recortadas con el estado
vivo justo antes de abrirlas:

1. bodegas, en tandas sucesivas que separan webs vivas, fallos técnicos y filas
   sin web;
2. pan y pastelería (107), por municipio/distrito y en dos tandas;
3. charcutería (93), en dos tandas;
4. lácteos, cerveza, miel y aceite (90), en dos tandas;
5. fruta y verdura (199), separando presencia propia de las filas con techo DAR;
6. despensa y el resto de categorías, en lotes homogéneos hasta agotar el residual.

Cada tanda tiene dos pasadas: **V1** resuelve el canal vigente y mejora en la
misma fuente identidad, contacto, productos, descripción y ubicación; **V2**
audita todos los nuevos `sí`/`no`, los fallos técnicos y los solapes con
`evidencia-prestada`, `web-de-tercero`, `plantilla-cruzada` y texto genérico.
No se vuelca el roster completo: se trabaja con `--categoria`, `rg` y pequeños
clusters de dominio/municipio. Cada tanda cierra con evidencia para las
decisiones cambiadas, `verify:data` y commit propio.

- **BCN-V1-a · bodegas, primera pasada (2026-08-01).** Se cribaron 40 de las
  66 bodegas sin resolver que ya tenían web y se exigió producto vigente,
  precio y mecanismo real de pedido; detectar WooCommerce o un enlace
  «tienda» no bastó. Siete pasan a `sí`: Can Quetu, Cava Rovellats, Covides,
  Família Ferrer–Can Sala, Finca Espiells, Martí Grau Viticultors y Celler
  Credo. En las siete se sustituyeron productos/descripciones genéricos y se
  dejó evidencia del canal propio o del grupo productor. Canals & Domingo se
  enriqueció con oferta y contacto, pero conserva `no comprobado`: su tienda
  oficial sigue en construcción y anuncia la compra para más adelante. El
  residual provincial baja **833 → 826**. La V2 de la misma muestra quedó
  cerrada antes de abrir otra tanda: CSV y evidencia coinciden, ninguno de los
  siete nuevos `sí` aparece en una cola editorial y solo Canals & Domingo
  permanece deliberadamente en `venta-sin-resolver`. Celler Solergibert y
  Celler Sanmartí solo mostraron infraestructura de tienda; Brugarol apunta a
  una explotación de Girona; Almirall presenta contenido ajeno compatible con
  dominio comprometido; Amat Montané requiere confirmar la titularidad del
  nuevo escaparate. Ninguno se promovió por esas señales.

- **BCN-V1-b · bodegas, segunda pasada (2026-08-01).** Se profundizó en 12
  bodegas con canal oficial y se mejoró la ficha completa, no solo la marca de
  venta: productos concretos en las 12, descripciones específicas y
  correcciones de web, dirección, teléfono o correo en siete fichas. Once
  pasan a `sí`: Alella
  Vinícola–Celler Marfil, Cava Bohigas, Colet Vins, Codorníu, Parxet, Celler
  Pardas, Llopart, Cava Martín Soler, Bergonyó i Durall, Jané Santacana y Mas
  Xarot. La titularidad de las tiendas de Codorníu y Parxet se comprobó en el
  aviso legal del grupo productor; Celler Marfil y Colet reemplazan datos y
  dominios históricos, y Pardas adopta como `web` su tienda oficial viva ante
  el fallo del dominio corporativo. Celler Avenc del Garraf conserva `no
  comprobado`: su identidad, ubicación, contacto y oferta sí se actualizaron,
  pero la botiga devolvió un fallo técnico y no se convirtió esa incertidumbre
  en venta vigente. El residual provincial baja **826 → 815** y el de bodegas
  **109 → 98**. La V2 confirma coincidencia CSV/evidencia y ningún nuevo `sí`
  entra en las colas editoriales de venta, fuente, plantilla o texto genérico;
  quedan avisos de imagen independientes del alcance de esta tanda y solo Avenc
  permanece deliberadamente en `venta-sin-resolver`.

- **BCN-V1-c · bodegas, tercera pasada (2026-08-01).** Se revisaron 12 filas
  con web y se corrigió primero la identidad. `Anima Mundi` no era una segunda
  bodega: es una gama de AT Roca y se fusiona con la ficha superviviente, que
  incorpora los vinos, la bodega actual de Sant Sebastià dels Gorgs y contacto
  vigente; el slug superviviente corrige además `pacs-del-penedes` por
  `avinyonet-del-penedes` y conserva el anterior como `merge`. El
  `sí|marketplace` de AT Roca se retira porque carecía de evidencia
  y solo se localizaron revendedores independientes; queda `no comprobado`, no
  se convierte la ausencia de trazabilidad en un `no`. Jovani Vins conserva la
  continuidad mediante un registro `merge`, pero corrige el slug que todavía
  codificaba Sant Martí Sarroca a Castellví de la Marca y renombra también la
  imagen. Tres canales remotos vigentes pasan a `sí`: Roqueta Origen y Jovani
  por ecommerce propio o del grupo, y Porcellànic por formulario de pedido que
  continúa por correo. Seis quedan en `no` tras revisar navegación, catálogo y
  contacto oficiales completos: La Diferenta, Celler Viader, Caves Rimarts,
  Mas Pujadó, Vins Gèniu y Can Lleó. Gramona se enriquece con gama y actividad,
  pero conserva `no comprobado`: remite a tiendas de confianza o al contacto
  general sin publicar un pedido explícito. Las 11 fichas supervivientes ganan
  productos y descripción específicos; se corrigen además enlaces, contacto,
  horarios, ubicación o verificación donde la fuente lo permite. El CSV queda
  en **2.543 filas**; el residual provincial baja **815 → 806**, el de bodegas
  **98 → 89** y el subconjunto de bodegas pendientes con web **48 → 39**. La V2
  deja fuera de las colas editoriales los nueve estados resueltos y los slugs
  nuevos; solo AT Roca y Gramona permanecen deliberadamente en
  `venta-sin-resolver`, con avisos de imagen independientes en otras fichas.

- **BCN-V1-d · bodegas, cuarta pasada (2026-08-01).** Se cerraron 12 filas con
  web que respondía y se priorizó de nuevo la identidad sobre el marcado de
  venta. `Molner Canal, Jordi` no era una bodega productiva de Cardona: es el
  responsable del Celler del Miracle y la elaboración se hace bajo el
  monasterio del Santuari del Miracle, en Riner. La fila se retira de Barcelona
  como `other-province` y continúa en `lleida.csv` como
  `celler-del-miracle-riner`, con nombre público, gama 2022–2024, contacto,
  coordenadas e imagen corregidos. `Vins per Estimar el Vi` comparte domicilio,
  teléfono y responsable legal —GRAMONA S.A.— con Gramona; se fusiona con su
  ficha y conserva Gessamí, Mart, Ca La Mar y Vi de Glass dentro de la oferta.
  También se corrige un error de categoría y producto: Bauma de les Deveses no
  se publica ya como bodega de tinto y blanco, sino como elaborador de licores,
  infusiones y condimentos ecológicos, con su contacto y punto productivo
  reales. Caves Bundó pasa a `sí|email|telefono`: su propia portada presenta el
  contacto como las maneras de comprar y publica ambos canales. Nueve filas
  pasan a `no` tras revisar navegación, producto y contacto completos: Can
  Bonastre, Bauma de les Deveses, Caves Soler-Jové, Celler Ludens, Terra de
  Marca, Mas Clarella, Mont Marçal, Família Ametller y Mas Guineu. Las diez
  fichas supervivientes de la muestra y Gramona ganan productos, descripción,
  contacto, dirección, horario, web, redes o coordenadas cuando la fuente lo
  permite; Celler del Miracle recibe la misma mejora en Lleida y queda también
  en `no`. Barcelona queda en **2.541 filas**; el residual provincial baja
  **806 → 794**, el de bodegas **89 → 77**, las bodegas pendientes con web
  **39 → 27** y el total de filas clasificadas como bodega **304 → 301** por el
  traslado, la fusión y la categoría corregida. Los avisos de calidad bajan
  **71 → 69**. La V2 no encuentra texto genérico, plantilla cruzada ni evidencia
  prestada en las fichas tocadas; Gramona permanece deliberadamente en
  `venta-sin-resolver` y Caves Bundó conserva la señal mecánica
  `web-de-tercero` por alojarse en Google Sites, aunque sus páginas identifican
  al productor y la evidencia documenta la titularidad editorial.

- **BCN-V1-e · bodegas, quinta pasada (2026-08-01).** Se profundizó en las seis
  webs que respondían y todavía no habían recibido una revisión propia. Dos
  estados se resuelven en `no` después de recorrer las webs oficiales completas:
  Alemany i Corrió solo publica el celler, cuatro etiquetas y el contacto, y
  Joan Colet Rius presenta el proyecto, la elaboración, cinco caves y el
  contacto sin precio ni mecanismo de pedido. Joan Colet pasa además de
  `parcial` a `verificado`, incorpora su dirección y coordenadas productivas y
  deja atrás el texto heredado que decía que la web no era legible. La decisión
  de mayor valor no es una marca de venta: Vins Petxina se retira como
  `out-of-scope`. Su propia web sitúa la oficina en Manresa, pero atribuye las
  viñas y las instalaciones a tres cellers colaboradores de La Nou de Gaià,
  Sarral y Vilobí del Penedès, cuyos enólogos elaboran y embotellan para que
  Petxina comercialice; no existe una unidad productiva propia en Barcelona.
  Las otras tres filas permanecen deliberadamente en `no comprobado`: Roura
  enseña botones de compra, pero todos los precios son 0,00 € y el alta no
  conserva el producto en el carrito; Torné & Bel declara la página en obras y
  solo ofrece consulta; Can Grau Vell remite a Vilaviniteca, un distribuidor y
  comercio independiente que no prueba un canal operado por el productor. Aun
  sin forzar esos estados, las cinco fichas supervivientes ganan referencias
  concretas y descripción específica; cuatro mejoran dirección o ubicación y
  dos incorporan redes oficiales. Barcelona queda en **2.540 filas**; el
  residual provincial baja **794 → 791**, el de bodegas **77 → 74**, las
  bodegas pendientes con web **27 → 24** y el total de bodegas **301 → 300**.
  La carga real baja **960 → 957**. La V2 confirma coincidencia entre CSV y
  evidencia y que las cinco supervivientes no entran en texto genérico,
  plantilla cruzada, evidencia prestada ni web de tercero; solo las tres
  incertidumbres justificadas siguen en `venta-sin-resolver` y la señal de
  imagen permanece fuera del alcance de esta tanda.

- **BCN-V1-f · bodegas, sexta pasada técnica (2026-08-01).** Se investigaron
  en dos pasadas las 12 bodegas pendientes cuyo enlace existente estaba
  aparcado, secuestrado, vacío, roto o limitado a HTTP; el cruce de identidad
  amplió la revisión a las dos fichas actuales de Ullastrell relacionadas. El
  resultado principal no es el marcador de venta: el Celler Vitícola
  d'Ullastrell SAT se elimina como `closed`, sin fusionarlo con La Botiga
  d'Ullastrell; esta última se corrige como proyecto lácteo y agroalimentario
  de MIM Foods con ecommerce propio. Granja Núria permanece como productor
  distinto de mató y queso, pero recupera su dirección, comarca y contacto
  reales y pierde la atribución infundada a MIM Cheese. También se retiran las
  webs aparcadas o ajenas de Caves Gibert, Mas dels Clavers, Grau Dòria y Clos
  Lentiscus y, al quedar sin fuente propia viva, las cuatro fichas pasan a
  `parcial`; Granja Núria recibe el mismo techo editorial por su web caída. Se
  recuperan los dominios o protocolos vigentes de Milfulls, Sant Miquel d'Oló,
  Carles de Lavern, Planas Albareda, Trias Batlle y Torreblanca, y se corrige
  Milfulls de bodega a aperitivo vínico dentro de `Vermut`. Cuatro ventas se
  resuelven con evidencia: Castellblanc y La Botiga pasan a `sí|ecommerce`, y
  Milfulls y Planas Albareda a `no`; Granja Núria vuelve de un `no` no
  sustentado a `no comprobado`. Las 13 fichas supervivientes reciben productos
  y descripción específicos, todas corrigen su enlace web y once mejoran la
  dirección; se actualizan además nombres, teléfonos, correos, horarios,
  coordenadas, categoría o canal cuando procede. Barcelona queda en **2.539
  filas**; el residual provincial baja **791 → 787**, el de bodegas **74 →
  70**, las bodegas pendientes con web **24 → 16**, el total de bodegas **300
  → 298**, la carga real **957 → 953** y los avisos de calidad **69 → 67**. La
  V2 confirma que ninguna ficha tocada conserva texto genérico, plantilla
  cruzada, evidencia prestada o web de tercero; nueve incertidumbres de venta
  técnicamente justificadas y la señal de imagen quedan visibles para futuras
  pasadas.

- **BCN-V1-g · bodegas, cierre del carril con web (2026-08-01).** Se hizo la
  segunda pasada de las cinco bodegas con web que V1-a había dejado para
  investigación profunda. La corrección principal vuelve a ser de identidad:
  `Brugarol la Granja SL` no es una unidad productiva de Barcelona, sino el
  restaurante y alojamiento urbano de un grupo cuyo vino, aceite y queso se
  elaboran en Celler Brugarol/Finca Bell-Lloc, Palamós. La fila barcelonesa y
  su imagen duplicada se eliminan como `other-province`; la ficha ya existente
  en Girona conserva slug e imagen y gana seis vinos actuales, viticultura
  regenerativa y evidencia nueva de la tienda oficial. Amat & Montané sube de
  `parcial` a `verificado` mediante su campaña y perfil propios de 2026, recibe
  la gama IGIGA, SIRENI, NAVEGANTS, ViCICLISTA y el nuevo Sumoll, y pierde el
  dominio que hoy solo muestra una plantilla de mantenimiento sin identidad.
  Su preventa terminó el 11 de julio, por lo que no se presenta como canal
  vigente. Solergibert incorpora doce hectáreas ecológicas, nueve referencias,
  dirección, horario y la web renovada; Sanmartí, sus seis vinos actuales y el
  detalle de elaboración; Almirall, dirección, historia familiar y ocho tipos
  de cava. Los tres conservan `no comprobado`: las referencias de Solergibert
  en Vinsdelbages son reventa independiente, el formulario de alta del Club
  Sanmartí se anuncia todavía como «disponible próximamente» y Almirall ofrece
  entrega a domicilio sin explicar cómo cursar un pedido. Barcelona queda en
  **2.538 filas**; el residual provincial baja **787 → 786**, el de bodegas
  **70 → 69**, las bodegas pendientes con web **16 → 14**, el total de bodegas
  **298 → 297** y la carga real **953 → 952**; los avisos de calidad se
  mantienen en **67**. La V2 confirma que las cuatro supervivientes solo
  conservan `venta-sin-resolver` —y Almirall la señal de imagen—, que Brugarol
  ya no entra en `plantilla-cruzada` en Girona y que no queda ninguna bodega
  pendiente con web sin revisión de la campaña. El siguiente carril son las
  **50 bodegas sin web no investigadas**, repartidas en dos tandas V1/V2.

- **BCN-V1-h · bodegas sin web, primera tanda (2026-08-01).** Se congelaron y
  revisaron las primeras 25 filas del carril, con una V1 de identidad,
  actividad, municipio y venta y una V2 sobre los defectos resultantes. El
  trabajo reduce filas porque corrige el origen del dato: seis eran comercios
  o domicilios de unidades productivas de otra provincia y se purgan; once
  slugs personales, jurídicos o territoriales se fusionan con la marca y la
  ficha productiva correctas. Entre los casos de mayor valor, Aglaner es la
  titular de Celler Sanmartí; Enric Forn y Lluís Vich son Entrebosc y Can Vich;
  Joan Duran es Can Duran; Pilar Carreras dirige las viñas de Can Prats dentro
  de Vins El Cep; Vinyes de Bresca es DeBresca en el Pallars; y Business
  Investment & Technologies es Celler de l'Era en Tarragona. Alkimia Wines,
  Bodega Folguera, Coma Romà y Torres de la Serra sustituyen cuatro slugs cuya
  ubicación o nombre público era materialmente incorrecto. Los targets
  supervivientes ganan gama, descripción, contacto, dirección o coordenadas y
  DeBresca se enriquece también en `lleida.csv`. Solo una venta nueva pasa a
  `sí|ecommerce` —Bodega Folguera— y Coma Romà a `no`; Can Duran vuelve de un
  `no` sin evidencia a `no comprobado` porque las fuentes publican reparto de
  cestas pero no aclaran el mecanismo actual de pedido. La V2 baja Unió de
  Cellers del Noia a `parcial`: un pin y una pertenencia gremial no justifican
  `verificado`; también elimina el falso cruce de categoría de Mond Obert. Los
  registros vivos recuperan marca y contacto correctos para Torres de la
  Serra y Maria Roser Girbau. Barcelona queda en **2.525 filas**; el residual
  provincial baja **786 → 772**, el de bodegas **69 → 54**, el total de
  bodegas **297 → 284** y la carga real **952 → 937**. Ninguna ficha tocada
  conserva descripción genérica, plantilla cruzada, web de tercero o
  evidencia prestada; solo Garcia Moll permanece en `sinteticas`, de forma
  deliberada, porque el registro de 2014 no permite publicar un contacto
  actual. El carril `BCN-V1-i` queda congelado en las **25 filas restantes**,
  desde `massana-rafols-felix-subirats` hasta
  `esteve-i-gibert-viticultors-subirats`.

- **Lote BCN-V1-i (2026-08-01, carril V1 bodegas sin web).** Cerradas las 25
  filas congeladas con revisión de identidad y unidad productiva antes de
  resolver la venta. Cinco tiendas o mecanismos propios quedan publicados
  como `sí` —Caves Fèlix Massana Ràfols, Celler Can Roda, Celler Grapissó,
  Celler Tres Tombs y Esteve i Gibert—; La Salada y Can Pagès pasan a `no` al
  no existir mecanismo remoto en sus webs actuales. La depuración elimina
  siete filas netas: Blanca Ozcáriz se integra en El Jardí dels Sentits,
  Robert J. Mur en Montesquius, Joaquim Batlle en Celler Quim Batlle y la ficha
  personal de José Esteve en Esteve i Gibert; Polleria Soler no era una bodega,
  Altrabanda consta cerrada desde 2018 y la marca Serralada de Marina ya se
  elabora dentro de Can Roda. La pasada V2 separa además Finca Valldosera de
  la falsa contaminación con Calcite. Se corrigen las identidades públicas de
  Massana Ràfols, Salaçe y Can Turon; este último pasa de `Bodega` a `Fruta y
  verdura`. El Mas Pujó queda en Santa Margarida i els Monjos y Tarrida i
  Sibil en Font-rubí, sus instalaciones productivas reales. Barcelona queda
  en **2.518 filas**; el residual provincial baja **772 → 760**, el de bodegas
  **54 → 41**, el total de bodegas **284 → 276** y la carga real **937 →
  925**. Los 13 casos aún `no comprobado` conservan ese estado porque las
  fuentes actuales no muestran ni descartan un mecanismo de pedido; no se
  han cerrado por ausencia de web.

- **Lote BCN-V1-j (2026-08-01, fruta y verdura con web).** Cerrada la primera
  tanda de 25 fichas con una pasada de identidad, unidad productiva, contacto,
  ubicación y venta antes de revisar los defectos resultantes. El cambio más
  importante vuelve a estar en el CSV: Cal Biel se purga como comercio sin
  producción propia; L'Hort de l'Avi deja de localizar la explotación en su
  tienda de Igualada y pasa a la finca de Agustí Domènech en Òdena; Cal
  Pastera deja el municipio erróneo de Ripollet y queda en su explotación de
  Sant Boi; y Cultius La Gírgola pasa de horta a `Trufa y setas`. También se
  distinguen la marca Brot Agrològic de la razón cooperativa Brotada Rural y
  las denominaciones Cordú Fruits / Fruites i Verdures Cortès. Las 24 fichas
  supervivientes reciben descripción y gama específicas; 21 mejoran
  dirección, contacto, horario, mapa, nombre o categoría, y se retiran 14
  webs muertas o de terceros. Se resuelven 14 ventas: Sóc Pagès por WhatsApp;
  Can Margarida por el marketplace municipal; Brot Agrològic, Pla de Munt y
  Ca n'Ustrell por ecommerce; Cal Climent y Torre Malla por correo/teléfono;
  Cal Pastera y Green Hort por correo; y Ca n'Oliveró, Pere Fíguls, Manel
  Sanfeliu, Viscarri y Horts de Sant Benet a `no` tras revisar sus canales
  actuales. Diez incertidumbres conservan `no comprobado` porque el dominio
  está roto, suspendido o bloqueado, o porque las fuentes no enseñan un
  mecanismo remoto utilizable. Barcelona queda en **2.517 filas**; el residual
  provincial baja **760 → 745**, la carga real **925 → 910**, los avisos de
  calidad **67 → 58** y el residual de fruta y verdura **201 → 185**; dentro de
  la categoría, las pendientes con web bajan **48 → 24**. La V2 deja las
  fichas tocadas fuera de texto genérico, plantilla cruzada, evidencia
  prestada, web de tercero y canal sin clasificar. `BCN-V1-k` queda preparado
  con las **23 fichas con web aún no investigadas**, desde
  `cal-masses-sant-salvador-de-guardiola` hasta `lhortet-del-bruc-el-bruc`;
  Mas Llopis no se repite porque su 403 ya quedó documentado en esta tanda.

- **Lote BCN-V1-k (2026-08-01, fruta y verdura con web, cierre del carril).**
  Se investigaron las 23 fichas congeladas por identidad, actividad, unidad
  productiva, ubicación, contacto y venta. El CSV pierde una fila porque Les
  Marines era la misma unidad familiar ya publicada como Tugas i Companyia en
  Viladecans. Can Plana deja de figurar como huerta: la propia finca explica
  que la horta es de autoconsumo y la actividad comercial es el rebaño, por lo
  que pasa a `Carne`, con teléfono, correo, dominio y ecommerce colectivos
  vigentes. Els Horts de l'Alegria queda `parcial` y a `no`: el proyecto anunció
  una pausa indefinida en julio de 2025, no un cierre definitivo. L'Amanida
  vuelve a su identidad y domicilio agrarios de Viladecans; se eliminan la
  tienda, el teléfono, el horario y el mapa de un comercio de Gavà que no
  identificaban de forma fiable la unidad productiva. También se actualizan
  gama, descripción o contacto en las 22 supervivientes y se retiran ocho webs
  caídas, secuestradas o institucionales usadas como si fueran propias.
  Se resuelven 17 ventas: Fruits Montmany y Ecotràmec por correo y suscripción;
  Can Plana y L'Hortet del Bruc · Som Alzines por ecommerce; El Progrés-Garbí
  por marketplace; L'Horta amb Alegria por WhatsApp; Les Ràfoles por teléfono;
  y diez fichas a `no` tras revisar sus sistemas actuales. Cal Masses, Hort del
  Navarro, Can Balasch, L'Amanida y Cal Vilaseca conservan `no comprobado` por
  falta de un mecanismo remoto vigente y accionable.

  Barcelona queda en **2.516 filas**; el residual provincial baja **745 → 727**,
  la carga real **910 → 892**, el residual de fruta y verdura **185 → 167** y
  los avisos de calidad se mantienen en **58**. `web-de-tercero` baja **61 → 53**
  y `plantilla-cruzada` **27 → 26**; no se introducen descripciones genéricas,
  evidencia prestada ni canales sin clasificar. `sinteticas` sube **5 → 6** de
  forma deliberada: L'Amanida queda sin contacto externo antes que conservar
  datos atribuibles a otra tienda; el censo agrario actual y la evidencia
  sostienen la ficha, y prima la corrección editorial sobre el detector. En
  fruta y verdura quedan solo dos `no comprobado` con web, ambos ya revisados
  (Mas Llopis y Hort del Navarro), por lo que el carril fresco con web queda
  cerrado. `BCN-V1-l` se congela con las primeras **25 de 148 fichas frescas sin
  web**, desde `can-vilanova-valenti-vilanova-arenys-de-munt` hasta
  `verdura-masclans-caldes-de-montbui`.

- **Lote BCN-V1-l (2026-08-01, fruta y verdura sin web, primera tanda).** Se
  investigaron las 25 fichas congeladas y se corrigió primero la identidad y la
  unidad productiva. Emili Gallart y Jordi i Rosa eran puestos de fruta y
  verdura sin prueba de cultivo propio; Wanplais es una inmobiliaria y Calvet
  Fruits un mayorista de Mercabarna, por lo que las cuatro filas se purgan.
  Vilabanús se traslada a su instalación real de frutos secos y aceite en La
  Masó y Disfruta & Verdura a su huerta familiar de Cambrils, ambas en
  Tarragona. Las dos fichas de la familia Marcé se fusionan en **Can Baldiri**,
  con identidad, finca, contactos y web actuales en Cantallops (Avinyonet del
  Penedès); Mir Pous Girona se integra en la unidad ya publicada como Sències
  Can Girona, mientras su oficina de Francesc Macià deja de figurar como finca.
  También se corrigen dos categorías falsas: Joan Macau pasa de horta a
  despensa artesanal y Salvador Tantiña a carne y embutidos.

  Las supervivientes ganan gama, contactos, dirección o descripción específica
  y pierden cinco pines urbanos o de negocios ajenos. Se resuelven cinco ventas:
  Can Baldiri, Lluís Fidel Colomer y Montserrat Amargant a `no`; Agro-Picanyol
  por teléfono y Verdura Masclans por correo. Font Riera, Galindo Aguas,
  Vendrell Pellicer, Pere Borrero y Maria Teresa Vendrell quedan anclados al
  censo agrario 2026 sin inventar un canal remoto; otros históricos conservan
  `no comprobado` con su techo documentado.

  Barcelona queda en **2.508 filas**; el residual provincial baja **727 → 714**,
  la carga real **892 → 879**, el residual de fruta y verdura **167 → 152** y
  los avisos de calidad **58 → 56**. `plantilla-cruzada` baja **26 → 24**, sin
  introducir canales sin clasificar. Tarragona incorpora dos productores reales
  en el mismo cambio para que el saneamiento territorial no pierda información.
  `BCN-V1-m` queda congelado con las siguientes **25 de 122 fichas frescas sin
  web**, desde `horta-de-capolat-capolat` hasta
  `cal-malu-jordi-pratginestos-llinars-del-valles`.

- **Lote BCN-V1-m (2026-08-01, fruta y verdura sin web, segunda tanda).** Se
  investigaron las 25 fichas congeladas y 23 recibieron cambios materiales; las
  dos titularidades de Can Moret, Hilari Serra y Josep Serra, se confirmaron
  separadas en el censo agrario 2026 y no se fusionan solo por compartir finca y
  correo. El lote corrige antes la identidad y el territorio: **Can Arenols**
  deja la ficha de un restaurante de Castelldefels y pasa a su explotación y
  agrobotiga reales de Viladecans; **Horta Can Manent** pasa a la finca del
  rodal de Sabadell, y **El Sabater Vell** recupera identidad, responsable y
  contacto propios en Castellar. L'Hortet de l'Antonia alinea su slug con
  Llinars del Vallès. Los cuatro cambios de identidad conservan trazabilidad de
  `merge`.

  También se corrigen dos categorías graves: Les Cases d'Argençola pasa de
  fruta y verdura a carne de cordero y Puigxoriguer de patata a explotación
  bovina y porcina; Joan Roselló pasa a legumbres por su producción documentada
  de guisante y judía. Se eliminan el pin de La Datzira que caía fuera de
  Castellcir, el de Fruits Capellades que caía en Capellades, el de Joan Roselló
  que caía en Barcelona, el de Casa Jordi atribuido a Puigventós y el pin
  mezclado de El Sabater/Can Manent. UCHUS queda anclado directamente a la API
  oficial de venta de proximidad —acreditación VP/P/4371/2024— en vez de a una
  descripción de plantilla.

  Se resuelven siete ventas remotas con mecanismo utilizable: Horta de Capolat,
  Obra Tutelar Agrària y Fruits Capellades por tienda o marketplace; Horta Can
  Manent, Can Arenols y Horta de Vallcàrquera por teléfono; Verdures Carreras
  por WhatsApp. En paralelo, La Catxaruda pierde un horario y una afirmación de
  marketplace sin vigencia demostrada, y los históricos sin presencia actual
  conservan `no comprobado` en vez de convertir un correo publicado en prueba
  de pedido.

  Barcelona permanece en **2.508 filas**; el residual provincial baja **714 →
  707**, la carga real **879 → 872**, el residual de fruta y verdura **152 →
  142**, `plantilla-cruzada` **24 → 22** y los avisos de calidad **56 → 53**.
  Las siguientes **25 de 97 fichas frescas sin web** quedan congeladas como
  `BCN-V1-n`, desde `can-pinos-scp-llinars-del-valles` hasta
  `ribas-alsina-miquel-premia-de-dalt`.

- **Lote BCN-V1-n (2026-08-01, fruta y verdura sin web, tercera tanda).** Se
  investigaron las 25 fichas congeladas y 24 recibieron cambios materiales;
  Horta Pera se conserva sin forzar cambios porque una programación municipal
  de 2025 confirma la actividad y la localización que ya publicaba. El lote
  corrige siete identidades o municipios con trazabilidad de `merge`: Brot
  Agrològic pasa de Moià a Can Roure de Granera; Horta 3sols a Castellterçol;
  Jaime Toneu recupera nombre, finca, contacto y marca como **La Noguereda**;
  Cal Marcelino/Fabró Produccions pasa de Sant Boi a El Prat; Javier Torrens
  incorpora la marca Fordal; Ca La Col pasa de Pineda a Arenys de Munt; y
  Agri-Ma deja una dirección y teléfono de un fotógrafo de Polinyà para la
  explotación real de Jaume Magrans en El Papiol.

  La corrección más grave de categoría es **Can Pinós**, que deja la plantilla
  de fruta y verdura y pasa a explotación porcina según el registro municipal
  vigente. También se recuperan la finca Can Baltasar de Pere Ayter, la marca
  Can Gallard y su especialización en caracol, la gama completa de Mayfunt y
  Perramon, la Poma de Pontons Roqueta de Joan Domènech y el melocotón de la
  Fortesa de Josep Vives. Se retiran pines de dos centros médicos, una
  residencia, una empresa industrial de Granollers, un negocio de Barcelona y
  otras búsquedas de apellido ajenas; De La Maria pierde además las redes de
  Anoia Turisme.

  Se resuelven cinco ventas remotas con mecanismo utilizable: Ple de Verd y
  Brot Agrològic por tienda propia, Horta 3sols por Pagesia a casa, Cal
  Marcelino por encargos telefónicos con reparto y Masia Can Sagristà por el
  servicio a domicilio publicado por el directorio municipal. No se marca Pere
  Ayter: su perfil comercial está vivo pero declara cero productos. Tampoco
  Agri-Ma: el directorio menciona cestas mediante Can Perol, pero los dos
  dominios publicados ya no resuelven.

  Barcelona permanece en **2.508 filas**; el residual provincial baja **707 →
  702**, la carga real **872 → 870**, el residual de fruta y verdura **142 →
  136**, `plantilla-cruzada` **22 → 21** y los avisos de calidad **53 → 51**.
  Las siguientes **25 de 72 fichas frescas sin web** quedan congeladas como
  `BCN-V1-o`, desde
  `esteve-grau-ganduxe-can-esteve-tonico-roca-del-valles` hasta
  `masia-can-bell-sant-cugat-del-valles`.

- **Lote BCN-V1-o (2026-08-01, fruta y verdura sin web, cuarta tanda).** Se
  investigaron las 25 fichas congeladas y las 24 que permanecen en catálogo
  recibieron cambios materiales. Sale **Alexandre Farell Sostres**: la fila
  reutilizaba el contacto de Morera Equitació y los expedientes municipales
  sitúan su Granja Morera en Polinyà y la destinan a hípica, sin una unidad
  alimentaria actual documentada.

  Se corrigen tres identidades con trazabilidad de `merge`: Nicolas Loiseau
  recupera la marca **Nicoverd**; Màrius Torrentó deja un hospital y el Rodal
  de Sabadell para volver a ser **El Pagès de Rubí**, con municipio, finca,
  contacto y variedades locales; y Joan Rosell Canals pasa a **Hort del
  Catre**, con su tienda y reparto reales. También se corrigen dos categorías:
  Mas d'Ardesa pasa a `Legumbres y cereales` con Cigronet de l'Anoia y civada,
  y Masia Can Bell a `Aceite y vino` con xarel·lo y aceite ecológicos. Horta
  Pera Viván deja de publicar «peras»: Pera es el apellido y su producto es el
  pèsol garrofal y llàgrima.

  El lote elimina pines de una hípica, un hospital, una maderera, una empresa
  metalúrgica, una gestoría, un restaurante, una tienda ajena y una finca de
  Cabrils; Cal Moliné pierde además el Instagram y el horario de una cadena de
  panaderías homónima. Se reconstruyen con producto y contacto útiles Can Jep,
  Nicoverd, Jadeverd, Verdures Josep i Elena, Cal Nyet, Cal Xecu, Pere Herrero,
  Ca l'Estrany y Masia Can Bell. Seis fichas cuya única señal era el registro
  histórico quedan honestamente en `pendiente`, sin conservar datos de terceros.

  Se resuelven **15 decisiones de venta** dentro de las filas conservadas:
  Nicoverd acepta pedidos por correo con entrega; Hort del Catre mantiene
  carrito en Agroboca; Verdures Josep i Elena publica reparto concertado por
  teléfono; y doce productores quedan en `no` tras revisar sus canales físicos
  o de circuito corto sin mecanismo remoto. Mas d'Ardesa no se fuerza a `sí`:
  el directorio marca «venda en línia», pero no ofrece un canal utilizable.

  Barcelona baja **2.508 → 2.507 filas**; el residual provincial **702 → 686**,
  la carga real **870 → 857**, el residual de fruta y verdura **136 → 119** y
  los avisos de calidad **51 → 49**; `plantilla-cruzada` se mantiene en **21**.
  Quedan **47 fichas frescas sin web**. Las siguientes 25 quedan congeladas
  como `BCN-V1-p`, desde
  `claramunt-estruch-javier-sant-esteve-sesrovires` hasta
  `juli-centellas-alex-tordera`.

- **Lote BCN-V1-p (2026-08-01, fruta y verdura sin web, quinta tanda).** Las
  25 fichas congeladas se investigaron y las 24 unidades que permanecen en
  catálogo recibieron cambios materiales. La revisión encontró además una
  segunda fila previa de **El Jardí de Collbarra** con slug de Ullastrell pese
  a que productor, contacto y municipio eran los mismos de Sant Llorenç
  Savall. Se conserva la URL provincial correcta y quedan tombstones de
  `merge` tanto para ese duplicado como para **Elena Simó**, que ya estaba
  representada por **Els Campaners** en Ullastrell. **Agrosans** deja Terrassa
  y pasa a su municipio, dirección, contacto y coordenadas reales en Castellar
  del Vallès, también con trazabilidad de `merge`.

  Se recuperan cinco identidades comerciales útiles —El Jardí de Collbarra,
  Can Aubareda, Cal Pastoret, Cal Jan y Hort d'en Gallina— y se reconstruyen
  con productos y puntos de venta concretos L'Horta de les Casetes, Jaume
  Biscarri, Família Esteve Ràfols, Manel Massana, Olivella Font Clara, Agrària
  Can Viver y Jofre Bellido. Horta Vila deja de inventar tomate y lechuga: el
  censo municipal vigente describe una explotación porcina y cunícola. Diego
  Aguilar, Juana Tamarit y Modest Preixens dejan de ser fichas genéricas de
  fruta y verdura y recuperan la actividad histórica de aceite, aceituna y
  almendra.

  El lote elimina pines, horarios, teléfonos y direcciones de un ayuntamiento,
  un ateneo, una fábrica textil, una tienda de muebles, una sala, un
  restaurante y un salón de manicura. Cuatro fichas cuya actividad solo queda
  apoyada por el registro histórico pasan honestamente a `pendiente`; Horta
  Vila conserva `no comprobado` porque la actividad ganadera actual no permite
  deducir un canal alimentario. En las filas conservadas se resuelven **19
  decisiones de venta** como `no` tras revisar webs, mercados, agrobotigas,
  venta directa y circuito corto sin mecanismo remoto. La fusión de Elena Simó
  elimina otra decisión sin resolver duplicada.

  Barcelona baja **2.507 → 2.505 filas**; el residual provincial **686 → 666**,
  la carga real **857 → 840**, el residual de fruta y verdura **119 → 95** y
  los avisos de calidad **49 → 48**; `plantilla-cruzada` se mantiene en **21**.
  Quedan **22 fichas frescas sin web y sin evidencia de revisión**. Se congelan
  como `BCN-V1-q`, desde `mateu-mendez-joaquin-tordera` hasta
  `josep-floriach-gonzalez-mataro`.

- **Lote BCN-V1-q (2026-08-01, cierre del carril fresco sin web).** Se
  investigaron las 22 fichas congeladas y las 21 unidades que permanecen en
  catálogo recibieron cambios materiales. **Horts Biopenedes SL** sale del CSV:
  su NIF fue revocado oficialmente y la sociedad figura inactiva, mientras la
  fila mezclaba su razón social con el Instagram y el pin de otra entidad, Hort
  Ecològic Penedès. Queda registro de `purge` con ambas señales.

  En Tordera se recuperan las identidades **Quim i Míriam**, **Can Gaget**,
  **Can Saleta** y **Can Pau**. Vicenç Bigas deja de inventar fruta y verdura y
  pasa a su actividad real de bovino de carne, leche y forrajes; Can Pau
  recupera la finca, producción integrada, productos y parada física actuales.
  También se reconstruyen **Cal Delaila**, **Cal Calic**, **Cal Juvitu**,
  **Vivers Salicrú**, Sínia Sant Gervasi, Agrària Santa Coloma, La Paradeta del
  Camí Ral y Agrícola Cal Martí. El lote elimina datos ajenos de una
  cooperativa, un hotel, un club de fútbol, un memorial, varias redes genéricas
  y horarios o coordenadas sin soporte.

  Se resuelven **19 decisiones de venta** en las fichas conservadas: La Beneta
  publica pedido de su aceite por WhatsApp; Can Redeu, Jaume Font y Josep
  Floriach publican pedidos telefónicos con reparto; y quince unidades quedan
  en `no` tras revisar sus canales físicos, cooperativas, mercados o circuito
  corto. La baja de Horts Biopenedes elimina otra decisión sin resolver. Cal
  Juvitu conserva `no comprobado` porque su web devuelve error 500 y Agrícola
  Cal Martí porque un directorio marca venta en línea sin ofrecer mecanismo
  remoto utilizable.

  Barcelona baja **2.505 → 2.504 filas**; el residual provincial **666 → 646**,
  la carga real **840 → 832**, el residual de fruta y verdura **95 → 75** y los
  avisos de calidad **48 → 46**; `plantilla-cruzada` se mantiene en **21**. El
  carril de fruta y verdura sin web y sin evidencia `keep` queda en **0**. Se
  congelan las siguientes 25 decisiones de fruta y verdura como `BCN-V2-a`,
  desde `can-vilanova-valenti-vilanova-arenys-de-munt` hasta
  `serra-fabre-jordi-centelles`.

- **Lote BCN-V2-a (2026-08-01, segunda pasada de fruta y verdura).** Se
  investigaron las 25 fichas congeladas y **22 reciben cambios en el CSV**.
  La API viva de venta de proximidad permite dejar de tratar como históricos a
  Daniel Royo, Agrícola de Agell y Josep Vendrell Pellicer, acreditados en
  2024–2025. También recupera las marcas **Maria i Miquel**, **L'Hort de
  l'Eriçó**, **Els Hortells de Marina** y **Masia Puigventós**, además de
  direcciones, contactos y surtidos completos. La Datzira cambia al correo
  vigente; Jordi Serra Fabre pierde la patata y las coordenadas sin soporte y
  recupera Mas el Masat y sus cultivos reales.

  Se resuelven **21 decisiones de venta**: Can Duran pasa a `sí|telefono`
  porque las fichas institucionales publican el teléfono junto al reparto de
  cestas a domicilio dos veces por semana; otras veinte unidades quedan en
  `no` tras revisar sus canales actuales de venta directa, finca, mercado o
  circuito corto sin mecanismo remoto. Joan Serrat, La Nansa del Cistell y
  Josep Maria Bonet conservan `no comprobado` por falta de actividad comercial
  dinámica; Horta La Fanecada lo conserva porque su dominio termina en un
  `business.site` averiado, una falla técnica que no prueba ausencia de venta.

  Barcelona mantiene **2.504 filas**; el residual provincial baja **646 →
  625**, la carga real **832 → 811**, el residual de fruta y verdura **75 →
  54** y los avisos de calidad se mantienen en **46**;
  `plantilla-cruzada` sigue en **21**. Los cuatro techos documentados se apartan
  de la rotación inmediata y se congelan las siguientes 25 decisiones como
  `BCN-V2-b`, desde `cruz-garcia-elvia-jesus-cornella-de-llobregat` hasta
  `ca-la-col-agricultura-ecologica-arenys-de-munt`.

- **Lote BCN-V2-b (2026-08-01, segunda pasada de fruta y verdura).** Se
  investigaron las 25 fichas congeladas y **21 reciben cambios en el CSV**.
  Els Felius recupera el surtido vigente y las coordenadas institucionales;
  Griselda Planas deja una ficha ficticia de peras y pasa a reflejar su
  explotación mixta de cereal, legumbres, olivar, almendro, viña y aromáticas,
  con contacto público; y Poch queda correctamente clasificado como explotación
  mixta de melocotón y aceituna. También se actualizan productos, contactos y
  canales físicos de Horta Canadell, Jordi Soler Roset, Pere Ayter, Can
  Cantallops, Horta Pera, Basart y Ca La Col.

  Se resuelven **19 decisiones de venta**. **Can Gallard** publica un canal de
  pedido por correo para sus caracoles y **Horta Pera** admite encargos por
  correo o WhatsApp con reparto a domicilio; otras diecisiete unidades quedan
  en `no` tras revisar venta directa, mercados, ferias o circuito corto sin
  mecanismo remoto. Se conservan seis incertidumbres justificadas: La
  Catxaruda carece de señal comercial actual; L'Hort de l'Avi, Cal Santacreu y
  La Pagesa solo conservan referencias históricas a cestas o reparto con los
  dominios averiados; Pere Ayter tiene escaparate vivo pero cero productos; y
  el dominio oficial de Ca La Col no resuelve.

  Barcelona mantiene **2.504 filas**; el residual provincial baja **625 →
  606**, la carga real **811 → 792**, el residual de fruta y verdura **54 →
  35**, las fichas sintéticas **9 → 8** y los avisos de calidad se mantienen en
  **46**; `plantilla-cruzada` sigue en **21**. Los diez techos documentados se
  apartan de la rotación inmediata y las últimas 25 decisiones de fruta y
  verdura quedan congeladas como `BCN-V2-c`, desde
  `agri-ma-scp-el-papiol` hasta `10cireres-torrelles-de-llobregat`.

- **Lote BCN-V2-c (2026-08-01, cierre de la segunda pasada de fruta y
  verdura).** Se investigaron las últimas 25 fichas frescas no apartadas y
  **16 reciben cambios en el CSV**. Casa Pepa deja de ser una explotación
  meramente histórica: el directorio vigente permite recuperar la gama y el
  teléfono y subirla de `pendiente` a `parcial`. También se normalizan y
  actualizan producto, contacto o descripción de Joan Domènech, Pau Pañella,
  Miquel Ribas, Jadeverd, Gaoxing 2020, Mas Llopis, Cal Masses, Can Turon, Can
  Balasch, Agrícola Cal Martí y Cal Vilaseca. Biomasia corrige sus coordenadas
  con la ficha institucional y Cal Masses pasa a `Otros` para representar su
  producción mixta vegetal, vitícola y ganadera.

  Se resuelven **14 decisiones de venta**. **10Cireres** reconstruye su ficha
  desde la web oficial, con calendario 2026, variedades y encargos por llamada
  o WhatsApp; **Cordú Fruits** publica reparto en seis comarcas y contacto por
  correo o teléfono; y **Biomasia Ca n'Oliveró** combina la venta en línea
  institucional con sus cestas y correo público. Otras once unidades quedan en
  `no` tras revisar venta directa, agrobotigas, mercados, visitas o actividad
  empresarial sin mecanismo remoto.

  Once fichas del lote conservan incertidumbre justificada: Agri-Ma tiene
  caídos los dominios de sus cestas; Mas Llopis devuelve 403; Hort del Navarro
  agota tiempo; Cal Juvitu responde 500; Agrícola Cal Martí figura con «venta
  en línea» pero no ofrece cómo comprar; y seis productores solo mantienen
  actividad histórica o insuficientemente pública. Barcelona mantiene **2.504
  filas**; el residual provincial baja **606 → 592**, la carga real **792 →
  779**, el residual de fruta y verdura **35 → 21** y `pendiente` **10 → 9**;
  los avisos de calidad siguen en **46**, `sinteticas` en **8** y
  `plantilla-cruzada` en **21**. El carril fresco queda agotado salvo esos 21
  techos documentados. Se abre `BCN-P1-a` con las primeras 25 decisiones de
  pan y pastelería, desde `pastisseria-duch-abrera` hasta
  `pastisseria-grau-esparreguera`.

- **Lote BCN-P1-a (2026-08-01, primera pasada de pan y pastelería).** Se
  investigaron las 25 fichas congeladas y **20 reciben cambios en el CSV**.
  La corrección principal es de identidad y alcance: `Casa Biosca` no era una
  panadería ni producía las harinas atribuidas por la ficha. El RIAAC identifica
  allí a **Pastures de Castelltallat SL**, elaborador de carne picada,
  hamburguesas, albóndigas y brochetas. Se corrigen slug, nombre, categoría,
  producto, contacto e imagen y se deja la fusión trazada. TAART pierde un pin
  y coordenadas que pertenecían a otra pastelería y baja a `parcial`;
  Pastisseria Roquetes pierde un dominio sin DNS. También se actualizan
  surtidos, descripciones, horarios o contactos de Duch, Bohème, Mireia, Horno
  Santa Madrona, Turón, Leiva, Milu, Pachi Larrea, Ca l'Agustí, Obrador Roig y
  Pastisseria Grau.

  Se resuelven **17 decisiones de venta**. **Caus Cakes** acepta encargos por
  WhatsApp; **L'Obrador Roig** recupera su tienda con carrito, reparto y
  pedidos por WhatsApp o teléfono; y **Pastisseria Grau** publica correo de
  pedidos y WhatsApp. Otras catorce fichas quedan en `no` tras revisar sus
  webs, perfiles, registros o directorios actuales sin encontrar un mecanismo
  remoto. Ocho techos conservan `no comprobado`: cinco por dominios que
  agotan tiempo, fallan en TLS o devuelven 502; TAART y Roquetes por dominios
  caídos; y El Capritxet porque las fuentes actuales discrepan entre abierto y
  cerrado.

  Barcelona mantiene **2.504 filas**; el residual provincial baja **592 →
  575**, la carga real **779 → 763** y el residual de pan y pastelería **107 →
  90**. Los avisos de calidad siguen en **46**, `sinteticas` en **8**,
  `plantilla-cruzada` en **21** y `pendiente` en **9**. Los ocho techos se
  apartan de la rotación inmediata y se congela `BCN-P1-b` con las siguientes
  25 decisiones, desde `pa-i-pastissos-can-girabent-figaro-montmany` hasta
  `fleca-el-crosto-navas`.

- **Lote BCN-P1-b (2026-08-01, primera pasada de pan y pastelería).** Se
  investigaron las 25 fichas congeladas y **24 reciben cambios en el CSV**.
  `Postres Artesanes Santa Eulàlia` deja de ser una fila de panadería con
  columnas desplazadas: se reconstruye como elaborador de quesos y postres
  lácteos de oveja, con surtido y contacto actuales. Forn Nou pierde el dominio
  sin DNS y un pin situado a unos 15 km de su dirección y baja a `parcial`.
  Forn Ricardera corrige dirección, teléfono, horario y especialización sin
  gluten; Ernest Sala deja de publicar un directorio como web y una descripción
  de volcado. También se mejoran de forma material surtido, texto, horario o
  contacto de Can Girabent, La Coca de Folgueroles, Can Busquets, Delícies
  Sense Gluten, Forn Alemany, Targarona, D Tast, Petits Délices, La Granja,
  Gumi's, Belcan, Cal Forner y El Crostó.

  Se resuelven **22 decisiones de venta**, once en `sí` y once en `no`. Can
  Girabent, La Coca de Folgueroles, Can Busquets, D Tast, Petits Délices y La
  Granja recuperan tiendas con carrito; Delícies Sense Gluten, Gumi's y Cal
  Forner aceptan WhatsApp; Jaume i Vicenç y Targarona aceptan encargos por
  teléfono. Las once negativas quedan sustentadas por webs o directorios
  actuales que solo ofrecen venta física o contacto informativo. Forn Nou y
  Forn de la Panadella conservan `no comprobado` por fallas técnicas de sus
  dominios; Masamara no tiene correspondencia pública suficiente para decidir.

  Barcelona mantiene **2.504 filas**; el residual provincial baja **575 →
  553**, la carga real **763 → 743**, el residual de pan y pastelería **90 →
  68** y los avisos de calidad **46 → 42**. `sinteticas` se mantiene en **8**,
  `plantilla-cruzada` en **21** y `pendiente` en **9**. Se congela `BCN-P1-c`
  con las siguientes 25 decisiones, desde
  `fleca-fontanals-s-l-olerdola-sant-pere-molanta` hasta
  `tot-teca-forn-gotes-terrassa`.

- **Lote BCN-P1-c (2026-08-01, primera pasada de pan y pastelería).** Se
  investigaron las 25 fichas congeladas y **24 reciben cambios en el CSV**.
  Cuatro filas salen del producto: `Panificio Artesania y Nutrición` es una
  sociedad patrimonial y no un obrador público separado de Macxipan;
  `Fermentum (Panarras Terrassa)` era una consultora de franquicias domiciliada
  en Manlleu con el pin de una empresa de vinagre; `L'Obrador d'en Pau` figura
  cerrado permanentemente; y `Tot Teca - Forn Gotés` nunca estuvo en Terrassa,
  sino en Sabadell, donde cerró definitivamente en marzo de 2026. Se elimina
  también la imagen huérfana de Fermentum. `Pim Pam Pastisseria` corrige
  municipio, dirección y slug de Sobremunt a Sant Quirze de Besora, dejando la
  fusión trazada. Can Carriel repara una descripción partida entre columnas y
  La Coca d'Anís retira web y correo de un dominio sin DNS. Además se mejoran
  de forma material surtido, descripción, horario o contacto de Fontanals,
  Sant Adjutori, Panacea, Forn Franquesa, Planas, La Iaia, Forn de Cabrianes,
  Macxipan, Baklava, Flor de Neu, La Crossandra, Mix, Sant Jordi, Can Postres,
  La Bona Teka, Pastisseria del Montalt y Delicious.

  Se resuelven **17 decisiones de venta**, diez en `sí` y siete en `no`. Sant
  Adjutori, Planas, La Crossandra, Mix y Can Postres aceptan encargos por
  teléfono o correo; Forn Franquesa, La Iaia y Forn de Cabrianes disponen de
  tienda; y Macxipan y Baklava sirven mediante marketplaces, además del
  WhatsApp de Baklava. Las siete negativas quedan sustentadas por webs,
  directorios o fichas actuales sin mecanismo remoto. Cuatro techos conservan
  `no comprobado`: Can Carriel y La Coca d'Anís por dominios desaparecidos,
  Sant Jordi por su certificado autofirmado y Forn de Sant Joan porque no se
  localiza una segunda fuente pública actual.

  Barcelona pasa de **2.504 a 2.500 filas**; el residual provincial baja
  **553 → 532**, la carga real **743 → 722**, el residual de pan y pastelería
  **68 → 47** y los avisos de calidad **42 → 40**. `sinteticas` se mantiene en
  **8**, `plantilla-cruzada` en **21** y `pendiente` en **9**. Se congela
  `BCN-P1-d` con las siguientes 25 decisiones: `fleca-xanat-torello`,
  `forn-de-pa-altarriba-botiga-de-torello-torello`,
  `pastisseria-nuria-vallirana`, `forn-de-pa-maria-vallromanes`,
  `artipa-obrador-artesa-vic`, `carlamel-de-canyella-vic`,
  `pastisseria-masramon-vic`,
  `eric-pastisser-eric-lloberes-viladecavalls-granollers`,
  `forn-de-pa-sant-jordi-vilafranca-del-penedes`,
  `forn-sant-onofre-vilanova-i-la-geltru`,
  `kinkakau-pastisseria-vilanova-i-la-geltru`,
  `lespiga-dor-vilanova-i-la-geltru`,
  `pastisseria-180oc-vilanova-i-la-geltru`,
  `pastisseria-falgueras-vilassar-de-mar`,
  `forn-i-pastisseria-cal-pelegri-subirats-ordal`,
  `sant-pau-coffee-i-bakery-vilafranca-del-penedes`,
  `ampurdanesa-obrador-sense-gluten-terrassa`, `cal-forner-granollers`,
  `ca-la-fornera-santa-eugenia-de-berga`, `pastisseria-llado-vic`,
  `forn-de-sant-jordi-folgueroles`, `morreig-barcelona-gracia`,
  `forn-de-pa-merce-lhospitalet-de-llobregat`,
  `forn-de-pa-rovira-lhospitalet-de-llobregat` y
  `sus-cakes-santa-coloma-de-gramenet`.

- **Lote BCN-P1-d (2026-08-01, primera pasada de pan y pastelería).** Se
  investigaron las 25 fichas congeladas y **las 25 reciben cambios materiales
  en el CSV**. La corrección principal es de identidad: la fila atribuida a
  Èric Lloberes y repartida entre Viladecavalls y Granollers correspondía en
  realidad al obrador de **Eric Vila en Cardedeu**; se corrigen nombre,
  municipio, dirección, contacto y slug, con fusión trazada. Carlamel de
  Canyella repara columnas desplazadas y pasa de una dirección y teléfono
  antiguos a su obrador actual de Gurb 73. Pastisseria Núria deja de heredar
  la historia de una homónima de Terrassa y se identifica con el obrador
  Vallirana de Pastisseria Cusbat. Kinkakau retira un dominio hoy secuestrado
  por una plantilla de *coaching* ajena; Ampurdanesa elimina una web sin DNS.
  También se corrigen direcciones, contactos, horarios y surtidos de Xanat,
  Altarriba, Forn Maria, Artipà, Masramon, Sant Jordi, Sant Onofre, L'Espiga
  d'Or, 180ºC, Falgueras, Cal Pelegrí, Cal Forner, Ca la Fornera, Lladó, Forn
  Sant Jordi de Folgueroles, Morreig, Forn Mercè, Forns Rovira y Su's Cakes.

  Se resuelven **las 25 decisiones de venta**, doce en `sí` y trece en `no`.
  Artipà y Morreig disponen de tienda propia; Falgueras y Cal Forner aceptan
  pedidos por WhatsApp; Sant Onofre, Ericpastisser y Forns Rovira publican
  canales de encargo; y Núria, Carlamel, Kinkakau, Ampurdanesa y Su's Cakes
  permiten pedidos por teléfono o WhatsApp. Las trece negativas quedan
  sustentadas por sitios oficiales, directorios institucionales y fichas
  operativas actuales sin mecanismo remoto, incluida la indicación expresa de
  que Forn Mercè no reparte.

  Barcelona mantiene **2.500 filas**; el residual provincial baja **532 →
  507**, la carga real **722 → 699** y el residual de pan y pastelería **47 →
  22**. Los avisos de calidad siguen en **40**, `sinteticas` en **8**,
  `plantilla-cruzada` en **21** y `pendiente` en **9**. Se congela `BCN-P1-e`
  como segunda pasada de los 22 techos restantes: `forn-de-pa-can-more-argentona`,
  `taart-by-carles-mampel-badalona`,
  `artesano-panaderia-y-pasteleria-barcelona-gracia`,
  `pastisseria-roquetes-barcelona-nou-barris`,
  `obrador-pastrygas-barcelona-sant-marti`,
  `fleca-serra-cal-forner-caldes-destrac`,
  `el-capritxet-pastisseria-castellbisbal`,
  `canyars-pastissers-castelldefels`, `forn-nou-folgueroles-folgueroles`,
  `masamara-martorelles`, `forn-de-la-panadella-montmaneu`,
  `pastisseria-prat-can-carriel-roda-de-ter`, `la-coca-danis-de-vic`,
  `pastisseria-forn-de-sant-joan-sant-sadurni-danoia`,
  `pastisseria-sant-jordi-sant-sadurni-danoia`,
  `pasteleria-pascual-santa-coloma-de-gramenet`,
  `pasteleria-torres-santa-coloma-de-gramenet`,
  `arka-delicatessen-lhospitalet-de-llobregat`,
  `la-trufa-dor-sant-adria-de-besos`,
  `la-francesa-pastisseria-lhospitalet-de-llobregat`,
  `forn-de-pa-la-catalana-sant-adria-de-besos` y
  `baluard-el-magatzem-lhospitalet-de-llobregat`.

- **Lote BCN-P1-e-a (2026-08-01, segunda pasada de pan y pastelería).** Se
  revisaron en profundidad las primeras once excepciones técnicas del lote y
  **nueve fichas supervivientes reciben cambios materiales**. TAART llevaba
  sin actividad propia desde 2024 y su local de Mar 101 funciona actualmente
  como Cotti Coffee; El Capritxet figura cerrado y el Ayuntamiento sitúa desde
  2025 la sede de DIREXIS en el mismo Pi i Margall 36. Ambas filas se retiran
  como `closed`. Can Serra deja de mezclarse con la marca, el teléfono y el
  Instagram de Cal Forner: recupera nombre, slug, historia familiar desde 1928,
  contacto y horario propios, con fusión trazada. El supuesto Forn Nou de
  Folgueroles tampoco existía con los datos publicados: el Instagram era de un
  negocio de Llíria y dirección, teléfono y dominio carecían de respaldo. Se
  corrige a la unidad real de **Forn Nou de Balenyà**, documentada por el
  ayuntamiento y Fet a Osona, también con transición de slug trazada.

  Se cierran **ocho decisiones de venta**: Can Moré acepta encargos por correo
  y teléfono; Artesano Horneado en Casa recupera una tienda con catálogo,
  pago, reparto y recogida programada; y la web de PastryGas vuelve a responder
  por HTTP y publica explícitamente el correo de encargos. Roquetes, Can Serra,
  Canyars, Forn Nou y La Panadella quedan en `no` después de la segunda
  revisión de sus webs, perfiles y directorios. Todas ganan surtido,
  descripción o contacto específico. Masamara conserva `no comprobado`: se
  corrige el teléfono al de Paula Escribano y Sergi y se eliminan coordenadas
  de centroide sin dirección, pero su única huella verificable sigue siendo un
  mercado de productores de 2020, insuficiente para decidir actividad dinámica
  o venta actual.

  Barcelona pasa de **2.500 a 2.498 filas**; el residual provincial baja **507
  → 497**, la carga real **699 → 688** y el residual de pan y pastelería **22 →
  12**. Los avisos de calidad siguen en **40**, `sinteticas` en **8**,
  `plantilla-cruzada` en **21** y `pendiente` en **9**. Masamara queda aparcada
  como techo explícito y se abre `BCN-P1-e-b` con las once excepciones restantes:
  `pastisseria-prat-can-carriel-roda-de-ter`, `la-coca-danis-de-vic`,
  `pastisseria-forn-de-sant-joan-sant-sadurni-danoia`,
  `pastisseria-sant-jordi-sant-sadurni-danoia`,
  `pasteleria-pascual-santa-coloma-de-gramenet`,
  `pasteleria-torres-santa-coloma-de-gramenet`,
  `arka-delicatessen-lhospitalet-de-llobregat`,
  `la-trufa-dor-sant-adria-de-besos`,
  `la-francesa-pastisseria-lhospitalet-de-llobregat`,
  `forn-de-pa-la-catalana-sant-adria-de-besos` y
  `baluard-el-magatzem-lhospitalet-de-llobregat`.

- **Lote BCN-P1-e-b (2026-08-01, cierre profundo de pan y pastelería).** La
  segunda mitad de excepciones descubre una duplicación triple: el supuesto
  Forn de Sant Joan de Sant Sadurní era en realidad el obrador de **Pastisseria
  Trens / Forn de Sant Joan de Vilafranca**, ya presente dos veces en el CSV.
  Se conservan una sola ficha y un solo slug, se eliminan las dos copias y se
  corrigen nombre, correo, surtido e historia del obrador centenario. Can
  Carriel también recibe una reparación de identidad operativa: pasa del número
  23 al 15, corrige teléfono, correo y coordenadas y deja de enlazar el
  Instagram de una pastelería distinta de El Prat. Sant Jordi cambia el HTTPS
  autofirmado por su web HTTP funcional y retira un Instagram no demostrable;
  La Catalana sustituye un teléfono ajeno por el de la sociedad de Sant Adrià.

  Se cierran **siete decisiones de venta**. Arka y La Francesa tienen carrito
  con pago y aceptan encargos por correo; Baluard vende mediante su tienda de
  marca y marketplace. Can Carriel, Sant Jordi, Pascual y La Catalana quedan en
  `no` tras revisar sus superficies actuales sin hallar pedido remoto. Pascual
  pierde productos y el supuesto obrador propio que no tenían respaldo;
  Torres, Arka, Trufa d'Or, La Francesa, La Catalana y Baluard ganan direcciones,
  horarios, contactos, surtidos o descripciones específicos. La Coca d'Anís,
  Torres y Trufa d'Or conservan `no comprobado`: respectivamente hay un antiguo
  comercio sin DNS y dos contradicciones actuales sobre reparto sin un canal
  operable. Se aparcan junto a Masamara como los cuatro techos conocidos de la
  categoría.

  Barcelona pasa de **2.498 a 2.496 filas**; el residual provincial baja **497
  → 489**, la carga real **688 → 682** y el residual de pan y pastelería **12 →
  4**. Los avisos de calidad siguen en **40**, `sinteticas` en **8**,
  `plantilla-cruzada` en **21** y `pendiente` en **9**. Se cierra `BCN-P1-e-b`
  y el siguiente carril por volumen es **charcutería (93 `no comprobado`)**.

- **Lote BCN-C1-a (2026-08-01, primera pasada profunda de charcutería).** Se
  revisan las primeras 25 filas del carril y el resultado vuelve a ser más
  editorial que mecánico: **10 filas salen del catálogo**. Pocreu es una
  inmobiliaria, no un productor; la supuesta parada de Xarcuteries Bosch en el
  Mercat de Santa Eulàlia no existe ni en el directorio del mercado ni en los
  puntos de venta de la marca; y Agropecuària de Moià, Gerundense, Anna
  Baraldes, Òscar Casino, Enric Ullar, Can Villena, Vinfaro y Puigdauret solo
  quedan documentados como explotaciones o sociedades agrarias, sin una oferta
  alimentaria pública actual que permita convertirlos en charcuterías. Se
  retira también la imagen huérfana de la falsa parada Bosch.

  Dos fichas reciben una reparación completa de identidad con transición de
  slug trazada. **Carn del Cadí-Moixeró** deja de mezclarse con la carnicería
  Cal Negre: pasa a carne de xai, cabrit y lletó de Ricard Garcia Canal, con
  dirección, contacto y pedido directo propios. **Embotits Guinó** deja de
  figurar en Lliçà de Vall y recupera su fábrica real de Can Barri, en Bigues i
  Riells, junto con el catálogo, contacto y reparto que acaba de publicar. Cal
  Guitart incorpora su ampliación de 2025 en Passeig de la Indústria 62 sin
  borrar la tienda de Lluís Millet; Gonfaus corrige dirección, teléfono y
  producto a la vedella Bruna; Subirats se reconstruye como grupo integral de
  cuatro generaciones y baja honestamente a `parcial` al no tener coordenadas
  públicas precisas de Can Puig. Can Quintí, Can Valls, Pau i Mar, Casa Barba,
  Euroconills, Puig Fitó, Devesa y Moliner ganan asimismo horarios, contactos,
  surtidos, categorías o descripciones específicos; Casa Barba y Moliner
  pierden dominios ya inservibles.

  Se cierran **13 decisiones de venta**: Can Valls vende por WhatsApp; Carn del
  Cadí-Moixeró por WhatsApp, teléfono y correo; Pau i Mar por teléfono; Puig
  Fitó por tienda y teléfono de pedidos; y Embotits Guinó por teléfono y
  correo con reparto. Can Quintí, Cal Guitart, Gonfaus, Subirats, Casa Barba,
  Euroconills, Devesa y Moliner quedan en `no` tras revisar sus superficies
  actuales. Acero y Xarcuteria Sala conservan `no comprobado`: el primero no
  ofrece aún un contacto público atribuible y el segundo tiene un antecedente
  de reparto de 2020 que no puede darse ni por vigente ni por extinguido.

  Barcelona pasa de **2.496 a 2.486 filas**; el residual provincial baja **489
  → 466**, la carga real **682 → 661** y el residual de charcutería **93 →
  69**. Los avisos de calidad mejoran **40 → 39**; `sinteticas` sigue en **8**,
  `plantilla-cruzada` en **21** y `pendiente` en **9**. Se abre `BCN-C1-b` con
  `xarcuteria-sala-castellbisbal`, `can-corder-llinars-del-valles`,
  `explotacions-agricoles-ramaderes-picas-scp-lluca`,
  `garet-bosch-pere-lluca`, `capdevila-costa-josep-manlleu`,
  `maso-coll-david-manlleu`, `tatje-de-viladordis-manresa-viladordis`,
  `serra-xarcuters-martorell`, `conillbo-cb-masquefa`,
  `cal-trapet-matadepera`, `el-gai-pollastres-el-gai-moia`,
  `padrisa-prieto-andreu-moia`, `serracarbasa-sala-scp-moia`,
  `vall-llosana-scp-moia`, `carnisseria-altayo-ripoll-mollet-del-valles`,
  `les-mil-butis-monistrol-de-montserrat`,
  `el-soler-de-preixana-scp-montmajor`,
  `ares-puigsasllosas-pere-muntanyola`, `embotits-de-mura-mura`,
  `cansaladeria-singla-navarcles`, `marginet-costa-marti-nou-de-bergueda`,
  `cal-roio-catllaras-scp-nou-de-bergueda`,
  `carniques-maso-s-a-olerdola-vilafranca-del-penedes`, `oriol-scp-oris` y
  `100-conill-albert-puig-orista-la-torre-dorista`.

- **Lote BCN-C1-b (2026-08-01, segunda pasada profunda de charcutería).** Las
  25 filas de entrada producen **cinco bajas y cinco transiciones de slug**,
  además de una corrección general de categoría: una parte sustancial de la
  supuesta charcutería era en realidad carne o lácteos. Can Corder deja de ser
  una xarcuteria de Llinars con contacto ajeno y recupera su identidad de
  formatgeria en Santa Eulàlia de Ronçana; Conillbo deja de mezclarse con la
  marca Conill de la Barretina y se reconstruye como Pagès de Rofes, en La
  Llacuna; El Gai pasa de unos pollastres y un fuet inventados a la vedella
  ecològica de Gemma Alibés; Mas Les Basses sustituye el slug personal de Josep
  Capdevila; y Vall-Llosana se mueve de Moià a su finca real de Castellterçol,
  con Black Angus ecológica y tienda activa.

  Salen Picas, cuya única oferta alimentaria localizada era el registro de
  2014 y que el censo posterior sitúa fuera de Barcelona; Andreu Padrisa,
  proveedor de leche para Montbrú pero sin producto propio; Serracarbasa, que
  figura como aula didáctica en granja; Pere Ares, sostenido únicamente por
  registros ganaderos de 2006-2007; y L'Oriol, hoy documentado solo como
  explotación porcina y bovina. También se deshacen dos cruces especialmente
  dañinos: Martí Marginet pierde los datos de Fonda Cal Marginet y recupera La
  Canal, la vedella y el Pollastre del Berguedà; Altayó Ros pierde el teléfono,
  mapa y coordenadas de la distinta parada Altayó Ripoll.

  Se cierran **23 de las 25 decisiones de venta**. Serra acepta pedidos por
  WhatsApp; Mas Vall-Llosana por ecommerce; Les Mil Butis, Cal Roio Catllaràs
  y 100% Conill por teléfono, los dos primeros con reparto documentado. Otras
  trece fichas quedan en `no` después de revisar sus superficies vigentes, y
  las cinco bajas abandonan la cola. Solo Garet Bosch y David Masó conservan
  `no comprobado`: el registro industrial prueba al primero pero no publica
  marca o contacto de consumo, y el segundo sigue activo en el consejo agrario
  de Manlleu pero su oferta atribuible continúa anclada en el registro de 2014.

  Barcelona pasa de **2.486 a 2.481 filas**; el residual provincial baja **466
  → 443**, la carga real **661 → 643** y el residual de charcutería **69 →
  44**. Los avisos de calidad permanecen en **39**; `sinteticas` sigue en **8**,
  `plantilla-cruzada` baja **21 → 20** y `pendiente` se mantiene en **9**. Se
  abre `BCN-C1-c`, dejando aparcado el techo ya documentado de Xarcuteria Sala,
  con `carnisseria-montserrat-palau-solita-i-plegamans`,
  `carns-torrent-i-bonet-palau-solita-i-plegamans`,
  `carnisseria-llorens-perafita`, `colom-alibes-joan-rupit-i-pruit`,
  `molas-plana-maria-dolores-rupit-i-pruit`,
  `vaquer-abril-xavier-rupit-i-pruit`,
  `pedragosa-armengol-gabriel-sant-antoni-de-vilamajor`,
  `xarcuteria-cristobal-mercat-de-mira-sol-sant-cugat-del-valles`,
  `carns-aguilar-heredia-s-l-sant-fost-de-campsentelles`,
  `embutidos-artesanos-la-alhambra-de-granada-s-l-sant-fost-de-campsentelles`,
  `cal-codina-de-tous-sant-marti-de-tous`,
  `duocastella-figuera-anna-m-sant-mateu-de-bages`,
  `puigdollers-cansaladeria-sant-miquel-de-balenya`,
  `cal-quim-sant-pau-dordal-subirats`,
  `el-roger-scp-sant-pere-de-torello`,
  `marti-marigot-guillem-sant-pere-de-torello`,
  `pau-alana-sant-quirze-del-valles`,
  `fabrica-dembotits-v-serret-s-l-sant-vicenc-dels-horts`,
  `agricola-i-ramadera-can-lluis-santa-maria-de-palautordera`,
  `can-bullit-seva`, `miranda-comellas-marcel-sora`,
  `oms-molist-pere-sora`, `josep-i-ricard-scp-tavernoles`,
  `queviures-marcual-can-marcual-teia` y
  `santa-magdalena-sat-num-962-cat-terrassa`.

- **Lote BCN-C1-c (2026-08-01, tercera pasada profunda de charcutería).** Las
  25 filas revisadas dejan **13 bajas**, una transición de slug y doce fichas
  comerciales reparadas. Colom Alibés, Maria Dolors Molas, Xavier Vaquer,
  Anna Duocastella, Marcel Miranda, Pere Oms y Josep i Ricard solo conservaban
  como oferta alimentaria el registro de proximidad de 2014; El Roger consta
  actualmente como explotación ovina y caprina, Guillem Martí como pastor y
  Gabriel Pedragosa como prestador de servicios silvopastorales, sin producto
  alimentario propio a la venta. Santa Magdalena SAT sigue censada, pero la
  supuesta charcutería mezclaba sus datos con la distinta Avícola Lleonart de
  Ullastrell. Carns Aguilar sale tras publicar el BORME de mayo de 2026 la
  conclusión del concurso y cierre registral; Can Marcual cerró definitivamente
  el 18 de enero después de 125 años.

  La reparación de identidad más clara es **Cansaladeria Puigdollers**: no
  estaba en Sant Miquel de Balenyà, sino en Tona, tal como ya indicaban sus
  coordenadas. Cambian municipio, dirección y slug y se incorporan su catálogo,
  móvil y encargos por teléfono o WhatsApp. Can Lluís deja de enlazar mapa,
  teléfono y horario de Agrobotiga de la Roca y pasa de charcutería a productor
  de horta, legumbres y cereales en Santa Maria de Palautordera. Cal Codina
  corrige una dirección y un mapa ajenos por la tienda centenaria de carrer de
  les Escoles; Montserrat, Llorens, Cristóbal, Cal Quim, Pau Alañá, V. Serret,
  Can Bullit y La Alhambra ganan surtidos, contactos, horarios, descripción o
  fuentes actuales. Se mantienen parciales La Alhambra y V. Serret por depender
  de directorios de terceros, y Carns Torrent por no estar cerrada del todo la
  relación entre tienda y planta elaboradora.

  Se cierran **las 25 decisiones de venta**. Montserrat publica catálogo y
  pedidos en el marketplace colectivo y WhatsApp; Llorens y Puigdollers admiten
  encargos por WhatsApp; Carns Torrent y Can Bullit, por teléfono. Cristóbal,
  La Alhambra, Cal Codina, Cal Quim, Pau Alañá, V. Serret y Can Lluís quedan en
  `no` después de revisar sus superficies vigentes. Barcelona pasa de **2.481 a
  2.468 filas**; el residual provincial baja **443 → 418**, la carga real **643
  → 619** y el residual de charcutería **44 → 19**. Los avisos de calidad
  mejoran **39 → 38**; `sinteticas` sigue en **8**, `plantilla-cruzada` en
  **20** y `pendiente` en **9**.

  Se abre `BCN-C1-d` con las 18 filas frescas restantes, dejando aparcado el
  techo documentado de Xarcuteria Sala: `mauri-puig-lluis-tona`,
  `jordi-torres-lacomba-tordera`, `monfulleda-mollfulleda-pere-tordera`,
  `can-teixidor-carns-teixidor-sl-torello`,
  `cansaladeria-i-comestibles-cal-xullat-torrelles-de-foix`,
  `carns-i-embutits-de-coll-fred-sl-vic`,
  `carnivors-mercat-de-la-constitucio-viladecans`,
  `cal-vives-vilafranca-del-penedes`, `badacabres-sl-vilanova-del-valles`,
  `pujol-pagerols-ramon-m-viver-i-serrateix`,
  `carnisseria-i-xarcuteria-can-freixas-tordera`,
  `xarcuteria-ca-ladela-caldes-destrac`,
  `can-rodoreda-les-franqueses-del-valles`,
  `ecoviand-de-brugarolas-les-franqueses-del-valles`,
  `xarcuteria-can-jordi-santa-eugenia-de-berga`,
  `casa-noguera-1870-igualada`, `cansaladeria-can-trave-la-llacuna` y
  `lainurvi-llardons-artesans-castellar-del-valles`.

- **Lote BCN-C1-d (2026-08-01, cierre de la pasada profunda de charcutería).**
  Las 18 filas frescas restantes dejan **cuatro bajas**, dos transiciones de
  slug y catorce fichas comerciales reparadas. Mauri Puig era una explotación
  ganadera sin oferta alimentaria propia; el queso y la venta correspondían a
  la ficha distinta y ya existente de Formatges Mas el Garet. Pere Monfulleda
  solo conservaba el registro histórico de proximidad, Badacabres publica hoy
  servicios de pastoreo y gestión forestal, y Ca l'Adela funciona como vinoteca
  y bar gastronómico. Las cuatro salen como `out-of-scope` en vez de convertir
  señales ganaderas o de restauración en productores vendibles.

  La identidad de **Bechs** sustituye a la fila nominal de Ramon M. Pujol
  Pagerols: la web familiar vigente confirma la elaboración en Viver i
  Serrateix, su catálogo de cerdo, embutidos y confitados y los pedidos por
  teléfono o WhatsApp. **Ecoviand de Brugarolas** corrige su municipio y slug de
  les Franqueses del Vallès a Moià, donde trasladó la actividad en 2023; la
  venta actual se acredita en el marketplace de GHD Fresc y se retira el
  dominio corporativo sin DNS. Jordi Torres pasa de charcutería a carne con sus
  lotes ecológicos de vacuno Limousin; Can Rodoreda corrige su nombre público a
  Can Rodorera; Can Travé recupera su dirección actual; Can Teixidor, Cal
  Xullat, Collfred, Carnívors, Cal Vives, Can Freixas, Can Jordi, Casa Noguera y
  Lainurvi ganan producto, contacto, horario, dirección o fuente vigente según
  cada superficie revisada. También se eliminan dominios muertos, secuestrados
  o ajenos que degradaban cuatro de esas fichas.

  Se cierran **las 18 decisiones de venta**. Mas Freixes, Bechs y Can Freixas
  aceptan pedido directo; Collfred y Casa Noguera tienen ecommerce propio, y
  Carnívors y Ecoviand venden mediante marketplaces actuales. Las otras once
  decisiones quedan en `no` después de revisar sus superficies vigentes o, en
  las cuatro bajas, desaparecen con la fila. Barcelona pasa de **2.468 a 2.464
  filas**; el residual provincial baja **418 → 400**, la carga real **619 →
  600** y el residual de charcutería **19 → 1**. Los avisos de calidad bajan
  **38 → 37**; `sinteticas` sigue en **8**, `plantilla-cruzada` en **20** y
  `pendiente` en **9**. El único caso retenido es Xarcuteria Sala, techo ya
  documentado; la pasada principal de charcutería queda cerrada. El siguiente
  carril abre las 90 decisiones restantes de lácteos y quesos (**41**), cerveza
  artesana (**20**), miel (**19**) y aceite (**10**) en tandas homogéneas.

- **Lote BCN-L1-a (2026-08-01, primera pasada profunda de lácteos).** Se
  revisan 23 fichas con alguna superficie pública y el resultado no se limita a
  resolver la columna de venta: salen **tres falsos productores**, se corrigen
  dos identidades geográficas con transición de slug y se reconstruyen veinte
  fichas comerciales. Formatgeria Simó y Queso con Chocolate son comercios que
  revenden queso de otros elaboradores; Andreu Argudo era una ficha sintética
  apoyada en una plantilla SEO anónima, mientras las fuentes públicas actuales
  identifican al homónimo de Montgat como futbolista y entrenador. Se eliminan
  también sus tres imágenes huérfanas.

  **Làctics Clotet** deja Granollers y recupera su emplazamiento real en Caldes
  de Montbui, el catálogo de El Clotet/L'Arca y coordenadas institucionales.
  **Molí de l'Alzina** sustituye el nombre descriptivo y el slug excesivo de
  Formatgeria de Cantonigròs. Can Orjusa pierde el mapa, las coordenadas, el
  teléfono y el horario prestados por la distinta Formatges Can Pujol;
  Ecomercaderet recupera su dominio nuevo, la finca y la tienda activa; Can Gel
  deja de atribuirse derivados Pastoret y queda correctamente descrita como
  productora de leche. Bauma, Artelac, Cuirols, La Cabreria, Cal Cantaré e
  [in]perfecto dejan atrás dominios muertos, comprometidos o rechazados y
  ganan fuentes públicas vigentes. Gavarresa, Cal Serrador, La Brolla, Les
  Feixes, Cal Músic, Reixagó, Cal Carlot, Riudavets y Ancosa incorporan
  catálogos, contactos, direcciones o descripciones específicas.

  Se cierran **18 de las 23 decisiones**. Gavarresa y Les Feixes aceptan
  encargos por formulario o correo; La Brolla, Reixagó, Ecomercaderet y
  Riudavets tienen ecommerce propio operativo. Nueve fichas quedan en `no`
  tras revisar sus superficies actuales y las tres bajas abandonan la cola.
  Conservan `no comprobado` cinco techos explícitos: Molí de l'Alzina por
  dominio muerto y menciones de compra atribuibles a revendedores; Cuirols por
  tienda propia con pagos desactivados; Artelac por dos dominios caídos pese a
  una mención institucional de tienda; [in]perfecto por la discrepancia entre
  obrador y contacto actual; y Ancosa porque su web propia responde 403.

  Barcelona pasa de **2.464 a 2.461 filas**; el residual provincial baja **400
  → 382**, la carga real **600 → 582** y el residual de lácteos **41 → 23**.
  Los avisos de calidad mejoran **37 → 36**; `sinteticas` sigue en **8**,
  `plantilla-cruzada` en **20** y `pendiente` en **9**. `BCN-L1-b` queda
  abierto con las 18 fichas frescas restantes y los cinco techos anteriores se
  aparcan para no volver a contarlos como trabajo sin investigar.

- **Lote BCN-L1-b (2026-08-01, cierre de la pasada profunda de lácteos).** Las
  18 fichas frescas dejan **diez bajas**, dos recategorizaciones a carne, siete
  decisiones de venta cerradas y un techo nuevo. El corte principal es de
  alcance: Els Gatells, Garduixeres y Crous Cutrina producen leche para otros
  elaboradores pero no publican un alimento propio vendible; Produccions
  Làctiques Masferrer solo consta actualmente como explotación bovina; L'Aranyó
  solo como explotación caprina, y el supuesto queso y yogur de Sandra Rial
  contradecían su único registro de 2014, que enumeraba cabrito, leche, huevos y
  elaborados sin precisar. Ca n'Oller era una masía histórica convertida en
  granja láctea por la ficha, Vicenç Vergés no existe en el roster vigente de
  Productes de Palou y Formatgeria El 27 es una tienda minorista. Vicenç Manent
  sale como cierre: una sentencia firme confirmó la clausura de su actividad y
  no aparece reanudación posterior. Se eliminan las ocho imágenes que habían
  quedado ligadas a esas bajas.

  **Mas Rogers** deja de apropiarse los lácteos que El Canadell elabora con su
  leche y pasa a carne, su producto propio de venta directa, además de recuperar
  contacto y coordenadas municipales. **Cabrum Les Tres Torres** también pasa a
  carne de cabrito y leche y pierde el pin del Turó de Tagamanent, que no era la
  explotación. Granja Fabre limpia una descripción corrupta y conserva parcial
  la oferta histórica de leche de cabra y huerta gracias a su continuidad en el
  censo agrario de 2026. Can Ponsa recupera dirección, correo, móvil y catálogo
  con continuidad en Lactium 2025; Mató d'Ullastrell corrige coordenadas y
  consolida su ficha municipal; Roca del Cor gana gama, móvil y una descripción
  de producción propia verificable.

  Granja Ventosa queda como el único `sí`: la ficha comercial vigente invita a
  encargar por correo la leche cruda propia. Granja Fabre, Mas Rogers, Cabrum,
  Can Ponsa, Mató d'Ullastrell y Roca del Cor quedan en `no` al no publicar
  compra o entrega remota. **La Planeta de Roda de Ter** se aparca: se retiran
  la leche fresca y la venta en finca no sustentadas, pero el perfil enlazado no
  muestra actividad comercial y las búsquedas conducen sobre todo a un homónimo
  de Xert; no se fuerza ni baja ni `no` sin resolver antes la identidad.

  Barcelona pasa de **2.461 a 2.451 filas**; el residual provincial baja **382
  → 365**, la carga real **582 → 565** y el residual de lácteos **23 → 6**. Los
  avisos de calidad mejoran **36 → 34**, `sinteticas` **8 → 7** y la señal de
  evidencia prestada **129 → 128**; `plantilla-cruzada` sigue en **20** y
  `pendiente` en **9**. La pasada fresca de lácteos queda cerrada con seis techos
  explícitos: los cinco de `BCN-L1-a` y La Planeta. El siguiente carril abre las
  20 decisiones de cerveza artesana.

- **Lote BCN-B1-a (2026-08-01, primera pasada profunda de cerveza).** Se
  revisan las diez primeras fichas del carril y se cierran **siete decisiones
  de venta** sin forzar los tres fallos técnicos. La Textil queda en `no`: su
  tienda actual solo vende ropa y discos, no cerveza. Canetenca recupera el
  nombre público actual, elimina el pin ajeno de Bar La Trinca y confirma
  ecommerce en cajas de 12; Els Minairons pasa de estilos genéricos a seis
  referencias reales, adopta las coordenadas institucionales y recoge pedidos
  por correo. Synera deja de confundirse con el nombre del taproom, corrige
  correo, Instagram y posición, y queda en `sí|telefono` por su ficha de venta
  en línea y distribución propia.

  La pasada también corrige alcance e identidad. ST ROCH se describe ya como
  cervesera nómada, pierde una supuesta fábrica no sustentada y actualiza móvil,
  Instagram y catálogo. Dehum deja de figurar como microcervecera comercial:
  es una asociación sin ánimo de lucro de autoproducción y cultura cervecera,
  activa en ferias, y pierde el mapa prestado de The Drunk Monk. Grenyut corrige
  comarca, nombre, dirección, Instagram, horario y cinco cervezas; su aplicación
  oficial publica `Botiga: En construcció`, por lo que queda en `no`. ART borra
  la razón social histórica Cervebrew, pasa a HTTPS y conserva `no comprobado`:
  tienda y carrito cargan, pero el catálogo está vacío. Brew Pub Le Sec responde
  503 y The Goats sirve el vhost por defecto; ambos quedan aparcados como techos
  técnicos, no como falsos `no`.

  Barcelona mantiene **2.451 filas**; el residual provincial baja **365 → 358**,
  la carga real **565 → 558** y el residual de cerveza **20 → 13**. Los avisos
  de calidad siguen en **34**, `sinteticas` en **7**, evidencia prestada en
  **128**, `plantilla-cruzada` en **20** y `pendiente` en **9**. `BCN-B1-b`
  continúa con las diez fichas frescas restantes; los tres techos de esta tanda
  quedan fuera del recuento de trabajo fresco.

- **Lote BCN-B1-b (2026-08-01, cierre de la pasada profunda de cerveza).** Las
  diez fichas restantes cierran **cinco decisiones de venta** y corrigen las
  diez superficies. Reptilian deja atrás el descriptor genérico, recupera
  móvil y cuatro referencias de gama fija y confirma 17 productos comprables
  en la tienda colectiva de BrewCluster (`sí|marketplace`). HOBAC incorpora
  Bruma, Santa Maria y Memento Mori, elimina el mapa prestado de La Vinya Bar y
  queda en `sí|marketplace` con su escaparate de productor en La Colmena.
  Montseny gana seis cervezas, descripción de fábrica y horario completo de
  taproom; Capfoguer sustituye productos genéricos por sus cuatro recetas y
  aclara el papel de La Fàbrica. Ambos quedan en `no`: publican compra o consumo
  presencial, pero no pedido remoto de cerveza.

  La Montnegre confirma continuidad con su lanzamiento de enero de 2026,
  corrige municipio, móvil e Instagram y elimina dominio sin DNS, dirección
  territorial y pin sin obrador; su distribución actual es a bares locales.
  La Micro recupera a Roger Plata, contacto y estilos premiados; Bripau cambia
  el dominio muerto por la web vigente, correo, visitas y cuatro cervezas; La
  Lenta deja de atribuirse fábrica propia y se presenta como cervecera nómada
  con sus cuatro referencias. Cornèlia actualiza la gama con su presencia en
  feria y pierde coordenadas sin dirección productiva. Las cuatro conservan
  `no comprobado`: timeout en La Micro, Shopify retirada en Bripau, error 500
  en La Lenta y configuración Wix rota en Cornèlia.

  **Barret Cerveses** deja la dirección histórica de Granollers y pasa a Can
  Malé con transición a `barret-cerveses-llica-damunt`, sin imagen que mover.
  Se conservan solo Floppy, Caubeen y Kabuto y se documenta la contradicción:
  una fuente institucional reciente lo incluye en la cooperativa, mientras una
  fuente especializada dice que la marca ya no opera de modo independiente; la
  tienda colectiva responde 403. Queda parcial y sin resolución de venta hasta
  poder separar marca activa de recetas heredadas.

  Barcelona mantiene **2.451 filas**; el residual provincial baja **358 → 353**,
  la carga real **558 → 553** y el residual de cerveza **13 → 8**. Los avisos
  de calidad siguen en **34**, `sinteticas` en **7**, evidencia prestada en
  **128**, `plantilla-cruzada` en **20** y `pendiente` en **9**. La pasada fresca
  de cerveza queda cerrada con ocho techos explícitos: Le Sec, ART, The Goats,
  La Micro, Bripau, La Lenta, Cornèlia y Barret. El siguiente carril abre las
  19 decisiones de miel.

- **Lote BCN-M1-a (2026-08-01, primera pasada profunda de miel).** Las diez
  primeras fichas dejan **ocho decisiones fuera del residual** y corrigen cinco
  identidades públicas. **Naturmel** sale de Barcelona: el dominio enlazado
  redirige a Miel y Solo Miel y su única sede oficial está en Colmenar (Málaga),
  no en Castelldefels. **Delícia de Mel** pasa de Moià a su obrador real de
  Calders, elimina teléfono y Facebook ajenos, incorpora variedades, contacto y
  web propios y confirma ecommerce activo. **Ester Garriga** se reconstruye
  como **Mels Cal Pastoret**, con obrador, correo, gama y tienda propia; la
  entrevista de Diputación de 2025 confirma la continuidad de la explotación.

  **Bibiana Bataller** pasa a su marca **Mel Cal Fuster**, corrige el punto de
  Castelladral, borra horario y contactos contaminados y recupera mel, cera,
  pròpolis y derivados. La ficha vigente de Diputación marca venta en línea y
  Pagesia a casa concreta reparto comarcal y pago remoto, por lo que queda
  `sí|telefono`. **Envasats Mic&Em** adopta la marca **Mel del Paratge de la
  Serra del Boix**, catálogo real y el domicilio de Casa Pere Periques. El
  registro agroalimentario de mayo de 2026 confirma la extracción de miel, pero
  su web no resuelve DNS: se mantiene como techo técnico, no como falso `no`.

  **La Mel** sustituye la ficha nominal de Annabel Muñoz y estrena su web de
  2026, cuatro productos, móvil y correo. **Mel de les Valls del Montcau**
  elimina el pin prestado de Can Monràs Nou, recupera a Marc Pineda y su mel de
  farigola premiada en 2025. Ambas quedan en `no`: sus superficies actuales
  ofrecen puntos de venta o directorio, pero no pedido remoto. Abelles Negres
  actualiza las cuatro mels del catálogo 2025 y queda también en `no`; la
  reserva web es sólo para núcleos de abejas. Anthophila elimina las mermeladas
  inventadas y precisa miel, productos apícolas y material vivo. **Roser
  Jordana** queda sin tocar como techo: no apareció una fuente actual que
  permita reconstruir con seguridad su actividad comercial apícola.

  Barcelona pasa de **2.451 a 2.450 filas**; el residual provincial baja **353
  → 345**, la carga real **553 → 546** y el residual de miel **19 → 11**. Los
  avisos de calidad siguen en **34**, `sinteticas` en **7**, evidencia prestada
  en **128**, `plantilla-cruzada` en **20** y `pendiente` en **9**. `BCN-M1-b`
  continúa con las nueve fichas frescas restantes; los dos techos de esta tanda
  son Mel del Paratge y Roser Jordana.

- **Lote BCN-M1-b (2026-08-01, cierre de la pasada profunda de miel).** Las
  nueve fichas restantes cierran **seis decisiones de venta** y descubren dos
  duplicados transversales. **Mel dels Erms** actualiza responsable, dirección,
  teléfono, correo y cinco líneas de producto; su ruta «Botiga» está vacía y
  Gastroteca sólo publica canales presenciales, por lo que queda en `no`.
  **Mel Can Mallofré** absorbe la ficha nominal de Salvador Mallofré, conserva
  el slug público que ya existía y sustituye una dirección de Barcelona y un
  horario 24 h por el obrador de Sant Pau d'Ordal, siete variedades y contacto
  actual. No tiene web y sólo vende en ferias y mercados (`no`).

  **Mel d'Antany – Pau Bars** concreta productos, dirección y coordenadas de la
  ficha vigente de Diputación y pasa a `sí|telefono`: la fuente marca venta en
  línea y distribución propia y publica el móvil. **L'Horta de la Tuka** cambia
  el dominio retirado por su escaparate activo en Oidà, donde se prepara la
  cesta y se envía por WhatsApp; también actualiza horario, reparto y catálogo
  mixto (`sí|whatsapp`). **Brunzit** recupera Can Miqueló, a Josep M. Márquez y
  el origen de su producción limitada; sus superficies actuales sólo ofrecen
  contacto (`no`). **Mels de Can Monràs Nou** corrige domicilio, coordenadas,
  número de arnes y catálogo: la supuesta tienda es un catálogo sin precios,
  carrito, checkout ni instrucción de pedido, así que queda en `no` tras
  inspección funcional.

  La pasada retira además el duplicado previo de **Mel Cal Fuster** bajo
  `Despensa artesanal`, junto con sus mermeladas y horario corruptos. Said
  Azouggagh pierde el pin prestado del campo de fútbol y adopta centroide
  municipal; Víctor Goula pierde el pin personal y la descripción de plantilla.
  Ambos conservan `no comprobado` porque no apareció superficie comercial
  actual. **Mel Morató – Mel Mas Foradada** también queda como techo: Gastroteca
  sólo muestra venta física, pero el dominio oficial responde 502 y esa avería
  impide convertir incertidumbre en `no`.

  Barcelona pasa de **2.450 a 2.448 filas**; el residual provincial baja **345
  → 338**, la carga real **546 → 538** y el residual de miel **11 → 5**. Los
  avisos de calidad siguen en **34**, `sinteticas` en **7**, evidencia prestada
  en **128**, `plantilla-cruzada` en **20** y `pendiente` en **9**. La pasada
  fresca de miel queda cerrada con cinco techos explícitos: Mel del Paratge,
  Roser Jordana, Said Azouggagh, Víctor Goula y Mel Morató. El siguiente carril
  abre las decisiones de aceite.

- **Lote BCN-O1 (2026-08-01, pasada profunda de aceite).** Las diez fichas
  frescas cierran **siete decisiones de venta** y corrigen dos errores de
  alcance más importantes que el contador. **Masia Ca la Gori** no elabora el
  aceite y las aceitunas que decía el CSV: es la explotación de aviram de la
  familia Olivella Cruz, con gall y ànec mut del Penedès, foie, raviolis y
  escorxador propio. Pasa a `Carne`, recupera su dirección, web y teléfono y
  queda en `no` porque las fuentes actuales sólo publican venta en explotación
  y puntos físicos.

  **Olivariana** pasa de Subirats a Font-rubí, elimina el pin prestado de una
  finca vinícola y cambia `Aceite` por `Aceitunas y encurtidos`: su producción
  vigente es Blanqueta, Grossal y Empeltre aliñadas y olivada. La cooperativa
  kmCAT mantiene referencias comprables con precio y carrito, por lo que queda
  `sí|marketplace`. **Oli del Barranc – Ecotros** sale de Barcelona: Sant Joan
  Despí era una sede societaria y el pin correspondía a Grupo Mac Ser, mientras
  las parcelas, oliveras, contacto y pedidos están en L'Ametlla de Mar. La ficha
  y su imagen se trasladan a Tarragona con checkout completo verificado
  (`sí|ecommerce`).

  **Molí d'Oli Cal Nasi** recupera su web, contacto, arbequina y continuidad de
  seis generaciones confirmada por el ayuntamiento en mayo de 2026; el catálogo
  no permite pedir (`no`). **El Raig del Nano** concreta AOVE ecológico,
  dirección, punto de venta y distribución y queda `sí|telefono` según la ficha
  vigente de Diputación. **Can Cruset** corrige coordenadas y catálogo de aceite
  y almendras ecológicas y queda también `sí|telefono`. **L'Oli del Maset**
  incorpora dirección y experiencias actuales; PayPal cobra alojamiento y
  apadrinamiento, no compra remota del aceite, por lo que queda en `no`.

  Manuel Encinas y Ana Maria Rios pierden texto u horarios de plantilla, y Cal
  Feliuàs pierde un horario y un pin no sustentados. Los tres conservan `no
  comprobado`: no apareció una superficie comercial actual que permita decidir
  sin convertir ausencia de resultados en un hecho negativo.

  Barcelona pasa de **2.448 a 2.447 filas**; el residual provincial baja **338
  → 331**, la carga real **538 → 531** y el residual de aceite **10 → 3**. Los
  avisos de calidad siguen en **34**, `sinteticas` en **7**, evidencia prestada
  en **128**, `plantilla-cruzada` en **20** y `pendiente` en **9**. La pasada
  fresca de aceite queda cerrada con tres techos explícitos: Manuel Encinas, Ana
  Maria Rios y Cal Feliuàs.

- **Lote BCN-F1-a (2026-08-01, primera pasada de categorías pequeñas).** Las
  nueve fichas revisadas cierran **cinco decisiones de venta**, eliminan un
  duplicado y corrigen tres registros históricos que aún publicaban datos
  personales pese a que su propia descripción afirmaba haberlos retirado.
  **L'Escairador** absorbe la ficha nominal de Maria Costa en la ficha de marca
  ya existente, conserva imagen y pin exacto y actualiza catálogo, contactos y
  redes. Su tienda propia mantiene productos con precio, cesta, portes y
  proceso de compra (`sí|ecommerce`).

  **Civia Cereals (Cal Civia)** deja de atribuirse a Seva y a un catálogo
  antiguo de espelta, legumbres y peras. Se reconstruye como **Civia Foods**,
  marca de Avencat Bio en Balenyà, con dirección y contactos oficiales,
  catálogo vigente de granolas ecológicas sin gluten y ecommerce con carrito,
  envíos y pago por Bizum o tarjeta. **Mas Terricabras** pierde el horario y
  los contactos corruptos, recupera a Miquel Rovira, el Cigró d'Oristà y los
  blats forment y xeixa; las superficies actuales sólo documentan venta en
  explotación, feria y restauración (`no`). **Mas d'Ardesa** confirma
  continuidad en 2026 y pasa a `sí|telefono`: la ficha vigente de Diputación
  publica el móvil y marca a la vez venta en línea, venta directa y
  distribución propia. **Xarcuteria Sala** queda en `no`: la guía excepcional
  de reparto de 2020 no continúa en el directorio municipal ni en la superficie
  operativa actual.

  Diego Aguilar, Juana Tamarit y Modest Preixens conservan `pendiente|no
  comprobado` como techos históricos: sólo aparece el registro de 2014. Se
  corrige `Aceite y vino` a `Aceite` y se retiran domicilios y contactos
  personales sin vigencia comercial. Cultius La Gírgola tampoco cambia de
  estado: el directorio municipal confirma identidad y contacto, pero la web
  propia falla y no permite convertir incertidumbre técnica en `no`.

  Barcelona pasa de **2.447 a 2.446 filas**; el residual provincial baja **331
  → 326** y la carga real **531 → 528**. Los avisos de calidad siguen en **34**,
  evidencia prestada en **128** y `pendiente` en **9**. `sinteticas` sube **7 →
  8** al retirar el último contacto histórico de Juana Tamarit y
  `plantilla-cruzada` sube **20 → 21** porque el catálogo real de Civia combina
  cereal, fruta, frutos secos y chocolate; ambas son señales más honestas, no
  datos inventados. La segunda pasada continúa con las ocho fichas restantes
  de zumos, infusiones, aceitunas, licores, setas y aperitivos.

- **Lote BCN-F1-b (2026-08-01, cierre de categorías pequeñas).** Las ocho
  fichas restantes cierran **tres decisiones de venta**, consolidan dos
  identidades y eliminan una empresa extinguida. **Mostos Suc de Vida** deja de
  ser una ficha personal de Daniel Pascual en Vilafranca: el registro vigente
  sitúa la sociedad y planta elaboradora en Carrer del Ribat 33, Santa Margarida
  i els Monjos. Se eliminan un teléfono de una empresa de reformas, un horario
  inventado y un pin de Daniel Fàbrega, todos ajenos; sin superficie comercial
  actual, conserva `parcial|no comprobado`.

  **Jaime Pons Ametller** queda como techo histórico `pendiente|no comprobado`:
  el único rastro productivo es el registro de venta de proximidad de 2014. Se
  corrigen categoría y productos y se retiran horario, contacto, coordenadas,
  pin e imagen, que pertenecían a Ametller Origen en Sant Cugat. **SoTaTerra**
  sustituye la antigua identidad La Tofonera, actualiza trufa negra ecológica y
  Poma de Busa y conserva la plantación de Avià; su perfil actual sólo anuncia
  tienda física de invierno en Torà, así que una referencia antigua a pedidos
  por Instagram no permite resolver la venta remota. Herbolari de Sau mantiene
  actividad confirmada por la feria municipal de 2025, pero sus dominios
  históricos ya no ofrecen una web utilizable.

  **Outer Gin** pasa a `sí|marketplace`: el perfil oficial enlaza directamente
  a una ficha de Amazon disponible, con precio y alta en cesta comprobados.
  **La Destilateca** recupera domicilio, teléfono, email y gama; su tienda propia
  está agotada, pero la Ginebra Mar que elabora para CxC conserva compra y envío
  operativos en la tienda del proyecto colaborador (`sí|marketplace`).
  **Mostatxo** concreta sus dos mostos y los productores Gil Coma y Magda Bages;
  la web propia invita expresamente a escribir para llevarse el producto
  (`sí|email`). **Paul and Pippa** sale del catálogo: la sociedad productora
  consta extinguida desde 2022 y la marca cancelada en 2025; una web residual y
  existencias de minoristas no demuestran un productor activo o sucesor.

  Barcelona pasa de **2.446 a 2.445 filas**; el residual provincial baja **326
  → 322** y la carga real **528 → 524**. Los avisos de calidad bajan **34 →
  33**, `plantilla-cruzada` **21 → 20**, evidencia prestada sigue en **128**,
  `sinteticas` sube **8 → 9** por la limpieza de Jaime Pons y `pendiente` **9 →
  10**. Son degradaciones editoriales deliberadas: sustituyen datos concretos
  pero falsos por incertidumbre visible. Con este lote se cierra la primera
  pasada de categorías pequeñas; el siguiente carril se elige sobre las 322
  ventas aún sin resolver.

- **Lote BCN-F2-a (2026-08-01, Avià, Badalona y dos mercados).** Siete fichas
  revisadas eliminan **dos duplicados** y cierran **cinco huecos de venta**.
  La ficha antigua de **Ibertruf** mezclaba la consultora técnica de Solsona con
  la explotación tofonera de Pere Muxí y añadía nueces y un pin de Muxí Mobles
  sin sustento. Se integra en **SoTaTerra**, la identidad productiva vigente.
  **Ous Dachs** también estaba duplicada bajo el nombre personal de Josep Dachs
  Sabata: se conserva la ficha de marca, su imagen y el pin exacto, se recupera
  el móvil actual y se elimina tanto el pin de Dachs Electrónica como el pollo
  de corral que no forma parte de la gama publicada. El directorio territorial
  sólo documenta distribución en tiendas y supermercados del Berguedà (`no`).

  **Lillo Picó** concreta helados, horchata, granizados y turrones, la continuidad
  familiar desde 1971 y el horario actual. La ficha operativa enumera consumo y
  recogida y marca expresamente que no hay entrega (`no`). **Bomboneria Almera**
  mejora generaciones y catálogo —Bombons d'Anís del Mono, Pavillard, Bomboles
  y turrones—, pero queda como techo técnico: su sitio afirma enviar a domicilio,
  aunque el navegador actual bloquea toda la tienda por certificado caducado y
  no permite comprobar precio o cesta. Se conserva `no comprobado`; un fallo TLS
  no se convierte en un cierre ni en un `no`.

  **Gastro Carnicería Guasch** pasa de `Huevos` a `Carne`, corrige nombre,
  teléfono, correo, gama y mapa y retira el dominio inexistente. Su página
  oficial sólo ofrece consumo local y contacto, sin pedido o entrega (`no`).
  **Carnisseria Polleria Eva** también deja la categoría Huevos y elimina notas
  de ubicación duplicadas: la tienda colectiva oficial del Mercat 11 de
  Setembre mantiene catálogo, precios, cesta, tramitación y reparto
  (`sí|marketplace`).

  Barcelona pasa de **2.445 a 2.443 filas**; el residual provincial baja **322
  → 317** y la carga real **524 → 519**. `sinteticas` sigue en **9**, evidencia
  prestada en **128**, `plantilla-cruzada` en **20** y `pendiente` en **10**;
  `sin-imagen` baja **1.374 → 1.372** por la consolidación de las dos fichas
  duplicadas sin activo propio.

- **Lote BCN-F2-b (2026-08-01, Barcelona ciudad y dos traslados).** Nueve
  fichas revisadas resuelven **cinco huecos provinciales** y eliminan varias
  atribuciones cruzadas. **Barcelona Chocolate Company** mantiene inactiva su
  cesta, pero su web actual dirige expresamente las compras al correo propio;
  actualiza gama, contacto y mapa y pasa a `sí|email`. **Oggi Gelato** tiene
  carta operativa en Glovo con precios, alta de producto y entrega
  (`sí|marketplace`). **Oriol Balaguer** recupera la tienda propia y el correo
  de pedidos, con referencias disponibles, cesta y tramitación
  (`sí|ecommerce`).

  Dos supuestos productores barceloneses eran domicilios administrativos.
  **Agrícola Poma** comercializa LoMasOli, pero cultiva y elabora en Finca les
  Pinyanes del Priorat; se traslada a Tarragona como `lomasoli-priorat` y queda
  en `no` tras revisar su catálogo completo sin precio, pedido ni entrega.
  **Martin González Meyer** es **Oli Cometes**: las condiciones de compra y el
  ayuntamiento sitúan finca y molino propios en La Pobla de Cérvoles. Se
  traslada a Lleida con su identidad, gama, contacto y ecommerce reales.

  La ficha de **Artemis Cosmètica** estaba contaminada por un centro de estética
  homónimo de Nou Barris: se eliminan web, Facebook, teléfono, pin, coordenadas,
  horario e imagen genérica ajenos y se conserva el perfil del proyecto
  artesano. **Fontcalda Corporate, Joan Prats Espar y David Balsells Edo**
  mantienen sólo lo que respalda el registro histórico; se retiran contactos y
  mapas sin corroboración —incluidos Galeria Joan Prats y Grup Balsells— y
  quedan `pendiente`, sin fingir precisión actual.

  Barcelona pasa de **2.443 a 2.441 filas**; el residual baja **317 → 312** y
  la carga real **519 → 514**. `sinteticas` sube **9 → 12** y `pendiente` **10
  → 13** por las tres limpiezas históricas; evidencia prestada sigue en **128**
  y `plantilla-cruzada` en **20**. `sin-imagen` baja **1.372 → 1.371**: salen
  dos fichas sin activo y Artemis deja de apuntar a una imagen no identificable.

- **Lote BCN-F2-c (2026-08-01, continuidad comercial y depuración societaria).**
  **Xurreria Apolo** se corrige a su continuidad vigente, **Xurreria Jessy**:
  conserva el local de Creu Coberta y la imagen, actualiza gama, horario,
  teléfono, correo e Instagram y documenta también los locales de Aragó y
  Sabadell. El perfil oficial mantiene un destacado de reparto y Uber Eats
  ofrece carta, cesta y entrega (`sí|marketplace`). **Bombons Blasi** actualiza
  gama y correo y pasa a `sí|ecommerce`: la tienda propia conserva referencias
  disponibles con precio, cantidad y alta en cesta, aunque otras sólo admitan
  recogida o estén agotadas.

  **Blue Zafir** sale de Barcelona: Roc Boronat era la oficina, mientras la
  documentación territorial sitúa su explotación **Mas Julià** en Torroella de
  Montgrí. Se traslada a Girona sin arrastrar teléfono, correo ni pin
  administrativos. **Global Grup Mamabe** deja de atribuirse almendras,
  aceitunas, higos y fruta: el registro agroalimentario vigente sólo acredita
  elaboración de especias, y la marca registrada permite identificar Azafrán
  de Montserrat; se corrigen teléfono y mapa.

  **Eduardo Cerdán, Alejandro Molina y Fiplana** pierden datos aparentemente
  precisos pero contaminados: gestoría, empresa de biomasa y Finques Laplana,
  respectivamente. Se corrigen categorías y gama desde los registros y quedan
  `pendiente`, porque no hay superficie comercial actual que sostenga esos
  contactos ni permita resolver la venta.

  Barcelona pasa de **2.441 a 2.440 filas**; el residual baja **312 → 309** y
  la carga real **514 → 511**. `sinteticas` sube **12 → 15** y `pendiente` **13
  → 16** por las tres depuraciones; evidencia prestada sigue en **128** y
  `plantilla-cruzada` en **20**. `sin-imagen` baja **1.371 → 1.370** por el
  traslado de Blue Zafir, que no tenía activo.

- **Lote BCN-F2-d (2026-08-01, explotaciones rurales y continuidad jurídica).**
  Ocho fichas revisadas cierran **siete huecos de venta** y corrigen dos
  identidades geográficas. **El Rusc d'Or / FR Apicultors** pasa a `Miel`,
  recupera el correo y documenta encargos y envío peninsular (`sí|email`).
  **Xais Adoració** deja de usar Calaf en el slug —era un punto de venta— y se
  identifica con su explotación de Sant Martí Sesgueioles; actualiza dirección,
  móvil, correo y gama y la ficha provincial vigente confirma venta en línea
  (`sí|email`). **Vedella Ecològica de Trullàs** reemplaza el dominio aparcado
  por su web real, actualiza los contactos y resuelve la venta directa remota
  por correo.

  **Pastes Sanmartí** no elaboraba pasta fresca ni mermeladas: se corrigen a
  pasta seca artesanal, dirección 40, teléfono, correo, horario e Instagram. La
  actividad continúa en 2026 y su superficie propia publica el teléfono como
  canal de ventas (`sí|telefono`). **Agrovitae** tampoco era una tienda de
  legumbres: es una explotación familiar de fruta y hortaliza con cosecha
  propia, mercados semanales y encargos a domicilio por móvil y WhatsApp; se
  eliminan el pin y las coordenadas de L'Agrobotiga.

  **Granja Ecològica Sassorba** se traslada de la falsa ubicación de Caldes al
  Pla de Sant Julià de Sassorba, en Gurb, con identidad, contacto, mapa y tienda
  reales; ofrece compra única y suscripción (`sí|ecommerce|suscripcion`).
  **Matafaluga Management** se integra en **Conserves Naturals Mar-Tret**: el
  BORME acredita su absorción y extinción en 2023. Finalmente,
  **Maria Luisa Vallsmadella** conserva sólo la gama histórica; se retiran
  contacto, horario y el pin de un centro médico sin relación y queda
  `pendiente`.

  Barcelona pasa de **2.440 a 2.439 filas**; el residual baja **309 → 302** y
  la carga real **511 → 505**. `sinteticas` sube **15 → 16** y `pendiente`
  **16 → 17** por la depuración de Vallsmadella; evidencia prestada sigue en
  **128**. `plantilla-cruzada` sube **20 → 21** porque la categoría correcta
  `Harinas y cereales` de Pastes Sanmartí activa el heurístico de pasta: es un
  falso positivo documentado, no contaminación de plantilla.

- **Lote BCN-F2-e (2026-08-01, identidades cruzadas y superficies comerciales).**
  Diez fichas investigadas cierran **ocho huecos de venta** y la revisión de
  Natursoy permite eliminar además un duplicado societario. **Can Ginesta**
  vuelve de Montcada i Reixac a Calella: la dirección, el horario, el teléfono,
  la web y el mapa publicados pertenecían a un colegio homónimo. Recupera su
  nombre, fruta y contacto desde la ficha provincial, sin inventar la ubicación
  de la finca. **Cal Farrés** deja de figurar como productor de huevos abierto
  24 horas; se conserva como explotación de cigronet, pero queda `parcial` y
  sin resolver porque la superficie actual sólo documenta el alojamiento rural.

  **Aceite Alzina** pasa a `Aceite`, elimina infusiones, un Instagram de turismo
  rural manchego y el pin de otra finca. Su web HTTP sigue activa, confirma Las
  Botas, los 3.600 olivos Arbequina y pedidos de aceite por correo o teléfono
  (`sí|email|telefono`). **Can Casamada** actualiza dominio, móvil, correo y
  gama; la web invita a acudir a la agrobotiga y no ofrece pedido remoto
  (`no`). **Momocho** retira un dominio con certificado inválido y servicio no
  encontrado, sin confundirlo con cierre: la actividad continúa y Glovo ofrece
  carta, precios, pago y entrega (`sí|marketplace`).

  La fila **Cafè Fantini (Cafès del Bages)** mezclaba la fábrica de Natursoy en
  Castellterçol con enlaces de una marca italiana. Se reconstruye como **Cafès
  del Bages** en Sant Salvador de Guardiola, se conserva su imagen correcta y
  se enlaza su tienda Cafès Serra, con carrito y suscripción
  (`sí|ecommerce|suscripcion`). **Natursoy** corrige dirección, propietario,
  contacto, categoría y gama tras la incorporación por Sanygran en julio de
  2026; su catálogo no es comprable (`no`). La fila paralela de **Nutrition &
  Santé Ibérica**, que describía la misma planta bajo el dueño anterior, se
  fusiona con Natursoy.

  **Jaleo Coffee Roasters** mantiene una carta propia con precios, variantes y
  carrito (`sí|ecommerce`) y pierde horario y contactos ya no publicados.
  **Masia Cal Po** conserva el antecedente de AOVE, pero su web renovada en 2026
  se dedica sólo al alojamiento y todas las rutas antiguas de aceite y tienda
  devuelven 404 (`parcial|no`). **Granja Sant Llop** limita la gama a huevos,
  elimina el dominio sin DNS y mantiene venta en granja y distribución, sin
  pedido remoto (`no`).

  Barcelona pasa de **2.439 a 2.438 filas**; el residual baja **302 → 294** y
  la carga real **505 → 497**. `sinteticas` queda en **16**,
  `evidencia-prestada` en **128**, `plantilla-cruzada` en **21** y `pendiente`
  en **17**. `sin-imagen` baja **1.369 → 1.368** por la fusión societaria; las
  dos imágenes renombradas siguen asociadas a sus productores reales.

- **Lote BCN-F2-f (2026-08-01, identidad provincial y canales de encargo).**
  Once fichas investigadas cierran **seis huecos de venta** y eliminan dos
  ubicaciones falsas. **Parc de les Olors de Sant Marçal** confirma a Brigitte
  Caralt, las más de 30 especies y las actividades concertadas; la tienda
  colectiva oficial de la red permite comprar elaborados y se registra como
  `sí|marketplace`. **Kin Pollastre / Kins Ous** actualiza correo y conserva la
  identidad de Cal Flequer; el mercado semanal municipal ofrece sus huevos y
  admite encargos al puesto por WhatsApp (`sí|whatsapp`).

  **Cal Pauet** completa móvil, gama y descripción de su ciclo cerrado de
  ovino, cereales antiguos, molino y obrador; su cuenta propia publica pedidos
  por correo (`sí|email`). **Molí d'Oli Lluch** pasa a la identidad vigente
  **Família Lluch – Molí i Celler**, sustituye el dominio averiado por su nueva
  web y tienda y amplía la ficha a aceite, vino y cava de cosecha propia
  (`sí|ecommerce`). **Torre Malla** elimina un horario corrupto y un Instagram
  inexistente, recupera el dominio correcto y documenta encargos por correo o
  teléfono con recogida en la masía (`sí|email|telefono`).

  **Melmelades del Bosc** no estaba en l'Estany ni en la casa de colonias que
  señalaba el mapa: se reconstruye con Núria Padrisa, dirección y contactos de
  Moià y pedidos por WhatsApp. **Les Tafaneres** tampoco estaba en Collbató;
  la antigua explotación de Sora figura ya en Viladamat y se traslada a Girona
  sin arrastrar dirección ni contactos viejos. **Ocata Fums** se purga como
  cerrado: la sentencia 299/2024 de la Audiencia Provincial documenta la
  insolvencia, el fin del suministro en 2018 y el fracaso del ahumadero.

  **Polleria Cristina** corrige nombre, categoría, puestos, contacto y gama,
  pero queda `parcial|no comprobado`: su certificado no es válido y el supuesto
  ecommerce sólo contiene productos demo en inglés de la plantilla instalada.
  **L'Anxoveta** se separa de la razón Villa Thalassa que contaminaba su nombre
  y slug; conserva su obrador, contactos y tienda propia activa como productor
  independiente (`verificado|sí|ecommerce`).
  **Nostramar** se identifica con Villa Thalassa SL y conserva el teléfono
  mercantil, pero pierde el PDF usado como web y el pin genérico del puerto;
  sin prueba actual de cultivo o venta permanece `parcial|no comprobado`.

  Barcelona pasa de **2.438 a 2.436 filas**; el residual baja **294 → 286** y
  la carga real **497 → 489**. `sinteticas` queda en **16**,
  `evidencia-prestada` en **128** y `pendiente` en **17**. `sin-imagen` baja
  **1.368 → 1.366** por las dos salidas. `plantilla-cruzada` sube **21 → 22**
  porque la gama mixta real de Cal Pauet activa el cruce de harina frente a su
  categoría principal de carne; es un falso positivo documentado.

- **Lote BCN-F2-g (2026-08-01, identidades rurales Cardedeu–Castellfollit).**
  Doce huecos de venta salen del residual, pero el resultado principal es la
  reparación del catálogo. **Gercasa SCP** era la razón productora de **Can
  Casamada** y **Montserrat Farré** la titular de **Granja La Roca**: se
  eliminan ambas fichas duplicadas y la segunda superviviente recupera nombre,
  dirección, teléfono, correo, huevos y caldos actuales. **Fruits Presas** deja
  de figurar como elaborador de conservas en un centro cultural de
  Castellbisbal; pasa a la explotación familiar de fruta y huerta de Abrera,
  con la imagen migrada al slug correcto. **Cigró-Ciuró** tampoco estaba en
  Castellcir: se reconstruye como producto de Mas Padrós, Collsuspina, con
  dirección, contactos y coordenadas institucionales.

  **Can Vilumara** sustituye la razón SAT en el nombre y slug públicos; su
  tienda ofrece lotes de ternera y cordero y encargos por WhatsApp y teléfono
  (`sí|ecommerce|whatsapp|telefono`). **Mas Maçaners** corrige nombre, masía,
  correo y raza avícola, y su producto comprable en MengemBages permite
  resolver `sí|marketplace`. **Granja La Roca** queda `sí|email|telefono` y
  **Cigró-Ciuró**, `sí|email|telefono`.

  En **Can Còdol**, **Can Torra**, **Ous de Maians**, **Cal Meler**, **Mateu
  Arnau Oliveras** y **Fruits Presas** se corrigen productos, identidades,
  contactos, direcciones o coordenadas y se documenta `no` tras revisar sus
  superficies públicas sin encontrar pedido remoto. Se mantiene techo
  `parcial` cuando la actividad actual sólo está respaldada indirectamente.
  **La Blanca del Montseny** es la única incertidumbre conservada: sólo aparece
  en el registro histórico de 2014, por lo que pierde dirección, teléfono,
  correo y mapa obsoletos y queda `pendiente|no comprobado` en vez de simular
  precisión.

  Barcelona pasa de **2.436 a 2.434 filas**; el residual baja **286 → 274** y
  la carga real **489 → 479**. `sinteticas` sube **16 → 17** y `pendiente` **17
  → 18** por la limpieza honesta de La Blanca; `evidencia-prestada` permanece
  en **128**. `plantilla-cruzada` sube **22 → 23** porque la gama real de Can
  Còdol combina ternera y mongeta bajo la categoría principal `Carne`.
  `sin-imagen` baja **1.366 → 1.364** al salir los dos duplicados sin activo;
  la imagen de Fruits Presas conserva continuidad con su nuevo slug.

- **Lote BCN-F2-h (2026-08-01, plantas trasladadas y separación de Gallecs).**
  Ocho huecos de venta se resuelven y la pasada corrige dos contaminaciones
  geográficas importantes. **Suquipa** ya no está en Castellterçol ni en la
  posterior sede de Castellcir: la web propia sitúa la planta actual en Sant
  Feliu de Codines. Se migran municipio y slug, se recuperan web y redes y se
  amplía la gama a verduras asadas y al vapor, cremas, Burgesanas, salsas y
  aliños. Su área de cliente aún se anuncia como próxima y los formularios son
  comerciales B2B/Horeca, no compra minorista (`no`).

  **L'Ou de Gallecs** tampoco se producía en Can Jornet: la explotación de
  Laura Blasco está en **Can Castellà**. La ficha recupera móvil, correo,
  hortalizas, legumbres y cereales y pierde las coordenadas prestadas de la
  otra masía. **Hereus de Can Jornet** queda separado con Santi Olivé, sus
  trigos antiguos, molino de piedra, legumbres, contacto y coordenadas propios;
  ambos venden de forma directa en Gallecs, sin mecanismo remoto actual
  (`no`).

  **La Botigueta de Mosqueroles** sustituye el nombre personal de Berta Cordomí
  y la categoría de conservas por su huerta y cestas de temporada; corrige
  teléfono, dirección e imagen y elimina un horario diario sin fuente. El
  mercado virtual citado en 2020 devuelve 404 y no hay tienda sucesora
  (`no`). **Joan Roselló** sigue en la campaña del guisante de 2026 y el mercado
  de Plaça de Cuba, pero la guía no le atribuye reparto ni pedido remoto.

  **Les Cases d'Argençola** y **Puigxoriguer** conservan sólo actividad,
  producto, dirección y coordenadas respaldados por los censos municipales de
  2026; se retiran teléfonos y correos personales que no reaparecen desde 2014.
  **Cafès Balanzó** recupera la marca vigente 1889 y enlaza la superficie a la
  que redirige su antiguo dominio, pero no se le adjudica el ecommerce de otras
  gamas de Cafés Candelas (`no`).

  Barcelona permanece en **2.434 filas**; el residual baja **274 → 266** y la
  carga real **479 → 470**. `evidencia-prestada` baja **128 → 127** porque
  Suquipa recupera su superficie propia; `sin-evidencia` baja **1.829 → 1.824**
  mediante decisiones nuevas, aunque sigue siendo una señal y no una cola.
  `sinteticas` queda en **17**, `plantilla-cruzada` en **23**, `pendiente` en
  **18** y `sin-imagen` en **1.364**; la imagen de la Botigueta conserva
  continuidad con el slug corregido.

- **Lote BCN-F2-i (2026-08-01, Gallifa y productores de Palou).** Cuatro
  huecos de venta salen del residual y las cuatro fichas ganan datos
  utilizables. **Granja Ferreria** deja de apuntar a una calle urbana y pierde
  un horario inventado: la federación avícola y la licencia municipal la
  sitúan en Les Ferreries, recuperan su correo y describen una explotación
  mixta de huevos de consumo, porcino y apicultura (`no`). La mezcla activa el
  detector cruzado de forma legítima, sin aumentar su recuento.

  **Agropecuària Can Mariné** también estaba anclada en el centro urbano de
  Granollers: el domicilio productivo vigente es Can Mariné, Palou. Se
  retiran ese pin, sus coordenadas y un correo no corroborado; se conservan el
  teléfono actual, los huevos y el porcino, con techo `parcial|no` porque no
  publica superficie propia ni pedido remoto.

  **SAT Can Pla** recupera la masía exacta, el móvil, el correo y su gama de
  mongeta del ganxet y legumbres estacionales. **SAT Palou** recupera nombre
  público, móvil, correo y garbanzos, y pierde otro pin urbano sin relación con
  la explotación. Las fichas actuales de comercio local invitan expresamente
  a encargar por correo, por lo que ambas pasan a `sí|email`; se mantiene
  `parcial` al no atribuirles una web propia que no tienen.

  Barcelona permanece en **2.434 filas**; el residual baja **266 → 262** y la
  carga real **470 → 467**. `sin-evidencia` baja **1.824 → 1.820** mediante
  las cuatro decisiones. `evidencia-prestada` queda en **127**, `sinteticas`
  en **17**, `plantilla-cruzada` en **23**, `pendiente` en **18** y
  `sin-imagen` en **1.364**.

- **Lote BCN-F2-j (2026-08-01, productores recientes y dominios caídos).**
  Se resuelven seis huecos con una reparación de identidad y una purga.
  **Apeuderoques – Peu de Roques** mezclaba la casa de retiros de Casa
  Torrades con una explotación alimentaria distinta. La ficha superviviente es
  **Peu de Roques**, en Casa Reixachs: huerta y aromáticas ecológicas, miel y
  Pèsol Negre, con su teléfono, correo e Instagram reales. Gastroteca mantiene
  además la tienda en línea (`sí|ecommerce`).

  **Casa de la Kombucha / Probio Drinks** sale del catálogo: la sociedad
  concluyó su concurso en 2024, el establecimiento de Tamarit figura cerrado,
  no queda superficie social operativa y el antiguo dominio sirve ahora un
  casino ajeno. **Gòtic Ferments** sigue identificable en su perfil social,
  pero su dominio y correo ya no resuelven; las fuentes describen distribución
  en cooperativas, tiendas y hostelería sin pedido remoto actual (`no`).

  **Granja Guirigall** recupera el móvil vigente, pierde un dominio caído y
  queda `sí|email|telefono` porque ofrece expresamente aves preparadas por
  encargo. **Mel Morató – Mel Mas Foradada** sube a `verificado`: su web ha
  vuelto a responder y confirma marcas, productos, dirección y contacto, pero
  sólo muestra catálogo y formulario general, mientras Gastroteca limita la
  compra al taller, comercio y mercado (`no`). **Cal Andreuet** recupera correo,
  Instagram y gama actual; la venta publicada es directa y en ferias, sin
  mecanismo remoto (`no`).

  Barcelona pasa de **2.434 a 2.433 filas**; el residual baja **262 → 256** y
  la carga real **467 → 462**. `sin-imagen` baja **1.364 → 1.363** con la
  purga y `sin-evidencia` **1.820 → 1.819**. `evidencia-prestada` queda en
  **127**, `sinteticas` en **17**, `plantilla-cruzada` en **23** y `pendiente`
  en **18**.

- **Lote BCN-F2-k (2026-08-01, comprobación transaccional de tiendas).**
  Cuatro huecos se resuelven después de probar producto, cesta y paso a caja,
  no sólo de detectar software de comercio. **Avenc del Garraf** vuelve a
  servir su tienda bajo `/public`: se actualizan la URL efectiva y seis vinos,
  y Flor d'Ametller permite elegir variante, añadir y avanzar a checkout.
  **Mas d'en Nogués** recupera teléfono y correo del obrador de Vilanova del
  Camí, amplía su gama real y ofrece treinta referencias; la prueba con nueces
  caramelizadas llega a cálculo de envío y caja.

  **Parc de les Olors (El Serrat)** corrige el teléfono de la sede central y
  concreta infusiones, aceites esenciales, hidrolatos, cosmética y miel. Su
  tienda propia permite comprar y calcular el envío. **Can Alemany** deja la
  categoría genérica y unas almendras no respaldadas: queda como productor de
  AOVE ecológico arbequina de cinco hectáreas de olivos centenarios, con tres
  formatos comprables y entrega a domicilio. Los cuatro pasan a
  `sí|ecommerce`.

  La misma pasada conserva correctamente como incertidumbre las falsas
  señales técnicas: Canals & Domingo sigue anunciando una tienda en obras,
  Exotic Sal está en mantenimiento, Farmbrots sólo deja comprable un producto
  de prueba ajeno a su gama, Bripau devuelve `Store unavailable`, Celler
  Sanmartí tiene cero productos y Formatges Cuirols publica referencias pero
  mantiene los pagos desactivados. Ninguno se fuerza a `sí` ni a `no`.

  Barcelona permanece en **2.433 filas**; el residual baja **256 → 252** y la
  carga real **462 → 458**. `sin-evidencia` baja **1.819 → 1.816**; las
  restantes señales quedan estables: `evidencia-prestada` **127**,
  `sinteticas` **17**, `plantilla-cruzada` **23**, `pendiente` **18** y
  `sin-imagen` **1.363**.

- **Lote BCN-F2-l (2026-08-01, sedes y catálogos vigentes).** **Sesmans
  Organic** deja de figurar en la antigua nave de Polinyà: la web oficial
  publica ahora sede, móvil y correo en Sabadell. Se corrigen municipio, slug,
  imagen, categoría y gama; se retiran el pin y las coordenadas antiguos. La
  tienda muestra precios, pero mantiene las compras desactivadas por
  mantenimiento, así que queda `parcial|no comprobado` en vez de aparentar una
  transacción disponible.

  **Finca La Font de Jui** recupera el teléfono y el correo vigentes y amplía
  su escaparate a Miratge, MIMAS, Ombres de tardor, Coll de Dama, A Delit y
  Mirant el futur. La propia web define el servicio como informativo y, tras
  revisar vinos y contacto, no publica precio, cesta ni pedido remoto: pasa a
  `no`. **Oli El Puig** deja la categoría genérica y una infusión no respaldada;
  queda como productor de AOVE ecológico arbequina, con dirección y correo
  oficiales. Sus canales remiten a distribuidores físicos y contacto general,
  sin mecanismo explícito de pedido, por lo que conserva `no comprobado`.

  Barcelona permanece en **2.433 filas**; el residual baja **252 → 251** y la
  carga real **458 → 457**. `sin-evidencia` baja **1.816 → 1.814**; las demás
  señales quedan estables: `evidencia-prestada` **127**, `sinteticas` **17**,
  `plantilla-cruzada` **23**, `pendiente` **18** y `sin-imagen` **1.363**.

- **Lote BCN-F2-m (2026-08-01, identidades de obrador).** **La Moianesa**
  deja de ser una falsa charcutería de jamón y fuet: es la fábrica familiar de
  pasta de Moià, activa desde 1880. Se reconstruyen categoría, gama, fábrica de
  Camí de Planella, teléfono, correo y redes; también se retiran la dirección,
  el pin y las coordenadas de otro comercio. Su web publica más de veinte
  formatos y una tienda física, pero no pedido remoto (`parcial|no`).

  **El Rebost del Maresme** tampoco era la identidad vigente: se corrige por
  **RADI**, fabricante B2B de preparados para postres, bases de salsa, adobos,
  caldos e ingredientes, con centro operativo y contactos actuales en
  Montornès del Vallès. Nombre, municipio, slug e imagen cambian con registro
  `merge`; la web es un catálogo profesional con contacto comercial, no una
  tienda (`parcial|no`). **Vinagres Masia Still** queda `no`: su página llamada
  tienda es en realidad una relación de distribuidores físicos, sin precio,
  cesta ni pedido remoto propio.

  Barcelona permanece en **2.433 filas**; el residual baja **251 → 248** y la
  carga real **457 → 454**. `sin-evidencia` baja **1.814 → 1.812**; las demás
  señales quedan estables: `evidencia-prestada` **127**, `sinteticas` **17**,
  `plantilla-cruzada` **23**, `pendiente` **18** y `sin-imagen` **1.363**.

- **Lote BCN-F2-n (2026-08-01, pedido directo y oferta alimentaria).**
  **Farina Pasta Fresca d'Autor** actualiza nombre, fundadores, móvil, correo y
  descripción del obrador del Mercat del Guinardó. Su web invita expresamente
  a pedir por teléfono o WhatsApp y ofrece entrega a domicilio, por lo que pasa
  a `sí|whatsapp|telefono`. **Granja La Bassola** concreta su carne de ternera
  y las hamburguesas artesanas Mas Burguer; acepta pedidos personalizados y
  vincula el contacto específico de producto con correo y teléfono
  (`sí|email|telefono`).

  **Mas Casablanca** recibe dirección y gama agrícola reales: huerta, huevos,
  carne y lácteos producidos en una explotación diversificada y usados en sus
  menús y actividades. La tienda web sólo vende cuentos y camisetas, no
  alimentos; la ficha productiva queda `parcial|no` sin convertir una compra de
  merchandising en venta alimentaria.

  Barcelona permanece en **2.433 filas**; el residual baja **248 → 245** y la
  carga real **454 → 451**. `sin-evidencia` baja **1.812 → 1.809**; las demás
  señales quedan estables: `evidencia-prestada` **127**, `sinteticas` **17**,
  `plantilla-cruzada` **23**, `pendiente` **18** y `sin-imagen` **1.363**.

- **Lote BCN-F2-o (2026-08-01, alcance y canales de venta).** **Pizza A
  Punt Vilanova** pasa a `verificado|sí|ecommerce`: su ficha oficial permite
  pedir y pagar en la web y delimita la zona de reparto. **Vilanova Casa de
  Menjars**, en cambio, sale del catálogo como `not-producer`: la web sólo
  acredita un restaurante con reservas y consumo en sala, no el supuesto
  obrador de platos preparados que afirmaba la fila heredada.

  **FAI Natur** deja la categoría genérica y un catálogo mezclado con
  productos no respaldados; queda como elaborador de infusiones con miel,
  infusiones a granel, chocolate y chai, con móvil oficial y `no` tras revisar
  todo el sitio sin encontrar precio, cesta o pedido. **Avícola Lleonart**
  pierde el pollo de corral falso y concreta huevos frescos y ovoproductos; su
  web está en construcción, por lo que mantiene prudentemente `no comprobado`.
  **Masia Escrigas** se reconstruye como finca de fruta y verdura: desde junio
  de 2026 su agrotienda permite recoger hortaliza del huerto y comprar huevos
  propios presencialmente (`no` para venta online).

  Barcelona queda en **2.432 filas**; el residual baja **245 → 241** y la
  carga real **451 → 447**. `sin-evidencia` baja **1.809 → 1.804**; las demás
  señales quedan estables: `evidencia-prestada` **127**, `sinteticas` **17**,
  `plantilla-cruzada` **23**, `pendiente` **18** y `sin-imagen` **1.363**.

- **Lote BCN-F2-p (2026-08-01, obradores mal ubicados y pedido directo).**
  **JR Pizzes** recupera la dirección, el teléfono y la web actuales de Moià,
  además de su gama real de pizzas, cocina catalana y pollos asados. La carta,
  los menús por encargo y el WhatsApp enlazado permiten resolverlo como
  `verificado|sí|whatsapp`. **Can Burguès** sustituye horta y aceite genéricos
  por su catálogo de avellana transformada en el obrador; el propio PDF publica
  precios, pedido por WhatsApp o correo y envío a domicilio
  (`sí|whatsapp|email`).

  Tres fichas estaban geográficamente mezcladas con comercios ajenos o puntos
  de venta. **Umami Croqueteria** pasa de Sabadell a su obrador real de Rubí,
  con dirección, móvil, dominio y gama vigentes; su WhatsApp sólo se presenta
  para información, por lo que conserva `no comprobado`. **Confitures La
  Codina** pasa de Sant Quirze a Castellar del Vallès, donde ya apuntaban sus
  coordenadas; actualiza productos, contacto y web y queda `verificado|no`.
  **Pastes La Forja** pasa de la tienda de Vilafranca al obrador de Barri Cuscó,
  Castellví de la Marca, con categoría, rellenos y contactos productivos
  reales; al no recuperar un canal oficial vigente, queda
  `parcial|no comprobado`. Los tres cambios de municipio dejan registro
  `merge` de sus slugs históricos.

  Barcelona permanece en **2.432 filas**; el residual baja **241 → 238** y la
  carga real **447 → 444**. `sin-evidencia` baja **1.804 → 1.799**; las demás
  señales quedan estables: `evidencia-prestada` **127**, `sinteticas` **17**,
  `plantilla-cruzada` **23**, `pendiente` **18** y `sin-imagen` **1.363**.

- **Lote BCN-F2-q (2026-08-01, dominios sustituidos y cesta semanal).**
  **Mas Sales (Projecte Geosmina)** deja la plantilla vacía y recupera la finca
  real de Terrassa, su agricultura regenerativa, la agrotienda y los contactos.
  La página invita expresamente a reservar la cesta de temporada por WhatsApp
  y fija las franjas de recogida (`verificado|sí|whatsapp`). **Biosanare**
  amplía su ficha desde tres genéricos a conservas, encurtidos, aceitunas,
  semillas, tomate seco, patés, aceite y vinagre, corrige el teléfono de fábrica
  y pasa a `no`: el sitio corporativo completo sólo ofrece catálogo y contacto
  profesional.

  **Brèscat** deja de enlazar a un dominio que ahora redirige a Ecocolmena; el
  directorio comarcal vigente permite actualizar titulares, finca, móvil y gama
  de miel, polen y própolis, pero no cerrar su venta remota. **Les Herbes de Can
  Riera** pierde la falsa gama de plantas ornamentales y queda como vivero
  ecológico de aromáticas, medicinales, culinarias y flores comestibles. Su
  dominio tampoco resuelve: se retira y la ficha baja prudentemente a
  `parcial|no comprobado`.

  Barcelona permanece en **2.432 filas**; el residual baja **238 → 236** y la
  carga real **444 → 442**. `sin-evidencia` baja **1.799 → 1.795**; las demás
  señales quedan estables: `evidencia-prestada` **127**, `sinteticas` **17**,
  `plantilla-cruzada` **23**, `pendiente` **18** y `sin-imagen` **1.363**.

- **Lote BCN-R1-a (2026-07-28, carril R1).** Alcance: las 6 filas de
  `check:defects --check sinteticas`. Ninguna era sintética: las 6 son reales y con fuente
  local concreta, solo que nunca se les recogió contacto. Resueltas 2 (Jaume Roger Garriga,
  del llistat de productors de l'ajuntament de Bigues i Riells; Apiaria Vinya i Celler, de la
  fitxa de catalunya.com). Las 4 restantes quedan con techo documentado en evidencia, salvo
  Garduixeres. Dos avisos que valen más que la fila:
  - `garduixeres-olost` tiene **duda de alcance abierta**: las fuentes lo describen como *mas
    que ordeña ~50 frisonas y suministra leche* a elaboradores, no como vendedor de queso
    propio. Sin fuente que le dé `identity` como productor no se le escribe evidencia. Y
    **no encruzarlo con Formatges Reixagó**: es otra granja de Olost (Ignasi y Cristina Majó,
    finca de 44 ha, formatgeria propia desde 2011) que sí tiene web viva.
  - Tres `Venta online=no` heredados del volcado sin ninguna fuente (Garduixeres, Griselda
    Planas, Can Reinal) bajan a `no comprobado`. Sube `venta-sin-resolver` en 3: es
    visibilidad nueva, no una regresión.
- Recomprobar los `Venta online=sí` (última pasada masiva 2026-06-22; la ampliación de julio
  revisó los suyos) y vigilar los 773 `parcial` de registro.
- Candidatos DAR no integrados: movidos a `docs/candidates/barcelona.md` § «Herencia del ledger
  de verificación» — deduplicar contra el CSV antes de usar.
- Imágenes: ~250 candidatas inspeccionables pendientes de triaje manual.
