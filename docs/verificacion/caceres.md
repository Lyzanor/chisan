# Verificación provincial de Cáceres

Ledger de trabajo para reanudar la revisión profunda de
`data/csv/extremadura/caceres.csv`. El CSV es la fuente de verdad y la
proveniencia por fila vive en `data/evidence/extremadura/caceres.jsonl`.

## Estado

- **Lote CC-V-a (2026-07-28, carril V).** Alcance: las 23 filas de
  `check:defects --check canal-sin-clasificar`. **21 cerradas a `ecommerce`**
  comprobando el mecanismo en vivo (catálogo con botón de compra), no el texto
  comercial. **2 residuales por fallo técnico, no por falta de investigación**:
  `queserias-valle-del-alagon-queval` (queval.es devuelve 503 también en
  navegador) y `cervezas-cerex` («Mantenimiento programado»). Ninguna decisión
  se degrada por un fallo técnico; se reabren cuando el sitio vuelva. Cerex se
  vende además en tiendas de terceros (La Despensa de Laura, Sabor a
  Extremadura), que es reventa independiente y **no** cuenta como su canal.
  - Dos hallazgos reutilizables: **Dehesa Barón de Ley no tiene carrito en su
    web de marca — su tienda vive en un dominio aparte, `tiendabarondeley.es`**;
    buscar el dominio de tienda separado antes de concluir evita un falso `no`.
    Y **Bodegas Robledillo de Gata conserva productos de demo de PrestaShop**
    (`mountain-fox`, `brown-bear`) junto a los reales: es residuo de la
    instalación, no una tienda de fachada.
  - Barón de Ley es la única de las 21 sin registro de evidencia: no publica su
    municipio ni en la web ni en contacto/aviso legal, y no se le inventa el
    claim. La evidencia es opcional; el canal sí queda en el CSV.
- Inicio: 2026-07-19.
- Snapshot inicial: **272 filas**; 14 `verificado`, 27 `parcial` y 231
  `pendiente`.
- Modo: completar primero las filas heredadas; candidatos e imágenes quedan
  después de estabilizar identidades, municipios, fusiones y purgas.
- Tras lote 1 / Acehúche (2026-07-19): **272 filas**; 16 `verificado`, 29
  `parcial` y 227 `pendiente`. Silva Cordero y Quesos Mateos quedan verificadas
  con ecommerce propio; La Carantoña y El Acehucheño quedan parciales al no
  disponer de presencia propia actual suficiente. Se retira el dominio de El
  Acehucheño tras confirmar que no resuelve por DNS. La reventa de ambos en
  Cerdito Mío no se atribuye como venta online del productor.
- Tras lote 2 / Ahigal, Alcorneo y Alcuéscar (2026-07-19): **272 filas**; 18
  `verificado`, 31 `parcial` y 223 `pendiente`. Nieto Martín y Aceitolivex
  quedan verificadas con ecommerce; la certificación vigente sostiene la planta
  de embutidos de Ahigal y se normaliza la dirección pública de Aceitolivex.
  Bodega Borrego Macías y Miel de Abril quedan parciales por depender de
  evidencia secundaria/local sin presencia propia actual suficiente.
- Tras lote 3 / Aldeanueva del Camino (2026-07-20): **272 filas**; 23
  `verificado`, 33 `parcial` y 216 `pendiente`. Se verifican El Ángel, Las
  Colmenillas, Quesos de Granadilla, Miel Gran Reserva y Dulces Gayo; tres
  canales remotos quedan demostrados y El Ángel se fija en venta `no`. Miel de
  Ángel queda parcial por techo de fuente y Santo Domingo por dominio caído y
  fábrica anunciada en venta, sin convertir esa señal en una purga por cierre.
- Tras lote 4 / Aliseda, Almoharín, Arroyo de la Luz y Botija (2026-07-20):
  **272 filas**; 26 `verificado`, 36 `parcial` y 210 `pendiente`. Se verifican
  La Patilla, Productos La Higuera y Montilla Suárez; La Higuera queda con
  ecommerce. Beatriz, Marisa y Tamussia quedan parciales por falta de fuente
  propia accesible suficiente; Tamussia mantiene dominio propio, pero devuelve
  error 500 de base de datos.
