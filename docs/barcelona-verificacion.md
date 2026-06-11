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

## Estado actual (2026-06-11)

- Filas: **2.727** · verificado **999** · parcial **478** · pendiente **1.250**
  (snapshot inicial 2.973 · 35 · 16 · 2.922; **246 purgadas**).
- Modo: lote a lote bajo demanda, ~25 filas/lote, ~90 lotes estimados. **Cerrados: lotes 1-69** (worklist).
- **Siguiente: Lote 70** — Castellar del Vallès (11).
- Último push: lotes 1-62 en `main` (2026-06-11); lotes 63-69 pendientes de push.

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
| — | _resto (318 municipios)_ | 1.404 | ⬜ | | recomputar al llegar |

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
