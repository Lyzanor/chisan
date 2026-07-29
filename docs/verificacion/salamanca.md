# Verificación provincial de Salamanca

Ledger para planificar y reanudar la verificación profunda de
`data/csv/castilla-y-leon/salamanca.csv`. El CSV es la fuente de verdad y la
evidencia por decisión vive en `data/evidence/castilla-y-leon/salamanca.jsonl`.

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`; este documento
fija el snapshot, los riesgos locales y el alcance de los lotes. Los contratos
aplicables son `docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md` y
`docs/EDITORIAL_POLICY.md`.

> **⚑ PASADA CERRADA el 2026-07-27, reconciliada el 2026-07-28 y revisada en
> Ola 3 el 2026-07-29.** 132 filas, 98 `verificado`, 34 `parcial` y **0
> `pendiente`**; 76 `Venta online=sí`, todas con canal, 43 `no` y 13 `no
> comprobado`; 0 errores y **0 avisos** de data-quality; ninguna fila fuera del
> geo-check. Salamanca tiene `keep` para sus 132 filas. No reabrir lotes
> cerrados sin motivo nuevo.

## Cómo reanudar

1. Leer `git status --short`, Estado, Reglas locales y solo el lote activo.
2. Confirmar que no hay cambios concurrentes en Salamanca.
3. Corregir el `municipio` cuando el volcado trajo una pedanía: son 14 filas y
   ninguna es un municipio real (Reglas locales 1).
4. Resolver `Venta online` desde cero: el valor heredado es honesto
   (`no comprobado` en 142 de 143), así que no hay nada que deshacer.
5. Reescribir `descripcion` en cada fila que se toque: el volcado trae plantilla
   compartida en 71 filas y la categoría del texto contradice la columna
   `categoria` en 65 (Reglas locales 2).
6. Editar el CSV de forma estructurada, añadir una línea JSONL por decisión y
   actualizar aquí el resumen del lote.
7. Pasar `check:csv:changed`, `check:evidence:changed` y `git diff --check`.
   El cierre provincial pasa `verify:data`.

Los lotes agrupan de 8 a 15 filas por categoría o zona. No se añaden candidatos
nuevos hasta terminar la primera pasada de las filas existentes.

## Definición de completado

- No queda ninguna fila sin decisión editorial revisada en esta pasada.
- `pendiente` solo sobrevive con bloqueo real documentado; `parcial` es un
  resultado final válido cuando la evidencia tiene techo registral o secundario.
- Cada fila conservada tiene un `keep` vigente y cada baja o consolidación un
  `purge` o `merge` trazable.
- Todos los `Venta online=sí|no` están demostrados y los `sí` tienen canal.
- Cero filas fuera del geo-check y cero avisos de distancia.
- Salamanca se añade a `data/evidence/coverage.json` solo al cerrar la pasada.

## Estado

- Inicio: **2026-07-27**. Primera pasada profunda de las **143 filas**
  existentes; no añadir candidatos hasta el cierre.
- Snapshot inicial: **143 filas**; **143 `pendiente`**, 0 `parcial`, 0
  `verificado`. Venta online: **1 `sí` (sin canal), 142 `no comprobado`**.
- Evidencia inicial: **el fichero JSONL no existe**; 0 registros para 143 filas.
- Imágenes: **0 de 143 filas con imagen**; queda fuera de esta pasada.
- Contacto: **143 filas sin `correo`**, 53 sin `telefono`, 66 sin `web`.
- Avisos de data-quality: **71**, todos de `descripcion` repetida; **0 errores**.
  Filas fuera del geo-check: **14**.
- Las 77 filas con `web` dan **76 dominios distintos y ningún directorio**: es
  el campo sano del volcado, al revés que en Baleares o Segovia.
- El árbol tenía trabajo concurrente en Badajoz al iniciar; queda expresamente
  fuera de este expediente.

### Cierre (2026-07-27)

- **143 → 133 filas**: 7 purgas y 3 fusiones de duplicado. Otras 8 filas
  cambiaron de identidad o de municipio con `merge`, sin cambiar el recuento.
- **96 `verificado`, 36 `parcial`, 1 `pendiente`.**
- Venta online: **75 `sí` (75/75 con canal)**, 17 `no` demostrado, 41 `no
  comprobado`.
- Evidencia: **150 registros** (132 `keep`, 7 `purge`, 11 `merge`) para 133
  filas; **132 de 133 cubiertas**.
- Avisos de data-quality: **71 → 0**. Contrato: 0 errores. Geo-check: 0 filas
  fuera y 0 avisos de distancia. `check:images`: 0/0.
- `check:evidence`: **1 aviso, deliberado** (AQ5 Sabores, explicado en SA-01).
- Contacto recuperado: **~85 correos** donde no había ninguno, unos 30
  teléfonos y unas 30 webs.

### Reconciliación final (2026-07-28)

- **97 `verificado`, 36 `parcial`, 0 `pendiente`**; venta online sin cambios.
- El Obrador 4.0 queda verificado como unidad productiva de Grupo Tapas:
  licencia municipal del obrador en C/ Río Carrión 9 y actividad propia vigente
  en 2026.
- AQ5 se corrige de la oficina administrativa de Salamanca a su municipio
  productivo, Ahigal de los Aceiteros; conserva `parcial` por molturación
  externa y olivar sin localización pública exacta.
- Evidencia: **152 registros** (133 `keep`, 7 `purge`, 12 `merge`) y 0 avisos.
  Salamanca entra en `data/evidence/coverage.json`.

### Ola 3 · Venta online y segunda pasada (2026-07-29)

- **133 → 132 filas**: Carralejos se fusiona en Quesos Amado Charra; la tienda
  oficial de Amado identifica Carralejos como gama propia y ambas filas
  compartían dirección, teléfono y unidad productiva.
- Venta online: **75/17/41 → 76 `sí`, 43 `no`, 13 `no comprobado`**. Don
  Hornazo aporta el nuevo ecommerce; 26 canales públicos actuales no ofrecen
  pedido remoto y los 13 residuales conservan incertidumbre técnica o de fuente.
- El Manjuelo deja de ser una fila genérica de Salamanca: pasa a su identidad
  cooperativa y ubicación reales en Endrinal, con carne de vacuno certificada.
- Cerveza Bizarra se traslada de una dirección comercial antigua a la fábrica
  vigente del polígono Montalvo II. Evidencia final: **153 registros** —132
  `keep`, 7 `purge` y 14 `merge`.

### Residuales para la 2ª pasada

- **Imágenes: 0 de 132 filas.** Es el hueco más grande y queda entero.
- **13 `Venta online=no comprobado`**: Bodegas Labrador, Quinta de las Velas,
  Carne Fresca Ibérica Yebra, Jamón Pinucho, IberoArt, Revisan, Pagos de Izcala,
  Mermeladas La Aldea, La Roblicita, Garrapiñadas M. Sánchez, Hacienda Zorita,
  La Casa del Pan III y El Bardal. Son fallos técnicos, dominios sin lectura o
  ausencia de fuente propia viva; no se fuerzan a `no`.
- **Desajustes obrador/tienda anotados**: Faustino Prieto, Confitería Santa
  Lucía, Confitería Gil y Revisan.

## Reglas y riesgos locales

1. **El `municipio` trae pedanías, no municipios.** 14 filas quedan fuera del
   geo-check porque su `municipio` no existe como tal:
   - **Campillo de Salvatierra (12 filas)** es entidad local menor de
     **Guijuelo** desde su anexión forzosa en 1974 (INE 37156000301). Las 12
     filas caen a 0,8-1,7 km del centroide de Guijuelo, así que el municipio
     correcto es Guijuelo y las coordenadas ya eran buenas.
   - **Polígono Industrial Los Villares (1 fila)** es el polígono de
     **Villares de la Reina** (CP 37184), no un municipio.
   - **Sanjuanejo (1 fila)** es una alquería de **Ciudad Rodrigo** (CP 37591).

   Corregir la columna `municipio`; el `slug` conserva el sufijo antiguo salvo
   que la fila cambie de identidad, porque el slug es la URL pública.

2. **`descripcion` es plantilla y miente sobre la categoría.** 71 filas
   comparten texto con otra fila y 65 dicen «Productor local de *X*» con una
   *X* que no es su `categoria` (p. ej. `Charcutería` descrita como «despensa
   artesanal»). 52 declaran proceder de *Salamanca en Bandeja*. Toda fila que
   se toque necesita descripción propia escrita desde la fuente.

3. **`productos estrella` es la etiqueta de la categoría, no el producto.** 131
   de 143 filas repiten uno de 11 literales genéricos («Carnes y embutidos»,
   «Vino», «Pan y dulces»…). Concretar al verificar.

4. **`horario` es el marcador estándar del repo** («Consultar web o venta
   directa» en las 143). No es un defecto y no se toca sin horario real.

5. **Tres pares duplicados declarados**, misma dirección y en dos casos mismo
   teléfono y web:
   - `soleae-herguijuela-de-la-sierra` / `soleae-aceite-de-oliva-virgen-extra-herguijuela-de-la-sierra`
   - `queseria-artesanal-cynara-hinojosa-de-duero` / `queseria-cynara-hinojosa-de-duero`
   - `quesos-de-hinojosa-hinojosa-de-duero` / `quesos-de-hinojosa-felipe-hernandez-vacas-sl-hinojosa-de-duero`

   Sobrevive la fila con más datos de contacto; la otra sale con `merge`.

6. **Guijuelo concentra 37 filas de charcutería** entre Guijuelo, Campillo y
   Ledrada. Es una comarca de secaderos con mucha marca comercial, mucha maquila
   y mucho grupo: hay que separar productor con marca propia de secadero que
   solo hace maquila o de comercializadora sin fábrica.

7. **`direccion` trae campos pegados, a veces con emojis.** Aparecieron cinco
   casos: Apicasfer, Jamón Prim, Legumbres La Salmantina, Bacalao M. Bueno y
   Julián Martín, con teléfonos y correos incrustados delante de la calle
   («☎️ 609534550, 📧 contacto@…, Ctra. Guijuelo»). Rescatar el dato a su
   columna y limpiar la dirección.

8. **El volcado cruza empresas distintas.** Media docena de filas traían web,
   teléfono o dirección de otra entidad: un consejo regulador convertido en
   bodega, una hamburguesería en una quesería, una cervecera en otra, una
   empresa de Leganés en una tienda de miel de Salamanca. **Cuando el dominio no
   case con el nombre, comprobarlo antes de darlo por bueno.**

9. **Tienda ≠ obrador.** Varias casas de la capital elaboran en Villares de la
   Reina, Castellanos de Moriscos, Carbajosa o Cespedosa y despachan en
   Salamanca. Se conserva la dirección pública, la que casa con las
   coordenadas, y la fila baja a `parcial` con el desajuste escrito.

## Worklist

| Lote | Alcance | Filas | Estado |
| --- | --- | --- | --- |
| SA-00 | Higiene, snapshot y partición | — | ✅ |
| SA-01 | Aceite y bodegas de Arribes | 8 | ✅ |
| SA-02 | Bodegas de Sierra de Francia y resto | 13 | ✅ |
| SA-03 | Charcutería de Guijuelo | 13 | ✅ |
| SA-04 | Charcutería de Campillo de Salvatierra | 12 | ✅ |
| SA-05 | Charcutería de Ledrada | 12 | ✅ |
| SA-06 | Charcutería del resto de la provincia | 12 | ✅ |
| SA-07 | Charcutería capital, despensa, conservas y chocolate | 11 | ✅ |
| SA-08 | Lácteos y quesos | 15 | ✅ |
| SA-09 | Legumbres | 10 | ✅ |
| SA-10 | Miel, cerveza, licores y helados | 10 | ✅ |
| SA-11 | Pan y pastelería de Salamanca capital | 15 | ✅ |
| SA-12 | Pan del resto y categorías sueltas (cierra la pasada) | 12 | ✅ |

## SA-00 — Higiene, snapshot y partición ✅

Alcance: crear el expediente, medir el volcado y dejar el CSV en condiciones de
verificarse por lotes. No emite decisiones editoriales de fila.

Hecho:

- Corregidos los **14 `municipio`** que eran pedanías o polígonos (Reglas
  locales 1): 12 → `Guijuelo`, 1 → `Villares de la Reina`, 1 → `Ciudad Rodrigo`.
  Solo se tocó esa columna. **Ninguna fila queda ya fuera del geo-check** y no
  aparece ningún aviso de distancia.
- Auditoría tras el arreglo: **0 errores, 71 avisos**, todos de `descripcion`
  repetida, que se irán resolviendo lote a lote.
- Los tres pares duplicados no se deciden aquí: cada uno se resuelve en el lote
  de su categoría (Soleae en SA-01, los dos de Hinojosa de Duero en SA-08),
  porque hay que verificar antes cuál de las dos filas es la empresa real.

## SA-01 — Aceite y bodegas de Arribes ✅

8 filas → **7**. Resultado: 5 `verificado`, 2 `parcial`, 0 `pendiente`; Venta
online 6 `sí` (todas con canal `ecommerce`) y 1 `no comprobado`.

- **La fila «Bodega Ribera de Pelazas» era una identidad muerta.** Traía la web
  y el móvil de otra empresa. En `Camino de la Ermita s/n` de Pereña opera
  **Bodegas de Pereña S.L.**, que es quien figura en el registro vigente de la
  D.O. Arribes y quien sigue vendiendo la gama **Abadengo**, la marca de Ribera
  de Pelazas; el dominio `bodegasriberadepelazas.com` está aparcado y en venta.
  Fila renombrada a `bodegas-de-perena-perena-de-la-ribera` con `merge` desde el
  slug antiguo.
- **Soleae estaba dos veces**: la segunda fila era el rótulo largo de la web
  («Soleae. Aceite de Oliva Virgen Extra»), sin ningún dato propio. `merge`.
- **Quinta las Velas queda en `parcial` por techo registral**: la D.O. Arribes y
  Salamanca en Bandeja la mantienen con la dirección y el teléfono del volcado,
  pero la web que ambas enlazan, `quintalasvelas.com`, responde 404 por http y
  https. Campo `web` vaciado.
- **AQ5 Sabores queda en `parcial` y se corrige a Ahigal de los Aceiteros.**
  Su web confirma que cultiva olivos en Arribes y moltura allí sus aceitunas;
  Calidad Rural también la sitúa en ese municipio. Se retiran la dirección y
  las coordenadas de la oficina administrativa de Salamanca capital. El techo
  parcial se mantiene porque usa una almazara externa y no publica la ubicación
  exacta del olivar.
- Rescatados 6 correos; AQ5 conserva teléfono, correo y tienda propios.
- Las 4 bodegas y los 3 aceites restantes tienen tienda propia con carrito y
  precios comprobados uno a uno, no enlaces a terceros.

## SA-02 — Bodegas de Sierra de Francia y resto ✅

13 filas → **12**. Resultado: 8 `verificado`, 4 `parcial`, 0 `pendiente`; Venta
online 8 `sí` (todas con canal) y 4 `no comprobado`.

- **«Bodega Dominio de la Sierra» venía cruzada con su consejo regulador.** La
  web `dosierradesalamanca.es` y el teléfono de la fila son los del **Consejo
  Regulador de la D.O.P. Sierra de Salamanca**, con sede en Mogarraz, y de ahí
  salían también el municipio y el CP. La bodega existe, se llama Bodegas
  Dominio de la Sierra S.L. y está en **San Esteban de la Sierra**. Fila
  renombrada con `merge`, coordenadas al centroide del municipio real y enlace
  de Google Maps retirado por apuntar al consejo regulador.
- **Purga: «Bodega César Bernardo»** es una tienda de bebidas de la avenida de
  Italia cuyo producto diferenciador es el vino a granel que el cliente se
  lleva de las cubas. `not-producer`.
- **«Bodegas Labrador» se conserva por poco.** Es Cepas del Duero S.L., mayorista
  de bebidas con tienda de vinos de muchas D.O., pero la prensa local documenta
  que en 2017 volvió a elaborar vino propio en la D.O.P. Sierra de Salamanca.
  `parcial`: su dominio no responde ni por http ni por https.
- **Falsa alarma de desplazamiento de columna.** Un directorio (terranostrum)
  atribuía a El Abuelo Flores la dirección de Don Celestino y a este la de
  Vínculo Serrano, lo que parecía un *off-by-one* del volcado. No lo era: la web
  de Vínculo Serrano y el portal de la Junta confirman al pie de la letra las
  direcciones del CSV. El único error real era el número de El Abuelo Flores
  (La Mata 7, no Mata 5). **El directorio era la fuente sucia, no el CSV.**
- **Perahigos queda en `parcial` por dos direcciones propias**: su web sitúa la
  bodega en la finca de Miranda del Castañar y el volcado, Google y los
  directorios en Garcibuey. Se conserva Garcibuey por coherencia con las
  coordenadas y el punto de Maps.
- Rescatados 11 correos y 3 teléfonos que la fila no traía.

## SA-03 — Charcutería de Guijuelo ✅

13 filas → **12**. Resultado: 12 `verificado`, 0 `parcial`, 0 `pendiente`; Venta
online 12 `sí`, todas con canal `ecommerce`.

- **El volcado no capturó las webs, no es que no existieran.** 9 de las 13 filas
  llegaban sin `web` y sin `telefono`, y las nueve tienen sitio propio con
  tienda. Recuperadas 9 webs, 8 teléfonos y 9 correos. En Guijuelo, `web` vacío
  no es señal de nada.
- **Purga: «Ibéricos Juan José»**, tienda degustación en un bajo de Filiberto
  Villalobos que vende ibérico junto a quesos, aceite, miel, vinos y conservas
  de terceros. Su propia web se anuncia como «tu tienda online en Guijuelo» y
  ninguna fuente le atribuye fábrica ni secadero. `not-producer`.
- **El registro de la D.O.P. Guijuelo apenas sirve como red de seguridad**: de
  las 13 filas solo Martín-Matas figura en su listado de socios certificados.
  Las otras once son elaboradores reales y comprobados por fuente propia, así
  que aquí no estar en la D.O.P. no dice nada sobre ser productor.
- Direcciones corregidas contra la fuente propia en Rodilla & González (C.
  Clavel 3, no Sierra de Quilama) y Martín-Matas (Plaza Santa María 21).
- **Julián Martín traía dos teléfonos pegados dentro de `direccion`**, como
  Apicasfer. Limpiada la dirección y rescatado el teléfono a su columna.

## SA-04 — Charcutería de Campillo de Salvatierra ✅

12 filas → **11**. Resultado: 9 `verificado`, 2 `parcial`, 0 `pendiente`; Venta
online 9 `sí` (8 `ecommerce`, 1 `marketplace`) y 2 `no comprobado`.

- **Confirmado el arreglo de SA-00 desde la propia empresa**: FISAN publica en
  su web «Calle Amable Criado 29, 37778 Campillo de Salvatierra» y anuncia como
  planta suya de Guijuelo la que inauguró allí en 2020. El municipio real de
  estas doce filas es Guijuelo.
- **Otra vez el volcado se dejó las webs**: 10 de las 12 filas llegaban sin
  `web`; nueve tienen sitio propio y ocho, tienda con carrito.
- **Purga: «Isaías Hernández Varas S.L.»**, matadero industrial, sala de
  despiece y almacén frigorífico, presente en el listado del ministerio de
  autorizados a exportar porcino a Hong Kong precisamente por eso. Sin marca al
  consumidor, sin web y sin punto de venta: `out-of-scope`, el mismo criterio
  con que se podan las unidades de maquila.
- **No todo carrito es tienda propia.** La Rosa Ibérica no tiene la suya: su
  botón de compra lleva al mercado de Tierra de Sabor, así que su canal es
  `marketplace`. E Ibéricos Yebra tiene carrito pero se presenta como sección
  de profesionales, vende por presupuesto y lista wagyu: queda en `parcial` con
  la venta sin comprobar.
- **Jamón Pinucho se queda sin `web` a propósito**: `primarsa.es` devuelve 403 a
  toda petición nuestra. El dominio existe, pero no se publica una URL que no se
  ha podido comprobar. Sí se rescatan su teléfono y su correo.

## SA-05 — Charcutería de Ledrada ✅

12 filas, **12 conservadas**, 0 purgas. Resultado: 10 `verificado`, 2 `parcial`,
0 `pendiente`; Venta online 5 `sí` (4 `ecommerce`, 1 `telefono|email`), 4 `no`
demostrado y 3 `no comprobado`.

- **Las 12 llegaban sin `web` y sin `telefono`, y las 12 son reales.** Ledrada
  es un pueblo de secaderos: se recuperaron 10 webs, 9 teléfonos y 9 correos.
  Ninguna fila del lote hubo que purgarla.
- **Aquí `Venta online=no` es un resultado, no una laguna.** Cuatro casas
  (Cayo Rodríguez, Gregorio Rodríguez, Atilano González y Los González) tienen
  web viva y catálogo, pero sin carrito ni precios: comprobado que no venden en
  línea, no que no se haya mirado.
- **Embutidos Fili vende sin carrito**: publica una línea aparte de «pedidos a
  particulares» y envía a domicilio, así que su canal es `telefono|email`.
- **Los González Ibéricos se conserva y Isaías Hernández Varas no**, aunque los
  dos sean B2B: los González elaboran con marca propia y sirven a restaurantes
  y tiendas, donde el producto llega al consumidor identificado; el otro es
  matadero y sala de despiece sin marca ninguna.
- Direcciones corregidas contra fuente propia en Florencio Gómez (C. Arriba 31,
  no 2) y La Bejarana (Pilarillo 11, no 3).
- **Dos `parcial` por web inaccesible**, no por duda sobre la empresa: IberoArt
  no establece conexión (código 000, ni siquiera 404) y CIBEGO solo sirve una
  portada de entrada vacía. En ninguno de los dos se publica URL.

## SA-06 — Charcutería del resto de la provincia ✅

12 filas, **12 conservadas**, 0 purgas. Resultado: 10 `verificado`, 2 `parcial`,
0 `pendiente`; Venta online 9 `sí` (todas `ecommerce`), 1 `no` demostrado y 2
`no comprobado`.

- **Un error de categoría, no de existencia: «Pagos de Izcala» no es
  charcutería.** Componatur S.L. es una ganadería de vacuno de razas Angus y
  Wagyu con selección genética propia en Izcala (Topas). La fila pasa a
  `Carne`, que es la forma que usa el repositorio (108 filas frente a 19 de
  `Carnes`).
- **Tercer caso de campos pegados en `direccion`**, y el más aparatoso: Jamón
  Prim traía «☎️ 609534550, 📧 contacto@dehesadeprim.com, ☎️ 923555906» con
  emojis delante de la calle. Limpiado, y con el correo que publica su web.
- Direcciones corregidas contra fuente propia en IBISMA (C. Nicaragua 44, no
  Av. Fuentesaúco 72).
- **Cuidado con el municipio comercial.** La Vega de Salvatierra se anuncia «de
  Guijuelo» e Ibéricos Izquierdo rotula «Salamanca», pero la sociedad está en
  Fuenterroble de Salvatierra y la fábrica en Martinamor. El municipio del
  volcado era el correcto en ambos casos; lo que faltaba era la fuente, que se
  añadió antes de dar por buena la verificación.
- Recuperadas 3 webs, 3 teléfonos y 9 correos.

## SA-07 — Charcutería capital, despensa, conservas y chocolate ✅

11 filas → **10**. Resultado: 6 `verificado`, 4 `parcial`, 0 `pendiente`; Venta
online 4 `sí`, 2 `no` demostrado y 4 `no comprobado`.

- **Purga: «AJA Morchón Salamanca S.L.» no elabora chocolate ni nada.** Es
  distribuidora para obradores profesionales —mejorantes, masas congeladas,
  moldes, harinas, maquinaria— y representa marcas ajenas (Puratos, Europastry,
  Lactalis, Debic). La categoría `Chocolate` del volcado salía de que vende
  coberturas de terceros. `not-producer`.
- **Tres municipios mal, todos «Salamanca» de más.** El Pernil está en
  Castellanos de Moriscos (CP 37439), Hergaher en Carbajosa de la Sagrada (CP
  37188) y La Roblicita en Alba de Yeltes, no en Aldehuela. En los tres el CP
  del propio volcado ya delataba el error, y las coordenadas caen a 0,7, 2,1 y
  4,2 km del centroide correcto: **el municipio era el campo equivocado, no las
  coordenadas**. Filas renombradas con `merge`.
- **Tienda ≠ fábrica.** Faustino Prieto cura en Cespedosa de Tormes y vende en
  la Plaza Mayor; Revisan tiene en María Auxiliadora un punto de venta, no el
  obrador. Ambas quedan en `parcial` con el desajuste anotado.
- **Dos webs que los directorios citan y no existen**: `mermeladaslaaldea.com` y
  `elmanjuelo.com` no resuelven. Se rescatan teléfonos y correos, pero no se
  publica ninguna de las dos URL.
- Recuperados 5 teléfonos, 7 correos y 4 webs.

## SA-08 — Lácteos y quesos ✅

15 filas → **13**. Resultado: 8 `verificado`, 5 `parcial`, 0 `pendiente`; Venta
online 6 `sí` (5 `ecommerce`, 1 `telefono`), 2 `no` demostrado y 5 `no
comprobado`.

- **Resueltos los dos pares duplicados de Hinojosa de Duero**, y en los dos la
  web lo cerró sin margen: la razón social de Quesos de Hinojosa es **Felipe
  Hernández Vacas S.L.** y la de Quesería Cynara, **Quesería Artesanal Cynara
  E.S.P.J.** Eran el nombre corto y el largo de la misma casa. Sobrevive en cada
  par la fila con el nombre comercial y los datos de contacto.
- **La fila más contaminada de la provincia: Carralejos.** Traía dirección,
  teléfono y web de otro negocio, y el campo `web` apuntaba literalmente a la
  carta de una hamburguesería (`laburqueseria.com/carta/#burgers`). La quesería
  real está en Aldeanueva de la Sierra. Fila renombrada con `merge`, y retiradas
  las coordenadas y el enlace de Maps, que señalaban a la capital.
