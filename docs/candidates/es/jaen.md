# Candidatos — Jaén

> Origen: pasada **DO menos cubiertas** (2026-07). Las DOP Sierra Mágina, Sierra
> de Segura y Sierra de Cazorla quedaron integradas en la fase B (lotes 2.2a, 8 y
> 9); lo integrado está en `data/csv/andalucia/jaen.csv` y el detalle por lote en
> el historial git. Aquí solo queda la cola sin resolver.

## Cola pendiente — DOP Sierra de Segura (2, baja prioridad)

Dedup contra `jaen.csv` rehecho el 2026-08-03: las dos siguen sin fila. Sin web
propia localizada; el aprendizaje de los cortes anteriores es que la etiqueta
«sin web» del registro suele ser errónea y casi todas estas cooperativas tienen
marca propia y tienda online → buscar antes de darlas por `parcial`.

- [ ] **S.C.A. Ntra. Sra. de Nazaret** — Aceite. Chiclana de Segura. 953 466 016.
  Último intento 2026-08-09: el consejo la clasifica únicamente como
  **almazara**, no como marca, y no publica ningún producto propio atribuible;
  directorios confirman fabricación y envasado, pero no una oferta pública con
  identidad propia. Se mantiene abierta: la ausencia de marca en el registro no
  basta para un `reject`.
- [ ] **S.C.A. Ntra. Sra. de los Milagros** — Aceite. Municipio a confirmar.
  Municipio resuelto: **Villarrodrigo**, aldea de Onsares. Último intento
  2026-08-09: el consejo y Cooperativas Agro-alimentarias la clasifican como
  almazara y confirman actividad/contacto, pero no aparece marca ni oferta
  propia; se mantiene abierta por el mismo motivo que Nazaret.

## Avisos reutilizables

⚠ **Homónimos** (el dedup por nombre da falsos positivos; son entidades
distintas): «S.C.A. La Vicaría» (almazara, Puente de Génave) ≠ «Quesería Cortijo
La Vicaría» (mismo pueblo) · los «San Isidro Labrador» de Benatae y Siles ≠ el de
Huelma · «San Marcos» (Beas) ≠ «Coop. Hortofrutícola San Marcos» (Torres) · «San
Francisco» (Arroyo del Ojanco) ≠ «Oleícola San Francisco» (Begíjar) ≠ «San
Francisco» (Albanchez) · «S.C.A. Virgen del Campo» de Génave ≠ la de Torres de
Albanchez (Chorro de Oro) ≠ Sierra de Génave (Oro de Génave). Todas están ya en
el CSV con slug propio: cuidar slug y municipio al tocar cualquiera.

⚠ **Excluido (gran grupo):** «Jaencoop Grupo Cooperativo» (Puente de Génave) es
el mayor grupo cooperativo aceitero de la provincia (2º grado) → no crear fila.
Sus cooperativas de base sí entran por separado si venden con marca propia.

⚠ **Fusión:** Agrosegura absorbió a «Ntra. Sra. de la Asunción» (Agrolea/
Asunción/El Molinete) → la Asunción no va como fila aparte.
