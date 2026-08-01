# Girona · verificación — snapshot de mantenimiento

Pasada profunda **cerrada el 2026-06-15** (27 lotes + pasada de consistencia);
mantenimiento de venta y calidad **V-05 el 2026-07-31**. Detalle por lote en
`git log --follow -p -- docs/verificacion/girona.md`; procedencia por fila en
`data/evidence/catalunya/girona.jsonl`. La verdad es el CSV; cerrar la pasada no
cierra el catálogo y las afirmaciones dinámicas caducan.

## Estado actual

- Filas: **241** · verificado **237** · parcial **4** · pendiente **0**. Desde el inicio: 8 purgas,
  2 fusiones, 7 altas concurrentes (cruce Rutes del Vi).
- `Venta online`: **131 `sí`** (todos con canal y dependencias válidas), **102
  `no`** y **8 `no comprobado`** con techo documentado.
- Evidencia: 241 `keep` + tombstones; la provincia está en `data/evidence/coverage.json` (advisory).
- Completitud ~99%: penaliza los `no comprobado`, no es cola sin revisar.

## Residuales justificados

- 4 `parcial`: **Làctics Tramuntana** (Cabanelles; existencia respaldada, última actividad propia
  localizada 2020), **Can Solivera** (Forallac; continuidad contradictoria, web propia convertida
  en alojamiento, sin perfil social), **Ca l'Esteve** (Ribes de Freser; el directorio institucional
  confirma el obrador, pero no mantiene canal propio activo) y **Mel La Calma** (Olot; ficha pública
  actualizada, sin presencia propia vigente que eleve la verificación).
- `no comprobado` tras V-05: **El Pastor de Riudaura** (tienda propia con
  certificado TLS inválido), **Molí de Ger** (remite a Mercat Arrels sin ficha
  comprable actual), **Embotits Vilanova** (carrito sin precio ni alta de
  producto), **Can Solivera** (dominio roto y continuidad propia no
  demostrada), **Red Passion Berries** (tienda propia en timeout), **Clos de la
  Torre** (catálogo sin referencia disponible), **Oliver Conti** (TLS inválido
  y HTTP 403) y **Mas Patiràs** (el enlace de compra de la DO devuelve 404).

## Mantenimiento V-02 · venta sin resolver

- Se resolvieron **8 de 17**: `sí` para **Martín Faixó** (`ecommerce`), **Gelats
  Enxaneta** (`email` de pedidos), **Xuixo Castelló** (`ecommerce`), **Or de
  l'Albera** (`ecommerce` enlazado a Canigó Oil), **Alma Teas** (`ecommerce`) y
  **Llívins** (`marketplace` colectivo de la Diputació); `no` para **Recuits de
  Fonteta** y **Aldea de Buscarós** tras revisar sus canales actuales.
- **Xuixo Castelló**, **Embotits Vilanova** y **Or de l'Albera** perdieron el
  texto genérico de importación; **Alma Teas** apunta ahora a su web de marca y
  **Gelats Enxaneta** al correo explícito de pedidos.
- No se forzaron como negativas las tiendas agotadas, los carritos incompletos,
  la reventa independiente ni los fallos de TLS, timeout o 404.

## Reglas locales (no revertir sin nueva evidencia)

- Purgas con causa firme: **Popaire** (NIF revocado 2023, dominio aparcado), **Can Calet** (renombrada
  Establiments Calet, objeto social → alojamientos, 2026), **La Brava** (extinción en BORME),
  **Trull d'en Francesc** (es restaurante), **Can Gombau** (vermutería; su vermut lo elabora una coop
  de Capmany), **Mar de Formatges** (comercio), **Formatgeria de Llívia** (hoy restaurante),
  **Cargol Bover** (entidad no demostrable).
- Fusión: **Vins de Taller** → `clos-de-basella-siurana` (misma sociedad y teléfono).
- Identidades actualizadas (slug estable): Finca Bell-Lloc se presenta como **Celler Brugarol**;
  `BCN-V1-g` retiró su duplicado territorial de Barcelona y concretó aquí la gama y el cultivo;
  L'Arbreda = marca **Mas L'Arbreda**; Làctics Vall de Ribes = **Ca l'Esteve** (desde 2023 compra la
  leche a otra granja del Ripollès, sigue siendo obrador); Gelats Janeret = **Golafreria Janeret**
  (Plaça Major); **Masia Serra** salió de la DO Empordà; **Cal Flequer** = obrador en Cornellà del
  Terri; **Quevall** ubicada en Llançà.
- Webs legítimas solo-HTTP con TLS roto — no forzar HTTPS ni borrar: Arròs Avi Trias, Celler
  Arché Pagès (subdominio catalán), Celler Can Sais.
- Ventas que NO son ecommerce de producto: **Mas Llunes** y **Mas la Coromina** (checkout solo de
  visitas/experiencias/vales), **La Fageda** (no vende directo; remite a supermercados online →
  `marketplace`), **Mas Molla / Recuits Nuri / Granja Mas Bes** (venta física en masía/agrobotiga).
- **Arròs Mas Pla**: contacto comercial en Torroella de Montgrí, producción y cultivos en Pals →
  `municipio=Pals`. **Mooma**: CP correcto 17256.
- 16 grupos de coordenadas compartidas revisados: centroides prudentes de productores distintos,
  no duplicados.

## Fuentes locales y límites

- **ATO** (perfiles individuales de granjas lecheras) y **Lletera Campllong** (página de granjas
  asociadas): confirman continuidad y ubicación de explotaciones sin web.
