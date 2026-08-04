# Verificación provincial de Toledo

Ledger para reanudar la primera revisión profunda de
`data/csv/castilla-la-mancha/toledo.csv`. El CSV es la fuente de verdad y cada
decisión se registra en `data/evidence/castilla-la-mancha/toledo.jsonl`.

Procedimiento en `docs/VERIFICATION_TECHNIQUES.md`; contratos en
`docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md` y
`docs/EDITORIAL_POLICY.md`. Este fichero solo conserva el corte provincial, la
cola de lotes y las excepciones que evitan repetir investigación.

## Estado inicial

- Inicio: **2026-07-25**.
- Snapshot: **172 filas**; 17 `verificado`, 9 `parcial` y **146 `pendiente`**.
- La evidencia preexistente cubría 32 decisiones procedentes de integraciones
  DOP Montes de Toledo y DOP Queso Manchego; no cubría la pasada provincial.
- La cola se concentra en **Bodega (82)** y **Lácteos y quesos (29)**.
- El ledger de candidatos documenta altas antiguas, no es la worklist de esta
  pasada.

## Estado de la pasada

- **TOL-01 · Lácteos iniciales — cerrado 2026-07-25.** 7 `verificado`, 1
  `parcial`; ecommerce 4, venta `no` 3. Fuentevieja queda parcial porque la web
  responde de forma intermitente y no permite comprobar su página de compra.
- **TOL-02 · Lácteos con web propia — cerrado 2026-07-25.** 5 `verificado`, 2
  `parcial`; ecommerce 5. Quesos de Hualdo queda parcial por certificado TLS
  caducado; Peñas Negras por dominio propio inaccesible.
- Corte tras TOL-02: **172 filas**; 29 `verificado`, 12 `parcial` y **131
  `pendiente`**.
- **TOL-03 · Lácteos registrales — cerrado 2026-07-25.** 10 `verificado` y 2
  `parcial`. Se corrigen dos identidades territoriales: Quesos Lominchar pasa
  de Toledo a Corral de Almaguer y Quesos Umbría del Madroñal de Toledo a
  Sonseca; ambos cambios conservan tombstone `merge`.
- **TOL-04–TOL-15 — cerrados 2026-07-25.** Barrido de 119 fuentes: 99
  respondieron, pero solo 48 filas contaban con fuente propia viva suficiente
  para `verificado`; 71 quedan en `parcial` por directorio, listado regulador,
  vínculo corporativo no específico, error TLS, timeout o dominio caído.
  `Venta online` permanece `no comprobado` cuando no se verificó un flujo de
  compra o pedido remoto.
- **Cierre provincial: 172 filas; 88 `verificado`, 84 `parcial` y 0
  `pendiente`.**
- **TOL-W3-01 · venta sin resolver — cerrado 2026-07-31.** 15 filas
  reeditadas: 10 pasan a venta `sí` (8 `ecommerce`, 1 `marketplace` y 1 por
  `email|telefono`), 2 a `no` y 3 conservan `no comprobado` por bloqueo real.
  Se corrige la identidad cruzada `Obrador Uría` → `Masamadre` en Fuensalida y
  el dominio aparcado de Montenoble por su web propia vigente.
- **TOL-W3-02 · venta sin resolver — cerrado 2026-07-31.** 16 filas
  reeditadas: 10 pasan a venta `sí` (9 `ecommerce` y 1 por `email`), 2 a `no`
  y 4 conservan `no comprobado` por un impedimento observado. Se incorporan
  las migraciones De Hualdo y Latúe, la tienda actual de Peñas Negras y webs,
  contactos, ubicaciones, productos y descripciones más precisos.
- **TOL-W3-03 · venta sin resolver + descripción genérica — cerrado
  2026-07-31.** 15 filas reeditadas: 4 pasan a venta `sí` por `ecommerce`, 9
  a `no` tras revisar sus canales actuales y 2 conservan `no comprobado` por
  fallos técnicos reproducibles. Las 15 pierden la descripción plantilla; se
  corrigen productos, direcciones, contactos y 14 webs prestadas, obsoletas o
  rotas.
