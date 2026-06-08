# Barcelona · verificación profunda — manual + estado

> Ledger reanudable de la verificación campo a campo de `data/csv/catalunya/barcelona.csv`.
> Una sesión nueva (sin memoria de la anterior) debe poder retomar **solo con este archivo**.
> Es evidencia de trabajo, no fuente de verdad: la verdad es el CSV + la columna `verificacion`.
>
> **Principio rector (no negociable):** dar peso a la **verificación real** y a la **solidez del CSV**.
> - Evidencia > afirmaciones. No te fíes de lo que ya pone la fila: hay `sí/ecommerce`, webs,
>   redes y GMaps **mal auto-rellenados**. Confírmalo o corrígelo.
> - Niveles honestos: `verificado` solo con cotejo contra fuente primaria/fiable; `parcial` si solo
>   hay fuente secundaria o registro; `pendiente` si no se ha revisado.
> - Nunca inventes un productor ni un dato. Mejor vacío que falso.
> - Elimina desinformación (enlaces a entidades ajenas) aunque implique dejar el campo vacío.
> - Purga/borra filas solo con evidencia fuerte (cotejo de registro + ausencia de presencia real).

## Estado actual (2026-06-08)

- Filas: **2.934** · `verificado` **219** · `parcial` **67** · `pendiente` **2.648**
- Snapshot inicial era 2.973 · 35 · 16 · 2.922 (se han **purgado 39 filas** y verificado/parcial el resto).
- Modo: **verificación profunda**, **lote a lote bajo demanda** (~25 filas/lote). ~100 lotes estimados.
- **Cerrados:** Lotes 1-6. **Lote 6 = Barcelona (resto)** (la ciudad menos los 5 distritos) **COMPLETO**:
  el worklist lo estimaba en 22 pero el alcance real eran **113 pendientes** (Sarrià-SG, Horta-Guinardó,
  Sant Andreu, Nou Barris, Les Corts + variantes con barrio). Resueltas en 4 sub-lotes 6a-6d →
  **0 pendientes** en Barcelona-resto. Saldo lote 6: ~96 verif/parcial + **17 purgas** (mal fichadas
  fuera de provincia, no-productores, duplicados de registro, sin datos).
- **Siguiente:** Lote 7 = **Terrassa** (57 pendientes → ~3 sub-lotes).
- Último push: lotes 1-5 + cluster + manual en `main`. Pendiente de push: 6a-6d.

## Cómo retomar en 1 minuto

1. Lee este archivo entero (estado + patrones + gotchas).
2. Elige el siguiente municipio de la **worklist** (más abajo) en orden de impacto.
3. Extrae sus pendientes priorizando los que tienen web/IG (baratos):
   ```bash
   python3 - <<'PY'
   import csv
   M="Barcelona - Gràcia"   # <-- municipio objetivo
   rows=list(csv.DictReader(open('data/csv/catalunya/barcelona.csv',encoding='utf-8')))
   p=[r for r in rows if r['municipio'].strip()==M and r['verificacion'].strip()=='pendiente']
   p.sort(key=lambda r:-((r['web'].strip()!='')*2+(r['Instagram'].strip()!='')))
   for r in p[:25]:
       print(r['slug'],'|',r['categoria'],'|',r['nombre'],'| web=',r['web'][:35])
   PY
   ```
4. Verifica cada fila por web (ver **protocolo** y **patrones**).
5. Edita con el **script column-aware CRLF-safe** (plantilla más abajo). Nunca a mano fila a fila.
6. Valida: `npx pnpm check:csv:changed` → `npx pnpm verify:data`. Actualiza este ledger.

## ⚠️ Gotchas técnicos (leer antes de editar)

- **El CSV es CRLF (`\r\n`).** Un `open().read()/write()` de Python en modo texto lo convierte a LF
  y reescribe el fichero entero (diff de ~3.000 líneas, ruido y conflicto con otros agentes).
  **Siempre** abrir con `newline=""`, conservar el `\r\n`/`\n` de cada línea, y al final comprobar:
  ```bash
  python3 -c "b=open('data/csv/catalunya/barcelona.csv','rb').read(); print('CRLF ok' if b.count(b'\r\n')==b.count(b'\n') and b'\r\r' not in b else 'PROBLEMA')"
  ```
