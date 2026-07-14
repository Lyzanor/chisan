# Candidatos — Toledo

> Fichero creado en la pasada **DO menos cubiertas** (`docs/candidates/do-huecos.md`).
> Formato estándar de `docs/candidates/README.md`. Cada bloque indica su fuente,
> fecha y estado.

## DOP Montes de Toledo (aceite) — parte toledana (lote 18 de do-huecos)

> Fuente: **empresas certificadas del Consejo Regulador**
> (`domontesdetoledo.com/empresas-certificadas/` → 30 certificados en vigor;
> ficha `/…/` de cada empresa con dirección, web y email). La DOP cruza Toledo y
> Ciudad Real: aquí solo los operadores **de la provincia de Toledo** (municipio
> de producción de la ficha). Dedup contra `toledo.csv` el 2026-07-09 (por
> dominio y nombre sin acentos/sufijos). **Ya en CSV (7):** Casas de Hualdo (El
> Carpio de Tajo), Mora Industrial/Morainsa (Mora), Coop. Ntra. Sra. de la
> Antigua (Mora), La Pontezuela (Los Navalmorales), Almazara Villa de Orgaz
> (Orgaz), Tresces-Zarfe (Hontanar), y Aceites de Mora. Netos Toledo: **19**.
> Estado: **`unverified`**. Variedad amparada: cornicabra. Casi todas con tienda
> online → pista `Venta online=sí`, confirmar en integración.

- [x] **Aceites Consuegra** (Aceites Consuegra, S.L.) ‹→ aceites-consuegra-consuegra (verificado, VO sí)› — Aceite. Consuegra.
  <http://www.aceitesconsuegra.com>. (Distinta de la Coop. Vinícola de Consuegra
  ya en CSV.)
- [x] **Almazara San Sebastián de Gálvez** (marca **El Paraíso**) ‹→ almazara-san-sebastian-galvez-el-paraiso (verificado, VO n/c)› — Aceite.
  Gálvez. <http://www.aceiteselparaiso.es>.
- [x] **Aceites Umbrión** (S. Coop. San Sebastián de Madridejos) ‹→ aceites-umbrion-madridejos (parcial; web no accesible)› — Aceite.
  Madridejos. <http://www.aceitesumbrion.com>. Cooperativa (~1.200 socios).
- [x] **Morlin, S.A.** (marca **Toletum**) ‹→ morlin-toletum-nambroca (verificado, VO sí)› — Aceite. Nambroca. <http://www.aceitestoletum.com>.
- [x] **IFAMA, S.L.** ‹DIFERIDO: la web (arzuaganavarro.com) es la del grupo Arzuaga Navarro (Ribera del Duero, hotel 5*+Michelin); sin identidad ni tienda de AOVE Toledo → confirmar encaje vs grupo› — Aceite. Noez. <http://www.arzuaganavarro.com>. ⚠ del
  **grupo Arzuaga Navarro / Amaya Arzuaga** (Ribera del Duero); confirmar marca de
  AOVE con venta propia y encaje vs grupo.
- [ ] **Cooperativa Montes de Toledo** — Aceite. Mazarambroz. Sin web propia
  (contacto montestoledo@movistar.es). Confirmar marca de consumo.
- [x] **COTOAL, S.L.** ‹→ cotoal-el-carpio-de-tajo (verificado, VO n/c; tienda en mantenimiento)› — Aceite. El Carpio de Tajo. Web/marca vía dominio
  cotoal.com (comercial@cotoal.com); confirmar.
- [ ] **Jaramontes, S.C.L.** — Aceite. La Nava de Ricomalillo. Sin web propia
  localizada. ⚠ cooperativa, confirmar marca vs granel.
- [x] **Agrupación de Olivareros** (La Olivarera) ‹→ la-olivarera-los-navalmorales (parcial; cert mal configurado)› — Aceite. Los Navalmorales.
  Marca/dominio laolivarera.com (elias@laolivarera.com); confirmar.
