# Candidatos — Teruel

> Origen: pasada de cobertura de capitales 2026-07-08 (la capital solo tiene 3 filas:
> Portesa, Horno Sanz, Casa Muñoz), extendida a provincia con los hallazgos reales que
> quedaron fuera del municipio. **Estado: `unverified`** — deduplicado contra
> `teruel.csv` el 2026-07-08 por nombre/dominio normalizado; antes de integrar:
> re-deduplicar con `npx pnpm list:province teruel`, confirmar actividad/dirección y
> decidir `verificacion` y `Venta online`.

## Capital (municipio de Teruel) — 3 candidatos

- [ ] **Rokelin (Jamones Roque Orriols, S.L.)** — Charcutería (jamón DOP Teruel).
  Pol. Ind. La Paz 17 (tb. parcela 55), 44195 Teruel. <https://rokelin.com/> ·
  978 604 642 · secadero@rokelin.com. Desde 1975; secadero, fábrica de embutidos,
  quesos y comidas preparadas + tiendas propias/franquicias. Tienda online propia y
  Correos Market → pista `Venta online=sí`.
- [ ] **Elaborados Las Torres (Grupo Hermanos Sánchez Andrés)** — Charcutería.
  Secadero a 900 m de altitud en Teruel ciudad. <https://www.elaboradoslastorres.es/>.
  Jamón DO Teruel V/R, jamón bodega, añejo, paleta. ⚠ Ver aviso de grupo abajo.
- [ ] **Jamón Mudéjar (Carnicería Hermanos Sánchez)** — Charcutería.
  Teruel ciudad, instalaciones a 900 m. <https://www.jamonmudejar.com/>.
  ⚠ Colisión de nombre con la fila existente *Turotrans-Tierra Mudejar* (Santa
  Eulalia): entidades distintas, cuidar slug.

> ⚠ **Aviso de grupo (resolver antes de crear dos filas):** "Elaborados Las Torres /
> Grupo Hermanos Sánchez Andrés" y "Jamón Mudéjar / Carnicería Hermanos Sánchez"
> comparten apellido, ciudad y el mismo reclamo de "secadero a 900 m". Podrían ser el
> mismo grupo familiar con dos marcas → riesgo de duplicado encubierto. Confirmar CIF
> o dirección de cada uno; si son el mismo, una sola fila con la marca principal.

## Provincia — 12 candidatos

- [ ] **Cervezas Mijares (Mijares Gourmet)** — Cerveza artesana. Rubielos de Mora.
  Agua de la Sierra de Gúdar, sin filtrar/pasteurizar. Ficha:
  <https://ponaragonentumesa.com/directorio/sector/productores/cervezas-artesanas/cervezas-mijares/>.
  ⚠ Se vende vía <https://trufasalonso.es/cervezas/> (posible mismo grupo que Trufas Alonso).
- [ ] **Castel Cerveza Artesanal** — Cerveza artesana. El Pobo. Desde 2011 (primeras
  cervezas otoño 2012). <https://aragonbeers.com/castel-cerveza-artesanal>.
- [ ] **Ordio Minero (Bieras Ordio, S.L.)** — Cerveza artesana. Blesa (Cuencas
  Mineras), nacida 2012. <https://www.ordiominero.com/>. ⚠ Desde 2017 tiene segunda
  fábrica en La Puebla de Alfindén (Zaragoza): confirmar dónde produce hoy; si toda la
  producción salió de Blesa, valorar si la fila corresponde a `zaragoza.csv`.
- [ ] **Hermanos Igado Orcal, S.A.T.** — Lácteos y quesos. Samper de Calanda.
  Miembro de la asoc. Productores de Leche y Queso de Teruel (quesosdeteruel.es).
- [ ] **Queso Artesano El Rodeño** — Lácteos y quesos. Ródenas. Misma fuente asociativa.
- [ ] **Trufas La Chaparra** — Otros (trufa negra). Fuen del Cepo, Albentosa.
  <https://www.trufateruel.com/> con tienda online → pista `Venta online=sí`.
