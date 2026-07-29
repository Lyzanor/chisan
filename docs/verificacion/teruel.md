# Verificación provincial de Teruel

Ledger para planificar y reanudar la primera pasada profunda de
`data/csv/aragon/teruel.csv`. El CSV es la fuente de verdad y la evidencia por
decisión vive en `data/evidence/aragon/teruel.jsonl`.

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`; este documento
solo fija el snapshot, los riesgos locales, el alcance de los lotes y el avance.
Los contratos son `docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md` y
`docs/EDITORIAL_POLICY.md`.

## Cómo reanudar

1. Leer `git status --short`, Estado, Reglas locales y solo el lote pendiente de
   menor número.
2. Confirmar que Teruel no tiene cambios concurrentes y localizar únicamente
   los slugs del lote en CSV, evidencia, candidatos e imágenes.
3. Resolver primero exclusiones, duplicados y enlaces ajenos. Después comprobar
   identidad, actividad productora y municipio; auditar venta online aparte.
4. Detener la investigación cuando la decisión sea sólida. No completar campos
   opcionales ni enriquecer imágenes salvo que cambien la decisión o queden
   huérfanas.
5. Editar quirúrgicamente, mantener LF y añadir o sustituir una línea JSONL por
   decisión con `reviewedBy: "codex-teruel-2026-07"`.
6. Actualizar el snapshot y el resumen del lote. Validar antes de continuar.

No se tocan filas de otro lote «de paso». Un hallazgo cruzado se anota aquí y se
resuelve en su lote, salvo una colisión que invalide la identidad del lote
activo. Los lotes solo se recalculan después de purgas o merges.

## Definición de completado

- No queda ninguna fila sin decisión editorial revisada en esta pasada.
- `pendiente` solo sobrevive con un bloqueo real documentado; `parcial` es un
  cierre válido cuando existe un techo institucional, secundario o técnico.
- Cada fila conservada tiene un `keep` vigente y cada baja o consolidación un
  `purge` o `merge` trazable.
- Todos los `Venta online=sí|no` están demostrados y cada `sí` tiene un canal
  válido; una reventa independiente no cuenta como venta del productor.
- No quedan duplicados editoriales, enlaces ajenos ni imágenes huérfanas. CSV y
  evidencia están reconciliados y `npx pnpm verify:data` termina sin incidencias
  atribuibles a Teruel.
- `data/evidence/coverage.json` solo se actualiza al cerrar la pasada completa.

## Estado

- Inicio: **2026-07-15**. Modo: primera pasada profunda de las 115 filas
  heredadas; no se añaden candidatos nuevos antes del cierre transversal.
- Snapshot inicial: **115 filas**; **86 `pendiente`, 11 `parcial`, 18
  `verificado`**. Las 29 filas no pendientes también se reauditan.
- Venta online inicial: **13 `sí`, 102 `no comprobado` y 0 `no`**. Las 13
  positivas pertenecen a altas recientes y se revalidan con su evidencia.
- Categorías principales: Charcutería 23; Aceite 20; Bodega, Trufa y setas y
  Lácteos y quesos 10 cada una; Miel 6; Otros y Fruta y verdura 5 cada una;
  Aceitunas y encurtidos, Azafrán y Chocolate 4 cada una; y 8 filas en
  categorías menores.
- Cobertura inicial: web 85/115, Instagram 52/115, Facebook 4/115, Google Maps
  106/115, teléfono 111/115, correo 96/115, coordenadas 106/115 e imagen 77/115.
  No se enriquecen imágenes en esta pasada; solo se retiran o renombran al
  purgar, fusionar o corregir un slug.
- Evidencia inicial: **29 `keep`**, sin `merge` ni `purge`; corresponde a altas
  de julio de 2026. Teruel no figura todavía en
  `data/evidence/coverage.json`.
- Candidatos: `docs/candidates/teruel.md` conserva lotes DO y de jamón todavía
  no incorporados. No se reabren como fuente de altas hasta TE-10.
- Tras TE-01 (2026-07-15): **114 filas**; **74 `pendiente`, 14 `parcial`, 26
  `verificado`**. Las 12 fichas del lote quedan en 8 verificadas y 4 parciales;
  además se purgó la identidad falsa `rey-sole-mi-olivo-oliete`. Venta online:
  **19 `sí`, 1 `no` y 94 `no comprobado`**; las seis ventas del lote son
  ecommerce. Evidencia acumulada: **40 `keep`, 2 `merge` y 1 `purge`**.
  Diezdedos se corrigió de Lledó a su finca de Cretas y Almazara Artal perdió
  las marcas que estaban incrustadas en el nombre y slug; ambas imágenes se
  renombraron. Impelte queda parcial por la contradicción entre su registro DOP,
  la licencia ambiental de 2025 y el concurso declarado en 2024.
- Tras TE-02 (2026-07-15): **114 filas**; **62 `pendiente`, 17 `parcial`, 35
  `verificado`**. Las 12 fichas del lote quedan en 9 verificadas y 3 parciales.
  Venta online: **24 `sí`, 4 `no` y 86 `no comprobado`**; cinco tiendas propias
  quedaron demostradas y tres productores sin pedido remoto se cerraron como
  `no`. Evidencia acumulada: **52 `keep`, 3 `merge` y 1 `purge`**. Agua de
  Bronchales se corrigió de S.L. a S.A. en nombre, slug e imagen. La web antigua
  de La Carrasca redirige a su tienda canónica actual, Saffron Spain.
- Tras TE-03 (2026-07-15): **114 filas**; **52 `pendiente`, 17 `parcial`, 45
  `verificado`**. Las diez bodegas quedan verificadas; siete aceptan pedidos
  remotos demostrados y Rubus y Mas de Llucia se cierran como `no`. Venta
  online: **31 `sí`, 6 `no` y 77 `no comprobado`**. Evidencia acumulada: **62
  `keep`, 3 `merge` y 1 `purge`**. En Bodegas Salvador la sección «tienda» es
  solo un catálogo sin precio ni pedido utilizable, así que no se infiere venta.
- Tras TE-04 (2026-07-15): **113 filas**; **42 `pendiente`, 17 `parcial`, 54
  `verificado`**. Nueve fichas quedan verificadas y Montruffles se purga tras su
  extinción registral de abril de 2025. Venta online: **37 `sí`, 9 `no` y 67
  `no comprobado`**. Evidencia acumulada: **71 `keep`, 3 `merge` y 2 `purge`**.
  Buscón de Trufas se actualizó a su dirección vigente de Lidón; los viveros de
  planta micorrizada se conservan como productores, no como trufa fresca.
- Tras TE-05 (2026-07-15): **113 filas**; **26 `pendiente`, 18 `parcial`, 69
  `verificado`**. Quince fichas quedan verificadas y Turrones Artesanos Foz se
  cierra como parcial por depender de directorio y Maps. Venta online: **48
  `sí`, 14 `no` y 51 `no comprobado`**; once canales remotos quedan demostrados.
  Evidencia acumulada: **87 `keep`, 9 `merge` y 2 `purge`**. Se normalizaron
  seis slugs que confundían marca, descriptor y razón social: Portesa/Porcino
  Teruel, Qalat/Santa Elena, Casa Conejos S.A.U., Sierra Palomera/La Estrella,
  Horno Villarluengo y Confitería Muñoz; sus imágenes y referencias se movieron
  con ellos.
- Tras TE-06 (2026-07-15): **113 filas**; **16 `pendiente`, 19 `parcial`, 78
  `verificado`**. Nueve queserías quedan verificadas y La Escresola parcial por
  techo de directorio comarcal y Maps. Venta online: **54 `sí`, 17 `no` y 42
  `no comprobado`**; seis ecommerce propios quedan demostrados, mientras Los
  Santanales conserva incertidumbre porque todo su catálogo está agotado.
  Evidencia acumulada: **97 `keep`, 14 `merge` y 2 `purge`**. Se normalizaron
  cinco identidades y sus imágenes: Quesos Hontanar, Freixneda de Cabra, Quesos
  Sierra de Albarracín, Santa Eulalia Ganadera y Quesos Zariche.

## Reglas y riesgos locales

1. Las listas DOP mezclan localidades de Teruel y Zaragoza. Leer cada encabezado
   territorial antes de atribuir nombre, marca o teléfono; no inferir relaciones
   entre entradas contiguas.
2. Separar finca o almazara productiva, domicilio social, tienda y marca. El
   municipio es el de elaboración; una corrección material de identidad o
   municipio exige slug, imagen y `merge` desde el slug histórico.
3. En aceite, melocotón y jamón, el consejo regulador confirma inscripción y lo
   que publique, pero por sí solo suele dejar la fila en `parcial`.
4. En trufa, miel, huevos y huerta, una explotación o directorio puede acreditar
   producción, pero no actividad actual ni venta remota sin otra señal vigente.
5. En charcutería, una tienda o distribuidor no basta: debe existir elaboración
   propia provincial. Distinguir secadero, matadero, comercializadora y marca.
6. Un catálogo, botón genérico de WhatsApp o formulario de contacto no prueba
   pedidos. Exigir carrito utilizable o instrucciones explícitas de encargo por
   teléfono, correo o WhatsApp.
7. Un fallo HTTP, TLS, DNS, bloqueo o timeout no demuestra cierre. Las purgas por
   cierre o inexistencia requieren contraste suficiente.
8. Los teléfonos `974` son una alerta territorial: pueden corresponder a Huesca
   o a Mequinenza aunque la fila o una nota los haya asociado a Teruel.

## Fuentes de cotejo

- Sitio, tienda, red social o ficha Maps gestionada por el productor.
- Consejos reguladores DOP Aceite del Bajo Aragón, Melocotón de Calanda y Jamón
  de Teruel, limitando los claims a lo publicado.
- Gobierno de Aragón, Diputación de Teruel, ayuntamientos, registros públicos y
  directorios institucionales como apoyo, no como prueba automática de actividad
  actual o venta.
- Fuentes mercantiles y prensa fiable para contradicciones, sucesiones, cierres,
  concursos, propiedad o ausencia de canal propio difícil de demostrar.

## Worklist

Tamaño objetivo: 10–16 filas. Los límites se expresan con slugs para que el
alcance no dependa del número de línea.

| Lote | Alcance exacto | Filas iniciales | Estado | Riesgo principal |
|---:|---|---:|---|---|
| TE-00 | Higiene, snapshot y partición | 115 | ✅ 2026-07-15 | Colisión Mi Olivo/Rey Solé y 29 decisiones recientes a reauditar |
| TE-01 | `4-oleum-torrecilla-de-alcaniz` → `cooperativa-del-campo-san-miguel-calanda` | 12 | ✅ 2026-07-15 | 8 verificadas, 4 parciales, 2 merges y 1 purga cruzada |
| TE-02 | `abella-laminera-ojos-negros` → `aguas-del-maestrazgo-canizar-del-olivar` | 12 | ✅ 2026-07-15 | 9 verificadas, 3 parciales, 5 ecommerce y corrección S.A. de Bronchales |
| TE-03 | `bayod-borras-fornoles` → `mas-de-llucia-monroyo` | 10 | ✅ 2026-07-15 | 10 verificadas; 7 ventas remotas, 2 no y 1 catálogo ambiguo |
| TE-04 | `manjares-de-la-tierra-sl-sarrion` → `montruffles-loscos` | 10 | ✅ 2026-07-15 | 9 verificadas y purga registral de Montruffles |
| TE-05 | `portesa-sa-teruel` → `turrones-artesanos-foz-beceite` | 16 | ✅ 2026-07-15 | 15 verificadas, 1 parcial, 11 ventas remotas y 6 slugs normalizados |
| TE-06 | `cooperativa-aguilar-nueva-vision-s-coop-quesos-hontanar-aguilar-del-alfambra` → `zariche-teruel-sl-quesos-zariche-celadas`, más `quesos-artesanos-la-val-mezquita-de-jarque` | 10 | ✅ 2026-07-15 | 9 verificadas, 1 parcial, 6 ecommerce y 5 slugs normalizados |
| TE-07 | `asociacion-de-recolectores-y-cultivadores-de-patata-de-cella-cella` → `turotrans-tierra-mudejar-santa-eulalia` | 16 | ✅ 2026-07-15 | 12 verificadas, 1 parcial, 3 purgas de distribuidores/tienda, 4 ventas online y 6 slugs normalizados |
| TE-08 | `rokelin-teruel` → `jamones-el-rullo-villarluengo` | 14 | ✅ 2026-07-15 | 13 verificadas, 1 parcial, 11 ventas remotas y 4 estados online ambiguos resueltos |
| TE-09 | `el-calamochino-calamocha` → `cooperativa-san-miguel-juncoliva-valjunquera` | 14 | ✅ 2026-07-15 | 7 verificadas, 7 parciales, 7 ventas remotas, 3 no y 4 indisponibles/ambiguas |
| TE-10 | Auditoría transversal, candidatos diferidos y cierre | variable | ✅ 2026-07-15 | 12 altas (7 verificadas, 5 parciales), candidatos cerrados y corrección Torre de las Arcas |
| TE-11 | Ola 3: residual `venta-sin-resolver` | 21 | ✅ 2026-07-29 | 2 pedidos directos resueltos y 19 indisponibles o todavía ambiguos |

## Incidencias reutilizables

- **Mi Olivo / Rey Solé:** el registro DOP coloca a Antonio Rey Solé en
  Mequinenza (Zaragoza), mientras que Mi Olivo pertenece a Apadrinaunolivo.org
  en Oliete. No son duplicados ni una sola identidad.
- **Diezdedos:** la finca y almazara se publican en Cretas; referencias antiguas
  a Lledó describen la carretera o el entorno, no el municipio productivo.
- **Aceites Impelte:** no interpretar el concurso voluntario como cierre. La DOP
  aún lo lista y una licencia ambiental de 2025 apunta a continuidad, pero falta
  una fuente primaria actual que cierre la contradicción.
- **San Miguel de Calanda:** el dominio oficial responde con una página vacía;
  conservarlo como enlace conocido no demuestra tienda ni cierre.
- **Agua de Bronchales:** las fuentes oficiales actuales publican la forma
  jurídica S.A.; el `SL` heredado era una identidad incorrecta, no una segunda
  embotelladora.
- **La Carrasca:** `azafranlacarrasca.com` redirige a la tienda oficial vigente
  `saffronspainteruel.com`; no tratar el cambio de dominio como cierre.
- **Montruffles:** no confundir la ficha institucional todavía publicada con
  actividad actual; la sociedad fue disuelta y extinguida en abril de 2025.
- **Frutos Secos Alcañiz / Unió Nuts:** la cooperativa histórica fue absorbida
  con disolución sin liquidación en 2024. La planta y los agricultores continúan
  bajo Unió Nuts; conservar la unidad productiva de Alcañiz con la identidad actual.
- **ADANBER / Carpomar:** la ficha antigua de huevos comparte parcela y teléfono
  con Carpomar, cuya actividad actual es distribución mayorista. No mantenerla
  como productor solo porque el directorio la clasifique dentro de «productores».
- **Torre de Arcas / Torre de las Arcas:** son municipios distintos y separados
  por más de 50 km. Cultivos Forestales y Micológicos está en Torre de las
  Arcas; se corrigieron municipio, slug, evidencia e imagen en TE-10.

## Cierre provincial

- Filas finales: **122**.
- Verificación: **99 `verificado`**, **23 `parcial`**, **0 `pendiente`**.
- Venta remota: **71 `sí`**, **32 `no`**, **19 `no comprobado`**.
- Auditoría de calidad provincial: **0 errores y 0 avisos**.
- Las 122 filas tienen un `keep` vigente y decisión idéntica al CSV; Teruel
  queda añadido a `data/evidence/coverage.json` con cobertura estricta.
- La nota `docs/candidates/teruel.md` no conserva candidatos abiertos de esta
  pasada; las nuevas propuestas deben entrar como hallazgos posteriores.
- La Ola 3 confirma encargos por teléfono o correo para Bodegas Salvador y El
  Calamochino. Aceite Centenario sigue sin DNS y Sierra de Mora redirige a una
  tienda protegida; esas indisponibilidades no se convierten en falsos `no`.