- **No reescribas todo el fichero.** Modifica solo las líneas cuyo `slug` está en tu lote; el resto
  byte-idéntico. Esto preserva el trabajo de otros agentes y mantiene el diff pequeño.
- **Multiagente:** toca solo `barcelona.csv`, este ledger y `public/productores/**/barcelona/`.
  **No toques** `girona.csv`, `lleida.csv`, `tarragona.csv` ni `scripts/enrich-producer-images.py`
  (otros agentes). Al commitear, haz `git add` explícito de tus rutas; nunca `git add -A`/`git checkout` del CSV.
- **Orden de columnas (0-based):** 0 slug · 1 nombre · 2 municipio · 3 categoria · 4 productos estrella ·
  5 direccion · 6 descripcion · 7 horario · 8 telefono · 9 correo · 10 web · 11 Facebook · 12 Instagram ·
  13 Google Maps · 14 lat · 15 lon · 16 imagen · 17 verificacion · 18 Venta online · 19 Canal de venta.
- **Contrato:** `verificado` exige coords + ≥1 enlace (web/GMaps/IG/FB) — el audit lo bloquea si no.
  `Venta online` ∈ {sí, no, no comprobado}. `Canal de venta` solo si `Venta online=sí`.
- Al borrar una fila con imagen, borra también su `.webp` (queda huérfana → warning en `check:images`).

### Plantilla de edición column-aware (CRLF-safe)
```python
import csv, io
PATH="data/csv/catalunya/barcelona.csv"
CHANGES={ "slug-aqui": {17:"verificado", 18:"sí", 19:"ecommerce"} }   # idx_columna: valor
DELETE=set()                                                          # slugs a borrar
with open(PATH,encoding="utf-8",newline="") as f: lines=f.readlines()
out=[]
for line in lines:
    eol="\r\n" if line.endswith("\r\n") else ("\n" if line.endswith("\n") else "")
    body=line[:-len(eol)] if eol else line
    slug=body.split(",",1)[0]
    if slug in DELETE: continue
    if slug in CHANGES:
        f0=next(csv.reader(io.StringIO(body)))
        for i,v in CHANGES[slug].items(): f0[i]=v
        o=io.StringIO(); csv.writer(o,lineterminator="").writerow(f0); body=o.getvalue()
    out.append(body+eol)
open(PATH,"w",encoding="utf-8",newline="").writelines(out)
```

## Protocolo por fila (verificación profunda)

Contrasta cada fila contra **fuente primaria** (web propia + Google Maps) y, para nombres de registro,
contra el **DAR** (ver más abajo). Confirma `Venta online` con un canal de pedido vivo HOY.

- [ ] `nombre` / `municipio` coinciden con la fuente (ojo: la dirección/coords pueden delatar otro municipio)
- [ ] `categoria` ∈ `VALID_CATEGORIES` (`scripts/audit-csv.js`)
- [ ] `direccion` + `lat`/`lon` coherentes (geo-check ≤15 km)
- [ ] `telefono` / `correo` / `web` vivos y **del productor** (no de un tercero)
- [ ] `Instagram` / `Facebook` = perfil oficial real
- [ ] `Google Maps` apunta al sitio correcto (no a otro negocio)
- [ ] `imagen` = logo/imagotipo (nunca `enrich:images --apply` en bloque)
- [ ] `Venta online` + `Canal de venta` (ver regla)
- [ ] `verificacion` → `verificado` (todo cuadra) / `parcial` (solo secundaria o registro) / `pendiente`

## Regla de `Venta online` / `Canal de venta`

Decisión por **canal de pedido online real**, confirmado hoy:
- **`sí`** si hay: tienda web con carrito/checkout (`ecommerce`); o pedido por **Glovo/UberEats/Bakering**
  u otro marketplace (`marketplace`); o **"pedir online" por WhatsApp** (`whatsapp`); email/teléfono de
  pedido (`email`/`telefono`). Varios → pipe: `marketplace|whatsapp`.
- **`no`** si solo hay web informativa, "en construcción", o solo tienda física.
- **`no comprobado`** si no puedes confirmarlo (p. ej. tienda caída temporalmente, o no ves checkout
  pero el dato previo decía `sí`). **No** afirmes `sí` sin evidencia; **no** degrades a `no` a la ligera.
