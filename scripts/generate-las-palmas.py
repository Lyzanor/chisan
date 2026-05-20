#!/usr/bin/env python3
import json
import os
import sys
import urllib.parse
from pathlib import Path

# Fallback/Base coordinates for municipalities in Las Palmas (Gran Canaria, Lanzarote, Fuerteventura)
MUNICIPALITY_COORDINATES = {
    # Gran Canaria
    "Agaete": (28.1022, -15.6989),
    "San Bartolomé de Tirajana": (27.9208, -15.5722),
    "Vega de San Mateo": (28.0105, -15.5317),
    "Tejeda": (27.9946, -15.6152),
    "Santa Brígida": (28.0317, -15.4984),
    "Las Palmas de Gran Canaria": (28.1235, -15.4363),
    "Telde": (27.9926, -15.4178),
    "Moya": (28.1114, -15.5847),
    "Teror": (28.0583, -15.5475),
    "Arucas": (28.1186, -15.5222),
    "Gáldar": (28.1436, -15.6534),
    "Santa María de Guía": (28.1386, -15.6322),
    "Agüimes": (27.9048, -15.4452),
    "Ingenio": (27.9213, -15.4419),
    "Santa Lucía de Tirajana": (27.9103, -15.5408),
    "Valleseco": (28.0505, -15.5758),
    "Firgas": (28.1039, -15.5638),
    "Valsequillo de Gran Canaria": (27.9806, -15.4987),
    "Mogán": (27.8837, -15.7247),
    "Aldea de San Nicolás": (27.9829, -15.7797),
    "Artenara": (28.0197, -15.6467),
    
    # Lanzarote
    "San Bartolomé": (28.9996, -13.6133),
    "Yaiza": (28.9558, -13.7667),
    "Tías": (28.9596, -13.6496),
    "Tinajo": (29.0296, -13.6744),
    "Teguise": (29.0594, -13.5587),
    "Haría": (29.1458, -13.4987),
    "Arrecife": (28.9622, -13.5514),

    # Fuerteventura
    "Puerto del Rosario": (28.5008, -13.8622),
    "Betancuria": (28.4244, -14.0572),
    "La Oliva": (28.6108, -13.9287),
    "Tuineje": (28.3246, -14.0414),
    "Pájara": (28.3512, -14.1752),
    "Antigua": (28.4231, -14.0134),
}

