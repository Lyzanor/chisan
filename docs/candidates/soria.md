# Candidatos — Soria

> Fichero creado en la pasada **DO menos cubiertas** (`docs/candidates/do-huecos.md`).
> Formato estándar de `docs/candidates/README.md`.

## Ribera del Duero — parte soriana (lote 26 de do-huecos)

> **Hueco pequeño, como el ledger anticipaba** — pero no «sin hueco real»: quedan
> **4 altas**. La worklist daba permiso explícito para cerrar este lote si la parte
> soriana estaba ≥80% cubierta; está al **71%** (10 de 14), así que se escriben las
> cuatro que faltan y se cierra.
>
> Fuente: registro completo del Consejo Regulador
> (`riberadelduero.es/bodegas/resultados`, 26 páginas → **302 bodegas**; leídas 299
> fichas). Cada ficha trae bloque *Dirección y contacto* con calle, CP, **localidad,
> provincia**, email, teléfono, **Web** y **Venta online**. Filtrando por
> `provincia == Soria`: **14 bodegas**. Reparto real de la DO: Burgos 165 ·
> Valladolid 113 · **Soria 14** · Segovia 2 · (resto, sedes fiscales fuera).
>
> Dedup contra `soria.csv` (17 bodegas) el 2026-07-09, con guarda de
> `categoria == "Bodega"`: **10 ya en CSV** → **4 netas**. Estado: **`unverified`**.

### Candidatos (4)

- [ ] **Bodegas de Postín** (Bodegas de Postín, S.L.) — Bodega. Zayas de Báscones
  (San Esteban de Gormaz). · 607 802 580 · <https://depostin.es/>. El registro
  marca **Venta online: sí** → pista `Venta online=sí`.
- [ ] **La Loba** — Bodega. Matanza de Soria. · 975 102 037 ·
  <http://www.laloba.es>. **Venta online: sí**.
- [ ] **Cuarto Lagar** (Cuarto Lagar, S.L.) — Bodega. Miño de San Esteban.
  · 636 728 883 · <https://www.cuartolagar.com/>.
- [ ] **Dominio de Echauz** (Dominio de Echauz, S.L.U.) — Bodega. Zayas de
  Báscones (San Esteban de Gormaz). · 681 131 903. Sin web en el registro.

### Notas del lote 26

- **Ya en `soria.csv` (10)**: Los Imposibles (Rejas de San Esteban), Antídoto,
  Aceña, Quinta Vendimia y Lunas de Castromoro (San Esteban de Gormaz), Castillejo
  de Robledo, Dominio de Atauta, Valdeviñas (Langa de Duero), Señorío de Villálvaro
  y Rudeles (Peñalba de San Esteban).
- **7 filas del CSV no aparecen en el registro de la DO** — merecen una revisión
  aparte, porque o están inscritas con otra razón social, o no son DO Ribera:
  `vinedos-y-bodegas-gormaz-san-esteban-de-gormaz` · `dominio-de-es-san-esteban-de-gormaz`
  · `vino-taruguin-san-esteban-de-gormaz` · `bodegas-senorio-de-aldea-aldea-de-san-esteban`
  · `bodega-aranda-de-vries-ines` · `monte-pinos-almazan` (Almazán está fuera de la
  DO) · `pressumia-olvega` (Ólvega también). Las dos últimas son, con casi total
  seguridad, bodegas de **Vinos de la Tierra**, no de Ribera → correcto que estén,
  pero no cuentan para este hueco.
- **Zayas de Báscones y Matanza de Soria** son las dos localidades que faltaban
  por completo en el CSV: ahí están 3 de las 4 altas.

### Método

- El registro de Ribera del Duero **no tiene filtro por provincia**, y las tarjetas
  del listado solo muestran el nombre. Hubo que paginar las 26 páginas para sacar
  los 302 slugs y **bajar las fichas una a una** para leer el campo `provincia`.
- Filtrar por la **palabra «Soria» en el HTML** da falsos positivos: 28 fichas la
  mencionan, pero 14 son bodegas de Valladolid o Burgos cuya dirección incluye
  «Carretera Nacional Valladolid-**Soria** N-122». Hay que leer el **campo
  estructurado de provincia**, no buscar el topónimo.
- Bonus del registro: cada ficha publica **«Venta online:»** con la URL de la
  tienda → dato directo para esa columna, como ya pasaba en Abona y Valle de
  Güímar (lote 22).
