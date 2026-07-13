# Candidatos — Jaén

> Origen: pasada **DO menos cubiertas** (`docs/candidates/do-huecos.md`). Cada
> sección corresponde a un lote de esa pasada. **Estado: `unverified`** —
> deduplicado contra `data/csv/andalucia/jaen.csv` por dominio/nombre normalizado.
> Antes de integrar: re-deduplicar con `npx pnpm list:province jaen`, confirmar
> actividad/dirección/web, aplicar las reglas duras de triaje del ledger y decidir
> `verificacion` y `Venta online`.

## DOP Sierra Mágina (aceite, lote 7 de do-huecos)

> Fuente de partida: «Nuestras Empresas» / «Nuestras Marcas» del Consejo Regulador
> DO Sierra Mágina (`sierramagina.org` / `aove.sierramagina.org` — bloquean el
> fetch anónimo; lista reconstruida de esas páginas vía buscador + `degustajaen`).
> ~23 almazaras inscritas, 15 municipios de la comarca. Dedup 2026-07-09.
> **Ya en el CSV (excluidas):** Oro de Cánava (Coop. Ntra. Sra. de los Remedios,
> Mancha Real), Señorío de Camarasa (Coop. Santa Isabel, Torres). Casi todas son
> cooperativas olivareras que venden su AOVE con **marca propia** (tienda de
> almazara/online) → entran, pero confirmar caso a caso que no sean solo sección
> de graneles. Municipio = donde está la almazara.

> Webs/teléfonos añadidos en la pasada de enriquecimiento 2026-07-09 (búsqueda web
> + fichas del consejo). **Todas tienen tienda online propia → pista
> `Venta online=sí`** salvo donde se indique.

> ✅ **Lote 2.2a integrado 2026-07-10**: 11 altas (9 `verificado`+VO=sí; Sierra de
> Arbuniel y Solana de Cárchel `parcial` por web 500/DNS). Todas las cooperativas
> venden AOVE con marca propia y tienda online → lote de alto rendimiento.
> **Corrección**: Oleozumo está en **Mancha Real**, no Bedmar. **Ya en el CSV**
> (skip): San Roque (Carchelejo) y El Torito Bravo (Campillo de Arenas). Slugs con
> prefijo `cooperativa-*`, `oleozumo-mancha-real`, `finca-alamillos-del-prior-jimena`.

- [ ] **Cooperativa Stmo. Cristo de la Misericordia** — Aceite. Jódar. Marca «La
  Quinta Esencia». <https://laquintaesencia.com/>.
- [ ] **Cooperativa Bedmarense** — Aceite. Bedmar. Marcas «Magnasur» / «Oro
  Magnasur». <https://magnasur.com/>.
- [ ] **Oleozumo S.L.** — Aceite. Bedmar. Marca «Orozumo». <https://www.oleozumo.com/>.
- [x] **Cooperativa Ntra. Sra. de la Paz** — **already-present** →
  `s-c-a-nuestra-senora-de-la-paz-belmez-de-la-moraleda` (limpieza 2026-07-10,
  dominio `laperlademagina.es` coincide). NO crear fila.
- [ ] **Cooperativa San Francisco** — Aceite. Albanchez de Mágina. Marcas «Reino
  de Jaén», «Aznaitín», «Molino la Unión». <https://www.aovesierramagina.com/> ·
  953 358 353. Cooperativa centenaria (1919).
- [ ] **Cooperativa La Unión del Santo Cristo** — Aceite. Cabra del Santo Cristo.
  Marca «Salud Sierra». <https://saludsierra.es/>.
- [ ] **Cooperativa Unión Oleícola Cambil** — Aceite. Cambil. Marca «Esmeralda de
  Mágina». <https://esmeraldamagina.es/> · 953 300 355.
- [x] **Cooperativa Trujal de Mágina** — **already-present** →
  `sca-trujal-del-magina-cambil` (limpieza 2026-07-10, dominio coincide). NO
  crear fila.
- [ ] **Cooperativa Ntra. Sra. de la Cabeza** — Aceite. Campillo de Arenas. Marcas
  «Vergilia» / «Oro Puerta de Arenas».
  <https://cooperativacampillodearenas.com/> · 953 309 027.
