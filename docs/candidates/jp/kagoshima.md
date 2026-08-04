# Kagoshima — candidatos

- CSV: `data/csv/jp/kyushu-okinawa/kagoshima.csv` (2 filas: Hombo Shuzo y Kanosuke Distillery, destilados). Dedup: ver la nota sobre 本坊酒造.
- Fuente: 鹿児島県酒造組合, <https://www.honkakushochu.or.jp/kuramoto/> — **122 蔵元**, el gremio más grande de esta pasada (leído 2026-08-04).
- Estado: cola abierta, 17 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Aquí el gremio no es de sake: es de **本格焼酎** de batata, con Indicación
Geográfica (薩摩焼酎). Categoría para todas: `Destilados y licores`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Nishi Shuzo | 西酒造 | Hioki ⚠ |
| Komasa Jozo | 小正醸造 | Hioki ⚠ |
| Hamada Shuzo (Denzoin) | 濵田酒造 傳藏院蔵 | Ichikikushikino ⚠ |
| Satsuma Kinzangura | 薩摩金山蔵 | Ichikikushikino ⚠ |
| Shirakawa Shuzo | 白石酒造 | Hioki ⚠ |
| Wakamatsu Shuzo | 若松酒造 | Hioki ⚠ |
| Yamatozakura Shuzo | 大和桜酒造 | Hioki ⚠ |
| Tasaki Shuzo | 田崎酒造 | Ichikikushikino ⚠ |
| Matsuzaki Shuzo | 松﨑酒造 | Hioki ⚠ |
| Nangoku Shuzo | 南国酒造 | Hioki ⚠ |
| Satsuma Hamadaya Denbee | 薩州濵田屋伝兵衛 | Ichikikushikino ⚠ |
| Sata Souji Shoten | 佐多宗二商店 | Minamikyushu ⚠ |
| Sakurai Shuzo | 櫻井酒造 | Minamikyushu ⚠ |
| Satsuma Shuzo (Ei) | 薩摩酒造 頴娃蒸溜所 | Minamikyushu ⚠ |
| Satsuma Muso | さつま無双 | Kagoshima |
| Azuma Shuzo | 東酒造 | Kagoshima |
| Sanwa Shuzo | 三和酒造 | Kagoshima ⚠ |
| Sagara Shuzo | 相良酒造 | Kagoshima |

## Trampas
- ⚠ **El gremio agrupa por「エリア」, y sus áreas NO son municipios.**「伊集院」es
  un barrio de 日置市 (**Hioki**) pero la zona abarca también 市来 e 串木野, hoy
  **いちき串木野市 (Ichikikushikino)**;「知覧」es parte de 南九州市
  (**Minamikyushu**) desde 2007;「頴娃」también. **Cada municipio de esta tabla
  hay que confirmarlo uno a uno contra la web de la destilería** — el reparto de
  arriba es una propuesta, no la fuente.
- ⚠ **本坊酒造 鹿児島工場 ya está en el CSV** como Hombo Shuzo: no volver a
  proponerlo. Y ojo, tiene además 本坊酒造 小林工場 en Miyazaki (`miyazaki.md`) y
  la Mars Whisky de Nagano: es un grupo repartido por medio Japón.
- ⚠ **三和酒造 (Kagoshima)** no es 三和酒造 (Shizuoka), en `shizuoka.md`. Mismo
  社名, una hace shochu y la otra sake.
- **Kanosuke Distillery (Hioki), ya en el CSV, es de 小正醸造**, que está en esta
  tabla: decidir si son una fila o dos (whisky y shochu, mismo grupo, mismo
  municipio).
- **相良酒造 (Kagoshima)** no es 相良酒造 (Tochigi), en `tochigi.md`.

## Qué falta
- **~104 destilerías del gremio sin listar**: esta tabla es la primera pantalla
  de 122. Las áreas de 出水, 加治木, 大隅, 鹿屋, 種子島 y **奄美** están sin tocar,
  y Amami es especial: es la única zona de Japón autorizada a hacer
  **黒糖焼酎** (shochu de azúcar moreno), con GI propia.
- Sin abrir: **かつお節 de Makurazaki** (la primera del país, con obradores
  familiares); 鹿児島黒豚 y 黒牛; **té de Kagoshima** (segunda de Japón tras
  Shizuoka y creciendo); さつまいも; 桜島小みかん y 桜島大根; あくまき.
