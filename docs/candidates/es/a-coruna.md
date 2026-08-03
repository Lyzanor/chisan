# Candidatos — A Coruña

> Fichero creado en la pasada **DO menos cubiertas** (`docs/candidates/es/do-huecos.md`).
> Formato estándar de `docs/candidates/README.md`. Cada bloque indica su fuente,
> fecha y estado.

## DOP Queixo Tetilla + DOP Arzúa-Ulloa — queserías coruñesas (lote 20 de do-huecos)

> Estado: **`unverified`**. Dedup contra `a-coruna.csv` el 2026-07-09.
> **Resultado honesto: el hueco es casi inexistente.** De los 10 elaboradores
> coruñeses del registro de Tetilla, **7 ya están en el CSV**; de los 3 restantes,
> 1 es de un gran grupo. Netos: **2**.
>
> **Fuentes.** *Tetilla*: `queixotetilla.org/nuestros-elaboradores/` — registro
> completo y limpio (24 elaboradores de toda Galicia, con dirección, CP+concello,
> teléfono, persona de contacto y email). *Arzúa-Ulloa*: **no hay registro
> público**. El dominio del consejo (`arzua-ulloa.org`) está muerto: devuelve 500
> en todas las rutas PHP y el dominio ha sido **reutilizado por una academia**
> (según Wayback). MAPA, AGACAL/`experienciasdecalidade.gal` y
> `queixosdegalicia.com` solo publican datos del producto y el contacto del
> consejo (Cantón de San Roque 17-1º, Melide · 981 507 653 ·
> queixo@arzua-ulloa.org). Sus **15 queixerías inscritas** se solapan casi por
> completo con las de Tetilla y con las filas ya presentes en el CSV.

### Candidatos (2) — ✅ integrados 2026-07-10 (fase B, lote 0.5 de `integracion.md`)

- [x] **Bo-Queixo** (Isabel García Couto) — **accepted → `bo-queixo-boqueixon`**
  (`parcial`, `no comprobado`). Orto, 2 (Boqueixón); elaboradora de Tetilla y
  Arzúa-Ulloa, ~25.000 kg/año, con visitas guiadas. Sin web ni redes propias →
  ninguna fuente verificadora, tope `parcial`.
- [x] **Lácteos Algra** / marca **Queixos Brigantia** — **accepted →
  `queixos-brigantia-as-somozas`** (`verificado`, `Venta online=sí`,
  `ecommerce`). Tienda propia con carrito y envío refrigerado 24 h.
  ⚠ **Municipio = As Somozas** (la planta del polígono, que confirman el registro
  de Tetilla y el propio concello); la web solo publica el **domicilio social**,
  que está en San Sadurniño. Caso de libro de «sede fiscal ≠ unidad productiva».

### Notas del lote 20

- **Excluido por gran grupo**: **Lácteos Ferrado Verde, S.L.U.** (Santa Comba, A
  Pereira · 981 896 700) — elaborador certificado de Tetilla, Arzúa-Ulloa y San
  Simón, pero pertenece al **Grupo TGT** (Teodoro García Trabadelo, mayor
  productor y distribuidor de quesos de España; su email de contacto en el
  registro es `@grupotgt.es`). Regla dura de grandes grupos industriales.
- ✅ **Hallazgo resuelto en AC-01 (2026-07-12)**: TGT entró en Galicia comprando
  **dos** plantas — Ferrado Verde (Santa Comba) y **Quesería Ruta Xacobea** (O
  Pino). La fila `alimentos-ruta-xacobea-o-pino` se purgó como
  `out-of-scope`, aplicando a ambas plantas el mismo criterio de gran grupo
  industrial.
- **Ya en `a-coruna.csv` (no son altas)**: Queixería Barral (Arzúa), Queizuar /
  Queserías Bama (Touro), Queinaga (Curtis), Quesería Brexeo / O Brexeo de
  Grixalba (Sobrado), Lácteos Terra de Melide (Melide), Queserías del Eume (As
  Pontes), Cooperativa Campo Capela (A Capela).
- **Pista sin explorar, buena cantera para A Coruña**: la **Festa do Queixo de
  Arzúa** (`festadoqueixo.org`) reunió en 2025 **80 queixarías inscritas** (de 125
  solicitudes) — muchas más que las DOP. Es la vía realista para ampliar el
  catálogo quesero coruñés; merecería lote propio fuera de esta pasada.