- **TOL-W3-04 · venta sin resolver + saneamiento de identidad — cerrado
  2026-07-31.** Las 15 filas heredadas salen de `venta-sin-resolver`: 7 se
  reeditan con venta `no`, 5 se purgan y 3 se fusionan. Artero pasa a ser una
  gama de Bodegas Muñoz; La Defensa y El Remedio se consolidan en la nueva
  fila verificada de Bodegas La Estación. Toledo queda en **165 filas** y sus
  colas bajan de 73 a **58** ventas sin resolver, de 39 a **24** descripciones
  genéricas y de 34 a **22** webs de tercero. La cola global de Ola 3 pasa de
  3.265 a **3.250 de 4.544**; van 1.294 resueltas (28,5 %).
- **TOL-W3-05 · venta sin resolver + depuración de fichas vinícolas — cerrado
  2026-07-31.** 15 filas reeditadas: 4 pasan a venta `sí` por `ecommerce`, 9
  a `no` y 2 conservan `no comprobado` por webs técnicamente inaccesibles o
  falta de un canal actual suficiente. Se sustituyen las 15 descripciones
  plantilla, se retiran 15 enlaces prestados de Apoloybaco y se corrigen
  denominaciones, marcas, domicilios, teléfonos y correos con fuentes
  actuales. Toledo queda con **45** ventas sin resolver, **9** descripciones
  genéricas y **7** webs de tercero. La cola global de Ola 3 baja a **3.237 de
  4.544**; van 1.307 resueltas (28,8 %).
- **TOL-W3-06 · cierre de defectos solapados — cerrado 2026-07-31.** 12 filas
  reeditadas: 3 pasan a venta `sí` por `ecommerce`, 4 a `no` y 5 conservan
  `no comprobado` porque las fuentes no permiten atribuir un canal actual. Se
  eliminan las **9** descripciones genéricas y las **7** webs prestadas que
  quedaban en Toledo. La identidad histórica `Raquel Cuéllar Rama ·
  Arcicóllar` se corrige a `La Bruja Lechera · Camarena`, con tombstone
  `merge`. Toledo queda con **38** ventas sin resolver y sin defectos de
  descripción genérica ni web de tercero. La cola global de Ola 3 baja a
  **3.230 de 4.544**; van 1.314 resueltas (28,9 %).

## Cola congelada

No se renumera si una fila se purga o fusiona.

### TOL-03 · Lácteos registrales (12) — cerrado 2026-07-25

`lacteos-ocana-ocana`, `quesos-cristo-del-prado-madridejos`,
`quesos-fuente-albeitar-martin-segovia-sofia-almonacid`,
`agropecuaria-dehesa-ardales-s-l-toledo`,
`cerrucos-de-kanama-los-navalucillos`, `el-buen-pastor-de-oropesa-oropesa`,
`esperanza-del-castillo-s-l-pulgar`,
`quesos-la-mueda-santa-cruz-de-la-zarza`, `quesos-lominchar-s-l-toledo`,
`quesos-navalmoral-s-a-totanes`,
`quesos-rosario-castano-s-l-herreruela-de-oropesa`,
`quesos-umbria-del-madronal-toledo`.

### TOL-04 · Lácteos residuales (2) — cerrado 2026-07-25

`raquel-cuellar-rama-arcicollar` → `la-bruja-lechera-camarena`,
`s-a-t-estrada-castano-herreruela-de-oropesa`.

### TOL-05 · Aceite (9) — cerrado 2026-07-25

`casas-de-hualdo-el-carpio-de-tajo`,
`aceites-garcia-de-la-cruz-madridejos`, `aceites-de-mora-mora`,
`mora-industrial-morainsa-mora`, `cooperativa-ntra-sra-de-la-antigua-mora`,
`almazara-villa-de-orgaz-orgaz`, `zarfe-hontanar`, `oleotoledo-toledo`,
`la-pontezuela-los-navalmorales`.

### TOL-06 · Pan, pastelería y chocolate (11) — cerrado 2026-07-25

