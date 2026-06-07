# Barcelona · seguimiento de verificación

> Ledger compartido (AGENTS.md) para la verificación **profunda** campo a campo de los productores de
> `data/csv/catalunya/barcelona.csv`. Cualquier sesión/agente retoma desde aquí sin re-descubrir.
> Es evidencia temporal, **no** una fuente de verdad: la verdad es el CSV + `verificacion`.

## Estado (snapshot inicial: 2026-06-07)

- Snapshot inicial: `verificado` 35 · `parcial` 16 · `pendiente` 2.922
- **Última actualización (2026-06-07, tras lotes 1 y 2 completos):** `verificado` 94 · `parcial` 19 · `pendiente` 2.860
- Modo acordado: **verificación profunda** (~25 filas/lote), **lote a lote bajo demanda**.
- Estimación: ~117 lotes para cubrir la provincia.

## Unidad de trabajo

- **1 lote = 1 municipio**, tope ~25 filas. Municipios grandes se parten por categoría (sub-lote a/b/c).
- Dentro del lote: primero filas con web/Instagram (confirmación barata), luego solo-GoogleMaps.
- Orden global: por impacto (capitales de comarca + distritos de Barcelona primero).

## Protocolo por fila (verificación profunda)

Contrastar cada fila contra **fuente primaria** (web propia + Google Maps) y **registro oficial**
(DAR venda de proximitat / opendata-cat), confirmando `Venta online` con checkout vivo HOY:

- [ ] `nombre` / `municipio` coinciden con la fuente
- [ ] `categoria` ∈ `VALID_CATEGORIES` (`scripts/audit-csv.js`)
- [ ] `direccion` + `lat`/`lon` coherentes (geo-check ≤15 km)
- [ ] `telefono` / `correo` / `web` vivos y correctos (fetch fallido ≠ web muerta)
- [ ] `Instagram` / `Facebook` = perfil oficial real
- [ ] `imagen` = logo/imagotipo (nunca `enrich:images --apply` en bloque)
- [ ] `Venta online` = `sí` solo con checkout vivo hoy; si no `no` / `no comprobado`
- [ ] `Canal de venta` si `Venta online = sí`
- [ ] `verificacion` → `verificado` si todo cuadra; `parcial` si solo fuente secundaria

### Comandos del lote

```bash
grep -n "<municipio>" data/csv/catalunya/barcelona.csv   # localizar filas
npx pnpm list:province barcelona --pendientes            # roster pendiente
# verificación web por fila → edición quirúrgica línea a línea
npx pnpm check:csv:changed                                # validar solo lo tocado
npx pnpm verify:data                                     # gate de cierre
# actualizar este ledger + git push (Vercel auto-deploy)
```

## Pasada 0 — saneamiento sin web (HECHA: 2026-06-07, sin ediciones)

Investigada y cerrada. **No hay ningún arreglo seguro a ciegas:**

- **0 errores bloqueantes** (estructura limpia).
- **Avisos geo (15–100 km, soft):** los municipios afectados tienen los productores **dispersos**
  (spread 18–75 km), no agrupados → el centroide es correcto; son **coordenadas individuales mal
  puestas** en 1–4 filas outlier por municipio. No procede override en bloque. Cada caso necesita
  su dirección real (web) → se resuelve en el lote de su municipio.
- **96 `direccion` "no útil":** en su mayoría campo vacío o ruido (`(Avià)`, `Barcelona (sin local
  fijo)`); rellenar exige fuente real (web) → también al lote.

**Regla operativa para cada lote:** antes de cerrar, correr el audit filtrado al municipio y dejar a 0
sus flags geo + dirección:

```bash
node scripts/audit-csv.js --mode=quality data/csv/catalunya/barcelona.csv 2>&1 | grep -i "<municipio>"
```

## Worklist priorizada (pendientes por municipio)

Leyenda estado: ⬜ pendiente · 🟨 en curso · ✅ hecho

