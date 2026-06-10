# Barcelona · verificación profunda — manual + estado

> Ledger reanudable de la verificación campo a campo de `data/csv/catalunya/barcelona.csv`.
> Una sesión nueva debe poder retomar **solo con este archivo**. No es fuente de verdad: la verdad
> es el CSV (columna `verificacion`). El detalle de cada lote cerrado vive en el historial git de
> este archivo (`git log --follow -p -- docs/barcelona-verificacion.md`) y en los commits del CSV.

## Reglas duras (no negociables)

1. Evidencia > afirmaciones. No te fíes de lo que ya pone la fila: hay `sí/ecommerce`, webs, redes
   y GMaps **mal auto-rellenados**. Confírmalo o corrígelo.
2. Nunca inventes un productor ni un dato. Mejor vacío que falso.
3. Enlace que apunta a una entidad ajena = desinformación → **blanquéalo**, aunque el campo quede vacío.
4. Borra una fila solo con evidencia fuerte: sin match en registro **y** sin presencia real.
5. Un fetch fallido (SSL/http/timeout/ECONNREFUSED) **no** es un sitio muerto: confirma por búsqueda
   antes de blanquear una web.

## Estado actual (2026-06-10)

- Filas: **2.801** · verificado **738** · parcial **393** · pendiente **1.670**
  (snapshot inicial 2.973 · 35 · 16 · 2.922; **172 purgadas**).
- Modo: lote a lote bajo demanda, ~25 filas/lote, ~90 lotes estimados. **Cerrados: lotes 1-39** (worklist).
- **Siguiente: Lote 40 = Sant Feliu de Llobregat** (18 pendientes).
- Último push: lotes 1-32 en `main` (2026-06-10).

## Procedimiento (cada lote)

1. Lee este archivo entero.
2. Toma el primer municipio ⬜ de la **worklist** (más abajo).
3. Lista sus pendientes (primero los que tienen web/IG, son más baratos):
   ```bash
   python3 - <<'PY'
   import csv
   M="Manlleu"   # <-- municipio objetivo
   rows=list(csv.DictReader(open('data/csv/catalunya/barcelona.csv',encoding='utf-8',newline='')))
   p=[r for r in rows if r['municipio'].strip()==M and r['verificacion'].strip()=='pendiente']
   p.sort(key=lambda r:-((r['web'].strip()!='')*2+(r['Instagram'].strip()!='')))
   for r in p[:25]:
       print(r['slug'],'|',r['categoria'],'|',r['nombre'],'| web=',r['web'][:35])
   PY
   ```
4. Si hay filas de registro (`COGNOM1 COGNOM2, NOM` o `… SL`), haz primero el triaje DAR
   (sección "Cotejo DAR").
5. Verifica cada fila por web → sección "Decisión por fila" y "Patrones".
6. Aplica los cambios con la plantilla Python → sección "Edición del CSV". Nunca a mano fila a fila.
7. Valida: `npx pnpm check:csv:changed` y después `npx pnpm verify:data`.
8. Actualiza este archivo: bloque "Estado actual" + fila de la worklist (✅, fecha, nota de 1 línea).

## Edición del CSV

- **EOL = LF** en todos los CSV del repo (forzado por `.gitattributes`). Abre con `newline=""`.
  Comprobación final:
  ```bash
  python3 -c "b=open('data/csv/catalunya/barcelona.csv','rb').read(); print('LF ok' if b.count(b'\r')==0 else 'PROBLEMA: se ha colado CRLF')"
  ```
- Modifica **solo** las líneas cuyo `slug` está en tu lote; el resto byte-idéntico (diff pequeño,
  no pisa a otros agentes).
- Multiagente: toca solo `barcelona.csv`, este ledger y `public/productores/catalunya/barcelona/`.
  No toques `girona.csv`/`lleida.csv`/`tarragona.csv` ni `scripts/enrich-producer-images.py`.
  `git add` explícito de tus rutas; nunca `git add -A` ni `git checkout` del CSV.
- Columnas (0-based, cabecera canónica): 0 slug · 1 nombre · 2 municipio · 3 categoria ·
  4 productos estrella · 5 direccion · 6 descripcion · 7 horario · 8 telefono · 9 correo · 10 web ·
  11 Facebook · 12 Instagram · 13 Google Maps · 14 lat · 15 lon · 16 imagen · 17 verificacion ·
  18 Venta online · 19 Canal de venta.
