# Granada · verificación — snapshot de mantenimiento

Primera pasada profunda **cerrada de extremo a extremo el 2026-07-03** (lotes 1-17). Detalle por
lote en `git log --follow -p -- docs/verificacion/es/granada.md`; procedencia por fila en
`data/evidence/andalucia/granada.jsonl`. La verdad es el CSV; cerrar la pasada no cierra el
catálogo y las afirmaciones dinámicas caducan.

## Estado final de la pasada (2026-07-03)

- Filas: **266** (278 iniciales; **10 purgas + 2 fusiones**) · verificado **250** · parcial **16** ·
  pendiente **0**. La provincia partía con 0 `verificado` y olor a volcado de registro mercantil.
- `Venta online`: **154 `sí` (154/154 con canal) · 0 `no` · 112 `no comprobado`** (productores
  reales sin tienda propia: presencial, B2B, coops exportadoras, reventa de terceros).
- Evidencia: 278 registros cubriendo 266/266 filas; **`andalucia/granada` en `coverage.json`**.
- Imágenes: 81/266 sin `imagen`.
- El grueso del trabajo fue limpiar el ruido de categorías del volcado; se crearon en la provincia:
  Pescado, Carnes, Helados, Huevos, Aceitunas y encurtidos, Mermeladas, Especias, Bebidas, Licores,
  Hidromiel, Mostos y zumos.

## Residuales justificados (16 `parcial`)

- **Candidatos a purga en 2ª pasada** (revisar 1º): Grupo Collados (hotel-restaurante), Mariscos
  Apolo (distribuidor con cocedero), Mariscal Delicatessen (tienda gourmet), B.olivar, Campo de
  Aviación, El Zalandro, **Dekum** (sin rastro digital), COVECOL, Bioartesa (mayorista eco),
  Swiss Agro (filial suiza B2B), Adania Fruit (e-commerce sin finca confirmada).
- Fuente propia débil: Salvoreta, Calanté, Molino de Carrilla, Bodegas Caballo, Los Barrancos.

## Reglas locales (no revertir sin nueva evidencia)

- **Padding de registro mercantil**: filas con razón social en MAYÚSCULAS + S.L./S.A.T. pueden ser
  industriales/B2B volcados, no productores Km0 — triaje duro (refinador/envasador/distribuidor
  → purga; artesano con forma S.L. se queda).
- **El sufijo-pueblo del `slug` NO es fiable como municipio** (`iffco-iberia-alhama` estaba en
  Escúzar): fiarse de `municipio`+coords.
- Purgas firmes (industriales/no productores): **IFFCO Iberia**, **Puleva** (Lactalis),
  **Grupo Abades** (hostelería), **Jamones Nicolás** (en liquidación, dominio secuestrado),
  **FIRMVM** (restaurante), **Alquería de los Lentos** (hotel rural), **Agrologística Alborán**
  (liquidación), **OPP pesquera de Motril**, **Llano Fresh Trade** (trader sin fincas),
  **Tu Jamón al Corte** (cortador de eventos), **Mateo…**. Fusiones: **OMED Venchipa → O-Med**
  (misma Venchipa S.L.) y **Salsas y Especias Sierra Nevada → Doctor Salsas**.
- NO fusionar: **Neparola S.L. / Neva Ajos S.L.** (dos S.L. hermanas de ajo/espárrago de
  Valderrubio con oficina y teléfono comunes). Webs `instagram.com` compartidas eran cuentas
  distintas (falso positivo de dedup).
- Municipios corregidos con la ficha del propio operador (no restaurar los heredados): Santa Ana
  Loja→Salar · Ginevia→Alhama de Granada · Liber Lecrin→Padul · Señorío de Nevada→Villamena ·
  Tropicual «Costa»→Almuñécar · «Costa»→Los Guájares · «Vega»→Valderrubio · Loja→Huétor Tájar ·
  Zurita Juncaril→Albolote · Donaire→Escúzar · Magda→Padul · Aserradero Salar→Alhama ·
  Jabalcón→Benamaurel.
- Dominios basura eliminados (no restaurar): Los Fresnos (casino), Jamones Nicolás (porno/spam),
  `http://.` y muertos varios; webs corregidas al apex/oficial (Echinac, Granada Beer, Sulayr…).
- ⚠ **Revisión pendiente por cambio de política**: 5 obradores de la IGP Pan de Alfacar sin web
  fueron promovidos a `verificado` solo por el registro IGP (criterio de entonces). La política
  actual (2026-07-18) exige fuente verificadora leída en vivo — reevaluar a `parcial` o confirmar
  con fuente propia en la 2ª pasada.

## Fuentes locales y límites

- Consejos/sellos: DOP Montes de Granada (aceite), IGP Jamón de Trevélez, IGP Cordero Segureño,
  DOP Chirimoya de la Costa Tropical, IGP Espárrago de Huétor Tájar, IGP Pan de Alfacar.
  Apoyan pertenencia, no actividad ni venta.
- Territorio: 122 municipios en 6-7 comarcas (Vega, Poniente, Guadix/Marquesado, Altiplano,
  Alpujarra/Lecrín, Costa); lotear por sector **y** zona.

## Mantenimiento (al retomar)

- 2ª pasada: los 11 `parcial` candidatos a purga (empezar por Dekum, Grupo Collados, Mariscos
  Apolo) + los 5 obradores de Alfacar (política nueva).
- Recomprobar los 154 `Venta online=sí` (última comprobación 2026-07-03); los 112 `no comprobado`
  son revisables si abren canal propio.
- Imágenes pendientes: 81 filas (scorer de `enrich:images` solo por slug).

## Ola 3 · venta sin resolver (2026-07-29)

- Revisadas las **112** filas que seguían en `no comprobado`: **8** pasan a `sí` con canal
  demostrado y quedan **104**. Estado actual: **162 `sí` · 0 `no` · 104 `no comprobado`**.
- Se confirmaron ecommerce propios en Bioartesa, Mariscal Delicatessen, Al-Andaluzza, Flor de
  Vainilla y Selva GR; pedidos asistidos en Los Teatinos y Queso Montefrieño; y marketplace de
  la cooperativa de la que forma parte La Vieja Buchaca.
- La revisión no se limitó a la etiqueta de venta: Bioartesa pasa de `Aperitivos` a `Harinas y
  cereales`; se concretan gamas, descripciones, teléfonos, correos y protocolos web en las ocho
  filas. Bioartesa y Mariscal pasan de `parcial` a `verificado`.
- Estado editorial actual: **266 filas · 252 `verificado` · 14 `parcial` · 0 `pendiente`**.
- No se promovieron señales débiles: plugins WooCommerce sin productos, catálogos sin pedido y
  reventa de terceros permanecen en `no comprobado`.
