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
