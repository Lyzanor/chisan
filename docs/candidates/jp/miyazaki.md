# Miyazaki — candidatos

- CSV: `data/csv/jp/kyushu-okinawa/miyazaki.csv` (1 fila: Kyoya Shuzo, Nichinan, destilados). Dedup: ninguna de abajo solapa.
- Fuentes: 日本酒造組合中央会, <https://japansake.or.jp/sakagura/jp/miyazaki/> (pág. 1 de 4) y 宮崎県酒造組合, <https://www.miyazaki-sake.or.jp/> (reparte por 7 comarcas; la página del área de Miyazaki añade cuatro más). Leídas 2026-08-04.
- Estado: cola abierta, 16 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Miyazaki es **la primera prefectura de Japón en 焼酎** y prácticamente no hace
sake: el censo de SAKETIMES solo le encuentra 2 bodegas, mientras el gremio real
tiene decenas de destilerías. Categoría por defecto: `Destilados y licores`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Kuroki Honten | 黒木本店 | Takanabe ⚠ |
| Osuzuyama Joryusho | 尾鈴山蒸留所 | Kijo ⚠ |
| Iwakura Shuzo | 岩倉酒造 | Saito |
| Yamaya Joryusho | やまや蒸留所 | Saito |
| Watanabe Shuzojo | 渡邊酒造場 | Miyazaki |
| Kawagoe Shuzojo | 川越酒造場 | Miyazaki |
| Ochiai Shuzojo | 落合酒造場 | Miyazaki |
| Unkai Shuzo (Aya) | 雲海酒造 綾蔵 | Aya ⚠ |
| Ikoma Kogen Shuzo | 生駒高原酒造 | Kobayashi |
| Sato Shochu Seizojo | 佐藤焼酎製造場 | Nobeoka |
| Akugare Joryusho | あくがれ蒸留所 | Hyuga |
| Kawasaki Jozojo | 川崎醸造場 | Morotsuka |
| Fujimoto Honten | 藤本本店 | Morotsuka |
| Takachiho Shuzo | 高千穂酒造 | Takachiho |
| Sentoku Shuzo | 千徳酒造 | Nobeoka — `Sake` |
| Hombo Shuzo (Kobayashi) | 本坊酒造 小林工場 | Kobayashi ⚠ |

## Trampas
- ⚠ **黒木本店 y 尾鈴山蒸留所 son la misma casa**: la segunda es la destilería de
  montaña de la primera. Pueden ser dos filas (dos municipios, dos marcas) o una;
  decidirlo explícitamente, no por descuido.
- ⚠ **本坊酒造 小林工場** es planta del **Hombo Shuzo que ya está en
  `data/csv/jp/kyushu-okinawa/kagoshima.csv`**. Si no tiene marca e identidad
  propias, no es fila nueva: es la de Kagoshima.
- ⚠ **`aya` ya está desambiguado** en `data/reference/municipality-overrides.json`
  frente a su homónimo español (`AGENTS.md` de Japón): 綾町 pasa el gate sin
  tocar nada. Y 雲海酒造 綾蔵 es planta de un grupo grande: triar.
- **宝酒造 黒壁蔵 (Takanabe)** es planta de Takara (Kioto): mismo triaje.
- **千徳酒造 (Nobeoka)** es de las poquísimas bodegas de **sake** de la
  prefectura: la excepción que confirma el patrón.
- 東臼杵郡諸塚村 (Morotsuka) es 村, y 児湯郡 no es municipio.

## Qué falta
- Las 3 páginas restantes del listado del gremio nacional y las 6 comarcas del
  gremio prefectural sin recorrer (高千穂, 延岡・日向, 西都・高鍋, えびの・小林,
  都城, 日南・串間). **都城 es la mayor zona de shochu del país** y aquí no hay
  ninguna.
- Sin abrir: **完熟マンゴー (太陽のたまご)**, 日向夏, 宮崎牛 (campeón nacional
  tres veces), みやざき地頭鶏 (pollo con marca), 千切り大根, 釜揚げうどん.
