# Candidatos — Santa Cruz de Tenerife

> Origen: pasada de cobertura de capitales 2026-07-08 (la capital solo tiene 4 filas:
> Quesería de Anaga, La Boutique de la Carne, Panadería El Pilar, COPLACA). Clave de
> esta capital: **todo el macizo de Anaga (Taganana, Las Carboneras, Taborno, Igueste,
> San Andrés…) es término municipal de Santa Cruz**. **Estado: `unverified`** —
> deduplicado contra `santa-cruz-de-tenerife.csv` el 2026-07-08; antes de integrar:
> re-deduplicar, confirmar actividad/dirección y decidir `verificacion`/`Venta online`.

## ⚠ Corrección a fila existente — ✅ aplicada 2026-07-10 (lote 1.1c)

- ✅ **Cerveza Agüita**: slug corregido `cerveza-aguita-la-orotava` →
  **`cerveza-aguita-santa-cruz-de-tenerife`** (con registro `merge`), municipio a
  **Santa Cruz de Tenerife** (C/ Azorín 20, Los Gladiolos), teléfono
  (692 184 739) y coordenadas actualizados. Confirmada tienda online propia con
  carrito (cervezas 2,50 €) y **club de suscripción** → `verificado`,
  `Venta online=sí`, canal `ecommerce|suscripcion`. Suma 1 a la capital.

## Capital (municipio de Santa Cruz) — 5 candidatos → 1 alta, 1 ya presente, 3 diferidas (lote 1.1c)

- [x] **Molino de Gofio La Salud, S.L.** — **accepted →
  `molino-de-gofio-la-salud-santa-cruz-de-tenerife`** (`verificado`,
  `no comprobado`). Av. de Venezuela 22, La Salud; único molino de gofio activo de
  la capital, desde 1944, familia García. (Geocodificado a la calle real: hay un
  homónimo de «Av. de Venezuela 22» en Playa San Juan a 64 km.)
- [x] **Queso de Las Carboneras (Sotera)** — **already-present / no crear**. Doña
  Sotera es vecina de Las Carboneras y hace queso de cabra; coincide con la fila
  existente **`queseria-de-anaga-santa-cruz-de-tenerife`** (literalmente en «Calle
  de las Carboneras, Anaga», queso de cabra del Macizo de Anaga). Sin rastro
  digital propio que justifique una fila distinta → no se crea (⚠ dedup resuelto).
- [ ] **Mieles Laurinagan (Eduardo Perdomo)** — **diferida**: solo mención en
  nota del Ayto. (Taganana), sin web/teléfono/redes → no cumple el mínimo de
  integración (≥1 enlace verificable). Reabrir si aparece rastro.
- [ ] **Apicultores Hermanos Dorta** — **diferida**: ídem (solo Mercadillo de las
  Tradiciones de Anaga).
- [ ] **Vino de Mora – Telesforo** — **diferida**: solo GastroCanarias/Ayto.
  (Taganana), sin web → sin fuente verificable.

## Provincia — ✅ Cervezas Ranilla integrada (lote 1.1c)

- [x] **Cervezas Ranilla** — **accepted → `cervezas-ranilla-puerto-de-la-cruz`**
  (`verificado`, **`sí` ecommerce**). Primera fábrica artesanal del Puerto de la
  Cruz (2022), tienda online propia.
- [x] **Bodegas Marba** — retirada de este bloque (limpieza 2026-07-10):
  duplicaba la entrada del lote 22; integrada como `bodegas-marba-tegueste`.

## Descartados en esta pasada (no repasar)

- *Compañía Cervecera de Canarias / Dorada*: gran industria (grupo cervecero
  multinacional), fuera de perfil km0.
- *Queso Project* y *Vinófilos Santa Cruz*: tiendas (afinado/vinoteca), minoristas.
- *TACOA* (El Sauzal): **ya presente** en el CSV como Cerveza Tacoa.
- *Envínate*: **ya presente** (Santiago del Teide). Nota: sus vinos Táganan se
  vinifican en Taganana (SC), pero no crear segunda fila.