- **Una posible fusión que no se hace sin prueba**: Carralejos y Quesos Amado
  Charra comparten calle y pueblo, el teléfono de Carralejos coincide con el
  WhatsApp de Amado Charra, y `amadocharra.com` vende una gama «Carralejos».
  Pero Salón Gourmets y Salamanca en Bandeja las listan por separado, así que
  quedan como dos filas y la duda anotada para la 2ª pasada.
- **`Venta online=sí` sin carrito**: Quesos Carlos Navas declara su tienda «en
  preparación» y dirige los pedidos al teléfono, así que su canal es `telefono`.
- **Dos `parcial` por falta de fuente propia, no por duda**: Hacienda Zorita
  (250 ha, 70.000 kg de queso al año y un Super Gold en los World Cheese Awards
  2013) se queda ahí porque el portal del grupo no resuelve; y Santomez, que sí
  aparece en el registro de socios de la Diputación con su dirección exacta.
- La marca de garantía **Queso Arribes de Salamanca** sirvió de red para las dos
  queserías sin web del oeste: Artesanos del Arco Hernández y Queserías Iglesias
  (marca Rabadán).

## SA-09 — Legumbres ✅

10 filas → **9**. Resultado: 9 `verificado`, 0 `parcial`, 0 `pendiente`; Venta
online 5 `sí` (todas `ecommerce`), 3 `no` demostrado y 1 `no comprobado`.