- Contrato: `verificado` exige coords + ≥1 enlace (web/GMaps/IG/FB); `categoria` ∈ `VALID_CATEGORIES`
  de `scripts/audit-csv.js`; `telefono` E.164 (`+34…`).
- Al borrar una fila con `imagen`, borra también su `.webp` (huérfana = warning en `check:images`).

### Plantilla de edición (column-aware, EOL-safe)

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

## Decisión por fila

Comprueba campo a campo contra la fuente (web propia + ficha real de Google Maps):

- `nombre`/`municipio` coinciden con la fuente (la dirección/coords pueden delatar otro municipio).
- `direccion` + `lat`/`lon` coherentes (geo-check ≤15 km).
- `telefono`/`correo`/`web` vivos y **del productor**, no de un tercero.
- `Instagram`/`Facebook` = perfil oficial real.
- `Google Maps` apunta a su ficha, no a otro negocio.
- `imagen` = logo/imagotipo; nunca `enrich:images --apply` en bloque.
- `Venta online` + `Canal de venta` → regla de abajo.

Después clasifica:

| Lo que encuentras | Acción |
|---|---|
| Fuente primaria cuadra (web propia, ficha GMaps real, perfil oficial) | `verificacion=verificado` |
| Solo registro (DAR) o fuente secundaria; o existe pero no elabora (revende/sirve) | `verificacion=parcial` |
| No has podido revisarla | déjala `pendiente` |
| Sin rastro + sin DAR; o dup; o mal fichada (otra provincia, no productor) | **purgar** la fila (+ su `.webp`) |

## Venta online / Canal de venta

Decide por **canal de pedido online vivo HOY**:

- `sí` + canal: carrito/checkout propio → `ecommerce`; Glovo/UberEats/agregador → `marketplace`;
  pedido por WhatsApp → `whatsapp`; pedido por email/teléfono → `email`/`telefono`;
  cestas recurrentes → `suscripcion`. Varios → pipe: `marketplace|whatsapp`.
- `no`: solo web informativa, "en construcción", o solo tienda física.
- `no comprobado`: no puedes confirmarlo (p. ej. tienda caída temporalmente).
- No afirmes `sí` sin evidencia; no degrades a `no` a la ligera; corrige `sí/ecommerce` erróneos
  (visto: catálogo sin carrito marcado `sí`).
- `Canal de venta` solo cuando `Venta online=sí`; si no, vacío.

## Patrones (reconoce y actúa)

1. **Marca consolidada con web propia** → fetch web, confirma negocio + checkout → `verificado`.
2. **Solo IG / sin web** (comercio de barrio) → búsqueda confirma existencia → `verificado`,
   normalmente `Venta online=no`.
3. **Varias sedes** → comprueba a qué sede apuntan dirección + coords y corrige `municipio`.
4. **Punto de consumo, no productor** (café/bar que sirve producto de terceros) → `parcial`, `VO=no`.
5. **Web muerta vs secuestrada**: fetch falla → NO borres (regla dura 5); web carga pero muestra un
   negocio ajeno (gestoría, parked, spam) → blanquear + bajar a `parcial`/`pendiente`.
6. **Enlaces cruzados auto-rellenados** (web/IG/FB/GMaps de entidades ajenas, a menudo por apellido
   compartido) → límpialos; si además es nombre de registro → patrón 7.
7. **Fila de registro** (`COGNOM1 COGNOM2, NOM` / `… SL`) sin presencia propia → cotejo DAR.
   Match de entidad → `parcial`; sin match + sin web → purgar. Ojo a **dups registre↔marca**
   (misma persona/tel/email que una fila de marca ya existente → purgar la de registro).
8. **Mal fichada** (otra provincia, categoría imposible, sin datos) → purgar; si es real en otra
   provincia, anótalo en "Para otros agentes" sin tocar su CSV.
9. **Web obsoleta pero productor real** → actualiza la web al dominio correcto y añade redes/imagen.

## Cotejo DAR (venda de proximitat)

- Triaje rápido de un municipio: `node scripts/match-dar.mjs "<municipio>"` — cruza las filas
  `pendiente` contra el DAR por tel/email/apellidos (caza cross-municipi y dups registre↔marca) y
  lista candidatos DAR no casados. Acelera el triaje; **no sustituye** la verificación web.