## Pistas sin explorar

- Participantes del Mercadillo de las Tradiciones de Anaga (Ayto. publica listas por
  edición): pastelería, hortelanos de la asoc. Ágora, más apicultores.
- Directorio municipal <https://santacruzescomercio.com/> (filtrar elaboración propia
  vs. tienda).
- "7 Islas, 7 Quesos": afinador/tienda, frontera minorista — solo si hay elaboración.

## Las 5 DO insulares de Tenerife — vino (lote 22 de do-huecos, corte 1)

> **Este sí es un hueco grande** (a diferencia de los lotes 19-21). El CSV
> provincial tiene 28 bodegas, pero **solo 16 son de la isla de Tenerife** (las
> otras 12 son de La Palma, La Gomera y El Hierro). Los registros de las 5 DO
> insulares suman **89 bodegas**, de las que **11 ya están en el CSV** → **78
> netas**. Por el tope de lote (15-25) este corte escribe las **25 con web
> comercial propia**; las demás quedan listadas abajo con concello y teléfono
> (datos ya capturados) para cortes posteriores. Estado: **`unverified`**.
> Dedup contra `santa-cruz-de-tenerife.csv` el 2026-07-09.
>
> **Fuentes** (los dominios de la worklist eran erróneos, ver *Método*): DO
> Tacoronte-Acentejo `tacovin.com/vinos/bodegas/` (30) · DO Valle de La Orotava
> `dovalleorotava.com/bodegas` (17) · DO Valle de Güímar
> `vinosvalleguimar.com/bodegas-y-vinos/` (11) · DO Abona
> `vinosdeabona.com/bodegas-y-vinos/` (16) · DO Ycoden-Daute-Isora vía **portal del
> Cabildo** `vinosdetenerife.es` (8; su web propia está caída).

### DO Tacoronte-Acentejo (9) — ✅ integradas 2026-07-10 (lote 1.1a de `integracion.md`)

- [x] **Bodegas Cándido Hernández Pío** — **accepted →
  `bodegas-candido-hernandez-pio-la-matanza-de-acentejo`** (`verificado`,
  `no comprobado`). La Matanza de Acentejo (C/ Las Limeras 51). La web propia
  **confirma que Calius es su marca** en la DO Valle de Güímar → **NO se crea fila
  Calius** (resuelto el ⚠). Sin tienda propia vista.
- [x] **Bodegas Domínguez Cuarta Generación** — **accepted →
  `bodegas-dominguez-cuarta-generacion-tacoronte`** (`verificado`,
  `no comprobado`). C/ Calvario 79, Tacoronte. Web confirma tradición s.XIX.
- [x] **Bodega El Mocanero** — **accepted → `bodega-el-mocanero-tacoronte`**
  (`parcial`, `no comprobado`). Los Naranjeros (Tacoronte), desde 1989. Web
  oficial viva pero solo devuelve cabecera (frames antiguos, /vinos y /contacto
  dan 404) → sin primario legible.
- [x] **Bodega La Isleta** — **accepted → `bodega-la-isleta-tegueste`**
  (`parcial`, `no comprobado`). Web «EN DESARROLLO»: confirma nombre/municipio/
  contacto, no producción. Tel. corregido al de la web (678 760 156).
- [x] **Bodega Linaje del Pago** — **accepted →
  `bodega-linaje-del-pago-el-sauzal`** (`parcial`, `no comprobado`). C/ Herrera
  85, El Sauzal. Web sobre todo de catas/enoturismo; actividad vía registro DO.
  Tel. corregido (640 379 564).
- [x] **Bodegas Marba** — **accepted → `bodegas-marba-tegueste`** (`verificado`,
  **`Venta online=sí`, `ecommerce`**). Tienda propia funcional (carrito+checkout,
  Visa/MasterCard/transferencia). Activa desde 1993. Tel. web 639 065 015.
