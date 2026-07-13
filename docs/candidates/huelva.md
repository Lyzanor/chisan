# Candidatos — Huelva

> Origen: pasada **DO menos cubiertas** (`docs/candidates/do-huecos.md`). Cada
> sección corresponde a un lote de esa pasada. **Estado: `unverified`** —
> deduplicado contra `data/csv/andalucia/huelva.csv` por dominio/nombre
> normalizado. Antes de integrar: re-deduplicar con
> `npx pnpm list:province huelva`, confirmar actividad/dirección/web, aplicar las
> reglas duras de triaje del ledger y decidir `verificacion` y `Venta online`.

## DOP Jabugo + secaderos Sierra de Aracena (jamón, lote 5 de do-huecos)

> Fuente de partida: «Bodegas» (empresas elaboradoras) del Consejo Regulador DOP
> Jabugo (<https://dopjabugo.es/en/bodegas/>, 28 empresas inscritas en 9
> municipios del Parque Natural Sierra de Aracena y Picos de Aroche). Dedup
> 2026-07-09. **Ya en el CSV (excluidas):** Ibéricos Vázquez (Aracena), Jamones
> Eíriz (Corteconcepción). Municipio = donde está el secadero.
>
> ⚠ **Grandes grupos / industriales / mataderos (NO crear fila — regla dura):**
> ElPozo Alimentación (Grupo Fuertes), Sánchez Romero Carvajal / **Cinco Jotas**
> (Grupo Osborne), Industrias Cárnicas Loriente Piqueras, Montesierra, Industrias
> Reunidas Jabugo, Consorcio de Jabugo, y los mataderos industriales (Matadero
> industrial de Cortegana-Artesanos de Jabugo, Matadero de Jabugo y Galaroza).
> Altanza Jabugo, Centelles y Buj y Comercial Jabu parecen comercializadoras/B2B:
> confirmar marca propia de consumo antes de considerarlas.

### Secaderos familiares con marca propia (candidatos)

> Webs/teléfonos añadidos en la pasada de enriquecimiento 2026-07-09 (búsqueda web
> + fichas del consejo). Casi todos tienen tienda online → pista `Venta online=sí`.

- [x] **Jamones Lazo** ‹→ jamones-lazo-cortegana (verificado, VO sí ecommerce)› — Charcutería (jamón bellota 100% ibérico DOP Jabugo).
  Cortegana. <https://www.jamoneslazo.es/>. Tienda online → `Venta online=sí`.
  (Dedup: falso positivo con USISA por el trozo «sa**lazo**nera»; entidad distinta.)
- [x] **Sierra Mayor Jabugo, S.A.U.** ‹→ sierra-mayor-jabugo-corteconcepcion (verificado, VO sí)› — Charcutería (jamón DOP Jabugo).
  Corteconcepción. <https://sierramayorjabugo.com/>. Marca «Sierra Mayor», tienda
  online → `Venta online=sí`.
- [x] **Hermanos Cárdeno, S.L.** ‹DIFERIDO: su web (cardeno.es) sitúa la empresa en Fuentes de León (Badajoz), tel 924, y no reclama DOP Jabugo, pese a figurar el registro en Cumbres Mayores → resolver provincia antes de integrar› — Charcutería (jamón DOP Jabugo). Cumbres
  Mayores. <https://cardeno.es/> · 959 710 351. Tienda online → `Venta online=sí`.
- [x] **Ibéricos Domecq, S.L.** ‹→ ibericos-domecq-cortegana (verificado, VO sí; marca Juan Pedro Domecq)› — Charcutería (jamón DOP Jabugo). Cortegana.
  <https://jamonesjuanpedrodomecq.com/> (marca «Juan Pedro Domecq»). Secadero
  inaugurado 2019 en Cortegana.
