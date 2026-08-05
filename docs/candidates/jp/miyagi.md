# Miyagi — candidatos

- CSV: `data/csv/jp/tohoku/miyagi.csv` (9 filas, altas del 2026-08-05).
- Fuente: 宮城県酒造組合 (gremio, autoritativo), <https://miyagisake.jp/kuramoto/> — los 24 miembros con 社名 y municipio (leído 2026-08-04).
- Estado: **9 integradas** el 2026-08-05 (7 `verificado`, 2 `parcial`); quedan 15. Evidencia en `data/evidence/jp/tohoku/miyagi.jsonl`.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Abekan Shuzo | 阿部勘酒造 | Shiogama |
| Uchigasaki Shuzoten | 内ヶ崎酒造店 | Tomiya |
| Sasaki Shuzoten | 佐々木酒造店 | Natori |
| Moritami Shuzoten | 森民酒造店 | Osaki |
| Kanbai Shuzo | 寒梅酒造 | Osaki |
| Tanaka Shuzoten | 田中酒造店 | Kami |
| Yamawa Shuzoten | 山和酒造店 | Kami |
| Nakayu Shuzoten | 中勇酒造店 | Kami |
| Kawakei Shoten | 川敬商店 | Misato |
| Chida Shuzo | 千田酒造 | Kurihara |
| Kanenoi Shuzo | 金の井酒造 | Kurihara |
| Ishikoshi Jozo | 石越醸造 | Tome |
| Kakuboshi | 角星 | Kesennuma |
| Onuma Shuzoten | 大沼酒造店 | Murata |
| Zao Shuzo | 蔵王酒造 | Shiroishi |

## Integradas 2026-08-05 (9)

| bodega | municipio | resultado |
|---|---|---|
| Ichinokura | Osaki | verificado · venta sí |
| Otokoyama Honten | Kesennuma | verificado · venta sí |
| Katsuyama Shuzo | Sendai | verificado · venta sí |
| Saura (Urakasumi) | Shiogama | verificado · tienda física |
| Niizawa Jozoten | Osaki ⚠ | verificado · sin carrito |
| Hagino Shuzo | Kurihara | verificado · sin carrito |
| Taiwagura Shuzo | Taiwa | verificado · sin carrito |
| Suminoe Shuzo | Ishinomaki | **parcial** · sin web |
| Heiko Shuzo | Ishinomaki | **parcial** · sin web |

⚠ **Miyagi tiene tres municipios que resolvían al sitio equivocado**, y es la
prefectura con más homónimos vistos hasta ahora:
- `kami` → 香美町 (Hyogo) en vez de 加美町, donde están tres bodegas de la cola.
- `shiroishi` → 白石町 (Saga) en vez de 白石市, donde está 蔵王酒造.
- `misato` → 美郷町 (Shimane), y además hay 美里町 en Kumamoto y en Saitama.

Los dos primeros quedan resueltos en `municipality-overrides.json` el
2026-08-05, **antes** de escribir esas filas. `misato` sigue sin resolver
porque hace falta decidir entre cuatro candidatos: hacerlo al integrar 川敬商店.

- ⚠ **Niizawa es un caso de sede contra planta.** Tras 2011 trasladó la
  elaboración a **Kawasaki-machi** y reconstruyó la sede en Osaki en 2013. La
  fila toma Osaki, que es lo que dan el gremio y su domicilio social, pero si la
  unidad productiva sigue en Kawasaki hay que corregirla.
- **`urakasumi.com/shop/` son tiendas físicas**, no carrito. Tercer falso
  positivo de la palabra «shop» tras Sachihime y Nabeshima en `saga.md`.
- **Suminoe y Heiko no tienen web propia**: cuarto y quinto caso del patrón tras
  Hiroki, Takagi y Aihara. Las marcas cotizadas del segmento premium venden por
  distribuidor y no publican nada.

## Trampas
- El gremio da **barrio, no municipio** en varias (仙台市泉区, 大崎市松山,
  大崎市三本木, 大崎市古川, 栗原市栗駒/一迫/金成): el `municipio` del CSV es la
  ciudad — Sendai, Osaki, Kurihara.
- 塩竈 / 塩釜: el gremio escribe las dos grafías para la misma ciudad (Shiogama).
- **Kesennuma e Ishinomaki** fueron arrasadas por el tsunami de 2011 y varias de
  estas bodegas se reconstruyeron o se trasladaron: la dirección histórica puede
  no ser la actual. Confirmar sede productiva antes de fijar coordenadas.

## Qué falta
- Ningún dominio recogido: primer trabajo de cada lote.
- Sin abrir: 笹かまぼこ de Sendai, ostra y marisco de Matsushima/Kesennuma, ternera
  de Sendai, arroz Hitomebore, 味噌/醤油.
