# Candidatos — Lugo

> Origen: pasada de cobertura de capitales 2026-07-08 (la capital tiene 4 filas:
> Aloumiña, Bubela, Cafés Candelas, Confitería Madarro). Resultado honesto: **no salió
> ninguna alta nueva de capital** — los dos productores potentes del concello/entorno
> ya estaban en el CSV. **Estado: `unverified`** — deduplicado contra `lugo.csv` el
> 2026-07-08.

## Notas sobre filas existentes (no son altas)

- **Torre de Núñez** (fila en O Corgo): la sede y planta principal están en
  **Conturiz, Ctra. N-VI km 497, concello de Lugo** (la de O Corgo es la segunda
  planta). Valorar si el municipio de la fila debería ser Lugo; si se mantiene
  O Corgo, documentarlo. Tienda online <https://torredenunez.com/tienda/> → revisar
  `Venta online`.
- **Cárnicas Teijeiro** (fila en Sarria): correcto — San Lázaro 15, Sarria (el barrio
  San Lázaro es de Sarria, no de Lugo ciudad). Porco celta desde 1963/2003.

## Provincia — 6 candidatos

- [x] **As Fadegas** ‹→ as-fadegas-ribadeo (parcial; horta eco pionera, vende en mercado Ribadeo, sin web)› — Fruta y verdura (horta ecolóxica). Ribadeo, a carón do río
  Grande; 5 invernadoiros (1.800 m² cubertos) + 1 ha; pioneira en ecolóxico, 40 anos,
  con relevo generacional. Fuente:
  <https://www.campogalego.gal/as-fadegas-relevo-xeneracional-nunha-explotacion-de-horta-pioneira-que-cumpre-40-anos/>.