- Corrige `sí/ecommerce` erróneos (visto: catálogo sin carrito marcado como `sí`).

## Catálogo de patrones por productor (cada uno tiene el suyo)

Reconoce el patrón y actúa en consecuencia:

1. **Marca consolidada con web propia** (Escribà, Fargas, Cacao Sampaka…): `WebFetch` su web →
   confirma negocio + checkout → `verificado` + `Venta online` según regla. ~1 fetch.
2. **Solo IG / sin web** (panaderías, heladerías de barrio): `WebSearch` para confirmar existencia,
   dirección y si vende online. Si es real → `verificado`; suele ser `Venta online=no`.
3. **Marca con varias sedes**: comprueba a qué sede apuntan **dirección + coords** y corrige `municipio`
   si no cuadra (visto: Ogham con coords en Sant Martí pero `municipio`=Eixample → corregido).
4. **Punto de consumo, no productor** (café que sirve café de terceros; taproom-colab que no elabora
   in situ): existe pero no es productor/elaborador → `parcial`, `Venta online=no`.
5. **Web muerta vs web secuestrada:**
   - Fetch falla por SSL/http/timeout/ECONNREFUSED → **NO** borres la web (AGENTS: un fetch fallido no
     es un sitio muerto); confirma por búsqueda.
   - La web **carga pero muestra un negocio ajeno** (gestoría, dominio de apuestas, parked 402) →
     **blanquea la web** (es desinformación) y baja a `parcial`/`pendiente` según el resto.
6. **Enlaces cruzados auto-rellenados**: web/IG/FB/GMaps apuntan a entidades ajenas (ICAB, Diputació,
   joyería, "Solsona Leather", "POMA ARQUITECTURA"…). Límpialos. Si además es nombre de registro → patrón 7.
7. **Fila de registro (`COGNOM1 COGNOM2, NOM` o `… SL`)** sin presencia propia: candidata a cluster.
   Cotéjala con el **DAR** (abajo). Match exacto → `parcial`; sin match + sin web → **purgar**.
8. **Mal fichada**: provincia/categoría equivocada (bodega de Tarragona en Barcelona; restaurante como
   "Fruta y verdura"; sin datos) → **purgar** (o flag para mover, sin tocar el CSV de otra provincia).
9. **Web del CSV obsoleta pero el productor es real** (Forn Sant Josep, Forn Boix): **actualiza** la web
   al dominio correcto y añade redes/imagen que falten.

## Cotejo con el registro DAR (venda de proximitat)

Para filas de registro (patrón 7). Dataset Socrata oficial, consultable por `curl`:
```bash
curl -s "https://analisi.transparenciacatalunya.cat/resource/xmyy-7xqi.csv?\$limit=5000" -o /tmp/dar.csv
```
- Columnas: `nom_productor` (`COGNOM1 COGNOM2, NOM`), `num_acreditacio`, `nif`, `adreca`, `codipostal`,
  `municipi`, `comarca`, `productes`, `venda_directa`, `venda_circuit_curt`, `tel_fon`, `correu`, `marca_comercial`.
- Grep **normalizando acentos** y exige **match de entidad** (mismos apellidos **y** `municipi`), no solo
  apellido compartido. Match → `parcial` (registro confirma existencia, **no** venta online); aprovecha para
  corregir `tel`/`correu`/`productes`/`marca` con los datos oficiales.
- **Caveat:** el dataset solo trae quienes consintieron publicarse; "no constar" no prueba inexistencia,
  pero junto a la ausencia de web propia justifica la purga.

## Cluster — RESUELTO (2026-06-07)

18 filas de registro entre Eixample y Ciutat Vella, con enlaces auto-rellenados a entidades ajenas.
Cotejadas contra DAR `xmyy-7xqi`:
- **Mantenidas `parcial` (5, constan en DAR Barcelona):** `royo-gutierrez-daniel-…-ciutat-vella`,
  `agropecuaria-de-moya-sl-…-eixample` (contacto actualizado, marca LA ROVIRA),
  `gerundense-agricola-y-pecuaria-sl-…-eixample`, `agricola-de-agell-sl-…-eixample`,
  `agricola-poma-sl-…-eixample`.