`obrador-santo-tome-toledo`, `san-telesforo-toledo`,
`mazapanes-peces-consuegra`, `pasteleria-plaza-mayor-ocana`,
`pasteleria-gito-la-puebla-de-montalban`, `panaderia-manzano-toledo`,
`el-obrador-del-abuelo-toledo`, `pan-para-pepe-toledo`,
`masamadre-fuensalida`, `xocolalla-santa-olalla`,
`delaviuda-alimentacion-sonseca`.

### TOL-07 · Cerveza, miel, azafrán y legumbres (12) — cerrado 2026-07-25

`cerveza-la-sagra-numancia-de-la-sagra`, `cervezas-speranto-toledo`,
`cervezas-domus-toledo`, `la-balluca-cerveza-artesana-toledo`,
`miel-castiza-toledo`, `apicola-el-nebrillo-los-navalmorales`,
`miel-mieleko-menasalbas`, `miel-de-melque-san-martin-de-montalban`,
`zaffralia-madridejos`, `azafran-1994-madridejos`,
`riet-vell-legumbres-ecologicas-villacanas`,
`legumbres-selectas-la-posada-cabanas-de-la-sagra`.

### TOL-08 · Charcutería (3) — cerrado 2026-07-25

`industrias-carnicas-tello-totanes`,
`embutidos-y-jamones-espana-e-hijos-escalonilla`,
`embutidos-alia-escalonilla`.

### TOL-09 · Bodega Méntrida oeste (12) — cerrado 2026-07-25

`alonso-cuesta-la-torre-de-esteban-hambran`, `arrayan-santa-cruz-del-retamar`,
`bodegas-y-vinedos-gonzalez-camarena`, `bodegas-canopy-camarena`,
`condes-de-fuensalida-fuensalida`,
`bodegas-hibeu-la-torre-de-esteban-hambran`, `lopez-campos-valmojado`,
`cooperativa-ntra-sra-de-la-natividad-mentrida`,
`cooperativa-san-roque-escalona`,
`cooperativa-santo-domingo-de-guzman-valmojado`,
`bodegas-tavera-arcicollar`, `uva-de-vida-santa-olalla`.

### TOL-10 · Bodega Méntrida centro (12) — cerrado 2026-07-25

`vinicola-delgado-la-torre-de-esteban-hambran`, `vinedos-de-camarena-camarena`,
`viticola-mentridana-mentrida`, `bodegas-atalaque-fuensalida`,
`hacienda-villarta-escalona`, `bodegas-jimenez-landi-mentrida`,
`bodegas-carmena-carmena`, `cooperativa-san-miguel-arcangel-montearagon`,
`cooperativa-ntra-sra-de-gracia-casarrubios-del-monte`,
`finca-traspinedo-los-cerralbos`, `finca-constancia-otero`,
`bodegas-la-cerca-casarrubios-del-monte`.

### TOL-11 · Bodega Consuegra y Madridejos (12) — cerrado 2026-07-25

`tavasa-casarrubios-del-monte`,
`cooperativa-virgen-de-la-oliva-almonacid-de-toledo`,
`cecilio-mingo-herrero-cabezamesada`, `cooperativa-la-fe-camunas`,
`sociedad-cooperativa-la-centinela-consuegra`,
`cooperativa-vinicola-de-consuegra-consuegra`,
`cooperativa-san-isidro-labrador-consuegra-consuegra`,
`cooperativa-castillo-de-consuegra-consuegra`,
`bodegas-barreda-corral-de-almaguer`,
`cooperativa-cristo-de-la-agonia-dosbarrios`,
`cooperativa-san-isidro-huerta-huerta-de-valdecarabanos`,
`bodegas-bogarve-1915-madridejos`.

### TOL-12 · Bodega Noblejas y La Mancha (12) — cerrado 2026-07-25