- [x] **Bodega Presas Ocampo** — **accepted → `bodega-presas-ocampo-tacoronte`**
  (`verificado`, `no comprobado`). Referente de Tacoronte (1998, viñedos
  propios). Su web tiene el **certificado TLS mal configurado** (fallo técnico,
  no baja); vende vía marketplaces de terceros → eso **no** es VO propia.
- [x] **Winery Burgmann Tenerife** — **accepted →
  `winery-burgmann-tenerife-tacoronte`** (`verificado`, `no comprobado`). Camino
  las Viñas 20, Tacoronte, desde 2020; «Shop» del menú = «dónde encontrar», no
  tienda propia. Tel. corregido al de la web (682 420 064).
- [x] **Bodega Zacatín** — **accepted → `bodega-zacatin-santa-ursula`**
  (`parcial`, `no comprobado`). C/ Canal 11, Santa Úrsula; también guachinche.
  Web propia con conexión rechazada (fallo técnico, enlace conservado).

### DO Valle de La Orotava (5) — ✅ integradas 2026-07-10 (lote 1.1b)

- [x] **Bodega Finca Marañuela** — **accepted → `bodega-finca-maranuela-la-orotava`**
  (`verificado`, `no comprobado`). La Perdoma; vinos naturales sin sulfitos,
  ecológica. Sin tienda. Tel. web 691 284 858.
- [x] **Bodega Las Galanas** — **accepted → `bodega-las-galanas-los-realejos`**
  (`verificado`, **`sí` ecommerce**). Los Realejos (La Cruz Santa); tienda propia
  con precios (12/35/18 €).
- [x] **Bodega Murcal** — **accepted → `bodegas-murcal-la-orotava`** (`parcial`,
  `no comprobado`). La Perdoma, desde 1932. Su web bodegasmurcal.es da 404 (caída)
  → sin web, conservado su Facebook.
- [x] **Bodega Quinta San Antonio (Vinos Atlante)** — **accepted →
  `bodega-quinta-san-antonio-vinos-atlante-la-orotava`** (`verificado`,
  `no comprobado`). La Orotava; solo distribuidores, sin carrito.
- [x] **Bodega Tafuriaste** — **accepted → `bodega-tafuriaste-la-orotava`**
  (`verificado`, **`sí` ecommerce**). Marcas Tafuriaste, Ocho Islas, Prunet;
  tienda propia (precios 0,00 € por bug de formato, carrito operativo).

### DO Valle de Güímar (4) — ✅ integradas 2026-07-10 (lote 1.1b)

- [x] **Bodega Hermanos Mesa** — **accepted → `bodega-hermanos-mesa-arafo`**
  (`verificado`, `no comprobado`). Arafo (C/ Sosa 2), variedades autóctonas. Su
  «Compra online» **redirige a un tercero** (tienda.vinofilos.es) → no es VO propia.
- [x] **Bodega Tempus** — **accepted → `bodega-tempus-guimar`** (`verificado`,
  **`sí` ecommerce**). Güímar (Barranco Badajoz); tienda propia funcional.
- [x] **Bodega Comarcal Valle de Güímar** — **accepted →
  `bodega-comarcal-valle-de-guimar-arafo`** (`verificado`, `no comprobado`).
  ⚠ resuelto: **embotella con dos marcas propias** (Pico Cho Marcial, Brumas de
  Ayosa) → se mantiene. Sin tienda.
- [x] **Bodegas Viña Gómez** — **accepted → `bodegas-vina-gomez-guimar`**
  (`parcial`, `no comprobado`). Güímar (El Topo Negro), 5 generaciones. Su dominio
  bodegasvinagomez.com **no resuelve** (DNS caído) → sin web; vende vía terceros.

### DO Abona (4)

