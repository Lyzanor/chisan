# Candidatos — Ciudad Real

> La pasada **DO menos cubiertas** (lote 19: DOP Montes de Toledo parte CR + DOP
> Aceite Campo de Montiel) y su pasada provincial quedaron integradas en la fase B
> /C (2026-07-13). Lo integrado está en `data/csv/castilla-la-mancha/ciudad-real.csv`;
> el detalle por lote, en el historial git. Aquí solo queda la cola sin resolver.

## Cola pendiente (1)

Dedup contra `ciudad-real.csv` rehecho el 2026-08-03: sigue sin fila.

- [ ] **Embutidos Carrizal** — Pol. Ind. Las Suertes, C/ Juan Amador Fresneda, 5,
  13330 Villanueva de la Fuente. Embutidos frescos, curados, fritos y salazones
  de elaboración propia. Web `https://www.embutidoscarrizal.com/`,
  `contacto@embutidoscarrizal.com`, 967 396 255. Tienda propia operativa con
  precios de 2,95 a 36,75 € y carrito → `Venta online=sí`, canal `ecommerce`.
  Categoría **Charcutería**.

  Venía como `embutidos-carrizal-povedilla` en `albacete.csv` y se dio de baja
  con `purge:other-province`: su página de contacto separa la **carnicería** de
  Povedilla (Albacete) de la **fábrica**, que está en Villanueva de la Fuente.
  Al dar el alta, poner la dirección de la fábrica y dejar la carnicería como
  punto de venta en la descripción; la marca conserva el «de Povedilla» del
  origen familiar, así que el nombre no contradice el municipio de la fábrica.

  Su logotipo ya estaba descargado y se retiró al purgar la fila para no dejar
  una imagen huérfana. Se recupera del histórico:
  `git show 708685e:public/productores/castilla-la-mancha/albacete/embutidos-carrizal-povedilla.webp`.

## Avisos reutilizables

⚠ **Excluido (gran grupo):** **Grupo Montes Norte** (Malagón) — 8 cooperativas
integradas, ~30 entidades, ~50 millones de kg de aceite/año y almazaras en varias
provincias → regla dura de grandes grupos industriales. Es, aun así, el mayor
productor español de AOVE ecológico; si alguna vez se replantea el criterio de
tamaño, revisarlo aquí.

⚠ **Descartadas por maquila/B2B (DOP Campo de Montiel):** las 5 almazaras socias
(San Gregorio de Almedina, San Bartolomé Apóstol, San José de Villamanrique, San
Isidro Labrador de Villanueva de la Fuente, Olivarera San Isidro de Torrenueva)
muelen y dan servicio al socio, pero la marca de consumo y la tienda son de la
cooperativa de 2º grado, ya en el CSV como
`cooperativa-campo-de-montiel-villanueva-de-los-infantes`. No crear fila salvo
que aparezca marca propia o venta al público.

⚠ **Homónimos que rompen el dedup por nombre:** hay tres «San Isidro» distintos
en la provincia (Pedro Muñoz, Villanueva de la Fuente, Torrenueva) y dos «San
Gregorio» (Almedina y Arenales de San Gregorio). Cuidar slug y municipio.

⚠ **Fuentes muertas:** `aceitecampodemontiel.com`, `dopcampodemontiel.es`,
`campodemontiel.org` y la página de JCCM no resuelven. El dominio vivo es
`dopaceitecampodemontiel.es`, pero publica el registro vacío desde 2018 — el
camino que funcionó fue la web de la cooperativa de 2º grado.