- Dataset completo:
  ```bash
  curl -s "https://analisi.transparenciacatalunya.cat/resource/xmyy-7xqi.csv?\$limit=5000" -o /tmp/dar.csv
  ```
  Columnas útiles: `nom_productor` (`COGNOM1 COGNOM2, NOM`), `nif`, `adreca`, `municipi`, `comarca`,
  `productes`, `tel_fon`, `correu`, `marca_comercial`.
- Grep **normalizando acentos**; exige match de entidad (apellidos **y** municipi), no solo apellido.
- Match DAR = existe (→ `parcial`), **no** prueba venta online. Aprovecha para corregir
  tel/correo/productos/marca con los datos oficiales.
- No constar en el DAR no prueba inexistencia (registro voluntario); pero sin DAR **y** sin web
  propia, justifica la purga.

## Worklist (pendientes por municipio)

Leyenda: ⬜ pendiente · 🟨 en curso · ✅ hecho. Cifras de municipios sin tocar = snapshot inicial.

| # | Municipio | Pendientes | Estado | Fecha | Notas |
|---|---|---|---|---|---|
| 1 | Barcelona - Eixample | 0 | ✅ | 2026-06-07 | 29 verif + 4 parcial (DAR); 9 purgadas |
| 2 | Barcelona - Ciutat Vella | 0 | ✅ | 2026-06-07 | 30 verif + 1 parcial (DAR); 4 purgadas |
| 3 | Barcelona - Gràcia | 0 | ✅ | 2026-06-07 | 27 verif + 4 parcial; Exalta→Sant Antoni de Vilamajor |
| 4 | Barcelona - Sant Martí | 0 | ✅ | 2026-06-07 | 20 verif + 5 parcial; 2 purgas (dup, bar) |
| 5 | Barcelona - Sants-Montjuïc | 0 | ✅ | 2026-06-07 | 11 verif + 7 parcial; 5 cluster purgadas |
| 6 | Barcelona (resto) | 0 | ✅ | 2026-06-08 | ~96 verif/parcial + 17 purgas (cluster DAR 6d) |
| 7 | Terrassa | 0 | ✅ | 2026-06-08 | 30 verif + 27 parcial; 0 purgas |
| 8 | Sabadell | 0 | ✅ | 2026-06-08 | 24 verif + 19 parcial + 2 purgas |
| 9 | Mataró | 0 | ✅ | 2026-06-08 | 29 verif + 17 parcial + 4 purgas |
| 10 | Manresa | 0 | ✅ | 2026-06-08 | 21 verif + 11 parcial + 13 purgas (5 dups registre↔marca) |
| 11 | Vic | 0 | ✅ | 2026-06-08 | 30 verif + 9 parcial + 7 purgas; capital d'embotits |
| 12 | Vilanova i la Geltrú | 0 | ✅ | 2026-06-08 | 20 verif + 11 parcial + 9 purgas; webs cruzadas por apellido |
| 13 | Vilafranca del Penedès | 0 | ✅ | 2026-06-09 | 28 verif + 10 parcial + 0 purgas |
| 14 | Sant Sadurní d'Anoia | 0 | ✅ | 2026-06-09 | 43 verif + 4 parcial + 3 purgas; capital del cava |
| 15 | Igualada | 0 | ✅ | 2026-06-09 | 23 verif + 7 parcial + 2 purgas |
| 16 | Badalona | 0 | ✅ | 2026-06-09 | 23 verif + 5 parcial + 3 purgas; Anís del Mono recat |
| 17 | Sant Boi de Llobregat | 0 | ✅ | 2026-06-09 | 10 verif + 15 parcial + 9 purgas; Parc Agrari, 4 dups |
| 18 | Sant Cugat del Vallès | 0 | ✅ | 2026-06-09 | 20 verif + 5 parcial + 1 purga |
| 19 | Moià | 0 | ✅ | 2026-06-09 | 9 verif + 24 parcial + 5 purgas; DAR Moianès |
| 20 | Caldes de Montbui | 0 | ✅ | 2026-06-09 | 10 verif + 16 parcial + 5 purgas; 2 dups registre↔marca |
| 21 | Piera | 0 | ✅ | 2026-06-09 | 12 verif + 12 parcial + 4 purgas |
| 22 | Subirats | 0 | ✅ | 2026-06-09 | 11 verif + 14 parcial + 3 purgas; estreno match-dar.mjs |
| 23 | Tordera | 0 | ✅ | 2026-06-09 | 6 verif + 16 parcial + 6 purgas |
| 24 | Berga | 0 | ✅ | 2026-06-09 | 10 verif + 14 parcial + 1 purga |
| 25 | Vilassar de Mar | 0 | ✅ | 2026-06-10 | 10 verif + 9 parcial + 5 purgas; clúster floricultors DAR |
| 26 | Viladecans | 0 | ✅ | 2026-06-10 | 9 verif + 11 parcial + 3 purgas; Parc Agrari |
| 27 | Manlleu | 0 | ✅ | 2026-06-10 | 17 verif + 4 parcial + 1 purga; cancerilles.com secuestrada, fila Capdevila contaminada con CF Ametlla |
| 28 | Castellbisbal | 0 | ✅ | 2026-06-10 | 11 verif + 7 parcial + 3 purgas (2 dups registre↔marca; Quitxalla = vi de Ca l'Esteve) |
| 29 | Prat de Llobregat | 0 | ✅ | 2026-06-10 | 10 verif + 7 parcial + 8 purgas; 5 dups registre↔marca, 3 filas ajenas/no productor |
| 30 | Masnou | 0 | ✅ | 2026-06-10 | 15 verif + 4 parcial + 1 purga; Aurora dup, Botànic→Argentona |
| 31 | Arenys de Munt | 0 | ✅ | 2026-06-10 | 9 verif + 8 parcial + 2 purgas; dups Talcomraja y AgroSalichs |
| 32 | Cardedeu | 0 | ✅ | 2026-06-10 | 9 verif + 5 parcial + 5 purgas; 3 dups, Ferro→Tremp, Mercat Vallès extinguida |
| 33 | Garriga | 0 | ✅ | 2026-06-10 | 13 verif + 1 parcial + 5 purgas (dup Nualart, Latorre/Pérez ajenas, par O. Prats); Can Viver (Bigues) verificada de rebote |
| 34 | Molins de Rei | 0 | ✅ | 2026-06-10 | 7 verif + 6 parcial + 6 purgas; 3 dups registre↔marca (Fisas→Can Fisas, Figueras→La Pagesa, Cuscó×2); lapagesa.es secuestrada→lapagesa.cat |
| 35 | Rubí | 0 | ✅ | 2026-06-10 | 11 verif + 5 parcial + 3 purgas (Milà cerrada 2022+SL extinguida, Cal Tastet y Mas Jornet sin rastro); Montse→Coques Tastet (rebranding mismo local/tel) |
| 36 | Sant Celoni | 0 | ✅ | 2026-06-10 | 12 verif + 3 parcial + 4 purgas; dup Armora→Ous del Mas; mercat con pedidos online (delmercatacasa diba) |
| 37 | Sant Martí Sarroca | 0 | ✅ | 2026-06-10 | 10 verif (6 cellers, 4 ecommerce) + 4 parcial DAR + 5 purgas (dup Torres→Pacs, Galimany=coop Covides, Tuyà=casa rural, Mata Coll y Cuevas ajenas); Jovani→Castellví de la Marca |
| 38 | Cabrera de Mar | 0 | ✅ | 2026-06-10 | 8 verif + 7 parcial + 3 purgas (dup Ribosa, Vinyals=ornamental, "De Mar"=artefacto); Cal Mamà rescatada de links Badalona/Flax&Kale |
| 39 | Gavà | 0 | ✅ | 2026-06-10 | 7 verif + 9 parcial + 2 purgas (Estapé Figueras dup↔Hort de Proximitat SLU, Taberner sin rastro); marcas DAR recuperadas (Parada del Camí Ral, Horta amb Alegria) |
| 40 | Sant Feliu de Llobregat | 18 | ⬜ | | |
| — | _resto (336 municipios)_ | 1.652 | ⬜ | | recomputar al llegar |

## Candidatos futuros (vistos en el DAR, no integrados)

Productores reales del DAR detectados al cerrar cada municipio; integrarlos solo tras verificación
(protocolo de AGENTS.md). No son cola obligatoria.

- **Manresa/Bages:** AMPANS/Urpina · Calafell (Can Calafell) · CCAgrària (Can Poc Oli)
- **Vic/Osona:** Apícola Morató (Mel Morató) · Pujalt Quero (Xai Torrents del Prat) · Tarres Alcalde (L'Esquellot del Montseny)
- **Badalona:** Abellan Moya (vins) · Conreu Sereny SCCL (horta)
- **Sant Boi:** Central Parc del Baix Llobregat SCCL
- **Sant Sadurní d'Anoia:** Can Font de Muntanya (horta) · Mas Casas Cruïlles (formatges ovella) · Mir CB (embotits) · Ca l'Obaga (verdura) · Arboreco
- **Anoia:** Eixarcolant (Jorba) · La Beneta (Hostalets) · Cigronet de Cal Farrés (Calonge) · Embotits Cal Travé (Llacuna)
- **Alt Penedès:** Coop. Vinícola del Penedès · Marquès Ros (Cal Sis Dits, Vilobí) · Pons Ametller (olives, Vilobí)
- **Garraf:** Agrovilanova SAT (Claramunt Food Service)
- **Subirats:** Castell de Subirats SA · Heretat Guilera SL · Mas Gori · Ràfols Vendrell (Cal Pau Jan)
- **Piera:** Borràs Puiggròs (préssecs) · Vallverdú Garriga Roser (oli)
- **Caldes de Montbui:** Vicente López Pablo (horta)
- **Moianès:** Vins Colltor + Celler Sant Miquel (Sta Maria d'Oló) · La Cabreria/Bardissa (formatges, Oló) · Granja La Bassola (Castellterçol)
- **Tordera:** Colldeforns Soler · Llavina Parés (Horta Llavina) · Jordi Manresa (farines) · Ramaderia Can Thos (llet) · Lluís Sagrera (patata)
- **Vilassar de Mar:** Agrícola de Vilassar de Mar SCCL (coop 1918, agrobotiga)
- **Viladecans:** Heretat Mas Tinell (vins) · Vilaeco SL · Ximalls SAT
- **Castellbisbal:** Celler Ca l'Esteve (vins DO Catalunya; "Quitxalla" es su marca, fila purgada)
- **El Masnou:** Jordana Ribas SL (Jordi Jordana Maresme; horta)
- **Cardedeu:** SAT Can Roger (llet ecològica; Agrobotiga La Païssa)
- **Sant Martí Sarroca:** Greenhort SCP (horta) · Molí de Calabuig SL (olives/ordi) · Ràfols Baqués Josep (conserves) · Vidal Bolet Jesús (fruita/horta) · Cellers Montserrat (vins)
- **Cabrera de Mar:** Cultius Jaume's Noe SCP (horta, DAR) · Roig Vins (celler i botiga gourmet nova)
- **Gavà (Mercat de Pagès):** Cal Xim Xim (Mauri Bosch, 30 ha) · Vila Eco by Enric ECO (Xavier Estrada) · Can Arenols (des de 1979) · Ivern Borrut Josep (DAR)

## Para otros agentes / a vigilar

- Tarragona: `bodega-el-grial-sl` (bodega real de El Perelló) se purgó de Barcelona; candidata a
  `tarragona.csv`.
- Vilafranca: posible dup Forn Sant Joan vs Pastisseria Trens (mismo C/ Sant Joan 9).
- Girona: **Hort Viu** (hortviu.com, verdura eco, Les Planes d'Hostoles/Cogolls, Garrotxa; cistelles +
  mercat KMOsona de Manlleu) — real, candidata a `girona.csv`; se purgó de Manlleu la fila de registro
  "Macia Parris, Maria del Mar" que llevaba su email.
- Lleida: **Ferro Falgueras, Francesc Xavier** figura en el DAR actual como productor de miel de
  Tremp; se purgó la fila contaminada de Cardedeu y queda como candidato para `lleida.csv`.

## Historial

El detalle por lote (qué se verificó, qué se purgó y por qué) se registró aquí hasta el lote 26 y
está en el historial git de este archivo: `git log --follow -p -- docs/barcelona-verificacion.md`.
Desde ahora, cada lote cerrado deja solo su línea en la worklist; la evidencia fina va en el mensaje
de commit del lote.
