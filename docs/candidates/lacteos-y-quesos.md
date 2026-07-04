# Candidatos — Lácteos y quesos (10 provincias con baja cobertura)

> Origen: pasada transversal de descubrimiento web (2026-07-04) sobre las 10 provincias
> con menos filas de `Lácteos y quesos`. Fuentes: directorios provinciales, listados DOP,
> asociaciones de queseros, prensa gastronómica y el listado de queserías andaluzas del
> blog de Quesos Dehesa Dos Hermanas.
>
> **⮕ Cierre (2026-07-04):** verificación e integración completadas el mismo día.
> **27 integrados** (5 `verificado` / 22 `parcial`) en sus CSV con evidencia JSONL;
> **2 rechazados** en verificación (Sierra del Fondón, Cingle Vermell). `verify:data`
> en verde. Esta nota queda como histórico; no es cola de revisión. Mejoras futuras:
> los 22 `parcial` son candidatos a upgrade si aparece fuente verificadora (web viva,
> social activa o ficha GMaps), y quedan sin imagen todos los nuevos.

## Almería (2 → 8 filas)

- [x] **Quesos El Pericho (Roquetas de Mar)** — integrado `queseria-el-pericho-roquetas-de-mar`
  (`parcial`): web oficial con DNS roto (SERVFAIL) el 2026-07-04; se mantiene URL.
- [x] **Quesería Sierra del Fondón (Fondón)** — rejected (2026-07-04): su ficha en la
  Asociación de Queseros Artesanos indica **"sin actividad"**. No se crea fila.
- [x] **La Pastora de Taberno (Taberno)** — integrado `la-pastora-de-taberno` (`verificado`,
  VO=no): web oficial viva sin tienda.
- [x] **Quesería Sierra de Bédar (Bédar)** — integrado `quesos-sierra-de-bedar` (`parcial`).
  Razón social: Quesería Loma del Campico.
- [x] **Quesería El Cañao (Abrucena)** — integrado `queseria-el-canao-abrucena` (`parcial`).
- [x] **Quesos Medal Laujar (Laujar de Andarax)** — integrado `queseria-medal-laujar`
  (`parcial`): antigua tienda quesosmedallaujar.es en NXDOMAIN.
- [x] **Roca Caprina (Abla)** — integrado `roca-caprina-abla` (`parcial`).

## Huelva (3 → 9 filas)

- [x] **Quesería La Nava (Aracena)** — integrado `queseria-la-nava-aracena` (`verificado`,
  VO=no: la "Tienda" de su web es física, sin carrito).
- [x] **Quesos El Buitrón (Zalamea la Real)** — integrado `quesos-el-buitron-zalamea-la-real` (`parcial`).
- [x] **Quesos El Sequillo (Almonte)** — integrado `quesos-el-sequillo-almonte` (`parcial`):
  web con certificado TLS caducado el 2026-07-04, se mantiene URL.
- [x] **Quesos Flor Sierra del Viso (Santa Olalla del Cala)** — integrado
  `quesos-flor-sierra-del-viso-santa-olalla-del-cala` (`parcial`).
- [x] **Quesos Reyes (Cala)** — integrado `quesos-reyes-cala` (`parcial`). FB "Quesería Los
  Reyes" sin confirmar como suyo → no enlazado.
- [x] **Quesos Sierra del Romero (La Granada de Riotinto)** — integrado
  `quesos-sierra-del-romero-la-granada-de-riotinto` (`parcial`).

## Guadalajara (6 → 7 filas)

- [x] **Quesos Seguntino (Sigüenza)** — integrado `quesos-seguntino-siguenza` (`parcial`):
  la antigua web/tienda quesoseguntino.es no resuelve el 2026-07-04.

## Jaén (7 → 11 filas)

- [x] **Quesos Cumbres del Segura** — integrado `quesos-cumbres-del-segura-santiago-pontones`
  (`parcial`): municipio fijado en **Santiago-Pontones** (obrador); el listado DDH decía Úbeda
  (probable sede fiscal). Web cumbresdelsegura.com en construcción.
- [x] **Quesos Delicapra (Campillo de Arenas)** — integrado
  `delicapra-lacteos-caprinos-campillo-de-arenas` (`verificado`, VO=no): es la marca de
  Lácteos Caprinos S.A., fábrica local de Sierra Mágina (perfil tipo LIASA, documentado).
- [x] **Lácteos La Ñora (Alcalá la Real)** — integrado `lacteos-la-nora-alcala-la-real` (`parcial`).
- [x] **Quesos Artesanos Sierra de la Hoya (Noalejo)** — integrado
  `quesos-sierra-de-la-hoya-noalejo` (`parcial`). Empresa distinta de Serranía de Noalejo.

Nota dedup: **Quesería La Pasiega (Noalejo)** = already-present — marca de
`queseria-artesanal-serrania-de-noalejo`.

