# Candidatos

Scratch compartido de investigación: pistas sin contrastar de camino al CSV.
Nada de aquí es fuente de verdad y nada de aquí lo lee la app; un productor solo
existe cuando está en `data/csv/**`.

Un fichero por área, `docs/candidates/[país]/[área].md`, y `[área]-[tema].md`
solo si una pasada monográfica haría ilegible el principal. No abras carpetas
privadas de agente ni listas paralelas de un área. Si encuentras notas sueltas
bajo `docs/`, muévelas aquí, salvo que `git status --short` muestre a otro agente
trabajándolas: entonces déjalas y dilo en el traspaso.

Lo que no es descubrimiento ya vive en otro sitio: los criterios de decisión en
`docs/EDITORIAL_POLICY.md`, cómo investigar una fila en
`docs/es/VERIFICATION_TECHNIQUES.md`, el contrato de la fila en
`docs/CSV_CONTRACT.md` y la procedencia estructurada en `data/evidence/**`.

## 1. Descubrir

Las fuentes autorizadas de cada país están en su guía (`data/csv/[país]/AGENTS.md`).
Orden de rendimiento, medido en la pasada de DO/DOP de 2026-07 (26 lotes):

1. **El organismo de control, no el consejo regulador.** Cuando la certificación
   está delegada (INTIA en Navarra, entidades tipo ENAC), ese organismo publica
   el listado íntegro de operadores; el consejo solo enseña a sus asociados o a
   quien paga ficha de enoturismo (Navarra: 27 de 85; Cariñena: 17 de 33). Buscar
   «listado operadores certificados \<DO\> pdf».
2. **El endpoint de datos detrás del JS.** Si el listado se pinta con JavaScript,
   mira antes de rendirte: endpoints CSV (`bodegas_csv.php`, Ribeira Sacra), JSON
   embebido (`wp-json/wp/v2/pages/<id>`, Queso Manchego), custom post types
   (`wp/v2/bodegas`, Navarra) o una ruta hermana server-rendered
   (`/autenticos-productores/`, Calanda).
3. **El portal institucional** (cabildo, diputación, consejería): tablas limpias
   Nombre·Marca·Dirección·Web.
4. **La cooperativa de 2º grado o comercializadora comarcal** cuando el consejo
   no publica nada, con cautela: si ella comercializa todo, sus socias suelen ser
   maquila y no son vendibles por separado.
5. **Wayback Machine** para PDFs movidos y webs caídas.

**Mide el hueco contra el registro de operadores, nunca contra el CSV.** Contar
«filas de la categoría en la zona» infló huecos inexistentes (Arzúa-Ulloa) y
ocultó reales (Utiel-Requena, 34 netas).

**Trampas.** Los dominios oficiales caducan y se reutilizan (`arzua-ulloa.org` →
academia; `docarinena.com` → sitio vietnamita, aunque el email del consejo siga
siendo @docarinena.com): confirma que el contenido es del organismo. Un 403
persistente suele ser Cloudflare, no una web muerta.

**Dónde está el oro y cuándo parar.** Rinde el registro con web y tienda propias
(aceite, jamón y queso DOP: los secaderos de Jabugo salieron 10/10 `verificado`
con venta online). Cuando ese pool se agota en un área, lo que queda son colas de
registro sin web (`parcial` fino) y descartes por grupo o maquila: eso se
verifica 1-a-1, no se padea en bloque, y es la señal de cerrar la pasada.

## 2. Qué anotar

En la cabecera del fichero —esto es el «formato estándar» que citan los ficheros
de área— van CSV destino, fuente con URL o ruta de búsqueda, fecha, estado de la
pasada y qué queda. El estado vive **solo** ahí: no hay tabla central en este
README porque caduca en cada sesión. La vista de conjunto es `ls
docs/candidates/*/` más esas cabeceras; si un área no tiene fichero, su pasada
está cerrada.

Por candidato, lo justo para que otro agente siga sin reempezar:

| campo | |
|---|---|
| nombre | tal como lo publica la fuente; anota también la razón social si difiere de la marca |
| municipio | márcalo `⚠` si la fuente no lo trae, para que se vea que falta |
| pista | categoría, web, y qué lo hace elegible |
| estado | `unverified` · `accepted` · `rejected` (con motivo) · `already-present` |
| slug | al aceptarlo, o al descubrir que ya estaba |

Aquí **no** van la procedencia estructurada de lo ya aceptado (`data/evidence/**`),
los ledgers de verificación (`docs/verification/`) ni recuentos derivados del CSV.

## 3. Pasarlo al CSV

1. **Dedup primero**, con `npx pnpm list:area [área]` y `rg` dirigido. Tres
   guardas que mordieron: pliega acentos **antes** de quitar palabras genéricas
   («QUEIXERÍA» no casa con «queixeria» si filtras primero); exige la categoría
   correcta al casar por nombre, o una bodega casará con una charcutería; y cruza
   marca **y** razón social, porque el consejo publica una y el registro la otra
   (Finca Albret = Príncipe de Viana; Mesur = Frontos).
2. **Verifica en vivo.** El registro solo sostiene `parcial`; `verificado` exige
   una fuente leída en el momento que confirme identidad, actividad y municipio.
   `Venta online` se audita aparte: criterios en `docs/EDITORIAL_POLICY.md`.
3. **El área es donde produce según su propia web, no según el registro**, que
   suele dar la sede fiscal y a veces sitúa mal: el registro de la DOP Bajo
   Aragón puso a Oliflix en Mequinenza (Zaragoza) y su web dice Flix (Tarragona);
   Ontañón está inscrita en Navarra y es riojana. Si chocan, manda la web.
4. **Triaje de grupo y maquila.** Entra la bodega o almazara de terroir con
   nombre, municipio y marca propios aunque pertenezca a un grupo de calidad
   (Valcarlos/Faustino). No entra el industrial de masa, ni la marca cuyo dominio
   redirige al sitio del grupo (Doña Isabella → Marqués del Atrio), ni la
   cooperativa de 1er grado que muele para el socio pero cuya marca y tienda son
   las de la de 2º grado: en ese caso se queda la de 2º grado.
5. **Escribe la fila completa** —`slug` estable, `categoria` normalizada,
   coordenadas, `verificacion`, `Venta online`— y su registro en
   `data/evidence/**`. Gates: `npx pnpm check:csv:changed` mientras iteras,
   `npx pnpm verify:data` antes de cerrar.

**Por lotes, no en bloque.** Unos 10-12 candidatos por lote y un lote por commit:
cada ficha cuesta varias comprobaciones y en torno a ⅔ traen algún dato erróneo o
una decisión no anticipada. Empieza por los que tienen web propia, que se
verifican rápido y salen `verificado`; deja para el final los que arrastran ⚠ sin
resolver, y agrupa en el último lote a los que no tienen rastro digital en vez de
repartirlos. Alta mínima: identidad y municipio productivo confirmados más un
enlace verificable; solo-registro sin más rastro no se da de alta, se queda
anotado.

## 4. Limpiar

En **el mismo cambio** que toca el CSV, resuelve la anotación: aceptada, ya
presente, o rechazada con motivo. Un candidato aceptado no se queda «por si
acaso»; su sitio es la fila y su evidencia.

Cuando un fichero queda resuelto entero, **bórralo**. Lo que aportaba ya está en
el CSV y en `data/evidence/**`, y el historial de git guarda el resto; no dejes
un resumen de lo integrado, que es estado derivado y caduca solo. Si la pasada
dejó un aprendizaje que cambia el método, súbelo a este README. Un fichero de
candidatos vivo significa que queda cola.