- **Purga: «Legumbres de calidad» es El Centro de la Legumbre**, la institución
  desde la que cada consejo regulador controla la producción y garantiza el
  origen; su web habla de fundación, figuras de calidad que gestiona,
  instalaciones e investigación. Es el mismo error que en SA-02, donde el
  volcado había convertido un consejo regulador en bodega. `not-producer`.
- **Otro error de categoría: Aranpino no es legumbre, es patata.** Su web la
  define como Agrupación de Productores de Patata de Consumo. Pasa a
  `Fruta y verdura`, que es donde el repositorio pone la patata.
- **Bernabé Campal estaba en el municipio de al lado**: sede en Huerta, no en
  Encinas de Abajo, y planta de selección en Pedrosillo el Ralo. Las
  coordenadas lo confirman (1,0 km de Huerta frente a 2,8 de Encinas).
- **Cuarto caso de campos pegados**: La Salmantina traía tres teléfonos y un
  correo con emojis dentro de `direccion`, que además estaba mal numerada
  (Carreancha 58, no 37).
- **La Armuña es comarca de seleccionadoras, no de agricultores**: casi todas
  estas casas envasan legumbre con marca propia bajo la IGP Lenteja de La
  Armuña o la marca de garantía Garbanzo de Pedrosillo, y varias declaran
  abiertamente que compran a agricultores conocidos. Se conservan por marca
  propia e instalación propia, con la matización escrita en cada registro.

