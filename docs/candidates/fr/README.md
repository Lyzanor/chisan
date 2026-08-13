# Guía de candidatos — Francia

Aplica la [guía común](../README.md) y las
[reglas y techos de fuentes de Francia](../../../data/csv/fr/AGENTS.md). Este
documento reúne métodos nacionales reutilizables; el estado, las fechas y las
fuentes concretas de cada pasada pertenecen al fichero del département.

## Fuentes registrales como descubrimiento

### Agence Bio

El [directorio oficial de Agence Bio](https://annuaire.agencebio.org/) y su
[conjunto de datos](https://www.data.gouv.fr/datasets/professionnels-engages-en-bio)
permiten descubrir explotaciones, producciones declaradas y lugares de
actividad. Una certificación activa puede sostener los datos registrales que
publica, pero no sustituye la comprobación de la marca, la oferta alimentaria
propia actual, la commune vigente ni la unidad productiva.

### SIRENE como fuente de descubrimiento

La [API de búsqueda del Annuaire des
Entreprises](https://recherche-entreprises.api.gouv.fr/) permite buscar
establecimientos activos por département y código NAF. Úsala para descubrir
elaboradores en categorías concretas, no para darlos de alta mecánicamente.

SIRENE prueba existencia legal, actividad declarada y dirección declarada del
establecimiento. No prueba marca pública, oferta propia actual, venta al
consumidor ni que la dirección sea la unidad productiva. Un código NAF propone
una línea de investigación; la categoría final se decide por el producto real.
Una web obtenida por casar nombre o coordenadas con otra base también exige una
comprobación independiente de titularidad.

Al diseñar una consulta, excluye holdings, distribución y actividades que no
impliquen elaboración. En códigos que mezclan alimentación con perfumería,
cosmética u otros usos, exige una señal alimentaria explícita. Documenta en cada
fichero de área los códigos, filtros, fecha y alcance exactos utilizados.

## Precauciones recurrentes

- En Île-de-France abundan domicilios sociales y microempresas sin unidad
  productiva visible; la dirección registral necesita contraste especial.
- En los départements de ultramar, los padrones pequeños pueden mezclar
  elaboración, restauración e importación.
- Una commune, sede o código de actividad coincidentes no bastan para casar una
  marca pública. Confirma además producto, dominio, dirección o contacto.
- Los candidatos sin evidencia suficiente permanecen en el fichero del área;
  la ausencia de resultados no es un `reject`.
