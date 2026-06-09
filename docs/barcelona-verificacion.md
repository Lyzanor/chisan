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

## Estado actual (2026-06-09)

- Filas: **2.891** · `verificado` **490** · `parcial` **187** · `pendiente` **2.214**
- Snapshot inicial era 2.973 · 35 · 16 · 2.922 (se han **purgado 82 filas** y verificado/parcial el resto).
- Modo: **verificación profunda**, **lote a lote bajo demanda** (~25 filas/lote). ~90 lotes estimados.
- **Cerrados:** Lotes 1-16. Lote 14 Sant Sadurní (50), Lote 15 Igualada (32),
  **Lote 16 = Badalona** COMPLETO (31 pend en una pasada: 23 verif + 5 parcial + 3 purgas).
  Comerç de ciutat (cafès tostadors, cerveseres, gelaters/orxateries, forns/pastisseries). **Anís del Mono**
  estava mal fichat com a Bodega/vino → és **anís/licor** (recat Destilados y licores; VO sí via Osborne).
  **3 purgas de cross-link basura** (filas "Despensa/conservas" amb web d'entitat aliena, sense DAR):
  Giralt Colell→`digest.cat`=**clínica dental**, Horta de Santa Clara→`alteuaire.es`=**espai festes
  infantils**, Mansol Projectes→`mansol.cat`=**Centre Especial de Treball industrial**. DAR Badalona:
  Balart Fernández=NOUS (recat→Frutos secos), Giró Claraso=plantes aromàtiques (recat)→parcial. Ous La
  Salut = parada que **selecciona/revèn** ous (no productor)→parcial però amb botiga (VO sí). Coords de
  Forn de Llenya Riera estaven lluny (corregides). Molts tostadors/forns reals amb botiga: Amauta, Bofarull,
  Maresme Brewery, Ca La María, Fontisi, Forn Bertran, Pastisseria Comas, Gramola Lab.
- **Siguiente:** Lote 17 = **Sant Boi de Llobregat** (34 pendientes → ~2 sub-lotes).
- Último push: **lotes 13 y 14 en `main`**. **Pendiente de push: lotes 15 y 16** (commits locales hechos).

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
| 7 | Terrassa | 57 | 4 | ✅ | 2026-06-08 | 7a-7d; 30 verif + 27 parcial; 0 purgas |
| 8 | Sabadell | 45 | 4 | ✅ | 2026-06-08 | 8a-8d; 24 verif + 19 parcial + 2 purgas |
| 9 | Mataró | 50 | 4 | ✅ | 2026-06-08 | 9a-9d; 29 verif + 17 parcial + 4 purgas |
| 10 | Manresa | 45 | 1 | ✅ | 2026-06-08 | 21 verif + 11 parcial + 13 purgas; DAR Bages; nil-puig→Castellbell |
| 11 | Vic | 46 | 1 | ✅ | 2026-06-08 | 30 verif + 9 parcial + 7 purgas; DAR Osona; Corretja→Sta Eulàlia Riuprimer |
| 12 | Vilanova i la Geltrú | 40 | 1 | ✅ | 2026-06-08 | 20 verif + 11 parcial + 9 purgas; DAR Garraf; webs cruzadas por apellido |
| 13 | Vilafranca del Penedès | 38 | 1 | ✅ | 2026-06-09 | 28 verif + 10 parcial + 0 purgas; DAR Alt Penedès; muchas webs cruzadas; Valliser→Vilobí (membrillo) |
| 14 | Sant Sadurní d'Anoia | 50 | 1 | ✅ | 2026-06-09 | 43 verif + 4 parcial + 3 purgas; capital del cava; casi todo real con botiga; sub-marcas Gramona/J&C/Recaredo |
| 15 | Igualada | 32 | 1 | ✅ | 2026-06-09 | 23 verif + 7 parcial + 2 purgas; DAR Anoia (Entrebosc/Can Vich/Can Vilaseca); Mercat Masuca; Cal Vicens→Montbui |
| 16 | Badalona | 31 | 1 | ✅ | 2026-06-09 | 23 verif + 5 parcial + 3 purgas; Anís del Mono (recat licor); 3 cross-link basura purgats; DAR Badalona |
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
| 2026-06-08 | Terrassa 7a+7b | 30 | 17→ | — | Webs propias. 18 escritas en bloque (alba, albert-morera, caran GF, casanovas ×2 [2 sedes reales 1906], la-xicra, les-saveurs, orxateria-ribera, núria, turull, ricardo-i-montse, Sanmy [refrescos 1895], zaguirre, prats-mercader, els-xixonencs, embotits-sanchez, tantagana). Webs cruzadas detectadas: canbanach.com=tienda mascotas (parcial), fornsantjordi.cat=Granollers, fornturull.cat≠Armengol, pont-aurell=industria |
| 2026-06-08 | Terrassa 7c | 23 | 12 | 11 parcial | Solo-IG + parades Mercat Independència + SSL caídos. Verif: El Rebost Casa Pau, Sant Pere Coffee, Obrador La Portella, Projecte Geosmina, Forn Armengol (web→fornarmengol.com), Forn Carné, Forn Turull, Bolets&Co, Cervesa La Resclosa (oro EBS24), Areny/Gamisans/L'Enxaneta (Mercat). Parcial: Casé, Planas, Melsana, Altamon (mel), Fermentum (tel falso), Forn Sant Jordi (web=Granollers), Tot Teca (Forn Gotés Sabadell, tancat), Saludes/Cresol/Marcos/Páez (Mercat) |
| 2026-06-08 | Terrassa 7d | 16 | 1 | 15 parcial · 0 purga | Cluster registro. Cotejo DAR: Explotacions Molle (Casa Nadal), Farre Colom (Coop d'Ivars), **Jardineria El Roure** (¡productor de verdura!→recat. Fruta i verdura), Santa Magdalena SAT (carn), Violeta Zafra (safrà→recat. Despensa), Simó Aynés (Els Campaners). Lleonart/Avícola=ous reals. Forn Anglada-Cal Forner verif (web calforner.com, des 1875). Webs cruzadas blanqueadas (pont-aurell, aoberta) |
| 2026-06-08 | Sabadell 8a+8b | 14 | 14 | — | Webs propias. Sanmy no aplica (Terrassa). Reales: 0x100 Gluten/Krum, Artbo (1969), Cafès Pont (1952, tostador), Mateu (1925), Jové Xarcuters, La Crème, Mas Avícola, Moreno Antolinos (1951), Coco y Canela, Brunni (parada Mercat Central!), Mussons (enoteca Sabadell 2010), Valero, Xocolates Genescà (1928), La Fem (obrador Sant Cugat). Webs cruzadas: canbanach=mascotas, vallriberanoray=arquitecto, jsalvado=admin. fincas |
| 2026-06-08 | Sabadell 8c | 10 | 8 | 1 parcial · 1 purga | Medran (1958), La Micro/Or i Plata (cervesers 2011), Llegums Roca (web→elsllegumsroca.com, +ecommerce), Fleca E.Valls (1971), Sant Marc (1976), Benet Forners (1962). Delightcious y Forn del Progrés relocalizados a Terrassa (mal fichados). Umami parcial (¿Rubí?). Purga: Finca Alavedra (jsalvado=admin. fincas, no productor) |
| 2026-06-08 | Sabadell 8d | 21 | 2 | 18 parcial · 1 purga | Cluster registro. Cotejo DAR (7 reales Sabadell): Domingo Garcia (Can Ustrell), Gabarrón (Jadeverd), Gaoxing (cogombre→recat), Girbau Solà (vins), Moliner (Remeiets→recat), Rosell Canals (Hort del Catre), Vallribera Tubau (ous, web arquitecto blanqueada). Verif: Cal Blau (embotits 1945), La Palma Pastissers. Forn Viñas/Domènec/Villaró parecen de Castellar (parcial). Purga: Guiu Aran (sin datos ni DAR) |
| 2026-06-08 | Mataró 9a+9b | 27 | 23 | 2 parcial · 2 hold | Webs propias. Verif venta online: Can Gladiador, Can Serrat (1954), Casa Graupera (neulers 1895), El Cigró Salat (bacallaneria), L'Hort d'en Dídac, Mūn Kombucha, Sweet Dreams. Sin VO: Can Tria, Flors Noè, Granja Caralt, La Klosca (ous→recat Huevos), Nougat, Stick Art, Can Maresma (WhatsApp). Banderas: fornnoe.com=Hostalric (Forn Noé Mataró sí existe, web blanqueada); clubcoc.com=COC Vilassar (Coc Ludoteca=espai tallers, parcial). Formatgeria=cremier (parcial) |
| 2026-06-08 | Mataró 9c | 18 | 14 | 4 parcial · 1 purga | Webs directorio + solo-IG. Verif: Pastisseria Uñó (1967), Dehum Cervesers (Mataró Grape Ale), Synera/Molta Malta, Meleix (mel eco, web→meleix.cat), S'ha Acabat el Bròquil (coop verdura), Can Kiku (+kikupa.com), el7et gelats, Petits Délices (+web), Xarcuteries Miguel i Begoña (1977), parades Mercat Cuba (Can Margarida, Polleria Leo i Merche 60a, Eva i Oscar, El forn de la Nona, Les Rovires). Parcial: Can Grau, Brèscat (mel), 5 Pebrots. Purga: Safont-Tria (web ifs.cat=clínica reproducció) |
| 2026-06-08 | Mataró 9d | 15 | 0 | 12 parcial · 3 purga | Cluster registro. DAR confirma pagesos Maresme→parcial: Ayter (patata), Can Bleda (patata→recat), González García (Can Gallard, cargols), Horta Pera, Jordi Graupera (Can Redeu). Parcial sin DAR: Aviram Ros, Can Bastons, Confraria Pescadors (llotja), Cantallops, Floriach, Pastisseria Roselló/Sacher. Purgas: Chamarro=Can Margarida (dup, mismo tel/correu), Santana Flores=Brèscat (dup DAR, mateixa adreça Garbí 2), Martin Rosell (sense dades) |
| 2026-06-08 | Manresa 10 | 45 | 21 | 11 parcial · 13 purga | Una pasada. **Verif web propia + venta online:** Celler el Molí/Collbaix (vi eco DO Pla de Bages, ecommerce+club), Oller del Mas, Cerveses Hoppit, AlEco (botiga eco), Forn de Pa Jorba (enviament ES), Delícies Sense Gluten (web→deliciessensegluten.com, era celiacscatalunya; botiga online), Mas Rossinyol (cistella WhatsApp), nil-puig/Hort del Puig (senalles+suscripció, **→Castellbell i el Vilar**), Llengua de Gat (obrador WhatsApp). **Verif sin VO:** L'Aroma (Café Arabo), EcoPallareta (ous CCPAE), Cal Climent, Granja Cal Porta (llet, DAR=Manresa), El Forn Antic, Forn Coma, L'Obradora (coop obrador), Viver Serra, Xarcuteria Casa Coll (+casacoll.cat), Outer Gin (ginebra, recat→Destilados), The Goats (brewpub), Les Arnaules (Horta de Viladordis). **DAR Bages parcial:** Xavier Torras, Gomez Carrascal (Xicuxai), Oliveras Alsina (Cal Andreu, contacto DAR), Tarrés Rosiñol (Cal Codony), Tatjé Masachs (Viladordis). Otros parcial: Salelles (coop pinsos→recat Productos ecológicos), Granja Poal, Verdura Collida Avui (domini viu, no llegit), Serra Fornell (=El Manel, web-IG blanq.), L'horta que brota, Horta Mas d'en Pla. **13 purgas:** 5 dups marca↔SL (Tanegram=Oller del Mas, Rosiñol Tarres SCP=Mas Rossinyol, Sola Cantó=Cal Climent, Agropecuària Casasayas=Les Arnaules, Silverio T.R.=Cal Codony [datos Transmarsol]); 6 empresas ajenas auto-enriquecidas (Molins=Molins Solucions Industrials, Borros=Borrós Interiorisme +img, Ileana=UManresa, Tatje Casajuana=Manel Tatje electricista, Jose Torrents=CDIB, Moncunill=Mon Digital); 2 noms pelats sense DAR (Oliveres Pinto, Gerard Font Català=dup EcoPallareta). DAR Manresa sin tocar (candidatos futuros): AMPANS/Urpina, Calafell/Can Calafell, CCAgrària/Can Poc Oli |
| 2026-06-08 | Vic 11 | 46 | 30 | 9 parcial · 7 purga | Capital d'embotits (Plaça dels Màrtirs). **Verif xarcuteries web propia:** Casa Riera Ordeix (1852, ecommerce), Can Vilada (Duroc, ecommerce+WhatsApp), Casa Sendra (Splendid Foods), Can Molas (1982), Solà (WhatsApp), Ca la Teresona (1837), Carnisseria Girbau (tel+envío), Aliemsa (+aliemsa.net), Coll-fred (+collfred.cat), Xarcuteria Salvans→parcial. **Verif dolç/xoco:** Eukarya (Lluc Crusellas, bean-to-bar), Brunni Bomboneria, Sant Cacau (obrador, web-dir blanq.), XixoVic (1944, torrons), Carol Tòfones (recat→Trufa y setas), Carlamel (+web), La Coca d'Anís=Pastisseria Sant Antoni (+web), Pastisseria Masramon (1969, +web), El Bruguer, Pastisseria Lladó. **Verif forns:** Artipà (David Rovira, eco), PAVIC, El Pastador, Forn Riera (web-dir blanq.), L'Espiga d'Or (1923 emblemàtic), Delícies SG Vic, 0% Gluten. **Verif altres:** Farines Ylla 1878 (molí), Planes Bones (rostisseria+horta, DAR Saborit), Làctics Ubach (Sta Eugènia de Berga, mantingut Vic), Granja La Riera (ous eco, DAR La Riera Eco SCP). **Parcial:** Mengem Osona (assoc. consum), Can Fornell (jubilació 28/6/2025), Horta Gamisans (IG @gastroteca.cat errònia blanq.), Fleca Divina Pastora + DAR Osona (Quirante Sales=La Casanova, Raurell Casany, Biomil=Masó Bagué). **7 purgas:** 2 dups DAR (Verdures Planes Bones=Planes Bones, Masó Bagué=Biomil), Serrabassa Puntí (correu=La Riera, sense DAR), Mas Torrenegra (fàbrica de pinsos, no xarcuteria), Vial 3,25 SL (sense rastre), Antoni Vidal Ribas (sense dades), Escalé Escalé Benet (sense DAR/web). Sebastià Corretja→Santa Eulàlia de Riuprimer (botifarra de Riuprimer). DAR Osona candidatos futuros: Apícola Morató (Mel Morató), Pujalt Quero (Xai Torrents del Prat), Tarres Alcalde (L'Esquellot del Montseny) |
| 2026-06-09 | Badalona 16 | 31 | 23 | 5 parcial · 3 purga | Comerç de ciutat (Barcelonès), una pasada. **Verif amb VO sí:** Anís del Mono (**recat Bodega/vino→Destilados y licores**; botiga via Osborne), Amauta Coffee i Cafès Bofarull (tostadors, ecommerce), Maresme Brewery (botiga), Gramola Lab (xocolata, ecommerce+WhatsApp), Ca La María Obrador (sense gluten), Fontisi (Shopify), Forn Bertran (botiga), Fragola by Ferita (reserves+WhatsApp), Pastisseria Comas. **Verif sense shop→VO no/no comprobado:** Sikaru (cervesa Fundació Badalona Capaç), Bomboneria Almera (cert error), Artesans Soler (gelats 1969 B2B), Can Soler (gelats propis), Gelateria Fillol (orxata des de 1929), Lillo Picó (torrons/gelats), Forn de Pa Mireia (cert error), Forn Sant Pere (forn de llenya), Pastelería Fidelia (horeca), TAART by Carles Mampel (alta pastisseria d'autor), Boheme (forn franquícia), Fleca Gisbert (20+ anys), Forn de Llenya Riera (SL extinguida però actiu; **coords lluny→corregides**). **Parcial:** Ous La Salut (parada que **selecciona/revèn** ous, no productor; té botiga→VO sí), Bodega Castillo (sense rastre, probable despatx de vins), DAR Badalona→ Balart Fernández=**NOUS** (recat Huevos→Frutos secos), Giró Claraso=**plantes aromàtiques** (recat Fruta→Aromáticas y condimentos), Confraria de Pescadors (llotja). **3 purgas (cross-link a entitat aliena + sense DAR + conserves falses):** Giralt Colell→`digest.cat`=clínica dental, Horta de Santa Clara→`alteuaire.es`=espai de festes infantils (Al Teu Aire), Mansol Projectes→`mansol.cat`=Centre Especial de Treball (destrucció documents/muntatges). +3 imatges esborrades. DAR Badalona altres: Abellan Moya (vins), Conreu Sereny SCCL (horta) |
| 2026-06-09 | Igualada 15 | 32 | 23 | 7 parcial · 2 purga | Comerç de poble (Anoia), una pasada. **Verif amb VO sí:** Rec Brew (ecommerce), Agro Igualada Coop (botiga oli), Cal Vicens (obrador làctic, **→Santa Margarida de Montbui**). **Verif sense shop→VO no/no comprobado:** Els Minairons (microcerveseria, comandes per pack), La Lenta (cerveseria nòmada, cert caducat), Xarcuteria Ibáñez (web=club fidelització, no checkout; lligada a Càrnics Anoia), Domènech Xarcuter, Bona Cuina Selecta (canelons des de 1990→recat **Platos preparados**), De Bona Pasta (parada Masuca), L'Hort de l'Avi (fruita km0 cultiu propi des de 1964), Làctics La Tossa (formatger artesà 1986), Delícies Sense Gluten (fleca), Forn Alemany (web→fornalemany.cat) + Forn l'Espiga (mateix grup), Pastisseria Fidel Serra (**`fidelserra.com`=parking SEO blanquejat**; FB/IG reals), Pastisseria Pla (cert error), Targarona (conn refused), Forn de Pa Isabel (**coords lluny→corregides**), Jaume i Vicenç (+fornjaumeivicens.com), Òscar Pastisser, Forn del Poble Sec, Carnisseria Gallego (parada Masuca), Esquius. **Parcial:** DAR Anoia→ Forn Codina=celler **ENTREBOSC** (oli/vins; **coords lluny→corregides**), Galtes Olivella=**Can Vilaseca** (lactis), Vich Sastre=**Can Vich** (vins), Casas Jorba=**NOUS** (recat→Frutos secos). Agrícola Ramadera Vinfaro SL (carn xai/cabra, venda proximitat; +adreça). Carnisseria Duran (parada Masuca sense confirmar). Chocolat-Box (**cafè de postres**, no elaborador). **2 purgas:** La Benzinera (bar/taproom street food que serveix cervesa de La Lenta, no elabora; +img esborrada), Carnisseria i Xarcuteria Esquius (dup de esquius-mercat-de-la-masuca: mateix email/web/coords). DAR Anoia candidats futurs (altres municipis): Eixarcolant (Jorba), La Beneta (Hostalets), Cigronet de Cal Farrés (Calonge), Embotits Cal Travé (Llacuna) |
| 2026-06-09 | Sant Sadurní d'Anoia 14 | 50 | 43 | 4 parcial · 3 purga | **Capital del cava**, una pasada. **Verif cava/celler con botiga propia→VO sí:** Codorníu (no comprobado: SSL al fetch), Freixenet (Club Cuvée, store oficial del grup), Juvé&Camps (shop.juveycamps.com), Recaredo (shop.recaredo.com), Raventós i Blanc (/botiga), Mestres (shop.mestres.es), Agustí Torelló/Celler Kripta (shop.cellerkripta.com; IG typo `agustilorello`→`agustitorello`), Vilarnau (tienda González Byass), Blancher, Cava Varias, Celler Vell (Estruch), Ventura Soler, Castelo de Pedregosa, Solà Raventós, Montesquius, Torre-Blanca/Llàgrima d'Or, Vins El Cep, Canals&Munné, Jaume Giró (**nombre "(Celler Kripta)" erróneo→corregit**; Pati de Cal Rei és el seu enoturisme), Mata i Coloma/Pere Mata (+web matacoloma.com). **Verif sin botiga→VO no/no comprobado:** Gramona (enoteca, sense checkout propi), Codorníu, Pere Ventura, Maria Rigol Ordi (punts de venda), Conde de Valicourt, Anima Mundi/AT Roca, Celler Credo (web→.com; Recaredo), Finca Espiells (=J&C), Mas Escorpí (=Gramona), Castellblanch (403, Freixenet group), Can Quetu (cava des de 1954, +canquetu.com), Canals & Domingo (1957, +canalsdomingo.com), Caves Soler-Jové (1985, +solerjove.com/tel/dir), COVIDES (coop, +covides.com), Unió Cellers del Noya (1982, +tel), Francisco Domínguez=**Molí Parellada** (L'Avernó), Masia Ginebreda (DO Cava, +correu). **Verif comida:** Simón Coll (xocolata 1840, shop), Forn de l'Arseni (1951, shop.calarseni1951.cat), Cal Miqueló (1896, comanda WhatsApp/tel→sí, web→.com), Camins del Nord (formatger llet crua pròpia, sense shop), Pastisseria Sant Jordi (cert error→no comprobado), Xarcuteria Rovira, Pastisseria Carafí (1926). **Parcial:** Vins per Estimar el Vi (celler real però fila amb **tel de Gramona**→blanquejat), Explotacions Agrícoles 23 (DAR ceba/calçot), Pastisseria Forn de Sant Joan (coords a **Barcelona ciutat**→corregides a SSd'A; sense altres fonts), Jaume Marra Poch (pagès Can Catassús). **3 purgas:** Cartró Parera (web=Maquinària Moderna + tel=Parera Assessors, no celler, sense DAR), Marra Poch Jaume (dup de Jaume Marra Poch, mateix correu, enllaços de Cava Giró), Cava Canals i Munné (fila buida, dup de Canals & Munné). Sense imatges òrfenes. DAR Sant Sadurní candidats futurs: Can Font de Muntanya (horta), Mas Casas Cruïlles (formatges ovella), Mir CB (embotits), Ca l'Obaga (verdura), Arboreco |
| 2026-06-09 | Vilafranca del Penedès 13 | 38 | 28 | 10 parcial · 0 purga | Capital del Penedès. **Verif web propia + VO:** Mascaró (cava/brandy, ecommerce), Pinord (shop.pinord.com OK pese a banner "gairebé a punt"), Estel d'Argent (compra per WhatsApp/tel 677182347), Mastinell (shop.mastinell.com), BeerCat (cervesa, tienda online; web 403 al fetch, confirmada per cerca), Mulet Viticultors (vi eco, botiga), Xerigots (formatger afinador, botiga.xerigots.cat), Carnisseria Vilafranca (comanda WhatsApp). **Verif sin VO:** Xarcuteries Cal Valls (obrador St Julià), Catànies Via (bombons 1977), Fleca Parés, Forn J. Rius (1922), Pastisseria Galí, Pastes La Forja (recat→Pasta artesana; possible Holacampo), Cal Vives (embotits propis; **web `calvives.com`=Moià blanq.**, img era logo de Moià dup. → esborrada), Gelats Xixona M.Mira (**web→`botigatorrons.com`**, la del CSV era la de Reus; pedido per tel), Carns Toni Vives (=Cal Toni SL), Forn de pa Mitjans, Pastisseria Bertran (100+a), Pastisseria Trens, Forn Sant Joan, Forn de Pa Casa Celis (web=IG dup blanq.). **Verif cellers DO (registre/sense web):** Trias Batlle (1932, només resellers→VO no comprobado), Tarrida i Sibil (DO Penedès), Soler Gatell (Gatell Estate/Mas Gatell), El Mas Pujó SA; Vins de Sinèrgia (Carles Morgades, projecte del Viver de Cellers, primers vins 2024, confirmat per RTV Vilafranca). **Parcial — DAR Alt Penedès→parcial:** Domènech Rovira (ROSA DOMENECH, ceba/calçot), Mascaró Figuerola (patata), Gol Llenas (POMES; web/IG/img eren **Escola Sant Josep**→netejats, img esborrada, tel→639043272). Venda proximitat (PDF gencat)→parcial: Joan Ferran Roses Vila (VP/P/0688/2013 peres/raïm; web `smp.cat`=clínica blanq., tel→609326222). Pascual Leon=**Suc de Vida** (most ecològic Daniel Pascual; web=constructora blanq., recat→Mostos y zumos)→parcial. Altres parcial: Granja Avícola Montserrat SL (1966, avícola), Forn de Pa Sant Jordi (SL "extinguida", op. actual sense confirmar), Sant Pau Coffee & Bakery (sense font forta), Obrador Russell (FB; coords ~19km errònies→corregides a Vilafranca; possible confusió amb García Sirvent), Horts Biopenedès (=lloguer d'horts per autoconsum, no venda km0). **0 purgas** (poble real ple de comerços reals). Possible dup a vigilar: Forn Sant Joan vs Pastisseria Trens (mateix C/ Sant Joan 9, tels 938920155/938820155). DAR Alt Penedès candidats futurs: Coop. Vinícola del Penedès, Marquès Ros (Cal Sis Dits, Vilobí), Pons Ametller (olives, Vilobí) |
| 2026-06-08 | Vilanova i la Geltrú 12 | 40 | 20 | 11 parcial · 9 purga | Garraf. **Verif web propia:** 7 Pams (vi eco), JövőBrew (cervesa, ecommerce), Bodega Jaume Serra (cava, ecommerce), Obrador Frumento (massa mare, ecommerce), Marendins (peixateria+salaons, ecommerce), Cornet 1945 + Canelons Pubill (botiga **demo**→VO=no), Jordi Morera/L'Espiga d'Or, Forn de la Rambla, Passions (web→.com), Forn Sant Onofre (+web), Artic Gelat. **Verif obrador/parada:** Kinkakau (web=life-coach blanq.), Pastisseria Abraham (business.site 404 blanq.), Pastisseria 180ºC, Fer.Ment (massa mare), La Pastaia (recat→Pasta artesana), Cal Tupí d'Olives (eco horta, recat→Fruta), Sínia Sant Gervasi (Remei Gimeno, web-dir blanq.), Xarcuteria Margarida. **Parcial DAR Garraf:** Borrero (Els Hortells), Celler Viticultors SAT 22, Família Torrents Sabaté, Sánchez Barbero (Vila Aurora +web), Josep Alsina (Sínia Alsina). Otros parcial: El Chalet (formatgeria francesa revén), Queso con Chocolate, Confraria Pescadors, Cansaladeries Cal Terés + Martínez, Torrents Miró (vinya). **9 purgas:** dups DAR (Gimeno Remei + Gimeno Jaume = Sínia Sant Gervasi; Alsina Soler = Sínia Alsina; Jaume Torrents = Torrents Miró) + webs cruzadas por cognom sense DAR (Antonio Ferrer=Ametller Origen, Aviño Rius=Finques Rius, Marce Sabadell=Banc Sabadell) + Anguela Rosell (sense dades) + Terres i Llars Inmobles SL (immobiliària). +1 img òrfena (Aviño). DAR Garraf candidat futur: Agrovilanova SAT (Claramunt Food Service) |