| # | Municipio | Pendientes | Sub-lotes | Estado | Fecha | Verificados |
|---|---|---|---|---|---|---|
| 1 | Barcelona - Eixample | 13 (cluster) | — | ✅ | 2026-06-07 | 29 (1a+1b) + 5 parcial; 13 pendientes = cluster a decidir |
| 2 | Barcelona - Ciutat Vella | 5 (cluster) | — | ✅ | 2026-06-07 | 30 (2a+2b); 5 pendientes = cluster |
| 3 | Barcelona - Gràcia | 32 | 2 | ⬜ | | |
| 4 | Barcelona - Sant Martí | 26 | 2 | ⬜ | | |
| 5 | Barcelona - Sants-Montjuïc | 23 | 1 | ⬜ | | |
| 6 | Barcelona (resto) | 22 | 1 | ⬜ | | |
| 7 | Terrassa | 57 | 3 | ⬜ | | |
| 8 | Sabadell | 45 | 2 | ⬜ | | |
| 9 | Mataró | 50 | 2 | ⬜ | | |
| 10 | Manresa | 45 | 2 | ⬜ | | |
| 11 | Vic | 46 | 2 | ⬜ | | |
| 12 | Vilanova i la Geltrú | 40 | 2 | ⬜ | | |
| 13 | Vilafranca del Penedès | 38 | 2 | ⬜ | | |
| 14 | Sant Sadurní d'Anoia | 47 | 2 | ⬜ | | |
| 15 | Igualada | 32 | 2 | ⬜ | | |
| 16 | Badalona | 31 | 2 | ⬜ | | |
| 17 | Sant Boi de Llobregat | 34 | 2 | ⬜ | | |
| 18 | Sant Cugat del Vallès | 26 | 2 | ⬜ | | |
| 19 | Moià | 38 | 2 | ⬜ | | |
| 20 | Caldes de Montbui | 31 | 2 | ⬜ | | |
| 21 | Piera | 28 | 2 | ⬜ | | |
| 22 | Subirats | 28 | 2 | ⬜ | | |
| 23 | Tordera | 28 | 2 | ⬜ | | |
| 24 | Berga | 25 | 1 | ⬜ | | |
| 25 | Vilassar de Mar | 24 | 1 | ⬜ | | |
| 26 | Viladecans | 23 | 1 | ⬜ | | |
| 27 | Manlleu | 22 | 1 | ⬜ | | |
| 28 | Castellbisbal | 21 | 1 | ⬜ | | |
| 29 | Prat de Llobregat | 21 | 1 | ⬜ | | |
| 30 | Masnou | 20 | 1 | ⬜ | | |
| — | _resto (369 municipios)_ | 1.939 | ~78 | ⬜ | | |

## Cluster a decidir (editorial)

Filas de **Eixample con nombre personal (formato registro DAR)** y enlaces basura auto-rellenados
(apuntaban a entidades ajenas: gestoría, Colegio de Abogacía, joyería, restaurante, iluminación).
No verificables como productores reales con presencia propia. Enlaces falsos **ya limpiados**;
quedan en `pendiente`. **Decisión pendiente:** cotejar contra el registro DAR venda de proximitat
(¿son operadores reales con dirección fiscal en Eixample?) o eliminar.

Los 13 (enlaces ya limpiados, en `pendiente`):

