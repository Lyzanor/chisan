# Castellón · verificación — snapshot de mantenimiento

Primera pasada profunda **cerrada el 2026-06-29** (lotes 1-11; commit de cierre `81c7495`). Detalle
por lote en `git log --follow -p -- docs/verificacion/castellon.md`; procedencia por fila en
`data/evidence/comunitat-valenciana/castellon.jsonl`. La verdad es el CSV; cerrar la pasada no
cierra el catálogo y las afirmaciones dinámicas caducan.

## Estado final de la pasada (2026-06-29)

- Filas: **150** (161 iniciales; 1 fusión + 10 purgas) · verificado **137** · parcial **13** ·
  pendiente **0**.
- `Venta online`: **67 `sí` (67/67 con canal) · 7 `no` · 76 `no comprobado`**. El punto de partida
  (84 `sí`/75 `no`/2 nc, 0 canales) delataba relleno heurístico y se reauditó en ambas direcciones.
- Evidencia: 161 registros (150 `keep` + 1 `merge` + 10 `purge`); **en `coverage.json`**.

## Residuales justificados (13 `parcial`)

Techo por solo directorio/registro o duda material: **Almazara Baix Maestrat**, **Coop de
Vilafamés**, **Castillo de la Duquesa**, **Cereza Simó**, **Turrones San Luis**, 4 cerveceras con
duda de actividad, **Carn Natural** (coop), **Carnicería Català** (sin web propia tras limpiar
enlaces ajenos), **Cítricos Natanael Bort**, **Mel Mas de l'Argila**.

## Reglas locales (no revertir sin nueva evidencia)