## SA-10 — Miel, cerveza, licores y helados ✅

10 filas → **9**. Resultado: 7 `verificado`, 2 `parcial`, 0 `pendiente`; Venta
online 5 `sí` (todas `ecommerce`), 4 `no` demostrado y 2 `no comprobado`.

- **Confirmado el único `Venta online=sí` que traía el volcado.** Apicasfer
  vende de verdad en tienda propia. Era también la fila donde se detectó por
  primera vez el defecto de campos pegados en `direccion`, ya limpiada.
- **Purga: «Helados y Congelados Mata y Martín»** no fabrica nada. Es
  distribuidora B2B de congelado para hostelería, con la distribución en
  exclusiva de helados Nestlé, La Lechera, Findus y McCain; su propia web se
  titula «Congelados Mata y Martín · Helados NESTLE». `not-producer`.
- **Cerveza Bizarra se queda sin `web`, y con motivo doble.** La que traía la
  fila, `labestiacraftbeer.com`, es de otra cervecera salmantina distinta; y el
  dominio propio que publican los directorios, `cervezabizarra.com`, está
  **secuestrado y redirige a `mcafeelogins.com`**, un dominio de phishing. Se
  rescatan teléfono y correo del listado de la Diputación.
- **Homónimo de otra provincia: La Abeja Dorada.** La web de la fila,
  `abejadorada.com`, es de una empresa del mismo nombre en Leganés (Madrid),
  con tienda en `madridmiel.com` y teléfono 91. La de esta fila es la tienda de
  miel de Magallanes 2, en Salamanca, con teléfono 923. Web ajena retirada.
