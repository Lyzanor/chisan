# Candidatos — Zaragoza

> Fichero creado en la pasada **DO menos cubiertas** (`docs/candidates/do-huecos.md`).
> Formato estándar de `docs/candidates/README.md`. Cada bloque indica su fuente,
> fecha y estado. **Aviso de coordinación**: el lote 24 (DO Cariñena + Campo de
> Borja + Calatayud) también escribe aquí — añadir sección nueva sin tocar las
> anteriores.

## Aceite del Bajo Aragón + Melocotón de Calanda (lote 15 de do-huecos)

> Origen: **cola del lote 13** (los operadores turolenses se escribieron en
> `teruel.md`; estos son los de **provincia de Zaragoza**). Fuentes: registro de
> productores del Consejo DOP Aceite del Bajo Aragón
> (`aceitedelbajoaragon.es/productores/`, 11 empresas zaragozanas) y «Auténticos
> Productores» del Consejo DOP Melocotón de Calanda
> (`melocotondecalanda.com/autenticos-productores/`, 6 empresas zaragozanas en
> Nonaspe/Maella/Caspe/Chiprana). Dedup contra `zaragoza.csv` el 2026-07-09 (por
> dominio, teléfono y nombre sin acentos/sufijos): **7 ya presentes** (Almazara
> de Jaime, Molino Alfonso, Coop. San Isidro de Fabara, Alcañiz Millán/Molí de
> Casto, Coop. San Lorenzo de Maella, Almazara Gil Egerique, y **Alejandro y
> Miguel** = `alejandro-y-miguel-s-c-nonaspe`). Netos: **8**. Estado:
> **`unverified`**. La comarca (Caspe/Maella/Belchite/Mequinenza) ya está bastante
> cubierta en el CSV → hueco real pequeño.

- [ ] **Granja Brunet** (Granja Brunet, S.L.U.) — Aceite (+ melocotón/fruta).
  Fabara. Tel 650 434 744 · <http://www.granjabrunet.com> ·
  info@granjabrunet.com. AOVE del Bajo Aragón con tienda online → pista
  `Venta online=sí`.
- [ ] **Oliflix** — Aceite. Mequinenza. Tel 974 464 722 ·
  <http://www.oliflix.com> · info@oliflix.com. AOVE de Mequinenza, marca propia.
- [ ] **La Chipranesca** (La Chipranesca, S.C.L.) — Aceite (+ fruta). Chiprana.
  Tel 976 637 240 · <http://www.lachipranesca.com>. Cooperativa con marca propia
  (AOVE + melocotón).
- [ ] **Frutícola Maellana** (marca **Fruma**) — Fruta y verdura (melocotón de
  Calanda; también aceite). Maella. Tel 976 638 165 · <http://www.fruma.es> ·
  cooperativa@fruma.es. Aparece en ambos registros (aceite y melocotón).
- [ ] **Frutícola Bajoaragonesa** (Frutícola Bajoaragonesa S.C. 2ºG) — Fruta y
  verdura (melocotón de Calanda). Caspe. Tel 976 633 315 ·
  <http://www.fruticola-bajoaragonesa.com>. ⚠ confirmar marca de consumo vs
  central hortofrutícola B2B.
- [ ] **Cooperativa Frutícola Compromiso de Caspe** — Aceite (+ melocotón).
  Caspe. Tel 976 632 159 · frucas1@telefonica.net. ⚠ confirmar marca propia
  (posible granel/servicio).
- [ ] **Frumaspi Agrícola** (Frumaspi Agrícola, S.L.) — Fruta y verdura
  (melocotón de Calanda). Maella. Tel 876 708 028. Sin web localizada. ⚠
  confirmar marca de consumo.
- [ ] **Cooperativa Agraria San Sebastián** — Aceite. Fayón. Tel 976 635 674 ·
  cooperativasansebastian@hotmail.es. ⚠ cooperativa pequeña, confirmar marca vs
  granel antes de integrar.

### Notas del lote 15

- **Solapes registro aceite ↔ melocotón**: *Coop. San Lorenzo de Maella*
  (magalia.org) y *Frutícola Maellana* (fruma.es) figuran en los dos consejos
  (hacen AOVE y melocotón). La primera ya está en CSV como
  `cooperativa-agricola-san-lorenzo-maella`; para Fruma, valorar una sola ficha
  con doble categoría al integrar.
- **Ya en CSV (no altas)**: Almazara de Jaime (Belchite), Almazara Molino
  Alfonso (Belchite), Coop. del Campo San Isidro (Fabara), Aceites Alcañiz
  Millán/Molí de Casto (Maella), Coop. Agrícola San Lorenzo (Maella), Almazara
  Gil Egerique/Torre Maella (Maella), Alejandro y Miguel S.C. (Nonaspe).
- **Método**: `aceitedelbajoaragon.es/productores/` responde sin `www`; el listado
  de Calanda se carga por JS (`{title}`), pero la página
  `/autenticos-productores/` sí trae el HTML con CP·municipio·provincia y web.
