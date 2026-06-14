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

## Estado actual (2026-06-14)

- Filas: **2.653** · verificado **1.186** · parcial **553** · pendiente **914**
  (snapshot inicial 2.973 · 35 · 16 · 2.922; **320 purgadas**). Verificadas > pendientes desde el lote 85;
  pendientes por debajo de 1.000 desde el lote 95.
- Modo: lote a lote bajo demanda, ~25 filas/lote, ~90 lotes estimados. **Cerrados: lotes 1-102** (worklist).
- **Siguiente: Lote 103** — empatados a 9 pendientes: Sant Joan Despí / Sant Just Desvern /
  Santa Maria d'Oló / Sentmenat / Tiana (elegir uno; recomputar al llegar).
- Ojo: el CSV mezcla "Bigues i Riells" y "Bigues i Riells del Fai" (nombre oficial desde 2021) como municipios distintos; unificar grafía en una pasada futura.
- Último push: lotes 1-100 en `main` (2026-06-13).

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
| 40 | Sant Feliu de Llobregat | 0 | ✅ | 2026-06-10 | 9 verif + 4 parcial + 5 purgas (3 dups internos: Cordú↔Cortès, Saladrigas×2, Ollé Palet×2; Piñol y Blanco sin rastro); elspagesos.com=music bar blanqueada |
| 41 | Sant Pere de Ribes | 0 | ✅ | 2026-06-10 | 13 verif + 0 parcial + 4 purgas (Puig Batet SL y Ferret Mestre dups registre↔marca, Bartra i Roig=empresa de Vega de Ribes, Can Miret=patrimonio); Greco→Charcutería+ecommerce; Horta Casetes coords en Garraf corregidas; bouquetdhort.com→tienda Grupdem |
| 42 | Torelló | 0 | ✅ | 2026-06-10 | 12 verif + 2 parcial + 3 purgas (Ojeda dup de La Mel d'en Pere por tel; Calverons y Simon Font sin rastro, este con web de librería); Racó del Panarra→Vic (marketplace OsonaTerra), Postres Masgrau→Sant Vicenç de Torelló; flecaxanat.com parked |
| 43 | Granollers | 0 | ✅ | 2026-06-10 | 11 verif + 2 parcial + 3 purgas (Ortega Puigoriol links de hospital/BM, Ca Puxi web de camping + GMaps Aluminios, Torrents GMaps farmacia); Tòfona Catalana datos propios restaurados (tenía Fonda Europa/Tributària); 5 ecommerce (Jijonero, Xocolates, Crit d'Or, Krüm, Tòfona) |
| 44 | Santa Coloma de Gramenet | 0 | ✅ | 2026-06-10 | 14 verif + 0 parcial + 2 purgas (Pardes y Hervas, basura enlazada por email con links de mercería); forndepapadro.com era el forn de Nou Barris→blanqueado; 6 con venta (Paredes/Sant Ramon/Dulciurile whatsapp, TotCarbó tel, Glass ecommerce, Colombia ecommerce+Glovo) |
| 45 | Castelldefels | 0 | ✅ | 2026-06-10 | 13 verif + 2 parcial + 0 purgas; 8 con venta online (Right Side suscripción, Finca/Lara/BlackCake/CasaBlanca/Luciérnaga/Zitarrosa/PaulaFranco ecommerce, Hache whatsapp); Arenols→Can Arenols (pagès Parc Agrari, links+imagen de ATROZ gastrobar limpiados); Pañella=DAR Mercabarna |
| 46 | Esparreguera | 0 | ✅ | 2026-06-10 | 10 verif + 3 parcial + 2 purgas (Alves Pardo sin rastro; Jorba Comelles fusionado en fila única del forn, obrador central 1890 con pedidos online); Caviaroli y Cal Ferran ecommerce; Boletruff=distribuidor micológico (parcial); Serra Xarcuters obrador en Martorell |
| 47 | Palafolls | 0 | ✅ | 2026-06-10 | 9 verif + 3 parcial + 3 purgas (dups Can Tortós↔Cultius SL y Petit Pla↔Recent Fet i Llest fusionados; Alenyà sin rastro); Horta Soms rescatada (web propia, GMaps de Casa Oms restaurant blanqueado); GMaps ajenos en Maria Riera (estética) y Pol Riera (Riera Car) |
| 48 | Prats de Lluçanès | 0 | ✅ | 2026-06-10 | 9 verif + 1 parcial + 5 purgas (3 filas Soler fusionadas en "El Soler de n'Hug"; Busoms dup de Noir et Blanc; Joan Vall=Casal del Jovent del ajuntament; Capdevila sin rastro); Noir et Blanc y Olivas Caseras ecommerce; coords Noir et Blanc apuntaban a Vic |
| 49 | Arenys de Mar | 0 | ✅ | 2026-06-10 | 12 verif + 1 parcial + 2 purgas (Rossell=Sóc Pagès y Saurí=Can Terrades, dups registre↔marca por email); Horta Moragas (90 años, mercat) con GMaps de vil·la ajena; Juanitas coords en St. Iscle corregidas; Salvà Cot y Juanitas encàrrecs tel |
| 50 | Argentona | 0 | ✅ | 2026-06-10 | 9 verif + 3 parcial + 2 purgas (SAT 5188 genérica; Garriga solo existe en Mataró); Can Valls 200 años (IG de restaurant blanqueado); La Nansa con web/GMaps/imagen de La Sala municipal→limpiados, web real lanansa.cat; Castañé=botiga vins naturals (parcial); Fleca Casas whatsapp, Tastets email |
| 51 | Avinyonet del Penedès | 0 | ✅ | 2026-06-11 | 8 verif + 2 parcial + 4 purgas (Cal Jeroni=agroturisme, Jeroni Cuscó=Materials Cuscó, Marcé Casas Joan=restaurant Can Joan La Curva, Esteve Lloret dup↔Préssec d'Ordal); Artcava y Caves Avinyó rescatadas con web; 4 ecommerce (Artcava, Avinyó, Cuscó Berga, Mas Comtal) |
| 52 | Centelles | 0 | ✅ | 2026-06-11 | 9 verif + 3 parcial + 2 purgas (Capdevila=fila contaminada con escola Carles Capdevila; Oliver Oliva dup↔Pla de la Garga por email DAR); Pla de la Garga era pollastres eco en St. Martí de Centelles (no formatgeria); Mas Calm→Mas Agrobotiga, Rovira→Mas Vinyoles (vedella, VO email|tel); La Lola web lalola.cat |
| 53 | Olesa de Montserrat | 0 | ✅ | 2026-06-11 | 10 verif + 2 parcial + 2 purgas (Campos Sarroca dup↔Cal Campos/E.Campos; Magí Tobella sin DAR ni rastro, links de manicura/mago); Petras→Bolets Petràs, Jobé→Fruites Jobé (FB); lallimona.es parked blanqueada; molí d'oli=Fundació+SAT Palomar (Oulesa), ambas reales; VO ecommerce falso de Cansaladeria Montserrat corregido |
| 54 | Pineda de Mar | 0 | ✅ | 2026-06-11 | 7 verif + 4 parcial + 3 purgas (Esparza=links del ajuntament/Endesa, Casas Zambrano y Cassola sin rastro); Vitae Kombucha y Alatria ecommerce; Mallol/Piponas/Sonia Aurea encargos whatsapp; Màrquez Horticultors→Calella (DAR+CCM); Bio Prasad VO marketplace (Pagesia a Casa); coop "el Sindicat" verificada |
| 55 | Sant Vicenç dels Horts | 0 | ✅ | 2026-06-11 | 7 verif + 5 parcial + 2 purgas (López Aymeriich dup registre↔marca de Pilar la Pagesa; Badosa=GMaps del RC Tennis BCN, sin rastro); Cal Pocoll y Cal Reverter rescatadas con ficha Parc Agrari (tel/email coinciden); Cal Rosset cistelles email|suscripcion; Can Coll=B2B pa ultracongelat; Saperas sin venda directa (coop+Mercabarna) |
| 56 | Sitges | 0 | ✅ | 2026-06-11 | 12 verif + 0 parcial + 2 purgas (Celler Güell=edifici Gaudí amb restaurant tancat, no productor; Rull Rentero=web rent-a-car + GMaps de masajista, sin rastro); 5 con venta (Celler Hospital/Sitgetana/Wylie ecommerce, Järvi email|tel, Moreno a domicilio); Forn 9 web propia añadida; sencies.com 403=bot-block, viva |
| 57 | Barberà del Vallès | 0 | ✅ | 2026-06-11 | 12 verif + 1 parcial + 0 purgas; 5 con venta (Barberenca y Solé ecommerce, Casa Ramírez whatsapp|tel, Gasull&Claramunt tel); Groots coords de Martorell corregidas + web groots.eco; Eva=parada real del mercat con GMaps de la parada Montse blanqueado; webs de terceros (untappd, gastroteca, FB del mercat) blanqueadas |
| 58 | Granollers (Palou) | 0 | ✅ | 2026-06-11 | 3 verif + 8 parcial + 2 purgas (Can Mariné dup interno fusionado; F.X. Tor sin rastro ni en la lista Palou); Can Pep Julià (1r pollastre eco CCPAE de Granollers, web añadida) y Mel l'Abella Reina (GMaps de Dolça Abella/Girona blanqueado, coords corregidas) verificadas; parciales contrastados con la lista oficial Productes de Palou; Catafal salvado por el documental 'Flor i tavella' |
| 59 | Gurb | 0 | ✅ | 2026-06-11 | 10 verif + 1 parcial + 2 purgas (Parés Codina=datos del Eixample BCN sin rastro; Dcaseco dominio caído y cero huella); El Circell (DAR omitido por el matcher) y Botanic&Fruits ecommerce; Botanic→Vic y Mas Jalech→Balenyà (sedes reales); Plana de Vic compra por whatsapp; Alonso Bofarull=marca Els Felius (parcial) |
| 60 | Lliçà d'Amunt | 0 | ✅ | 2026-06-11 | 9 verif + 2 parcial + 2 purgas (Canadell Parera dup registre↔marca de Horta Canadell, dirección de la ferretería; Gassó 1885=quimera con web/IG de la pastelería homónima de Granollers); Tarabal VO whatsapp (no ecommerce); fila Clúster→Reptilian Brewery (fàbrica a Can Malé, datos del clúster blanqueados); Can Quimet Gall y Can Joans (DAR) verificadas |
| 61 | Palau-solità i Plegamans | 0 | ✅ | 2026-06-11 | 7 verif + 5 parcial + 1 purga (mercat setmanal=equipamiento, no productor); 3 filas DAR limpiadas de links de Generali/parroquia/clínica (Duran, Rios, Perramon); La Rostisseria de Palau→La Teka de Palau; Rosa Mari viva (GMaps "Cerrado" basura blanqueado); Grau Vila=botiga de la fàbrica de Barberà |
| 62 | Sallent | 0 | ✅ | 2026-06-11 | 5 verif + 4 parcial + 4 purgas (Guitart Luis dup↔SLU con links del Hotel Guitart; Agrofresc dup↔La Torre, misma masía/email; Aguilera y Viorica sin rastro); Celler Sanmartí (web .cat real) y Casa Coll=SAT N 1077 (huevos, web propia) renombradas; Els Ous de l'Oriol con web; Ànima Essències ecommerce confirmado |
| 63 | Santa Coloma de Cervelló | 0 | ✅ | 2026-06-11 | 5 verif + 5 parcial + 3 purgas (Cal Rajoler y Ribas Pau dups↔Fruits Olivé SCP por email/tel DAR; Pere Tugas registro dup↔Les Marines con web del CB Montpedrós); Morral limpiado del restaurante Racó de Can Valentí; Cal Cabré FB propio; coords ajenas (Tiana/Vallès) corregidas a centroide |
| 64 | Taradell | 0 | ✅ | 2026-06-11 | 7 verif + 4 parcial + 2 purgas (Cabanas Sola dup↔Mas Casablanca; Cellviosona sin rastro + GMaps de Triskel Telecom); Casa Oms→Balenyà; Vilamala con web carniquesvilamala.com; Mas Casablanca=masia-museu (no xarcuteria); Exeo Ipsum=marca Les Seviques; El Reguer y El Genero parciales DAR (Carne) |
| 65 | Torrelavit | 0 | ✅ | 2026-06-11 | 9 verif + 1 parcial + 3 purgas (Can Nadal dup↔Nadal; J. Lluc dup↔Vinya Escudé de St. Quintí ya en CSV; Font Estruch=viticultor sin marca vendible); 6 ecommerce (Nadal, Naveran, Segura Viudas, Joan Segura, Molí Parellada, Cal Cisco+whatsapp); Alemany Duran limpiado de links de la UPC (era oli/fruita, no bodega) |
| 66 | Castellfollit del Boix | 0 | ✅ | 2026-06-11 | 4 verif + 7 parcial + 1 purga (Vins Grau dup↔Celler Grau i Grau, mismo tel/web); Cal Callu=Ous de Maians (llevaba web/redes/imagen de Cal Jep); Venys con tel/web de Formatges Cuirols del Berguedà limpiados; Cal Jep→Caracoles (VO whatsapp); Obiol=apicultora Cal Meler; associació mongeta parcial con venta directa |
| 67 | la Roca del Vallès | 0 | ✅ | 2026-06-11 | 3 verif + 6 parcial + 3 purgas (3 dups registre↔marca: Martínez Rus↔Mel de la Roca, Pont Cullell↔Can Jep, Grau Ganduxé con web de Grau Maquinària); Milfulls verificado (GMaps de la pastisseria homónima de St. Cugat blanqueado); In·Vita=vi kosher DO Alella de Solar del Líbano, parcial con ecommerce; coords de Palamós/Girona corregidas |
| 68 | Sant Quirze del Vallès | 0 | ✅ | 2026-06-11 | 8 verif + 3 parcial + 1 purga (2º local de Pastisseria Mix fusionado en la fila del obrador); Xarcuteria Marta VO ecommerce|whatsapp y Pa i Punt VO whatsapp; La Julita con GMaps de Mahalo Coffee blanqueado; Oliva Folgueiras (DAR) limpiado del Restaurant L'Oliva |
| 69 | Begues | 0 | ✅ | 2026-06-11 | 6 verif + 1 parcial + 4 purgas (Rusc d'Or dup↔FR Apicultors y Marlet dup↔Vendrell Viñas, ambos por DAR; Cal Banato y Monmany sin rastro, este con links de escola); Marcel ecommerce confirmado; Montau de Sadurní VO marketplace (wirwinzer.de); Forn Núria en guía municipal |
| 70 | Castellar del Vallès | 0 | ✅ | 2026-06-11 | 3 verif + 4 parcial + 4 purgas (Domínguez dup↔Horta Can Manent por DAR; Soler Mir=coach con web propia ajena al campo; La Mel y Can Pèlacs sin rastro); Gercasa rescatada vía DAR (datos de un Gercasa SL de BCN blanqueados); Farré→Ecogranja La Roca (St. Llorenç Savall); El Sabater Vell confirmado por el mapa agroecològic de l'Ateneu |
| 71 | Castellví de la Marca | 0 | ✅ | 2026-06-11 | 6 verif + 2 parcial + 3 purgas (SAT Mas Lluet dup↔Caves Bolet por email; Sole&Gallego=registro DAR de L'Hort de la Carmeta con links de Sol Group; Roses Alsina sin rastro y GMaps de Alsina&Sardà); 3 ecommerce (Bolet, Carmeta, Aymar→aymarwines.com); Olivella=Masia Ca la Gori (DAR) |
| 72 | Cerdanyola del Vallès | 0 | ✅ | 2026-06-11 | 11 verif + 0 parcial + 0 purgas; 5 con venta (Chocoletters, Ecopizza, Pekatum ecommerce; Montse y Fleca el Molí via botiga online del Mercat de Serraperera=marketplace, paradas confirmadas en la plataforma); Superbloom Wines real con distribución internacional; Jaleo con GMaps de "Bee Love" blanqueado |
| 73 | Cubelles | 0 | ✅ | 2026-06-11 | 7 verif + 2 parcial + 2 purgas (Carreras Massó sin rastro con GMaps de la UAB; Forn Soler dup↔Casas, mismo tel y GMaps); Delicati VO whatsapp|email; Verdures Carreras→Vilanova (parada del Mercat del Centre); Peixateria Mar=punto de venta (parcial) |
| 74 | Font-rubí | 0 | ✅ | 2026-06-11 | 9 verif + 1 parcial + 2 purgas (Castell de Grabuac dup societario↔Can Suriol; El Mas 1770 dup↔Molí d'Oli Lluch por email); 7 ecommerce (Suriol, MontRubí, U Més U, Moió, Ca la Madrona, Ferret Guasch +Lluch pendiente cert); Vinares 1909 con FB de Família Ametller blanqueado y grafía Font-Rubí normalizada; Molinaris=Cal Guarda (DAR) |
| 75 | Llinars del Vallès | 0 | ✅ | 2026-06-11 | 5 verif + 4 parcial + 2 purgas (Casa Farré Nou y Christian Ferrero sin rastro); Barcelona Beer Company ecommerce; Can Colomer=marca Ple de Verd (coop Tres Terres, BCN Agrària); Payetas con datos DAR; Novell=Can Clavell; GMaps ajenos (Can Corder de Osona, Casa Pratginestós, Centre Cívic, Can Pins) blanqueados |
| 76 | Malgrat de Mar | 0 | ✅ | 2026-06-12 | 5 verif + 3 parcial + 3 purgas (Fors Campeny y Verdures Gelat sin DAR ni rastro, este con GMaps de Verdures Malgrat de Blanes; Arias Homs dup registre↔marca d'El Tros de l'Uri) + purga extra Horta Soms (Josep Soms)/Palafolls, dup de la marca de Malgrat (web sitúa l'horta al Pla de Grau); El Tros de l'Uri ecommerce (eltrosdeluri.cat); ST ROCH activa 2025 pese a cierre registral SL, GMaps de The Anchor blanqueado; Botigueta whatsapp|tel|email; Massaguer ficha Espai Agrari Baixa Tordera |
| 77 | Martorell | 0 | ✅ | 2026-06-12 | 8 verif + 1 parcial + 2 purgas (Tio Arnaus dup registre↔marca de Cal Tió, misma dirección Mur 85; parada Serra del Mercat Les Bòbiles no figura en la web actual de Serra, fusionada en la fila del obrador +.webp borrado); Cal Tió con GMaps de Casa Tió/Unió Integral Alimentària y coords de Cardedeu corregidos; Vira Brands SL extinguida→renombrada Kokoa Origens (sucesora, grupo PCS, mismo Monturiol 5); Chellaf=La Merienda; VO: Dulce Emy y Can Rosell ecommerce, Grau whatsapp|email, Armand marketplace (Too Good To Go) |
| 78 | Mollet del Vallès | 0 | ✅ | 2026-06-12 | 1 verif + 7 parcial + 3 purgas (Teruel Aragones "Bodega"=quimera con links de la recicladora Santos Jorge SA y email de La SAO; Pilar Boada con links de coach PNI + IG de empanadas; Magdalena Ferrer con links de la psicóloga Gemma Ferrer — los 3 .webp borrados); zona Gallecs: La SAO, EGAM Gallecs, Molist Vila (Can Xambrers), Molist Sanz, López Barreto parciales DAR con links de restaurante/escola blanqueados y datos DAR restaurados; Altayó-Ripoll=Altayó Ros Carnissers (mismo tel) verif; Ràfols (parades 70-71) y Floreta parciales, mercat online aprop.online migrado a niar.app (VO no comprobado) |
| 79 | Papiol | 0 | ✅ | 2026-06-12 | 4 verif + 2 parcial + 5 purgas (Figueras Garriga Pere dup registre↔marca de Cal Figueras con links del bufete figueras.legal; Jaume Olivé Parra dup persona↔marca de La Vinya de Can Font; Mongetes creperia sin rastro con links de 3 negocios distintos; ELADIET=solo complementos dietéticos, no productor agroalimentario; AGRI-MA sin DAR ni rastro con datos de BCN); Batzachs rescatada: microceller 1920 de Anna Estruch, web batzachs.cat ecommerce; Cal Figueras verif (catàleg Collserola+IG propio, venda a domicili→tel); Can Font parcial enriquecida (Jaume Olivé, Rebrot Pagès); GMaps ajenos blanqueados (Casa Evarist Juncosa, Cal Figueres del Penedès, Instal·lacions Pellicer) |
| 80 | Sta. Margarida i els Monjos | 0 | ✅ | 2026-06-12 | 5 verif + 4 parcial + 2 purgas (Llobet Guix dup registre↔marca de Mel Castell de Penyafort; Oliest sin rastro y con GMaps de D'Oliciós, marca ajena); Mel Penyafort verif con web/FB/IG propios (Xavier Llobet, des de 1979); Mallofré=Vins Mallofré (Masia La Sanabra, 1898, DO Penedès eco; VO marketplace via Clubdevins/Plataforma Ecològica); Soler Guillen=Cal Vicari (serveis vitícoles, web propia); Agro-Freixedes=Can Amadeu (oli, DAR); Forn Valls (La Ràpita), Forn Esplugas i 4 Barres verif; Espitlles parcial (gastroteca, raça penedesenca); GMaps ajenos blanqueados (punt d'info turística, assessoria, castell-monument, Freixedas Vinícola) |
| 81 | Seva | 0 | ✅ | 2026-06-12 | 5 verif + 3 parcial + 3 purgas (Molins Sala dup registre↔marca de Pollastre del Montseny; Casasas Matabacas dup persona↔marca de Mel Llàgrimes de Ra con links de la botiga del club UE Sant Andreu y VO ecommerce falso; Molins Ferrer="pagès i renda cotxes" en la guia municipal, sin producto, productos inventados); Muns Criville→Casanova de Figarolas (vedella Angus, web propia, VO tel; llevaba links de Las Muns empanadas BCN, .webp borrado); Pollastre del Montseny verif con web propia (VO ecommerce|whatsapp; GMaps del Pollastre de pagès de Centelles ajeno blanqueado); Viubé=Granjas Ecológicas SLU (ecommerce confirmado); ERRE de Vic y Fleca Pujadas verif; Can Bullit parcial (SL en liquidació, obrador des de 1959); Cabrum Les Tres Torres parcial DAR (GMaps d'assessoria blanqueado) |
| 82 | Torrelles de Foix | 0 | ✅ | 2026-06-12 | 5 verif + 3 parcial + 3 purgas (Civill Miret dup persona↔marca de Can Cruset por email DAR; Canals Marimon fusionado en Cal Xullat —misma dirección/web/tel, su oli DAR anotado en la fila—; Escofet Romagosa quimera con links de Esco Fresc de St. Joan Despí); Formatge Bages=Làctics Foix (granja 80 vaques, botiga, IG; iogurt Km0 a Bonpreu); Can Cruset verif (agroturisme + oli eco DAR, recategorizado Aceite); Cal Xullat verif (cansaladeria+estanc+queviures, embotits propis); Can Pardo verif con web propia; Josep Masachs verif pero VO sí/ecommerce falso corregido a no (web sin carrito); Figueras Comas=Penedès +500 parcial (links de Figueras Legal otra vez, .webp borrado); Vives Marti=Ca la Sisca (préssecs, no Bodega) |
| 83 | Torrelles de Llobregat | 0 | ✅ | 2026-06-12 | 4 verif + 3 parcial + 4 purgas (3 dups registre↔marca: Molner↔Forneret mismo tel/web, García Molina↔Cireres Bernabé Santi y fila duplicada de Fruits Montmany con .webp de campo genérico borrado; Font Vendrell era el registro de Can Balasch contaminado con datos de Torrelles de FOIX); Cireres Bernabé Santi ecommerce (botiga thecommerce.es); Forneret verif (forn eco des de 1918); Can Balasch verif con web canbalasch.cat (IG del restaurant Can Balasch de Baix —negocio ajeno— blanqueado); Ous de Can Reinal parcial (granja eco en guías de turisme); GMaps ajenos blanqueados (Ruta Can Roig, Botiga Ca La Maria, Riera Arquitectes) |
| 84 | Ullastrell | 0 | ✅ | 2026-06-12 | 6 verif + 4 parcial + 1 purga (Amat Mercader dup registre↔marca de Cal Masvalls: el tel DAR es el de la parada del Mercat de la Independència); Can Morral del Molí verif (web cellercanmorral.cat 403=bot-block; vi Martialis + oli becaruda; VO marketplace via aguita.club); Els Campaners verif (CSA con carrito → ecommerce|suscripcion; DAR Elena Simó); La Botiga d'Ullastrell (coop 1939, molí en marxa) y Mató d'U/Granja Núria verif — grupo MIM detrás de ambas (MIM Foods/MIM Cheese); Avícola Lleonart y Forn Josep Puig verif; Fruites Xavi/Can Rodó y Cal Masvalls parciales (parades en Terrassa, web mim-foods y GMaps ajenos blanqueados; VO sí/ecommerce falsos corregidos); El Jardí de Collbarra reubicada a Sant Llorenç Savall (DAR Thomas Andrieu, horta no mel) |
| 85 | Badia del Vallès | 0 | ✅ | 2026-06-12 | 7 verif + 2 parcial + 1 purga (Xarcuteria CCC sin rastro tras 2 búsquedas y GMaps de la Carnisseria Cristina Ramacisa, negocio distinto); municipio sin campo: todo paradas del mercat y obradores urbanos, 0 DAR; Moreno Antolinos (1951, VO marketplace via plataformas de los mercats) y Els Fogons (VO ecommerce|whatsapp, paradas en 4 municipios) con venta online; Aviram Guasch (38 años, web propia), Carnes Serrano (cadena 1959 con granja propia), Xurreria Glòria, Forn Oporto y Més que Pa (IG propio, GMaps de "+ Quin pa!" ajeno blanqueado) verif; Qué hay de comer y Pescados Ana parciales |
| 86 | Montcada i Reixac | 0 | ✅ | 2026-06-12 | 5 verif + 3 parcial + 2 purgas (Diaz Mañosa=quimera con email de excavaciones y GMaps de concesionario; Agrària Can Viver=entidad DAR de Terrassa/Torrebonica que elabora para Hort del Silenci, sin rastro como viver de Montcada, GMaps de escola); Harmony Coffee Roasters verif (microtostador, VO ecommerce|suscripcion); Leo Boeck verif (frankfurts des de 1927, ecommerce confirmado); Gumi's, Jaime Bou (industrial 40 años) y Vilalta (FB añadido) verif; Gimoka España parcial (oficinas del grupo italiano, shop via caffeteas.es→marketplace); Arroyofrío parcial (SL real; GMaps/coords de Leo Boeck blanqueados); ACEC parcial (mayorista encurtidos 1993) |
| 87 | Òdena | 0 | ✅ | 2026-06-12 | 5 verif + 3 parcial + 2 purgas (Puig d'Aguilera estaba TRIPLICADA: registro Jorba Cañellas con datos del pueblo de Jorba + 2 filas de marca con el mismo place_id → fusionadas en una, verif con IG propio); Bodegas Puiggròs verif (ecommerce confirmado); Cava Bohigas verif (web JS, VO no comprobado); Mel Família Riba verif (IG propio + DAR; GMaps de suministros RIBA blanqueado); Cal Llobet verif (guía municipal + Alta Anoia, caragols vinyala, recategorizada Caracoles); Cal Llacuna parcial (masía ganadera 400 años, família Torras; recategorizada Carne); Domenech Rabell parcial DAR (GMaps de Domenech Legal blanqueado, tel DAR restaurado); Griselda Planas parcial (CCPAE; GMaps de Servisimó blanqueado) |
| 88 | Olost | 0 | ✅ | 2026-06-12 | 6 verif + 2 parcial + 2 purgas (Cal Terrisco=casa rural de 1714 del pastor Josep Salvans, sin producto alimentario —el match DAR era de Llorenç del Penedès—; Germans Palomera Casals sin rastro); Kibus verif (kibus.cat ES la botiga online, ecommerce); Betara verif (obrador Perafita + granja St. Boi + maduración/botiga Olost); Reixagó, Cal Serrat (IG propio), Cal Parra (ecommerce confirmado) y Forn Sant Adjutori verif; Garduixeres parcial (granja 50 frisonas, formatge al obrador col·lectiu; GMaps d'El Teixell blanqueado); Impasto di Mamma parcial (web/IG de la Gastroteca blanqueados) |
| 89 | Pacs del Penedès | 0 | ✅ | 2026-06-12 | 7 verif + 2 parcial + 1 purga (Germans Seguí-García sin rastro, con web/tel/horario del ajuntament y GMaps de Parés Baltà); AT Roca reubicada a Avinyonet del Penedès (instalaciones nuevas; atroca.com parked blanqueada; VO marketplace via Petit Celler); Parés Baltà ecommerce confirmado; Familia Torres VO marketplace (tienda online=petitceller.com); Caves Bundó renombrada (Google Site propio + DAR); Colet, La Xarmada (web añadida; viver de celleristes) y Plana d'en Jan (celler mínimo desde 1895) verif; Cal Tinons parcial (Mercat Arrels, Maria Grau; GMaps de Cal Ton de Vilafranca blanqueado); Olmit Inversions parcial DAR |
| 90 | Ripollet | 0 | ✅ | 2026-06-12 | 7 verif + 2 parcial + 1 purga (Mireia Cardona sin rastro); Cal Pastera reubicada a Sant Vicenç dels Horts (horta eco CCPAE con cistelles, ni Ripollet ni Lácteos; blog WP + IG propios); Apassiona't VO ecommerce|whatsapp (tienda online de pedidos confirmada); La Iaia Artesana verif con web de Pekatum (Cerdanyola, ajena) blanqueada; Xurreria Marina, Forn Call-2000, Planas y Obrador Navarro verif; Gurri Taverna parcial (bar con cerveza de marca propia; web birrapedia e IG personal blanqueados); Ripodul SL parcial (web caída) |
| 91 | Sta. Eulàlia de Ronçana | 0 | ✅ | 2026-06-12 | 5 verif + 1 parcial + 4 purgas (Huguet Risquez dup persona↔marca d'El Molí d'en Vendrell por email DAR, con GMaps de perruqueria; Zafra=quimera con grúas + Cinco Monos BCN; Cunill=quimera con terapeuta Gestalt, .webp borrado; Margenat solo consta como president dels regants, sin actividad comercial); El Molí d'en Vendrell verif con datos DAR fusionados; Can Burguès (avellana DOP Garriga; SAT en DAR), Can Galderic (texto corrupto reparado), Estació Vegana (catering per encàrrec→VO no) y Parc de les Olors/El Serrat (seu central; →Aromáticas) verif; Alsina Cusco reubicado a Mollet/Gallecs (era el candidato DAR del lote 78, estaba aquí mal ubicado con web de Can Farell) |
| 92 | Teià | 0 | ✅ | 2026-06-12 | 6 verif + 1 parcial + 3 purgas (Aurora del Camp SCP dup del proyecto ya integrado en El Masnou —campos entre ambos municipios, DAR Aurora Agrícola SL—; Homs Alsina=quimera de Materials Homs SA y Garro Rovira=quimera de BigMat Garro + cerrajería Vargas, ambos .webp borrados); L'Hort d'en Pau verif (DAR Pau Gutierrez; botiga online + WhatsApp + repartiment a 8 pobles → ecommerce|whatsapp; camps a Alella, botiga a Teià); J. Mónico (IG propio), Marcual (web propia, cert roto), Flors Bertran Mas, Forn Nou (web=FB dup blanqueada) y Pastisseria Biel verif; Nova Plant 2000 parcial (ornamental) |
| 93 | Bigues i Riells | 0 | ✅ | 2026-06-12 | 3 verif + 2 parcial + 4 purgas (Granja Subirats SL fusionada en Subirats Carns —email gsubirats—; I-Magina Divulgació SL=empresa del Parc de les Olors ya verificado en lote 91; Guiu=Guiu Motors con web que era una URL de búsqueda de Google; Ana Martinez sin rastro y GMaps de otra persona); la lista de productors locals del ajuntament resolvió el lote: Can Duran rescatada (horta+oli+vi; web de un forn de Palafrugell blanqueada, FB propio), El Rull-Can Maspons=granja pionera del huevo eco (1996, →Huevos), Subirats Carns verif; Jaume Roger Garriga RESCATADO de quimera (productor real de verduras en la lista; links de Garriga Grup obres + VO falso limpiados, .webp borrado); Fornet del Fai parcial (GMaps d'Argemí blanqueado y sin más links → no puede ser verif por contrato) |
| 94 | Calaf | 0 | ✅ | 2026-06-12 | 7 verif + 0 parcial + 2 purgas (2 dups internos: Cunicula Pilar SCP bare → fusionada en Euroconills; Ous de Calaf ↔ Avícola Frauca misma web/IG → fusionadas, .webp renombrado al slug que queda); Xais Adoració reubicada a Sant Martí Sesgueioles (DAR Josep Lloret + ficha diba "Apropant el mercat"; xai i cigrons, →Carne; web xcc.cat ajena y VO ecommerce falso limpiados); La Vedella, Cal Gatells (web=guia municipal blanqueada), Embotits Closa y Forn Fitó (Cal Fidel) verif; Ous de Calaf=parades patentades als mercats de BCN, VO no (web informativa) |
| 95 | Calders | 0 | ✅ | 2026-06-12 | 4 verif + 1 parcial + 4 purgas (Serra Coma dup registre↔marca de Vedella de Trullàs; Hostal Calders=restaurant del Grup Llobet; Picanyol=quimera con estudio de fotografía; Productes El Canadell SL=sin rastro de carquinyolis, la masia es restaurant y elcanadell.cat ahora es una làctia de Agrofresc en Sta. M. d'Oló — 3 .webp borrados); Mas Reixac rescatada (vedella eco CCPAE, FB propio + catàleg del Moianès + carnisseria l'Hostal); Trullàs verif (GMaps de la Vedella del Pedraforca ajena blanqueado); Nous El Soler ecommerce confirmado (2.000 noguers eco, email con typo corregido); Caterí whatsapp|email; Ruaix=Delícia de Mel parcial DAR (GMaps de Cicles Ruaix blanqueado, coords al centroide) |
| 96 | Castellterçol | 0 | ✅ | 2026-06-12 | 7 verif + 1 parcial + 1 purga (Dirk Madriles Helm=duplicado vacío de La Ginebreda: la masia La Ginebreda ES la explotación de Dirk Madriles, ramader eco d'oví/cabrum, no "mel i espelmes" como decía la fila → renombrada La Ginebreda (Dirk Madriles), →Carne, GMaps de "Tolls de la Ginebreda" landmark blanqueado); Granja El Rocall SL=marca Granja La Bassola (DAR, vedella, →Carne, municipi Barcelona→Castellterçol); Naturaliment Suquipà=plats vegetals rostits, NO pa → recategorizada Comida preparada; Cafè Fantini (GMaps de Cafès del Bages d'altre municipi blanqueado), Cal Bou (DAR de Sant Boi falso, real per diba), Miró (adreça Pabordia 12) verif; Mas Brugarolas parcial (agroturisme + ramaderia CCPAE); Nutrition&Santé/Natursoy parcial (planta industrial, coords de BCN→centroide) |
| 97 | Cervelló | 0 | ✅ | 2026-06-12 | 4 verif + 3 parcial + 2 purgas (EA Especialidades Aromáticas SL=aromas B2B para la industria y EMSA Esencias Moles SA=fragancias/perfumes desde 1953, ambas mal fichadas como "Flores/plantas ornamentales", fuera de ámbito km0 → purgadas + 2 .webp); Carns Fresques Font, Rostisseria Cervelló, Fleca El Llonguet y Pastisseria Permanyer verif (comercios de poble, Carrer Major); Cafès Balanzó parcial (torrador absorbido por Cafès Candelas, web redirige; FB/IG de candelas blanqueados); Carns Cervelló=Carnisseria i Xarcuteria Cervelló parcial (GMaps "La Carnívora" ajeno blanqueado, sin enlace propio); Peixateria La Platjeta parcial (punto de venta) |
| 98 | Esplugues de Llobregat | 0 | ✅ | 2026-06-13 | 8 verif + 0 parcial + 1 purga (Bofill de la Fuente=quimera del estudio de arquitectura Ricardo Bofill: web bofill.com, IG bofillarquitectura y GMaps "Bofill Taller d'Arquitectura"); urbano, todo obradores de barrio; VO online: Cansaladeria Ortiz (parada del Mercat Can Vidalet con carrito + locker en jocomproaesplugues.cat → marketplace), Forn Can Rosell y Puntosmile (obrador sin gluten certificado, pedidos online → ecommerce); MILA, Forn el Molí, Forn Tinyol, Pastisseria Fíguls y Pastisseria Sant Jordi (match DAR de Avícola Sant Jordi de Sant Jordi Desvalls=falso) verif |
| 99 | l'Hospitalet de Llobregat | 0 | ✅ | 2026-06-13 | 8 verif + 1 parcial + 0 purgas; urbano, sin DAR. Animal Coffee (tostador propio, ecommerce confirmado), Tibidabo Brewing (cervesera+taproom, ecommerce) y Panarra (obrador massa mare, ecommerce) con venta online; Xurreria L'Àvia, Grenya, Dtast, Aviram Cristina Martín (Mercat del Centre; IG del mercat blanqueado) y Obrador Riera Blanca (coords del Vallès→centroide) verif; Xarcuteries Bosch (1863, Mestres Artesans) parcial: su web solo lista puntos en Barcelona y Montgat, presencia en el Mercat Santa Eulàlia a confirmar (GMaps genérico del mercat blanqueado) |
| 100 | Montornès del Vallès | 0 | ✅ | 2026-06-13 | 8 verif + 1 parcial + 0 purgas (Esquís Nicolau parcial: productor DAR de civada con GMaps de la tienda de esquí "IGLUSHOP" de BCN —falso match por la palabra "esquís"— blanqueado y coords corregidas); El Rebost de la Carn y Pastisseria Viñallonga (1974, Mestre Artesà) ecommerce confirmado; Mongetes del Ganxet Puig rescatada (família >50 anys, web mongetesdelganxetpuig.com añadida); Belcan (bollería industrial IFS), Cal Forner (Mestre Artesà 2021), Forn la Bóbila, Pastisseria Elena y Xurreria Ca la Maria verif |
| 101 | Sant Andreu de la Barca | 0 | ✅ | 2026-06-14 | 5 verif + 1 parcial + 3 purgas (clúster Vivami: canals-vives y pere-vives dups registre↔marca de Fruites i Verdures Vivami —mismo DAR Canals Vives Jaume, tel 650281265/jaume.cv@hotmail.com—; Grau Garcia Roger=quimera de Industrias Garcia Grau SA, fàbrica metàl·lica de BCN amb indgarcia.cat, DAR fals Bellet Garcia/Torregrossa, .webp borrado); Vall del Riu SAT recat como **Vins i Cava Piteus** (→Bodega; web del Teatre Núria Espert + GMaps del teatre blanqueados; canpaletpiteus.com ecommerce, tel/email DAR, FB/IG propios; celler a Corbera, SAT registrada a SAB); Vivami ecommerce (vivami.cat/botiga; web=FB "Fernandez" y GMaps "Fruites Juan y Sofi" ajenos blanqueados); Pastisseria Arenas VO whatsapp; Rostisseria Ramírez y Forn de l'Avi Josep VO no; Hort Municipal (Fundació Futur) parcial (projecte agroecològic municipal amb venda directa, GMaps "Hort de la Font Trobada"/Montjuïc i coords de BCN corregits, FB menjafuturbcn de la fundació conservat) |
| 102 | Sant Climent de Llobregat | 0 | ✅ | 2026-06-14 | 3 verif + 5 parcial + 1 purga (Alaball Condeminas Jose=el pare fundador d'Alaball Berros, dup registre↔marca per email enric.alaball@gmail.com, adreça/coords a BCN); municipi de cireres i horta del Parc Agrari, gairebé tot productors DAR. Vila ECO (vilaeco.com, eco, botiga online+WhatsApp+repartiment → ecommerce|whatsapp), Alaball Berros (creixens, web 403 bot-block viva, B2B restaurants/distribuïdors → VO no) i L'Hortet del Baix (família Torras 5 gen., cistelles online hortetdelbaix.com → ecommerce; botiga a Viladecans, SAT a SC) verif; Fulquet Comas (Fruites Maria i Verdures Juana), Cal Sacot (Llusa Font), Llusa Montserrat (tel/email del DAR restaurats, abans els de l'ajuntament), Esteve Arcs (coords al Montseny→centroide, →Fruta y verdura) i Tugas Molins (→Aceite) parcials DAR |
| — | _resto (310 municipios)_ | 1.320 | ⬜ | | recomputar al llegar |

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
- **Gavà (Mercat de Pagès):** Cal Xim Xim (Mauri Bosch, 30 ha) · Vila Eco by Enric ECO (Xavier Estrada) · Ivern Borrut Josep (DAR). ~~Can Arenols~~ → integrado como fila de Castelldefels (lote 45, parcial; confirmar municipi del camp) |
- **Sant Feliu de Llobregat:** La Rural de Collserola SCCL (Can Ferriol, DAR; horts a la Rierada-Molins ja citats al lote 34)
- **Sant Pere de Ribes:** La Piotxa SCCL (préssecs, espàrrec, espelta; DAR 656577327)
- **Torelló:** Agrària de Torelló SCCL (Patates del Bufet d'Orís; DAR 617331898) · Les Gambires Torelló SL (El Rebost de les Gambires, pollastre; DAR 626305631) · Espai Natura (parada eco al Mercat Municipal, collita pròpia)
- **Granollers:** Figuls Tuset, Pere (Can Figuls, enciam/mongeta; DAR 645932199) · Ventosa Asturgo, Isidro (llet i formatges; DAR 647466330)
- **Santa Coloma de Gramenet:** Horticultura Meya SL (DAR 670246579; probablemente la mateixa família que la fila Horta Meya ja verificada — comprovar abans d'afegir)
- **Esparreguera:** Masia Can Claramunt (verdures i producte de proximitat, masiacanclaramunt.com)
- **Palafolls:** Navarro Sanchez, Juan Manuel (préssecs/pomes/olives; DAR 660562171) · Pla Urrea, Antoni (pastanaga/horta; DAR 629351781)
- **Prats de Lluçanès:** Aragües Carrera, David (xai; DAR 626165004) · Coop. Mas Les Vinyes SCCL (horta+xai+mel, agroforestal)
- **Arenys de Mar:** Hortalisses Tuto SCP (horta; DAR 637855410) · Sala Martinez, Lluís (carxofa/fava; DAR 629303780) · Can Maresma SL (ous/fruita/verdura, parada 14/16 mercat)
- **Argentona:** Oliveras Guiñon, Jose (all/mongeta/tomàquet; DAR 639261000)
- **Avinyonet del Penedès:** Marcé Medialdea, Martí (Martí Marcé, préssecs; DAR 677507426). Los Cuscó Esteve (Joan/Jordi/Lluís) son la família de Cuscó Berga, no añadir.
- **Pineda de Mar:** Cuní Baltrons, Juan (horta; DAR 660364608)
- **Olesa de Montserrat:** Fruits del Bosc Petras SL (marca Fruits del Bosc, aromàtiques; DAR 624073697) — probablement la mateixa família que Bolets Petràs (ya verificada), comprovar abans d'afegir.
- **Barberà del Vallès:** Pons Pujol SCP (vedella; DAR 680947310)
- **Granollers (Palou):** de la lista oficial Productes de Palou, no integrados: Hort de Can Tabaquet (horta eco) · L'Horta de la Tuka (horta+mel) · Can Nicolau SAT (carn) · Els Bardissots (vi) · Fem Horting
- **Gurb:** Agrícola Terricabras Colom SL (marca ACTUS, ceba/calçot/enciam/patata; DAR 606877466)
- **Granollers (ciutat):** Gassó Artesans 1885 (pastisseria gourmet, Cal Ros dels Ocells 4C, gassoartesans.com) — marca real purgada de Lliçà d'Amunt donde figuraba como cansaladeria
- **Palau-solità i Plegamans:** Estrada Llargues, Isidro (mongeta; DAR 659999473)
- **Sallent:** Guitart Quintana, Josep (Essència d'Oli de Cabrianes; DAR 617375377) · La Tomakera SCP (horta; DAR 649195293) · Santasusagna SCP (xai; DAR 617405951)
- **Torrelavit:** Cols Canals, Lluís (Cal Cols, vins+oli; DAR 653162580) · Ruiz Molina, Anna (préssecs; DAR 648725583)
- **Castellfollit del Boix:** Cornellas Prat, Jordi (Cal Rei, conserves; DAR 618762888) · Lladó Oliva, Joan (cigró/mongeta; DAR 608691406)
- **Cubelles:** Poch Lleó, Ciril (oli/horta; DAR 636808594)
- **Font-rubí:** Aranda González, Agustín (oli/pebrot; DAR 639333948) · Celler Cal Costas SL (DAR 654127597) · Ràfols Petit, Jordi (Magna Hortum, horta; DAR 625810165) · Ros Marina Viticultors (Mas Uberni; DAR 686501262)
- **Malgrat de Mar:** Xaubet SCP (horta; DAR 629006100) · Josep Maynou y Bona Verdura (directorio Espai Agrari Baixa Tordera, espaiagraribaixatordera.cat — fuente útil para todo el Alt Maresme/Baixa Tordera)
- **Mollet del Vallès (Gallecs):** ~~Alsina Cusco~~ (integrado en lote 91, reubicado desde Sta. Eulàlia) · Butjosa i Boada Gallecs SCP (marca Ous de Gallecs / "Ou de Gallecs", Laura Blasco; DAR 652303577) · Hereus Can Jornet SL (Can Jornet, farines; DAR 689509161) · Agrobotiga de Gallecs (punt de venda col·lectiu dels pagesos, espairuralgallecs.cat — web http-only, https con cert roto)
- **Sta. Eulàlia de Ronçana:** Monràs Passeta, Alan (Mels Can Monràs Nou; DAR 618094396)
- **Castellterçol:** Esteva Monforte, Enric (horta/col-i-flor/tomàquet; DAR 608925270) · Vall-llosana SCP (vedella; DAR 666545870) · Granja La Bassola SAT (paralela a El Rocall SL ya integrada; DAR 629134275, comprovar si és la mateixa entitat abans d'afegir)
- **Cervelló:** Soldevilla Alonso, Jordi (cireres; DAR 627418908)
- **Montornès del Vallès:** Vallès Oriental = zona DOP de mongeta del ganxet (Montornès, les Franqueses, la Roca); coop Agrària Vallès (agrariavalles.coop) como fuente
- **Bigues i Riells del Fai:** de la lista de productors de l'ajuntament, no integrados: Hortícola Vila (tomàquets/calçots a domicili; elflix@elflix.com, 687083451) · Can Quimet (mongetes i calçots) · Chiva Valls (cereals). Can Sapera y Embotits Guinó (Lliçà de Vall) ya están en el CSV
- **Papiol:** grup Rebrot Pagès (6 pagesos eco del Papiol; Can Font ya integrado, identificar el resto) · catàleg de productors del Parc Natural de Collserola (parcnaturalcollserola.cat) y programa de la Festa de la Cirera — fuentes útiles. Figueras Garriga Ramon (DAR 606701734) ya cubierto por la fila Cal Figueras (hermanos)
- **Sta. Margarida i els Monjos:** directori municipal de cellers i caves (santamargaridaielsmonjos.cat/directori/cellers-i-caves) — fuente útil para más cellers del municipi
- **Seva:** Blansac 2015 SL (marca Formatge Bauma, formatges de llet crua; DAR 617386155) · guia d'empreses de l'ajuntament (seva.cat) — fuente útil
- **Torrelles de Foix:** Heretat Laverna (celler dels Escofet des de 1342, vins eco DO Penedès, primera anyada 2021, ancestrals.cat; vil·la romana a la finca) — no está en el CSV, candidata clara
- **Badia del Vallès:** Carnisseria Cristina Ramacisa SL (Mercat de Badia, Av. Via de la Plata 8) — real en directorios; el ajuntament publica la lista de parades con servei a domicili (badiadelvalles.cat)
- **Terrassa:** Hort del Silenci (hortdelsilenci.com; agricultores y elaboradores eco con almacén en Terrassa; su obrador es la Masia Can Viver de Torrebonica = Agrària Can Viver SL del DAR, fila quimera purgada de Montcada) — no está en el CSV
- **Lluçanès:** portales llucanesataula.cat y turisme.llucanes.cat/tasta/productors-elaboradors — fuentes útiles para toda la comarca; Formatges de Lluçà (Lluçà) y el obrador col·lectiu/formatgeria del Lluçanès (Anna Puig, BCN Agrària) como pistas

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