- Recuperados 9 correos; direcciones corregidas en El Majuelar (Guatemala 48).

## SA-11 — Pan y pastelería de Salamanca capital ✅

15 filas → **14**. Resultado final: 6 `verificado`, 8 `parcial`, 0 `pendiente`;
Venta online 4 `sí` (2 `ecommerce`, 1 `marketplace`, 1 `telefono|whatsapp`), 1
`no` demostrado y 9 `no comprobado`.

- **Purga: «La Favorita» no es panadería ni productor.** Su propia web la
  identifica como Ibéricos La Favorita, tienda de la Rúa Mayor que revende
  jamones, embutidos, vinos, quesos, aceites, dulces y conservas de la región.
  El volcado la había metido en `Pan y pastelería`. `not-producer`.
- **El Obrador 4.0 queda `verificado` en la reconciliación del 2026-07-28.**
  El Ayuntamiento vincula la licencia del obrador y cocina de C/ Río Carrión 9
  con Tapas 2.0 Hostel S.L.; el perfil oficial de Grupo Tapas documenta en 2026
  la elaboración de pan de masa madre, focaccia, brioche y croquetas artesanas.
  Se mantiene `no comprobado`: trabaja para restauración y colectividades, pero
  no publica un mecanismo de pedido remoto para consumidor final.
