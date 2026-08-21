# Flujo editorial

Este documento organiza en tres niveles un único trabajo: aumentar la cobertura
del catálogo sin rebajar la fiabilidad de sus filas. Define el foco, la salida y
el traspaso de cada nivel. La política decide qué productor encaja; los contratos
de CSV y evidencia deciden cómo se guarda el resultado.

Los niveles son tipos de trabajo sobre una entidad, no estados de un país, un
área o el catálogo. En un mismo CSV pueden coexistir candidatos por descubrir,
altas por decidir y filas en distintas revisiones. Una nota de candidatos, una
fila CSV y su evidencia ya son los artefactos de traspaso: no añadas columnas,
tablas de progreso ni inventarios manuales para repetirlos.

## Cómo elegir el foco

El `Operating state` del `AGENTS.md` del país solo aporta prioridades, fuentes y
riesgos compartidos. Nunca asigna un nivel al país. El siguiente trabajo se
decide para el candidato o productor concreto:

1. termina primero el lote ya abierto y su corte de candidatos;
2. resuelve candidatos ya descubiertos antes de ampliar esa misma búsqueda;
3. en una fila cuya admisión es dudosa, confirma primero que debe existir antes
   de enriquecerla;
4. abre descubrimiento nuevo solo con un alcance concreto por área, fuente,
   categoría o municipio.

Este orden se aplica dentro del trabajo que comparte contexto, no obliga a
vaciar una cola nacional antes de tocar otra. Los filtros del auditor seleccionan
tareas; no clasifican al productor de forma permanente.

Un lote pertenece a un nivel aunque durante la investigación aparezcan datos
útiles para el siguiente. Captura esos datos si la fuente ya está abierta, pero
no conviertas el lote en una búsqueda ilimitada. Los hallazgos posteriores al
corte pasan al lote siguiente.

Las colas vivas proceden de los artefactos, nunca de un resumen escrito:

- nivel 1 y altas del nivel 2: `docs/candidates/<country>/<area>.md`;
- deuda publicada del nivel 2:
  `npx pnpm check:defects --stage admission --country <iso>`;
- nivel 3:
  `npx pnpm check:defects --stage verification --country <iso>` y el roster del
  área con `npx pnpm list:producers <area>`;
- propuestas de cambios de titulares ya verificados: la cola PostgreSQL visible
  en `/admin/cambios`, que entra en el nivel 3 cuando se revisa.

El auditor solo prioriza señales que puede derivar de los datos. No demuestra
que una fila sin alertas esté bien verificada ni crea un censo de productores
terminados; cualquier fila del roster puede volver a ser objeto del nivel 3.

## Nivel 1 — Descubrimiento

**Objetivo:** reunir señales concretas y localizables de productores plausibles,
no demostrar todavía una alta ni completar una futura ficha.

Parte de una fuente y un alcance explícitos. Deduplica de forma mínima contra el
CSV y la nota del área; una coincidencia dudosa sigue siendo una pista para el
nivel 2, no una segunda investigación completa.

Cada candidato deja lo mínimo necesario para que otra persona pueda retomarlo:

- nombre público;
- área y municipio o pista geográfica conocida;
- categoría probable y motivo concreto por el que puede encajar;
- al menos un localizador público: web o perfil oficial cuando aparezca y, en
  todo caso, la URL de la fuente que originó la señal;
- fecha y alcance de la búsqueda;
- duda material pendiente, si ya es visible.

No rellenes por intuición, no recopiles todos los campos del CSV y no abras
búsquedas laterales solo para mejorar una candidatura. El formato y los
hallazgos incidentales se rigen por `docs/candidates/README.md`.

**Salida:** un lote finito en la nota del área, con fecha de corte. En este nivel
no se crea una fila CSV ni un `keep`, y la candidatura todavía no afirma que la
unidad sea elegible o siga activa.

## Nivel 2 — Admisión al catálogo

**Objetivo:** decidir cada candidato del lote y publicar solo unidades que ya
superan el umbral editorial de entrada.

La investigación se limita primero a las afirmaciones de admisión:

1. identidad pública y correspondencia con las fuentes;
2. actividad productiva que encaja y oferta propia actual;
3. unidad productiva en el área y municipio publicados;
4. categoría respaldada por esa actividad;
5. actividad no cerrada y ausencia de un duplicado de la misma unidad.

Una nueva fila no es un candidato aparcado. Si esas afirmaciones no alcanzan el
umbral, queda en la nota con el bloqueo concreto o se rechaza cuando la exclusión
está demostrada. Si lo alcanzan, conserva también cualquier contacto, enlace,
dirección o producto explícito que ya haya aparecido; no hace falta investigar
todos los campos para admitirla.

La localización debe ser útil y honesta. El municipio productivo es parte del
umbral. Añade coordenadas exactas o un fallback municipal solo cuando estén
respaldados conforme a `docs/GEOLOCATION.md`; si no existe un punto defendible,
una pareja vacía es una carencia visible para el nivel 3, no una licencia para
inventarlo.

Los cuatro resultados cierran así:

