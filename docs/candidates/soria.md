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

### Candidatos (4) — ✅ integrados 2026-07-10 (fase B, lote 0.3 de `integracion.md`)

- [x] **Bodegas de Postín** — **accepted →
  `bodegas-de-postin-alcubilla-de-avellaneda`** (`verificado`, `Venta online=sí`,
  `ecommerce`). Tienda propia comprobada (Edición Limitada 2023, 48,00 €,
  «Añadir al carrito»). ⚠ **Municipio corregido**: ver abajo.
- [x] **La Loba** — **accepted → `la-bodega-de-la-loba-san-esteban-de-gormaz`**
  (`verificado`, **`Venta online=no`**). ⚠ La pista «Venta online: sí» del
  registro era **falsa**: ese campo contiene la URL de su propia web, que no
  tiene tienda ni mecanismo de pedido (solo formulario de contacto). Nombre
  oficial del consejo: «La Bodega de La Loba»; enóloga Ana Carazo.
- [x] **Cuarto Lagar** — **accepted → `cuarto-lagar-mino-de-san-esteban`**
  (`parcial`, `no comprobado`). `cuartolagar.com` redirige (301) a
  `cuartolagar.es`, que sirve **solo el `<title>`** (contenido por JS o en
  construcción) → sin fuente verificadora. El campo «Venta online» del registro
  está vacío.
- [x] **Dominio de Echauz** — **accepted →
  `dominio-de-echauz-alcubilla-de-avellaneda`** (`verificado`,
  `no comprobado`). **Sí tiene web**, aunque el registro no la publicaba:
  <https://echauz.com/> (más de 130 ha, colección de biotipos ancestrales).
  Instala WooCommerce y anuncia «NUESTRA TIENDA», pero las fichas de vino no
  muestran precio ni «añadir al carrito» → `no comprobado`, no `sí`.

### ⚠ Corrección geográfica importante (afecta a 3 de las 4 altas)

La nota de fase A asignaba mal los municipios: **Zayas de Báscones** y **Matanza
de Soria** no son municipios, son pedanías —y **de municipios distintos**:

- **Zayas de Báscones → Alcubilla de Avellaneda** (no San Esteban de Gormaz).
  Confirmado por el propio ayuntamiento (`alcubilladeavellaneda.es/zayas-de-bascones`).
  Afecta a De Postín y Dominio de Echauz.
- **Matanza de Soria → San Esteban de Gormaz** (pedanía). Afecta a La Loba.

Ninguna de las dos está en `municipios.json` (son sub-municipales). Ojo con el
homónimo: la clave `matanza` del lookup es **Matanza de los Oteros (León)**, a
180 km. Con el municipio oficial escrito, las coordenadas validan a 5,4 km
(Alcubilla) y 6,8 km (S. E. de Gormaz) de sus centroides.

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
  por completo en el CSV: ahí están 3 de las 4 altas. (Son **pedanías**, no
  municipios; ver la corrección geográfica de arriba.)

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