- [x] **Panadería Fraga** ‹→ panaderia-fraga-palas-de-rei (verificado; web propia, sin carrito → VO n/c)› — Pan y pastelería. Palas de Rei, desde 1995. Vende con
  envío vía SondeLugo (<https://sondelugo.com/gl/brand/10-panaderia-fraga>) → pista
  `Venta online=sí` (marketplace).
- [x] **Pingas de Gaia** ‹→ pingas-de-gaia-vilalba (parcial; apicultor en San Simón da Costa, sin web)› — Miel. Vilalba.
- [x] **Embutidos Hermelino** ‹→ embutidos-hermelino-o-valadouro (verificado; O Valadouro, porco celta, sin carrito propio)› — Charcutería (porco celta). O Valadouro; granja
  familiar, +80 años. En SondeLugo:
  <https://sondelugo.com/es/productos/241-salchichon-de-cerdo-celta-hermelino.html>.
- [x] **Céltico (Mario Rouco Rey)** ‹→ celtico-mario-rouco-muras (parcial; Muras, porco celta, sin web)› — Charcutería (porco celta). Muras; granja propia
  desde 2015, marca desde ~2019; chorizo, lomo, salchichón elaborados en Muras.
  Fuente: <https://deputacionlugo.gal/es/node/76611> y Campo Galego.
- [x] **Maruxas de Nata** ‹DIFERIDO a a-coruna: el obrador y la tienda están en San Sadurniño (A Coruña); manda el obrador → integrar en a-coruna.csv, no en Lugo› — Dulces (galletas de nata eco). ⚠ **Provincia por
  decidir:** granja en Monterroso (Lugo) pero obradoiro y tienda en A Garita s/n,
  Santa Mariña do Monte, San Sadurniño (**A Coruña**). Si manda el obrador, va a
  `a-coruna.csv`. <https://maruxasdenata.com/>; venden en Bigcrafters/Mentta → pista
  `Venta online=sí`.

## Descartados en esta pasada (no repasar)

- *O Bandullo Ecolóxico / Mercado da Terra*: asociación/mercado, no productor.
- *A Cova da Terra*: cooperativa de consumo, no productor.
- *La Casa de las Empanadas* (Lugo): obrador-tienda de hostelería/minorista.

## Ya presentes en `lugo.csv` (comprobado 2026-07-08)

Arqueixal (Palas de Rei) · Queixería Don Gabino (Vilalba) · Mel Casa da Torre
(Cervantes) · A Horta da SancoVeiga (Vilalba) · Torre de Núñez (O Corgo) · Cárnicas
Teijeiro (Sarria).

## DO Ribeira Sacra — adegas lucenses (lote 14 de do-huecos)

> Origen: **cola del lote 11**. Registro oficial del Consejo Regulador vía su
> endpoint CSV (`ribeirasacra.org/bodegas_csv.php?idioma=es`, delimitador `;`,
> provincia embebida en la dirección). Del volcado: 88 adegas totales → **70 en
> Lugo** (18 son de Ourense, ya tratadas en el lote 11). Dedup contra `lugo.csv`
> el 2026-07-09 (por dominio, teléfono normalizado y nombre/marca sin acentos y
> sin sufijos societarios): **22 ya presentes**, 48 net-new. Este corte escribe
> **24** (las consolidadas / con web / marca reconocida); las ~24 restantes,
> micro-colleiteiros de nombre personal sin web, quedan en **nota «corte 2»**.
> Estado: **`unverified`**. Subzona anotada entre paréntesis. La marca comercial
> es la del registro; el municipio es el de producción (dirección del registro),
> no la sede del consejo.

- [x] **Adega Saiñas** (Adega Saiñas C.B.) ‹→ adega-sainas-panton (parcial; web caída, registro consejo)› — Bodega (Ribeiras do Miño). Pantón.
  Tel 982 456 228 · web www.saiñas.com. Marca: Saiñas / Javier Fernández.
- [x] **Alouviño** ‹→ adega-alouvino-sober (verificado, VO sí ecommerce)› — Bodega (Amandi). Sober. Tel 667 396 548 ·
  <http://www.alouvino.com>. Marcas: 22º, Albarda, Serán, Ukiyo.
- [x] **Adegas Amedo** ‹→ adegas-amedo-chantada (verificado, VO sí ecommerce)› — Bodega (Chantada). Chantada. Tel 982 184 488 ·
  <http://www.adegasamedo.com>. Marcas: Amedo, As Glorias, Pero Bernal.
- [x] **Bodega Soutelo** ‹→ bodega-soutelo-sober (verificado, VO sí ecommerce; web real = bodegasoutelo.com, no .es)› — Bodega (Amandi). Sober. Tel 600 700 136 ·
  <http://www.bodegasoutelo.es>. Marca: Cardenal Rodrigo de Castro.
- [x] **Dominio Marcelino** (Marcelino Tierra y Vinos S.L.) ‹→ dominio-marcelino-sober (parcial; web con cert incorrecto)› — Bodega (Amandi).
  Sober. Tel 647 164 040 · www.dominiomarcelino.com. Marca: Marcelino I.
- [x] **Bodega Pincelo** ‹→ bodega-pincelo-chantada (parcial; web caída)› — Bodega (Chantada). Chantada. Tel 982 441 660 ·
  <http://www.bodegapincelo.com>. Marcas: Pincelo, Momentum, Viña Portotide.
- [x] **Régoa** (Régoa C.B.) ‹→ adega-regoa-sober (parcial; web con cert incorrecto)› — Bodega (Amandi). Sober. Tel 649 101 555 ·
  <http://www.regoa.es>. Marcas: Régoa, Régoa Iria, Régoa TN.
- [x] **Val da Lenda** (Rodríguez López, Víctor Manuel) ‹→ adega-val-da-lenda-sober (verificado, VO sí ecommerce)› — Bodega (Amandi).
  Sober. Tel 982 460 504 · www.valdalenda.com. Marca: Val da Lenda.
- [x] **Virxen dos Remedios** (S.A.T. Virxen dos Remedios 837 XUGA) ‹→ adega-virxen-dos-remedios-o-savinao (verificado, VO n/c; ⚠ marca Castro Candaz compartida)› — Bodega
  (Ribeiras do Miño). O Saviñao. Tel 982 171 720 ·
  <http://www.virxendosremedios.es>. Marcas: Castro Candaz, Demo, Pazo de Bexán.
  ⚠ marca «Castro Candaz» comparte nombre con Bodegas CastroCandaz (Quiroga) y
  con la línea homónima de Martín Códax → verificar titularidad de la marca.
- [x] **Diego de Lemos** (Teijeiro Lemos S.L.) ‹→ bodega-diego-de-lemos-chantada (parcial; solo blog)› — Bodega (Chantada). Chantada.
  Tel 982 171 666 · <http://bodegadiegodelemos.blogspot.com>. Marca: Diego de Lemos.
- [x] **Cividade** (Verao López, Brais) ‹→ adega-cividade-sober (parcial; web caída)› — Bodega (Amandi). Sober.
  Tel 982 152 981 · <http://www.cividades.com>. Marca: Cividade.
- [x] **Aborixe** ‹→ adega-aborixe-sober (parcial; viño natural, sin web)› — Bodega (Amandi). Sober. Tel 609 660 019. Sin web en registro
  (viño natural, buscar en verificación).
- [x] **Bodega Ribada** ‹→ bodega-ribada-chantada (parcial; sin web)› — Bodega (Chantada). Chantada. Tel 982 441 579.
  Marcas: Ribada, Ribada Selección, Viña Ribada.
- [x] **Alvaredos-Hobbs** (Fructuoso-Hobbs S.L.) ‹→ adega-alvaredos-hobbs-quiroga (verificado; Paul Hobbs, distribución → VO n/c)› — Bodega (Quiroga-Bibei).
  Quiroga. Tel 982 155 721. Marca: Alvaredos-Hobbs (proyecto de Paul Hobbs).
- [x] **Tolo do Xisto** ‹→ adega-tolo-do-xisto-monforte-de-lemos (parcial; Coca i Fitó, sin web propia)› — Bodega (Quiroga-Bibei). Monforte de Lemos.
  Tel 667 797 177. Marca: Tolo do Xisto.
- [x] **Regal López, Roberto** ‹→ adega-regal-lopez-taboada (parcial; marca Gaela)› — Bodega (Chantada). Taboada. Tel 982 031 093.
  Marcas: Gaela, Mission, Neno da Ponte, Manifestación (muchas referencias).
- [x] **Albarduxe** (Albarduxe S.C.) ‹→ adega-albarduxe-chantada (parcial; sin web)› — Bodega (Chantada). Chantada.
  Tel 666 472 839. Marcas: Albarduxe, 18 Monasterios, Alboroque, Massimo.
- [x] **Bodega Losada Fernández** ‹→ bodega-losada-fernandez-panton (parcial; Don Ventura, sin web)› — Bodega (Ribeiras do Miño). Pantón.
  Tel 982 456 213. Marcas: Don Ventura, Pena do Lobo, Viña Caneiro.
- [x] **Rectoral de Gundivós** ‹→ rectoral-de-gundivos-sober (verificado; oleiro+adega, vino en barro Ámboa)› — Bodega (Amandi). Sober. Tel 609 660 019 /
  626 966 280. Marcas: Ámboa, Ímbrice, Adobe.
- [x] **Fusco / Finca Cuarta** (Moure Fernández, Rubén) ‹DIFERIDO: marca «Finca Cuarta» ya figura en la fila prior-de-panton-panton (mismo viñateiro Rubén Moure); confirmar titularidad antes de crear fila aparte› — Bodega (Amandi /
  Ribeiras do Miño). Sober / Pantón. Tel 638 380 222. Marcas: Fusco, Finca
  Cuarta por Rubén Moure, Priscillvs, Nai (viñateiro reconocido; el registro lo
  lista en dos subzonas → una sola ficha).
- [x] **Finca A Figueira** (Finca y Bodega A Figueira S.L.) ‹DIFERIDO: ⚠ concello sin confirmar + teléfono 986 (prefijo Pontevedra) → verificar provincia antes de integrar› — Bodega (Chantada).
  Chantada ⚠ (confirmar concello). Tel 986 483 313. Marca: Finca Figueira.
- [x] **Bodegas CastroCandaz** ‹DIFERIDO: mismo proyecto Raúl Pérez/Rodrigo Méndez (marcas Castro Candaz/Demo/Pazo de Bexán) ya integrado como adega-virxen-dos-remedios-o-savinao → evitar duplicado; resolver titularidad› — Bodega (Quiroga-Bibei). Quiroga.
  Tel 696 621 531. ⚠ colisión de marca «Castro Candaz» (ver Virxen dos Remedios).
- [x] **Terrazas de Outeiro** ‹→ adega-terrazas-de-outeiro-quiroga (parcial; sin marca ni web)› — Bodega (Quiroga-Bibei). Quiroga. Tel 637 895 831.
  Sin marca en registro (confirmar producto y venta).
- [x] **Adegas Salvadur** ‹→ adegas-salvadur-a-pobra-do-brollon (parcial; sin marca ni web)› — Bodega (Quiroga-Bibei). A Pobra do Brollón.
  Tel 669 850 034. Sin marca en registro (confirmar).

### Notas del lote 14

- **Excluida por grupo grande**: *Adega Damm S.L.* (Amandi, Sober) — proyecto de
  Ribeira Sacra del grupo cervecero Estrella Damm → fuera por regla dura (gran
  grupo industrial). Confirmar en verificación por si tuviera marca propia
  vendible al público.
- **Corte 2 (micro-colleiteiros) — ✅ INTEGRADO lote 2.3d (2026-07-12)**: 17
  altas `parcial` (los que tienen marca registrada; coords al centroide del
  concello, sin web). **Saltados**: Álvarez Rodríguez Óscar, Castro Sesse José
  María y Pérez Pérez José Luis (sin marca, filas demasiado finas); ED V 2015
  (Quiroga, marca «Fusco» colisiona con Rubén Moore/Prior de Pantón → verificar
  titularidad). Lista original del registro (subzona · concello · tel · marca
  notable si la hay): A Man de Prado
  (Amandi·Sober·617 776 392); Álvarez Rodríguez, Óscar (Amandi·Sober); Alvarín
  Losada, Mª Gloria (Ribeiras do Miño·Monforte·*Ciudaseis*); Carnero Fiuza, Jorge
  (Amandi·Sober·*Viña Cazoga*); Castro Sesse, José María (Ribeiras do
  Miño·Sober); D´Fran S.C. (Amandi·Sober·*Essencia*); Díaz Ferreiro, Mª
  Purificación (Quiroga-Bibei·Pobra do Brollón·*Val do Frade*); Domínguez
  González, Edelmiro (Chantada·Carballedo·*Calexotes*); ED V 2015 (Quiroga-Bibei·
  Quiroga·*Don Cosme, Fusco*); Fernández Pedreira, José Luis (Chantada·Chantada·
  *Castrofiz*); Fernández Prado, Isabel (Amandi·Sober·*Gullufre*); Fernández
  Rodríguez, Carlos (Amandi·Sober·*Viña Frieira*); López Vázquez, Maximino
  (Ribeiras do Miño·Pantón·*Terras Mouras*); Méndez Arias, Javier (Amandi·Sober·
  *Adega Barbado, As Muras*); Pérez Pérez, José Luis (Ribeiras do Miño·O
  Saviñao); Pérez Rodríguez, Óscar (Ribeiras do Miño·Sober·*Naz*); Pilares de
  Belesar (Ribeiras do Miño·O Saviñao·*Asolagados*); Rabelas Renovables
  (Chantada·Chantada·*Os Cipreses*); Trigo Fernández, Mª del Carmen (Amandi·
  Sober·*Décima*); Vázquez Rodríguez, Araceli (Ribeiras do Miño·Sober·*Broa,
  Malcavada*); Vidal López, José Manuel (Amandi·Sober·*Viña Mezquita*). (Muchos
  con marca comercial registrada → probablemente vendibles, solo falta web.)
- **Método**: mismo endpoint CSV del consejo del lote 11; recordar que el
  header trae entidades HTML con `;` embebido (`DIRECCI&OACUTE;N`) que rompen el
  split — usar cabecera manual y unescape por campo.

## Pistas sin explorar (capital)

- **Mercado da Terra** (martes 17-20 h, Mercado Municipal Quiroga Ballesteros,
  organiza O Bandullo Ecolóxico): cantera directa de hortelanos/apicultores del
  concello de Lugo — la vía más realista para subir la capital.
- Directorio de empresas del polígono O Ceao: <https://ceaogandaras.org/empresas>
  (filtrar elaboración artesana vs. mayoristas).
