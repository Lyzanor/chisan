# Candidatos — Toledo

> Origen: pasada **DO menos cubiertas** (2026-07), lote 18 (DOP Montes de Toledo,
> parte toledana) + queserías DOP Queso Manchego heredadas de `cuenca.md`. Ambos
> bloques quedaron integrados en las fases B y C (≈15 altas, incluidas las 7
> cooperativas del corte «sin web»); lo integrado está en
> `data/csv/castilla-la-mancha/toledo.csv` y el detalle por lote, en el historial
> git. Dedup rehecho el 2026-08-03: solo queda la entrada de abajo.

## Cola pendiente (1)

- [ ] **IFAMA, S.L.** — Aceite. Noez. <http://www.arzuaganavarro.com>. ⚠ Del
  **grupo Arzuaga Navarro / Amaya Arzuaga** (Ribera del Duero, hotel 5* +
  Michelin): la web es la del grupo y no da identidad ni tienda de AOVE toledano.
  Confirmar marca de AOVE con venta propia y el encaje frente a la regla de
  grupo antes de crear fila.

## Avisos reutilizables

⚠ **Homónimas que rompen el dedup:** «Coop. Ntra. Sra. de la Antigua» existe en
**Mora** (marca **Olimora**, web `cooperativalaantigua.com`) y en **Los
Navalmorales** (sin web). Son entidades distintas y ambas están ya en el CSV con
slug propio; Olimora es de la de Mora. Cuidar slug y municipio.

⚠ **La etiqueta «sin web» del registro de la DOP es poco fiable:** de las 7
cooperativas que el consejo daba por sin web, varias tenían web propia y tienda
operativa (Belvís, El Romeral, Jaramontes). Buscarlas antes de darlas por
`parcial`.

⚠ **Aceites Toledo, S.A.** (Los Yébenes) es operador propio e independiente desde
1954, no el brazo comercial de la Coop. de la Antigua de Mora, aunque el consejo
enlace su ficha bajo esa entrada.

⚠ **Fuentes:** `mtoledo.org` y `aceitemontesdetoledo.com` no resuelven o
bloquean; el dominio real del consejo es **`domontesdetoledo.com`** (responde con
UA de navegador), con ficha `/slug/` por empresa: dirección completa (CP +
municipio + provincia), web y email → fuente limpia para fijar el municipio de
producción.