- **Purgadas (13):** grupo A mal fichado (`bodega-el-grial-sl` = bodega de El Perelló/Tarragona;
  `can-burbo-sa` = restaurante; `tamarit-barrull-maria` = sin datos) + 10 sin match DAR (Comisso,
  Castan Escolano, Fabrega Lagarde, Antonio Carola, Cristina Casar, Ma Luisa Diaz-Aguado, Daniel Solsona,
  Tusell Fruitos, Goñi Beltran, Zain Maitreya). Sus 4 imágenes huérfanas también borradas.

## Flags — RESUELTOS (2026-06-07)

- ✅ `exalta-chocolat-barcelona-gracia`: reubicada a Sant Antoni de Vilamajor, `verificado`/`sí` (en 3b).
- ✅ **Purgadas (8):** `bodega-la-riera-…-gracia` (bar-celler, revende) y `hoppiness-…-sant-marti` (bar de
  cervezas de terceros) — no son productores; `cesc-jk-…-sant-marti` (duplicado de
  `la-cervesera-del-poblenou-…`, que queda como canónica); y las 5 de Sants-Montjuïc sin DAR ni presencia
  (`mas-de-vicenta-cb`, `castelroc-sa`, `fruites-maria`, `agrima`, `sabrina-comisso`). +4 imágenes huérfanas.
- ✅ `corpen-barcelona-sant-marti`: recategorizada `Bodega` → `Otros` (es destilería de gin, no bodega).
- ✅ `agricola-poma-sl` (`parcial`): corregida con datos DAR — `Despensa artesanal` / Aceite de oliva /
  Gran Via de Carles III 133 / `municipio`=Barcelona - Les Corts / coords re-geocodificadas / contacto LOMASOLI.
- (Histórico) `bodega-el-grial-sl`: purgada antes; si interesa, que el agente de Tarragona la añada a
  `tarragona.csv` (bodega real en El Perelló).

## Worklist priorizada (pendientes por municipio)

Leyenda: ⬜ pendiente · 🟨 en curso · ✅ hecho. (Cifras de municipios sin tocar = snapshot inicial.)

| # | Municipio | Pendientes | Sub-lotes | Estado | Fecha | Notas |
|---|---|---|---|---|---|---|
| 1 | Barcelona - Eixample | 0 | — | ✅ | 2026-06-07 | 29 verif + 4 parcial (DAR); 9 purgadas |
| 2 | Barcelona - Ciutat Vella | 0 | — | ✅ | 2026-06-07 | 30 verif + 1 parcial (DAR); 4 purgadas |
| 3 | Barcelona - Gràcia | 0 | — | ✅ | 2026-06-07 | 27 verif + 4 parcial; Exalta→Sant Antoni; Bodega La Riera purgada |
| 4 | Barcelona - Sant Martí | 0 | — | ✅ | 2026-06-07 | 20 verif + 5 parcial; CESC JK (dup) y Hoppiness (bar) purgados |
| 5 | Barcelona - Sants-Montjuïc | 0 | — | ✅ | 2026-06-07 | 11 verif + 7 parcial; 5 cluster purgadas |
| 6 | Barcelona (resto) | 113 | 4 | ✅ | 2026-06-08 | 6a-6d; ~96 verif/parcial + 17 purgas; 0 pendientes |
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
| — | _resto (369 municipios)_ | 1.939 | ~78 | ⬜ | | recomputar al llegar |

## Registro de lotes cerrados