## Córdoba (8 → 16 filas)

- [x] **Quesos Los Peña (Baena)** — integrado `quesos-los-pena-baena` (`parcial`, sin tel público).
- [x] **Quesería ComoCabras (Adamuz)** — integrado `queseria-comocabras-adamuz` (`parcial`):
  webs .com/.es en NXDOMAIN, FB oficial enlazado. Distinta de la coop. Como Cabras (Ourense).
- [x] **El Cerrillo de los Pastores (Fuente Carreteros)** — integrado
  `el-cerrillo-de-los-pastores-fuente-carreteros` (`parcial`).
- [x] **Dehesa Las Tobosas (Hinojosa del Duque)** — integrado
  `dehesa-las-tobosas-hinojosa-del-duque` (`parcial`).
- [x] **Quesos Natalia (La Carlota)** — integrado `quesos-natalia-la-carlota` (`parcial`,
  aldea Monte Alto).
- [x] **Quesos El Molino (La Carlota)** — integrado `quesos-el-molino-la-carlota` (`parcial`,
  S.A.L. de 1996).
- [x] **Quesos Quinkana (Fuente Palmera)** — integrado `quesos-quinkana-fuente-palmera`
  (`parcial`): quinkana.es viva pero en modo mantenimiento; tienda queseriaartesana.es caída.
- [x] **Reina Cabra (La Carlota)** — integrado `reina-cabra-la-carlota` (`parcial`).

## Tarragona (8 → 9 filas)

- [x] **Formatgeria Punta Calda (L'Ametlla de Mar)** — integrado
  `formatgeria-punta-calda-lametlla-de-mar` (`parcial`): ficha de turismo municipal con
  contacto completo y venta directa.
- [x] **Cingle Vermell (Alforja)** — rejected (2026-07-04): es una **asociación cultural**
  de recuperación de oficios (talleres de queso, pan, carboneo), no un productor comercial.
  Hallazgo colateral: *Formatge de pastor La Planeta* es de Xert (Castellón) y **ya está**
  en `castellon.csv` (`formatgeria-artesana-la-planeta-xert`).

## Pontevedra (8 → 9 filas)

- [x] **Lácteos Farelo (Agolada)** — integrado `lacteos-farelo-agolada` (`verificado`,
  **VO=sí** ecommerce): web viva con compra directa, premios 2025.

Nota dedup: **Cobideza S.C.G.** = already-present — cooperativa de `dona-cobina-agolada`.

## Alicante y Valencia (sin altas)

Sin candidatos netos (catálogos maduros). Descartes documentados: Quesería La Abuela (Oliva) =
comercializadora sin obrador; Queserías Cuquerella (Real de Gandia) = inactiva; "quesos frescos
de Bolbaite" sin nombre de negocio. **Simona Coop. Valenciana** = `heretat-de-pere-quatretonda`.

## Ourense (9 → 10 filas)

- [x] **Quesos La Montaña de Entrimo (Entrimo)** — integrado `quesos-la-montana-de-entrimo`
  (`verificado`, **VO=sí** ecommerce): web viva con tienda (carrito, envíos).

## Descartes documentados (no re-investigar sin motivo)

Fuera de la provincia objetivo:
- Quesos Rufino → Oliva de la Frontera (**Badajoz**), pese a venderse como "queso de Huelva".
- Queixería Catadoiro, Queixería Daniberto, Queserías Prado (Monforte), Bisqato (Guitiriz),
  Queixería Fontelas, Airas Móniz (Chantada) → **Lugo**.
- Queinaga (Curtis), Lácteos O Casal (San Sadurniño), Casa Grande de Xanceda (Mesía) → **A Coruña**.
- Formatgeria La Frasera (Vilafranca del Penedès), La Torre d'en Roca (Sallent), Cal Vicens
  (Sta. Margarida de Montbui) → **Barcelona**. Formatgeria Montsent (Rialp) → **Lleida**.
- Formatge de pastor La Planeta (Xert) → **Castellón**, ya presente.
- El Sueño del Quesero → **Albacete**, y es tienda/afinador. Quesos Gran Gusto/El Piconero →
  sede Ciudad Real/Córdoba capital, perfil industrial-exportador.

No productores (tienda/parada/afinador/asociación): Formatgeria Magda (Mercat de Tarragona),
La Majada Quesos y Llamas Centelles (València), Queixo e aparte (Pontevedra), Carabuñas
(distribuidor, Ourense), La Trastienda del Jamón / Saborea Huelva (tiendas online),
Associació Cingle Vermell (Alforja).

Sin rastro verificable o sin actividad: "Las Delicias del Queso" (Linares) — ficha basura de
directorio; Quesería Sierra del Fondón (Fondón) — "sin actividad" en la ficha de su asociación.