- Tras lote 5 / Cabezuela del Valle y Cáceres (aceite y cerveza) (2026-07-20):
  **271 filas**; 29 `verificado`, 39 `parcial` y 203 `pendiente`. Cerezas Rey,
  La Dama del Valle y La Patrona quedan verificadas con ecommerce; TOTE'S, El
  Livi y Aceites La Extremeña quedan parciales por techo de fuente. Se purga
  CerveZeres al confirmar en su tienda propia que revende cervezas de múltiples
  elaboradores y no acredita producción propia.
- Tras lote 6 / Cáceres (charcuterías) (2026-07-20): **267 filas**; 31
  `verificado`, 40 `parcial` y 196 `pendiente`. Carnicería Ángel y Maextre
  quedan verificadas con venta remota; Ibéricos Cáceres queda parcial por techo
  de fuente. Se purgan El Mercadillo, Ibéricos Alvarado, Redondo y Jamonería
  Nuevo Cáceres al quedar acreditado su alcance comercial sin elaboración
  propia.
- Tras lote 7 / Cáceres (conservas, queso, miel y hornos) (2026-07-20): **267
  filas**; 35 `verificado`, 43 `parcial` y 189 `pendiente`. El Castúo y
  PANHABLA quedan con ecommerce; Cortijo Apícola y las Madres Jerónimas se
  verifican sin venta remota demostrada. Jarry, Aymar y La Tradición quedan
  parciales por techo de fuente o fallo de su dominio propio.
- Tras lote 8 / Cadalso, Calzadilla, Cañamero, Cañaveral, Carbajo y Carcaboso
  (2026-07-20): **267 filas**; 42 `verificado`, 44 `parcial` y 181
  `pendiente`. Agapita Rubio, Cañalva, Ruiz Torres, Mallo y Francisco Morán
  quedan con ecommerce; Terra Capra y Camperos Campos se verifican sin venta
  remota demostrada. Torbi queda parcial por depender de una ficha alojada.
- Tras lote 9 / Carrascalejo y Casar de Cáceres (2026-07-20): **265 filas**;
  48 `verificado`, 46 `parcial` y 171 `pendiente`. Oleoext, Caprijara, Los
  Casareños, Doña Francisca, Iberqués y Quesos del Casar quedan verificados
  con ecommerce; Barrantes y Teodoro Pérez quedan parciales. Se purgan
  Carnicería Agustín y Productos El Bici por no acreditar producción propia.
- Tras lote 10 / Casar de Cáceres a Coria (2026-07-20): **264 filas**; 49
  `verificado`, 52 `parcial` y 163 `pendiente`. Olibor queda verificado con
  ecommerce; seis productores pequeños quedan parciales por techo de fuente.
  Bodegas Valdepeñas de Coria se purga por ser distribuidor mayorista.
- Tras lote 11 / Coria, Cuacos de Yuste y Deleitosa (2026-07-20): **262
  filas**; 53 `verificado`, 54 `parcial` y 155 `pendiente`. La Esencia y San
  Simón se verifican sin venta remota; Sierra de las Villuercas e Hijas de
  Eduardo Nieto con ecommerce. Las Hermanas y Dehesa de Deleitosa quedan
  parciales; Don Solomillo y Jamones Jama se purgan como comercios.
- Tras lote 12 / Deleitosa a Garrovillas (2026-07-20): **262 filas**; 55
  `verificado`, 60 `parcial` y 147 `pendiente`. Quesería Almonte queda
  verificada sin venta remota y As Pontis con ecommerce; las seis filas
  restantes quedan parciales por techo de fuente, sin purgas.
- Tras lote 13 / Gata, Guadalupe, Guijo de Santa Bárbara y Hervás
  (2026-07-20): **259 filas**; 59 `verificado`, 61 `parcial` y 139
  `pendiente`. La Almazara Tradicional y Sabores del Guijo quedan con
  ecommerce; Gaia y Dulces Gayo sin venta remota. Se fusiona el duplicado del
  obrador de Casa Alonso y se purgan dos charcuterías minoristas de Guadalupe.
