# Candidatos — Ciudad Real

> Fichero creado en la pasada **DO menos cubiertas** (`docs/candidates/do-huecos.md`).
> Formato estándar de `docs/candidates/README.md`. Cada bloque indica su fuente,
> fecha y estado.

## DOP Montes de Toledo (parte CR) + DOP Aceite Campo de Montiel (lote 19 de do-huecos)

> Dedup contra `ciudad-real.csv` el 2026-07-09 (por dominio y nombre sin acentos).
> Estado: **`unverified`**. **El hueco resultó bastante menor de lo estimado en el
> diagnóstico**: de los dos registros salen **7 candidatos netos**, no decenas.
> Razones en las notas de abajo (el registro de Campo de Montiel no es público y
> su cara comercial es una cooperativa de 2º grado ya presente en el CSV).

### DOP Montes de Toledo — operadores de Ciudad Real (2)

> Fuente: «Empresas certificadas» del consejo (`domontesdetoledo.com`), fichas con
> dirección completa — capturadas en el **lote 18**, que trató la parte toledana.
> De los 30 certificados, 5 son de Ciudad Real: 1 ya en CSV, 1 excluido por grupo,
> 1 ya presente como bodega, y estos 2 netos.

- [x] **Aceites Moraga** (Judisan, S.L.) ‹→ aceites-moraga-judisan-fuente-el-fresno (parcial; hosting suspendido, venta directa en almazara)› — Aceite. Fuente el Fresno.
  <https://aceitesmoraga.es> · 926 806 029. Empresa familiar desde 1974; **venta
  directa en la almazara** → pista `Venta online=sí` (confirmar tienda).
- [x] **Dehesa El Molinillo** (Nortia Agricultural, S.A.U.) ‹→ dehesa-el-molinillo-retuerta-del-bullaque (verificado, VO sí; Nortia vende producto propio)› — Aceite. Retuerta del
  Bullaque (Finca El Molinillo). <https://www.dehesaelmolinillo.com>. Marcas «El
  Molinillo» y «Navalices»; olivar de cornicabra plantado hacia 1950. Premio
  Cornicabra 2026 y Gran Selección Campo y Alma 2026. ⚠ la titular **Nortia** es
  un grupo inversor; confirmar que la finca/marca vende al público con entidad
  propia.

### DOP Aceite Campo de Montiel — almazaras socias (5)

> **El consejo no publica registro**: `dopaceitecampodemontiel.es` tiene las
> secciones «Listado de almazaras» y «Envasadores» vacías («Estamos trabajando
> para completar esta sección», desde 2018); MAPA y JCCM solo dan la asociación
> gestora. Fuente usada: la **Cooperativa de 2º Grado Campo de Montiel**
> (`campodemontiel.com/socios/`), que agrupa las 6 almazaras de la comarca (5
> cooperativas + 1 S.A. asociada) y **comercializa el aceite de todas ellas**.
>
> ⚠ **Aviso de triaje que afecta a las 5**: la marca de consumo y la tienda son de
> la cooperativa de 2º grado (**ya en el CSV** como
> `cooperativa-campo-de-montiel-villanueva-de-los-infantes`). Estas socias muelen
> y dan servicio al socio (suministros, gasóleo, asesoramiento), pero **no se les
> ha localizado marca propia ni venta al público**. Antes de integrar, confirmar
> venta en almazara o marca propia; si no la hay, son maquila/B2B → **descartar
> por regla dura** y quedarse solo con la de 2º grado.

- [x] **Cooperativa San Gregorio** ‹DESCARTADO: maquila/B2B, sin marca ni venta propia; su aceite lo comercializa la coop de 2º grado ya en CSV› — Aceite. Almedina. ~200 socios, fundada 1949.
  <https://cooperativasangregorio.blogspot.com>. ⚠ homónima de
  `cooperativa-san-gregorio-arenales-de-san-gregorio` (Arenales de San Gregorio,
  otro municipio, ya en CSV) → cuidar slug.
- [x] **Cooperativa San Bartolomé Apóstol** ‹DESCARTADO: maquila/B2B (coop de 2º grado)› — Aceite. Santa Cruz de los Cáñamos.
  Fundada 1967, 304 socios olivareros.
- [x] **Cooperativa San José** ‹DESCARTADO: maquila/B2B (coop de 2º grado)› — Aceite. Villamanrique. Fundada 1945, 558 socios ·
  926 354 062 / 602 652 528.
- [x] **Cooperativa San Isidro Labrador** ‹DESCARTADO: maquila/B2B (coop de 2º grado)› — Aceite (en conversión a **ecológico**).
  Villanueva de la Fuente. Fundada 1952, 481 socios; olivar a ~900 m. ⚠ homónima
  de `cooperativa-san-isidro-pedro-munoz` (Pedro Muñoz, ya en CSV) → cuidar slug.
- [x] **Cooperativa Olivarera San Isidro** ‹DESCARTADO: maquila/B2B (coop de 2º grado)› — Aceite (cornicabra). Torrenueva.
  Fundada 1953, ~400 socios. ⚠ tercer homónimo «San Isidro» en la provincia.

### Pista provincial — almazaras fuera de estas dos DOP (3)