- Fusión firme: **Ildum Vinarius** → `bellmunt-oliver-viticultors-cabanes`.
- Purgas firmes: **Carnes Frescas SA** (mayorista B2B), **Alcachofa de Benicarló** (era el Consejo
  Regulador de la DOP, no un productor), **5 cofradías de pescadores** (San Telmo de Benicarló…),
  **Tòfona de Vistabella** (negocio no identificable), y por provincia **Miel Mayem** (envasado en
  L'Alcúdia → Valencia) y **Farré Vidal** (trufa de Lleida).
- NO fusionar: **Lo Canetà / Roca Sola** comparten teléfono porque son dos marcas de la misma
  familia (aceite vs cerezas, Canet lo Roig). Coordenadas repetidas (Morella, Albocàsser, Artana,
  Canet lo Roig) son centroides compartidos, no duplicados.
- Recategorizaciones hechas: Papas Maribel→Snacks · Rafinade→Bebidas · Frusema y Coop
  Benasalense→Frutos secos · Hidromiel La Vikinga→Hidromiel.
- **Bilingüismo valencià/castellano**: al deduplicar y casar entidad, normalizar acentos **y**
  variante lingüística (Castelló/Castellón, Vinaròs…); dos grafías ≠ dos entidades.
- Homónimos: `Cabanes` existe en Castellón y Girona (override por comunidad si hace falta).
- «Langostino de Vinaròs» = marca colectiva, no productor. Cofradía/lonja/pescadería ≠ conservera.
- Webs de celler bloquean WebFetch (age-gate/Cloudflare/TLS): buscar tienda en dominio/subdominio
  de marca aparte antes de cerrar venta.

## Fuentes locales y límites

- **Castelló Ruta de Sabor** (Diputació): directorio de descubrimiento y cotejo.
- Consells: DOP Aceite de la C.V., **Territori Sénia** (oli millenari), DO Castelló, DOP Carxofa de
  Benicarló, IGP Cítrics Valencians. Apoyan pertenencia/existencia, no actividad ni venta.
- **CAECV** (operadores ecológicos valencianos).

## Para otros agentes (cross-provincia)

- Valencia: **Miel Mayem** (L'Alcúdia) purgada de aquí; candidata real para `valencia.csv`.
- Lleida: **Farré Vidal / comprartrufa.shop** (Les Garrigues) purgada de aquí; candidata para
  `lleida.csv`.

## Mantenimiento (al retomar)

- Recomprobar los 67 `Venta online=sí` (última comprobación 2026-06-29) y los 76 `no comprobado`
  (los `no` de aguas B2B del lote 3 son estables).
- Vigilar las 4 cerveceras `parcial` por señales de cierre.
- La pasada no añadió candidatos; expansión → `docs/candidates/`.

## Mantenimiento · ola 3 de venta online (2026-07-29)

- Revisadas las **76** filas que seguían en `Venta online=no comprobado`: el
  saldo queda en **73 `sí` · 7 `no` · 70 `no comprobado`**.
- Se confirmaron seis mecanismos actuales: ecommerce de **Licores Artesanos de
  Burriana**, **Mieles La Alquería**, **Cafés Balancilla**, **La Planeta** y
  **Patatas Geysel**, más pedidos por WhatsApp de **Panadería Mónica**.
- La pasada mejoró **50 fichas**, no solo su decisión de venta: 30 descripciones
  de plantilla se sustituyeron por texto específico, 26 horarios dejaron de
  remitir a una web ausente y se corrigieron ocho URLs. Entre estas últimas,
  **Cafés B+o** pasa a su tienda activa `cafesbo-online.com`, **Miel Sierra
  Espadán** a HTTPS y **Molí la Barona** al dominio `.com`; se retiraron tres
  dominios sin DNS.
- Se conservan como `no comprobado` los escaparates sin checkout, tiendas sin
  existencias, servicios temporalmente fuera de servicio, bloqueos técnicos y
  reventa exclusivamente de terceros. Un catálogo o un carrito residual no se
  interpretaron como pedido operativo.

## Ola 3 · segunda pasada de residuales (2026-07-31)

- Se resuelven **26 de los 70** pendientes: **20 pasan a `no`** tras revisar sus
  canales actuales sin encontrar pedido remoto y **6 pasan a `sí`** con un
  mecanismo concreto y usable.
- La Cooperativa de Jérica ofrece siete AOVE, carrito, checkout y pago Redsys,
  además de pedidos por correo (`ecommerce|email`). Bodega Vilafamés publica
  entrega y pedidos por correo o teléfono; Tot de Poble, Masía Els Masets y Les
  Pastetes de Lumi aceptan encargos telefónicos; Quercus and Truffles prepara y
  envía pedidos mayoristas por correo o teléfono.
- La pasada mejora **28 fichas del CSV**: se corrigen o amplían gamas,
  descripciones, direcciones, horarios y contactos. Entre otras, Agua de Bejís
  incorpora la planta de Los Cloticos y formatos de 0,5 a 20 litros; La
  Canetana sustituye su texto de directorio por vinos y contacto propios;
  Boverals concreta sus tres tipos de huevo; y Vega Palancia, Tot de Poble,
  Els Masets, Rey's, Carnes Alto Palancia y Coarvi detallan producto real.
- Se prueban hasta el último paso los casos ambiguos. Aguacates de la Plana
  añade una caja al carrito pero su checkout termina en error; Carns Noel
  bloquea el pago; la tienda antigua de Rey's devuelve 404 y las rutas de
  L'Estanquer se resuelven como blog. Los cuatro continúan `no comprobado` por
  fallo técnico.
- Estado provincial: **150 filas**; venta online **79 `sí`**, **27 `no`** y
  **44 `no comprobado`**. Verificación: 137 `verificado` y 13 `parcial`.

Fuentes destacadas: <https://coopjerica.es/tienda/>,
<https://www.bodegavilafames.com/es/a-tu-servicio>,
<https://www.queseriatotdepoble.com/productos.html>,
<https://www.masiaelsmasets.es/productos-lacteos-artesanos/> y
<https://quercusandtruffles.com/mayoristas-de-trufas/>.

## Ola 3 · banda 41–60 (2026-07-31)

- La tercera revisión reduce el residual de venta de **44 a 33** filas: se
  demuestran cuatro canales nuevos (`sí`) y siete negocios sin pedido remoto
  (`no`). Quedan **83 `sí` · 34 `no` · 33 `no comprobado`**.
- **Bodega Les Useres** pasa a `sí|marketplace`: la cooperativa territorial
  DePenyagolosa vende siete referencias de la bodega con precios, variantes y
  carrito. Brancal Mermelada, Turrones Barberá y Terreta Dolça también quedan
  asociados a mecanismos de compra concretos; Horno Estellés se revalida y
  enriquece sin alterar su venta ya resuelta.
- Se cierran como `no` los canales revisados de Nature Tasty, Cooperativa de
  Vilafamés, Almazara Sierra Espadán, Bodega Vizuecos, Carnicería R. Gallego y
  Cooperativa Benasalense y Horno Romero. En R. Gallego la propia web afirma
  que la venta es exclusivamente presencial; AVELLASSAL describe el e-commerce
  de la Benasalense como una actuación futura.
- Se mejoran **21 filas del CSV**. Destacan la dirección, teléfono, correo y
  coordenadas reales de R. Gallego; el surtido y contacto de Olis Cuquello; las
  variedades, nave, teléfono y coordenadas de Nature Tasty; y catálogos
  concretos para Les Useres, Vizuecos, Blasco de Catí, Terreta Dolça y otros
  obradores. Las diez filas cuyo `verificado` dependía solo de Maps reciben
  evidencia propia o bajan justificadamente a `parcial`.
- Corrección de identidad: `horno-el-romano-almedijar` pasa mediante registro
  `merge` a **`horno-el-romano-segorbe`**. La ficha anterior interpretó como
  domicilio un texto narrativo sobre Almedíjar; la asociación artesanal, los
  directorios actuales y las redes coinciden en Calle del Romano 36, Segorbe.
- Se mantienen `no comprobado` los casos con incertidumbre técnica o comercial:
  Agut continúa en mantenimiento, Rey's devuelve 404, la tienda nueva de Olis
  Cuquello no resuelve DNS y El Mollet responde 503. No se convierten fallos de
  acceso en falsos `no`.

Fuentes destacadas: <https://depenyagolosa.com/proveedores/bodega-les-useres/>,
<https://rgallego.com/?page_id=1113>,
<https://cooperativesagroalimentariescv.com/projecte/avellassal/>,
<https://artesanosdelpalancia.com/horno-el-romano/> y
<https://www.oliscuquello.com/index.php/en/the-oils/cuquello-100>.