- [ ] **La Tartuferia** — Otros (trufa negra). El Castellar. <https://latartuferia.eu/>.
- [ ] **De Trufa en Trufa** — Otros (trufa negra, ecológica). Torrelacárcel.
  <https://detrufaentrufa.com/> con tienda online → pista `Venta online=sí`.
- [ ] **Jamones Andrés Izquierdo** — Charcutería. Cedrillas, secadero desde 1989.
  <https://www.andresizquierdo.es/el-secadero/>.
- [ ] **Jamones Albarracín** — Charcutería. Albarracín.
  <https://www.jamonesalbarracin.com/>. ⚠ Encaje dudoso: mayor secadero de maquila de
  España (B2B, cura para terceros); valorar si es "productor vendible" según política.
- [ ] **Secadero La Serranía** — Charcutería (jamón DOP Teruel). Venta del Aire s/n,
  44410 Mosqueruela (1.400 m). <https://secaderolaserrania.es/>. Grupo "Secaderos al
  Natural".
- [ ] **Horno-Panadería Domingo y Cristina** — Pan y pastelería. Villastar, desde
  1967, horno de leña.

## DOP Jamón de Teruel — secaderos (lote 12 de do-huecos)

> Fuente: «Nuestra Gente» del Consejo Regulador DOP Jamón de Teruel
> (<https://jamondeteruel.com/es/nuestra-gente/>, marcas comerciales con web),
> leído vía navegador. Dedup 2026-07-09 contra `teruel.csv` y contra los
> candidatos de jamón ya listados arriba. **Ya listados/excluidos:** Rokelin,
> Elaborados Las Torres, Jamones Albarracín, Secadero La Serranía (candidatos
> arriba); Aragonia (grupoaragonia, ya en CSV, Calamocha); La Estrella del Jamón
> (Sierra Palomera, ya en CSV, Monreal). Municipio a confirmar salvo el inferible
> del nombre; **web de cada uno tomada del consejo** (casi todos con tienda →
> pista `Venta online`).

- [ ] **JAELCA (Jamones y Elaborados La Calamochina)** — Charcutería (jamón DOP
  Teruel). Calamocha. <https://www.jaelca.com/>.
- [ ] **El Calamochino** — Charcutería (jamón DOP Teruel). Calamocha.
  <https://www.elcalamochino.com/>.
- [ ] **La Monrealense** — Charcutería (jamón DOP Teruel). Monreal del Campo.
  <https://www.lamonrealense.com/>.
- [ ] **Jamones Sierra de Mora** — Charcutería (jamón DOP Teruel). Mora de
  Rubielos (confirmar). <https://www.sierrademora.com/>.
- [x] **Jamones Bronchales** — **already-present** →
  `jamones-bronchales-sl-bronchales` (limpieza 2026-07-10, dominio coincide;
  integrado tras escribirse este lote). NO crear fila.
- [ ] **Torico de Teruel** — Charcutería (jamón DOP Teruel). Teruel (confirmar).
  <https://www.toricoteruel.com/>.
- [ ] **Campo Dulce Curados** — Charcutería (jamón DOP Teruel). Confirmar
  municipio. <https://www.campodulcecurados.com/>.
- [ ] **Jamones Barriendo** — Charcutería (jamón DOP Teruel). Confirmar municipio.
  <https://www.jamonesbarriendo.es/>.
- [ ] **Bodegas Gargallo** — Charcutería (jamón/embutido DOP Teruel). Confirmar
  municipio. <https://www.bodegasgargallo.com/>.
- [ ] **Jamones Carbó** — Charcutería (jamón DOP Teruel). Confirmar municipio.
  <https://www.jamonescarbo.com/>.
- [ ] **Jamones Casa Domingo** — Charcutería (jamón DOP Teruel). Confirmar
  municipio. <https://www.jamonescasadomingo.es/>.
- [ ] **Jamones Casa Vieja** — Charcutería (jamón DOP Teruel). Confirmar
  municipio. <https://www.jamonescasavieja.es/>.
- [ ] **Jamones Josanz** — Charcutería (jamón DOP Teruel). Confirmar municipio.
  <https://www.jamonesjosanz.com/>.
- [ ] **Jamones Peñarroya** — Charcutería (jamón DOP Teruel). Confirmar municipio.
  <https://www.jamonespenarroya.com/>.
- [ ] **Jamones Castelfrío** — Charcutería (jamón DOP Teruel). Confirmar
  municipio. <https://www.jamonescastelfrio.es/>.
- [ ] **Fuenjamón** — Charcutería (jamón DOP Teruel). Confirmar municipio.
  <https://www.fuenjamon.com/>.
- [ ] **Jamones Ramiro Guillén** — Charcutería (jamón DOP Teruel). Confirmar
  municipio. <https://www.jamonesramiroguillen.es/>.
- [ ] **Jamones El Rullo** — Charcutería (jamón DOP Teruel). Confirmar municipio.
  <https://www.jamoneselrullo.com/>.
- [ ] **Jamones Pastor** — Charcutería (jamón DOP Teruel). Confirmar municipio.
  <https://www.jamonespastor.com/>.
- [x] **Jamones Casa Conejos** — **already-present** →
  `jamones-casa-conejos-sa-cedrillas` (limpieza 2026-07-10, dominio coincide).
  NO crear fila.
- [ ] **Alfonso Sáez** — Charcutería (jamón DOP Teruel). Confirmar municipio.
  <https://www.alfonsosaez.com/>.
- [ ] **Jamones El Sabinar** — Charcutería (jamón DOP Teruel). Confirmar
  municipio. <https://www.jamoneselsabinar.es/>.
- [ ] **Jamón Villamón** — Charcutería (jamón DOP Teruel). Confirmar municipio.
  <https://www.jamonvillamon.com/>.

> ⚠ **Excluidos por regla dura (distribuidores / grandes grupos / no turolenses):**
> Espuña, Noel, Vall Companys, Eroski, Comercial Logística, Distribuciones Rodrigo,
> Cartesa, Cárnicas/Jamones y Cecinas, Grupo Yumacor, Grupo Térvalis–Airesano,
> Jamón Aragón, Grupo Arco Iris, La Garriga Charcutería (Barcelona), Jamones Los
> Alcores (Sevilla), La Casa de los Jamones (minorista), Dulces de Teruel (no es
> jamón). ⚠ **Centelles y Buj** (<https://www.centellesybuj.com/>) figura aquí y
> también en el registro DOP Jabugo (lote 5, Huelva): confirmar si es el mismo
> grupo con secadero en Teruel antes de crear fila; cuidar duplicado entre
> provincias.

## DOP Aceite del Bajo Aragón + DOP Melocotón de Calanda (lote 13 de do-huecos)

> Fuentes (vía navegador): productores DOP Aceite del Bajo Aragón
> (<https://aceitedelbajoaragon.es/productores>, 27 empresas con dirección, tel y
> marca) + socios DOP Melocotón de Calanda (<https://www.melocotondecalanda.com/>,
> webs de comercializadoras). Dedup 2026-07-09 contra `teruel.csv`. **Solo
> provincia de Teruel** (10 empresas de aceite están en Zaragoza — Belchite,
> Caspe, Fabara, Fayón, Maella — y son pista para `zaragoza.md`, no se abren
> aquí). **Ya en el CSV (excluidas):** Almazara Artal (Albalate), Coop. del
> Mezquín (La Codoñera); Cofruval (Puigmoreno, melocotón).

### DOP Aceite del Bajo Aragón — almazaras de Teruel (15)

- [ ] **Aceites Albalate, S.L.** — Aceite. Albalate del Arzobispo. · 978 813 104.
- [ ] **La Masada Roya (Valero Romeo)** — Aceite. Andorra. Marca «La Masada Roya».
  · 627 027 366.
- [ ] **Coop. de Aceites del Matarraña, S.C.L.** — Aceite. Calaceite. · 978 851 014.
- [ ] **Productos de Calanda, S.L.** — Aceite (+ melocotón). Calanda. Marca
  «Marchenica». · 978 847 904.
- [x] **Coop. del Campo San Miguel** (Calanda) — **already-present** →
  `cooperativa-del-campo-san-miguel-calanda` (limpieza 2026-07-10). Si esa fila
  no refleja el aceite DOP Bajo Aragón, anotarlo al verificar. NO crear fila.
- [ ] **La Calandina, S. Coop.** — Aceite (+ melocotón DOP). Calanda. Marca «La
  Calandina». <https://lacalandina.com/> · 978 846 278.
- [ ] **Aceites y Encurtidos Ismael y Magallón, S.L.** — Aceite. Calanda. Marca
  «Real de Vellón». · 978 846 665.
- [ ] **Coop. del Campo San Isidro (Mazaleón)** — Aceite (+ melocotón). Mazaleón.
  Marcas «Mazaleón», «A2». <https://www.cooperativamazaleon.es/> · 978 898 693.
- [ ] **Rey Solé, Antonio** — Aceite. Oliete. Marca «Mi Olivo». · 974 464 722.
- [ ] **Coop. Oleícola Aragonesa de Valdealgorfa** — Aceite. Valdealgorfa. Marca
  «Palacio de Andilla». · 978 857 030.
- [ ] **Coop. del Campo «Sección Almazara»** — Aceite. Valderrobres. Marca «Ermita
  de los Santos». · 978 850 082.
- [ ] **Torre Gachero, S.L.** — Aceite. Valderrobres. Marca «Torregachero».
  · 978 890 513.
- [ ] **Fernando Alcober e Hijos, S.A.** — Aceite. Valdetormo. Marca «Alcober».
  · 978 858 005.
- [ ] **Coop. San Antonio Abad** — Aceite. Valdetormo. · 978 858 007.
- [ ] **Coop. del Campo San Miguel (Valjunquera)** — Aceite. Valjunquera. Marca
  «Juncoliva». · 978 854 158.

### DOP Melocotón de Calanda — Teruel (comercializadoras net-new)

> Nota: varias inscritas del melocotón son las mismas cooperativas del aceite
> (La Calandina, Coop. Mazaleón, Productos de Calanda) → una sola fila, anotando
> que también hacen melocotón DOP. Aquí solo las **específicas de fruta** no
> listadas ya.

- [x] **Frutícola Bajoaragonesa** — **movida a `zaragoza.md`** (limpieza
  2026-07-10): es de **Caspe (Zaragoza)**, no de Teruel — estaba duplicada entre
  ambos ficheros. Ver lote 15 en `zaragoza.md`.
- [ ] **Melocotón La Arenosa** — Fruta y verdura (melocotón DOP). Confirmar
  municipio. <http://melocotonlaarenosa.com/>.

> ⚠ **Melocotón — pista para `zaragoza.md` (no abrir):** Magalia (Coop. San
> Lorenzo, Maella), Fruma / Frutícola Maellana (Maella), La Chipranesca (Chiprana)
> son de provincia de Zaragoza. ⚠ **Aceite — pista para `zaragoza.md`:** Almazara
> de Jaime y Molino Alfonso (Belchite), Coop. Frutícola Compromiso de Caspe,
> Coop. San Isidro y Granja Brunet (Fabara), Coop. San Sebastián (Fayón),
> Frutícola Maellana/Alcañiz Millán/San Lorenzo/Gil Egerique (Maella).

## Descartados en esta pasada (no repasar)

- *Trufato* (<https://trufato.es/>): municipio no localizable y perfil de
  distribuidor/comercializador, no productor.
- *Degusta Teruel* y *Sabores de Teruel*: tiendas online multiproducto, minoristas.
- *Asociación Turolense de Productores de Leche y Queso* (Aguilar del Alfambra):
  asociación, no productor; sus socios sí (dos arriba; Tronchón y Albarracín ya
  estaban en el CSV).

## Ya presentes en `teruel.csv` (comprobado 2026-07-08)

Miel Luas (Ladruñán) · Queseros Artesanos de Tronchón · Quesos Artesanos La Val
(Mezquita de Jarque) · Quesos Zariche (Celadas) · Queso Artesano de Teruel Sierra de
Albarracín.
