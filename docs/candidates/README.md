# Candidatos

`docs/candidates/**` es la bandeja temporal para descubrir productores. No es
fuente de verdad y la app no la lee: un productor publicado vive en
`data/csv/**` y una decisión cerrada, en `data/evidence/**`.

## Responsabilidades

Los README de este árbol son guías, no paneles de estado:

- este fichero define el formato y el ciclo de vida comunes;
- `docs/candidates/<country>/README.md`, cuando exista, solo añade métodos de
  descubrimiento reutilizables para ese país;
- `docs/candidates/<country>/<area>.md` contiene la cola activa, las fuentes y
  consultas concretas, la fecha de corte y el trabajo pendiente del área;
- `data/csv/<country>/AGENTS.md` contiene las reglas y los techos de fuentes
  duraderos del país;
- `data/csv/**` y `data/evidence/**` conservan, respectivamente, las filas
  publicadas y las decisiones cerradas.

No pongas en un README recuentos de candidatos, áreas revisadas, resultados de
un lote, fechas de cierre ni listas de pendientes: son estado derivado y se
desactualizan en cuanto cambia un fichero de área. Tampoco mantengas un índice
manual de áreas; el árbol de ficheros ya cumple esa función.

## Organización de las notas

Usa un fichero por área:
`docs/candidates/<country>/<area>.md`. Abre un fichero temático adicional solo
si una búsqueda concreta haría inmanejable el principal. No mantengas índices,
recuentos ni copias de datos ya presentes en el CSV.

La cabecera identifica, como mínimo:

- CSV de destino;
- fuente o consulta de descubrimiento, con URL cuando exista;
- fecha de la búsqueda;
- alcance de la pasada y trabajo pendiente.

Por candidato conserva solo lo necesario para continuar: nombre publicado,
municipio, categoría principal y posibles categorías adicionales, enlace de
origen, motivo por el que puede encajar y dudas aún abiertas. Si falta un dato,
indícalo; no lo completes por intuición. Un candidato anotado se considera
pendiente, por lo que no necesita
una tabla de estados.

## Flujo

1. Descubre desde registros, organismos, directorios o fuentes públicas
   identificables; nunca desde memoria ni nombres plausibles.
2. Deduplica antes de investigar con `npx pnpm list:area <area>` y búsquedas
   dirigidas por nombre, marca, razón social, dominio, dirección o contacto.
3. Verifica los criterios de `docs/EDITORIAL_POLICY.md` y los datos exigidos por
   `docs/CSV_CONTRACT.md`. Una fuente sostiene solo lo que realmente publica.
4. Cierra cada candidato con uno de estos resultados:

   - **Aceptado:** añade la fila al CSV y un registro `keep` en la evidencia.
   - **Ya presente:** enlázalo con la fila existente y elimina la anotación; no
     crees otra fila ni un `merge` si el candidato nunca fue un slug publicado.
   - **Descartado:** crea un registro `reject` con motivo y fuentes en la
     evidencia del área, y elimina la anotación.
   - **No resuelto:** déjalo en candidatos, indicando qué falta comprobar y la
     fecha del último intento.

No conviertas falta de resultados, una web inaccesible o evidencia insuficiente
en descarte. `reject` exige una exclusión afirmativamente demostrada; `purge`
se reserva para una fila que sí estuvo publicada.

## Cierre

Actualiza o poda la nota en el mismo cambio que el CSV o la evidencia. Cuando
no queden candidatos sin resolver, borra el fichero: los aceptados quedan en el
CSV, los descartados en evidencia y las versiones anteriores en Git.

Valida los datos tocados mientras trabajas y ejecuta
`npx pnpm verify:data` antes de cerrar la pasada.