> Las fichas de este consejo (y las de Güímar) publican **«Venta en bodega: Sí/No»**,
> visitas, horarios y degustación → pista directa de canal.

> ✅ Las 4 integradas 2026-07-10 (lote 1.1c). La pista «Venta en bodega: sí» del
> registro es **venta física, no online** → todas quedan `Venta online=no comprobado`.

- [x] **Bodega Vento** — **accepted → `bodega-vento-san-miguel-de-abona`**
  (`parcial`, `no comprobado`). Las Zocas; web-plantilla escueta, actividad vía
  consejo DO.
- [x] **Bodega Mencey Chasna** — **accepted →
  `bodega-mencey-chasna-granadilla-de-abona`** (`parcial`, `no comprobado`).
  Jottocar, S.L., Chimiche, desde 2006. Su `.com` entra en bucle de
  redirecciones → web `.net`.
- [x] **Bodega Laja Blanca** — **accepted → `bodega-laja-blanca-arico`**
  (`parcial`, `no comprobado`). Arico (TF-629); web con conexión rechazada
  (técnico), conservado Facebook.
- [x] **Bodega Lacasmi (Coop. San Miguel)** — **accepted →
  `bodega-lacasmi-san-miguel-de-abona`** (`parcial`, `no comprobado`). ⚠ resuelto:
  la coop embotella con su Bodega Lacasmi (marca Casmi) → cumple marca propia. Web
  en construcción.

### DO Ycoden-Daute-Isora (3) — ✅ integradas 2026-07-10 (lote 1.1b)

- [x] **Bodega Estrada (La Calabacera)** — **accepted →
  `bodega-estrada-la-calabacera-guia-de-isora`** (`parcial`, `no comprobado`).
  ⚠ resuelto: la web `lacalabacera.com` es una **finca ecológica gourmet**, pero
  el consejo (ycoden.com/Viña Estrada) confirma que **sí elabora vino** de
  marmajuelo y tinto de la DO en esa finca (Guía de Isora, Playa San Juan). Sin
  tienda de vino → parcial.
- [x] **Borja Pérez Viticultor** — **accepted →
  `borja-perez-viticultor-la-guancha`** (`parcial`, `no comprobado`). La Guancha;
  marcas Ignios Orígenes y Artífice, referencia del vino de autor canario. Su web
  está «Coming Soon» (solo contacto) → actividad vía consejo de la DO, parcial.
- [x] **Bodega Viña Zanata** — **accepted → `bodega-vina-zanata-la-guancha`**
  (`verificado`, **`sí` ecommerce**). La Guancha (razón social Viña La Guancha,
  S.L.); tienda propia (Shopify).

### Cortes siguientes — 53 bodegas restantes (datos ya capturados)