- `comisso-sabrina-barcelona-eixample` (Charcutería, Tamarit 99)
- `castan-escolano-juan-barcelona-eixample` (Despensa, Aragó 207) — **coords mal** (~10 km, zona Hospitalet)
- `fabrega-lagarde-jordi-barcelona-eixample` (Despensa, Consell de Cent 289) — web era una gestoría
- `antonio-carola-diaz-aguado-barcelona-eixample` (Fruta y verdura, Mallorca 283) — web era el ICAB
- `cristina-casar-fernandez-barcelona-eixample` (Fruta y verdura, Diagonal 413) — web era joyería (Tamborero)
- `ma-luisa-diaz-aguado-neyra-barcelona-eixample` (Fruta y verdura, Rambla Catalunya 126) — FB/IG eran la Diputació
- `daniel-solsona-maria-barcelona-eixample` (Otros/Blat Tou, Pau Claris 161) — GMaps era "Solsona Leather"
- `tamarit-barrull-maria-barcelona-eixample` (Despensa, Tamarit 162) — sin datos; GMaps era "Tamarit Beach" → **candidata a eliminar**
- `agropecuaria-de-moya-sl-barcelona-eixample` (Charcutería, Ronda Universitat 14) — SL, sin web/social
- `gerundense-agricola-y-pecuaria-sl-barcelona-eixample` (Charcutería, Mallorca 272) — SL; GMaps era "Agropecuaria Casas"
- `agricola-de-agell-sl-barcelona-eixample` (Fruta y verdura, Diagonal 433) — SL; GMaps era "Lluis Agell SL"
- `agricola-poma-sl-barcelona-eixample` (Fruta y verdura, Gran Via 501) — SL; GMaps era "POMA ARQUITECTURA"

Cluster **Ciutat Vella** (mismo patrón; enlaces dañinos ya blanqueados donde los había):

- `royo-gutierrez-daniel-barcelona-ciutat-vella` (Fruta y verdura/Horta) — nombre de registro, sin presencia
- `tusell-fruitos-nolasc-barcelona-ciutat-vella` (Fruta y verdura) — nombre de registro, sin presencia
- `goni-beltran-de-garizuieta-teresa-barcelona-ciutat-vella` (Otros/oli) — nombre de registro, sin presencia
- `zain-maitreya-sl-barcelona-ciutat-vella` (Fruta y verdura, Boqueria 33) — web era `sanovation.co` (parked 402) → blanqueada
- `can-burbo-sa-barcelona-ciutat-vella` (Fruta y verdura, Joan de Borbó 50) — web caída + horario de restaurante; **categoría dudosa**, posible restaurante
- `ma-condimentos-vivos-de-asia-barcelona-ciutat-vella` (Despensa) — **NO es cluster** pero su web `macondiments.com` servía un sitio chino de apuestas (dominio caducado/secuestrado) → web blanqueada, queda `parcial` con IG

**Caso aparte — `bodega-el-grial-sl-barcelona-eixample`** (Bodega): productor **real pero ubicado en El Perelló
(Tarragona)**, DO Catalunya, no en Eixample. Web real añadida (`bodegaselgrial.com`). Decisión: ¿mover a
`tarragona.csv` (lo edita otro agente ahora — NO tocar) o eliminar de Barcelona? Dejada en `pendiente`.

## Registro de lotes cerrados

| Fecha | Municipio / sub-lote | Filas | → verificado | → pendiente (limpiado) | Notas |
|---|---|---|---|---|---|
| 2026-06-07 | Barcelona - Eixample 1a | 25 | 21 | 4 | Ogham reubicado a Sant Martí; Forn Sant Josep web→fornsantjosep1913.com; 4 del cluster con enlaces limpiados |
| 2026-06-07 | Barcelona - Eixample 1b | 19 | 8 (+2 parcial) | 9 | Rooftop/Ferment9/22:22 con tienda online; El Grial flag (Tarragona); 9 del cluster limpiados |
| 2026-06-07 | Barcelona - Ciutat Vella 2a | 25 | 25 | 0 | Todos reales (El Magnífico, Fargas, Bubó, Hofmann…); regla Venta online = canal pedido real (web/Glovo/WhatsApp) |
| 2026-06-07 | Barcelona - Ciutat Vella 2b | 11 | 5 (+1 parcial) | 5 | Tiramisús (Glovo); Forn Boix +web/FB; Ma Condimentos web hijack blanqueada; 5 cluster pendientes |
