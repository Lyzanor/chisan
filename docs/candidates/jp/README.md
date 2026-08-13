# Guía de candidatos — Japón

Aplica la [guía común](../README.md) y las
[reglas y techos de fuentes de Japón](../../../data/csv/jp/AGENTS.md). Este
documento conserva métodos nacionales reutilizables; cada prefectura mantiene
en su propio fichero las fuentes consultadas, el corte y los candidatos
pendientes.

## Gremios de bebidas por prefectura

El [índice nacional de gremios](https://www.japansake.or.jp/sake/link/index.html)
y el buscador `japansake.or.jp/sakagura/jp/<prefectura>/` permiten localizar el
gremio y las bodegas de cada prefectura. Como apoyo de lectura puede usarse el
censo de SAKETIMES en `jp.sake-times.com/sakagura/<prefectura>`; la ruta de
Kochi usa `kouchi`.

No todas las prefecturas se investigan con el mismo producto: sake es lo común,
pero Kagoshima y Miyazaki requieren shochu, Okinawa awamori y Kumamoto también
el gremio de Kuma shochu. El padrón suele dar nombre y municipio, pero rara vez
el dominio. Busca y casa la presencia pública de cada unidad antes de publicar;
sin una fuente actual directa, el gremio normalmente solo permite `parcial`.

Algunos gremios siguen en HTTP, tienen TLS roto o dejan de resolver. Un fallo de
acceso no demuestra cierre: contrasta el buscador nacional y otra fuente antes
de retirar un dominio o descartar una bodega.

## Otras fuentes nacionales

- Los directorios de 和菓子, 米菓 y 乾麺 pueden aportar nombre, dirección y web
  del socio. Confirman pertenencia y tipo de producto, no actividad actual ni
  venta online.
- El registro orgánico JAS aporta operador, certificación y centro declarado.
  No demuestra por sí solo marca pública, oferta propia actual o actividad.
- Los mercados de venta directa pueden demostrar una oferta vigente dentro del
  propio mercado, pero su ficha no equivale al dominio del productor ni prueba
  que toda dirección publicada sea la unidad productiva.
- Los directorios de productos regionales o cooperativas sirven para abrir un
  vertical; si solo nombran a la entidad gestora, continúa hasta el fabricante
  concreto.

Documenta en el fichero de prefectura la consulta, fecha, filtros y techo de la
fuente usados en cada tanda. Si una fuente aplica límites de peticiones, deja el
punto de reanudación en esa nota, no en este README.

## Identidad y geografía

- Deduplica por nombre japonés y municipio, y después por dominio, dirección o
  contacto. El rōmaji y el dominio aislado no bastan para distinguir homónimos.
- `郡` es un distrito, no un municipio; una zona histórica o un municipio
  disuelto tampoco debe pasar directamente a `municipio`.
- En Tokio se usa el barrio especial o el municipio de Tama/islas, nunca
  `Tokyo` a secas.
- Una sede de grupo, planta, almacén o cooperativa no se convierte
  automáticamente en una identidad productora local. Resuelve la unidad y la
  marca que realmente elaboran la oferta.