- [x] **Cooperativa San Isidro Labrador** (Huelma) — **already-present** →
  `sca-san-isidro-labrador-huelma` (limpieza 2026-07-10, dominio coincide; la
  propia nota de homónimos de este fichero ya lo decía). NO crear fila.
- [ ] **Cooperativa Ntra. Sra. del Rosario** — Aceite. Arbuniel (Cambil). Marca
  «Sierra de Arbuniel». <https://www.aceitesierradearbuniel.com/> · 953 304 407.
- [ ] **Cooperativa San Antonio Abad** — Aceite. Cárchel (Cárcheles). Marca
  «Solana de Cárchel». <https://www.aceitesolanadecarchel.com/> · 953 302 332.
- [ ] **Cooperativa San Roque** — Aceite. Carchelejo (Cárcheles). Marcas «Tierras
  del Marquesado» (picual) y «Emblema» (manzanillo). <https://scasanroque.com/>.
- [ ] **Cooperativa San Sebastián** — Aceite. La Guardia de Jaén. Marca «Señorío
  de Mesía». <https://senoriodemesia.es/>.
- [ ] **Finca Alamillos del Prior** — Aceite (+ mermeladas de higo). Jimena.
  Almazara de finca (olivos centenarios al pie del Aznaitín).
  <https://www.fincaalamillosdelprior.com/>. También en Correos Market.
- [ ] **El Torito Bravo** — Aceite (cosecha temprana, picual). Campillo de Arenas
  (paraje «Los Praillos»). <https://www.eltoritobravo.com/>.

## DOP Sierra de Segura + DOP Sierra de Cazorla (aceite, lote 8 de do-huecos)

