# World Cheese candidates by province

Revisión editorial de los 138 productores que quedaron como `missing` tras cruzar los productos World Cheese de España con `data/csv/**`.

## Fuentes
- Directorio GFF de productores en España: https://gff.co.uk/directory/?type=producer&producer-name=&country=203&location=&pg=1
- Directorio GFF de productos World Cheese en España: https://gff.co.uk/directory/?awards-scheme=2&by-rating=all&by-year=all&category=all&country=203&judge-id=&keyword=&per-page=50&pg=1&sort=asc&type=product
- CSV locales revisados contra `nombre`, enlaces `web`/`Facebook`/`Instagram` y provincia inferida por código postal.

## Criterio
- `Añadir`: encaja como productor/láctea nuevo, pendiente de revisión primaria y Google Maps antes de tocar CSV.
- `Añadir normalizado`: encaja, pero el nombre de GFF debe limpiarse antes de crear fila, normalmente quitando `& CABILDO DE GRAN CANARIA` y usando la quesería real.
- `Ya cubierto`: no crear fila nueva; revisar si conviene actualizar categoría, productos o nombre en la fila existente.
- `Revisar`: podría encajar, pero hay duda de nombre canónico, planta real, distribuidor o marca industrial.
- `Descartar`: no añadir como productor literal en este catálogo.

## Resumen
| Estado | Productores |
|---|---:|
| Añadir | 77 |
| Añadir normalizado | 15 |
| Revisar | 6 |
| Ya cubierto | 30 |
| Descartar | 10 |

## Resumen por provincia
| Provincia | Añadir | Normalizar | Revisar | Ya cubierto | Descartar | Total |
|---|---:|---:|---:|---:|---:|---:|
| Albacete | 1 | 0 | 2 | 1 | 0 | 4 |
| Alicante | 0 | 0 | 0 | 1 | 0 | 1 |
| Asturias | 2 | 0 | 1 | 0 | 0 | 3 |
| Badajoz | 4 | 0 | 0 | 2 | 0 | 6 |
| Baleares | 1 | 0 | 0 | 1 | 0 | 2 |
| Barcelona | 0 | 0 | 0 | 0 | 2 | 2 |
| Cantabria | 2 | 0 | 0 | 0 | 0 | 2 |
| Castellón | 0 | 0 | 0 | 2 | 0 | 2 |
| Ciudad Real | 17 | 0 | 1 | 0 | 0 | 18 |
| Cuenca | 2 | 0 | 0 | 2 | 0 | 4 |
| Cáceres | 1 | 0 | 0 | 0 | 0 | 1 |
| Cádiz | 0 | 0 | 0 | 3 | 0 | 3 |
| Girona | 1 | 0 | 0 | 0 | 0 | 1 |
| Granada | 1 | 0 | 0 | 2 | 0 | 3 |
| Guadalajara | 1 | 0 | 0 | 0 | 0 | 1 |
| Guipúzcoa | 2 | 0 | 0 | 0 | 0 | 2 |
| La Rioja | 0 | 0 | 0 | 1 | 0 | 1 |
| Las Palmas | 2 | 15 | 0 | 2 | 1 | 20 |
| León | 1 | 0 | 0 | 2 | 0 | 3 |
| Lugo | 1 | 0 | 0 | 0 | 0 | 1 |
| Madrid | 0 | 0 | 1 | 0 | 3 | 4 |
| Murcia | 1 | 0 | 1 | 0 | 0 | 2 |
| Málaga | 1 | 0 | 0 | 2 | 0 | 3 |
| Navarra | 5 | 0 | 0 | 2 | 0 | 7 |
| Pontevedra | 2 | 0 | 0 | 0 | 0 | 2 |
| Salamanca | 0 | 0 | 0 | 0 | 1 | 1 |
| Santa Cruz de Tenerife | 2 | 0 | 0 | 0 | 0 | 2 |
| Segovia | 0 | 0 | 0 | 1 | 0 | 1 |
| Sevilla | 2 | 0 | 0 | 0 | 0 | 2 |
| Sin provincia clara | 0 | 0 | 0 | 0 | 1 | 1 |
| Teruel | 1 | 0 | 0 | 1 | 0 | 2 |
| Toledo | 13 | 0 | 0 | 2 | 1 | 16 |
| Valencia | 1 | 0 | 0 | 0 | 0 | 1 |
| Valladolid | 1 | 0 | 0 | 2 | 1 | 4 |
| Vizcaya | 1 | 0 | 0 | 0 | 0 | 1 |
| Zamora | 5 | 0 | 0 | 1 | 0 | 6 |
| Álava | 3 | 0 | 0 | 0 | 0 | 3 |

## Detalle por provincia