- [ ] **Coop. Ntra. Sra. de la Antigua de Los Navalmorales** — Aceite. Los
  Navalmorales. Sin web propia. ⚠ homónima de la de Mora (ya en CSV): cuidar slug
  y municipio.
- [ ] **Coop. San Sebastián de El Romeral** (Sierra de El Romeral) — Aceite. El
  Romeral. Sin web propia localizada.
- [ ] **Coop. San Sebastián de Santa Ana de Pusa** — Aceite. Santa Ana de Pusa.
  Sin web propia localizada.
- [x] **Coop. Tesoro de Guarrazar** ‹→ cooperativa-tesoro-de-guarrazar-guadamur (verificado, VO sí)› — Aceite. Guadamur. <http://tesorodeguarrazar.es>.
- [x] **Coop. Ntra. Sra. de las Saleras** (marca **Saleras**) ‹→ cooperativa-las-saleras-los-navalucillos (verificado, VO sí)› — Aceite. Los
  Navalucillos. <http://www.aovesaleras.es>.
- [ ] **S.C.L. San Sebastián de Belvís** — Aceite. Belvís de la Jara. Sin web
  propia localizada.
- [x] **Óleo Quirós** (Oleoquirós, S.L.) ‹→ oleo-quiros-mascaraque (verificado, VO sí; premiada)› — Aceite (ecológico). Mascaraque.
  <http://www.oleoquiros.com>. Premiada (mejor almazara 2006, mejor AOVE de España
  2008-09).
- [ ] **Coop. Olivar del Cristo** — Aceite. Villamuelas. Sin web propia (contacto
  olivardelcristo@hotmail.com).
- [x] **Alalma del Olivo** (Finca El Torrao) ‹→ alalma-del-olivo-la-guardia (verificado, VO sí; CORRECCIÓN municipio: La Guardia, no Sonseca)› — Aceite. Sonseca. <http://www.alalmadelolivo.com>.
- [x] **Aceites Toledo, S.A.** ‹→ aceites-toledo-los-yebenes (verificado, VO n/c; empresa independiente desde 1954, no brazo de coop)› — Aceite. Los Yébenes. <http://www.aceitestoledo.com>.
  ⚠ el consejo enlaza esta ficha bajo la entrada «Coop. Ntra. Sra. de la Antigua
  de Mora» (ya en CSV, distinto municipio) → verificar si es operador propio
  (marca «Aceites Toledo»/«Óleum») o brazo comercial de aquella cooperativa.

### ✅ Corte «coops sin web» integrado en fase C (2026-07-13, lote 7) — 7 altas

Las 7 cooperativas certificadas por la DOP que quedaban `[ ]` arriba, integradas.
Varias sí tenían web propia (la nota «sin web» era incompleta):

- **Coop. San Sebastián de Belvís** (Belvís de la Jara) →
  `cooperativa-san-sebastian-de-belvis-belvis-de-la-jara` (`verificado`, **VO=sí**
  ecommerce — web `sansebastiandebelvis.es` con tienda operativa).
- **Coop. San Sebastián de El Romeral** (El Romeral) →
  `cooperativa-san-sebastian-el-romeral` (`verificado`, **VO=sí** ecommerce —
  marca Sierra de El Romeral, tienda `aceitessierradeelromeral.com`; también vino).
- **Cooperativa Jaramontes** (La Nava de Ricomalillo) →
  `cooperativa-jaramontes-sierranava-la-nava-de-ricomalillo` (`verificado`, VO=nc —
  marca Sierranava, web `jaramontes.com`; tienda en dominio aparte no verificado).
- **Coop. San Sebastián de Pusa** (Santa Ana de Pusa) →
  `cooperativa-san-sebastian-de-pusa-santa-ana-de-pusa` (`parcial` — solo registro;
  posible web de marca sin confirmar titularidad).
- **Cooperativa Oleícola Montes de Toledo** (Mazarambroz) →
  `cooperativa-oleicola-montes-de-toledo-mazarambroz` (`parcial` — solo registro,
  contacto movistar).