> No pertenecen a ninguna de las dos denominaciones del lote (están en Campo de
> Calatrava), pero son almazaras reales de la provincia sin ficha en el CSV.
> Fuente: directorio sectorial `oleista.com/es/almazaras/ciudad-real` (el mismo
> que ya citan varias filas del CSV). Triar en una pasada provincial, no en esta.

> ✅ **Las 3 integradas en fase C, lote 4 (2026-07-13)** — pasada provincial hecha:

- [x] **Olivapalacios, S.L.** → `olivapalacios-palacio-de-los-olivos-almagro`
  (`verificado`, **VO=sí** ecommerce). ⚠ **Municipio corregido: Almagro** (finca
  Los Palacios, Ctra. CM-4107), no Bolaños — lo confirman su web y Facebook. Marca
  Palacio de los Olivos, nº1 EVOO World Ranking picual; tienda propia operativa.
- [x] **Pago Piedrabuena** → `pago-piedrabuena-ballesteros-de-calatrava`
  (`parcial`, VO=nc). Almazara ecológica de finca (100 ha, cornicabra); su web
  `pagopiedrabuena.es` devolvió **403 al fetch** (bloqueo técnico) → sin
  verificador en vivo, tope parcial.
- [x] **COLIVAL** → `colival-valdepenas` (`verificado`, **VO=sí** ecommerce).
  ⚠ resuelto: la coop **sí tiene marcas de consumo propias** (Valdenvero, Sierra
  Prieta, Exemplum) y tienda online operativa (envíos 24-48 h) → entra por la
  regla de coop con marca propia.

### Notas del lote 19

- **Excluido por gran grupo**: **Grupo Montes Norte** (Malagón,
  grupomontesnorte.com) — 8 cooperativas integradas, ~30 entidades, ~50 millones
  de kg de aceite/año y almazaras en varias provincias → regla dura de grandes
  grupos industriales. (Es, aun así, el mayor productor español de AOVE ecológico;
  si alguna vez se replantea el criterio de tamaño, revisarlo aquí.)
- **Ya en `ciudad-real.csv` (no son altas)**: Aceites Malagón (Malagón),
  Fábrica de Aceites San Sebastián (Santa Cruz de Mudela — es la S.A. asociada de
  la coop. de 2º grado), Cooperativa Campo de Montiel (Villanueva de los
  Infantes), Cooperativa Virgen de las Viñas (Tomelloso, bodega+almazara).
- ✅ **Doble faceta vino/aceite resuelta** (fase C lote 4, 2026-07-13):
  **Cooperativa El Progreso** (`cooperativa-el-progreso-villarrubia-de-los-ojos`)
  upgradeada — era fila legacy `pendiente` con web = directorio apoloybaco; ahora
  web real `bodegaselprogreso.com` (leída en vivo: vino Viña Xétar + AOVE
  certificado DOP Montes de Toledo, tienda con checkout), categoría **«Aceite y
  bodega»** (precedente La Unión de Montilla), contacto actualizado →
  **`verificado`, VO=sí ecommerce**.
- ⚠ **Geo-warnings preexistentes detectados 2026-07-13** (no tocados, 2ª pasada):
  `cooperativa-virgen-del-carmen-almodovar-del-campo` (22 km, ¿Abenójar?),
  `cooperativa-vinicola-del-carmen-campo-de-criptana` (25 km, coords junto a
  Tomelloso) y `mieles-san-benito-almodovar-del-campo` (47 km, ¿pedanía San
  Benito? más cerca de Torrecampo/Córdoba).
- **Método / fuentes muertas**: `aceitecampodemontiel.com`, `dopcampodemontiel.es`
  y `campodemontiel.org` no resuelven; el dominio vivo es
  **`dopaceitecampodemontiel.es`** (pero con el registro sin publicar). La página
  de JCCM (`pagina.jccm.es/agricul/…/aceite_montiel.htm`) está caída. El camino
  que funcionó fue la web de la **cooperativa de 2º grado**.

## Traspaso desde la verificación de Albacete (2026-07-21)

> Estado: **`unverified` como fila de Ciudad Real**, pero la identidad y la
> ubicación ya están comprobadas contra la web del propio productor.

- [ ] **Embutidos Carrizal** — Pol. Ind. Las Suertes, C/ Juan Amador Fresneda, 5,
  13330 Villanueva de la Fuente. Embutidos frescos, curados, fritos y salazones
  de elaboración propia. Web `https://www.embutidoscarrizal.com/`,
  `contacto@embutidoscarrizal.com`, 967 396 255. Tienda propia operativa con
  precios de 2,95 a 36,75 € y carrito → `Venta online=sí`, canal `ecommerce`.
  Categoría **Charcutería**.

  Venía como `embutidos-carrizal-povedilla` en `albacete.csv` y se dio de baja
  con `purge:other-province`: su página de contacto separa la **carnicería** de
  Povedilla (Albacete) de la **fábrica**, que está en Villanueva de la Fuente.
  Al dar el alta, poner la dirección de la fábrica y dejar la carnicería como
  punto de venta en la descripción; la marca conserva el «de Povedilla» del
  origen familiar, así que el nombre no contradice el municipio de la fábrica.

  Su logotipo ya estaba descargado y se retiró al purgar la fila para no dejar
  una imagen huérfana. Se recupera del histórico:
  `git show 708685e:public/productores/castilla-la-mancha/albacete/embutidos-carrizal-povedilla.webp`.