> **Con web propia (5)** — ✅ **integradas fase C, 2026-07-13**:
> - *Hacienda de Acentejo* → `hacienda-de-acentejo-la-victoria-de-acentejo`
>   (`verificado`, VO=nc). La Victoria de Acentejo, DO Tacoronte-Acentejo.
> - *La Baldesa* → `bodega-la-baldesa-el-sauzal` (`verificado`, VO=nc). El Sauzal,
>   viticultores elaboradores desde 1959.
> - *Riaba* → `bodega-riaba-la-victoria-de-acentejo` (`parcial`, VO=nc).
>   ⚠ **municipio resuelto: La Victoria de Acentejo** (no Tacoronte); web JS no
>   legible → parcial.
> - *Risco de las Vegas* → `bodega-finca-vegas-granadilla-de-abona` (`parcial`,
>   VO=nc). ⚠ **municipio corregido: Granadilla de Abona** (no Arona; la razón
>   social «Risco de las Vegas SL» está **extinguida**, hoy marca **Finca Vegas**,
>   DO Abona); web en construcción → parcial.
> - *Tierras de Aponte* → `bodega-tierras-de-aponte-adeje` (`parcial`, VO=nc).
>   Taucho (Adeje), DO Abona; web JS no legible → parcial.
>
> **Sin web propia en el registro (45)** — nombre · municipio · teléfono:
>
> - **Tacoronte-Acentejo (18):** Ambora (Tegueste, 922 638 044) · Cuevas de Lino
>   (Tacoronte, 922 631 305) · El Cercado (Tacoronte, 922 562 002) · Granilete
>   (Tacoronte) · Guayonge (Tacoronte, 922 561 780) · José Antonio Rodríguez del
>   Castillo (La Laguna) · José Miguel Robayna Betancort (La Laguna, 650 945 311) ·
>   La Hijuela (El Rosario, 922 537 284) · Llano El Pino (Tegueste) · LoHer (La
>   Victoria de Acentejo) · Mallar de los Trazos (La Laguna, 619 211 924) · Pedro
>   Jonay Santana Hernández (Tegueste) · Tierra Fundida (La Laguna, 659 974 374) ·
>   Trancao de Acentejo (La Victoria, 922 577 424) · Vinos En Tándem (La Laguna) ·
>   Viña El Drago (La Laguna, 922 541 500) · Viña Estévez (La Victoria, 922 580 779)
>   · Viña Flores (La Matanza, 922 577 194) · Viña Orosía (Santa Úrsula, 922 300 285).
> - **Valle de La Orotava (9):** 300 Líos Volcanic Grapes (Los Realejos,
>   616 511 951) · Bodegas La Araucaria (La Orotava, 679 704 769) · Bodega Illada
>   (Los Realejos, 627 229 735) · Bodega Juan Dios (Los Realejos, 626 725 461) ·
>   Bodega La Haya (Los Realejos, La Cruz Santa, 629 051 413) · Bodega La Suertita
>   (Los Realejos, 669 408 761) · Bodega La Viñita (La Orotava, 639 369 330) ·
>   Bodega Secadero (Los Realejos, San Benito, 665 807 966) · Bodega Volcán de
>   Caramujo (Los Realejos, 677 448 757).
> - **Valle de Güímar (6):** Bodega Juan Francisco Fariña Pérez (Arafo, 636 824 919)
>   · Bodega La Vera (Güímar, 607 594 918) · Bodega Viña Herzas (Arafo, 639 157 290)
>   · Bodega El Silencio (Candelaria, 608 014 944) · Bodegas El Rebusco (Candelaria,
>   922 892 512) · Bodegas Prodiflora (Güímar, 626 497 315).
> - **Abona (7):** Amelia Olimpia Marrero Abreu (Arico, 922 768 108) · Bodega
>   Contiempo (Arona; venta en bodega: **no**) · Daniel Martín Navarro (Arona) ·
>   Lagar de Chasna (Vilaflor, 600 220 294) · Pedro Hernández Tejera – **Viña Arese**
>   (Fasnia, 616 920 832; el registro la duplica, una sola ficha) · Pedro Julián
>   Rivero Oval (Granadilla de Abona, 629 199 438; venta en bodega: **no**) · Tomás
>   Frías González (Fasnia, 922 164 185).
> - **Ycoden-Daute-Isora (3):** Bodegas Aceviño (Icod de los Vinos) · Canales del
>   Palmar (Buenavista del Norte) · Viña Engracia (Icod de los Vinos).

### Notas del lote 22

- **Ya en `santa-cruz-de-tenerife.csv` (no son altas):** Cráter (El Sauzal) ·
  Bodegas Insulares Tenerife (Tacoronte) · Suertes del Marqués y Valleoro (La
  Orotava) · Viñátigo (La Guancha) · Altos de Trevejos y Reverón (Vilaflor) ·
  Cumbres de Abona (Arico).
  - ✅ **Revisado el ⚠ de `bodegas-insulares-licores-tacoronte`** (2026-07-10):
    es la misma empresa que `bodegas-insulares-tenerife-tacoronte` (misma razón
    social y dirección, Ctra. Gral. del Norte km 19,5), pero cubre una **línea de
    producto distinta** (licor de plátano y aguardiente vs. vinos Viña Norte).
    Se **mantienen ambas filas** por ahora (productos distintos); candidata a
    fusión de baja prioridad si se decide una sola fila por unidad productiva.