- Tras lote 14 / Hervás, Hoyos, Jaraicejo y Jaraíz de la Vera (2026-07-20):
  **257 filas**; 62 `verificado`, 65 `parcial` y 130 `pendiente`. Pistajara y
  Nuestra Señora del Salobrar quedan verificadas con ecommerce; Embutidos de
  Matías queda parcial. Se fusiona su tienda duplicada y se
  purga Pastelería Rofe por no acreditar elaboración propia.
- Tras lote 15 / cárnicos y pimentón de Jaraíz de la Vera (2026-07-20): **257
  filas**; 67 `verificado`, 67 `parcial` y 123 `pendiente`. Marsan, El Colorín,
  La Ristra y Unión de Productores quedan con ecommerce; La Matanza Artesana,
  sin venta remota demostrada. El Pico y Jariza quedan parciales por techo de
  fuente.
- Tras lote 16 / Jaraíz, Jarandilla y Jerte (2026-07-20): **253 filas**; 67
  `verificado`, 71 `parcial` y 115 `pendiente`. La Cooperativa Agroecológica
  queda con ecommerce; Pastelería Valentín, Sopetrán y León
  Martín quedan parciales. Se purgan dos comercios y dos fichas sin productor
  acreditado.
- Tras lote 17 / La Moheda, Las Mestas, Losar, Madrigal y Majadas
  (2026-07-20): **252 filas**; 71 `verificado`, 73 `parcial` y 108
  `pendiente`. El Tío Picho, Don Cirilo y Coolosar quedan con ecommerce; El
  Molino de Gredos, sin venta remota demostrada. Ovejero's y Huertoymar quedan
  parciales y se purga una tienda de alimentación.
- Tras lote 18 / Malpartida de Cáceres (2026-07-20): **252 filas**; 73
  `verificado`, 76 `parcial` y 103 `pendiente`. El Edugón y Morán quedan
  verificados con ecommerce; Amelezza, Marcial y La Tahona quedan parciales
  por techo de fuente.
- Tras lote 19 / Malpartida de Plasencia y Marchagaz (2026-07-20): **252
  filas**; 76 `verificado`, 77 `parcial` y 99 `pendiente`. Sierra de Monfragüe
  y Oleosetin quedan con ecommerce; Espagry se verifica como transformador de
  fruta, corrigiendo su categoría. La cooperativa almazara queda parcial.
- Tras lote 20 / Miajadas (2026-07-20): **252 filas**; 80 `verificado`, 79
  `parcial` y 93 `pendiente`. Olivos del Búrdalo, Ángel Ortiz y El Bartolo
  quedan con ecommerce; Horno María, sin venta remota demostrada. Olesus y
  Pastelería Vicente quedan parciales por techo de fuente.
- Tras lote 21 / Mirabel y Montánchez (2026-07-20): **250 filas**; 81
  `verificado`, 82 `parcial` y 87 `pendiente`. Álvaro Galán queda verificado
  con ecommerce; la cooperativa, Jamones y Embutidos Montánchez y Montilla
  Suárez quedan parciales por techo de fuente. Se purgan Legumbres Mirabel,
  distribuidor mayorista, y Casa Vínculo, comercio minorista sin elaboración
  propia acreditada.
- Tras lote 22 / Moraleja (2026-07-20): **248 filas**; 85 `verificado`, 83
  `parcial` y 80 `pendiente`. Merino, Sendín, Ferrer y Productos Silvestres
  quedan verificados; Sendín, con ecommerce. Productos Agrícolas de Cáceres se
  integra en Sendín al ser su titular legal, e Hijos de Román se purga como
  mayorista. La Alameda queda parcial por la absorción por Cooprado aprobada en
  junio de 2026, aún dentro del plazo legal de oposición.