`bodegas-munoz-noblejas`, `bodegas-montenoble-noblejas`,
`bodegas-salvador-alonso-noblejas`, `bodegas-torrique-noblejas`,
`granduc-winery-noblejas`, `vinos-isidro-diaz-reganon-noblejas`,
`bodega-artero-noblejas`, `felix-solis-la-puebla-la-puebla-de-almoradiel`,
`cooperativa-virgen-de-palomares-la-puebla-de-almoradiel`,
`bodegas-entremontes-quintanar-de-la-orden`,
`bodegas-leganza-quintanar-de-la-orden`,
`sociedad-cooperativa-el-remedio-santa-cruz-de-la-zarza`.

### TOL-13 · Bodega Sonseca y Don Fadrique (12) — cerrado 2026-07-25

`cooperativa-la-defensa-santa-cruz-de-la-zarza`,
`cooperativa-ntra-sra-de-los-remedios-sonseca`,
`cooperativa-la-humildad-el-toboso`,
`cooperativa-ntra-sra-del-rosario-turleque`,
`cooperativa-cristo-de-la-vera-cruz-urda`,
`monte-la-villa-la-villa-de-don-fadrique`,
`s-a-t-don-fadrique-la-villa-de-don-fadrique`,
`bodegas-j-santos-la-villa-de-don-fadrique`,
`cooperativa-san-isidro-labrador-don-fadrique-la-villa-de-don-fadrique`,
`estancia-lacal-la-villa-de-don-fadrique`, `vihucas-villacanas`,
`bodegas-guillermo-villacanas`.

### TOL-14 · Bodega Villacañas y Villanueva (12) — cerrado 2026-07-25

`cooperativa-angel-del-alcazar-villacanas`,
`cooperativa-san-antonio-abad-villacanas-villacanas`,
`vinedos-mejorantes-villacanas`,
`cooperativa-cristo-de-santa-ana-villafranca-de-los-caballeros`,
`bodegas-casagrande-villamuelas`,
`bodegas-verduguez-villanueva-de-alcardete`,
`cuevas-santoyo-villanueva-de-alcardete`,
`bodegas-alcardet-villanueva-de-alcardete`,
`bodegas-latue-villanueva-de-alcardete`,
`cooperativa-ntra-sra-de-castellar-villarrubia-de-santiago`,
`bodegas-hermanos-rubio-villasequilla`,
`cooperativa-san-isidro-villasequilla-villasequilla`.

### TOL-15 · Bodega residual (10) — cerrado 2026-07-25

`bodegas-del-muni-villatobas`,
`cooperativa-ntra-sra-de-la-asuncion-villatobas`,
`bodegas-garron-los-yebenes`, `casa-del-valle-yepes`,
`cooperativa-del-campo-yepes-yepes`,
`cooperativa-del-campo-de-yebenes-los-yebenes`, `finca-loranque-bargas`,
`bodegas-mas-que-vinos-cabanas-de-yepes`,
`marques-de-grinon-dominio-de-valdepusa-malpica-de-tajo`,
`bodegas-martue-pago-campo-de-la-guardia-la-guardia`.

### TOL-W3-01 · Venta sin resolver (15) — cerrado 2026-07-31

`cooperativa-ntra-sra-de-la-antigua-mora`,
`almazara-villa-de-orgaz-orgaz`,
`cerveza-la-sagra-numancia-de-la-sagra`,
`alonso-cuesta-la-torre-de-esteban-hambran`, `lopez-campos-valmojado`,
`bodegas-barreda-corral-de-almaguer`, `bodegas-montenoble-noblejas`,
`cuevas-santoyo-villanueva-de-alcardete`,
`bodegas-alcardet-villanueva-de-alcardete`, `xocolalla-santa-olalla`,
`panaderia-manzano-toledo`, `masamadre-fuensalida`,
`finca-loranque-bargas`, `bodegas-mas-que-vinos-cabanas-de-yepes`,
`bodegas-martue-pago-campo-de-la-guardia-la-guardia`.

### TOL-W3-02 · Venta sin resolver (16) — cerrado 2026-07-31

