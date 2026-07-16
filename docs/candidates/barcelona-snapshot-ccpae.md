# Snapshot / hallazgo — CCPAE, operadors ecològics (frente B, lote 12)

> Cierre del lote 12 de la pasada «flujo 2026» el **2026-07-16**. Fuente:
> **Guia d'operadors de la producció agrària ecològica de Catalunya** del CCPAE
> ([guia.ccpae.org](https://guia.ccpae.org/GD/guiaDirectoriWebCercar.action)).

## Resultado: snapshot / delta-base, **0 altas netas** (decisión documentada)

El plan del lote 12 preveía dos ramas: «si publica fecha de alta → solo altas
2024-26; si no → snapshot para deltas futuros». Se confirma la **segunda rama**,
y además que el registro es de **baja señal** para nuestro producto:

### Naturaleza de la fuente (observado en vivo)

- **Registro de certificación de toda Catalunya**: **5.085 operadores** en total
  (no solo provincia de Barcelona). El listado alfabético está dominado por
  entidades que **no** son productores km0 de marca: logística (A.G. 90
  Logística, Actividades Logísticas del Vallès), distribuidores (Actibios
  Distribucions, Access World), aceites/industrias (Aceites de Semillas SA,
  Aceites Premium SL), importadores, cooperativas de 2º grado, etc. Es un
  **registro-dragnet** análogo a REGA: certifica *certificación ecológica*, no
  *producto vendible de marca* → una inscripción soporta como mucho `parcial`.
- **Sin fecha de alta por operador** en el listado ni filtro temporal → no se
  puede acotar a «altas 2024-26».
- **Herramienta hostil**: no hay dataset en datos abiertos de la Generalitat
  (Socrata solo publica el DUN de parcelas); el buscador es un formulario
  Struts+Dojo con AJAX en cascada que resiste `curl`. Se condujo con navegador.

### Sonda representativa: comarca del Berguedà (rural, alta señal esperada)

Filtrando por comarca **Berguedà** → **63 operadores**, con columna *Actividad*:
- **~90% en bruto**: «Bosque, matorrales y recolección», «Pastos, prados y
  forrajes», «Raíces y tubérculos» — pagesos/ramaders, no productores de marca.
- **Elaboradores (los únicos candidatos reales)**: prácticamente todos **ya en
  el CSV** — Casabella Natura (Olvan, `casabella-natura-olvan`), La Bauma de les
  Deveses (Sant Julià de Cerdanyola, `la-bauma-de-les-deveses-sant-julia-de-cerdanyola`).
  Único ausente: *Carn i Bestiar Prat SL* (Casserres, elaboració de productes
  carnis) → carne genérica sin señal de marca/web/actividad → **no alta** (regla
  de no añadir inscripciones de registro por defecto).

### Por qué la cobertura ya está hecha

El subconjunto **con marca, vendible y en provincia** del CCPAE **ya fluyó al
catálogo** por las fuentes limpias de esta misma pasada, que pre-filtran a
productores reales y **arrastran el propio distintivo CCPAE «producte ecològic»**:
sobre todo la **XPT 2025 (lote 10)** —que fue 69% ya-en-CSV y marca la
certificación eco (dades juny 2025)— y también Gastroteca (lote 9) y mercats de
pagès (lote 11). Tres lotes seguidos con yields decrecientes (8/3/2) ya
mostraban saturación del pool metropolitano.

## Método para deltas futuros (reutilizable)

Cuando se quiera re-mirar el CCPAE, **no barrer los 5.085**. Filtrar en el
buscador por:
1. **`Tipus de cerca = Per activitat` + una activitat de elaboració** (códigos
   `54xx`–`72xx`: vinagre, destil·lats, patés de bolets/oliva, cremes de fruits
   secs, formatge, conserves de peix, plantes aromàtiques…), province-wide →
   conjuntos pequeños de alta señal.
2. o por **comarca** (ids BCN: Alt Penedès 19, Anoia 18, Bages 16, Baix Llobregat
   13, Barcelonès 12, Berguedà 14, Garraf 23, Lluçanès 43, Maresme 11, Moianès
   42, Osona 08, Vallès Occ. 10, Vallès Or. 09) y quedarse solo con las filas de
   *Actividad = ELABORACIÓN*.
3. Alternativa: la **«Guia d'Operadors Ecològics» anual en PDF** del CCPAE
   (parseable como la XPT).

Cruzar los elaboradores contra el CSV (nombre + email-dominio + teléfono) y
quedarse solo con marcas propias de categorías raras aún con hueco.
