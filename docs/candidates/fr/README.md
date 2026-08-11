# Revisión de candidatos — Francia

Corte editorial: 2026-08-11.

- Candidatos iniciales de Agence Bio: **2020**.
- Incorporados con identidad, actividad, commune, ubicación y oferta pública contrastadas: **314**.
- Descartados con exclusión positiva documentada: **34**.
- Retenidos para futuras revisiones por evidencia insuficiente o conflicto pendiente: **1672**.

Los candidatos retenidos no son descartes: permanecen en el fichero de su département hasta que una fuente pública permita confirmar la oferta propia y la unidad productiva. Los descartes se conservan como tombstones en `data/evidence/fr/**` y, para facilitar revisiones sucesivas, también quedan resumidos al final de la nota del département correspondiente.

## Barrido SIRENE de categorías infrarrepresentadas (2026-08-10)

El catálogo heredado venía del registro HVE, muy vitícola: 458 de sus 808 filas son `Vino` y hay categorías enteras sin una sola fila francesa. La pasada de Agence Bio que la siguió es de explotaciones agrícolas, así que reforzó `Fruta y verdura` y `Carne` pero no la transformación. Este barrido ataca ese hueco: **22 candidatos por cada una de las 18 regiones (396 en total, en 94 départements)** en categorías de elaboración con poca o ninguna presencia.

Resultado de la revisión cerrada el 2026-08-11: **85 incorporados** con identidad pública, producción, commune y ubicación contrastadas; **311 retenidos** porque el registro o las búsquedas públicas no bastan para acreditar la oferta propia y la unidad productiva. No se convirtió una ausencia de resultados en descarte.

Fuente: [API de búsqueda del Annuaire des Entreprises](https://recherche-entreprises.api.gouv.fr/) sobre el registro SIRENE, consultada por département y código NAF, quedándose solo con establecimientos activos del propio département. Los códigos se eligieron porque describen una etapa de elaboración, no comercio: `11.05Z` cerveza, `11.01Z` destilados, `11.03Z` sidra, `10.51A-D` lácteos, `10.82Z` chocolate y confitería, `10.72Z` biscuitería, `10.52Z` helados, `10.83Z` café y té, `10.39A/B` conservas, `10.32Z` zumos, `10.20Z` y `03.21Z`/`03.22Z` pescado y acuicultura, `10.41A/B` aceites, `10.84Z` condimentos, `08.93Z` sal, `10.61A` molinería, `10.73Z` pasta, `01.28Z` especias y `01.25Z` frutos secos.

Techo de la fuente: SIRENE prueba **existencia legal, código de actividad declarado y dirección declarada de un establecimiento activo**. No prueba marca pública, oferta propia actual, venta al consumidor ni que la dirección sea la unidad productiva y no el domicilio del titular. La categoría de la tabla es una **propuesta derivada del código NAF**, no una decisión: hay que decidirla por fila contra el producto real. El enlace «web sin contrastar» que aparece en algunas filas viene de casar nombre y coordenadas con la capa artesana de OpenStreetMap y necesita comprobación de titularidad antes de usarse.

Filtros aplicados al elegir, por si hay que repetir el barrido: fuera empresas GE/ETI y de 50+ asalariados, razones sociales no difundibles, holdings y distribución, y altas de menos de seis meses. `01.28Z` y `01.25Z` solo entran si el nombre declara un producto alimentario, porque cubren también plantas de perfumería y cosmética; `11.03Z` solo entra si el nombre declara sidra, porque fuera de Normandía y Bretaña suele ser hidromiel o vino de fruta.

Avisos por región: en Île-de-France abundan las microempresas domiciliadas en vivienda con código alimentario y sin unidad productiva, así que la dirección es aquí el primer filtro. En los DOM el padrón es pequeño y no siempre distingue elaboración de restauración.