- [x] **Hermanos Velázquez Jabugo, S.A.** ‹→ ibericos-velazquez-aroche (verificado, VO sí)› — Charcutería (jamón DOP Jabugo).
  Aroche. <https://www.ibericosvelazquez.com/> · 600 305 694. Tienda online →
  `Venta online=sí`.
- [x] **Francisco y Gregorio Alcaide Cera, S.L.** ‹→ cortegana-iberico-cortegana (verificado, VO sí; miembro productor DOP Jabugo)› — Charcutería (jamón DOP
  Jabugo). Cortegana. <https://www.corteganaiberico.com/> (marca «Cortegana
  Ibérico») · 959 131 159. Tienda online → `Venta online=sí`.
- [x] **Enrique Castaño Guijarro** ‹→ jamones-enrique-castano-guijarro-cumbres-mayores (verificado, VO n/c; línea Summun)› — Charcutería (jamón DOP Jabugo). Cumbres
  Mayores. <https://www.jamonesenriquecastaño.es/> (punycode
  `xn--jamonesenriquecastao-m7b.es`). Cuatro generaciones.
- [x] **Hermanos Castaño Fernández, S.L.** — **already-present** →
  `jamones-tartessos-huelva` (limpieza 2026-07-10: el dominio
  `jamonestartessos.com` coincide exactamente con la fila del CSV). NO crear fila.
  Queda una **corrección pendiente a la fila existente**: el CSV dice municipio
  «Huelva» pero la razón social produce en **Cumbres Mayores** (959 710 176).
- [x] **Ramos Domínguez, S.L.** ‹→ jamones-oro-viejo-higuera-de-la-sierra (verificado, VO sí; marca Oro Viejo)› — Charcutería (jamón DOP Jabugo). Higuera de la
  Sierra. <https://www.jamonesoroviejo.com/> (marca «Oro Viejo») · 959 196 092.
  Tienda online → `Venta online=sí`.
- [x] **Los Romeros de Jabugo, S.L.** ‹→ jamon-alba-romero-cala (verificado, VO sí; CORRECCIÓN municipio: secadero en Cala, no Jabugo)› — Charcutería (jamón DOP Jabugo). Jabugo.
  <https://jamonalbaromero.com/> (marca «Alba Romero») · 959 191 059. Tienda
  online → `Venta online=sí`.
- [x] **Maximiliano Jabugo, S.L.** ‹→ maximiliano-jabugo-jabugo (verificado, VO sí; marca MXM)› — Charcutería (jamón DOP Jabugo). El Repilado
  (Jabugo). <https://www.maximilianojabugo.com/> · 900 190 000. Tienda online →
  `Venta online=sí`.
- [x] **Miguel y María, S.L.** ‹DIFERIDO: sede/teléfono en Segovia (921), fábricas en Segovia y Huelva, sin e-commerce claro; no es un secadero artesano exclusivo de Jabugo → confirmar encaje› — Charcutería (jamón DOP Jabugo). Jabugo.
  <https://www.miguelymaria.com/> (marca «Castillo Real»). Tienda online →
  `Venta online=sí`.
- [x] **Pedro Parra e Hijos, S.A.** ‹→ jamones-pedro-parra-montjam-jabugo (verificado, VO n/c; marca propia MONTJAM/ONOFRE)› — Charcutería (jamón DOP Jabugo). Jabugo.
  <https://jamonesmontjam.com/> (marcas «MONTJAM» y «ONOFRE») · 959 122 815.
  ⚠ También presta servicio de maquila (B2B) a terceros; entra por su marca propia.
- [x] **Sierra de Jabugo, S.L.** ‹→ sierra-de-jabugo-jabugo (verificado, VO sí; marca Jamones Bomba)› — Charcutería (jamón DOP Jabugo). El Repilado
  (Jabugo). <https://www.sierradejabugo.es/> (marca «Jamones Bomba») ·
  959 122 885. Tienda online → `Venta online=sí`.