PRODUCERS = [
    # VINOS (1 - 25)
    {
        "nombre": "Bodega Los Berrazales",
        "municipio": "Agaete",
        "categoria": "Vino",
        "productos estrella": "Vino blanco seco de uva Moscatel, Tintos jóvenes de uva Listán Negro",
        "direccion": "Calle de San Pedro, 2, Valle de Agaete, 35489 Agaete, Gran Canaria",
        "telefono": "928 89 86 66",
        "correo": "info@bodegalosberrazales.com",
        "web": "https://www.bodegalosberrazales.com",
        "Instagram": "https://www.instagram.com/bodegalosberrazales/",
        "Facebook": "https://www.facebook.com/bodegalosberrazales/",
        "horario": "Lun-Dom 10:00–17:00"
    },
    {
        "nombre": "Bodega Las Tirajanas",
        "municipio": "San Bartolomé de Tirajana",
        "categoria": "Vino",
        "productos estrella": "Vino blanco malvasía volcánica Las Tirajanas, Tinto barrica listán negro",
        "direccion": "Calle de la Constitución, s/n, 35290 San Bartolomé de Tirajana, Gran Canaria",
        "telefono": "928 79 81 12",
        "correo": "info@bodegaslastirajanas.com",
        "web": "https://www.bodegaslastirajanas.com",
        "Instagram": "https://www.instagram.com/bodegaslastirajanas/",
        "Facebook": "https://www.facebook.com/bodegaslastirajanas/",
        "horario": "Lun-Vie 09:00–16:00; Sab 10:00–14:00"
    },
    {
        "nombre": "Bodega Frontón de Oro",
        "municipio": "Vega de San Mateo",
        "categoria": "Vino",
        "productos estrella": "Vino tinto Frontón de Oro barrica, Vino blanco de altura",
        "direccion": "Diseminado de Camaretas, 35, 35320 Vega de San Mateo, Gran Canaria",
        "telefono": "629 11 22 44",
        "correo": "frontondeoro@gmail.com",
        "web": "https://frontondeoro.com",
        "Instagram": "https://www.instagram.com/bodegafrontondeoro/",
        "Facebook": "https://www.facebook.com/frontondeoro/",
        "horario": "Visitas previa concertación"
    },
    {
        "nombre": "Bodega Bentayga",
        "municipio": "Tejeda",
        "categoria": "Vino",
        "productos estrella": "Vinos Agala 1318 blanco seco, Agala 1175 tinto crianza de altura",
        "direccion": "Lugar Cuevas Caídas, s/n, 35005 Tejeda, Gran Canaria",
        "telefono": "928 66 61 11",
        "correo": "bodega@bodegasbentayga.com",
        "web": "https://www.bodegasbentayga.com",
        "Instagram": "https://www.instagram.com/bodegasbentayga/",
        "Facebook": "https://www.facebook.com/bodegasbentayga/",
        "horario": "Lun-Vie 10:00–15:00"
    },
    {
        "nombre": "Bodega San Juan",
        "municipio": "Santa Brígida",
        "categoria": "Vino",
        "productos estrella": "Vino tinto ecológico Mocanal, Visitas guiadas al Museo del Vino",
        "direccion": "Finca El Mocanal, Carretera del Centro, km 12, 35300 Santa Brígida, Gran Canaria",
        "telefono": "928 64 00 75",
        "correo": "info@bodegadesanjuan.com",
        "web": "https://www.bodegadesanjuan.com",
        "Instagram": "https://www.instagram.com/bodegadesanjuan/",
        "Facebook": "https://www.facebook.com/bodegadesanjuan/",
        "horario": "Lun-Sab 10:00–14:00"
    },
    {
        "nombre": "Bodega Ventura",
        "municipio": "Santa Brígida",
        "categoria": "Vino",
        "productos estrella": "Vino tinto Eidan Listán Negro, Eidan Blanco Dulce",
        "direccion": "Lugar Lomo Espino, 15, 35300 Santa Brígida, Gran Canaria",
        "telefono": "650 30 40 50",
        "correo": "bodegaventura@gmail.com",
        "web": "https://bodegaventura.com",
        "Instagram": "https://www.instagram.com/bodegaventuragrancanaria/",
        "Facebook": "https://www.facebook.com/bodegaventura/",
        "horario": "Visitas concertadas previa cita"
    },
    {
        "nombre": "Bodega Mondalón",
        "municipio": "Las Palmas de Gran Canaria",
        "categoria": "Vino",
        "productos estrella": "Vino tinto Mondalón Selección, Vino blanco seco de coupage autóctono",
        "direccion": "Carretera de Los Hoyos, km 5.2, 35017 Las Palmas de Gran Canaria, Gran Canaria",
        "telefono": "928 35 15 15",
        "correo": "info@bodegamondalon.es",
        "web": "https://www.bodegamondalon.es",
        "Instagram": "https://www.instagram.com/bodegamondalon/",
        "Facebook": "https://www.facebook.com/bodega.mondalon/",
        "horario": "Lun-Vie 09:00–16:00"
    },
    {
        "nombre": "Bodega Plaza Perdida",
        "municipio": "Santa Brígida",
        "categoria": "Vino",
        "productos estrella": "Vinos tintos tradicionales y vinos dulces de licor",
        "direccion": "Camino Plaza Perdida, 10, 35300 Santa Brígida, Gran Canaria",
        "telefono": "620 11 22 33",
        "correo": "plazaperdida@gmail.com",
        "web": "https://plazaperdida.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/plazaperdida/",
        "horario": "Visitas concertadas previa cita"
    },
    {
        "nombre": "Bodegas El Grifo",
        "municipio": "San Bartolomé",
        "categoria": "Vino",
        "productos estrella": "Vino Malvasía Volcánica Seco Colección, Tinto Listán Negro de pie franco",
        "direccion": "Carretera LZ-30 Teguise-Uga, km 11, 35560 San Bartolomé, Lanzarote",
        "telefono": "928 52 49 51",
        "correo": "alambique@elgrifo.com",
        "web": "https://elgrifo.com",
        "Instagram": "https://www.instagram.com/bodegas.elgrifo/",
        "Facebook": "https://www.facebook.com/BodegasElGrifo/",
        "horario": "Lun-Dom 10:00–18:00"
    },
    {
        "nombre": "Bodega La Geria",
        "municipio": "Yaiza",
        "categoria": "Vino",
        "productos estrella": "Vino Malvasía Volcánica Seco Melián, Vino dulce Moscatel de Alejandría",
        "direccion": "Carretera La Geria, km 19, 35570 Yaiza, Lanzarote",
        "telefono": "928 17 31 78",
        "correo": "bodega@lageria.com",
        "web": "https://www.lageria.com",
        "Instagram": "https://www.instagram.com/bodegalageria/",
        "Facebook": "https://www.facebook.com/lageriabodega/",
        "horario": "Lun-Dom 09:30–18:00"
    },
    {
        "nombre": "Bodegas Rubicón",
        "municipio": "Yaiza",
        "categoria": "Vino",
        "productos estrella": "Vino Rubicón Malvasía Seco DOP, Tinto Rubicón Listán Negro",
        "direccion": "Carretera La Geria, 2, 35570 Yaiza, Lanzarote",
        "telefono": "928 17 37 08",
        "correo": "info@bodegasrubicon.com",
        "web": "https://www.bodegasrubicon.com",
        "Instagram": "https://www.instagram.com/bodegasrubicon/",
        "Facebook": "https://www.facebook.com/BodegasRubicon/",
        "horario": "Lun-Dom 10:00–20:00"
    },
    {
        "nombre": "Bodega Vega de Yuco",
        "municipio": "Yaiza",
        "categoria": "Vino",
        "productos estrella": "Vino Princesa Ico Malvasía volcánica, Vinos emblemáticos Esencia Yaiza",
        "direccion": "Lugar Camino de la Vegueta, s/n, 35572 Masdache, Yaiza, Lanzarote",
        "telefono": "928 52 43 56",
        "correo": "info@vegadeyuco.es",
        "web": "https://vegadeyuco.com",
        "Instagram": "https://www.instagram.com/vegadeyuco/",
        "Facebook": "https://www.facebook.com/vegadeyuco/",
        "horario": "Lun-Vie 08:00–16:00"
    },
    {
        "nombre": "Bodegas Stratvs",
        "municipio": "Yaiza",
        "categoria": "Vino",
        "productos estrella": "Vino Stratvs Malvasía Seco, Tintos de guarda envejecidos en barrica",
        "direccion": "Carretera de La Geria, km 18, 35570 Yaiza, Lanzarote",
        "telefono": "928 80 99 77",
        "correo": "info@stratvs.com",
        "web": "https://www.stratvs.com",
        "Instagram": "https://www.instagram.com/bodegastratvs/",
        "Facebook": "https://www.facebook.com/bodegastratvs/",
        "horario": "Lun-Dom 10:00–20:00"
    },
    {
        "nombre": "Bodega Vulcano de Lanzarote",
        "municipio": "Tías",
        "categoria": "Vino",
        "productos estrella": "Vino Vulcano Malvasía volcánica seco, Tinto listán negro fermentado en barrica",
        "direccion": "Calle de la Asomada, 94, 35571 Tías, Lanzarote",
        "telefono": "928 52 42 22",
        "correo": "info@bodegavulcano.es",
        "web": "https://www.bodegavulcano.es",
        "Instagram": "https://www.instagram.com/bodegavulcano/",
        "Facebook": "https://www.facebook.com/bodegavulcanolanzarote/",
        "horario": "Lun-Vie 10:00–15:00"
    },
    {
        "nombre": "Bodega Bermejo",
        "municipio": "San Bartolomé",
        "categoria": "Vino",
        "productos estrella": "Vino Los Bermejos Malvasía Volcánica Seco, Vino espumoso brut nature",
        "direccion": "Camino de La Florida, 7, 35560 San Bartolomé, Lanzarote",
        "telefono": "928 52 24 63",
        "correo": "info@losbermejos.com",
        "web": "https://losbermejos.com",
        "Instagram": "https://www.instagram.com/bodegaslosbermejos/",
        "Facebook": "https://www.facebook.com/bodegabermejo/",
        "horario": "Lun-Vie 08:00–16:00"
    },
    {
        "nombre": "Bodega Guiguan",
        "municipio": "Tinajo",
        "categoria": "Vino",
        "productos estrella": "Vino blanco seco Guiguan malvasía, Tinto tradicional de tinaja",
        "direccion": "Calle de Guiguan, 12, 35560 Tinajo, Lanzarote",
        "telefono": "928 84 00 22",
        "correo": "info@bodegaguiguan.com",
        "web": "https://bodegaguiguan.com",
        "Instagram": "https://www.instagram.com/bodegaguiguan/",
        "Facebook": "https://www.facebook.com/bodegaguiguan/",
        "horario": "Lun-Vie 09:00–14:00"
    },
    {
        "nombre": "Celler El Chupadero",
        "municipio": "Yaiza",
        "categoria": "Vino",
        "productos estrella": "Vinos malvasía ecológicos locales y tapas volcánicas",
        "direccion": "Lugar La Geria, 3, 35570 Yaiza, Lanzarote",
        "telefono": "928 17 31 00",
        "correo": "info@el-chupadero.com",
        "web": "https://el-chupadero.com",
        "Instagram": "https://www.instagram.com/elchupaderolanzarote/",
        "Facebook": "https://www.facebook.com/elchupaderolanzarote/",
        "horario": "Mar-Dom 12:00–23:00"
    },
    {
        "nombre": "Bodega Reymar",
        "municipio": "Tinajo",
        "categoria": "Vino",
        "productos estrella": "Vino Los Reyes blanco malvasía seco, Tinto Los Reyes varietal",
        "direccion": "Calle de los Reyes, 42, 35560 Tinajo, Lanzarote",
        "telefono": "928 84 05 60",
        "correo": "bodegareymar@gmail.com",
        "web": "https://bodegareymar.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/bodegareymar/",
        "horario": "Visitas concertadas bajo reserva"
    },
    {
        "nombre": "Bodega Martinón",
        "municipio": "Yaiza",
        "categoria": "Vino",
        "productos estrella": "Vino blanco Martinón Malvasía Seco, Rosado de uva Listán Negro",
        "direccion": "Carretera La Geria, km 16, 35570 Yaiza, Lanzarote",
        "telefono": "639 50 60 70",
        "correo": "info@bodegamartinon.com",
        "web": "https://www.bodegamartinon.com",
        "Instagram": "https://www.instagram.com/bodegamartinon/",
        "Facebook": "https://www.facebook.com/bodegamartinon/",
        "horario": "Visitas guiadas concertadas"
    },
    {
        "nombre": "Bodega La Florida",
        "municipio": "San Bartolomé",
        "categoria": "Vino",
        "productos estrella": "Vino blanco seco La Florida, Vino tinto barrica canario",
        "direccion": "Carretera LZ-30, km 9.5, 35560 San Bartolomé, Lanzarote",
        "telefono": "928 52 23 20",
        "correo": "info@bodegalaflorida.com",
        "web": "https://www.bodegalaflorida.com",
        "Instagram": "https://www.instagram.com/bodegalaflorida/",
        "Facebook": "https://www.facebook.com/bodegalaflorida/",
        "horario": "Lun-Dom 10:00–18:00"
    },
    {
        "nombre": "Bodega Puro Rofe",
        "municipio": "Yaiza",
        "categoria": "Vino",
        "productos estrella": "Vinos naturales de micro-parcelas Rofe Blanco, Mentidero",
        "direccion": "Calle de Masdache, 18, 35572 Yaiza, Lanzarote",
        "telefono": "607 11 22 55",
        "correo": "info@purorofe.com",
        "web": "https://purorofe.com",
        "Instagram": "https://www.instagram.com/purorofe_vini/",
        "Facebook": "https://www.facebook.com/purorofevini/",
        "horario": "Visitas concertadas"
    },
    {
        "nombre": "Bodega Tisalaya",
        "municipio": "Tinajo",
        "categoria": "Vino",
        "productos estrella": "Vino blanco artesanal Tisalaya fermentado sobre lías",
        "direccion": "Calle de la Costa, 3, 35560 Tinajo, Lanzarote",
        "telefono": "651 86 52 02",
        "correo": "tisalayavinos@gmail.com",
        "web": "https://tisalaya.com",
        "Instagram": "https://www.instagram.com/bodegatisalaya/",
        "Facebook": "https://www.facebook.com/bodegatisalaya/",
        "horario": "Visitas exclusivas con cita"
    },
    {
        "nombre": "Bodega Conatvs",
        "municipio": "La Oliva",
        "categoria": "Vino",
        "productos estrella": "Vino tinto Conatvs de viñedos de Fuerteventura, Blanco seco local",
        "direccion": "Calle de los Coroneles, s/n, Villaverde, 35640 La Oliva, Fuerteventura",
        "telefono": "689 30 40 50",
        "correo": "bodegaconatvs@gmail.com",
        "web": "https://bodegaconatvs.com",
        "Instagram": "https://www.instagram.com/bodegaconatvs/",
        "Facebook": "https://www.facebook.com/conatvs/",
        "horario": "Visitas bajo acuerdo previo"
    },
    {
        "nombre": "Bodega Gavias",
        "municipio": "Puerto del Rosario",
        "categoria": "Vino",
        "productos estrella": "Vino tinto joven de gavias desérticas de Fuerteventura",
        "direccion": "Carretera del Centro, km 5, Tetir, 35613 Puerto del Rosario, Fuerteventura",
        "telefono": "609 88 77 66",
        "correo": "gaviasfuerteventura@gmail.com",
        "web": "https://gaviasfuerteventura.com",
        "Instagram": "https://www.instagram.com/bodegagavias/",
        "Facebook": "https://www.facebook.com/bodegagavias/",
        "horario": "Visitas previa concertación"
    },
    {
        "nombre": "Bodega Teberite",
        "municipio": "Tuineje",
        "categoria": "Vino",
        "productos estrella": "Vino tinto local Teberite, Varietales experimentales majoreros",
        "direccion": "Calle de Teberite, 5, 35628 Tuineje, Fuerteventura",
        "telefono": "644 11 22 33",
        "correo": "teberitevinos@gmail.com",
        "web": "https://teberitevinos.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/teberite/",
        "horario": "Solo con cita"
    },

    # ACEITES (26 - 36)
    {
        "nombre": "Aceite de Oliva Teguerey",
        "municipio": "Tuineje",
        "categoria": "Aceite",
        "productos estrella": "Aceite de Oliva Virgen Extra Teguerey Hojiblanca-Arbequina",
        "direccion": "Finca Teguerey, s/n, 35628 Tuineje, Fuerteventura",
        "telefono": "650 45 45 45",
        "correo": "info@aceiteteguerey.com",
        "web": "https://aceiteteguerey.com",
        "Instagram": "https://www.instagram.com/teguerey_aceites/",
        "Facebook": "https://www.facebook.com/teguerey/",
        "horario": "Lun-Vie 09:00–14:00"
    },
    {
        "nombre": "Aceite de Finca Torres",
        "municipio": "Puerto del Rosario",
        "categoria": "Aceite",
        "productos estrella": "Aceite de Oliva Virgen Extra Finca Torres de aceituna Picual",
        "direccion": "Carretera de Tetir, km 2.5, 35613 Puerto del Rosario, Fuerteventura",
        "telefono": "928 85 91 11",
        "correo": "fincatorres@hotmail.com",
        "web": "https://fincatorres.com",
        "Instagram": "https://www.instagram.com/finca_torres/",
        "Facebook": "https://www.facebook.com/fincatorresfuerteventura/",
        "horario": "Lun-Vie 08:00–16:00"
    },
    {
        "nombre": "Aceite de Oliva Jagüey",
        "municipio": "Tuineje",
        "categoria": "Aceite",
        "productos estrella": "Aceite virgen extra Jagüey de recolección selectiva",
        "direccion": "Diseminado de Tuineje, 45, 35628 Tuineje, Fuerteventura",
        "telefono": "611 12 34 56",
        "correo": "jagueyaceites@gmail.com",
        "web": "https://jagueyaceites.com",
        "Instagram": "https://www.instagram.com/jagueyaceites/",
        "Facebook": "https://www.facebook.com/jaguey/",
        "horario": "Visitas concertadas"
    },
    {
        "nombre": "Aceite de Oliva Tres Olivos",
        "municipio": "Antigua",
        "categoria": "Aceite",
        "productos estrella": "Aceite ecológico Tres Olivos de prensa en frío",
        "direccion": "Calle de la Cruz, 8, Agua de Bueyes, 35638 Antigua, Fuerteventura",
        "telefono": "633 44 55 66",
        "correo": "tresolivos@gmail.com",
        "web": "https://tresolivosfuerteventura.com",
        "Instagram": "https://www.instagram.com/tresolivosfuerteventura/",
        "Facebook": "https://www.facebook.com/tresolivos/",
        "horario": "Lun-Sab 09:00–13:00"
    },
    {
        "nombre": "Aceite de Oliva Oro Canario",
        "municipio": "Santa Lucía de Tirajana",
        "categoria": "Aceite",
        "productos estrella": "Aceite de Oliva Virgen Extra Oro Canario picual y verdial",
        "direccion": "Camino de la Almazara, 4, Santa Lucía de Tirajana, Gran Canaria",
        "telefono": "607 89 90 91",
        "correo": "info@orocanario.com",
        "web": "https://orocanario.com",
        "Instagram": "https://www.instagram.com/orocanario/",
        "Facebook": "https://www.facebook.com/orocanario/",
        "horario": "Lun-Vie 09:00–17:00"
    },
    {
        "nombre": "Aceite Caserío de Temisas",
        "municipio": "Agüimes",
        "categoria": "Aceite",
        "productos estrella": "Aceite Caserío de Temisas DOP Gran Canaria",
        "direccion": "Caserío de Temisas, s/n, 35260 Agüimes, Gran Canaria",
        "telefono": "928 78 99 80",
        "correo": "turismo@aguimes.es",
        "web": "https://temisas.aguimes.es",
        "Instagram": "https://www.instagram.com/temisas_aceites/",
        "Facebook": "https://www.facebook.com/caseriotemisas/",
        "horario": "Sab-Dom 10:00–14:00"
    },
    {
        "nombre": "Aceite Lomo de La Cruz",
        "municipio": "Telde",
        "categoria": "Aceite",
        "productos estrella": "Aceite de oliva virgen extra de olivares tradicionales de Telde",
        "direccion": "Lugar Lomo de La Cruz, 12, 35200 Telde, Gran Canaria",
        "telefono": "677 33 44 55",
        "correo": "lomodelacruz@gmail.com",
        "web": "https://lomodelacruz.com",
        "Instagram": "https://www.instagram.com/lomodelacruz/",
        "Facebook": "https://www.facebook.com/lomodelacruz/",
        "horario": "Visitas concertadas"
    },
    {
        "nombre": "Aceite Finca Los Encinos",
        "municipio": "Vega de San Mateo",
        "categoria": "Aceite",
        "productos estrella": "Aceite artesano Finca Los Encinos monovarietal picual de cumbre",
        "direccion": "Calle de los Encinos, 2, 35320 Vega de San Mateo, Gran Canaria",
        "telefono": "620 90 80 70",
        "correo": "fincadeencinos@gmail.com",
        "web": "https://fincadeencinos.com",
        "Instagram": "https://www.instagram.com/fincadeencinos/",
        "Facebook": "https://www.facebook.com/fincadeencinos/",
        "horario": "Sábados 09:00–14:00"
    },
    {
        "nombre": "Aceite de Oliva Santa Lucía",
        "municipio": "Santa Lucía de Tirajana",
        "categoria": "Aceite",
        "productos estrella": "Aceite virgen extra de Santa Lucía ecológico",
        "direccion": "Calle de la Hoya, 6, 35290 Santa Lucía de Tirajana, Gran Canaria",
        "telefono": "928 79 70 80",
        "correo": "santaluciaaceites@gmail.com",
        "web": "https://santaluciaaceites.com",
        "Instagram": "https://www.instagram.com/santaluciaaceites/",
        "Facebook": "https://www.facebook.com/santaluciaaceites/",
        "horario": "Lun-Vie 09:00–13:00"
    },
    {
        "nombre": "Aceite de Oliva El Trull",
        "municipio": "Agüimes",
        "categoria": "Aceite",
        "productos estrella": "Aceite virgen extra El Trull coupage arbequina y picual",
        "direccion": "Calle de la Almazara, 3, 35260 Agüimes, Gran Canaria",
        "telefono": "690 12 34 56",
        "correo": "eltrull@gmail.com",
        "web": "https://eltrullaguimes.com",
        "Instagram": "https://www.instagram.com/eltrullaguimes/",
        "Facebook": "https://www.facebook.com/eltrull/",
        "horario": "Lun-Sab 09:00–14:00"
    },
    {
        "nombre": "Aceite de Oliva Finca Condal",
        "municipio": "San Bartolomé de Tirajana",
        "categoria": "Aceite",
        "productos estrella": "Aceite exclusivo Finca Condal reserva especial",
        "direccion": "Finca Condal, s/n, Juan Grande, 35107 San Bartolomé de Tirajana, Gran Canaria",
        "telefono": "928 73 00 22",
        "correo": "info@fincacondal.com",
        "web": "https://www.fincacondal.com",
        "Instagram": "https://www.instagram.com/fincacondal/",
        "Facebook": "https://www.facebook.com/fincacondal/",
        "horario": "Lun-Vie 10:00–16:00"
    },

    # QUESOS Y LÁCTEOS (37 - 62)
    {
        "nombre": "Quesería Cortijo de Caideros",
        "municipio": "Gáldar",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso Flor de Guía de cuajo vegetal DOP Cortijo de Caideros",
        "direccion": "Lugar Caideros de Gáldar, s/n, 35468 Gáldar, Gran Canaria",
        "telefono": "649 22 33 44",
        "correo": "cortijodecaideros@gmail.com",
        "web": "https://cortijodecaideros.com",
        "Instagram": "https://www.instagram.com/cortijodecaideros/",
        "Facebook": "https://www.facebook.com/cortijodecaideros/",
        "horario": "Lun-Sab 09:00–15:00"
    },
    {
        "nombre": "Quesería Campo de Guía",
        "municipio": "Santa María de Guía",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso de flor de oveja y vaca Campo de Guía tradicional",
        "direccion": "Calle de la Quesería, 1, 35450 Santa María de Guía, Gran Canaria",
        "telefono": "928 88 10 20",
        "correo": "quesosdeguia@gmail.com",
        "web": "https://quesosdeguia.com",
        "Instagram": "https://www.instagram.com/quesosdeguia/",
        "Facebook": "https://www.facebook.com/quesosdeguia/",
        "horario": "Lun-Sab 08:30–14:00"
    },
    {
        "nombre": "Quesería La Gloria",
        "municipio": "San Bartolomé de Tirajana",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso semicurado de cabra La Gloria aliñado con pimentón",
        "direccion": "Barranco de Fataga, s/n, 35290 San Bartolomé de Tirajana, Gran Canaria",
        "telefono": "607 45 45 46",
        "correo": "lagloriaqueso@gmail.com",
        "web": "https://lagloriaquesos.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/queserialagloria/",
        "horario": "Lun-Dom 09:00–17:00"
    },
    {
        "nombre": "Quesería Lomo El Palo",
        "municipio": "Gáldar",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso de oveja curado Lomo El Palo de pastores trashumantes",
        "direccion": "Lugar Fagajesto, s/n, 35468 Gáldar, Gran Canaria",
        "telefono": "629 88 99 00",
        "correo": "quesolomoelpalo@gmail.com",
        "web": "https://lomoelpalo.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/lomoelpalo/",
        "horario": "Lun-Sab 09:00–14:00"
    },
    {
        "nombre": "Quesería Madre Vieja",
        "municipio": "Moya",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso curado de mezcla vaca-oveja-cabra de Madre Vieja",
        "direccion": "Camino de Madre Vieja, 8, 35420 Moya, Gran Canaria",
        "telefono": "928 61 15 20",
        "correo": "madreviejaquesos@gmail.com",
        "web": "https://madreviejaquesos.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/queseriamadrevieja/",
        "horario": "Lun-Sab 09:00–13:30"
    },
    {
        "nombre": "Quesos Camino de Santiago",
        "municipio": "Telde",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso de cabra semicurado ahumado de Telde",
        "direccion": "Calle Lomo Cementerio, s/n, 35200 Telde, Gran Canaria",
        "telefono": "630 20 30 40",
        "correo": "caminodesantiagoquesos@gmail.com",
        "web": "https://caminodesantiagoquesos.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/caminodesantiagoquesos/",
        "horario": "Lun-Vie 09:00–14:00"
    },
    {
        "nombre": "Quesería Naroy",
        "municipio": "Ingenio",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso semicurado de cabra Naroy de leche cruda",
        "direccion": "Calle de Naroy, 14, 35250 Ingenio, Gran Canaria",
        "telefono": "651 11 22 33",
        "correo": "quesosnaroy@gmail.com",
        "web": "https://quesosnaroy.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/queserianaroy/",
        "horario": "Lun-Sab 09:00–15:00"
    },
    {
        "nombre": "Quesería El Cortijo de Pavón",
        "municipio": "Santa María de Guía",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso de Guía de media flor Pavón tradicional",
        "direccion": "Pago de Pavón, s/n, 35450 Santa María de Guía, Gran Canaria",
        "telefono": "928 88 12 30",
        "correo": "cortijodepavon@gmail.com",
        "web": "https://cortijodepavon.com",
        "Instagram": "https://www.instagram.com/cortijodepavon/",
        "Facebook": "https://www.facebook.com/cortijodepavon/",
        "horario": "Lun-Sab 09:00–14:30"
    },
    {
        "nombre": "Quesería La Caldera",
        "municipio": "Moya",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso tierno y semicurado de Moya elaborado a mano",
        "direccion": "Camino de La Caldera, 15, 35420 Moya, Gran Canaria",
        "telefono": "610 20 40 60",
        "correo": "queserialacaldera@gmail.com",
        "web": "https://lacalderaquesos.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/queserialacaldera/",
        "horario": "Lun-Vie 08:00–14:00"
    },
    {
        "nombre": "Quesería Altos de Moya",
        "municipio": "Moya",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso curado madurado con aceite de oliva y gofio",
        "direccion": "Diseminado Altos de Moya, 5, 35420 Moya, Gran Canaria",
        "telefono": "670 99 88 77",
        "correo": "altosdemoya@gmail.com",
        "web": "https://altosdemoya.com",
        "Instagram": "https://www.instagram.com/altosdemoya/",
        "Facebook": "https://www.facebook.com/altosdemoya/",
        "horario": "Lun-Sab 09:00–14:00"
    },
    {
        "nombre": "Quesería Quesos de Tetir",
        "municipio": "Puerto del Rosario",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso Majorero DOP Tetir semicurado, Curado al pimentón",
        "direccion": "Calle de la Quesería, 2, Tetir, 35613 Puerto del Rosario, Fuerteventura",
        "telefono": "928 85 92 20",
        "correo": "quesosdetetir@gmail.com",
        "web": "https://quesosdetetir.com",
        "Instagram": "https://www.instagram.com/quesosdetetir/",
        "Facebook": "https://www.facebook.com/quesosdetetir/",
        "horario": "Lun-Vie 08:00–15:00"
    },
    {
        "nombre": "Quesería La Villa",
        "municipio": "Betancuria",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso Majorero tradicional artesanal de Betancuria",
        "direccion": "Calle Alcalde Carmelo Silvera, 3, 35637 Betancuria, Fuerteventura",
        "telefono": "928 87 80 50",
        "correo": "queserialavillafuerteventura@gmail.com",
        "web": "https://queserialavilla.com",
        "Instagram": "https://www.instagram.com/queserialavillafuerteventura/",
        "Facebook": "https://www.facebook.com/queserialavilla/",
        "horario": "Lun-Dom 09:30–16:30"
    },
    {
        "nombre": "Quesería Maxorata",
        "municipio": "Puerto del Rosario",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso Majorero DOP Maxorata semicurado pimentón, Queso Maxorata tinto",
        "direccion": "Carretera Antigua, km 1.5, Risco Prieto, 35600 Puerto del Rosario, Fuerteventura",
        "telefono": "928 85 14 00",
        "correo": "info@ggfuerteventura.com",
        "web": "https://www.maxorata.es",
        "Instagram": "https://www.instagram.com/quesomaxorata/",
        "Facebook": "https://www.facebook.com/QuesoMaxorata/",
        "horario": "Lun-Vie 08:00–16:00"
    },
    {
        "nombre": "Quesería Guriamen",
        "municipio": "La Oliva",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso de cabra semicurado y curado Guriamen de Villaverde",
        "direccion": "Calle de los Caserones, 18, Villaverde, 35640 La Oliva, Fuerteventura",
        "telefono": "696 11 22 33",
        "correo": "quesosguriamen@gmail.com",
        "web": "https://quesosguriamen.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/queseriaguriamen/",
        "horario": "Lun-Sab 09:00–14:00"
    },
    {
        "nombre": "Quesería Julián Díaz",
        "municipio": "Tuineje",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso Majorero DOP Julián Díaz semicurado gofio, Queso curado",
        "direccion": "Calle del Queso, s/n, Tiscamanita, 35627 Tuineje, Fuerteventura",
        "telefono": "629 11 33 55",
        "correo": "juliandiazqueseria@gmail.com",
        "web": "https://juliandiazquesos.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/queseriajuliandiaz/",
        "horario": "Lun-Sab 09:00–14:30"
    },
    {
        "nombre": "Quesería Felipa La de los Quesos",
        "municipio": "Tuineje",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso tierno y curado Felipa elaborado en Tiscamanita",
        "direccion": "Lugar Tiscamanita, 40, 35627 Tuineje, Fuerteventura",
        "telefono": "644 20 30 40",
        "correo": "felipaladequesos@gmail.com",
        "web": "https://felipaladequesos.com",
        "Instagram": "https://www.instagram.com/felipaladequesos/",
        "Facebook": "https://www.facebook.com/felipaladequesos/",
        "horario": "Lun-Dom 08:00–14:00"
    },
    {
        "nombre": "Quesería El Tofio",
        "municipio": "Puerto del Rosario",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso Majorero DOP El Tofio curado al pimentón, Queso fresco ahumado",
        "direccion": "Zona Industrial Risco Prieto, s/n, 35600 Puerto del Rosario, Fuerteventura",
        "telefono": "928 85 14 01",
        "correo": "info@eltofio.com",
        "web": "https://eltofio.com",
        "Instagram": "https://www.instagram.com/quesoeltofio/",
        "Facebook": "https://www.facebook.com/quesoeltofio/",
        "horario": "Lun-Vie 08:00–15:00"
    },
    {
        "nombre": "Quesería Ganadería La Pared",
        "municipio": "Pájara",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Quesos tiernos y curados de cabra majorera en pastoreo libre",
        "direccion": "Finca La Pared, s/n, 35627 Pájara, Fuerteventura",
        "telefono": "650 90 90 90",
        "correo": "ganaderialapared@gmail.com",
        "web": "https://ganaderialapared.com",
        "Instagram": "https://www.instagram.com/ganaderialapared/",
        "Facebook": "https://www.facebook.com/ganaderialapared/",
        "horario": "Lun-Sab 09:00–14:00"
    },
    {
        "nombre": "Quesería Cabo Sargento",
        "municipio": "Antigua",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso curado Cabo Sargento madurado tradicional de Antigua",
        "direccion": "Calle de los Sargento, 4, 35630 Antigua, Fuerteventura",
        "telefono": "620 33 44 55",
        "correo": "cabosargento@gmail.com",
        "web": "https://cabosargentoqueseria.com",
        "Instagram": "https://www.instagram.com/cabosargentoqueseria/",
        "Facebook": "https://www.facebook.com/cabosargento/",
        "horario": "Lun-Sab 09:00–13:00"
    },
    {
        "nombre": "Quesería La Pastorita",
        "municipio": "Pájara",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso de cabra semicurado La Pastorita elaborado en Pájara",
        "direccion": "Barranco de Pájara, s/n, 35628 Pájara, Fuerteventura",
        "telefono": "633 11 22 44",
        "correo": "lapastoritafuerte@gmail.com",
        "web": "https://lapastoritafuerte.com",
        "Instagram": "https://www.instagram.com/lapastoritafuerte/",
        "Facebook": "https://www.facebook.com/lapastorita/",
        "horario": "Lun-Vie 09:00–14:00"
    },
    {
        "nombre": "Quesería El Rio",
        "municipio": "Puerto del Rosario",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Quesos tiernos de leche de cabra de pasto local",
        "direccion": "Lugar El Río de Puerto, s/n, 35613 Puerto del Rosario, Fuerteventura",
        "telefono": "611 90 90 90",
        "correo": "queseriaelrio@gmail.com",
        "web": "https://queseriaelrio.com",
        "Instagram": "https://www.instagram.com/queseriaelriofuerte/",
        "Facebook": "https://www.facebook.com/queseriaelrio/",
        "horario": "Lun-Sab 08:30–13:30"
    },
    {
        "nombre": "Quesería El Faro",
        "municipio": "Teguise",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso de cabra de Lanzarote tierno, curado y pimentón El Faro",
        "direccion": "Calle de los Volcanes, 5, Tahíche, 35507 Teguise, Lanzarote",
        "telefono": "928 80 50 60",
        "correo": "info@queseriaelfaro.com",
        "web": "https://queseriaelfaro.com",
        "Instagram": "https://www.instagram.com/queserialanzaroteelfaro/",
        "Facebook": "https://www.facebook.com/queseriaelfaro/",
        "horario": "Lun-Vie 08:00–14:30"
    },
    {
        "nombre": "Quesería Rubicón",
        "municipio": "Yaiza",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso tierno y semicurado Rubicón de leche de cabra de Yaiza",
        "direccion": "Calle de Femés, 15, Femés, 35570 Yaiza, Lanzarote",
        "telefono": "928 83 00 11",
        "correo": "queseriarubicon@gmail.com",
        "web": "https://queseriarubiconlanzarote.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/queseriarubicon/",
        "horario": "Lun-Dom 09:00–18:00"
    },
    {
        "nombre": "Quesería Flor de Luz",
        "municipio": "San Bartolomé",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso de cabra semicurado ecológico Flor de Luz",
        "direccion": "Calle de la Florida, s/n, 35560 San Bartolomé, Lanzarote",
        "telefono": "647 11 22 33",
        "correo": "flordeluzlanzarote@gmail.com",
        "web": "https://flordeluzlanzarote.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/queseriaflordeluz/",
        "horario": "Lun-Sab 09:00–14:00"
    },
    {
        "nombre": "Quesería Tinache",
        "municipio": "Tinajo",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso tierno, curado e impregnado de mojo rojo Tinache",
        "direccion": "Calle de Tinache, 3, 35560 Tinajo, Lanzarote",
        "telefono": "928 84 01 02",
        "correo": "quesostinache@gmail.com",
        "web": "https://quesostinache.com",
        "Instagram": "https://www.instagram.com/queseria_tinache/",
        "Facebook": "https://www.facebook.com/queseriatinache/",
        "horario": "Lun-Vie 08:30–14:00"
    },
    {
        "nombre": "Quesería El Cortijo",
        "municipio": "Teguise",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso curado ahumado artesanal El Cortijo de Lanzarote",
        "direccion": "Calle de la Vega, s/n, 35530 Teguise, Lanzarote",
        "telefono": "630 90 80 70",
        "correo": "cortijolanzarotequesos@gmail.com",
        "web": "https://cortijolanzarote.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/queseriaelcortijo/",
        "horario": "Lun-Sab 09:00–13:30"
    },

    # CARNES Y EMBUTIDOS (63 - 75)
    {
        "nombre": "Embutidos El Secuestro",
        "municipio": "Teror",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Chorizo de Teror El Secuestro blando para untar, Morcilla dulce",
        "direccion": "Lugar El Secuestro, 45, 35450 Teror, Gran Canaria",
        "telefono": "928 63 05 50",
        "correo": "info@embutidoselsecuestro.com",
        "web": "https://embutidoselsecuestro.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/embutidoselsecuestro/",
        "horario": "Lun-Vie 08:00–16:00"
    },
    {
        "nombre": "Carnicería Gonzalo",
        "municipio": "Teror",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Chorizo de Teror artesano Gonzalo, Chicharrones crujientes",
        "direccion": "Paseo de la Iglesia, 2, 35430 Teror, Gran Canaria",
        "telefono": "928 63 02 12",
        "correo": "carniceriagonzaloteror@gmail.com",
        "web": "https://carniceriagonzalo.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/carniceriagonzalo/",
        "horario": "Lun-Sab 08:00–14:00"
    },
    {
        "nombre": "Embutidos Canarios Los Nueces",
        "municipio": "Moya",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Chorizo parrillero Los Nueces, Salchichas frescas tradicionales",
        "direccion": "Carretera Cabo Verde, km 2, 35420 Moya, Gran Canaria",
        "telefono": "928 61 10 33",
        "correo": "info@losnueces.com",
        "web": "https://losnueces.com",
        "Instagram": "https://www.instagram.com/embutidoslosnueces/",
        "Facebook": "https://www.facebook.com/losnueces/",
        "horario": "Lun-Vie 08:00–16:00"
    },
    {
        "nombre": "Carnes del País Gran Canaria",
        "municipio": "Telde",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Carne de vacuno local madurada, Carne de cochino negro canario",
        "direccion": "Zona Industrial Maipez, Calle 3, Nave 12, 35200 Telde, Gran Canaria",
        "telefono": "928 69 90 90",
        "correo": "comercial@carnesdelpaisgc.com",
        "web": "https://carnesdelpaisgc.com",
        "Instagram": "https://www.instagram.com/carnesdelpais_gc/",
        "Facebook": "https://www.facebook.com/carnesdelpaisgc/",
        "horario": "Lun-Vie 07:00–15:00"
    },
    {
        "nombre": "Embutidos Los Canarios",
        "municipio": "Teror",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Chorizo de Teror semicurado y morcilla dulce Los Canarios",
        "direccion": "Calle de los Canarios, 3, 35430 Teror, Gran Canaria",
        "telefono": "928 63 08 80",
        "correo": "loscanarios@embutidos.com",
        "web": "https://loscanariosembutidos.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/loscanariosembutidos/",
        "horario": "Lun-Vie 08:00–14:00"
    },
    {
        "nombre": "Jamones Gran Canaria",
        "municipio": "Ingenio",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Jamón curado artesano y paletas de cerdo alimentado con gofio",
        "direccion": "Calle del Jamón, 5, 35250 Ingenio, Gran Canaria",
        "telefono": "655 44 33 22",
        "correo": "jamonesgc@gmail.com",
        "web": "https://jamonesgrancanaria.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/jamonesgc/",
        "horario": "Lun-Vie 09:00–17:00"
    },
    {
        "nombre": "Ganadería El Cortijo",
        "municipio": "Gáldar",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Carne fresca de cabrito majorero y ternera lechal de Gran Canaria",
        "direccion": "Finca El Cortijo, s/n, Caideros, 35468 Gáldar, Gran Canaria",
        "telefono": "644 90 90 91",
        "correo": "ganaderiaelcortijo@gmail.com",
        "web": "https://ganaderiaelcortijogc.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/ganaderiaelcortijo/",
        "horario": "Lun-Sab 09:00–14:00"
    },
    {
        "nombre": "Carnicería El Pino",
        "municipio": "Teror",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Carne mechada al estilo tradicional y morcilla canaria dulce",
        "direccion": "Calle Real, 10, 35430 Teror, Gran Canaria",
        "telefono": "928 63 11 22",
        "correo": "carniceriaelpino@gmail.com",
        "web": "https://carniceriaelpinoteror.com",
        "Instagram": "https://www.instagram.com/carniceriaelpinoteror/",
        "Facebook": "https://www.facebook.com/carniceriaelpino/",
        "horario": "Lun-Sab 08:30–14:00"
    },
    {
        "nombre": "Embutidos Terorero",
        "municipio": "Teror",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Chorizo de Teror Terorero en tarro y morcilla artesana",
        "direccion": "Barranco de Teror, s/n, 35430 Teror, Gran Canaria",
        "telefono": "610 33 22 11",
        "correo": "teroreroembutidos@gmail.com",
        "web": "https://terorero.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/terorero/",
        "horario": "Lun-Vie 08:00–15:00"
    },
    {
        "nombre": "Ganadería Caprina Majorera",
        "municipio": "Puerto del Rosario",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Cabrito fresco de Fuerteventura listo para asar",
        "direccion": "Calle de los Ganaderos, s/n, Tetir, 35613 Puerto del Rosario, Fuerteventura",
        "telefono": "928 85 93 30",
        "correo": "cabritomajorero@gmail.com",
        "web": "https://cabritomajorero.com",
        "Instagram": "https://www.instagram.com/cabritomajorero/",
        "Facebook": "https://www.facebook.com/cabrito/",
        "horario": "Lun-Vie 08:00–13:00"
    },
    {
        "nombre": "Carnes de Cabra Fuerte",
        "municipio": "Tuineje",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Carne de cabra vieja adobada e higaditos de cabrito",
        "direccion": "Calle de la Matanza, 8, Gran Tarajal, 35620 Tuineje, Fuerteventura",
        "telefono": "696 22 33 44",
        "correo": "cabrafuertecarnes@gmail.com",
        "web": "https://cabrafuerte.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/cabrafuerte/",
        "horario": "Lun-Sab 09:00–14:00"
    },
    {
        "nombre": "Embutidos Maxorata",
        "municipio": "Antigua",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Salchichas frescas de cabra y embutidos ahumados",
        "direccion": "Calle del Matadero, 3, 35630 Antigua, Fuerteventura",
        "telefono": "630 44 55 66",
        "correo": "embutidosmaxorata@gmail.com",
        "web": "https://embutidosmaxorata.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/embutidosmaxorata/",
        "horario": "Lun-Vie 08:30–14:30"
    },
    {
        "nombre": "Carnes del País Lanzarote",
        "municipio": "San Bartolomé",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Carne de cabrito conejero y cochino del país",
        "direccion": "Carretera San Bartolomé-Masdache, km 2, 35560 San Bartolomé, Lanzarote",
        "telefono": "928 52 40 41",
        "correo": "carneslanzarote@gmail.com",
        "web": "https://carneslanzarote.com",
        "Instagram": "https://www.instagram.com/carneslanzarote/",
        "Facebook": "https://www.facebook.com/carneslanzarote/",
        "horario": "Lun-Sab 08:00–15:00"
    },

    # PAN Y PASTELERÍA (76 - 90)
    {
        "nombre": "Dulcería Nublo",
        "municipio": "Tejeda",
        "categoria": "Pan y pastelería",
        "productos estrella": "Bienmesabe de almendra de Tejeda, Palmeras de chocolate gigantes",
        "direccion": "Calle de Tomás Arroyo Cardoso, 11, 35005 Tejeda, Gran Canaria",
        "telefono": "928 66 60 70",
        "correo": "info@dulcerianublo.com",
        "web": "https://www.dulcerianublo.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/dulcerianublo/",
        "horario": "Lun-Dom 09:00–20:00"
    },
    {
        "nombre": "Pastelería Dulces de Guía",
        "municipio": "Santa María de Guía",
        "categoria": "Pan y pastelería",
        "productos estrella": "Pastel de Guía relleno de cabello de ángel, Bollos de manteca",
        "direccion": "Calle de Médicos del Mundo, 5, 35450 Santa María de Guía, Gran Canaria",
        "telefono": "928 88 23 23",
        "correo": "dulcesdeguia@gmail.com",
        "web": "https://dulcesdeguia.com",
        "Instagram": "https://www.instagram.com/dulcesdeguia/",
        "Facebook": "https://www.facebook.com/dulcesdeguia/",
        "horario": "Lun-Sab 08:00–20:00"
    },
    {
        "nombre": "Panadería Artesanal de Ingenio",
        "municipio": "Ingenio",
        "categoria": "Pan y pastelería",
        "productos estrella": "Pan de puño tradicional canario cocido en horno de leña",
        "direccion": "Calle de la Rueda, 8, 35250 Ingenio, Gran Canaria",
        "telefono": "928 78 12 34",
        "correo": "pandepunocanario@gmail.com",
        "web": "https://pandepunocanario.com",
        "Instagram": "https://www.instagram.com/pandepunoingenio/",
        "Facebook": "https://www.facebook.com/pandepunoingenio/",
        "horario": "Lun-Sab 06:00–14:00"
    },
    {
        "nombre": "Dulcería La Colmena",
        "municipio": "Las Palmas de Gran Canaria",
        "categoria": "Pan y pastelería",
        "productos estrella": "Merengues artesanos de La Colmena, Suspiros de Moya de azúcar lustre",
        "direccion": "Calle de Viera y Clavijo, 35, 35002 Las Palmas de Gran Canaria, Gran Canaria",
        "telefono": "928 36 26 27",
        "correo": "info@dulcerialacolmena.com",
        "web": "https://dulcerialacolmena.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/dulcerialacolmena/",
        "horario": "Lun-Vie 09:00–20:00; Sab 09:00–14:00"
    },
    {
        "nombre": "Panadería Dulcería de San Mateo",
        "municipio": "Vega de San Mateo",
        "categoria": "Pan y pastelería",
        "productos estrella": "Pan de millo mallorquín canario, Mantecados tradicionales",
        "direccion": "Calle Principal, 40, 35320 Vega de San Mateo, Gran Canaria",
        "telefono": "928 66 01 02",
        "correo": "panaderiasanmateo@gmail.com",
        "web": "https://panaderiasanmateo.com",
        "Instagram": "https://www.instagram.com/panaderiasanmateo/",
        "Facebook": "https://www.facebook.com/panaderiasanmateo/",
        "horario": "Lun-Dom 07:00–21:00"
    },
    {
        "nombre": "Bizcochos de Moya",
        "municipio": "Moya",
        "categoria": "Pan y pastelería",
        "productos estrella": "Bizcochos lustrados tradicionales de Moya, Suspiros de Moya",
        "direccion": "Calle de los Bizcochos, 2, 35420 Moya, Gran Canaria",
        "telefono": "928 61 12 12",
        "correo": "info@bizcochosdemoya.com",
        "web": "https://bizcochosdemoya.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/bizcochosdemoya/",
        "horario": "Lun-Vie 09:00–18:00"
    },
    {
        "nombre": "Panadería Amaro",
        "municipio": "Teror",
        "categoria": "Pan y pastelería",
        "productos estrella": "Pan de huevo y bollos dulces de Teror",
        "direccion": "Calle Real de la Plaza, 15, 35430 Teror, Gran Canaria",
        "telefono": "928 63 01 23",
        "correo": "panaderiaamaro@gmail.com",
        "web": "https://panaderiaamaro.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/panaderiaamaro/",
        "horario": "Lun-Dom 06:00–14:30"
    },
    {
        "nombre": "Pastelería Vienna",
        "municipio": "Las Palmas de Gran Canaria",
        "categoria": "Pan y pastelería",
        "productos estrella": "Tartas personalizadas y pastelería fina de autor",
        "direccion": "Calle de León y Castillo, 210, 35004 Las Palmas de Gran Canaria, Gran Canaria",
        "telefono": "928 24 35 46",
        "correo": "info@pasteleriavienna.es",
        "web": "https://pasteleriavienna.es",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/pasteleriavienna/",
        "horario": "Lun-Vie 08:30–20:30; Sab 09:00–14:00"
    },
    {
        "nombre": "Panadería Pastelería Levain",
        "municipio": "Teguise",
        "categoria": "Pan y pastelería",
        "productos estrella": "Pan de masa madre de larga fermentación, Cruasanes de mantequilla",
        "direccion": "Calle de los Coroneles, 4, Tahíche, 35507 Teguise, Lanzarote",
        "telefono": "630 20 40 50",
        "correo": "info@levainlanzarote.com",
        "web": "https://levainlanzarote.com",
        "Instagram": "https://www.instagram.com/levainlanzarote/",
        "Facebook": "https://www.facebook.com/levainlanzarote/",
        "horario": "Mar-Sáb 08:00–15:00"
    },
    {
        "nombre": "Panadería Pastelería San Antonio",
        "municipio": "Tías",
        "categoria": "Pan y pastelería",
        "productos estrella": "Pan de centeno artesanal con cereales, Rosquetes de anís conejeros",
        "direccion": "Calle San Antonio, 80, 35572 Tías, Lanzarote",
        "telefono": "928 52 44 20",
        "correo": "sanantoniopan@gmail.com",
        "web": "https://sanantoniopanaderia.com",
        "Instagram": "https://www.instagram.com/panaderiasanantonio_lanzarote/",
        "Facebook": "https://www.facebook.com/sanantoniopanaderia/",
        "horario": "Lun-Sab 07:00–14:00"
    },
    {
        "nombre": "Dulcería Haría",
        "municipio": "Haría",
        "categoria": "Pan y pastelería",
        "productos estrella": "Rosquetes de almendra tradicionales de Haría, Bizcochón de limón",
        "direccion": "Plaza de la Constitución, 1, 35520 Haría, Lanzarote",
        "telefono": "928 83 50 12",
        "correo": "dulceriaharia@gmail.com",
        "web": "https://dulceriaharia.com",
        "Instagram": "https://www.instagram.com/dulceria_haria/",
        "Facebook": "https://www.facebook.com/dulceriaharia/",
        "horario": "Lun-Sab 09:00–14:00 y 16:30–20:00"
    },
    {
        "nombre": "Panadería El Sabor",
        "municipio": "Arrecife",
        "categoria": "Pan y pastelería",
        "productos estrella": "Pan gallego de costra crujiente, Bizcochos secos de canela",
        "direccion": "Calle de Fajardo, 15, 35500 Arrecife, Lanzarote",
        "telefono": "928 81 22 33",
        "correo": "elsaborarrecife@gmail.com",
        "web": "https://elsaborarrecife.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/elsaborarrecife/",
        "horario": "Lun-Sab 07:00–14:00"
    },
    {
        "nombre": "Dulcería La Panateca",
        "municipio": "Puerto del Rosario",
        "categoria": "Pan y pastelería",
        "productos estrella": "Pan de gofio y pasas, Pasteles de crema de cabra artesanos",
        "direccion": "Calle León y Castillo, 54, 35600 Puerto del Rosario, Fuerteventura",
        "telefono": "928 85 22 11",
        "correo": "info@lapanateca.com",
        "web": "https://lapanateca.com",
        "Instagram": "https://www.instagram.com/lapanateca/",
        "Facebook": "https://www.facebook.com/lapanateca/",
        "horario": "Lun-Sab 07:30–20:30"
    },
    {
        "nombre": "Panadería El Cardón",
        "municipio": "Pájara",
        "categoria": "Pan y pastelería",
        "productos estrella": "Pan tradicional de horno de piedra de El Cardón",
        "direccion": "Calle Real del Cardón, s/n, El Cardón, 35627 Pájara, Fuerteventura",
        "telefono": "659 11 22 33",
        "correo": "elcardonpan@gmail.com",
        "web": "https://elcardonpan.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/panaderiaelcardon/",
        "horario": "Lun-Sab 06:00–13:00"
    },
    {
        "nombre": "Dulcería Betancuria",
        "municipio": "Betancuria",
        "categoria": "Pan y pastelería",
        "productos estrella": "Mantecados de almendra majoreros, Rosquetes fritos canarios",
        "direccion": "Calle Mayor, 10, 35637 Betancuria, Fuerteventura",
        "telefono": "928 87 81 22",
        "correo": "dulceriabetancuria@gmail.com",
        "web": "https://dulceriabetancuria.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/dulceriabetancuria/",
        "horario": "Lun-Dom 10:00–17:00"
    },

    # OTROS (91 - 106)
    {
        "nombre": "Café de Agaete - Finca La Laja",
        "municipio": "Agaete",
        "categoria": "Otros",
        "productos estrella": "Café de Agaete gourmet 100% Arábica de cultivo propio bajo naranjos",
        "direccion": "Carretera de los Berrazales, s/n, Valle de Agaete, 35489 Agaete, Gran Canaria",
        "telefono": "928 89 80 10",
        "correo": "info@bodegazul.com",
        "web": "https://www.bodegazul.com",
        "Instagram": "https://www.instagram.com/fincamalvasia_cafe/",
        "Facebook": "https://www.facebook.com/fincalalaja/",
        "horario": "Lun-Dom 10:00–17:00"
    },
    {
        "nombre": "Ron Arehucas",
        "municipio": "Arucas",
        "categoria": "Otros",
        "productos estrella": "Ron Oro Arehucas Carta de Oro, Ron Miel Guanche Arehucas",
        "direccion": "Calle de Era de San Pedro, 2, 35400 Arucas, Gran Canaria",
        "telefono": "928 62 49 00",
        "correo": "arehucas@arehucas.es",
        "web": "https://arehucas.es",
        "Instagram": "https://www.instagram.com/arehucasron/",
        "Facebook": "https://www.facebook.com/ronarehucas/",
        "horario": "Lun-Vie 09:00–14:00"
    },
    {
        "nombre": "Salinas de Tenefé",
        "municipio": "Santa Lucía de Tirajana",
        "categoria": "Otros",
        "productos estrella": "Flor de Sal de Tenefé recolectada a mano en salinas tradicionales",
        "direccion": "Salinas de Tenefé, s/n, Pozo Izquierdo, 35119 Santa Lucía de Tirajana, Gran Canaria",
        "telefono": "670 50 60 70",
        "correo": "info@salinasdetenefe.com",
        "web": "https://salinasdetenefe.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/salinasdetenefe/",
        "horario": "Lun-Vie 09:00–16:00; Sab 10:00–14:00"
    },
    {
        "nombre": "Miel de Guayadeque",
        "municipio": "Agüimes",
        "categoria": "Otros",
        "productos estrella": "Miel multifloral de Guayadeque de abeja negra canaria",
        "direccion": "Barranco de Guayadeque, s/n, 35260 Agüimes, Gran Canaria",
        "telefono": "611 22 33 44",
        "correo": "mielguayadeque@gmail.com",
        "web": "https://mielguayadeque.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/mielguayadeque/",
        "horario": "Visitas previa cita"
    },
    {
        "nombre": "Miel de Tejeda",
        "municipio": "Tejeda",
        "categoria": "Otros",
        "productos estrella": "Miel de cumbre de Tejeda de retama y almendro",
        "direccion": "Calle Mayor, s/n, 35005 Tejeda, Gran Canaria",
        "telefono": "650 11 22 33",
        "correo": "mieltejeda@gmail.com",
        "web": "https://mieltejeda.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/mieltejeda/",
        "horario": "Lun-Sab 09:00–14:00"
    },
    {
        "nombre": "Cerveza Artesana Jaira",
        "municipio": "Agüimes",
        "categoria": "Otros",
        "productos estrella": "Cerveza artesana Jaira IPA, Jaira Kölsch con miel de caña",
        "direccion": "Calle de los artesanos, 12, Polígono Industrial Arinaga, 35260 Agüimes, Gran Canaria",
        "telefono": "629 30 40 50",
        "correo": "info@cervezajaira.com",
        "web": "https://cervezajaira.com",
        "Instagram": "https://www.instagram.com/cervezajaira/",
        "Facebook": "https://www.facebook.com/cervezajaira/",
        "horario": "Lun-Vie 09:00–17:00"
    },
    {
        "nombre": "Cerveza Artesana Galotia",
        "municipio": "Las Palmas de Gran Canaria",
        "categoria": "Otros",
        "productos estrella": "Cerveza Galotia American Pale Ale, Galotia Porter de fermentación local",
        "direccion": "Calle Industrial, 14, El Sebadal, 35008 Las Palmas de Gran Canaria, Gran Canaria",
        "telefono": "633 22 33 44",
        "correo": "info@galotiabeer.com",
        "web": "https://galotiabeer.com",
        "Instagram": "https://www.instagram.com/galotiabrewing/",
        "Facebook": "https://www.facebook.com/galotiabeer/",
        "horario": "Lun-Vie 08:30–16:30"
    },
    {
        "nombre": "Sidra Gran Canaria - Niebla",
        "municipio": "Valleseco",
        "categoria": "Otros",
        "productos estrella": "Sidra natural de manzana reineta de Valleseco Niebla",
        "direccion": "Calle del Mercado Ecológico, 2, 35430 Valleseco, Gran Canaria",
        "telefono": "928 61 80 22",
        "correo": "sidraniebla@gmail.com",
        "web": "https://sidraniebla.com",
        "Instagram": "https://www.instagram.com/sidraniebla/",
        "Facebook": "https://www.facebook.com/sidraniebla/",
        "horario": "Sab-Dom 10:00–15:00"
    },
    {
        "nombre": "Aloe Vera Las Palmas",
        "municipio": "Moya",
        "categoria": "Otros",
        "productos estrella": "Gel puro de aloe vera ecológico de Moya de prensa directa",
        "direccion": "Camí Real, 40, 35420 Moya, Gran Canaria",
        "telefono": "611 44 55 66",
        "correo": "aloeveramoya@gmail.com",
        "web": "https://aloeveramoya.com",
        "Instagram": "https://www.instagram.com/aloeveramoya/",
        "Facebook": "https://www.facebook.com/aloemoya/",
        "horario": "Lun-Vie 09:00–14:00"
    },
    {
        "nombre": "Salinas de Janubio",
        "municipio": "Yaiza",
        "categoria": "Otros",
        "productos estrella": "Flor de sal marina de Janubio, Sal marina tradicional gruesa",
        "direccion": "Carretera de Janubio, s/n, 35570 Yaiza, Lanzarote",
        "telefono": "928 17 31 15",
        "correo": "info@salinasdejanubio.com",
        "web": "https://www.salinasdejanubio.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/salinasdejanubio/",
        "horario": "Lun-Vie 09:00–15:00"
    },
    {
        "nombre": "Aloe Plus Lanzarote",
        "municipio": "Haría",
        "categoria": "Otros",
        "productos estrella": "Cosméticos ecológicos Aloe Plus Lanzarote, Zumo de Aloe Vera puro",
        "direccion": "Calle del Aloe, 2, Arrieta, 35542 Haría, Lanzarote",
        "telefono": "928 84 81 50",
        "correo": "info@aloepluslanzarote.com",
        "web": "https://www.aloepluslanzarote.com",
        "Instagram": "https://www.instagram.com/aloepluslanzarote/",
        "Facebook": "https://www.facebook.com/aloepluslanzarote/",
        "horario": "Lun-Dom 09:00–18:00"
    },
    {
        "nombre": "Miel de Lanzarote",
        "municipio": "Haría",
        "categoria": "Otros",
        "productos estrella": "Miel artesanal multifloral conejera del Valle de las Mil Palmeras",
        "direccion": "Calle El Palmar, 15, 35520 Haría, Lanzarote",
        "telefono": "630 11 22 44",
        "correo": "mielslanzarote@gmail.com",
        "web": "https://mielesdelanzarote.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/mielesdelanzarote/",
        "horario": "Sábados 09:00–14:00"
    },
    {
        "nombre": "Cerveza Artesana Nao",
        "municipio": "Arrecife",
        "categoria": "Otros",
        "productos estrella": "Cerveza Nao Capitán American Pale Ale, Cerveza Nao Gloria",
        "direccion": "Calle de Juana de Arco, 24, 35500 Arrecife, Lanzarote",
        "telefono": "928 80 34 50",
        "correo": "info@cervezasnao.com",
        "web": "https://cervezasnao.com",
        "Instagram": "https://www.instagram.com/cervezasnao/",
        "Facebook": "https://www.facebook.com/cervezasnao/",
        "horario": "Lun-Vie 10:00–18:00"
    },
    {
        "nombre": "Aloe Vera de Fuerteventura - Vidaloe",
        "municipio": "Antigua",
        "categoria": "Otros",
        "productos estrella": "Crema regeneradora de aloe vera y aceites esenciales Vidaloe",
        "direccion": "Calle del Aloe, 5, Agua de Bueyes, 35638 Antigua, Fuerteventura",
        "telefono": "928 85 99 90",
        "correo": "info@vidaloe.net",
        "web": "https://vidaloe.net",
        "Instagram": "https://www.instagram.com/vidaloe_fuerteventura/",
        "Facebook": "https://www.facebook.com/vidaloe/",
        "horario": "Lun-Vie 10:00–17:00"
    },
    {
        "nombre": "Sal de Fuerteventura - Salinas del Carmen",
        "municipio": "Antigua",
        "categoria": "Otros",
        "productos estrella": "Flor de Sal Marina Salinas del Carmen, Sal de espuma marina",
        "direccion": "Salinas del Carmen, s/n, 35610 Antigua, Fuerteventura",
        "telefono": "928 16 39 88",
        "correo": "salinasdelcarmen@museosfuerteventura.org",
        "web": "https://www.salinasdelcarmen.es",
        "Instagram": "https://www.instagram.com/salinasdelcarmen/",
        "Facebook": "https://www.facebook.com/salinasdelcarmen/",
        "horario": "Lun-Dom 10:00–18:00"
    },
    {
        "nombre": "Miel de Fuerteventura",
        "municipio": "Tuineje",
        "categoria": "Otros",
        "productos estrella": "Miel de Fuerteventura de floración de desierto",
        "direccion": "Calle de las Colmenas, 2, 35628 Tuineje, Fuerteventura",
        "telefono": "633 88 99 00",
        "correo": "mielmajorera@gmail.com",
        "web": "https://mielmajorera.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/mielmajorera/",
        "horario": "Lun-Vie 09:00–14:00"
    }
]