## Festa do Queixo de Arzúa — queixerías coruñesas (pasada `festa-do-queixo.md`)

> Fuente: listaxe oficial de expositores de la **51ª Festa do Queixo** (Arzúa,
> feb-mar 2026), PDF del Concello en `festadoqueixo.org` (razón social + marca +
> stand). 96 expositores → 27 ya en CSV gallego. Dedup contra `a-coruna.csv` el
> 2026-07-09 (cruzando **razón social y marca**, plegando acentos). Estado:
> **`unverified`**. Ver el ledger de la pasada para las cifras, los excluidos y
> las pistas de fuera de Galicia.

> ✅ Los 5 candidatos de este bloque quedaron **integrados el 2026-07-10** (lote
> 0.5 de `integracion.md`).

- [x] **Queixos Verbas** (Lactear S.A.T.) — **accepted → `queixos-verbas-arzua`**
  (`parcial`, `no comprobado`). Tres socios de Arzúa desde 2018; queso de leche
  cruda sin aditivos, deliberadamente **fuera** de la DO Arzúa-Ulloa. Facebook
  propio; un directorio de terceros menciona reparto a domicilio, no es canal
  propio comprobado. (CP: el PDF decía 15819, Nominatim da 15810 → omitido.)
- [x] **Lácteos Bretón** — **accepted → `lacteos-breton-irixoa`** (`parcial`,
  `no comprobado`). Mántaras (Irixoa). Su web pública es **solo un portal de
  acceso (login)**: confirma identidad, ubicación y contacto, pero no la
  actividad ni el catálogo → tope `parcial`.
- [x] **Lácteos O Casal** — **accepted → `lacteos-o-casal-san-sadurnino`**
  (`verificado`, **`Venta online=no`**). Fabricación propia desde 1982 (requeixo,
  tetilla DOP, kéfir). Comprobado: la web solo tiene «Dónde comprar» con
  distribuidores y grandes superficies, sin tienda ni pedido a distancia.
- [x] **Queixo Fresco Sillobre** — **accepted → `queixo-fresco-sillobre-fene`**
  (`parcial`, `no comprobado`). Confirmado por prensa (COPE, Diario de Ferrol):
  Alejandra Romero y Eloy Seijas, 8 vacas Jersey, comercializa desde 2024. Sin
  web ni redes propias → tope `parcial`.
- [x] **Granxa Lourán** / marca **Restrebas** — **accepted →
  `granxa-louran-monfero`** (`parcial`, `no comprobado`). Requeixo de vacas en
  pastoreo del Val de Xestoso desde 2016; Instagram propio. `seitura.gal` es la
  tienda de la **Asociación Seitura 22** (colectivo de terceros), no canal propio
  → `no comprobado`. ⚠ Iberinform marca «GRANXA LOURAN SL» como **inactiva**
  mientras la actividad sigue viva (expositora de la feria 2026, producto a la
  venta): probable cambio de forma jurídica, **reconfirmar en 2ª pasada**.

> **Sin rastro digital (zona C de la feria, queixeiros pequeños)** — anotados con
> lo único que da el PDF; confirmar existencia, concello y venta antes de
> integrar, o descartar: *José Manuel Vázquez Vázquez* (C1) · *Queixos Celsa*
> (Guadalupe Doamo Casanova, C2) · *José M. Costoya* (José Manuel Costoya
> Salgado, C3). Ninguno aparece en buscadores; probablemente artesanos de la
> comarca de Arzúa-Melide sin presencia web.

### Pistas para otras provincias (Tetilla ampara toda Galicia)

> Del registro de Tetilla, elaboradores de fuera de A Coruña. Re-deduplicado el
> 2026-08-03: **de las tres pistas originales solo queda viva la de Lugo**.

- **Lugo** — *Queixos de Galicia, S.L.* (Palas de Rei · 607 505 046). ⚠ email de
  contacto `@garciabaquero.com` → probable **Grupo García Baquero**; confirmar
  antes de nada. (El resto de elaboradores lucenses ya están en `lugo.csv`:
  Crisanto, Daniberto, Leitigal, Prestes, Prado, Sarrianas.)
- ~~Pontevedra — *Cobideza, S.C.G.* (Agolada)~~ → ya en CSV como
  `dona-cobina-agolada` (Dona Cobiña es su marca).
- ~~Ourense — *Quesos de la Montaña de Entrimo*~~ → ya en CSV como
  `quesos-la-montana-de-entrimo`.
