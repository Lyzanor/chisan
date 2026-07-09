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

- [ ] **Jamones Lazo** — Charcutería (jamón bellota 100% ibérico DOP Jabugo).
  Cortegana. <https://www.jamoneslazo.es/>. Tienda online → `Venta online=sí`.
  (Dedup: falso positivo con USISA por el trozo «sa**lazo**nera»; entidad distinta.)
- [ ] **Sierra Mayor Jabugo, S.A.U.** — Charcutería (jamón DOP Jabugo).
  Corteconcepción. <https://sierramayorjabugo.com/>. Marca «Sierra Mayor», tienda
  online → `Venta online=sí`.
- [ ] **Hermanos Cárdeno, S.L.** — Charcutería (jamón DOP Jabugo). Cumbres
  Mayores. <https://cardeno.es/> · 959 710 351. Tienda online → `Venta online=sí`.
- [ ] **Ibéricos Domecq, S.L.** — Charcutería (jamón DOP Jabugo). Cortegana.
  <https://jamonesjuanpedrodomecq.com/> (marca «Juan Pedro Domecq»). Secadero
  inaugurado 2019 en Cortegana.
- [ ] **Hermanos Velázquez Jabugo, S.A.** — Charcutería (jamón DOP Jabugo).
  Aroche. <https://www.ibericosvelazquez.com/> · 600 305 694. Tienda online →
  `Venta online=sí`.
- [ ] **Francisco y Gregorio Alcaide Cera, S.L.** — Charcutería (jamón DOP
  Jabugo). Cortegana. <https://www.corteganaiberico.com/> (marca «Cortegana
  Ibérico») · 959 131 159. Tienda online → `Venta online=sí`.
- [ ] **Enrique Castaño Guijarro** — Charcutería (jamón DOP Jabugo). Cumbres
  Mayores. <https://www.jamonesenriquecastaño.es/> (punycode
  `xn--jamonesenriquecastao-m7b.es`). Cuatro generaciones.
- [ ] **Hermanos Castaño Fernández, S.L.** — Charcutería (jamón DOP Jabugo).
  Cumbres Mayores. <https://www.jamonestartessos.com/> (marca «Tartessos») ·
  959 710 176. ⚠ **Probable duplicado**: el CSV ya tiene «Jamones Tartessos»
  (municipio Huelva). Muy posiblemente la misma entidad → verificar antes de crear
  fila; si coincide, corregir municipio a Cumbres Mayores en la fila existente.
- [ ] **Ramos Domínguez, S.L.** — Charcutería (jamón DOP Jabugo). Higuera de la
  Sierra. <https://www.jamonesoroviejo.com/> (marca «Oro Viejo») · 959 196 092.
  Tienda online → `Venta online=sí`.
- [ ] **Los Romeros de Jabugo, S.L.** — Charcutería (jamón DOP Jabugo). Jabugo.
  <https://jamonalbaromero.com/> (marca «Alba Romero») · 959 191 059. Tienda
  online → `Venta online=sí`.
- [ ] **Maximiliano Jabugo, S.L.** — Charcutería (jamón DOP Jabugo). El Repilado
  (Jabugo). <https://www.maximilianojabugo.com/> · 900 190 000. Tienda online →
  `Venta online=sí`.
- [ ] **Miguel y María, S.L.** — Charcutería (jamón DOP Jabugo). Jabugo.
  <https://www.miguelymaria.com/> (marca «Castillo Real»). Tienda online →
  `Venta online=sí`.
- [ ] **Pedro Parra e Hijos, S.A.** — Charcutería (jamón DOP Jabugo). Jabugo.
  <https://jamonesmontjam.com/> (marcas «MONTJAM» y «ONOFRE») · 959 122 815.
  ⚠ También presta servicio de maquila (B2B) a terceros; entra por su marca propia.
- [ ] **Sierra de Jabugo, S.L.** — Charcutería (jamón DOP Jabugo). El Repilado
  (Jabugo). <https://www.sierradejabugo.es/> (marca «Jamones Bomba») ·
  959 122 885. Tienda online → `Venta online=sí`.
- [ ] **Olalla Ibérica, S.L.** — Charcutería (jamón DOP Jabugo). Santa Olalla del
  Cala. <https://olallajamones.com/> · 959 190 320. Tienda online →
  `Venta online=sí`.
- [ ] **Jamones Benito e Hijos, S.L.** — Charcutería (jamón DOP Jabugo). Jabugo.
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

- [ ] **Bodegas del Diezmo Nuevo (Herederos de Cosme Sáenz Jiménez)** — Bodega.
  Moguer. <https://bodegadiezmonuevo.com/>. Fundada en 1770, una de las bodegas
  activas más antiguas de España (250 aniversario, insignia de oro del consejo);
  pionera en vermut, vino naranja y vino de fresa. Fuerte candidata.
- [ ] **Bodegas Díaz, S.L.** — Bodega. Bollullos Par del Condado.
  <https://www.bodegasdiaz.com/> · tienda <https://tiendabodegasdiaz.com/> ·
  959 410 340. Vinos generosos, dulces y vinagres (marcas Vado del Quema, Onubis,
  Condado Pálido Fino 1955). Tienda online → `Venta online=sí`.
- [ ] **Vinícola Valverdejo, S.L.** — Bodega. Gibraleón.
  <https://www.vinicolavalverdejo.com/>.
- [ ] **Bodegas Marqués de Villalúa** — Bodega. Villalba del Alcor.
  <https://www.marquesdevillalua.com/>.
- [ ] **Bodegas Rubio (Brandy Luis Felipe)** — Bodega/brandy. La Palma del
  Condado. <https://www.brandyluisfelipe.com/>. ⚠ Marca de brandy; confirmar
  encaje (vino/vinagre DO además del brandy).
- [ ] **Bodegas A. Villarán, S.A.** — Bodega. Bollullos Par del Condado.
  959 410 377. Sin web propia localizada; confirmar.
- [ ] **Bodegas López Cuesta, S.A.** — Bodega. Rociana del Condado. 959 416 426.
  Desde 1949 (vinos Édalo, Villa Barredero, Vallehondo…). Sin web propia
  localizada; confirmar.
- [ ] **Bodegas Camacho** — Bodega. Bollullos Par del Condado. Sin web localizada;
  confirmar actividad/venta.
- [ ] **Bodegas Acosta** — Bodega. Bollullos Par del Condado. Sin web localizada;
  confirmar actividad/venta.
- [ ] **Bodegas Juncales** — Bodega. Bollullos Par del Condado. Sin web localizada;
  confirmar actividad/venta.
- [ ] **José y Miguel Martín, S.L.** — Bodega. Bollullos Par del Condado. Sin web
  localizada; confirmar actividad/venta.
- [ ] **Bodegas Escolar Hermanos, S.A.** — Bodega. Almonte. Sin web localizada;
  confirmar actividad/venta.
- [ ] **Vitivinícola Manzanillera, S.C.A.** — Bodega. Manzanilla. Sin web
  localizada; confirmar actividad/venta.

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