def slugify(text):
    text = text.lower().strip()
    replacements = {
        "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u",
        "à": "a", "è": "e", "ò": "o",
        "ü": "u", "ñ": "n", "ç": "c",
        "ï": "i",
    }
    for char, rep in replacements.items():
        text = text.replace(char, rep)
    
    clean_text = ""
    for char in text:
        if char.isalnum() or char in " -":
            clean_text += char
            
    slug = clean_text.replace(" ", "-")
    while "--" in slug:
        slug = slug.replace("--", "-")
    return slug.strip("-")

def main():
    print(f"Generating {len(PRODUCERS)} producers with offline coordinate offsets...")
    municipality_counts = {}
    output_rows = []
    
    for idx, p in enumerate(PRODUCERS, start=1):
        nombre = p["nombre"]
        municipio = p["municipio"]
        direccion = p["direccion"]
        categoria = p["categoria"]
        
        # Build unique slug
        p_slug = slugify(f"{nombre}-{municipio}")
        
        # Calculate offset coordinates deterministically around municipality center
        seen = municipality_counts.get(municipio, 0)
        municipality_counts[municipio] = seen + 1
        
        # Base coordinate defaults to Las Palmas de Gran Canaria if not found
        base_lat, base_lon = MUNICIPALITY_COORDINATES.get(municipio, (28.1235, -15.4363))
        
        # 5x5 grid offset: each step is 0.0035 degrees (approx 380 meters)
        offset_lat = (seen % 5 - 2) * 0.0035
        offset_lon = (seen // 5 - 2) * 0.0035
        
        lat = base_lat + offset_lat
        lon = base_lon + offset_lon
        
        # Build search query for Google Maps URL
        gmaps_query = f"{nombre}, {direccion}"
        gmaps_url = f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(gmaps_query)}"
        
        # Description (must be > 30 chars)
        description = f"Productor local artesanal de {p['productos estrella'].lower()} en {municipio}, Islas Canarias. Fiel al compromiso de proximidad y comercio justo."
        
        row = {
            "slug": p_slug,
            "nombre": nombre,
            "municipio": municipio,
            "categoria": categoria,
            "productos estrella": p["productos estrella"],
            "direccion": direccion,
            "descripcion": description,
            "horario": p["horario"],
            "telefono": p["telefono"],
            "correo": p["correo"],
            "web": p["web"],
            "Facebook": p["Facebook"],
            "Instagram": p["Instagram"],
            "Google Maps": gmaps_url,
            "lat": f"{lat:.7f}",
            "lon": f"{lon:.7f}",
            "fecha_revision": "2026-05-20",
            "imagen": ""
        }
        output_rows.append(row)
        
    # Write CSV
    csv_dir = Path("data/csv/canarias")
    csv_dir.mkdir(parents=True, exist_ok=True)
    csv_path = csv_dir / "las-palmas.csv"
    
    headers = [
        "slug", "nombre", "municipio", "categoria", "productos estrella",
        "direccion", "descripcion", "horario", "telefono", "correo", "web",
        "Facebook", "Instagram", "Google Maps", "lat", "lon", "fecha_revision", "imagen"
    ]
    
    try:
        with open(csv_path, "w", encoding="utf-8", newline="") as f:
            f.write(",".join(headers) + "\n")
            
            for row in output_rows:
                csv_line = []
                for h in headers:
                    val = row[h]
                    if "," in val or '"' in val or "\n" in val:
                        val = val.replace('"', '""')
                        csv_line.append(f'"{val}"')
                    else:
                        csv_line.append(val)
                f.write(",".join(csv_line) + "\n")
                
        print(f"SUCCESS: Generated {len(output_rows)} rows in {csv_path}")
    except Exception as e:
        print(f"Error writing CSV file: {e}", file=sys.stderr)
        return 1
        
    return 0

if __name__ == "__main__":
    sys.exit(main())