> Fuentes de partida (leídas del registro oficial vía navegador): directorio de
> almazaras DOP Sierra de Segura
> (<https://dosierradesegura.com/directory-asociados/categories/almazaras/>, 24
> almazaras con municipio y teléfono) + almazaras DOP Sierra de Cazorla
> (<https://www.desierracazorla.es/almazaras/>, 10 almazaras con web y teléfono).
> Dedup 2026-07-09 por nombre/dominio. **Dups reales:** Potosí 10 (Orcera, Segura);
> Ntra. Sra. de la Encarnación (Peal), Aceites Vadolivo/Hacienda Vadolivo y La
> Bética Aceitera (Cazorla). Municipio = donde está la almazara.
>
> ⚠ **Homónimos (el dedup por nombre da falsos positivos; son entidades
> distintas):** «S.C.A. La Vicaría» (almazara, Puente de Génave) ≠ «Quesería
> Cortijo La Vicaría» (ya en CSV, mismo pueblo); los dos «San Isidro Labrador»
> (Benatae y Siles) ≠ el de Huelma (Sierra Mágina, ya en CSV); «San Marcos» (Beas)
> ≠ «Coop. Hortofrutícola San Marcos» (Torres, ya en CSV); «San Francisco» (Arroyo
> del Ojanco) ≠ «Oleícola San Francisco» (Begíjar, ya en CSV) ≠ «San Francisco»
> (Albanchez, lote 7). Cuidar slug/municipio al integrar.
>
> **Corte del lote (regla de tope 15–25):** 30 net-new (23 Segura + 7 Cazorla).
> Escritos 25 (7 Cazorla + 18 Segura); el resto de Segura queda en la nota final.

### DOP Sierra de Cazorla (7)

- [x] **S.C.A. Santo Tomás Apóstol** ‹→ cooperativa-santo-tomas-apostol-santo-tome (parcial; web con error de certificado)› — Aceite. Santo Tomé. Marcas «La Vega Santo
  Tomé» / «Estados Santo Tomé». <https://www.cooperativasantotomas.es/> ·
  953 736 010.
- [x] **S.C.A. Aceites Cazorla** ‹→ aceites-cazorla-cazorla (verificado, VO sí)› — Aceite. Cazorla. Marca «Azorla».
  <https://aceitescazorla.com/> · 953 724 031.
- [x] **Aceites Guadalentín S.L.** ‹→ aceites-guadalentin-olizumo-pozo-alcon (parcial; web 403)› — Aceite. Pozo Alcón. Marca «Olizumo».
  <https://www.aceitesguadalentin.com/> · 953 738 035.
- [x] **S.C.A. La Unión de Chilluévar** ‹→ cooperativa-la-union-de-chilluevar (verificado, VO sí)› — Aceite. Chilluévar. Marca «Cañamares».
  <https://www.scalauniondechilluevar.com/> · 953 717 016.
- [x] **Casería de Santa Julia (Aceitex)** ‹→ caseria-de-santa-julia-aceitex-peal-de-becerro (verificado, VO sí)› — Aceite. Peal de Becerro.
  <https://aceitexp.com/> · 953 243 195.
- [x] **Almazara Rotalaya (Explot. Agro. Trame)** ‹→ almazara-rotalaya-quesada (verificado, VO sí)› — Aceite. Quesada.
  <https://www.aceitesrotalaya.com/> · 953 281 584.
- [x] **S.C.A. Ntra. Sra. de la Cabeza** ‹→ cooperativa-hueoliva-huesa (parcial; web cert mal configurado)› — Aceite. Huesa. Marca «Hueoliva».
  <https://tienda.aceitehueoliva.es/> · 953 715 403. Tienda online →
  `Venta online=sí`.

### DOP Sierra de Segura (18)

> Teléfonos del registro del consejo; web añadida en enriquecimiento para las
> marcas con dominio propio localizado (el resto, «web: confirmar»).

- [x] **Oro Tradicional S.L.** ‹→ oro-tradicional-beas-de-segura (verificado, VO sí)› — Aceite (cosecha temprana, olivar de montaña).
  Beas de Segura. <https://orotradicional.com/> · 600 314 591. Tienda online →
  `Venta online=sí`.
- [ ] **S.C.A. San Juan de la Cruz** — Aceite. Beas de Segura. 953 424 803. Web:
  confirmar.
- [ ] **S.C.A. San Marcos** — Aceite. Beas de Segura. 953 424 805. Web: confirmar.
- [ ] **S.C.A. Santa Teresa de Jesús** — Aceite. Beas de Segura. 628 904 574. Web:
  confirmar.
- [ ] **S.C.A. Agrícola Ntra. Sra. Virgen del Campo** — Aceite. Génave.
  953 493 224. Web: confirmar.
- [x] **Sierra de Génave S.C.A.** ‹→ sierra-de-genave-genave (verificado, VO sí; marca propia + tienda confirmada)› — Aceite (ecológico, cert. CAAE). Génave. Marca
  «Oro de Génave». <https://www.sierradegenave.com/> · 953 493 153. ⚠ Comercializa
  vía la cooperativa de 2º grado Olivar de Segura; confirmar venta con marca
  propia.
- [ ] **S.C.A. San Juan Bautista** — Aceite. Puente de Génave. 953 435 316. Web:
  confirmar.
- [ ] **S.C.A. La Vicaría** — Aceite. Puente de Génave. 953 435 129. Web:
  confirmar. (⚠ homónimo con la quesería del mismo pueblo, ver arriba.)
- [ ] **S.C.A. San Isidro Labrador (Benatae)** — Aceite. Benatae. 953 482 010.
  Web: confirmar.
- [ ] **S.C.A. San Isidro Labrador (Siles)** — Aceite. Siles. 953 490 054. Web:
  confirmar.
- [ ] **Aceites el Carrascal S.A.** — Aceite. Torres de Albanchez. 656 904 570.
  Web: confirmar.
- [x] **S.C.A. Virgen del Campo (Chorro de Oro)** ‹→ cooperativa-chorro-de-oro-torres-de-albanchez (verificado, VO sí)› — Aceite. Torres de Albanchez.
  Marca «Chorro de Oro». <https://aceiteschorrodeoro.es/>.
- [ ] **Oleofer S.L.** — Aceite. La Puerta de Segura. 953 487 173. Web: confirmar.
- [ ] **S.C.A. Agrosegura** — Aceite. La Puerta de Segura. 953 486 423. Web:
  confirmar.
- [ ] **S.C.A. San Francisco** — Aceite. Arroyo del Ojanco. 953 420 104. Web:
  confirmar.
- [x] **Cortijo La Zarza** ‹→ cortijo-la-zarza-arroyo-del-ojanco (verificado, VO sí)› — Aceite (finca, picual). Arroyo del Ojanco.
  <https://cortijolazarza.com/> · 651 505 486.
- [ ] **S.C.A. Gutamarta** — Aceite. Cortijos Nuevos (Segura de la Sierra).
  953 496 279. Web: confirmar.
- [x] **The Green Gold Olive Oil Company** ‹→ the-green-gold-oh-hornos-de-segura (verificado, VO sí)› — Aceite (premium). Hornos de Segura.
  Marca «Oh!». <https://ggoliveoilcompany.com/>.

> ✅ **Corte «resto de Segura con web» integrado en fase C (2026-07-13, lote 8) —
> 8 altas, todas `verificado`.** Aprendizaje: la etiqueta «sin web / solo-teléfono»
> de fase A era **errónea** — casi todas estas coops/S.L. tienen **marca propia y
> tienda online**, y ser socia de Olivar de Segura (2º grado) **no** impide la
> venta directa con marca propia:
>
> - **Oleofer S.L.** (La Puerta de Segura) → `oleofer-tierras-de-tavara-la-puerta-de-segura`
>   (VO=sí; marca Tierras de Tavara, oleoturismo).
> - **S.C.A. San Juan de la Cruz** (Beas) → `cooperativa-san-juan-de-la-cruz-orobeas-beas-de-segura`
>   (VO=sí; marcas Orobeas/Saqura, tienda sin intermediarios).
> - **S.C.A. San Marcos** (Beas) → `cooperativa-san-marcos-natao-beas-de-segura`
>   (VO=sí; marca Natao, tienda leída en vivo). ⚠ ≠ San Marcos de Torres (Mágina).
> - **S.C.A. Santa Teresa de Jesús** (Beas) → `cooperativa-santa-teresa-de-jesus-aceibes-beas-de-segura`
>   (VO=sí; marca Aceibes, tienda WooCommerce leída en vivo).
> - **S.C.A. San Francisco** (Arroyo del Ojanco) → `cooperativa-san-francisco-arroyo-del-ojanco`
>   (VO=sí; tienda propia). ⚠ ≠ Oleícola San Francisco (Begíjar) ni la de Mancha Real.
> - **Aceites El Carrascal S.A.** (Torres de Albanchez) →
>   `aceites-el-carrascal-torres-de-albanchez` (VO=nc; web propia, premio Reino de Jaén).
> - **S.C.A. La Vicaría** (Puente de Génave) → `cooperativa-la-vicaria-puente-de-genave`
>   (VO=nc; web propia). ⚠ ≠ Quesería Cortijo La Vicaría del mismo pueblo.
> - **S.C.A. Virgen del Campo** (Génave) → `cooperativa-virgen-del-campo-genave`
>   (VO=nc; web aceitedegenave.es). ⚠ ≠ Sierra de Génave (Oro de Génave) ni la
>   Virgen del Campo de Torres de Albanchez (Chorro de Oro), ambas ya integradas.
>
> **Resto de Segura (siguiente corte — datos ya capturados):**
> «S.C.A San Bartolomé» (Villarrodrigo, 953 484 158; tag solo «Almazaras»,
> confirmar marca propia), «S.C.A Ntra. Sra. de los Milagros» (municipio a
> confirmar), «S.C.A. Ntra. Sra. De la Asunción» (municipio a confirmar),
> «S.C.A Ntra. Sra. de Nazaret» (Chiclana de Segura, 953 466 016).
>
> ⚠ **Excluido (gran grupo):** «Jaencoop Grupo Cooperativo» (Puente de Génave) es
> el mayor grupo cooperativo aceitero de la provincia (2º grado); regla dura de
> grandes grupos industriales → no crear fila (sus cooperativas de base sí pueden
> entrar por separado si venden con marca propia).