`quesos-de-hualdo-el-carpio-de-tajo`,
`casas-de-hualdo-el-carpio-de-tajo`, `la-pontezuela-los-navalmorales`,
`riet-vell-legumbres-ecologicas-villacanas`, `finca-constancia-otero`,
`felix-solis-la-puebla-la-puebla-de-almoradiel`,
`bodegas-leganza-quintanar-de-la-orden`,
`bodegas-latue-villanueva-de-alcardete`,
`bodegas-verduguez-villanueva-de-alcardete`,
`industrias-carnicas-tello-totanes`, `delaviuda-alimentacion-sonseca`,
`aceites-umbrion-madridejos`, `quesos-perez-arquero-ocana`,
`quesos-reino-madridejos`, `cotoal-el-carpio-de-tajo`,
`artesanos-penas-negras-de-mora-mora`.

### TOL-W3-03 · Venta sin resolver + descripción genérica (15) — cerrado 2026-07-31

`bodegas-y-vinedos-gonzalez-camarena`,
`bodegas-hibeu-la-torre-de-esteban-hambran`,
`cooperativa-san-roque-escalona`,
`cooperativa-santo-domingo-de-guzman-valmojado`,
`vinicola-delgado-la-torre-de-esteban-hambran`,
`viticola-mentridana-mentrida`, `bodegas-atalaque-fuensalida`,
`cooperativa-san-miguel-arcangel-montearagon`,
`cooperativa-ntra-sra-de-gracia-casarrubios-del-monte`,
`finca-traspinedo-los-cerralbos`,
`bodegas-la-cerca-casarrubios-del-monte`,
`cooperativa-virgen-de-la-oliva-almonacid-de-toledo`,
`cecilio-mingo-herrero-cabezamesada`, `cooperativa-la-fe-camunas`,
`sociedad-cooperativa-la-centinela-consuegra`.

### TOL-W3-04 · Venta sin resolver + saneamiento de identidad (15) — cerrado 2026-07-31

`cooperativa-vinicola-de-consuegra-consuegra`,
`cooperativa-san-isidro-labrador-consuegra-consuegra`,
`cooperativa-castillo-de-consuegra-consuegra`,
`cooperativa-cristo-de-la-agonia-dosbarrios`,
`cooperativa-san-isidro-huerta-huerta-de-valdecarabanos`,
`bodegas-salvador-alonso-noblejas`, `bodegas-torrique-noblejas`,
`granduc-winery-noblejas`, `vinos-isidro-diaz-reganon-noblejas`,
`bodega-artero-noblejas`,
`cooperativa-virgen-de-palomares-la-puebla-de-almoradiel`,
`sociedad-cooperativa-el-remedio-santa-cruz-de-la-zarza`,
`cooperativa-la-defensa-santa-cruz-de-la-zarza`,
`cooperativa-ntra-sra-de-los-remedios-sonseca`,
`cooperativa-la-humildad-el-toboso`.

Resultado editorial: se purgan Cristo de la Agonía, San Isidro Huerta y
Virgen de Palomares como filas sintéticas; Granduc Winery y la identidad
Torrique/Cacharel por extinción documentada. Artero se fusiona con Bodegas
Muñoz. La Defensa y El Remedio se fusionan en
`bodegas-la-estacion-santa-cruz-de-la-zarza`, la unidad productiva vigente
desde 2010. Las siete filas supervivientes incorporan, según disponibilidad,
marcas reales, historia, tamaño, dirección, horario, teléfono, correo y web
propia; desaparecen las 15 descripciones plantilla del lote.

### TOL-W3-05 · Venta sin resolver + depuración de fichas vinícolas (15) — cerrado 2026-07-31

`cooperativa-ntra-sra-del-rosario-turleque`,
`cooperativa-cristo-de-la-vera-cruz-urda`,
`monte-la-villa-la-villa-de-don-fadrique`,
`s-a-t-don-fadrique-la-villa-de-don-fadrique`,
`bodegas-j-santos-la-villa-de-don-fadrique`,
`cooperativa-san-isidro-labrador-don-fadrique-la-villa-de-don-fadrique`,
`estancia-lacal-la-villa-de-don-fadrique`, `bodegas-guillermo-villacanas`,
`cooperativa-angel-del-alcazar-villacanas`,
`cooperativa-san-antonio-abad-villacanas-villacanas`,
`cooperativa-cristo-de-santa-ana-villafranca-de-los-caballeros`,
`bodegas-casagrande-villamuelas`,
`cooperativa-ntra-sra-de-castellar-villarrubia-de-santiago`,
`bodegas-hermanos-rubio-villasequilla`,
`cooperativa-san-isidro-villasequilla-villasequilla`.

