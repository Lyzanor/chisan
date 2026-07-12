# Candidatos — Zaragoza

> Fichero creado en la pasada **DO menos cubiertas** (`docs/candidates/do-huecos.md`).
> Formato estándar de `docs/candidates/README.md`. Cada bloque indica su fuente,
> fecha y estado. **Aviso de coordinación**: el lote 24 (DO Cariñena + Campo de
> Borja + Calatayud) también escribe aquí — añadir sección nueva sin tocar las
> anteriores.

## Aceite del Bajo Aragón + Melocotón de Calanda (lote 15 de do-huecos)

> Origen: **cola del lote 13** (los operadores turolenses se escribieron en
> `teruel.md`; estos son los de **provincia de Zaragoza**). Fuentes: registro de
> productores del Consejo DOP Aceite del Bajo Aragón
> (`aceitedelbajoaragon.es/productores/`, 11 empresas zaragozanas) y «Auténticos
> Productores» del Consejo DOP Melocotón de Calanda
> (`melocotondecalanda.com/autenticos-productores/`, 6 empresas zaragozanas en
> Nonaspe/Maella/Caspe/Chiprana). Dedup contra `zaragoza.csv` el 2026-07-09 (por
> dominio, teléfono y nombre sin acentos/sufijos): **7 ya presentes** (Almazara
> de Jaime, Molino Alfonso, Coop. San Isidro de Fabara, Alcañiz Millán/Molí de
> Casto, Coop. San Lorenzo de Maella, Almazara Gil Egerique, y **Alejandro y
> Miguel** = `alejandro-y-miguel-s-c-nonaspe`). Netos: **8**. Estado:
> **`unverified`**. La comarca (Caspe/Maella/Belchite/Mequinenza) ya está bastante
> cubierta en el CSV → hueco real pequeño.

- [x] **Granja Brunet** ‹→ granja-brunet-fabara (verificado, VO no comprobado; web propia sin carrito, reventa en terceros)› (Granja Brunet, S.L.U.) — Aceite (+ melocotón/fruta).
  Fabara. Tel 650 434 744 · <http://www.granjabrunet.com> ·
  info@granjabrunet.com. AOVE del Bajo Aragón con tienda online → pista
  `Venta online=sí`.
- [x] **Oliflix** ‹RECHAZADO: su web (oliflix.net) sitúa la empresa en Flix, Tarragona (C/ Costa del Graner, 43750, tel 977), no Mequinenza. El registro DOP la listó mal en Zaragoza → va a tarragona.md› — Aceite. Mequinenza. Tel 974 464 722 ·
  <http://www.oliflix.com> · info@oliflix.com. AOVE de Mequinenza, marca propia.
- [x] **La Chipranesca** ‹→ la-chipranesca-chiprana (verificado, VO no; coop melocotón Calanda, sin tienda online)› (La Chipranesca, S.C.L.) — Aceite (+ fruta). Chiprana.
  Tel 976 637 240 · <http://www.lachipranesca.com>. Cooperativa con marca propia
  (AOVE + melocotón).
- [x] **Frutícola Maellana** ‹→ fruticola-maellana-fruma-maella (parcial; identidad/municipio confirmados por 2 registros DOP + directorio, pero fruma.es no cargó en vivo)› (marca **Fruma**) — Fruta y verdura (melocotón de
  Calanda; también aceite). Maella. Tel 976 638 165 · <http://www.fruma.es> ·
  cooperativa@fruma.es. Aparece en ambos registros (aceite y melocotón).
- [x] **Frutícola Bajoaragonesa** ‹DIFERIDO: S.C. de 2º grado = central hortofrutícola B2B, sin marca de consumo; revisar en 2ª pasada› (Frutícola Bajoaragonesa S.C. 2ºG) — Fruta y
  verdura (melocotón de Calanda). Caspe. Tel 976 633 315 ·
  <http://www.fruticola-bajoaragonesa.com>. ⚠ confirmar marca de consumo vs
  central hortofrutícola B2B.
- [x] **Cooperativa Frutícola Compromiso de Caspe** ‹→ cooperativa-fruticola-compromiso-de-caspe (parcial; solo-registro DOP, sin web)› — Aceite (+ melocotón).
  Caspe. Tel 976 632 159 · frucas1@telefonica.net. ⚠ confirmar marca propia
  (posible granel/servicio).