- [x] **Olalla Ibérica, S.L.** ‹→ olalla-iberica-santa-olalla-del-cala (verificado, VO sí)› — Charcutería (jamón DOP Jabugo). Santa Olalla del
  Cala. <https://olallajamones.com/> · 959 190 320. Tienda online →
  `Venta online=sí`.
- [x] **Jamones Benito e Hijos, S.L.** ‹→ jamones-benito-e-hijos-jabugo (parcial; S.L. de Jabugo del grupo Ibéricos Benito de Arahal/Sevilla, web del grupo)› — Charcutería (jamón DOP Jabugo). Jabugo.
  ⚠ Web sin confirmar: buscar arroja «Ibéricos Benito / Anselmo Benito»
  (jamonesbenitoibericos.com, ibericosbenito.com) pero con origen en Arahal
  (Sevilla) — posible entidad distinta. Confirmar razón social y secadero en
  Jabugo antes de asignar web.

## DO Condado de Huelva (vino y vinagre, lote 6 de do-huecos)

> Fuente de partida: bodegas de la DO Condado de Huelva (registro del Consejo en
> `docondadodehuelva.es` — bloquea el fetch anónimo; lista reconstruida del
> directorio de Apolo y Baco, 31 bodegas, cruzada con el consejo). El mismo
> Consejo ampara además **Vinagre del Condado de Huelva** y **Vino Naranja del
> Condado de Huelva**: muchas de estas bodegas elaboran las tres cosas (anotar al
> verificar). Dedup 2026-07-09. **Ya en el CSV (excluidas):** Andrade, Iglesias,
> Oliveros, Privilegio del Condado/Vinícola del Condado, Sauci, Contreras Ruíz,
> Agroalimentaria Virgen del Rocío/Raigal (Almonte). Municipio = donde está la
> bodega.

### Bodegas con marca propia (candidatos)

> Webs/teléfonos añadidos en la pasada de enriquecimiento 2026-07-09.

- [x] **Bodegas del Diezmo Nuevo (Herederos de Cosme Sáenz Jiménez)** ‹→ bodegas-del-diezmo-nuevo-moguer (verificado, VO sí; casa de 1770)› — Bodega.
  Moguer. <https://bodegadiezmonuevo.com/>. Fundada en 1770, una de las bodegas
  activas más antiguas de España (250 aniversario, insignia de oro del consejo);
  pionera en vermut, vino naranja y vino de fresa. Fuerte candidata.
- [x] **Bodegas Díaz, S.L.** ‹→ bodegas-diaz-bollullos (verificado, VO n/c; pedidos por teléfono)› — Bodega. Bollullos Par del Condado.
  <https://www.bodegasdiaz.com/> · tienda <https://tiendabodegasdiaz.com/> ·
  959 410 340. Vinos generosos, dulces y vinagres (marcas Vado del Quema, Onubis,
  Condado Pálido Fino 1955). Tienda online → `Venta online=sí`.
- [x] **Vinícola Valverdejo, S.L.** ‹→ vinicola-valverdejo-gibraleon (parcial; web caída)› — Bodega. Gibraleón.
  <https://www.vinicolavalverdejo.com/>.
- [x] **Bodegas Marqués de Villalúa** ‹→ bodegas-marques-de-villalua-villalba-del-alcor (verificado, VO sí)› — Bodega. Villalba del Alcor.
  <https://www.marquesdevillalua.com/>.
- [x] **Bodegas Rubio (Brandy Luis Felipe)** ‹→ bodegas-rubio-luis-felipe-la-palma-del-condado (parcial; brandy+vinagre DOP, categoría Licores)› — Bodega/brandy. La Palma del
  Condado. <https://www.brandyluisfelipe.com/>. ⚠ Marca de brandy; confirmar
  encaje (vino/vinagre DO además del brandy).
> ✅ **Corte «bodegas del Condado sin web» triado en fase C (2026-07-13, lote 10)**:
> **4 altas `parcial`** (bodegas familiares reales de Bollullos con vino
> embotellado, confirmadas por el registro del consejo / Ruta del Vino, pero sin
> web propia legible en vivo):

