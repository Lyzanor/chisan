# West Bengal — candidatos

- CSV destino: `data/csv/in/eastern/west-bengal.csv`
- Fuente: roster de jardines operativos de Darjeeling,
  https://www.thunderbolttea.com/darjeeling-tea-gardens-list/ (directorio de
  tercero: da nombre y sub-región, nunca contacto ni titularidad actual)
- Fecha de búsqueda: 2026-08-16
- Alcance: solo té de Darjeeling. Sin barrer todavía: Dooars-Terai, Kolkata
  (dulces, mostaza, panificación) y cualquier categoría no vinícola del estado.

## Sondeados, pendientes de resolver

- **Glenburn Tea Estate** — Teesta Valley. `glenburnteaestate.com` responde 200
  pero sirve la web en JS: no se pudo leer ni dirección ni jardín. Falta
  confirmar la unidad productiva.
- **Okayti Tea Estate** — Mirik. `okayti.com` responde 200 con 495 caracteres de
  texto: web en JS. Además `mirik` no tiene centroide (cayó por homónimo), así
  que esa fila iría sin puerta geográfica.
- **Gopaldhara Tea Estate** — Mirik/Rungbong. `gopaldhara.com` devuelve 403 a
  `curl` con UA de navegador. Un 403 no es un sitio muerto: reintentar por otra
  ruta antes de descartar el dominio.
- **Happy Valley Tea Estate** — Darjeeling. `happyvalleytea.in` no resuelve.
  Comprobar si el jardín publica bajo otro dominio antes de dar nada por muerto.

## Cola sin sondear

Los 87 jardines del roster, por grupo. Ninguno verificado; el roster no prueba
actividad ni titularidad, solo que el jardín figura como operativo.

- Darjeeling este y oeste: Arya, Chongtong, Dooteriah, Kalej Valley, Liza Hill,
  Lingia, Marybong, Mim, Orange Valley, Pussimbing, Risheehat, Rungmook/Cedars,
  Tumsong, Badamtam, Bannockburn, Barnesbeg, Ging, Moondakotee, Phoobshering,
  Puttabong, Rangaroon, Rungneet, Soom, Steinthal
- Kurseong norte y sur: Ambootia, Balasun, Eden Vale, Margaret's Hope,
  Longview, Oaks, Rington, Castleton, Giddapahar, Goomtee, Jogmaya, Jungpana,
  Mahalderam, Mohan Majhua, Monteviot, Mullootar, Narbada Majhua, Nurbong,
  Rohini, Selim Hill, Seepoydhura, Sivitar, Tindharia
- Mirik y Rungbong: Gayabaree & Millikthong, Phuguri, Seeyok, Singbulli,
  Soureni, Thurbo, Avongrove, Chamong, Dhajea, Nagri, Nagri Farm, Selimbong,
  Sungma, Turzum, Teesta Valley, Tukdah, Upper Fagu
- Teesta Valley: Ambiok, Gielle, Kumai, Lopchu, Namring & Upper Namring,
  Runglee Rungliot, Samebeong

Makaibari salió de esta cola y ya está publicado.