- [x] **Frumaspi Agrícola** ‹DIFERIDO: sin web ni rastro de marca de consumo; probable B2B, revisar en 2ª pasada› (Frumaspi Agrícola, S.L.) — Fruta y verdura
  (melocotón de Calanda). Maella. Tel 876 708 028. Sin web localizada. ⚠
  confirmar marca de consumo.
- [x] **Cooperativa Agraria San Sebastián** ‹→ cooperativa-agraria-san-sebastian-fayon (parcial; solo-registro DOP, sin web)› — Aceite. Fayón. Tel 976 635 674 ·
  cooperativasansebastian@hotmail.es. ⚠ cooperativa pequeña, confirmar marca vs
  granel antes de integrar.

### Notas del lote 15

- **Solapes registro aceite ↔ melocotón**: *Coop. San Lorenzo de Maella*
  (magalia.org) y *Frutícola Maellana* (fruma.es) figuran en los dos consejos
  (hacen AOVE y melocotón). La primera ya está en CSV como
  `cooperativa-agricola-san-lorenzo-maella`; para Fruma, valorar una sola ficha
  con doble categoría al integrar.
- **Ya en CSV (no altas)**: Almazara de Jaime (Belchite), Almazara Molino
  Alfonso (Belchite), Coop. del Campo San Isidro (Fabara), Aceites Alcañiz
  Millán/Molí de Casto (Maella), Coop. Agrícola San Lorenzo (Maella), Almazara
  Gil Egerique/Torre Maella (Maella), Alejandro y Miguel S.C. (Nonaspe).
- **Método**: `aceitedelbajoaragon.es/productores/` responde sin `www`; el listado
  de Calanda se carga por JS (`{title}`), pero la página
  `/autenticos-productores/` sí trae el HTML con CP·municipio·provincia y web.

## DO Cariñena + Campo de Borja + Calatayud (lote 24 de do-huecos)

> Fuentes (⚠ **el dominio de la worklist para Cariñena está muerto**, ver Método):
> **Cariñena** `carinenawines.com/bodegas/` (17 fichas con dirección, tel y web;
> el consejo declara 33 bodegas inscritas) · **Campo de Borja**
> `docampodeborja.com/las-bodegas/` (17, con dirección y web) · **Calatayud**
> `calatayudwine.com/bodegas/` (12 fichas). Total registro leído: **46**.
>
> Dedup contra `zaragoza.csv` el 2026-07-09 (dominio + nombre sin acentos, con
> guarda de `categoria == "Bodega"`): **29 ya en CSV** → **17 netas**. Zaragoza
> estaba **muy bien cubierta** (40 bodegas en el CSV, casi todas de estas tres DO).
> Estado: **`unverified`**.

### DO Cariñena (9)

- [x] **Bodega Francisco Sanz Soguero** (marca **Vignius**) ‹→ bodega-vignius-ignius-almonacid (parcial; marca real IGnius, web vignius.com con error SSL)› — Bodega. Almonacid de
  la Sierra (Barranco, 60). · 696 453 134 · <https://vignius.com>.
- [x] **Bodega Familia Navascués** ‹→ bodega-familia-navascues-almonacid (verificado)› — Bodega. Almonacid de la Sierra. ·
  651 845 176 · <https://bodegafamilianavascues.com>.
- [x] **Bodega Manuel Moneva** ‹→ bodegas-manuel-moneva-almonacid (verificado)› — Bodega. Almonacid de la Sierra. · 976 627 020 ·
  <https://bodegasmanuelmoneva.com>.
- [x] **Bodegas y Viñedos Pablo** (marca **Gran Viu**) ‹→ vinedos-y-bodegas-pablo-gran-viu-almonacid (verificado)› — Bodega. Almonacid de la
  Sierra. · 976 627 037 · <https://granviu.com>.
- [x] **Bodega Roberto Zazurca** ‹→ bodega-roberto-zazurca-almonacid (parcial; solo listado del consejo, sin web)› — Bodega. Almonacid de la Sierra. · 605 398 368.
  Sin web localizada.
- [x] **Bodegas Luis Marín** ‹→ bodegas-luis-marin-carinena (verificado; mayor privada de la DO)› — Bodega. Cariñena. · 976 621 129 · <https://luismarin.eu>.
- [x] **Bodega Heredad Ansón** ‹→ bodega-heredad-anson-muel (parcial; CORRECCIÓN municipio: está en MUEL, no Cariñena; web con fallo SSL)› — Bodega. Cariñena. · 606 858 296 ·
  <http://www.bodegasheredadanson.com>.
