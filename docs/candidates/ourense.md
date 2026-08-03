# Candidatos — Ourense

> Origen: pasada **DO menos cubiertas** (2026-07). Los lotes de DO Ribeiro,
> Valdeorras, Monterrei, Ribeira Sacra y la Festa do Queixo quedaron integrados en
> las fases B y C (≈67 altas); lo integrado está en `data/csv/galicia/ourense.csv`
> y el detalle por lote, en el historial git.
>
> **⚑ COLA CERRADA 2026-08-03: 22 de las 23 entradas integradas, 1 diferida.**

## Diferida (1)

- [ ] **Os Pacios** — A Teixeira (Abeleda, 32). Del CSV oficial del Consello de
  Ribeira Sacra (`ribeirasacra.org/bodegas_csv.php`), pero es la **única ficha de
  la subzona sin marca comercial** y la única que declara producción **en kg de
  uva** (5.000 kg, 0,5 ha) en vez de en litros: perfil de viticultor que entrega
  uva, no de embotellador. Además hay un homónimo, *Adega Os Pacios*, en
  Espasantes (Pantón, **Lugo**), que contamina toda búsqueda. Reabrir solo si
  aparece marca propia y venta.

## Correcciones que salieron de esta cola (reutilizables)

⚠ **«Dominio muerto» ≠ «sin rastro digital».** De las 10 entradas diferidas por
web caída, cuatro tenían web viva en otro dominio y una tercera parte del
diagnóstico estaba caducado:

- *Tear dos Dodi* no es `teardosdodi.com` (NXDOMAIN) sino
  **`adegateardosdodi.com`**, con tienda propia operativa → entró `verificado` y
  `Venta online=sí`. En el registro figura por la razón social **Amalia Diéguez
  Martínez**, no por la marca, y por eso no aparecía al buscar «tear».
- *Ladera Sagrada* no es `.es` (NXDOMAIN) sino `.com` — aunque el `.com` solo
  sirve una portada con el nombre, así que se quedó sin `web`.
- *Bodegas GRM* es el nombre del dominio, no de la adega: la ficha del consejo la
  inscribe como **Bodegas Campante, S.A.** (Finca Reboreda, Puga, Toén).
- *Jorge Ordóñez (proyecto Valdeorras)* es **Bodegas Avancia**, con instalación
  propia en el parque empresarial A Raña de O Barco y certificado 2014/35 vigente.
- *Bodegas Eladio Santalla* está certificada por la razón social **Hacienda
  Ucediños, S.L.**, que es a la vez su marca de vino.

⚠ **Dominio secuestrado por spam de casino:** `adegamanuelrojo.com` **y**
`adegamanuelrojo.es` responden 200 con un portal de «casinos sin licencia». Los
dos son el dominio que publica el consejo. Se integró sin `web`.

⚠ **Municipio = concello de la adega**, tomado de la dirección real de la ficha,
no de la sede del consejo (Ribadavia en Ribeiro, Verín en Monterrei). Las fichas
de Monterrei **sí** publican la dirección propia de cada adega, al contrario de
lo que decía la nota anterior. Concellos resueltos en esta pasada: Abeledos →
Tamagos (**Verín**) · Daniel Fernández → Queizás (**Verín**) · Franco Basalo →
**Castrelo do Val** · Manuel Vázquez Losada → **Castrelo do Val** · Minius →
**Oímbra** · Tapias Mariñán → Pazos (**Verín**) · Ladera Sagrada → **Larouco**.

⚠ **Homónimo que parecía duplicado y no lo era:** *Tapias Mariñán* (hermanos
Blanco Núñez; marcas Quinta das Tapias y Pazo Mariñán) y `pazo-das-tapias-verin`
(familia Méndez, grupo Pazo do Mar; marcas Alma de Autor y Atalaya do Mar) son
**dos adegas distintas en el mismo lugar de Pazos, Verín**, con direcciones y
teléfonos propios. La tapia centenaria de la que las dos toman el nombre es la
coincidencia, no la empresa.

⚠ **Grupos multi-DO:** *Bodegas Villanueva* entró como `parcial` porque su web
propia presenta cuatro bodegas y **ninguna del Ribeiro** — el Ribeiro solo
aparece como marcas (Lulo 1915, Carlos Villanueva) en su tienda; la unidad
productiva de Castrelo de Miño la sostiene solo el registro del consejo. *Minius*
sí entró pese a pertenecer al grupo Valmiñor porque el consejo la inscribe con
dirección y marcas propias en Oímbra. *Envínate* tiene fila en Ourense **y** en
Santa Cruz de Tenerife: son dos unidades productivas, no un duplicado.

## Pistas para reabrir

> ⚠ **Valdeorras, ~19 bodegas más.** `dovaldeorras.gal/bodegas/` sigue siendo
> 100% JS tras un age-gate, pero el consejo publica un PDF de una página con el
> **listado de bodegas con producto certificado** (40 adegas, nº de certificado y
> fecha de renovación), actualizado el 17-07-2026:
> `dovaldeorras.gal/wp-content/uploads/2024/10/Listado-de-certificados-17-07-26.pdf`.
> Es la mejor fuente para cruzar altas y para detectar bajas: *Bodegas Carballal*
> y *Bodega Eladio Santalla* no figuran en él bajo ese nombre. Las páginas
> `dovaldeorras.gal/en/<slug>/` sí se sirven en HTML y dan dirección y teléfono.

> El CSV oficial de Ribeira Sacra (`ribeirasacra.org/bodegas_csv.php`) trae
> **nombre, dirección, lat/lon, teléfono, email, web, superficie, producción,
> marcas y variedades** en texto plano — la fuente más completa de esta pasada.
> Su lado de Ourense está **agotado**: 16 fichas, 14 ya en el CSV y las de A
> Teixeira integradas aquí. Queda **una sola alta posible**: *Spanish Wines by
> Carlos Rodríguez, S.L.* (Lg. de Casundila 60, San Xes, 32151 **A Peroxa**), y
> *Os Pacios*, diferida arriba. El resto del registro (~73 adegas) es de Lugo →
> pista para `lugo.md`.