- **«Ganas de Pan» no estaba en la capital.** Su web da como única dirección
  San Pedro de Rozados y ninguna búsqueda encuentra local suyo en la avenida de
  Italia; lo que hay en esa avenida es otra panadería del propio CSV. Fila
  trasladada al municipio documentado con `merge`.
- **Este lote fija una regla nueva: obrador ≠ tienda.** Santa Lucía elabora en
  Villares de la Reina y Confitería Gil también, pero sus filas apuntan a las
  tiendas de la capital. Se conserva la dirección pública, que es la que casa
  con las coordenadas, y la fila baja a `parcial` con el desajuste escrito.
- **Con este lote los avisos de data-quality bajan de 71 a 0**: no queda ninguna
  `descripcion` de plantilla en toda la provincia.
- Webs corregidas: La Industrial pasa del alojamiento gratuito de Jimdo, ya
  roto, a su dominio propio; La Casa del Pan III se queda sin web porque el suyo
  no resuelve; y se rescata la de Confitería Gil, que la fila no traía.

## SA-12 — Pan del resto y categorías sueltas ✅

12 filas, **12 conservadas**, 0 purgas. Resultado: 7 `verificado`, 5 `parcial`,
0 `pendiente`; Venta online 4 `sí` (todas `ecommerce`), 1 `no` demostrado y 7
`no comprobado`.

- **Tercer error de categoría de la pasada: Reina Kilama no es fruta.** Es una
  cooperativa apícola de 1997 con más de ciento cuarenta socios, con
  laboratorio, planta de polen y envasado en San Miguel de Valero, que exporta
  más del 80% de su producción. Pasa a `Miel`.
- **Quinto y último caso de campos pegados**: Bacalao M. Bueno traía teléfono y
  correo con emojis dentro de `direccion`.
- **Pan de Ángel vende, pero no directo**: ciento sesenta años de obleas en
  Cipérez con 10.000 piezas por hora, y distribución solo a supermercados y
  tiendas. `Venta online=no` comprobado.
- **Estar en Amazon no es tener canal propio.** El Bardal aparece en Amazon y en
  tiendas gourmet, pero eso es reventa de terceros, y su dominio
  `setaselbardal.es` no responde: la venta online queda sin comprobar.
- Direcciones corregidas contra fuente propia en Pan de Ángel (C. de las
  Escuelas 8, no Paraje Eritas).
