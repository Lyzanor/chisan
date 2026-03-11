# Opciones de mejora visual

Resumen de la interfaz actual y propuestas concretas, ordenadas por impacto y esfuerzo.

---

## 1. Tipografía y jerarquía

**Estado:** Fraunces en títulos, Avenir Next en cuerpo. Texto secundario en `--text-muted`.

**Opciones:**

- **Cargar Fraunces por Google Fonts**  
  Ahora depende de que esté instalada en el sistema. Añadir en `layout.tsx` un `<link>` a Google Fonts (Fraunces + variable o pesos 400/600/700) para que se vea igual en todos los dispositivos.

- **Subir un escalón el tamaño del cuerpo en móvil**  
  En el breakpoint `620px`, el cuerpo está en ~0.84rem; subir a 0.9375rem (15px) mejora legibilidad sin romper el layout.

- **Diferenciar más el hero del listado**  
  Aumentar ligeramente el tamaño del `h1` del catálogo (p. ej. `clamp(1.65rem, 2.6vw, 2.2rem)`) y/o el letter-spacing del subtítulo para que el hero se sienta más “cabecera” y menos “primera fila”.

---

## 2. Búsqueda y filtros

**Estado:** Input + botón en una barra redondeada; chips de categoría en scroll horizontal.

**Opciones:**

- **Focus visible en el input**  
  Añadir `outline: 2px solid var(--accent); outline-offset: 2px` (y quitar outline en `:focus`) solo cuando `:focus-visible` para teclado y no penalizar el click.

- **Micro-animación en el botón “Buscar”**  
  Transición corta en `background-color` y `transform: scale(0.98)` en `:active` para feedback táctil.

- **Sombra suave en la barra de búsqueda**  
  `box-shadow: 0 2px 8px rgba(47, 42, 36, 0.06)` en `.catalog-search` para separarla un poco del fondo.

- **Scroll de categorías más evidente**  
  Estilo custom del scrollbar (por ejemplo con `scrollbar-color` y `scrollbar-width: thin` ya está; en WebKit añadir `::-webkit-scrollbar` con altura baja y color alineado a la paleta) para que se entienda que hay más chips.

---

## 3. Lista de productores (cards)

**Estado:** Grid con thumb (emoji), nombre, badges, ubicación y CTA.

**Opciones:**

- **Hover en la card completa**  
  En `.producer-card`: `transition: box-shadow, border-color` y en `:hover` una sombra un poco más marcada y `border-color: var(--line-strong)` para que la fila se sienta interactiva sin depender solo del enlace del nombre.

- **Alinear altura de thumbs**  
  Si en algún breakpoint las cards tienen alturas distintas, usar `min-height` en `.producer-thumb` (o en la fila) para que los iconos queden alineados en una misma línea base.

- **“Ver ficha completa” como botón primario**  
  En lugar de estilo “secundario” (borde + fondo claro), usar el mismo estilo que “Buscar”: fondo `var(--accent)`, texto blanco, para marcar claramente la acción principal de la card.

---

## 4. Mapa

**Estado:** Contenedor con título, contador y canvas Leaflet; pins con punto verde.

**Opciones:**

- **Borde del contenedor del mapa**  
  Ya existe `.map-shell`; asegurar que el mapa (o el placeholder) esté siempre dentro de ese shell con `border-radius` para que no se “salga” del estilo del resto.

- **Pins con estado “destacado”**  
  Si `highlightedItem` existe, el pin del productor destacado podría ser un poco más grande (p. ej. escala 1.2) o con un anillo/borde más grueso para que se vea claramente cuál es.

- **Altura del mapa en móvil**  
  Revisar si 290px en el breakpoint 900px es cómodo; se puede probar `min-height: 260px` y `height: 50vmin` (con un max-height) para que escale con la pantalla.

---

## 5. Página de detalle (/p/[id])

**Estado:** Enlace “Volver”, hero con nombre y enlaces, tabla de campos CSV.

**Opciones:**

- **Enlace “Volver” más visible**  
  Darle un poco más de peso (por ejemplo icono ← ya está; añadir `font-weight: 600` y color `var(--accent-strong)` en hover) para que sea la primera acción clara.

- **Enlaces (Web, Maps, etc.) como botones**  
  Ya tienen estilo pill; se puede unificar con el CTA “Ver ficha” (o con el botón Buscar) para que todos los enlaces externos compartan el mismo lenguaje visual.

- **Tabla más respirable**  
  Aumentar un poco el `padding` de `th`/`td` (por ejemplo 0.65rem 0.75rem) y, si hay muchas filas, considerar `tbody tr:hover { background: var(--surface-soft); }` para seguir la fila.

- **Sección “Campos del CSV”**  
  Si quieres restar peso técnico, el título puede ser “Información del productor” o “Datos”; el contenido sigue siendo la tabla de campos.

---

## 6. Sistema de color y contraste

**Estado:** Variables CSS coherentes; fondo con gradiente radial; acento verde.

**Opciones:**

- **Reforzar contraste en texto secundario**  
  Revisar `--text-muted` en fondos claros (p. ej. sobre `--surface-soft`) para cumplir WCAG AA en texto pequeño (por ejemplo subir un poco la oscuridad del gris).

- **Modo oscuro (opcional)**  
  Si en el futuro se plantea, las variables están bien agrupadas en `:root`; se podría añadir `[data-theme="dark"]` con variables alternativas (fondo oscuro, `--text-main` claro, acento más claro).

- **Un “momento” de color**  
  Reservar un único elemento fuerte de color (por ejemplo solo el botón “Buscar” o solo el chip activo) y mantener el resto más neutro para que ese punto destaque más.

---

## 7. Detalles globales

- **Transiciones cortas**  
  Donde haya hover/focus (enlaces, botones, cards), usar `transition: 0.15s ease` (o similar) en las propiedades que cambien para que la interfaz se sienta más pulida.

- **Consistencia de radios**  
  Ya usas `--radius-xl`, `--radius-lg`, `--radius-md` y pills (999px); mantener los pills para CTAs y chips y el resto para contenedores evita sensación de “mezcla” de estilos.

- **Espaciado vertical entre secciones**  
  Revisar que el espacio entre hero, categorías, mapa y lista sea regular (por ejemplo un único `--space-section: 1.25rem` y aplicarlo entre bloques) para un ritmo más claro.

---

## Priorización sugerida (rápido impacto)

1. Cargar Fraunces por Google Fonts y focus visible en búsqueda (accesibilidad + consistencia).
2. Hover en cards y CTA “Ver ficha” como botón primario (claridad de acciones).
3. Pin destacado en el mapa y “Volver” más visible en la ficha (orientación del usuario).

Si indicas qué área quieres tocar primero (búsqueda, lista, mapa o ficha), se pueden bajar estas ideas a cambios concretos en `globals.css` y en los componentes correspondientes.