- **Cooperativa Olivar del Cristo** (Villamuelas) →
  `cooperativa-olivar-del-cristo-villamuelas` (`parcial` — marca propia Olivar del
  Cristo, sin web).
- **Coop. Ntra. Sra. de la Antigua de Los Navalmorales** →
  `cooperativa-ntra-sra-de-la-antigua-los-navalmorales` (`parcial`). ⚠ **Homónima
  distinta** de la Antigua de Mora (ya en CSV, marca **Olimora**, web
  `cooperativalaantigua.com`): Olimora es de la de Mora, no de esta.

## DOP Queso Manchego — queserías toledanas diferidas (heredado de `cuenca.md`, borrado 2026-07-13)

> El lote 3.1b (2026-07-12) integró las 4 queserías toledanas con web (El
> Consuelo, Pérez Arquero, Barrajón, Gallego Sanz). Quedan **3 diferidas sin
> web**, del registro del Consejo (`quesomanchego.es`):

- [x] **Quesos Reino** ‹→ quesos-reino-madridejos (parcial, VO=nc — alta nueva; quesería familiar real 5 gen., marcas Reino/El Vegazo; web quesosreino.com CAÍDA NXDOMAIN → parcial; reventa en marimancha ≠ VO)› — Lácteos y quesos. Madridejos.
- [x] **Industrias Alimentarias Martal** ‹→ already-present = `tobar-del-oso-el-toboso` (era `pendiente`, subida a **verificado, VO=sí ecommerce**): NO es madurador, elabora queso manchego propio desde 2005 con tienda online (tobardeloso.es)› — Lácteos y quesos. El Toboso.
- [x] **Asoc. Ganadera Palomares** ‹→ already-present = `asociacion-ganadera-palomares-s-a-t-la-puebla-de-almoradiel` (era `pendiente`, subida a **parcial**): elaboradora real (marca El Gigüela, SAT ganadera desde 2007, oro Fercam 2025); añadidos tel/correo/dirección/coords; sin web propia → parcial› — Lácteos y quesos. La Puebla de Almoradiel.

> ✅ **Corte cerrado (2026-07-14, fase C):** de las 3 «diferidas sin web», solo
> **Quesos Reino** era alta neta (parcial); las otras 2 ya estaban en el CSV como
> `pendiente` y se **revisaron/subieron de nivel** (Martal→Tobar del Oso a
> verificado VO=sí; Palomares a parcial). El aviso «posible madurador» de Martal
> quedó descartado: es elaboradora con tienda propia. No hizo falta releer el
> array `places` del registro: la web propia / los premios bastaron.

### Notas del lote 18 (pista para Ciudad Real — lote 19)

Operadores certificados de la DOP que son de **Ciudad Real** (para `ciudad-real.md`,
lote 19; no abrir aquí): **Aceites Malagón** (Malagón, aceitesmalagon.com);
**Grupo Montes Norte** (Malagón, grupomontesnorte.com — ⚠ gran grupo cooperativo,
mayoría de aceite ecológico, ~8 cooperativas); **Bodegas/Aceites El Progreso**
(Villarrubia de los Ojos, bodegaselprogreso.com); **Dehesa El Molinillo – Nortia
Agricultural** (Retuerta del Bullaque, dehesaelmolinillo.com, marcas «El Molinillo»
y «Navalices»); **Judisan / Aceites Moraga** (CP 13680, aceitesmoraga.es). La DOP
Montes de Toledo se solapa con el lote 19 → coordinar para no duplicar.

**Método**: `mtoledo.org` y `aceitemontesdetoledo.com` no resuelven/bloquean; el
dominio real del consejo es **`domontesdetoledo.com`** (responde con UA de
navegador). Cada empresa tiene ficha `/slug/` con dirección completa (CP+municipio
+provincia), web y email → fuente limpia para municipio de producción y provincia.
