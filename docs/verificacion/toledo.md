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

`raquel-cuellar-rama-arcicollar`,
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
`obrador-uria-fuensalida`, `xocolalla-santa-olalla`,
`delaviuda-alimentacion-sonseca`.

### TOL-07 · Cerveza, miel, azafrán y legumbres (12) — cerrado 2026-07-25

`cerveza-la-sagra-numancia-de-la-sagra`, `cervezas-speranto-toledo`,
`cervezas-domus-toledo`, `la-balluca-cerveza-artesana-toledo`,
`miel-castiza-toledo`, `apicola-el-nebrillo-los-navalmorales`,
`miel-mieleko-menasalbas`, `miel-de-melque-san-martin-de-montalban`,
`zaffralia-madridejos`, `la-rosera-camunas`,
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
`bodegas-tavera-arcicollar`, `uva-de-vida-camarena`.

### TOL-10 · Bodega Méntrida centro (12) — cerrado 2026-07-25

`vinicola-delgado-la-torre-de-esteban-hambran`, `vinedos-de-camarena-camarena`,
`viticola-mentridana-mentrida`, `bodegas-atalaque-fuensalida`,
`hacienda-villarta-escalona`, `bodegas-jimenez-landi-mentrida`,
`bodegas-carmena-carmena`, `cooperativa-san-miguel-arcangel-montearagon`,
`cooperativa-ntra-sra-de-gracia-casarrubios-del-monte`,
`finca-traspinedo-los-cerralbos`, `finca-constancia-otero`,
`bodegas-la-cerca-casarrubios-del-monte`.

### TOL-11 · Bodega Consuegra y Madridejos (12) — cerrado 2026-07-25

`bodegas-tavasa-casarrubios-del-monte`,
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

## Excepciones activas

- `parcial` es cierre válido: no se reabre Fuentevieja, Quesos de Hualdo o
  Peñas Negras sin una fuente propia nuevamente accesible.
- Los registros de queso y vino prueban identidad/localización, pero sin fuente
  verificadora viva topan en `parcial`.
- La auditoría de calidad conserva 78 avisos preexistentes por la descripción
  genérica compartida de las bodegas. Es trabajo de enriquecimiento editorial,
  no una decisión pendiente de identidad o estado.