- [x] **Bodegas A. Villarán, S.A.** → `bodegas-villaran-bollullos-par-del-condado`
  (`parcial`). Bollullos, Calle San Vicente; bodega histórica de la familia Villarán.
- [x] **Bodegas Acosta** → `bodegas-acosta-bollullos-par-del-condado` (`parcial`).
  Bollullos, desde 1922 (3ª gen.); generosos, vermut, moscatel, amontillado. Su
  dominio bodegasacosta.com no resuelve (DNS caído).
- [x] **Bodegas Juncales** → `bodegas-juncales-bollullos-par-del-condado`
  (`parcial`). Bollullos, desde 1946; pasó de granel a embotellado, generosos +
  enoturismo.
- [x] **José y Miguel Martín, S.L.** → `jose-y-miguel-martin-bollullos-par-del-condado`
  (`parcial`). Bollullos, Pol. Ind. El Lirio; elaboración/crianza de vinos.

> **Descartes/diferidos del corte (no crear fila):**
> - [x] **Bodegas López Cuesta, S.A.** — RECHAZADO: razón social de Bodegas
>   Contreras Ruiz (ya en CSV; marcas Édalo/Villa Barredero/Vallehondo, tel 959416426).
> - [x] **Vitivinícola Manzanillera, S.C.A.** (Manzanilla) — **diferido**:
>   cooperativa **mayoritariamente de granel y mosto** (embotella solo una parte,
>   sin marca de consumo/web localizada) → regla dura de granel, no se crea.
> - [x] **Bodegas Camacho** (Bollullos) y **Bodegas Escolar Hermanos, S.A.**
>   (Almonte) — **diferidas**: no localizadas en registro/web en esta pasada;
>   reabrir si aparece rastro.
> - ⚠ **Las coops «del Condado» listadas abajo son en su mayoría de ACEITE o de
>   granel/mosto**, no bodegas de vino embotellado: *Virgen de España* (Beas) =
>   **Olibeas** (aceite), *Santa María Salomé* (Bonares) = aceite. Las demás
>   (Estrella/Chucena, Guía/La Palma, Socorro/Rociana, Inmaculada/Trigueros, Santa
>   Águeda/Villalba, Remedios/Villarrasa) → triar por marca de consumo propia antes
>   de integrar; excluir si granel/mosto.

> ⚠ **Descartes/dudas detectadas al enriquecer:**
> - **Bodegas Clemente Neble, S.L.** (Bollullos): figura como **empresa
>   extinguida/disuelta** en el registro mercantil → **excluida**.
> - **Bodegas Doñana, S.L.** (Bollullos): «Doñana» es además una **marca de
>   Bodegas Privilegio del Condado / Vinícola del Condado** (ya en CSV). Confirmar
>   si «Bodegas Doñana S.L.» es entidad independiente antes de crear fila.
> - **Bodegas Espina** (Bollullos): «Espina Pura» es una **marca de Bodegas
>   Sauci** (ya en CSV) y José Espina preside la Vinícola del Condado. Alto riesgo
>   de duplicado/marca; verificar entidad antes de crear fila.

> ⚠ **Cooperativas del Condado (triar aparte — confirmar marca de consumo propia,
> excluir si es vino a granel/mosto):** Cooperativa Virgen de España (Beas),
> Cooperativa Santa María Salomé (Bonares), Cooperativa Ntra. Sra. de la Estrella
> (Chucena), Cooperativa Ntra. Sra. de Guía (La Palma del Condado), Ntra. Sra. del
> Socorro S.C.A. (Rociana), Inmaculada Concepción S.C.A. (Trigueros), Cooperativa
> Santa Águeda (Villalba del Alcor), Cooperativa Ntra. Sra. de los Remedios
> (Villarrasa).
