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

- [ ] **Aceites Consuegra** (Aceites Consuegra, S.L.) — Aceite. Consuegra.
  <http://www.aceitesconsuegra.com>. (Distinta de la Coop. Vinícola de Consuegra
  ya en CSV.)
- [ ] **Almazara San Sebastián de Gálvez** (marca **El Paraíso**) — Aceite.
  Gálvez. <http://www.aceiteselparaiso.es>.
- [ ] **Aceites Umbrión** (S. Coop. San Sebastián de Madridejos) — Aceite.
  Madridejos. <http://www.aceitesumbrion.com>. Cooperativa (~1.200 socios).
- [ ] **Morlin, S.A.** (marca **Toletum**) — Aceite. Nambroca. <http://www.aceitestoletum.com>.
- [ ] **IFAMA, S.L.** — Aceite. Noez. <http://www.arzuaganavarro.com>. ⚠ del
  **grupo Arzuaga Navarro / Amaya Arzuaga** (Ribera del Duero); confirmar marca de
  AOVE con venta propia y encaje vs grupo.
- [ ] **Cooperativa Montes de Toledo** — Aceite. Mazarambroz. Sin web propia
  (contacto montestoledo@movistar.es). Confirmar marca de consumo.
- [ ] **COTOAL, S.L.** — Aceite. El Carpio de Tajo. Web/marca vía dominio
  cotoal.com (comercial@cotoal.com); confirmar.
- [ ] **Jaramontes, S.C.L.** — Aceite. La Nava de Ricomalillo. Sin web propia
  localizada. ⚠ cooperativa, confirmar marca vs granel.
- [ ] **Agrupación de Olivareros** (La Olivarera) — Aceite. Los Navalmorales.
  Marca/dominio laolivarera.com (elias@laolivarera.com); confirmar.
- [ ] **Coop. Ntra. Sra. de la Antigua de Los Navalmorales** — Aceite. Los
  Navalmorales. Sin web propia. ⚠ homónima de la de Mora (ya en CSV): cuidar slug
  y municipio.
- [ ] **Coop. San Sebastián de El Romeral** (Sierra de El Romeral) — Aceite. El
  Romeral. Sin web propia localizada.
- [ ] **Coop. San Sebastián de Santa Ana de Pusa** — Aceite. Santa Ana de Pusa.
  Sin web propia localizada.
- [ ] **Coop. Tesoro de Guarrazar** — Aceite. Guadamur. <http://tesorodeguarrazar.es>.
- [ ] **Coop. Ntra. Sra. de las Saleras** (marca **Saleras**) — Aceite. Los
  Navalucillos. <http://www.aovesaleras.es>.
- [ ] **S.C.L. San Sebastián de Belvís** — Aceite. Belvís de la Jara. Sin web
  propia localizada.
- [ ] **Óleo Quirós** (Oleoquirós, S.L.) — Aceite (ecológico). Mascaraque.
  <http://www.oleoquiros.com>. Premiada (mejor almazara 2006, mejor AOVE de España
  2008-09).
- [ ] **Coop. Olivar del Cristo** — Aceite. Villamuelas. Sin web propia (contacto
  olivardelcristo@hotmail.com).
- [ ] **Alalma del Olivo** (Finca El Torrao) — Aceite. Sonseca. <http://www.alalmadelolivo.com>.
- [ ] **Aceites Toledo, S.A.** — Aceite. Los Yébenes. <http://www.aceitestoledo.com>.
  ⚠ el consejo enlaza esta ficha bajo la entrada «Coop. Ntra. Sra. de la Antigua
  de Mora» (ya en CSV, distinto municipio) → verificar si es operador propio
  (marca «Aceites Toledo»/«Óleum») o brazo comercial de aquella cooperativa.

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