- [x] **Bodega Romeo Yrisarri** ‹→ bodega-romeo-yrisarri-carinena (parcial; C/ La Cruz 8, sin web)› — Bodega. Cariñena. · 976 620 012. Web a confirmar.
- [x] **Bodegas Grandes Vinos** ‹RECHAZADO: es la empresa que elabora la marca Gran Ducay, ya en CSV como bodegas-gran-ducay-carinena → alias, no alta› — Bodega. Cariñena. · 976 621 261 ·
  <https://www.grandesvinos.com/>. ⚠ **posible alias**: el CSV ya tiene
  `bodegas-gran-ducay-carinena` (`granducay.com`), y *Gran Ducay* es una marca de
  Grandes Vinos y Viñedos → verificar antes de crear fila.

### DO Campo de Borja (5)

- [ ] **Bodega Picos** (Bodega Picos, S.L.) — Bodega. Magallón. · 976 863 006 ·
  <http://www.bodegapicos.com>.
- [ ] **Cooper Cellars** (marca **Vinos del Viento**) — Bodega. Pozuelo de Aragón.
  <http://vinosdelviento.com/>.
- [ ] **Soc. Coop. Agrícola de Borja** — Bodega. Borja. · 976 866 065. Sin web.
  ⚠ cooperativa; confirmar marca de consumo propia.
- [ ] **Santa Ana Crianzas y Viñedos, S. Coop.** — Bodega. Pozuelo de Aragón.
  · 976 862 931. Sin web. ⚠ confirmar marca.
- [ ] **Coop. Ntra. Sra. Niño Perdido** — Bodega. Tabuenca. · 976 865 874. Sin web.
  ⚠ confirmar marca vs granel.

### DO Calatayud (3)

- [ ] **Bodegas Agustín Cubero** — Bodega. Calatayud. · 976 882 332 ·
  <https://www.bodegascubero.com>.
- [ ] **Bodegas La Cerrada** (marca **Vinos Atrevidos**) — Bodega. Calatayud.
  · 630 822 247 · <https://www.vinosatrevidos.com>.
- [ ] **Bodegas Esteban Castejón** — Bodega. Ibdes. · 976 848 031 ·
  <https://www.bodegasesteban.es>.

### Notas del lote 24

- **Ya en `zaragoza.csv` (29)**: las tres DO estaban bien representadas —
  Borsao, Aragonesas, Alto Moncayo, Ruberte, Román, Pagos del Moncayo, Ainzón,
  Cabal, Palmeri Sicilia, Morca, Coop. Fuendejalón (Borja) · San Valero, Paniza,
  Care, Grandes Vinos/Gran Ducay, Ignacio Marín, Solar de Urbezo, Covinca,
  Esteban Martín, Hacienda Molleda, Bodem, Libre y Salvaje, Dominio de Longaz
  (Cariñena) · Langa, San Alejandro, San Gregorio, Virgen de la Sierra, Ateca,
  Augusta Bílbilis, Raíces Ibéricas, Colás Viticultores (Calatayud).
- ⚠ **Cariñena publica solo 17 de sus 33 bodegas inscritas** → queda un corte 2
  con las ~16 que no tienen ficha en la web del consejo. Vía probable: el
  organismo de certificación (mismo patrón que INTIA en Navarra).
- ⚠ **Bodegas Ateca** (Calatayud) y **Bodegas Morca** (Borja) son del **Gil
  Family Estates** (`gilfamily.es`) — ambas ya en CSV; aplicar el mismo criterio
  de tamaño si se revisan.

### Método (dominio muerto)

- ⚠ **`docarinena.com` ya no es la DO**: el dominio está **reutilizado por un
  sitio en vietnamita** (rutas `/ban-quyen`, `/tuyen-dung`). Es el segundo caso de
  esta pasada tras `arzua-ulloa.org`. El consejo usa hoy **`elvinodelaspiedras.es`**
  (marca «El vino que nace de las piedras») y publica las fichas en
  **`carinenawines.com/bodegas/`**. Ojo: `secretaria@docarinena.com` sigue siendo
  su email de contacto, lo que hace fácil dar por buena la web.
- **Campo de Borja** imprime dirección completa y web en `/las-bodegas/` (HTML).
- **Calatayud**: cada ficha `/bodegas/<slug>/` da `Dirección / calle / CP Municipio
  (Zaragoza) / Tel. / web`. Pero los enlaces del listado apuntan todos a la campaña
  `comparteelsecreto.com`, no a la bodega → hay que leer la web del texto, no el
  `href`.
