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

- [ ] **Aceites Moraga** (Judisan, S.L.) — Aceite. Fuente el Fresno.
  <https://aceitesmoraga.es> · 926 806 029. Empresa familiar desde 1974; **venta
  directa en la almazara** → pista `Venta online=sí` (confirmar tienda).
- [ ] **Dehesa El Molinillo** (Nortia Agricultural, S.A.U.) — Aceite. Retuerta del
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

- [ ] **Cooperativa San Gregorio** — Aceite. Almedina. ~200 socios, fundada 1949.
  <https://cooperativasangregorio.blogspot.com>. ⚠ homónima de
  `cooperativa-san-gregorio-arenales-de-san-gregorio` (Arenales de San Gregorio,
  otro municipio, ya en CSV) → cuidar slug.
- [ ] **Cooperativa San Bartolomé Apóstol** — Aceite. Santa Cruz de los Cáñamos.
  Fundada 1967, 304 socios olivareros.
- [ ] **Cooperativa San José** — Aceite. Villamanrique. Fundada 1945, 558 socios ·
  926 354 062 / 602 652 528.
- [ ] **Cooperativa San Isidro Labrador** — Aceite (en conversión a **ecológico**).
  Villanueva de la Fuente. Fundada 1952, 481 socios; olivar a ~900 m. ⚠ homónima
  de `cooperativa-san-isidro-pedro-munoz` (Pedro Muñoz, ya en CSV) → cuidar slug.
- [ ] **Cooperativa Olivarera San Isidro** — Aceite (cornicabra). Torrenueva.
  Fundada 1953, ~400 socios. ⚠ tercer homónimo «San Isidro» en la provincia.

### Pista provincial — almazaras fuera de estas dos DOP (3)

> No pertenecen a ninguna de las dos denominaciones del lote (están en Campo de
> Calatrava), pero son almazaras reales de la provincia sin ficha en el CSV.
> Fuente: directorio sectorial `oleista.com/es/almazaras/ciudad-real` (el mismo
> que ya citan varias filas del CSV). Triar en una pasada provincial, no en esta.

- [ ] **Olivapalacios, S.L.** — Aceite. Bolaños de Calatrava.
- [ ] **Pago Piedrabuena** — Aceite. Ballesteros de Calatrava.
- [ ] **COLIVAL** (Soc. Coop. Olivarera de Valdepeñas) — Aceite. Valdepeñas.
  ⚠ cooperativa olivarera grande, confirmar marca de consumo.

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
- **Doble faceta vino/aceite**: **Cooperativa El Progreso** (Villarrubia de los
  Ojos, bodegaselprogreso.com) está en el CSV como **Bodega** pero también es
  operador certificado de la DOP Montes de Toledo → decidir si se añade categoría
  Aceite o segunda fila (mismo precedente que «La Unión de Montilla» en el lote 3).
- **Método / fuentes muertas**: `aceitecampodemontiel.com`, `dopcampodemontiel.es`
  y `campodemontiel.org` no resuelven; el dominio vivo es
  **`dopaceitecampodemontiel.es`** (pero con el registro sin publicar). La página
  de JCCM (`pagina.jccm.es/agricul/…/aceite_montiel.htm`) está caída. El camino
  que funcionó fue la web de la **cooperativa de 2º grado**.
