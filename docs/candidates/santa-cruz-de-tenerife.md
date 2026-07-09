# Candidatos — Santa Cruz de Tenerife

> Origen: pasada de cobertura de capitales 2026-07-08 (la capital solo tiene 4 filas:
> Quesería de Anaga, La Boutique de la Carne, Panadería El Pilar, COPLACA). Clave de
> esta capital: **todo el macizo de Anaga (Taganana, Las Carboneras, Taborno, Igueste,
> San Andrés…) es término municipal de Santa Cruz**. **Estado: `unverified`** —
> deduplicado contra `santa-cruz-de-tenerife.csv` el 2026-07-08; antes de integrar:
> re-deduplicar, confirmar actividad/dirección y decidir `verificacion`/`Venta online`.

## ⚠ Corrección a fila existente (no es alta)

- **Cerveza Agüita** figura en el CSV con municipio **La Orotava**, pero la fábrica
  está en **C/ Azorín 20, bloque 7, local 2, 38007 Santa Cruz de Tenerife**
  (<https://aguita.org/contacto/>, Empresite). Corregir municipio+lat/lon de la fila
  `aguita` → suma 1 a la capital sin crear fila. Tiene tienda online
  (<https://aguita.org/categoria-producto/cervezas/>) → revisar `Venta online=sí`.

## Capital (municipio de Santa Cruz) — 5 candidatos

- [ ] **Molino de Gofio La Salud, S.L.** — Otros (gofio). Avda. de Venezuela 22 /
  C/ Princesa Guacimara, barrio La Salud. <https://www.molinogofiolasalud.com/>.
  Licencia de 1943; familia García (Moisés, David y Abel); único molino de gofio
  activo de la capital; ~200 t/año.
- [ ] **Queso de Las Carboneras (Sotera)** — Lácteos y quesos. Las Carboneras, Anaga.
  Sin web; fuente: GastroCanarias/Ayto. de Santa Cruz. ⚠ **Dedup crítico:** aclarar si
  es la fila existente "Quesería de Anaga" (sin web) antes de crear fila.
- [ ] **Mieles Laurinagan (Eduardo Perdomo)** — Miel. Taganana. Fuente:
  <https://degustasantacruz.com/en/and-may-the-queen-reign-again/>. Miel de monte de
  Anaga; encaja DOP Miel de Tenerife.
- [ ] **Apicultores Hermanos Dorta** — Miel. Anaga. Fuente: Mercadillo de las
  Tradiciones de Anaga (Ayto.):
  <https://www.santacruzdetenerife.es/web/noticias-y-agenda/noticias/detalle-noticia/santa-cruz-promueve-su-producto-local-a-traves-del-mercadillo-de-las-tradiciones-de-anaga>.
- [ ] **Vino de Mora – Telesforo** — Bodega. Taganana. Fuente: GastroCanarias/Ayto.
  (<https://reservabiosfera.tenerife.es/noticias/santa-cruz-conectara-a-productores-y-restauradores-de-anaga-en-gastrocanarias/>).
  Sin web localizada → probable `parcial`.

## Provincia — 2 candidatos

- [ ] **Cervezas Ranilla** — Cerveza artesana. Puerto de la Cruz, desde 2022 (primera
  fábrica artesanal del municipio). <https://cervezasranilla.es/>.
- [ ] **Bodegas Marba** — Bodega. Tacoronte (DO Tacoronte-Acentejo). Citada como vino
  presente en los eventos de productores de Anaga.

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

### DO Tacoronte-Acentejo (9)

- [ ] **Bodegas Cándido Hernández Pío** — Bodega. La Matanza de Acentejo.
  · 922 513 288 · <https://bodegaschp.es>. Marcas: Balcón Canario, Viña Riquelas,
  Punta del Sol. ⚠ **La misma empresa figura también en la DO Valle de Güímar como
  «Bodega Calius»** (mismo teléfono y web) → una sola fila.
- [ ] **Bodegas Domínguez Cuarta Generación** — Bodega. Tacoronte. · 922 572 435 ·
  <https://bodegasdominguez.es>.
- [ ] **Bodega El Mocanero** — Bodega. Tacoronte. · 922 560 762 ·
  <https://bodegaelmocanero.com>. Marcas: El Mocanero (tinto, maceración carbónica,
  blanco seco y afrutado).
- [ ] **Bodega La Isleta** — Bodega. Tegueste. · 922 541 805 · <https://laisleta.es>.
- [ ] **Bodega Linaje del Pago** — Bodega. El Sauzal. · 687 968 597 ·
  <https://linajedelpago.com>.
- [ ] **Bodegas Marba** — Bodega. Tegueste. · 922 638 400 · <https://bodegasmarba.com>.
- [ ] **Bodega Presas Ocampo** — Bodega. Tacoronte. · 922 571 689 ·
  <https://presasocampo.com>.
- [ ] **Winery Burgmann Tenerife** — Bodega. Tacoronte. · 610 750 437 ·
  <https://burgmannwinery.com>.
- [ ] **Bodega Zacatín** — Bodega. Santa Úrsula. · 922 301 399 ·
  <https://bodegazacatin.com>.

### DO Valle de La Orotava (5)

- [ ] **Bodega Finca Marañuela** — Bodega. La Orotava (La Perdoma). · 699 434 662 ·
  <https://bodegafincamaranuela.com>.
- [ ] **Bodega Las Galanas** — Bodega. Los Realejos (La Cruz Santa). · 655 272 498 ·
  <https://bodegalasgalanas.es>.
- [ ] **Bodega Murcal** — Bodega. La Orotava (La Perdoma). · 616 175 152 ·
  <https://bodegasmurcal.es>.
- [ ] **Bodega Quinta San Antonio** (marca **Vinos Atlante**) — Bodega. La Orotava.
  · 610 746 163 · <https://vinosatlante.com>.
- [ ] **Bodega Tafuriaste** — Bodega. La Orotava. · 618 357 270 ·
  <https://bodegatafuriaste.com>.

### DO Valle de Güímar (4)

- [ ] **Bodega Hermanos Mesa** — Bodega. Arafo (C/ Sosa, 2). · 678 404 137 ·
  <http://bodegahermanosmesa.com>. Familiar; blancos monovarietales de parcela
  (Lo Cartas, Novelero, Oracán); viñedo del nivel del mar a 1.300 m.
- [ ] **Bodega Tempus** — Bodega. Güímar (Barranco Badajoz). · 699 069 833 ·
  <http://www.bodegatempus.com>.
- [ ] **Bodega Comarcal Valle de Güímar** — Bodega. Arafo (Ctra. La Cumbre km 4,5).
  · 922 510 437 · <http://bodegavalledeguimar.com>. ⚠ cooperativa comarcal;
  confirmar marca propia de consumo.
- [ ] **Bodegas Viña Gómez** — Bodega. Güímar (Topo Negro). · 636 955 759 ·
  <http://www.bodegasvinagomez.com>.

### DO Abona (4)

> Las fichas de este consejo (y las de Güímar) publican **«Venta en bodega: Sí/No»**,
> visitas, horarios y degustación → pista directa de canal.

- [ ] **Bodega Vento** (razón social José Damián Díaz González) — Bodega. San Miguel
  de Abona (Las Zocas). · 630 038 886 · <https://www.bodegavento.com>. Venta en
  bodega: **sí**.
- [ ] **Bodega Mencey Chasna** (Jottocar, S.L.) — Bodega. Granadilla de Abona
  (Chimiche). · 922 777 285 · <https://menceychasna.com>. Venta en bodega: **sí**.
- [ ] **Bodega Laja Blanca** (Laja Blanca, S.L.) — Bodega. Arico. · 620 539 420 ·
  <https://lajablanca.es>. Venta en bodega: **sí**.
- [ ] **Sociedad Cooperativa Agrícola San Miguel** (marca **Casmi**) — Bodega. San
  Miguel de Abona. · 922 700 300 · <https://lacasmi.com>. Venta en bodega: **sí**.
  ⚠ cooperativa agrícola; confirmar marca de vino propia.

### DO Ycoden-Daute-Isora (3)

- [ ] **Bodegas Estrada** (marca **La Calabacera**) — Bodega. Guía de Isora
  (Ctra. TF-463, km 8,1). <https://lacalabacera.com>.
- [ ] **Borja Pérez Viticultor** — Bodega. La Guancha (Av. Villa Nueva, 34).
  <https://borjaperezviticultor.com>. Marcas: **Ignios Orígenes**, Artífice.
  Referencia del vino de autor canario.
- [ ] **Bodega Viña Zanata** — Bodega. La Guancha (C/ El Sol, 3). <https://zanata.net>.

### Cortes siguientes — 53 bodegas restantes (datos ya capturados)

> **Con web propia, diferidas por tope de lote (5):** *Hacienda de Acentejo* (La
> Victoria de Acentejo, `haciendadeacentejo.com`) · *La Baldesa* (El Sauzal,
> `baldesa.com`) · *Riaba* (Tacoronte ⚠ confirmar municipio, `riaba.es`) · *Risco
> de las Vegas* (Arona, `fincavegas.com`) · *Tierras de Aponte* (Adeje,
> `tierrasdeaponte.com`).
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
  Bodegas Insulares Tenerife (Tacoronte; ojo, el CSV tiene además
  `bodegas-insulares-licores-tacoronte` → revisar si procede esa segunda fila) ·
  Suertes del Marqués y Valleoro (La Orotava) · Viñátigo (La Guancha) · Altos de
  Trevejos y Reverón (Vilaflor) · Cumbres de Abona (Arico).
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
- **Pista: existe una sexta DO, `DOP Islas Canarias`** (regional), con bodegas
  tinerfeñas que **no están en las 5 insulares ni en el CSV**: Bodega Ferrera
  (Arafo, `bodegasferrera.com`) · Piedra Fluida (La Orotava,
  `bodegapiedrafluida.com`) · Pago de los Cercados (Santa Úrsula,
  `pagodeloscercados.com`) · Finca El Ancón (La Orotava, `fincaelancon.com`) ·
  Tabares 4 (`tabares4.wine`) · Alejandro Gallo & Quíquere Wines
  (`alejandrogallowines.com`) · Ricardo Gutiérrez de Salamanca (`vinos1861.com`) ·
  Natan Afonso / Mataznos 33 · Atrevino. Fuente:
  `vinosdetenerife.es/d-o-p-islas-canarias`. Merece corte propio.

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