### Albacete
- **Añadir**: [blincos sl](https://gff.co.uk/directory/producer/?id=48486) (la roda 02630, 1 productos). Productos GFF: CASTILLO DE ROBDA. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Revisar**: [Lactalis Forlasa S.L.U.](https://gff.co.uk/directory/producer/?id=48621) (Villarobledo 02600, 32 productos). Productos GFF: QUESO CURADO MEZCLA; QUESO FRESCO ULTRAFILTRADO. Encaja si aceptamos grandes plantas industriales; revisar planta de Villarrobledo y producto antes de añadir.
- **Revisar**: [WORLD FRUITS COMPANY, S.L](https://gff.co.uk/directory/producer/?id=36852) (Albacete 02610, 3 productos). Productos GFF: HACIENDA GUIJOSO; HACIENDA GUIJOSO. GFF enlaza Familia Conesa/Hacienda Guijoso; revisar nombre canónico antes de añadir.
- **Ya cubierto**: [Quesera Manchega Los Boliches S.L](https://gff.co.uk/directory/producer/?id=48987) (Albacete 02611, 3 productos). Productos GFF: Cured Manchego Cheese DOP; Semi-Cured Manchego Cheese PDO. Ya existe por URL como Quesos Don Eusebio; no añadir fila nueva, quizá actualizar productos/premios si se revisa. Fila local: `Quesos Don Eusebio (Ossa de Montiel, data/csv/castilla-la-mancha/albacete.csv)`.

### Alicante
- **Ya cubierto**: [Queronsa S.L.](https://gff.co.uk/directory/producer/?id=33577) (Alicante 03510, 7 productos). Productos GFF: Queso Añejo de Vaca con Zumo Natural de Naranjas del Tossal de Marieta; QUESO CURADO DE CABRA. Ya existe por URL como Quesería San Antonio; no añadir fila nueva, quizá actualizar productos/premios si se revisa. Fila local: `Quesería San Antonio (Callosa d'en Sarrià, data/csv/comunitat-valenciana/alicante.csv)`.

### Asturias
- **Añadir**: [Quesos Lazana](https://gff.co.uk/directory/producer/?id=30449) (LAS REGUERAS 33190, 3 productos). Productos GFF: LAZANA afinado; LAZANA afinado. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Industrias Lácteas Monteverde S.A.](https://gff.co.uk/directory/producer/?id=48314) (Grandas de Salime 33730, 1 productos). Productos GFF: Tres Oscos Seleccion Queso Viejo Tres Leches. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Revisar**: [Corporación Alimentaria Peñasanta SA (CAPSA)](https://gff.co.uk/directory/producer/?id=15473) (Siero Asturias 33199, 8 productos). Productos GFF: Queso Cabrales DOP Central Lechera Asturiana Cueva del Molin; Queso Ahumado para sandwich Central Lechera Asturiana. Encaja solo si queremos marca industrial; confirmar planta/quesería real asociada al Cabrales.

### Badajoz
- **Añadir**: [El Señorio de Monesterio S C](https://gff.co.uk/directory/producer/?id=48617) (Monesterio 06260, 6 productos). Productos GFF: Cremocito de Monesterio; Queso de cabra en romero. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [El Prado de Llera, S.L.](https://gff.co.uk/directory/producer/?id=23502) (Llera 06227, 5 productos). Productos GFF: EL PRADO DE LLERA - ORIGEN -; EL PRADO DE LLERA - ANTAÑO -. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Finca Buenavista Ribera, CB](https://gff.co.uk/directory/producer/?id=42539) (Ribera del Fresno 06225, 2 productos). Productos GFF: SOLOCABRA EN MANTECA IBERICA; SOLOCABRA CORTEZA NATURAL. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [SCL COMARCAL AGRICOLA GANADERA CASTUERA](https://gff.co.uk/directory/producer/?id=42406) (CASTUERA 06420, 1 productos). Productos GFF: DEHESA REAL "Pasta Blanda" 2 months. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Ya cubierto**: [Arteserena S.L](https://gff.co.uk/directory/producer/?id=19911) (Badajoz 06460, 12 productos). Productos GFF: Cremositos del Zújar MINI; Cremositos del Zújar. Ya existe por URL como Cremositos del Zújar; no añadir fila nueva, quizá actualizar productos/premios si se revisa. Fila local: `Cremositos del Zújar (Campanario, data/csv/extremadura/badajoz.csv)`.
- **Ya cubierto**: [Quesos Rufino s.l.](https://gff.co.uk/directory/producer/?id=48483) (Oliva de la frontera 06120, 4 productos). Productos GFF: BOMBÓN RUFINO; RUFINO DE AFINADOR. Ya existe por URL como Quesos Rufino Afinadores; no añadir fila nueva, quizá actualizar productos/premios si se revisa. Fila local: `Quesos Rufino Afinadores (Oliva de la Frontera, data/csv/extremadura/badajoz.csv)`.

### Baleares
- **Añadir**: [HORT DE SANT PATRICI S.L.](https://gff.co.uk/directory/producer/?id=63283) (FERRERIES 07750, 2 productos). Productos GFF: Smoked Cheese (3 months); Cured Cheese D.O.P. Mahón - Menorca (5 to 12 months). Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Ya cubierto**: [Son Vives SRM](https://gff.co.uk/directory/producer/?id=33787) (Menorca, 07750 07750, 1 productos). Productos GFF: Queso Curado Son Vives 6 meses de maduración.. Ya existe por URL como Queso Son Vives Mahón-Menorca; no añadir fila nueva, quizá actualizar productos/premios si se revisa. Fila local: `Queso Son Vives Mahón-Menorca (Ferreries, data/csv/illes-balears/baleares.csv)`.

### Barcelona
- **Descartar**: [GRUPO TGT, S.L.](https://gff.co.uk/directory/producer/?id=48589) (VILADECANS 08840, 11 productos). Productos GFF: C.R.D.O.P. ARZÚA-ULLOA; C.R.D.O.P. Queixo Tetilla. Grupo distribuidor/industrial; las queserías concretas se tratan por separado.
- **Descartar**: [Sodiaal Iberia](https://gff.co.uk/directory/producer/?id=60410) (Barcelona 08018, 6 productos). Productos GFF: Brie de Meaux 1/2 affiné PDO; Brie Bleu. Filial/distribución de quesos franceses; no es productor local español para el catálogo.

### Cantabria
- **Añadir**: [Herederos de Tomás Ruiz S.L](https://gff.co.uk/directory/producer/?id=58023) (La Cavada 39720, 7 productos). Productos GFF: Queso Nata de Cantabria; Queso Ahumado Semicurado. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Queseria Tresgallo](https://gff.co.uk/directory/producer/?id=51600) (Hinojedo 39350, 1 productos). Productos GFF: Queso Curado Tresgallo. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.

### Castellón
- **Ya cubierto**: [Quesos de Catí Coop. V.](https://gff.co.uk/directory/producer/?id=20117) (Castellon, 8 productos). Productos GFF: Cati Tronchón Abrigo cabra; Cati Pell Florida Cabra. Ya existe por URL como Quesos Vall de Catí; no añadir fila nueva, quizá actualizar productos/premios si se revisa. Fila local: `Quesos Vall de Catí (Catí, data/csv/comunitat-valenciana/castellon.csv)`.
- **Ya cubierto**: [Quesos de Almazora, S.L.](https://gff.co.uk/directory/producer/?id=21693) (Almazora 12550, 7 productos). Productos GFF: QUESO SEMICURADO DE CABRA; QUESO CURADO DE CABRA. Ya existe por URL como Quesos Almassora; no añadir fila nueva, quizá actualizar productos/premios si se revisa. Fila local: `Quesos Almassora (Almassora, data/csv/comunitat-valenciana/castellon.csv)`.

### Ciudad Real
- **Añadir**: [QUESOS ROCINANTE S.L.](https://gff.co.uk/directory/producer/?id=48545) (MALAGON 13420, 10 productos). Productos GFF: Iberico Cheese Aged; Manchego PDO Cheese 3 months aged. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Quesos Don Apolonio, S.L](https://gff.co.uk/directory/producer/?id=38537) (Ciudad Real 13420, 10 productos). Productos GFF: Queso de Oveja Añejo Don Apolonio; Queso de Oveja Curado Don Apolonio. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [MARIANA MENCHERO CASTRO (QUESO SALETA)](https://gff.co.uk/directory/producer/?id=45840) (CIURAD REAL 13260, 9 productos). Productos GFF: SALETA AHUMADO; SALETA AÑEJO. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Agropecuaria Navaloshaces S.L](https://gff.co.uk/directory/producer/?id=28957) (CORRAL DE CALATRAVA 13190, 8 productos). Productos GFF: NAVALOSHACES CURADO EN ACEITE DE OLIVA VIRGEN EXTRA; NAVALOSHACES SEMICURADO. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [QUESOS ENCINASOLA S.L.](https://gff.co.uk/directory/producer/?id=42379) (PICON (CIUDAD REAL) 13196, 8 productos). Productos GFF: Quesos Encinasola – 60 days; Quesos Encinasola – 90 days. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Quesera Herenciana Cofer S.L.](https://gff.co.uk/directory/producer/?id=21727) (Ciudad Real 13640, 8 productos). Productos GFF: VillaHerencia - Tender Sheep´s Cheese; VillaHerencia - Tender Sheep´s Cheese. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [E.S. GARCERÁN 1 S.L.](https://gff.co.uk/directory/producer/?id=60787) (VILLAHERMOSA 13332, 7 productos). Productos GFF: QUESO DE OVEJA CURADO EN ROMERO SEÑORIO DE VILLAHERMOSA; QUESO DE OVEJA SEMICURADO SEÑORIO DE VILLAHERMOSA. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [MAGATENA SA](https://gff.co.uk/directory/producer/?id=48604) (DAIMIEL, CIUDAD REAL 13250, 6 productos). Productos GFF: DEHESA ZACATENA. QUESO MANCHEGO SEMICURADO ECOLÓGICO; DEHESA ZACATENA. QUESO MANCHEGO ARTESANO CURADO ECOLÓGICO. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [AGROVILLASERRA S.L.](https://gff.co.uk/directory/producer/?id=46836) (Porzuna 13120, 5 productos). Productos GFF: Queso Manchego Artesano DOP Añejo - VILLAJOS; Queso Manchego Artesano DOP Curado - VILLAJOS. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Agricola La Merced S.A](https://gff.co.uk/directory/producer/?id=33568) (Villanueva De Los Infantes 13320, 5 productos). Productos GFF: Chisquero Manchego Artesano D.O.P.; Chisquero Artesano Semicurado 4 meses. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [QUESERIA ARTESANAL LA SOLANA, S.L.](https://gff.co.uk/directory/producer/?id=51715) (LA SOLANA 13240, 3 productos). Productos GFF: QUESO CURADO LA SOLANA; QUESO CURADO MEZCLA LA SOLANA. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [QUESOS DON MIGUEL, S.L](https://gff.co.uk/directory/producer/?id=63685) (ALCÁZAR DE SAN JUAN 13600, 3 productos). Productos GFF: Cured Mixed Cheese; HARD EWES' MILK CHEESE. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [QUESOS LA GAITANA](https://gff.co.uk/directory/producer/?id=48491) (HERENCIA ( CIUDAD REAL) 13640, 3 productos). Productos GFF: COSECHA DE BERNARDETE CURADO DE OVEJA 8 MESES; LA GAITANA CURADO DE OVEJA 8 MESES. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [QUESOS CARPUELA S.L.](https://gff.co.uk/directory/producer/?id=50273) (Herencia 13640, 1 productos). Productos GFF: Sheep's milk cheese 12 months. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Queseria Valdehornos](https://gff.co.uk/directory/producer/?id=33573) (13110, 1 productos). Productos GFF: VALDEHORNOS Curado. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Quesería Solidaria Almadén s.l](https://gff.co.uk/directory/producer/?id=51279) (Almadén 13400, 1 productos). Productos GFF: Queso de oveja viejo 10 meses.. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Queso Artesano El Manojar](https://gff.co.uk/directory/producer/?id=51628) (Los Cortijos 13427, 1 productos). Productos GFF: El Manojar Curado, 6 meses. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Revisar**: [Lacteas Garcia Baquero S.A.](https://gff.co.uk/directory/producer/?id=18630) (Ciudad Real 13600, 31 productos). Productos GFF: Queso Burgoslínea Natural García-Baquero; Queso Arzúa-Ulloa DOP Castillo de Pambre García-Baquero. Encaja como productor industrial manchego; revisar planta/municipio y nombre canónico.

### Cuenca
- **Añadir**: [Quesera Campo Rus S.L.](https://gff.co.uk/directory/producer/?id=33595) (Cuenca 16621, 8 productos). Productos GFF: El Pesebre Reserva Especial; Campo Rus al Ajo Negro. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [QUESOS SANABRIA SL](https://gff.co.uk/directory/producer/?id=48567) (VILLAMAYOR DE SANTIAGO 16415, 1 productos). Productos GFF: CURED IBÉRICO CHEESE WITH BLACK TRUFFLE SANABRIA. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Ya cubierto**: [SAT Oveman](https://gff.co.uk/directory/producer/?id=47790) (Cuenca, 5 productos). Productos GFF: CERRO ANGEL CON PISTACHO; CERRO DEL ANGEL FLOR DE CARDO. Ya existe por URL como Quesería Villadharo; no añadir fila nueva, quizá actualizar productos/premios si se revisa. Fila local: `Quesería Villadharo (Villaescusa de Haro, data/csv/castilla-la-mancha/cuenca.csv)`.
- **Ya cubierto**: [De La Huz Grimaldos Industrias Lacteas S.L](https://gff.co.uk/directory/producer/?id=28971) (CUENCA 16415, 4 productos). Productos GFF: QUESO MANCHEGO "DON CAYO" D.O.P 12 MESES; QUESO MANCHEGO "DON CAYO" D.O.P 6 MESES. Ya existe por URL como Quesos de la Huz; no añadir fila nueva, quizá actualizar productos/premios si se revisa. Fila local: `Quesos de la Huz (Villamayor de Santiago, data/csv/castilla-la-mancha/cuenca.csv)`.

### Cáceres
- **Añadir**: [LÁCTEOS DEL BÚRDALO SLU](https://gff.co.uk/directory/producer/?id=51398) (ALMOHARIN 10132, 4 productos). Productos GFF: TORTA DEL CASAR; PASTOVELIA QUESO EXTREMEÑO DE OVEJA. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.

### Cádiz
- **Ya cubierto**: [RUIZWINTERS](https://gff.co.uk/directory/producer/?id=48399) (San José del Valle 11580, 10 productos). Productos GFF: Doña Casilda SEMICURADO; Dehesa de Jimena. Ya existe por URL como Doña Casilda; no añadir fila nueva, quizá actualizar productos/premios si se revisa. Fila local: `Doña Casilda (Cádiz, data/csv/andalucia/cadiz.csv)`.
- **Ya cubierto**: [Agroalimentaria El Bucarito SL](https://gff.co.uk/directory/producer/?id=48590) (ROTA 11520, 8 productos). Productos GFF: QUESO CURADO EL BUCARITO; QUESO SEMICURADO EL BUCARITO. Ya existe por URL como El Bucarito; revisar categoría/productos porque figura como `Jamón y embutidos` localmente. Fila local: `El Bucarito (Rota, data/csv/andalucia/cadiz.csv)`.
- **Ya cubierto**: [Domingo Puerto Dominguez](https://gff.co.uk/directory/producer/?id=48471) (Ubrique 11600, 7 productos). Productos GFF: PUERTO CARRILLO MADURADO LECHE CRUDA EN ACEITE DE OLIVA VIRGEN EXTRA; PUERTO CARRILLO MADURADO LECHE CRUDA EN PIMENTON. Ya existe por URL como Puerto Carrillo; no añadir fila nueva, quizá actualizar productos/premios si se revisa. Fila local: `Puerto Carrillo (Benaocaz, data/csv/andalucia/cadiz.csv)`.

### Girona
- **Añadir**: [L'ARBREDA SL](https://gff.co.uk/directory/producer/?id=58026) (Sant Martí de Llémena 17153, 3 productos). Productos GFF: TERRACUIT; ROCAFESA. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.

### Granada
- **Añadir**: [Queso Montefrieno S.L.](https://gff.co.uk/directory/producer/?id=21585) (Granada 18270 18270, 3 productos). Productos GFF: queso montefrieño curado de cabra; QUESO MONTEFRIEÑO TIERNO DE CABRA. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Ya cubierto**: [Quesería Artesanal "Las RRR"](https://gff.co.uk/directory/producer/?id=21682) (Granada 18200, 17 productos). Productos GFF: "Piparra"; "Maximus Lactis". Ya existe por URL como Quesería las RRR; revisar categoría/productos porque figura como `Quesos y lácteos` localmente. Fila local: `Quesería las RRR (Maracena, data/csv/andalucia/granada.csv)`.
- **Ya cubierto**: [Lacteos Lanjaron S.L.](https://gff.co.uk/directory/producer/?id=33575) (Lanjaron 18420, 5 productos). Productos GFF: QUESO OVEJA AÑEJO CURADO EN ROMERO; TORTITA DE CABRA CLOE. Ya existe por URL como Venta del Chaleco; revisar categoría/productos porque figura como `Quesos y lácteos` localmente. Fila local: `Venta del Chaleco (Órgiva, data/csv/andalucia/granada.csv)`.

### Guadalajara
- **Añadir**: [Queseria de Hita](https://gff.co.uk/directory/producer/?id=42045) (Hita 19248, 3 productos). Productos GFF: Queso de Oveja Castillo de Hita; Queso de Cabra Semicurado "Castillo de Hita". Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.

### Guipúzcoa
- **Añadir**: [Oihan txiki koop](https://gff.co.uk/directory/producer/?id=51601) (Orexa 20490, 3 productos). Productos GFF: OREXA NATURALA 6+; ARDI GAZTA KETUA OREXA. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [QUESERÍA GAZPIO](https://gff.co.uk/directory/producer/?id=48584) (BERASTEGI 20492, 3 productos). Productos GFF: QUESO GAZPIO-BASERRIKOA; QUESO GAZPIO-KETUA/AHUMADO. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.

### La Rioja
- **Ya cubierto**: [Lácteos Martínez SLU](https://gff.co.uk/directory/producer/?id=48982) (Haro 26200, 25 productos). Productos GFF: Mezcla Curado LOS CAMEROS; Cabra Semicurado - D.O.P. Queso Camerano LOS CAMEROS. Ya existe por URL como Lácteos Martínez, S.L. – Queso Los Cameros; no añadir fila nueva, quizá actualizar productos/premios si se revisa. Fila local: `Lácteos Martínez, S.L. – Queso Los Cameros (Haro, data/csv/la-rioja/la-rioja.csv)`.

### Las Palmas
- **Añadir**: [Quesería Montaña Blanca, S.L.](https://gff.co.uk/directory/producer/?id=48487) (San Bartolomé 35559, 8 productos). Productos GFF: QUESO GUATISEA SEMICURADO; QUESO GUATISEA SEMICURADO PIMENTÓN. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [S.A.T. Queso Flor Valsequillo](https://gff.co.uk/directory/producer/?id=37492) (Valsequillo 35217, 2 productos). Productos GFF: Queso de Cabra Añejo elaborado con Leche Cruda - Quesos Flor Valsequillo; Queso de Cabra Curado - Quesos Flor Valsequillo. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir normalizado**: [GANARANJO SLU &  CABILDO DE GRAN CANARIA](https://gff.co.uk/directory/producer/?id=60730) (Las Palmas de Gran Canaria 35017, 1 productos). Productos GFF: Quesos de Naranjo. Pasteurizado curado de mezcla. Encaja, pero no añadir con el sufijo Cabildo; usar la quesería/marca real indicada en el producto GFF.
- **Añadir normalizado**: [QUESOS SAN MATEO SL & CABILDO DE GRAN CANARIA](https://gff.co.uk/directory/producer/?id=60709) (Vega de San Mateo 35320, 6 productos). Productos GFF: QUESOS SAN MATEO S.L. CURADO DE MEZCLA; QUESOS SAN MATEO S.L. QUESO SEMICURADO DE LECHE DE CABRA CON PIMENTÓN MARCA VOLCANIA.. Encaja, pero no añadir con el sufijo Cabildo; usar la quesería/marca real indicada en el producto GFF.
- **Añadir normalizado**: [LUIS MARTEL PERDOMO & CABILDO DE GRAN CANARIA](https://gff.co.uk/directory/producer/?id=60714) (Santa Lucía 35110, 3 productos). Productos GFF: QUESERÍA ERA DEL CARDÓN. QUESO SEMICURADO DE CABRA.; Quesos Era del Cardón. Curado de Cabra. Encaja, pero no añadir con el sufijo Cabildo; usar la quesería/marca real indicada en el producto GFF.
- **Añadir normalizado**: [FRANCISCO JAVIER GONZÁLEZ RAMOS & CABILDO DE GRAN CANARIA](https://gff.co.uk/directory/producer/?id=60713) (Gáldar 35460, 2 productos). Productos GFF: QUESOS LA CALDERA. QUESO DE MEDIA FLOR; Quesos La Caldera. Curado de Oveja. Encaja, pero no añadir con el sufijo Cabildo; usar la quesería/marca real indicada en el producto GFF.
- **Añadir normalizado**: [JUAN SUÁREZ E HIJOS SL & CABILDO DE GRAN CANARIA](https://gff.co.uk/directory/producer/?id=60726) (Las Palmas de Gran Canaria 35001, 2 productos). Productos GFF: QUESOS FINCA FUENTE MORALES. QUESO CURADO DE MEZCLA; Quesos Finca Fuente Morales. Pasteurizado Curado de Mezcla. Encaja, pero no añadir con el sufijo Cabildo; usar la quesería/marca real indicada en el producto GFF.
- **Añadir normalizado**: [ANTONIO ALEJANDRO SUÁREZ PERDOMO & CABILDO DE GRAN CANARIA](https://gff.co.uk/directory/producer/?id=60732) (San Bartolomé de Tirajana 35108, 1 productos). Productos GFF: Quesos Amurga. Semicurado de Oveja y Cabra. Encaja, pero no añadir con el sufijo Cabildo; usar la quesería/marca real indicada en el producto GFF.
- **Añadir normalizado**: [CB FAMILIA PERNÍA AGUIAR & CABILDO DE GRAN CANARIA](https://gff.co.uk/directory/producer/?id=60707) (Las Palmas de Gran Canaria 35018, 1 productos). Productos GFF: Quesos La Pastora. Curado de Cabra. Encaja, pero no añadir con el sufijo Cabildo; usar la quesería/marca real indicada en el producto GFF.
- **Añadir normalizado**: [CRISTÓBAL MORENO DÍAZ & CABILDO DE GRAN CANARIA](https://gff.co.uk/directory/producer/?id=60731) (Gáldar 35460, 1 productos). Productos GFF: Quesos Cortijo de Caideros. Media Flor de Guía. Encaja, pero no añadir con el sufijo Cabildo; usar la quesería/marca real indicada en el producto GFF.
- **Añadir normalizado**: [GANADERIA ACODELI SL & CABILDO DE GRAN CANARIA](https://gff.co.uk/directory/producer/?id=60710) (San Bartolomé de Tirajana 35109, 1 productos). Productos GFF: QUESOS EL DRAGUILLO.QUESO SEMICURADO. Encaja, pero no añadir con el sufijo Cabildo; usar la quesería/marca real indicada en el producto GFF.
- **Añadir normalizado**: [JOSÉ JUAN GIL MENDOZA & CABILDO DE GRAN CANARIA](https://gff.co.uk/directory/producer/?id=60712) (Santa María de Guía 35450, 1 productos). Productos GFF: Quesos Campo de Guía. Curado de Cabra. Encaja, pero no añadir con el sufijo Cabildo; usar la quesería/marca real indicada en el producto GFF.
- **Añadir normalizado**: [JUAN ANDRÉS VIZCAÍNO GUEDES & CABILDO DE GRAN CANARIA](https://gff.co.uk/directory/producer/?id=60725) (Santa Lucía 35110, 1 productos). Productos GFF: Quesería Artesanal Guedes. Curado de Mezcla Oveja y Cabra. Encaja, pero no añadir con el sufijo Cabildo; usar la quesería/marca real indicada en el producto GFF.
- **Añadir normalizado**: [JUAN FÉLIX MEDINA MORENO & CABILDO DE GRAN CANARIA](https://gff.co.uk/directory/producer/?id=60716) (Moya 35421, 1 productos). Productos GFF: LOS ALTOS DE MOYA. QUESO DE MEDIA FLOR. Encaja, pero no añadir con el sufijo Cabildo; usar la quesería/marca real indicada en el producto GFF.
- **Añadir normalizado**: [JUAN JOSÉ ARENCIBIA QUINTANA & CABILDO DE GRAN CANARIA](https://gff.co.uk/directory/producer/?id=60711) (Moya 35420, 1 productos). Productos GFF: Quesos Los Castañeros. Curado de Vaca. Encaja, pero no añadir con el sufijo Cabildo; usar la quesería/marca real indicada en el producto GFF.
- **Añadir normalizado**: [MACARENA ROSARIO EXPÓSITO & CABILDO DE GRAN CANARIA](https://gff.co.uk/directory/producer/?id=60722) (Agaete 35480, 1 productos). Productos GFF: Quesos Del Rosario. Curado de vaca. Encaja, pero no añadir con el sufijo Cabildo; usar la quesería/marca real indicada en el producto GFF.
- **Añadir normalizado**: [QUESOS FRESCOS LOMO GALLEGO SL & CABILDO DE GRAN CANARIA](https://gff.co.uk/directory/producer/?id=60748) (Telde 35220, 1 productos). Productos GFF: Quesos Lomo Gallego. Añejo. Encaja, pero no añadir con el sufijo Cabildo; usar la quesería/marca real indicada en el producto GFF.
- **Ya cubierto**: [GRUPO GANADEROS DE FUERTEVENTURA S.L](https://gff.co.uk/directory/producer/?id=14309) (NUMANCIA DE LA SAGRA (TOLEDO) 45230, 22 productos). Productos GFF: MAXORATA CURED PAPRIKA; MAXORATA PLAIN SEMICURED. Ya existe por URL como Quesería Maxorata; revisar categoría/productos porque figura como `Quesos y lácteos` localmente. Fila local: `Quesería Maxorata (Puerto del Rosario, data/csv/canarias/las-palmas.csv)`.
- **Ya cubierto**: [SAT QUESO FLOR VALSEQUILLO & CABILDO DE GRAN CANARIA](https://gff.co.uk/directory/producer/?id=63536) (Valsequillo de Gran Canaria 35217, 1 productos). Productos GFF: SAT QUESO FLOR DE VALSEQUILLO.QUESO DE CABRA SEMICURADO UNTADO DE PIMENTÓN.. Duplicado interno de S.A.T. Queso Flor Valsequillo; añadir/revisar una sola fila.
- **Descartar**: [Cabildo de Gran Canaria](https://gff.co.uk/directory/producer/?id=23556) (Arucas, 35415, 10 productos). Productos GFF: Quesería La Caldera. Curado de Oveja de Guía; Quesos Luisita. Pasteurizado Curado de Cabra. Entidad paraguas; usar productores concretos de la isla, no el Cabildo como productor.

### León
- **Añadir**: [Madre Esla (Cooperativa Vega Esla)](https://gff.co.uk/directory/producer/?id=47780) (leon 24237, 1 productos). Productos GFF: BuenGuzman curado. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Ya cubierto**: [Industrias Lácteas Manzano S.A.](https://gff.co.uk/directory/producer/?id=19928) (Valderas-Leon 24220, 18 productos). Productos GFF: QUESO DE MEZCLA CURADO MANZER; CREMOSO DE OVEJA SIBARITASCRÈME. Ya existe por URL como Quesos Manzer; no añadir fila nueva, quizá actualizar productos/premios si se revisa. Fila local: `Quesos Manzer (Valderas, data/csv/castilla-y-leon/leon.csv)`.
- **Ya cubierto**: [PILAR BLANCO GUTIERREZ](https://gff.co.uk/directory/producer/?id=48479) (Jabares de los Oteros 24224, 5 productos). Productos GFF: PRAIZAL BODEGA; PRAIZAL CIRRO. Ya existe por URL como Quesería Praizal; no añadir fila nueva, quizá actualizar productos/premios si se revisa. Fila local: `Quesería Praizal (Jabares de los Oteros, data/csv/castilla-y-leon/leon.csv)`.

### Lugo
- **Añadir**: [Queserias Sarrianas, S.L.](https://gff.co.uk/directory/producer/?id=30568) (Sarria (Lugo) 27614, 4 productos). Productos GFF: QUESO CURADO DE OVEJA; QUESO TETILLA DENOMINACION DE ORIGEN PROTEGIDA. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.

### Madrid
- **Revisar**: [Javier Garnacho](https://gff.co.uk/directory/producer/?id=60488) (Quijorna 28693, 3 productos). Productos GFF: VEGA ALBERCHE CABRA SEMICURADO C.V.; VEGA ALBERCHE VINO 5 MONTHS. Sin enlace útil en GFF; revisar marca Vega Alberche y ubicación.
- **Descartar**: [Arias - Savencia](https://gff.co.uk/directory/producer/?id=48412) (Madrid 28020, 10 productos). Productos GFF: Boffard Gran Reserva; Casa del Campo DOP RESERVA. Grupo/marca industrial; revisar solo si se decide incorporar marca/planta concreta.
- **Descartar**: [Alimentias EMC](https://gff.co.uk/directory/producer/?id=20095) (Madrid 28001, 8 productos). Productos GFF: 5Q's sheep cheese cured aged in certified Sherry Cask; Don Juan Cave-Aged Manchego cheese PDO 6 months. Comercializador/afinador; no añadir como productor sin verificar origen productivo.
- **Descartar**: [Quorum Internacional](https://gff.co.uk/directory/producer/?id=20121) (Sevilla La Nueva 28609, 6 productos). Productos GFF: Murcia al Vino P.D.O.; Zamorano P.D.O. 9 months. Distribuidor/exportador; no añadir como productor.

### Murcia
- **Añadir**: [Queserías Villavieja, S.L.](https://gff.co.uk/directory/producer/?id=60461) (Calasparra 30420, 1 productos). Productos GFF: QUESO DE MURCIA CURADO D.O.P. MIN. 4 MESES. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Revisar**: [Especialidades Lácteas S.L](https://gff.co.uk/directory/producer/?id=33546) (30400 30400, 1 productos). Productos GFF: QUESO DE CABRA CON ROMERO. Ubicación poco informativa; revisar fuente primaria antes de añadir.

### Málaga
- **Añadir**: [Agasur S.C.A](https://gff.co.uk/directory/producer/?id=16315) (El Taraja , Málaga, 2 productos). Productos GFF: CURADO DE CABRA - EL PINSAPO-; PEDRO XIMENEZ - EL PINSAPO-. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Ya cubierto**: [AGAMMASUR Sdad. Coop. And](https://gff.co.uk/directory/producer/?id=35710) (Colmenar 29170, 16 productos). Productos GFF: Emborrizado Montes de Málaga; Semicurado El Pinsapo. Ya existe por URL como Agammasur, S.C.A.; revisar categoría/productos porque figura como `Aceite` localmente. Fila local: `Agammasur, S.C.A. (Colmenar, data/csv/andalucia/malaga.csv)`.
- **Ya cubierto**: [Campyserr](https://gff.co.uk/directory/producer/?id=63322) (Malaga 29200, 3 productos). Productos GFF: Flor del Torcal; Queso Cabra curado en AOVE y Pimenton Picante. Ya existe por URL como Quesos El Pastor del Torcal; revisar categoría/productos porque figura como `Aceite` localmente. Fila local: `Quesos El Pastor del Torcal (Antequera, data/csv/andalucia/malaga.csv)`.

### Navarra
- **Añadir**: [QUESOS LA VASCO NAVARRA S.A.](https://gff.co.uk/directory/producer/?id=42882) (OLAZAGUTIA - OLAZTI 31809, 12 productos). Productos GFF: SHEEP CHEESE; SOFT CHEESE. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Gaztandegi Dorrea S.A.](https://gff.co.uk/directory/producer/?id=47808) (Udabe 31869, 5 productos). Productos GFF: IDIAZABAL DOP H; OVEJA AFINADO. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Enaquesa (Grupo TGT)](https://gff.co.uk/directory/producer/?id=51632) (Roncal 31415, 3 productos). Productos GFF: ARDIONA; AHUYENTALOBOS LA BACALAO. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Ardiarana S.L](https://gff.co.uk/directory/producer/?id=48852) (Legasa-Navarra 31792, 2 productos). Productos GFF: ARDIARANA - 5 months; ARDIARANA - 7 months. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Kaiolar](https://gff.co.uk/directory/producer/?id=63429) (Ochagavia 31680, 1 productos). Productos GFF: KAIOLAR MIXTO. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Ya cubierto**: [Huarte Martiarena Jokin y Uharte Martiarena Miren SC](https://gff.co.uk/directory/producer/?id=60387) (UHARTE ARAKIL 31840, 1 productos). Productos GFF: DOP Idiazabal 18 meses. Ya existe por URL como Sustrai Gaztategia / Quesería Sustrai; revisar categoría/productos porque figura como `Quesos y lácteos` localmente. Fila local: `Sustrai Gaztategia / Quesería Sustrai (Uharte Arakil, data/csv/navarra/navarra.csv)`.
- **Ya cubierto**: [ZAZPE SCA](https://gff.co.uk/directory/producer/?id=60455) (Aurizberri - Espinal 31694, 1 productos). Productos GFF: IXTILETA GASNA. Ya existe por URL como Pirineki; revisar categoría/productos porque figura como `Quesos y lácteos` localmente. Fila local: `Pirineki (Aurizberri / Espinal, data/csv/navarra/navarra.csv)`.

### Pontevedra
- **Añadir**: [A Meixoeira S.Coop.Galega](https://gff.co.uk/directory/producer/?id=38576) (Moaña 36959, 3 productos). Productos GFF: A MeixoEira Queixo Fresco para Untar de Cabra; A MeixoEira Queixo Curado de Cabra. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [PALO SANTO](https://gff.co.uk/directory/producer/?id=58194) (CUNTIS 36670, 3 productos). Productos GFF: PALO SANTO DO CAMINO RESERVE; PALO SANTO DO CAMINO CURED CHEESE 12 MONTHS. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.

### Salamanca
- **Descartar**: [AILASA  (Asociacion Profesional de Industrias Lacteas Arribes de Salamanca)](https://gff.co.uk/directory/producer/?id=27106) (Vilvestre , Salamanca 37258, 2 productos). Productos GFF: GARCIA CALVO aged raw sheep’s milk cheese, certified under the Queso Arribes de Salamanca Guarantee Label; ARTESANOS DEL ARCO HERNANDEZ. Marca de Garantía Queso Arribes de Salamanca. Asociación/garantía; no añadir literal, revisar productores miembro si interesan.

### Santa Cruz de Tenerife
- **Añadir**: [Quesería El Guanche S.L.](https://gff.co.uk/directory/producer/?id=35412) (Tenerife 38689, 19 productos). Productos GFF: Semicurado Puro de cabra con Gofio; Semicurado Puro de cabra con Pimentón. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [QUESOS ABORIGEN - JENNIFER SANTOS CABRERA](https://gff.co.uk/directory/producer/?id=60324) (ARAFO 38550, 1 productos). Productos GFF: Aborigen - Semicurado Agroecológico. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.

### Segovia
- **Ya cubierto**: [Cedillo Producciones S.L.](https://gff.co.uk/directory/producer/?id=34285) (Segovia 40550, 1 productos). Productos GFF: Moncedillo truffled. Ya existe por URL como Moncedillo; no añadir fila nueva, quizá actualizar productos/premios si se revisa. Fila local: `Moncedillo (Campo de San Pedro, data/csv/castilla-y-leon/segovia.csv)`.

### Sevilla
- **Añadir**: [Productos Alimentarios Quesí S.L](https://gff.co.uk/directory/producer/?id=48352) (Osuna 41640, 6 productos). Productos GFF: EL QUESÍ CON ORO; Queso Fresco Quesí. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Quesos los Vazquez](https://gff.co.uk/directory/producer/?id=48372) (Castilleja del Campo 41810, 3 productos). Productos GFF: Antaño; Hogaño. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.

### Sin provincia clara
- **Descartar**: [Quesos Rocinante](https://gff.co.uk/directory/producer/?id=55270) (View profile & products, 4 productos). Productos GFF: AGED IBERICO CHEESE; AGED MANCHEGO PDO CHEESE. Duplicado GFF sin ubicación; usar QUESOS ROCINANTE S.L.

### Teruel
- **Añadir**: [Quesos Artesanos La Val](https://gff.co.uk/directory/producer/?id=41200) (Mezquita De Jarque 44169, 13 productos). Productos GFF: Pasteurised goats’ milk “Flor” cured – 1.2 kg (generic); Raw ewes’ milk “Flor” cured – 1.2 kg. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Ya cubierto**: [Queso Artesano de Teruel S.L.](https://gff.co.uk/directory/producer/?id=21654) (Teruel 44100, 19 productos). Productos GFF: Sierra de Albarracín, Al Vino Tinto; Sierra de Albarracín, Al Azafrán. Ya existe por URL como Queso Artesano de Teruel Sierra de Albarracín; revisar categoría/productos porque figura como `Quesos y lácteos` localmente. Fila local: `Queso Artesano de Teruel Sierra de Albarracín (Albarracín, data/csv/aragon/teruel.csv)`.

### Toledo
- **Añadir**: [Quesos Navalmoral S.A.](https://gff.co.uk/directory/producer/?id=21648) (Totanes 45163, 12 productos). Productos GFF: Sheep cheese with Black Garlics "CAMPOS DE TOLEDO"; Manchego PDO "NAVALMORAL" Semicured. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [S.A.T ESTRADA CASTAÑO](https://gff.co.uk/directory/producer/?id=51458) (HERRERUELA DE OROPESA 45588, 11 productos). Productos GFF: QUESO ESTRADA CASTAÑO CON AJO NEGRO; QUESO ESTRADA CASTAÑO CON BOLETUS. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Quesos Lominchar S.L.](https://gff.co.uk/directory/producer/?id=21735) (Toledo 45880, 10 productos). Productos GFF: ARISCADO CURADO MANCHEGO DOP; ARISCADO SEMICURADO MANCHEGO DOP. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Esperanza del Castillo S.L.](https://gff.co.uk/directory/producer/?id=20136) (Pulgar 45125, 9 productos). Productos GFF: QUESO DE MEZCLA CON ACEITE OLIVA VIRGEN EXTRA; QUESO MANCHEGO CURADO PASTEURIZADO. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Quesos Umbria del Madroñal](https://gff.co.uk/directory/producer/?id=41182) (Toledo 45100, 8 productos). Productos GFF: UMBRÍA DEL MADROÑAL CURADO; UMBRÍA DEL MADROÑAL CURADO EN ACEITE. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Juan David Garcia Fernandez  (La Antigua Queseria)](https://gff.co.uk/directory/producer/?id=35667) (Mora (Toledo) 45400, 6 productos). Productos GFF: LA ANTIGUAQUESERIA SEMICURADO; La Antigua Quesería Curado 6 meses de curación. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [QUESOS LA MUEDA](https://gff.co.uk/directory/producer/?id=48611) (santa cruz de la zarza 45370, 6 productos). Productos GFF: QUESO CURADO; QUESO CURADO PASTEURIZADO. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [AGROPECUARIA DEHESA ARDALES S.L.](https://gff.co.uk/directory/producer/?id=58160) (TOLEDO 45005, 4 productos). Productos GFF: MEDIALUNA . Añejo Artesano >12 meses; MEDIALUNA . Cuarado pasteurizado. 6-8 meses. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Quesos Rosario Castaño SL](https://gff.co.uk/directory/producer/?id=44143) (Herreruela de Oropesa 45588, 4 productos). Productos GFF: QUESO DE OVEJA CURADO 8 MESES; QUESO DE OVEJA SEMICURADO 4 MESES. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Asociacion Ganadera Palomares S.A.T.](https://gff.co.uk/directory/producer/?id=48380) (La puebla de almoradiel 45840, 3 productos). Productos GFF: El Gigüela; El Gigüela / Semi matured cheese of 3 months and 10 days. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [El Buen Pastor de Oropesa](https://gff.co.uk/directory/producer/?id=35409) (Oropesa 45560, 3 productos). Productos GFF: El Buen Pastor Semicurado; Curado 4 meses. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Cerrucos De Kanama](https://gff.co.uk/directory/producer/?id=51630) (los Navalucillos 45130, 2 productos). Productos GFF: PRIMAVERA; PRIMAVERA. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Raquel Cuellar Rama](https://gff.co.uk/directory/producer/?id=58156) (Arcicollar 45182, 1 productos). Productos GFF: MOHINO. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Ya cubierto**: [Fontecha Framit Industries](https://gff.co.uk/directory/producer/?id=58228) (Madrid 28043, 3 productos). Productos GFF: MILAGRO, queso de leche cruda recién ordeñada, mezcla de oveja manchega y cabra murciano granadina; Osado. Ya existe por URL como Edén Auténtico; no añadir fila nueva, quizá actualizar productos/premios si se revisa. Fila local: `Edén Auténtico (Marjaliza, data/csv/castilla-la-mancha/toledo.csv)`.
- **Ya cubierto**: [Lácteas Guadamur (Grupo TGT)](https://gff.co.uk/directory/producer/?id=51599) (GUADAMUR 45160, 1 productos). Productos GFF: Queso azul de cabra "Roncari Blue". Ya cubierto por Lácteas Toledo en Toledo; si se revisa, actualizar productos/premios.
- **Descartar**: [Vinos y Bodegas Perez Arquero](https://gff.co.uk/directory/producer/?id=41392) (Ocana- Toledo 45300, 1 productos). Productos GFF: Queso Curado Manchego Artesano D.O.P. Bodega con producto de queso en GFF; no añadir como quesería sin fuente primaria.

### Valencia
- **Añadir**: [Queserias Romero Gozalbez S.L.](https://gff.co.uk/directory/producer/?id=21711) (La LLosa de Ranes 46815, 2 productos). Productos GFF: QUESO OVEJA CAMPONOBLE; QUESO OVEJA CAMPONOBLE CON ACEITE DE OLIVA. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.

### Valladolid
- **Añadir**: [Fonseca Mediero s.l.](https://gff.co.uk/directory/producer/?id=58138) (Fresno el viejo 47480, 1 productos). Productos GFF: Queso semicurado,leche cruda oveja, 3 meses. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Ya cubierto**: [Hijos de Eulalio Escarda SL](https://gff.co.uk/directory/producer/?id=35658) (Pedrajas De San Esteban 47430, 4 productos). Productos GFF: QUESO CURADO LA CRUZ DEL POBRE; PATA DE MULO LA CRUZ DEL POBRE. Ya existe por URL como QUESERÍA ARTESANAL LA CRUZ DEL POBRE; no añadir fila nueva, quizá actualizar productos/premios si se revisa. Fila local: `QUESERÍA ARTESANAL LA CRUZ DEL POBRE (Pedrajas de San Esteban, data/csv/castilla-y-leon/valladolid.csv)`.
- **Ya cubierto**: [Queseria Artesanal de Mucientes](https://gff.co.uk/directory/producer/?id=21703) (Mucientes 47194, 3 productos). Productos GFF: QUESO MUZIENTES CURADO; MUZIENTES CURED CHEESE: 10 months. Ya existe por URL como QUESERÍA ARTESANAL DE MUZIENTES; no añadir fila nueva, quizá actualizar productos/premios si se revisa. Fila local: `QUESERÍA ARTESANAL DE MUZIENTES (Mucientes, data/csv/castilla-y-leon/valladolid.csv)`.
- **Descartar**: [Rueda Cheesemonger](https://gff.co.uk/directory/producer/?id=47787) (Valladolid, 3 productos). Productos GFF: PATA MULO; BLEAT. Afinador/comerciante; fuera del criterio de productor salvo que se abra esa categoría.

### Vizcaya
- **Añadir**: [Santamañe Elkartea S.L](https://gff.co.uk/directory/producer/?id=51610) (Markina-Xemein 48270, 2 productos). Productos GFF: BASKARAN; BASKARAN. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.

### Zamora
- **Añadir**: [Lacteas Cobreros S.A.](https://gff.co.uk/directory/producer/?id=31376) (Zamora 49660, 24 productos). Productos GFF: GOAT CHEESE WITH CRAMBERRIES; GOAT CHEESE WITH PAPAYA. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Industrias Lacteas Benaventanas S.A. (Ilbesa )](https://gff.co.uk/directory/producer/?id=15982) (49600, Benavente 49600, 9 productos). Productos GFF: QUESO DE OVEJA CURADO "DM"; QUESO DE OVEJA CURADO "FUNDADOR". Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Baltasar Moralejo e Hijos S.R.L.](https://gff.co.uk/directory/producer/?id=21570) (CORESES (ZAMORA) 49530, 8 productos). Productos GFF: PAGO LOS VIVALES ETIQUETA BURDEOS; PAGO LOS VIVALES ETIQUETA NEGRA. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Lacteas Zamoro S.L.](https://gff.co.uk/directory/producer/?id=48932) (Santibañez de Vidriales (Zamora) 49610, 5 productos). Productos GFF: Ciudad de Sansueña Goat's Cheese; Ciudad de Sansueña Old Sheep's Cheese. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Quesos Pablo Alonso Martin](https://gff.co.uk/directory/producer/?id=31364) (Villalpando 49630, 1 productos). Productos GFF: Queso artesano de oveja viejo Pablo A. Villalpando. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Ya cubierto**: [Quesos El Pastor-Hijos De Salvador SA](https://gff.co.uk/directory/producer/?id=47789) (ZAMORA 49620, 19 productos). Productos GFF: AGED SHEEP CHEESE - 12 MONTHS; COW CHEESE ROLL COVERED WITH PINEAPPLE. Ya existe por URL como Hijos de Salvador Rodríguez; no añadir fila nueva, quizá actualizar productos/premios si se revisa. Fila local: `Hijos de Salvador Rodríguez (Sta. Cristina De La Polvorosa, data/csv/castilla-y-leon/zamora.csv)`.

### Álava
- **Añadir**: [QUESERIA LA LEZE](https://gff.co.uk/directory/producer/?id=45221) (ILARDUIA 01260, 9 productos). Productos GFF: LA LEZE AFINADO ORIGINAL; RESERVA LA LEZE. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [JULEN KARASATORRE ARAMBURU](https://gff.co.uk/directory/producer/?id=48771) (ARRIOLA 01208, 3 productos). Productos GFF: KARASATORRE AHUMADO; KARASATORRE AHUMADO. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.
- **Añadir**: [Quesería Eguralde](https://gff.co.uk/directory/producer/?id=33571) (01216 01216, 3 productos). Productos GFF: EGURALDE GAZTA; EGURALDE GAZTA. Productor/láctea con productos World Cheese; candidato a añadir tras revisión de fuente primaria y Google Maps.

## Siguiente pase recomendado
- Empezar por provincias con más `Añadir`: Ciudad Real, Toledo, Zamora, Navarra, Badajoz y Las Palmas con nombres normalizados.
- En Las Palmas, crear nombres canónicos de queserías, no filas con el Cabildo como productor.
- Antes de CSV, verificar web o Google Maps, coordenadas, contacto y `Google Maps`; no actualizar `fecha_revision` hasta revisar cada fila.