Resultado editorial: J. Santos, Ángel del Alcázar, San Antonio Abad y Cristo
de Santa Ana incorporan tiendas propias operativas y quedan verificadas con
canal `ecommerce`; S.A.T. Don Fadrique queda verificada sin pedido remoto.
Hermanos Rubio conserva `parcial` porque su dominio expiró, aunque el consejo
regulador y Maps sostienen la actividad y permiten resolver la venta. Las
cooperativas y bodegas sostenidas solo por fuentes
regulatorias o registrales conservan `parcial`. Estancia Lacal queda abierta
por falta de una fuente actual concluyente y Bodegas Guillermo por un HTTP 500
en su dominio propio; ninguna avería se fuerza a venta `no`.

### TOL-W3-06 · Cierre de defectos solapados (12) — cerrado 2026-07-31

`bodegas-del-muni-villatobas`,
`cooperativa-ntra-sra-de-la-asuncion-villatobas`,
`cooperativa-del-campo-yepes-yepes`,
`cooperativa-del-campo-de-yebenes-los-yebenes`, `vihucas-villacanas`,
`vinedos-mejorantes-villacanas`, `bodegas-garron-los-yebenes`,
`casa-del-valle-yepes`, `embutidos-alia-escalonilla`,
`asociacion-ganadera-palomares-s-a-t-la-puebla-de-almoradiel`,
`la-bruja-lechera-camarena`,
`s-a-t-estrada-castano-herreruela-de-oropesa`.

Resultado editorial: Bodegas del Muni, Casa del Valle y Estrada Castaño
incorporan sus tiendas propias operativas, catálogos y datos productivos y
quedan verificadas con `ecommerce`. Vihucas y tres cooperativas pasan a venta
`no` después de revisar sus canales; Vihucas conserva `parcial` por el TLS
roto y la antigüedad visible de su web HTTP. Mejorantes, Garrón, Embutidos
Alia, Palomares y La Bruja Lechera mantienen `no comprobado` por ausencia de
un canal atribuible o evidencia actual concluyente, no por mera falta de
búsqueda. Las doce fichas reciben descripciones y productos específicos; se
retiran dominios muertos, páginas de proveedor y enlaces prestados. La
identidad personal `raquel-cuellar-rama-arcicollar` se fusiona con la ficha
empresarial y territorial correcta `la-bruja-lechera-camarena`.

## Excepciones activas

- `parcial` es cierre válido: no se reabre Fuentevieja sin una fuente propia
  nuevamente accesible.
- Los registros de queso y vino prueban identidad/localización, pero sin fuente
  verificadora viva topan en `parcial`.
- Montenoble conserva `no comprobado`: la web propia nueva muestra catálogo,
  precios y condiciones, pero las fichas revisadas no ofrecen control de
  compra. Cuevas Santoyo también queda abierto porque su antigua tienda
  redirige al portal genérico del proveedor.
- Latúe conserva `no comprobado`: la tienda publica catálogo y precios, pero la
  plantilla oculta los controles de compra. COTOAL mantiene expresamente su
  tienda en mantenimiento temporal.
- Verduguez queda `parcial` y sin web: el dominio sirve una página de proveedor
  incompatible, mientras las fuentes públicas solo apoyan identidad y
  actividad. Quesos Reino sigue `parcial` sin evidencia reciente de pedido
  remoto.
- Bodegas y Viñedos González conserva `no comprobado`: `vinobispo.com` usa un
  certificado autofirmado y, al sortearlo, devuelve una página de error del
  administrador. Bodegas Hibeu también queda abierta porque su dominio propio
  responde HTTP 500 con un error crítico de WordPress.