- **ACREFA**, **Gastroteca**, **Girona Excel·lent**: existencia/gama; no prueban venta remota.
- **DO Empordà** (consejo): adscripción y contacto; no infiere actividad actual (Masia Serra salió).
- **Producte del Ripollès**: directorio — no usarlo como web del productor.
- **Agrobotigues** (coop. Espolla): tienda colectiva válida como canal del productor.

## Mantenimiento (al retomar)

- Recomprobar los 131 `Venta online=sí` y los 8 `no comprobado`; V-05 deja
  documentadas las decisiones nuevas y el techo técnico de los residuales.
- Vigilar los 4 `parcial` (Tramuntana, Can Solivera, Ca l'Esteve y Mel La Calma)
  por señales de actividad propia o cierre definitivo.
- La nota de candidatos de Girona quedó cerrada; pistas nuevas → `docs/candidates/girona.md`.

## Mantenimiento V-03 · mejora de los nueve residuales (2026-07-31)

Los nueve casos se vuelven a contrastar y conservan `no comprobado`: siguen
existiendo reventa independiente, referencias agotadas, un carrito incompleto,
un marketplace sin ficha, timeout, TLS inválido o un enlace de compra roto. No
hay nueva evidencia suficiente para convertir esas incertidumbres técnicas en
un `sí` o un `no`.

Mejoras materiales del CSV:

- Red Passion Berries pasa de `Otros` a `Fruta y verdura` y concreta frambuesa
  fresca y mermelada de producción propia.
- Molí de Ger incorpora cinco quesos de su gama vigente.
- Oliver Conti sustituye el móvil heredado por el teléfono publicado por la DO,
  añade correo y detalla sus gamas Indispensable, Gewürztraminer y Cabernet
  Franc.
- Mas Patiràs incorpora seis marcas, variedades, superficie de viñedo y visitas
  concertadas.

Snapshot sin cambios artificiales de estado: 241 filas; 239 `verificado`, 2
`parcial`; venta online 131 `sí`, 101 `no` y 9 `no comprobado`.

## Mantenimiento V-04 · venta y descripciones genéricas (2026-07-31)

Lote de 15 filas orientado a mejorar el contenido real del CSV, no solo sus
estados. Se retiraron 13 descripciones genéricas y se precisaron identidad,
gama, trayectoria, dirección o contacto con fuentes actuales.

- **Aigua de Sant Aniol** pasa a `sí` por su servicio propio de agua a domicilio,
  que confirma disponibilidad, precio y pedido por contacto (`email|telefono`).
- **Arròs Molí de Pals** pasa a `sí|ecommerce`: su tienda vuelve a ofrecer
  referencias con precio, cantidad y botón de compra.
- Se corrigen tres falsos positivos: **El Pastor de Riudaura** pasa de `sí` a
  `no comprobado` por el TLS inválido de su tienda; **Forn de Pa Porterias** y
  **Carnisseria Gironell** pasan de `sí` a `no` porque sus webs actuales son
  informativas y no publican un flujo de pedido remoto.
- **Noguera Pastissers** incorpora los canales explícitos de WhatsApp y teléfono;
  **WHYM** corrige número de calle y correo; Sota els Àngels, Birba, Tornés,
  Juhé, Albera, Rufa, Can Fanera y Collverd reciben descripciones y gamas
  específicas respaldadas por sus fuentes propias.

Snapshot actual: 241 filas; 239 `verificado`, 2 `parcial`; venta online 130
`sí`, 103 `no` y 8 `no comprobado`. En la cola editorial quedan 24 filas únicas:
5 descripciones genéricas, 7 evidencias prestadas, 4 plantillas cruzadas y los
8 casos de venta técnicamente no resolubles con las fuentes actuales.

## Mantenimiento V-05 · cierre de calidad residual (2026-07-31)

Lote de 16 filas investigadas individualmente para cerrar defectos editoriales
sin maquillar los ocho casos de venta todavía no resolubles.

- Cinco fichas genéricas —**Ànec de l'Empordà**, **Mas Auró**, **Dolça Abella**,
  **Nous Can Llavanera** y **Ratafia l'Empordanesa**— incorporan trayectoria,
  gama, producción, dirección u horarios concretos tomados de sus fuentes vivas.
- **Gelats Enxaneta** pasa de `Lácteos y quesos` a `Helados`. En **La Fageda**,
  **Carnisseria Alemany** y **L'Hort de les Mulleres** se corrige el texto que
  provocaba falsos cruces de categoría sin borrar productos reales.
- **Ca l'Esteve** y **Mel La Calma** pasan honestamente a `parcial`; las fuentes
  institucionales prueban continuidad reciente, pero no una presencia propia
  suficiente para `verificado`.
- **SAT Sant Mer**, **Granja El Trèvol** y **Can Costa de Manol** enlazan sus
  perfiles de ATO, sociedad propiedad de sus siete granjas; **Can Violant**
  enlaza su perfil de Lletera Campllong. Son fuentes colectivas oficiales, no
  fichas municipales prestadas.
- La antigua ficha **Embotits Eugeni** se fusiona en **Embotits Masó**: BORME y
  registro alimentario confirman la sociedad e identidad actuales en Olot. La
  nueva ficha incorpora web, tienda, contacto, ubicación y gama vigentes, y
  pasa de `no` a `sí|ecommerce`.

Snapshot actual: 241 filas; 237 `verificado`, 4 `parcial`; venta online 131
`sí`, 102 `no` y 8 `no comprobado`. Quedan 11 alertas únicas: los 8 techos
técnicos de venta y 3 falsos positivos del detector de web compartida para los
perfiles de ATO. Descripciones genéricas, evidencia prestada y cruces de
categoría accionables quedan a cero.
