# Girona · verificación — snapshot de mantenimiento

Pasada profunda **cerrada el 2026-06-15** (27 lotes + pasada de consistencia);
mantenimiento de venta **V-02 el 2026-07-29**. Detalle por lote en
`git log --follow -p -- docs/verificacion/girona.md`; procedencia por fila en
`data/evidence/catalunya/girona.jsonl`. La verdad es el CSV; cerrar la pasada no
cierra el catálogo y las afirmaciones dinámicas caducan.

## Estado final de la pasada (2026-06-15)

- Filas: **241** · verificado **239** · parcial **2** · pendiente **0**. Desde el inicio: 8 purgas,
  1 fusión, 7 altas concurrentes (cruce Rutes del Vi).
- `Venta online`: **131 `sí`** (todos con canal y dependencias válidas), **101
  `no`** y **9 `no comprobado`** con techo documentado.
- Evidencia: 241 `keep` + tombstones; la provincia está en `data/evidence/coverage.json` (advisory).
- Completitud ~99%: penaliza los `no comprobado`, no es cola sin revisar.

## Residuales justificados

- 2 `parcial`: **Làctics Tramuntana** (Cabanelles; existencia respaldada, última actividad propia
  localizada 2020) y **Can Solivera** (Forallac; continuidad contradictoria, web propia convertida
  en alojamiento, sin perfil social).
- `no comprobado` tras V-02: **Aigua de Sant Aniol** (solo reventa
  independiente), **Arròs Molí de Pals** (seis referencias no disponibles),
  **Molí de Ger** (remite a Mercat Arrels sin ficha comprable actual),
  **Embotits Vilanova** (carrito sin precio ni alta de producto), **Can
  Solivera** (dominio roto y continuidad propia no demostrada), **Red Passion
  Berries** (tienda propia en timeout), **Clos de la Torre** (catálogo sin
  referencia disponible), **Oliver Conti** (TLS inválido y HTTP 403) y **Mas
  Patiràs** (el enlace de compra de la DO devuelve 404).

## Mantenimiento V-02 · venta sin resolver

- Se resolvieron **8 de 17**: `sí` para **Martín Faixó** (`ecommerce`), **Gelats
  Enxaneta** (`email` de pedidos), **Xuixo Castelló** (`ecommerce`), **Or de
  l'Albera** (`ecommerce` enlazado a Canigó Oil), **Alma Teas** (`ecommerce`) y
  **Llívins** (`marketplace` colectivo de la Diputació); `no` para **Recuits de
  Fonteta** y **Aldea de Buscarós** tras revisar sus canales actuales.
- **Xuixo Castelló**, **Embotits Vilanova** y **Or de l'Albera** perdieron el
  texto genérico de importación; **Alma Teas** apunta ahora a su web de marca y
  **Gelats Enxaneta** al correo explícito de pedidos.
- No se forzaron como negativas las tiendas agotadas, los carritos incompletos,
  la reventa independiente ni los fallos de TLS, timeout o 404.

## Reglas locales (no revertir sin nueva evidencia)

- Purgas con causa firme: **Popaire** (NIF revocado 2023, dominio aparcado), **Can Calet** (renombrada
  Establiments Calet, objeto social → alojamientos, 2026), **La Brava** (extinción en BORME),
  **Trull d'en Francesc** (es restaurante), **Can Gombau** (vermutería; su vermut lo elabora una coop
  de Capmany), **Mar de Formatges** (comercio), **Formatgeria de Llívia** (hoy restaurante),
  **Cargol Bover** (entidad no demostrable).
- Fusión: **Vins de Taller** → `clos-de-basella-siurana` (misma sociedad y teléfono).
- Identidades actualizadas (slug estable): Finca Bell-Lloc se presenta como **Celler Brugarol**;
  L'Arbreda = marca **Mas L'Arbreda**; Làctics Vall de Ribes = **Ca l'Esteve** (desde 2023 compra la
  leche a otra granja del Ripollès, sigue siendo obrador); Gelats Janeret = **Golafreria Janeret**
  (Plaça Major); **Masia Serra** salió de la DO Empordà; **Cal Flequer** = obrador en Cornellà del
  Terri; **Quevall** ubicada en Llançà.
- Webs legítimas solo-HTTP con TLS roto — no forzar HTTPS ni borrar: Arròs Avi Trias, Celler
  Arché Pagès (subdominio catalán), Celler Can Sais.
- Ventas que NO son ecommerce de producto: **Mas Llunes** y **Mas la Coromina** (checkout solo de
  visitas/experiencias/vales), **La Fageda** (no vende directo; remite a supermercados online →
  `marketplace`), **Mas Molla / Recuits Nuri / Granja Mas Bes** (venta física en masía/agrobotiga).
- **Arròs Mas Pla**: contacto comercial en Torroella de Montgrí, producción y cultivos en Pals →
  `municipio=Pals`. **Mooma**: CP correcto 17256.
- 16 grupos de coordenadas compartidas revisados: centroides prudentes de productores distintos,
  no duplicados.

## Fuentes locales y límites

- **ATO** (perfiles individuales de granjas lecheras) y **Lletera Campllong** (página de granjas
  asociadas): confirman continuidad y ubicación de explotaciones sin web.
- **ACREFA**, **Gastroteca**, **Girona Excel·lent**: existencia/gama; no prueban venta remota.
- **DO Empordà** (consejo): adscripción y contacto; no infiere actividad actual (Masia Serra salió).
- **Producte del Ripollès**: directorio — no usarlo como web del productor.
- **Agrobotigues** (coop. Espolla): tienda colectiva válida como canal del productor.

## Mantenimiento (al retomar)

- Recomprobar los 131 `Venta online=sí` (seis revisados en V-02 y el resto con
  última comprobación general 2026-06-15) y los 9 `no comprobado`.
- Vigilar los 2 `parcial` (Tramuntana, Can Solivera) por señales de cierre definitivo.
- La nota de candidatos de Girona quedó cerrada; pistas nuevas → `docs/candidates/girona.md`.
