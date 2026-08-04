# Akita — candidatos

- CSV: `data/csv/jp/tohoku/akita.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/akita> (42 bodegas, leído 2026-08-04). Gremio: 秋田県酒造組合, <http://www.osake.or.jp/>.
- Estado: cola abierta, 16 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Categoría para todas: `Sake`. El rōmaji de `nombre` y `municipio` es propuesta a
confirmar contra la web de cada bodega.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Aramasa Shuzo | 新政酒造 | Akita |
| Akita Shurui Seizo | 秋田酒類製造 | Akita |
| Akita Jozo | 秋田醸造 | Akita |
| Akita Shuzo | 秋田酒造 | Akita |
| Nawa Shoten | 那波商店 | Akita |
| Akita Seishu | 秋田清酒 | Daisen |
| Kariho Shuzo | 刈穂酒造 | Daisen |
| Dewatsuru Shuzo | 出羽鶴酒造 | Daisen |
| Fukunotomo Shuzo | 福乃友酒造 | Daisen |
| Suzuki Shuzoten | 鈴木酒造店 | Daisen |
| Azakura Shuzo | 阿櫻酒造 | Yokote |
| Asamai Shuzo | 浅舞酒造 | Yokote |
| Hinomaru Jozo | 日の丸醸造 | Yokote |
| Ryozeki Shuzo | 両関酒造 | Yuzawa |
| Kimura Shuzo | 木村酒造 | Yuzawa |
| Akita Meijo | 秋田銘醸 | Yuzawa |
| Saiya Shuzoten | 齋彌酒造店 | Yurihonjo |
| Tenju Shuzo | 天寿酒造 | Yurihonjo |
| Hiraizumi Honpo | 飛良泉本舗 | Nikaho |
| Fukurokuju Shuzo | 福禄寿酒造 | Gojome |
| Yamamoto Shuzoten | 山本酒造店 | Happo |
| Kodama Jozo | 小玉醸造 | Katagami |

## Trampas
- **秋田県醗酵工業 (Yuzawa)** es industria de alcohol/destilado a granel, no una
  bodega de marca: triar antes de escribir fila.
- Seis 社名 empiezan por 秋田 y son empresas distintas (秋田酒造 ≠ 秋田酒類製造 ≠
  秋田醸造 ≠ 秋田清酒 ≠ 秋田銘醸 ≠ 秋田誉酒造). Casar por 社名 completo.
- **喜久水酒造 (Kikusui Shuzo, Noshiro)** no es 菊水酒造 (Kikusui, Shibata,
  Niigata), ya listada en `niigata.md`. Rōmaji casi idéntico, dos empresas.
- 仙北郡美郷町 y 南秋田郡五城目町 son 町 dentro de 郡: el `municipio` es Misato,
  Gojome — no el 郡.

## Qué falta
- Las ~20 bodegas restantes del censo.
- Sin abrir: きりたんぽ, いぶりがっこ (encurtido ahumado, con GI propia), arroz
  Akitakomachi, 稲庭うどん de Yuzawa (fideos con denominación y muchos obradores).
