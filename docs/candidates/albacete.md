# Candidatos — Albacete

> Fichero abierto el 2026-07-10 al ejecutar el **lote 0.4** de
> `integracion.md`, a partir de la pista dejada en `cuenca.md`
> («Pistas para las otras tres provincias manchegas»). Formato estándar de
> `docs/candidates/README.md`.

## DOP Queso Manchego — fabricantes de Albacete ✅ PASADA CERRADA (2026-07-10)

> Fuente: registro de fabricantes del Consejo Regulador, leído del **JSON crudo**
> (`wp-json/wp/v2/pages/10148`, array `places`, 65 fabricantes: Ciudad Real 21 ·
> Toledo 19 · **Albacete 13** · Cuenca 12). Cada entrada trae razón social,
> dirección, municipio, CP, teléfono, email, web, coordenadas y **`categories`**
> (`Leche cruda` · `Leche pasteurizada` · `Cámaras de maduración`).
>
> Dedup contra `albacete.csv` el 2026-07-10. Resultado: **1 alta neta**, 4
> descartes por regla dura, 8 ya presentes.

### Alta (1) — integrada

- [x] **Quesos Campayo, S.L.** — **accepted → `quesos-campayo-villarrobledo`**
  (`verificado`, `Venta online=sí`, `ecommerce`). Ctra. Villarrobledo-Minaya
  km 9,2. Fabricante inscrito desde 1985, finca Cuarto Perea, tienda propia con
  precios y carrito.

### Descartes (4) — no crear fila

- **Aldonza Gourmet, S.A.U.** (Albacete) — **rejected: not-producer**. Inscrita
  solo en la categoría **`Cámaras de maduración`**, no como elaboradora. Su
  tienda (`tienda.aldonzagourmet.com`) vende queso de la marca **Navamarín** y se
  presenta como tienda gourmet de producto de terceros. ⚠ No confundir con
  **Quesos Aldonza y Don Ismael, S.L.**, que sí es fabricante (`Leche
  pasteurizada`) pero está en **Piedrabuena (Ciudad Real)** → pertenece a
  `ciudad-real.md`, no aquí.
- **Spanish Cheese, S.L.** (Albacete) — **rejected: not-producer**. También solo
  `Cámaras de maduración`.
- **Lactalis Villarrobledo, S.L.** — **rejected: out-of-scope** (gran grupo).
- **Mantequerías Arias, S.A.** (Albacete) — **rejected: out-of-scope** (gran grupo).

### Ya en `albacete.csv` (8, no son altas)

Lácteos del Bonillo (El Bonillo) · Dehesa de los Llanos (Albacete) · Pago de la
Jaraba (Villarrobledo) · Julián Olivas (Santa Ana) · Blincos (La Roda) · Quesos
Vega Sotuélamos (Chinchilla de Monte-Aragón) · Quesera Manchega Don Eusebio
(Ossa de Montiel) · Agroalimentaria Finca La Cuadra (Albacete).

### Correcciones aplicadas a filas existentes (2026-07-10)

- ✅ `blincos-s-l-la-roda` — la fila venía del directorio **gff.co.uk** (mismo
  patrón que en Cuenca): `nombre` «blincos S.L.» y `municipio` «la roda» en
  minúsculas, `direccion` y `descripcion` generadas por el directorio y sin
  coordenadas. Reescrita con los datos del consejo (C/ Campoamor 33, tel., email,
  coords a 0,4 km del centroide), web vacía (no tiene) → `parcial`.
- ✅ `quesos-julian-olivas-santa-ana` — `web` apuntaba a otro directorio
  (`mejordepueblo.com`); la oficial **julianolivas.es** está viva, confirma
  elaboración artesana con leche cruda y tiene tienda propia → `verificado` y
  `Canal de venta=ecommerce` (ya tenía `Venta online=sí`).

### Residuales para otra pasada (no tocados)

- `quesos-vega-sotuelamos-chinchilla-de-montearagon`: el CSV usa
  `vegamancha.com`; el consejo publica `vegasotuelamos.com`, que sirve una página
  casi vacía (solo el nombre). Confirmar cuál está viva y si «Vega Mancha» es su
  marca antes de tocar la fila.
- Tres filas de queserías DOP siguen en `pendiente` con `Venta online=sí` sin
  canal (`don-eusebio`, `vega-sotuelamos`, y antes `julian-olivas`, ya resuelta):
  material para la pasada de *completar verificados + Venta online*.

### Método (reutilizable)

El resumen que devuelve un fetch sobre `wp-json` **se inventó y omitió campos**
(dio 7 y luego 10 fabricantes de Albacete; hay 13) y colocó las categorías donde
no estaban. Bajar el JSON con `curl` y parsear el array `places` a mano es más
barato y exacto: `categories` es **hermano de `location`**, no de
`location.extra_fields`. Un `Referer` de la propia web evita el 301/bloqueo.

⚠ Las **coordenadas del registro no son fiables**: Pago de la Jaraba cae a 71 km
del centroide de Villarrobledo y Aldonza Gourmet a 50 km del de Albacete.
Validar siempre contra `municipios.json` antes de usarlas (las de Campayo y
Blincos sí eran buenas, 10,7 km y 0,4 km).
