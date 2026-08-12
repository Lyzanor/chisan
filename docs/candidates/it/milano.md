# Candidatos — Milano

Revisión cerrada el 2026-08-12 para los tres lotes abiertos: 20 unidades del registro sanitario de quesos (corte 2026-08-11), 27 candidatos de categorías poco representadas (corte 2026-08-10) y 19 operadores ecológicos TRACES (corte 2026-08-08). `Guzzafame` y `Società Agricola Fratelli Monti` son la misma unidad productiva y se consolidaron en una sola fila. Resultado de 65 identidades únicas: 35 publicadas en Milano, 1 reasignada a Rimini, 8 excluidas y 21 retenidas con una carencia concreta. Las decisiones publicadas y excluidas están trazadas en `data/evidence/it/lombardia/milano.jsonl`.

Fuentes de apertura del lote:

- [Ministero della Salute — establecimientos autorizados para alimentos de origen animal](https://www.dati.salute.gov.it/it/dataset/stabilimenti-italiani-gli-alimenti-di-origine-animale/)
- [Regione Lombardia — fattorie didattiche](https://www.regione.lombardia.it/wps/wcm/connect/95ce99be-7f48-43c5-9f31-acb68bf20414/elenco%2BFD%2Baggiornato%2Bal%2B20.12.2024.pdf?CACHEID=ROOTWORKSPACE-95ce99be-7f48-43c5-9f31-acb68bf20414-pfzK4G4&MOD=AJPERES)
- [Regione Lombardia — organizzazioni di produttori riconosciute](https://www.dati.lombardia.it/d/bdkn-hkwa)
- [Unionbirrai — soci produttori](https://www.unionbirrai.it/it/soci/mappa/)
- [TRACES NT — directorio de operadores ecológicos](https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/index)

## Publicados en Milano

| Lote | Productores incorporados |
|---|---|
| Quesos / registro sanitario | Nuova Castelli e Cairati; Gelmini Carlo; Gelateria Cortinovis; Cascina Guzzafame / Fratelli Monti; Caseificio Salernitano; Caseificio Papetti; Cascina Colombina; Caseificio Miccoli; Caseificio Fiordilatte Milano; Peck; Arioli Achille; Caseificio Di Domenico; Fratelli Pedretti; Bindi Dessert; Amaltea San Vittore Olona; Cascina Cortenuova; Granarolo Pasturago |
| Fattorie y cerveza | Vivai Natura; Cascina Caremma; Agriturismo Murnee; Cascina Bullona; Cascina Salazzara; Birrificio WAR; Birrificio di Legnano; Agriturismo L'Aia; Panizzari; Il Tenchio; Cascina Battivacco; Cascina Selva; Le Cave del Ceppo; Cascina Femegro |
| Ecológicos | Agrestum; Cascina Guastalla; Cascina Lema; Agrinaviglio |

Las plantas con presencia pública insuficiente para una verificación completa se publican honestamente como `parcial`. `Birrificio di Legnano` se publica sin web porque el dominio visible está comprometido por contenido ajeno. Panizzari se clasifica por su actividad real como `Vino`, no por la categoría provisional del registro.

## Reasignado

| Candidato | Decisión |
|---|---|
| Oltremonte | Publicado en `rimini.csv`: la unidad productiva pública está en Via Monte 54, San Leo (RN); Milano es una dirección del operador, no la explotación. |

## Excluidos

| Candidato | Motivo |
|---|---|
| Il Regno dei Rapaci | Cría, adiestramiento y actividad didáctica con rapaces; no ofrece producción alimentaria propia. |
| Agriturismo Didattico Paloschi | Forraje y ponis para actividad didáctica; no hay alimento propio vendible. |
| APOL Industriale | Organización de productores y comercialización, no unidad productiva. |
| A.O.P. Unolombardia | Organización de productores, no unidad productiva. |
| O.P. Ortonatura | Organización de productores, no unidad productiva. |
| P.O.A. Organizzazione Produttori Ortofrutticoli Associati | Organización de productores, no unidad productiva. |
| Santangiolina Latte Fattorie Lombarde | Milano no es unidad productiva; las plantas públicas están en Cereta di Volta Mantovana y Pandino. |
| ASP Solar Italia Alpha | La actividad pública corroborada es un proyecto fotovoltaico en Licodia Eubea (CT), no producción alimentaria en Milano. |

## Retenidos tras revisión

Estos candidatos ya se revisaron; no deben publicarse sin resolver la carencia indicada.

| Candidato | Carencia que mantiene la retención |
|---|---|
| I Silos di Pirovano | Autorización sanitaria vigente, pero sin identidad pública y oferta propia suficientes. |
| Caseificio Artigianale Nicomilk | Autorización sanitaria vigente, pero sin catálogo o marca pública actual verificable. |
| Gori Dr. Enzo / Alimenti Primari | No se pudo demostrar una oferta quesera propia al consumidor ligada a la unidad autorizada. |
| Cascina Fiorentina | No aparece una fuente pública actual de producto o marca propia. |
| Cirenaica | La fuente candidata describe producción, pero la oferta pública actual no quedó suficientemente corroborada. |
| Canonaco Matteo / Acetaia Corte D'Este | Identidad y ubicación productiva ambiguas; no se pudo ligar la acetaia de Modena a una unidad en Milano. |
| Fattoria Castellazzo | El registro regional describe una quesería caprina, pero falta corroboración pública actual de la unidad y su oferta. |
| Cascina Codazza | Contacto actual localizado, sin evidencia pública reciente de venta directa o producto propio. |
| Palma Alberto | El certificado no permite resolver marca, producto ni unidad productiva pública. |
| Azienda Agricola Valsolda | Domicilio urbano y alcance certificado sin explotación pública identificable. |
| Case dell'Olmo | No se pudo separar una unidad productiva concreta del domicilio societario de Milano. |
| Gaudio Daniel | Falta identidad comercial, producto y unidad productiva pública. |
| Ioppolo Sergio Giuseppe | El certificado no basta para identificar una explotación y oferta concreta. |
| La Darsena | La explotación localizada está en Giussago (PV), pero no se encontró una oferta alimentaria pública propia que permita publicarla allí. |
| Massa Saluzzo Alberto | Falta marca, producto alimentario concreto y ubicación productiva corroborada. |
| P&V Immobiliare | La identidad pública inmobiliaria contradice el certificado agrícola; no hay unidad alimentaria demostrada. |
| Persea Castello | Productor real con fincas en Calabria y Sardegna, pero no hay desglose público suficiente para asignar productos y coordenadas a una unidad concreta. |
| Rusca Paola | Documentación regional apunta a una explotación fuera de Milano; falta resolver la unidad y oferta exactas. |
| Sartorio Elena | La actividad pública apunta a olivar en Capalbio (GR), sin marca u oferta propia actual verificable. |
| Case di Anci | La identidad parece corresponder a Sicilia, pero no se encontró una unidad pública y marca suficientemente corroboradas. |
| Il Germoglio | La explotación pública está en Gubbio (PG), pero no se verificó una oferta alimentaria propia concreta. |
