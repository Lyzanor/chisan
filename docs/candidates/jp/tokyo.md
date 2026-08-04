# Tokyo — candidatos

- CSV: `data/csv/jp/kanto/tokyo.csv` (0 filas). Dedup: nada que cruzar.
- Fuente: censo de 酒蔵 de SAKETIMES, <https://jp.sake-times.com/sakagura/tokyo> (11 bodegas, censo completo). Gremio: 東京都酒造組合, <http://www.tokyosake.or.jp/>.
- Estado: cola abierta, 11 `unverified` (2026-08-04). **Ninguna trae dominio**: cosecharlo es el trabajo previo a cada alta.

Tokio tiene 11 bodegas y diez de ellas están en el **Tama occidental**, no en la
ciudad: es agricultura de montaña a una hora de Shinjuku. Categoría: `Sake`.

| nombre (rōmaji propuesto) | 社名 | municipio |
|---|---|---|
| Ishikawa Shuzo | 石川酒造 | Fussa |
| Tamura Shuzojo | 田村酒造場 | Fussa |
| Ozawa Shuzo | 小澤酒造 | Ome |
| Ozawa Shuzojo | 小澤酒造場 | Hachioji |
| Maihime / Tokyo Hachioji Shuzo | 舞姫（東京八王子酒造） | Hachioji |
| Toshimaya Shuzo | 豊島屋酒造 | Higashimurayama |
| Nakamura Shuzo | 中村酒造 | Akiruno |
| Nozaki Shuzo | 野﨑酒造 | Akiruno |
| Noguchi Shuzoten | 野口酒造店 | Fuchu |
| Wakamatsu / Tokyo Port Brewery | 若松（東京港醸造） | Minato |
| Koyama Shuzo | 小山酒造 | Kita ⚠ |

## Trampas
- **Tokio no es un municipio.** Ya avisado en el `README.md` de esta carpeta: el
  `municipio` es el barrio especial (`Kita`, `Minato`) o la ciudad del Tama
  (`Fussa`, `Ome`, `Hachioji`, `Akiruno`, `Fuchu`, `Higashimurayama`). Nunca
  «Tokyo» a secas.
- ⚠ **小山酒造 (Kita, marca 丸真正宗)** dejó de elaborar. Un listado la sigue
  arrastrando; **exige evidencia reciente** antes de escribir la fila — y si
  confirmadamente cesó, es purga documentada, no `parcial`.
- **小澤酒造 (Ome, marca 澤乃井) y 小澤酒造場 (Hachioji, marca 桑の都)** son dos
  empresas distintas del mismo apellido. No fusionar.
- **東京港醸造 (Minato)** elabora en un edificio de cuatro plantas en Shibadaimon:
  es real y es la única bodega del centro. No descartarla por «no puede haber una
  bodega ahí».
- **Minimal Bean to Bar Chocolate** sigue en la bandeja del `README.md` sin barrio
  resuelto: es candidata de Tokio y se cierra resolviendo eso.

## Qué falta
- Nada de fuera del sake: falta **té de Tama**, wasabi de Okutama, 小松菜 (que
  toma el nombre de Komatsugawa, Edogawa), 江戸前 海苔 y pescado, y **las islas**
  — Ogasawara (café y el cacao de Hahajima, ver `saitama.md`), Hachijojima,
  Izu-Oshima (sal, ashitaba) — que son Tokio y no aparecen por ningún lado.