| Fecha | Lote | Filas | → verificado | otros | Notas |
|---|---|---|---|---|---|
| 2026-06-07 | Eixample 1a | 25 | 21 | 4 limpiados | Ogham→Sant Martí; Forn Sant Josep web→fornsantjosep1913.com |
| 2026-06-07 | Eixample 1b | 19 | 8 | 2 parcial · 9 limpiados | Rooftop/Ferment9/22:22 con tienda; El Grial flag |
| 2026-06-07 | Ciutat Vella 2a | 25 | 25 | — | Todos reales (El Magnífico, Fargas, Bubó, Hofmann…) |
| 2026-06-07 | Ciutat Vella 2b | 11 | 5 | 1 parcial · 5 cluster | Tiramisús (Glovo); Forn Boix +web/FB; Ma Condimentos web hijack |
| 2026-06-07 | Cluster (DAR) | 18 | — | 5 parcial · 13 purgadas | Cotejo DAR xmyy-7xqi; +4 imágenes huérfanas borradas |
| 2026-06-07 | Gràcia 3a | 25 | 23 | 1 parcial · 1 flag | Establecimientos reales; Exalta mal fichada (es de Sant Antoni de Vilamajor) |
| 2026-06-07 | Gràcia 3b | 8 | 4 | 3 parcial (DAR) · 1 flag | De Abreu/Cerdan/Brugarol en DAR→parcial; Exalta reubicada+verificada; Bodega La Riera flag |
| 2026-06-07 | Sant Martí 4a | 25 | 20 | 4 parcial · 1 flag | Poblenou (Nomad, Väcka, Bioma, El Tío Che…); CESC JK=La Cervesera del Poblenou dup; Hoppiness=bar; Corpen=gin |
| 2026-06-07 | Sant Martí 4b | 1 | 0 | 1 parcial (DAR) | Blue Zafir Invest SL en DAR→parcial |
| 2026-06-07 | Sants-Montjuïc 5 | 23 | 11 | 7 parcial · 5 flag-purga | DAR: Palaudo/Calvet/Prats→parcial; 5 sin DAR→candidatas purga (webs falsas limpiadas) |
| 2026-06-07 | Flags resueltos | 10 | — | 8 purgadas · 2 corregidas | Purga (bares/dup/cluster) +4 imgs; Corpen→Otros; Agrícola Poma→aceite LOMASOLI/Les Corts |
| 2026-06-08 | Barcelona-resto 6a | 25 | 22 | 2 parcial · 1 purga | Web propia (Les Corts/Ciutat Vella/Horta…). Purga: The Milk and Coffee = Milk Bar & Bistro (restaurante) +img. Oggi web .it (Udine) blanqueada; Yellow Bakery/Cèlia dominios en venta → web corregida/blanqueada; Artemis=centro estética (parcial); La Cantina Solar food-truck (parcial) |
| 2026-06-08 | Barcelona-resto 6b | 30 | 27 | 3 parcial | Web propia (Sant Andreu/Sarrià-SG/Nou Barris…). Productores reales (Salazones Moreno, Exotic Sal, LOV Ferments, Cyclic, Almogàver, Panes Creativos, Pasta Spada, Suca'l, Baixas, Blasi…). Suca'l web→sucal.es; Blasi web→raíz. Parcial: Ous Susana + Formatgeria Ireneu (distribuidores/reseller), Blasi (web caída, no comprobado) |
| 2026-06-08 | Barcelona-resto 6c | 11 | 8 | 2 parcial · 1 purga | Solo-IG. Confirmados por búsqueda (Artchur, Carn+carn, Forn del Passeig-Horta +web, Forn Vall d'Hebron, Alpuente, Argilés, Roquetes +web, Valentina e Pasqualina +web). Sant Croi: tiendas físicas cerradas pero gelats online (parcial, +santcroi.com). Apamate parcial (IG coincide, sin 2ª fuente). Purga: L'Hort d'en Josep (IG no coincide + Parc Agrari etiquetado Barcelona + sin rastro) |
| 2026-06-08 | Barcelona-resto 6d | 47 | 10 | 21 parcial · 16 purga | Cluster de registro. Cotejo DAR xmyy-7xqi: 10 en DAR-Barcelona→parcial (Celler de l'Era, Debresca, Oli Cometes, La Mielada, Mels del Montnegre, Safrà de Montserrat, Petits Remeis, Fontcalda, Prats Espar, Macau). Forns/charcuterías confirmados por Ajuntament/Mercat/web→10 verif (ARTPA, Sant Honorat, Montbau, L'Amic, Padró Canals, Glòria, Samsó, Bareche, Fruben, L'Exquisita). **17 purgas** (con 6c): mal fichados fuera de provincia (Carretero Ariza=El Perelló, Gurria=Cadaqués, Mesura=Mijas/Málaga, Recasens/Farré/Verdallar/Díaz-Aguado fuera de BCN), no-productores (Fundación Rokpa=centre budista, Consultores Tècnics 3000=consultoria), dups (García Moll ×2) y sin datos (Butzbach, Adell, Mora). +8 imágenes huérfanas |