- ⚠ **Tres alias que habrían creado duplicados** (mismo patrón que el lote 21: el
  consejo lista **razón social**, el CSV usa **marca**):
  - *Mesur, S.L.* (Abona) = **Bodega Frontos** → `bodega-frontos-granadilla-de-abona`.
  - *Bodegas Arautava* (Orotava) = **Bodegas El Penitente** →
    `bodegas-el-penitente-la-orotava` (el CSV usa el nombre antiguo pero ya apunta a
    `bodegasarautava.com`).
  - *Bodega Calius* (Güímar) = **Cándido Hernández Pío** (Tacoronte-Acentejo): una
    sola bodega inscrita en dos DO.
  Y un cuarto que **sí** es alta pese a parecer alias: *Jottocar, S.L.* = **Bodega
  Mencey Chasna** (no está en el CSV).
- **Sexta DO, `DOP Islas Canarias`** (regional) — ✅ **corte integrado fase C,
  2026-07-13** (9 altas): *Bodegas Ferrera* → `bodegas-ferrera-arafo` (verif,
  **VO=sí** ecommerce, eco+cerveza Maruca) · *Piedra Fluida* →
  `bodega-piedra-fluida-la-orotava` (verif, **VO=sí** ecommerce, viñedo Frontones
  1.687 m) · *Pago de los Cercados* → `pago-de-los-cercados-santa-ursula` (verif,
  VO=nc) · *Finca El Ancón* → `bodega-finca-el-ancon-la-orotava` (verif, VO=nc;
  ⚠ homónimo distinto de `queseria-el-ancon-tacoronte`) · *Tabares 4* →
  `bodega-tabares4-la-matanza-de-acentejo` (parcial — tel +32, perfil négociant) ·
  *Alejandro Gallo & Quíquere* → `alejandro-gallo-quiquere-wines-el-sauzal`
  (verif, VO=nc) · *Ricardo Gutiérrez de Salamanca / Vinos 1861* →
  `vinos-1861-san-cristobal-de-la-laguna` (parcial) · *Natan Afonso / Mataznos 33*
  → `bodega-mataznos-33-los-realejos` (parcial, sin web propia) · *Atrevino* →
  `bodegas-atrevino-la-matanza-de-acentejo` (verif, VO=nc). Fuente:
  `vinosdetenerife.es/d-o-p-islas-canarias`.

### Método (los dominios de la worklist estaban mal)

- **Tacoronte-Acentejo**: no es `tacoronteacentejo.com` (no resuelve) sino
  **`tacovin.com`**; su `/vinos/bodegas/` imprime nombre, marcas, dirección,
  teléfono y web de las 30 bodegas en HTML plano.
- **Valle de Güímar**: no es `vinosvalledeguimar.com` sino **`vinosvalleguimar.com`**
  (sin el «de»). Ojo: `valledeguimar.es` es un **periódico local**, no la DO.
- **Ycoden-Daute-Isora**: `ycoden.com` responde 301 en HTTP pero su **HTTPS está
  caído**; el listado se recuperó del portal del Cabildo. Wayback conserva una
  `guiaBodegas.asp` de **2009** — útil como histórico, **no fiable** como registro.
- **Abona y Güímar** comparten plantilla: cada ficha expone «Venta en bodega»,
  visitas, horarios y degustación → oro para las columnas de canal.
- El **portal del Cabildo `vinosdetenerife.es`** publica, por DO, una tabla
  *Nombre · Marcas · Dirección · Web*. Cubre 4 de las 5 (falta Güímar) más la DOP
  Islas Canarias: la mejor fuente de contraste para municipio y marca.
