# Candidatos de productores — Comunidad de Madrid — RESUELTO

Estado: **procesado el 2026-05-30** (rama `verify/galicia-venta-online`).

De los 50 candidatos del informe original:
- **16 ya estaban en `data/csv/madrid/madrid.csv`** (duplicados, no reintegrados).
- **34 nuevos verificados por web e integrados** (239 → 273 filas).
- **19 con logo** aplicado vía `enrich:images` (workflow oficial); 15 sin imagen por web caída/sin web o logo no fiable.

Verificación: `verify:ai` OK (contrato 50/50, imágenes 0 errores, tests OK).

---

## Correcciones de datos detectadas al verificar
- **Bodegas Muss**: el dominio `bodegasmuss.com` **no existe** (dato erróneo); sustituido por `+34918763715` / `bodegasmuss@gmail.com`. No tiene web propia (sí Facebook `MussBodegas`).
- **Huerta Clarita**: `huertaclarita.eu` **está aparcado en Sedo** (redirige a venta de dominio); `web` eliminado, queda Facebook.
- **24 Onzas**: el informe daba la dirección de *Cientotreinta Grados* (Fernando el Católico 17); la tienda real está en **Zurbano 54 (Chamberí)**.

---

## 1. Ya en el CSV (16 — duplicados, NO reintegrados)

| Candidato | Fila existente |
| :--- | :--- |
| Bodega Siguín | `bodega-siguin` |
| Bodegas Mario Sampedro | `bodegas-mario-sampedro` |
| Quesería Jaramera | `queseria-jaramera-torremocha-de-jarama` |
| Quesería Vega de San Martín | `vega-de-san-martin-san-martin-de-la-vega` |
| Quesos Campo Real | `quesos-campo-real-campo-real` |
| Miel Antonio Simón | `miel-antonio-simon` |
| Apiarte / La Abeja Meli | `la-abeja-meli` |
| Cervezas Bailandera | `bailandera-bustarviejo` |
| Cervezas Península | `cervecera-peninsula-alcobendas` |
| Oso Brew Co. | `oso-brew-alcobendas` |
| Acid Bakehouse | `acid-bakehouse-madrid-centro` |
| Obrador San Francisco | `obrador-san-francisco-madrid-centro` |
| Pan.Delirio | `pan-delirio` |
| El Huertecito | `el-huertecito` |
| Aceitunas González (El Chato) | `aceitunas-gonzalez-s-l-campo-real` |
| Patatas Fritas Marisa | `patatas-fritas-marisa-s-a` |

---

## 2. Nuevos integrados (34)

`logo` = imagen aplicada · `—` = sin imagen (motivo entre paréntesis)

### Con logo (19)
| Productor | Slug | Categoría |
| :--- | :--- | :--- |
| Bodega Cooperativa San Esteban | `bodega-cooperativa-san-esteban-cenicientos` | Bodega |
| Bodega Qubél (Gosálbez-Orti) | `bodega-qubel-gosalbez-orti-pozuelo-del-rey` | Bodega |
| Nutrivida | `nutrivida-meco` | Miel |
| 24 Onzas | `24-onzas-madrid` | Chocolate y dulces |
| Moulin Chocolat | `moulin-chocolat-madrid` | Chocolate y dulces |
| Turrones Casa Mira | `turrones-casa-mira-madrid` | Chocolate y dulces |
| Cervezas Yria | `cervezas-yria-valdemoro` | Cerveza artesana |
| Cientotreinta Grados | `cientotreinta-grados-madrid` | Pan y pastelería |
| Levadura Salvaje | `levadura-salvaje-alcala-de-henares` | Pan y pastelería |
| Huerta La Floresta | `huerta-la-floresta-quijorna` | Fruta y verdura |
| HuertAravaca | `huertaravaca-madrid` | Fruta y verdura |
| Conservas Artesanales Sanz | `conservas-artesanales-sanz-arganda` | Conservas |
| Cobardes y Gallinas | `cobardes-y-gallinas-las-rozas` | Huevos |
| Caracol de Cadalso | `caracol-de-cadalso` | Caracoles |
| Vega Naturalis | `vega-naturalis-tielmes` | Caracoles |
| La Melguiza | `la-melguiza-madrid` | Especias |
| La Garbancera Madrileña | `la-garbancera-madrilena-quijorna` | Legumbres |
| Santamanía Destilería | `santamania-destileria-las-rozas` | Licores y vermut |
| Pista Corta Bodegas | `pista-corta-bodegas-becerril` | Licores y vermut |

### Sin logo (15)
Motivos: web inaccesible desde el entorno (DNS/SSL/anti-bot), sin web propia, o ningún logo fiable.

| Productor | Slug | Motivo sin imagen |
| :--- | :--- | :--- |
| Bodegas Muss | `bodegas-muss-morata-de-tajuna` | sin web propia |
| Bodegas Don Álvaro de Luna | `bodegas-don-alvaro-de-luna-san-martin-de-valdeiglesias` | SSL no válido |
| Bodegas Orusco | `bodegas-orusco-valdilecha` | DNS no resuelve |
| Bodegas Ricardo Benito | `bodegas-ricardo-benito-navalcarnero` | SSL no válido |
| Comando G Viticultores | `comando-g-viticultores-cadalso-de-los-vidrios` | sin logo en la web |
| Aceitera de Tielmes | `aceitera-de-tielmes` | sin web propia (web = DOP) |
| Chocolates Eureka | `chocolates-eureka-madrid` | web caída (HTTP 520) |
| Cervezas Lest | `cervezas-lest-colmenar-viejo` | DNS no resuelve |
| Cerveza Majariega | `cerveza-majariega-las-rozas` | sin web propia |
| Mad Brewing | `mad-brewing-madrid` | DNS no resuelve |
| Amasa | `amasa-las-rozas` | anti-bot (HTTP 202) |
| Ecosecha | `ecosecha-rivas-vaciamadrid` | anti-bot (HTTP 202) |
| Huerta Clarita | `huerta-clarita-villa-del-prado` | dominio aparcado |
| La Huerta de Leo | `la-huerta-de-leo-velilla-de-san-antonio` | web con contenido spam |
| Productos de Campo Real | `productos-de-campo-real-bear` | solo logo en blanco (invisible) |

---

## Pendiente (opcional)
Las 15 filas sin logo se pueden completar más adelante: reintentar `enrich:images` cuando las webs respondan, o aportar el logo a mano. Varias tienen Instagram/Facebook como fuente alternativa.
