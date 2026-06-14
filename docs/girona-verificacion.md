# Verificación provincial de Girona

Ledger mínimo para reanudar la revisión profunda de
`data/csv/catalunya/girona.csv`. El CSV sigue siendo la fuente de verdad.

## Estado

- Inicio: 2026-06-14.
- Snapshot inicial: 243 filas; 0 `verificado`, 139 `parcial`, 104 `pendiente`.
- Revisadas: 24.
- Resultado acumulado: 23 `verificado`, 1 `parcial`, 0 purgas, 0 fusiones.

## Lote 1: conservas de L'Escala y arroz de Pals

Revisado el 2026-06-14 con las webs oficiales, sus páginas de contacto y sus
mecanismos de pedido.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `anxoves-callol-serrats-l-escala`, `anxoves-de-l-escala-soles-l-escala`, `arros-mas-pla-pals` |
| `verificado`, venta por `email` | `arros-estany-de-pals-pals`, `arros-avi-trias-pals` |
| `verificado`, sin venta online demostrada | `anxoves-el-xillu-l-escala`, `anxoves-de-l-escala-sa-l-escala` |
| `verificado`, venta `no comprobado` | `arros-moli-de-pals-pals` |

### Excepciones y residuales

- `anxoves-callol-serrats-l-escala`: las páginas oficiales de contacto y
  tienda publican horarios distintos. Se deja `horario` vacío hasta resolver
  cuál corresponde a la atención pública actual.
- `arros-moli-de-pals-pals`: la tienda existe, pero sus seis referencias
  figuraban como no disponibles. Se retira el `sí` heredado y se deja
  `no comprobado` hasta confirmar que vuelve a aceptar pedidos.
- `arros-avi-trias-pals`: la web oficial funciona por HTTP y presenta un
  certificado TLS incorrecto por HTTPS. No se fuerza HTTPS ni se elimina el
  enlace. La página acepta encargos de más de 25 kg por correo.
- `arros-mas-pla-pals`: el contacto comercial está en Torroella de Montgrí,
  pero las fuentes del grupo sitúan el centro de producción y los cultivos en
  Pals. Se mantiene `municipio=Pals` y una ubicación prudente de los campos.
- `anxoves-el-xillu-l-escala` y `anxoves-de-l-escala-sa-l-escala`: las webs
  oficiales muestran producto, contacto y venta física, pero no un mecanismo
  vigente de pedido remoto.

### Fuentes principales

- <https://www.callolserrats.com/>
- <https://www.anxoves-soles.com/>
- <https://www.anxoveselxillu.com/>
- <https://www.anxovesdelescala.es/>
- <https://www.arrosestanydepals.cat/>
- <https://www.arrosmolidepals.com/>
- <https://www.arrosmaspla.com/>
- <http://www.arrosdepals.com/>
- <https://disbesa.com/es/contacto/>

## Lote 2: productores consolidados con datos heredados

Revisado el 2026-06-14 con las webs oficiales, sus páginas de contacto,
condiciones de compra y mecanismos de pedido.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `galetes-trias-santa-coloma-de-farners`, `mooma-palau-sator`, `xocolates-torras-cornella-del-terri` |
| `verificado`, venta por `ecommerce` y `suscripcion` | `cafes-cornella-fornells-de-la-selva` |
| `verificado`, venta por `marketplace` | `la-fageda-santa-pau` |
| `verificado`, sin venta online demostrada | `confraria-de-pescadors-de-palamos-palamos`, `perelada-peralada` |
| `verificado`, venta `no comprobado` | `aigua-de-sant-aniol-sant-aniol-de-finestres` |

### Excepciones y residuales

- `aigua-de-sant-aniol-sant-aniol-de-finestres`: el formulario de reparto
  solo solicita datos para confirmar cobertura, tarifa y pedido mínimo. No se
  considera todavía un canal de compra operativo.
- `la-fageda-santa-pau`: La Fageda indica que no vende directamente online,
  pero remite a supermercados con venta en línea; se registra como
  `marketplace`.
- `mooma-palau-sator`: la página de contacto publica el código postal `17257`,
  mientras que las condiciones de compra y documentación oficial reciente
  usan `17256`. Se conserva `17256`.
- Se retiraron horarios heredados de fábrica, visitas o restauración que no
  describían de forma fiable la atención comercial del productor.

### Fuentes principales

- <https://www.santaniol.com/es/contacto-sant-aniol/>
- <https://www.santaniol.com/es/venta-de-agua-a-domicilio/>
- <https://www.cafescornella.coffee/>
- <https://shop.cafescornella.coffee/>
- <https://www.confraria.cat/>
- <https://www.triasbiscuits.com/>
- <https://www.fageda.com/es/preguntas-frecuentes/>
- <https://www.fageda.com/es/donde-comprar/>
- <https://mooma.cat/condicions-generals-de-compra/>
- <https://perelada.com/>
- <https://chocolatestorras.com/>

## Lote 3: bodegas del Alt Empordà

Revisado el 2026-06-14 con las webs oficiales, las tiendas de vino y, para
Espelt, el consejo regulador y un marketplace vigente.

| Resultado | Slugs |
|---|---|
| `verificado`, venta por `ecommerce` | `celler-la-vinyeta-mollet-de-peralada`, `celler-mas-vida-cistella`, `cooperativa-agricola-de-garriguella-garriguella`, `vinyes-d-olivardots-capmany`, `vinyes-dels-aspres-cantallops` |
| `verificado`, sin venta online de producto demostrada | `celler-d-en-guilla-rabos`, `celler-mas-llunes-garriguella` |
| `parcial`, venta por `marketplace` | `celler-espelt-vilajuiga` |

### Excepciones y residuales

- `celler-espelt-vilajuiga`: el dominio oficial redirige correctamente de
  `www` al dominio raíz, pero el servidor no respondió en varios intentos. La
  identidad y ubicación quedan respaldadas por el Consejo Regulador de la DO
  Empordà y el directorio público de industria; se confirma venta actual en
  marketplace, pero la fila queda `parcial` hasta revisar de nuevo la web.
- `celler-mas-llunes-garriguella`: la web usa WooCommerce y muestra carrito,
  pero los vinos no tienen precio ni formulario de compra. El checkout está
  destinado a reservas y experiencias, por lo que se conserva `Venta
  online=no` para producto.
- `celler-d-en-guilla-rabos`: la web publica una tienda física y su horario,
  sin mecanismo vigente de pedido remoto. El `sí` heredado se corrige a `no`.

### Fuentes principales

- <https://www.cellersdenguilla.com/el-celler/>
- <https://www.cellersdenguilla.com/el-celler/la-botiga/>
- <https://www.doemporda.cat/es/las-bodegas/l/92-espelt-viticultors.html>
- <https://www.vinissimus.com/es/bodega/espelt-viticultors-de-l-emporda/>
- <https://www.lavinyeta.es/ca/els-productes>
- <https://masllunes.es/vins/>
- <https://www.bodegasmasvida.com/es/tienda/vida/>
- <https://www.cooperativagarriguella.com/ca/botiga-online/>
- <https://olivardots.com/botiga-online/>
- <https://botiga.vinyesdelsaspres.cat/es/tienda.html>
