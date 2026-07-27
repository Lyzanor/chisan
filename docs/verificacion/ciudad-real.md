# Verificación provincial de Ciudad Real

Ledger de la provincia. El CSV es la fuente de verdad y la evidencia por decisión
vive en `data/evidence/castilla-la-mancha/ciudad-real.jsonl`. Los contratos
aplicables son `docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md` y
`docs/EDITORIAL_POLICY.md`.

## Estado

✅ **Cerrada el 2026-07-27.** **146 filas**: 110 `verificado`, 36 `parcial`, **0
`pendiente`**. Venta online: **88 `sí` (88/88 con canal), 58 `no comprobado`**.
Evidencia: 195 registros — **146 `keep` (cobertura 146/146)**, 25 `purge`, 24
`merge`. En `data/evidence/coverage.json`.

La provincia llegaba casi hecha de una pasada anterior; este cierre resolvió las
cuatro filas que quedaban sin registro de evidencia y saneó las webs.

## Hallazgos del cierre

- **Diez filas usaban un directorio o una web de referencia como `web` propia** y
  se vaciaron: `apoloybaco.com` en cinco bodegas —y encima con URLs de página de
  categoría genérica, no de la bodega—, `lamanchawines.com` (enoturismo del
  consejo regulador) en dos, `busqueda-local.es` en dos y `paginasamarillas.es`
  en una. Ninguna es del productor.
- **Un dominio muerto que los buscadores siguen indexando**: `quesosfincalacruz.es`
  no resuelve ni por fetcher ni por navegador, pese a que las búsquedas devuelven
  sus páginas internas. Se vació la `web` y su `Venta online` pasó de `no` a `no
  comprobado`: sin fuente legible no hay prueba de ausencia de canal.
- **Encaje por escala anotado**: Lácteas García Baquero es marca quesera de
  alcance nacional, pero nació en 1962 en La Mancha, elabora en Alcázar de San
  Juan desde los setenta y tiene granjas propias. Se conserva por el mismo
  criterio que Huercasa en Segovia o Embutidos Rodríguez en León.
- **Los tres avisos de distancia del geo-check son falsos positivos justificados**
  y no se tocan coordenadas ni municipios:
  - *Mieles San Benito* (47,4 km): San Benito es la pedanía más al sur de
    Almodóvar del Campo, a unos 80 km del casco y en el límite con Córdoba. El
    término tiene más de 1.200 km².
  - *Cooperativa Virgen del Carmen / COVICAR* (22,0 km): está en la dehesa de
    Almodóvar, dentro del mismo término extenso.
  - *Bodegas Real* (31,6 km): su propia web confirma «13326 Montiel»; la bodega
    está en la carretera de Valdepeñas a Cózar, lejos del casco.
- **Dominios compartidos que sí son legítimos**: `garciacarrion.com` en dos filas
  del grupo García Carrión y `grupomontesnorte.com` en tres cooperativas socias
  del grupo Montes Norte. Es la web de la matriz, no un cruce.

## Residuales

- 36 `parcial`, la mayoría bodegas y cooperativas sin web propia viva; las diez
  que se quedaron sin `web` en este cierre son las primeras candidatas a
  rescatar el dominio real.
- 143 de 146 filas sin imagen: es el mayor hueco de calidad de la provincia.