| Resultado | CSV | Evidencia | Nota de candidatos |
|---|---|---|---|
| Aceptado | Añadir como `parcial` o `verificado`, nunca como nuevo `pendiente` | Crear `keep` con las fuentes de la decisión | Podar la entrada |
| Ya presente | Actualizar solo datos incidentales confirmados | Actualizar el `keep` existente si procede | Podar la entrada |
| Descartado | No añadir | Crear `reject` con prueba afirmativa | Podar la entrada |
| No resuelto | No añadir | No crear decisión | Mantener bloqueo y último intento |

`pendiente` queda reservado para deuda heredada: identifica una fila publicada
que no satisface todavía el umbral actual de admisión. Antes de ampliar o
embellecer esa fila, hay que confirmarla, fusionarla o retirarla.

**Salida:** todos los candidatos anteriores al corte están aceptados, ya
presentes, descartados o retenidos con un bloqueo accionable; CSV, evidencia y
nota coinciden. Durante la iteración ejecuta los checks de cambios y al cerrar,
`npx pnpm verify:data`.

## Nivel 3 — Verificación y enriquecimiento

**Objetivo:** revisar y mejorar una fila ya admitida para hacerla tan útil,
actual y completa como permitan las fuentes en esa pasada.

Resuelve primero falsedades o contradicciones; después trabaja las colas que
requieren decisión (`Venta online=no comprobado`, enlaces prestados, Maps no
canónico, categorías o textos dudosos) y finalmente las señales de cobertura
como coordenadas exactas, imagen o evidencia. Para cada fila revisa, cuando sean
aplicables y públicamente soportables:

- las tres afirmaciones nucleares y su `verificacion`;
- dirección, coordenadas y ficha exacta de Google Maps de la misma unidad;
- contactos y enlaces cuya titularidad esté bien casada;
- productos, categorías, descripción y horarios actuales;
- venta online y su mecanismo;
- una imagen admisible.

No tomes el valor existente de `verificacion` como prueba de partida. Es una
afirmación publicada que la nueva revisión debe sostener, rebajar o corregir
igual que cualquier otra celda.

Una pasada amplia significa **revisada**, no **rellena** ni terminada para
siempre. Una celda opcional vacía puede ser la conclusión correcta; `parcial`
puede ser el resultado correcto por el techo de las fuentes, y un canal
inaccesible puede obligar a conservar `no comprobado`. `verificado` describe la
fuerza actual de las afirmaciones nucleares: no certifica todos los campos, no
impide una corrección y no convierte la fila en inmejorable.

Actualiza la línea `keep` existente en vez de añadir otra. Solo se cierra la
pasada concreta: la fila queda reabrible ante una fuente mejor, un dato nuevo,
una contradicción o el simple paso del tiempo. Para cerrar ese lote no debe
conservar un defecto injustificado dentro del alcance y cada señal abierta debe
tener una razón honesta. Las señales legítimas no se convierten en deuda ficticia
solo para obtener cero resultados en el auditor.

## Solicitudes de titulares verificados

La reclamación de titularidad se resuelve en el sistema de cuentas según
`docs/ACCOUNT_SYSTEM.md`; no es un cuarto nivel editorial. Su resultado decide
quién puede proponer cambios para `(country, producer_id)`, no qué datos son
verdaderos ni qué debe publicarse.

Una solicitud de cambio sobre una fila publicada sí es una entrada priorizada
del nivel 3. La membresía activa autoriza la propuesta, pero el mensaje privado
del titular no es evidencia pública y no rebaja ningún criterio editorial. El
traspaso se cierra así:

1. El servidor vuelve a resolver `(country, producer_id)`, la membresía activa y
   el hash de la fila; una identidad, titularidad o base obsoleta bloquea la
   solicitud.
2. El revisor aplica `docs/EDITORIAL_POLICY.md`, `docs/CSV_CONTRACT.md` y los
   contratos específicos de cada campo. Solo las fuentes públicas adecuadas se
   incorporan a `data/evidence/**`; documentos de titularidad, mensajes y notas
   privadas permanecen en PostgreSQL.
3. La interfaz actual permite aprobar o rechazar. Si falta información o el
   parche debe corregirse, el revisor rechaza con una nota clara o el titular
   retira la solicitud, y el titular presenta una nueva; el estado reservado
   `needs_changes` no es hoy un hilo operativo. La aprobación autoriza la
   materialización, pero todavía no publica.
4. Un operador autorizado sigue el flujo de dos fases de
   `docs/ACCOUNT_SYSTEM.md`: materializa localmente, inspecciona CSV y evidencia,
   ejecuta `npx pnpm verify:data`, hace el commit y finaliza la solicitud contra
   el SHA completo.
5. Solo el push del commit a `main` y el despliegue posterior hacen público el
   CSV. PostgreSQL conserva propuesta, revisión y auditoría, pero nunca actúa
   como overlay del catálogo.

El mantenimiento ordinario reutiliza el nivel 3 para revisar actividad, cierres,
enlaces y afirmaciones dinámicas, tanto si la señal nace del auditor como si la
aporta un titular. Una fila siempre puede reabrirse ante evidencia mejor, una
contradicción o el paso del tiempo.