- Tras lote 23 / Navaconcejo y Navalmoral de la Mata (2026-07-20): **244
  filas**; 89 `verificado`, 88 `parcial` y 67 `pendiente`. Cerezas Morales
  queda con ecommerce, La Chaparrera con pedidos remotos y la cooperativa de
  Navaconcejo y Aire y Colmena se verifican sin venta remota demostrada. Cinco
  filas quedan parciales; se purgan Bodegas Colado, Carnicería Carlos y El Gran
  Paladar como comercios, y el punto de venta de Dehesa de Deleitosa se integra
  en su fábrica. Mieles de Elliot se corrige a Aire y Colmena en Talayuela.
- Tras lote 24 / Navezuelas a Perales del Puerto (2026-07-20): **244 filas**;
  91 `verificado`, 92 `parcial` y 61 `pendiente`. Dehesavieja y Capricho
  Extremeño quedan verificados sin venta remota demostrada; Miel Navezueleña,
  Aceites Arroyo, Hermanas Brasero y El Rañal quedan parciales por techo de
  fuente. No hay purgas.
- Tras lote 25 / Pinofranqueado y Plasencia (aceite, vino y charcuterías)
  (2026-07-20): **240 filas**; 97 `verificado`, 92 `parcial` y 51 `pendiente`.
  Apihurdes y las sucursales Bernal se consolidan en una identidad cada una;
  Finca La Barca, Viña Placentina, Bernal y Vega Selección quedan con venta
  remota, e Iberbal sin ella demostrada. El Cerdito Ibérico se purga como
  comercio sin elaboración acreditada.
- Tras lote 26 / Plasencia (queserías y obradores) (2026-07-20): **240
  filas**; 100 `verificado`, 94 `parcial` y 46 `pendiente`. El Cabrón queda con
  ecommerce; Don Pablo y Ecotahona se verifican sin venta remota demostrada;
  La Pasión Dulce y Virgen del Puerto quedan parciales por techo de fuente.
- Tras lote 27 / Salvatierra de Santiago a Zarza de Granadilla, con cierre de
  Trujillo (2026-07-28): **232 filas**; 129 `verificado`, 103 `parcial` y
  **0 `pendiente`**. Queda cerrada la primera pasada provincial. Se verifican
  29 productores, 19 de ellos con ecommerce propio, y nueve filas quedan
  parciales por techo de fuente. Se fusionan La Purísima con la Cooperativa La
  Inmaculada y el secadero duplicado de IberPro con su fábrica de Torrecillas de
  la Tiesa. Casa Bautista se corrige desde la tienda de Trujillo a su unidad
  productiva de Montánchez. Se purgan seis comercios, revendedores o unidades
  fuera de alcance: La Encamisá, Pacorro, la fábrica genérica sin identidad,
  Ibéricos Paulino, Hortofrut de Coria y Santa Lucía de Valdastillas.

## Criterios locales

- La DOP Queso de Acehúche y los consejos reguladores ayudan a confirmar
  identidad, producto y territorio, pero sin presencia propia viva el techo es
  `parcial`.
- Una tienda de terceros que revende un producto no demuestra `Venta online=sí`
  para el productor.
- Los municipios pequeños permiten lotes compactos; Cáceres, Plasencia,
  Trujillo y Jaraíz de la Vera deben dividirse por categoría y riesgo.
- Antes de aceptar filas de capital o grandes núcleos, comprobar que sean
  elaboradores y no tiendas, carnicerías minoristas o revendedores.

## Plan de continuación

1. Hacer la pasada transversal de duplicados residuales, enlaces, geografía e
   imágenes.
2. Revisar de forma dirigida los 103 `parcial` y los `Venta online=no
   comprobado`, priorizando señales nuevas y fuentes propias recuperadas.
3. Auditar todos los `Venta online=sí` y decidir después candidatos y cobertura
   de evidencia.

## Reanudación

- Ejecutar `git status --short` y `npx pnpm list:province caceres --pendientes`.
- Consultar solo los slugs del siguiente lote en CSV y JSONL.
- Cerrar cada lote con `check:csv:changed`, `check:evidence:changed`,
  `git diff --check` y, al final de la sesión de datos, `verify:data`.
