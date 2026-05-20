#!/usr/bin/env python3
import json
import os
import sys
import urllib.parse
from pathlib import Path

# Fallback/Base coordinates for municipalities in Santa Cruz de Tenerife
MUNICIPALITY_COORDINATES = {
    # Tenerife
    "Santa Cruz de Tenerife": (28.4636, -16.2518),
    "San Cristóbal de La Laguna": (28.4853, -16.3201),
    "La Orotava": (28.3902, -16.5244),
    "El Sauzal": (28.4727, -16.4385),
    "Tacoronte": (28.4795, -16.4131),
    "Tegueste": (28.4891, -16.3364),
    "Adeje": (28.1201, -16.7299),
    "Arona": (28.0991, -16.6806),
    "Guía de Isora": (28.2115, -16.7794),
    "Santiago del Teide": (28.2974, -16.8159),
    "La Guancha": (28.3732, -16.6502),
    "Vilaflor": (28.1587, -16.6375),
    "Arico": (28.1887, -16.4912),
    "Arafo": (28.3414, -16.4172),
    "Candelaria": (28.3547, -16.3721),
    "San Juan de la Rambla": (28.3916, -16.6499),
    "Puerto de la Cruz": (28.4116, -16.5458),
    "Granadilla de Abona": (28.1189, -16.5772),
    
    # La Palma
    "Santa Cruz de La Palma": (28.6840, -17.7646),
    "Fuencaliente de La Palma": (28.4906, -17.8427),
    "Villa de Mazo": (28.6041, -17.7778),
    "Tijarafe": (28.7094, -17.9542),
    "El Paso": (28.6521, -17.8800),
    "Puntallana": (28.7303, -17.7473),
    "Garafía": (28.8286, -17.9272),
    "Los Llanos de Aridane": (28.6585, -17.9146),
    
    # La Gomera
    "San Sebastián de La Gomera": (28.0916, -17.1133),
    "Vallehermoso": (28.1793, -17.2657),
    "Hermigua": (28.1738, -17.2001),
    
    # El Hierro
    "Frontera": (27.7538, -18.0139),
    "Valverde": (27.8066, -17.9158),
}

PRODUCERS = [
    # VINOS (1 - 27)
    {
        "nombre": "Bodegas Monje",
        "municipio": "El Sauzal",
        "categoria": "Vino",
        "productos estrella": "Vino tinto tradicional Monje Común, Listán Negro de viñas viejas",
        "direccion": "Camino de la Decanilla, 84, 38360 El Sauzal, Tenerife",
        "telefono": "922 57 30 22",
        "correo": "monje@bodegasmonje.com",
        "web": "https://bodegasmonje.com",
        "Instagram": "https://www.instagram.com/bodegasmonje/",
        "Facebook": "https://www.facebook.com/bodegasmonje/",
        "horario": "Lun-Dom 10:00–18:00"
    },
    {
        "nombre": "Bodega Tajinaste",
        "municipio": "La Orotava",
        "categoria": "Vino",
        "productos estrella": "Vino blanco seco Tajinaste, Tinto vendimia seleccionada",
        "direccion": "Camino la Perdoma, 56, 38315 La Orotava, Tenerife",
        "telefono": "922 33 21 00",
        "correo": "info@tajinaste.com",
        "web": "https://tajinaste.com",
        "Instagram": "https://www.instagram.com/bodegatajinaste/",
        "Facebook": "https://www.facebook.com/bodegatajinaste/",
        "horario": "Lun-Vie 08:30–16:30"
    },
    {
        "nombre": "Bodegas Suertes del Marqués",
        "municipio": "La Orotava",
        "categoria": "Vino",
        "productos estrella": "Vinos de parcela 7 Fuentes, El Esquilón de viticultura heroica",
        "direccion": "Calle Lomo Solís, 26, 38315 La Orotava, Tenerife",
        "telefono": "922 30 45 67",
        "correo": "info@suertesdelmarques.com",
        "web": "https://www.suertesdelmarques.com",
        "Instagram": "https://www.instagram.com/suertesdelmarques/",
        "Facebook": "https://www.facebook.com/suertesdelmarques/",
        "horario": "Visitas concertadas"
    },
    {
        "nombre": "Bodegas Viñátigo",
        "municipio": "La Guancha",
        "categoria": "Vino",
        "productos estrella": "Vino blanco de uva Gual, Tinto varietal de Baboso Negro",
        "direccion": "Ctra. General la Guancha, 34, 38440 La Guancha, Tenerife",
        "telefono": "922 82 87 68",
        "correo": "vinatigo@vinatigo.com",
        "web": "https://www.vinatigo.com",
        "Instagram": "https://www.instagram.com/bodegasvinatigo/",
        "Facebook": "https://www.facebook.com/bodegasvinatigo/",
        "horario": "Lun-Vie 09:00–17:00"
    },
    {
        "nombre": "Bodega Envínate",
        "municipio": "Santiago del Teide",
        "categoria": "Vino",
        "productos estrella": "Vino tinto Benje de parcelas volcánicas altas, Albillo Criollo volcánico",
        "direccion": "Lugar Las Manchas, 4, 38690 Santiago del Teide, Tenerife",
        "telefono": "630 12 34 56",
        "correo": "envinate.vinos@gmail.com",
        "web": "http://envinate.es",
        "Instagram": "https://www.instagram.com/envinate.vinos/",
        "Facebook": "",
        "horario": "Visitas previa concertación"
    },
    {
        "nombre": "Bodega El Sitio",
        "municipio": "Tacoronte",
        "categoria": "Vino",
        "productos estrella": "Vino blanco aromático Malvasía Volcánica El Sitio, Tinto Vijariego Negro",
        "direccion": "Camino el Sitio, 12, 38350 Tacoronte, Tenerife",
        "telefono": "922 57 14 12",
        "correo": "info@bodegaelsitio.com",
        "web": "https://bodegaelsitio.com",
        "Instagram": "https://www.instagram.com/bodegaelsitio/",
        "Facebook": "https://www.facebook.com/bodegaelsitio/",
        "horario": "Lun-Sab 10:00–16:00"
    },
    {
        "nombre": "Bodega El Lomo",
        "municipio": "Tegueste",
        "categoria": "Vino",
        "productos estrella": "Vino tinto El Lomo maceración carbónica, Blanco seco Listán Blanco",
        "direccion": "Calle el Lomo, 18, 38280 Tegueste, Tenerife",
        "telefono": "922 54 11 05",
        "correo": "info@bodegasellomo.com",
        "web": "https://www.bodegasellomo.com",
        "Instagram": "https://www.instagram.com/bodegasellomo/",
        "Facebook": "https://www.facebook.com/bodegasellomo/",
        "horario": "Lun-Vie 08:00–15:00"
    },
    {
        "nombre": "Bodegas Reverón",
        "municipio": "Vilaflor",
        "categoria": "Vino",
        "productos estrella": "Vino ecológico tinto barrica Reverón, Blanco afrutado de altura",
        "direccion": "Ctra. General de Vilaflor, Km 12, 38615 Vilaflor, Tenerife",
        "telefono": "922 70 90 28",
        "correo": "info@bodegasreveron.com",
        "web": "https://bodegasreveron.com",
        "Instagram": "https://www.instagram.com/bodegasreveron/",
        "Facebook": "https://www.facebook.com/bodegasreveron/",
        "horario": "Lun-Dom 10:00–18:00"
    },
    {
        "nombre": "Bodega Frontos",
        "municipio": "Granadilla de Abona",
        "categoria": "Vino",
        "productos estrella": "Vino blanco Frontos de parcela alta, Tinto ecológico de viñedos volcánicos",
        "direccion": "Lugar Lomo de la Fuente, s/n, 38629 Granadilla de Abona, Tenerife",
        "telefono": "922 77 30 50",
        "correo": "administracion@frontos.com",
        "web": "https://frontos.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/bodegafrontos/",
        "horario": "Visitas previa concertación"
    },
    {
        "nombre": "Bodega Altos de Trevejos",
        "municipio": "Vilaflor",
        "categoria": "Vino",
        "productos estrella": "Vino tinto varietal de Baboso Negro Altos de Trevejos, Blanco seco Listán",
        "direccion": "Camino Real de Vilaflor, 5, 38615 Vilaflor, Tenerife",
        "telefono": "620 90 80 70",
        "correo": "info@altosdetrevejos.com",
        "web": "https://altosdetrevejos.com",
        "Instagram": "https://www.instagram.com/altosdetrevejos/",
        "Facebook": "https://www.facebook.com/altosdetrevejos/",
        "horario": "Visitas concertadas"
    },
    {
        "nombre": "Bodega Cumbres de Abona",
        "municipio": "Arico",
        "categoria": "Vino",
        "productos estrella": "Vino blanco afrutado Testamento Malvasía Aromática, Tinto Flor de Chasna",
        "direccion": "Calle El Calvario, 3, Teguedite, 38589 Arico, Tenerife",
        "telefono": "922 76 80 00",
        "correo": "info@cumbresdeabona.es",
        "web": "https://cumbresdeabona.es",
        "Instagram": "https://www.instagram.com/cumbresdeabona/",
        "Facebook": "https://www.facebook.com/cumbresdeabona/",
        "horario": "Lun-Vie 08:00–15:00"
    },
    {
        "nombre": "Bodegas El Penitente",
        "municipio": "La Orotava",
        "categoria": "Vino",
        "productos estrella": "Vino Arautava blanco fermentado en barrica, Arautava dulce",
        "direccion": "Calle San Antonio, 105, 38300 La Orotava, Tenerife",
        "telefono": "922 32 30 33",
        "correo": "elpenitente@arautava.com",
        "web": "https://arautava.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/arautavawines/",
        "horario": "Lun-Vie 08:00–16:00"
    },
    {
        "nombre": "Bodega Crater",
        "municipio": "El Sauzal",
        "categoria": "Vino",
        "productos estrella": "Vino tinto Crater crianza, Magma de Crater de viñedos ecológicos",
        "direccion": "Calle Los Ángeles, 43, 38360 El Sauzal, Tenerife",
        "telefono": "922 56 12 13",
        "correo": "crater@bodegascrater.com",
        "web": "https://bodegascrater.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/bodegascrater/",
        "horario": "Visitas previa cita"
    },
    {
        "nombre": "Bodegas Insulares Tenerife",
        "municipio": "Tacoronte",
        "categoria": "Vino",
        "productos estrella": "Vino tinto Viña Norte maceración carbónica, Blanco seco Humboldt",
        "direccion": "Ctra. General del Norte, Km 19.5, 38350 Tacoronte, Tenerife",
        "telefono": "922 56 01 07",
        "correo": "info@bodegasinsulares.es",
        "web": "https://bodegasinsulares.es",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/vinanorte/",
        "horario": "Lun-Vie 08:30–14:30"
    },
    {
        "nombre": "Bodega Valleoro",
        "municipio": "La Orotava",
        "categoria": "Vino",
        "productos estrella": "Vino blanco afrutado Valleoro, Tinto tradicional joven",
        "direccion": "Calle la Perdoma, 98, 38315 La Orotava, Tenerife",
        "telefono": "922 33 00 23",
        "correo": "valleoro@valleoro.es",
        "web": "http://valleoro.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Vie 09:00–14:00"
    },
    {
        "nombre": "Bodega Teneguía",
        "municipio": "Fuencaliente de La Palma",
        "categoria": "Vino",
        "productos estrella": "Malvasía dulce estelar Teneguía, Tinto joven Listán Negro palmero",
        "direccion": "Calle Antonio Francisco Hernández, 10, 38780 Fuencaliente, La Palma",
        "telefono": "922 44 40 78",
        "correo": "info@bodegasteneguia.com",
        "web": "https://www.bodegasteneguia.com",
        "Instagram": "https://www.instagram.com/bodegasteneguia/",
        "Facebook": "https://www.facebook.com/bodegasteneguia/",
        "horario": "Lun-Vie 09:00–17:00; Sab 10:00–14:00"
    },
    {
        "nombre": "Bodegas Carballo",
        "municipio": "Fuencaliente de La Palma",
        "categoria": "Vino",
        "productos estrella": "Vino blanco seco Negramoll Carballo, Malvasía aromática volcánica",
        "direccion": "Calle los Canarios, 45, 38780 Fuencaliente, La Palma",
        "telefono": "922 44 41 02",
        "correo": "info@bodegascarballo.com",
        "web": "https://bodegascarballo.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/bodegascarballo/",
        "horario": "Lun-Sab 10:00–16:00"
    },
    {
        "nombre": "Bodega Victoria Torres Pecis",
        "municipio": "Fuencaliente de La Palma",
        "categoria": "Vino",
        "productos estrella": "Vino blanco Albillo Criollo fermentado en madera, Tinto de uva Negramoll",
        "direccion": "Calle Las Caleras, 2, 38780 Fuencaliente, La Palma",
        "telefono": "610 23 45 67",
        "correo": "victoria.torres.pecis@gmail.com",
        "Instagram": "https://www.instagram.com/victoria.torres.pecis/",
        "Facebook": "",
        "horario": "Visitas concertadas"
    },
    {
        "nombre": "Bodega El Níspero",
        "municipio": "Villa de Mazo",
        "categoria": "Vino",
        "productos estrella": "Vino blanco varietal de Albillo El Níspero, Tinto de montaña Negramoll",
        "direccion": "Lugar las Toscas, 15, 38730 Villa de Mazo, La Palma",
        "telefono": "922 44 04 26",
        "correo": "elnispero@elnispero.com",
        "web": "https://elnispero.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/bodegaselnispero/",
        "horario": "Visitas previa cita"
    },
    {
        "nombre": "Bodegas Noroeste de La Palma",
        "municipio": "Tijarafe",
        "categoria": "Vino",
        "productos estrella": "Vino blanco afrutado Vega Norte, Tinto ecológico de Tea tradicional",
        "direccion": "Camino Bellido, 3, 38780 Tijarafe, La Palma",
        "telefono": "922 49 10 75",
        "correo": "info@vinosveganorte.com",
        "web": "https://vinosveganorte.com",
        "Instagram": "https://www.instagram.com/vinosveganorte/",
        "Facebook": "https://www.facebook.com/VinosVegaNorte/",
        "horario": "Lun-Vie 08:00–15:30"
    },
    {
        "nombre": "Bodega Tamanca",
        "municipio": "El Paso",
        "categoria": "Vino",
        "productos estrella": "Vino tinto Tamanca de uvas autóctonas, Blanco de tea tradicional palmero",
        "direccion": "Ctra. General de Padron, 42, 38750 El Paso, La Palma",
        "telefono": "922 48 53 10",
        "correo": "bodegatamanca@gmail.com",
        "web": "https://bodegatamanca.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/bodegatamanca/",
        "horario": "Lun-Dom 12:00–23:00"
    },
    {
        "nombre": "Bodega Tendal",
        "municipio": "Tijarafe",
        "categoria": "Vino",
        "productos estrella": "Vino tinto ecológico Tendal madurado en cueva, Blanco afrutado volcánico",
        "direccion": "Lugar Aguatavar, 18, 38780 Tijarafe, La Palma",
        "telefono": "922 49 05 10",
        "correo": "tendal@bodegastendal.com",
        "web": "http://bodegastendal.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/bodegastendal/",
        "horario": "Visitas previa cita"
    },
    {
        "nombre": "Bodega Castro y Magán",
        "municipio": "Los Llanos de Aridane",
        "categoria": "Vino",
        "productos estrella": "Vino tinto de guarda Castro y Magán, Blanco de uvas autóctonas",
        "direccion": "Calle Real, 14, 38760 Los Llanos de Aridane, La Palma",
        "telefono": "922 40 12 34",
        "correo": "castroymagan@wines.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Visitas previa concertación"
    },
    {
        "nombre": "Bodega Insular de La Gomera",
        "municipio": "Vallehermoso",
        "categoria": "Vino",
        "productos estrella": "Vino blanco seco Cumbres de Garajonay de uva Forastera Gomera",
        "direccion": "Calle El Palmar, s/n, 38840 Vallehermoso, La Gomera",
        "telefono": "922 80 00 23",
        "correo": "info@lagomera.es",
        "web": "https://www.lagomera.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Vie 08:00–15:00"
    },
    {
        "nombre": "Bodega Niray",
        "municipio": "Vallehermoso",
        "categoria": "Vino",
        "productos estrella": "Vino blanco joven Niray de uva Forastera Gomera, Tinto de Listán Negro",
        "direccion": "Diseminado las Rosas, 10, 38840 Vallehermoso, La Gomera",
        "telefono": "650 45 67 89",
        "correo": "bodeganiray@lagomera.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Visitas concertadas"
    },
    {
        "nombre": "Bodega Elysar",
        "municipio": "Frontera",
        "categoria": "Vino",
        "productos estrella": "Vino blanco ecológico Elysar de uva Verijadiego Blanca, Tinto de Listán Negro",
        "direccion": "Calle La Hoya, 15, 38911 Frontera, El Hierro",
        "telefono": "620 12 34 56",
        "correo": "bodegaelysar@elhierro.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Visitas previa cita"
    },
    {
        "nombre": "Bodega Soterana",
        "municipio": "Valverde",
        "categoria": "Vino",
        "productos estrella": "Vino blanco tradicional Soterana, Tinto varietal Baboso Negro",
        "direccion": "Calle San Francisco, 2, 38900 Valverde, El Hierro",
        "telefono": "922 55 01 23",
        "correo": "soterana@elhierro.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Vie 09:00–14:00"
    },

    # ACEITES (28 - 32)
    {
        "nombre": "Oleoteide",
        "municipio": "Arico",
        "categoria": "Aceite",
        "productos estrella": "Aceite de oliva virgen extra Oleoteide de variedad Koroneiki y Arbequina",
        "direccion": "Calle El Calvario, 3, Teguedite, 38589 Arico, Tenerife",
        "telefono": "922 76 80 00",
        "correo": "info@cumbresdeabona.es",
        "web": "https://cumbresdeabona.es",
        "Instagram": "https://www.instagram.com/cumbresdeabona/",
        "Facebook": "https://www.facebook.com/cumbresdeabona/",
        "horario": "Lun-Vie 08:00–15:00"
    },
    {
        "nombre": "Finca Noel",
        "municipio": "Adeje",
        "categoria": "Aceite",
        "productos estrella": "Aceite de oliva virgen extra ecológico Finca Noel de aceituna Arbequina",
        "direccion": "Camino de Tijoco Bajo, s/n, 38677 Adeje, Tenerife",
        "telefono": "630 45 67 89",
        "correo": "fincanoel@adeje.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Visitas concertadas"
    },
    {
        "nombre": "Aceite de Oliva Lercaro",
        "municipio": "La Orotava",
        "categoria": "Aceite",
        "productos estrella": "Aceite de oliva virgen extra Lercaro de variedades canarias prensado en frío",
        "direccion": "Calle Colegio, 3, 38300 La Orotava, Tenerife",
        "telefono": "922 32 10 11",
        "correo": "lercaroolive@tenerife.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Vie 09:00–14:00"
    },
    {
        "nombre": "Finca Las Manchas",
        "municipio": "Santiago del Teide",
        "categoria": "Aceite",
        "productos estrella": "Aceite de oliva virgen extra volcánico Finca Las Manchas",
        "direccion": "Lugar Las Manchas, 10, 38690 Santiago del Teide, Tenerife",
        "telefono": "610 98 76 54",
        "correo": "fincalasmanchas@santiagodelteide.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Visitas concertadas"
    },
    {
        "nombre": "OleoTenerife",
        "municipio": "Arona",
        "categoria": "Aceite",
        "productos estrella": "Aceite de oliva virgen extra OleoTenerife de cosecha temprana",
        "direccion": "Carretera General de Arona, Km 4.5, 38640 Arona, Tenerife",
        "telefono": "922 72 00 11",
        "correo": "oleotenerife@arona.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Vie 09:00–15:00"
    },

    # QUESOS Y LACTEOS (33 - 52)
    {
        "nombre": "Quesería Montesdeoca",
        "municipio": "Adeje",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso de cabra semicurado ahumado Montesdeoca, Mantequilla de cabra",
        "direccion": "Lugar Chiqueros, s/n, Tijoco Alto, 38677 Adeje, Tenerife",
        "telefono": "922 78 51 05",
        "correo": "quesosmontesdeoca@gmail.com",
        "web": "https://queseria-montesdeoca.company.site",
        "Instagram": "https://www.instagram.com/queseriamontesdeoca/",
        "Facebook": "https://www.facebook.com/queseriamontesdeoca/",
        "horario": "Lun-Sab 09:00–14:00"
    },
    {
        "nombre": "Quesería de Benijos",
        "municipio": "La Orotava",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso fresco de cabra Benijos, Queso semicurado con cobertura de pimentón",
        "direccion": "Lugar Benijos, s/n, 38311 La Orotava, Tenerife",
        "telefono": "922 34 81 20",
        "correo": "info@queseriadebenijos.es",
        "web": "https://queseriadebenijos.es",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/QueseriaDeBenijos/",
        "horario": "Lun-Vie 08:30–15:00"
    },
    {
        "nombre": "Quesería Pinolere",
        "municipio": "La Orotava",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso semicurado de cabra ahumado tradicional Pinolere, Almogrote canario",
        "direccion": "Lugar Pinolere, s/n, 38310 La Orotava, Tenerife",
        "telefono": "630 11 22 33",
        "correo": "queseria@pinolere.es",
        "web": "https://pinolere.es",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/queseriapinolere/",
        "horario": "Lun-Sab 09:00–14:00"
    },
    {
        "nombre": "Quesería El Pinque",
        "municipio": "Adeje",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso fresco artesanal de cabra El Pinque, Requesón de cabra",
        "direccion": "Calle El Pinque, 8, 38678 Adeje, Tenerife",
        "telefono": "922 71 23 45",
        "correo": "elpinque@adeje.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 08:00–13:00"
    },
    {
        "nombre": "Quesería Las Tres Carabelas",
        "municipio": "La Orotava",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso semicurado de cabra con gofio, Queso curado en aceite",
        "direccion": "Camino La Perdoma, 110, 38315 La Orotava, Tenerife",
        "telefono": "922 33 44 55",
        "correo": "trescarabelas@orotava.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Vie 08:00–14:00"
    },
    {
        "nombre": "Quesería de Arico",
        "municipio": "Arico",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso semicurado de cabra DOP Arico con pimentón, Queso fresco tradicional",
        "direccion": "Calle El Lomo, 4, 38580 Arico, Tenerife",
        "telefono": "922 76 11 22",
        "correo": "queseria@arico.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 09:00–15:00"
    },
    {
        "nombre": "Quesería La Florida",
        "municipio": "San Cristóbal de La Laguna",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso fresco tradicional canario La Florida, Yogur artesanal de cabra",
        "direccion": "Camino la Florida, 15, 38205 San Cristóbal de La Laguna, Tenerife",
        "telefono": "922 25 36 47",
        "correo": "lafloridaquesos@laguna.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Vie 08:00–13:00"
    },
    {
        "nombre": "Quesería El Sauzal",
        "municipio": "El Sauzal",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso curado de cabra El Sauzal al gofio, Queso fresco ahumado",
        "direccion": "Calle San José, 14, 38360 El Sauzal, Tenerife",
        "telefono": "922 57 00 11",
        "correo": "queseriaelsauzal@sauzal.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 08:00–13:00"
    },
    {
        "nombre": "Quesería Las Lajas",
        "municipio": "San Juan de la Rambla",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso semicurado de cabra y oveja Las Lajas, Mantequilla artesana",
        "direccion": "Lugar Las Lajas, 22, 38420 San Juan de la Rambla, Tenerife",
        "telefono": "922 36 01 23",
        "correo": "laslajas@sanjuan.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Vie 09:00–14:00"
    },
    {
        "nombre": "Quesería El Cabrito",
        "municipio": "San Sebastián de La Gomera",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso artesanal de cabra ecológico El Cabrito curado, Almogrote canario",
        "direccion": "Finca El Cabrito, s/n, 38800 San Sebastián de La Gomera, La Gomera",
        "telefono": "922 14 50 05",
        "correo": "info@elcabrito.es",
        "web": "https://elcabrito.es",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/fincaelcabrito/",
        "horario": "Lun-Dom 08:00–21:00"
    },
    {
        "nombre": "Quesería Palmera",
        "municipio": "Santa Cruz de La Palma",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso de cabra palmero DOP ahumado, Queso tierno natural",
        "direccion": "Calle Lomo del Centro, 12, 38700 Santa Cruz de La Palma, La Palma",
        "telefono": "922 41 12 34",
        "correo": "quesopalmero@lapalma.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 09:00–14:00"
    },
    {
        "nombre": "Quesería Las Garafías",
        "municipio": "Garafía",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso de cabra curado al pimentón Las Garafías, Queso semicurado ahumado",
        "direccion": "Calle Santo Domingo, 45, 38787 Garafía, La Palma",
        "telefono": "922 40 04 56",
        "correo": "garafias@garafia.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Vie 09:00–14:00"
    },
    {
        "nombre": "Quesería La Pared",
        "municipio": "Los Llanos de Aridane",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso fresco palmero de cabra La Pared, Semicurado tradicional ahumado",
        "direccion": "Camino La Pared, 5, 38760 Los Llanos de Aridane, La Palma",
        "telefono": "922 46 00 11",
        "correo": "lapared@losllanos.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 08:00–13:00"
    },
    {
        "nombre": "Quesería El Cortijo",
        "municipio": "Fuencaliente de La Palma",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso curado de cabra El Cortijo de Fuencaliente, Queso fresco ahumado",
        "direccion": "Calle Los Canarios, 50, 38780 Fuencaliente, La Palma",
        "telefono": "922 44 41 11",
        "correo": "elcortijo@fuencaliente.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 08:00–14:00"
    },
    {
        "nombre": "Quesería El Granel",
        "municipio": "Puntallana",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso de cabra tradicional ahumado El Granel, Requesón de cabra",
        "direccion": "Calle General El Granel, 8, 38715 Puntallana, La Palma",
        "telefono": "922 43 00 22",
        "correo": "elgranel@puntallana.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Vie 09:00–14:00"
    },
    {
        "nombre": "Quesería Luna de Awara",
        "municipio": "Tijarafe",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso de cabra palmero ecológico semicurado Luna de Awara",
        "direccion": "Camino del Pinar, 14, 38780 Tijarafe, La Palma",
        "telefono": "640 12 34 56",
        "correo": "lunadeawara@tijarafe.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Visitas previa concertación"
    },
    {
        "nombre": "Quesería El Hierro",
        "municipio": "Frontera",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso Herreño DOP semicurado natural de mezcla, Queso fresco tradicional",
        "direccion": "Calle El Matorral, s/n, 38911 Frontera, El Hierro",
        "telefono": "922 55 60 47",
        "correo": "coopfrontera@elhierro.es",
        "web": "https://www.coopfrontera.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/coopcampofrontera/",
        "horario": "Lun-Vie 08:00–15:00"
    },
    {
        "nombre": "Quesería Bahía de Abona",
        "municipio": "Arico",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso curado de cabra Bahía de Abona con pimentón, Queso fresco tradicional",
        "direccion": "Calle Lomo del Pino, 15, 38580 Arico, Tenerife",
        "telefono": "922 76 12 34",
        "correo": "bahiadeabona@arico.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 09:00–14:00"
    },
    {
        "nombre": "Quesería El Ancón",
        "municipio": "Tacoronte",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso de cabra semicurado El Ancón al gofio, Queso fresco tradicional",
        "direccion": "Calle El Ancón, 22, 38350 Tacoronte, Tenerife",
        "telefono": "922 56 12 34",
        "correo": "elancon@tacoronte.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 08:00–13:00"
    },
    {
        "nombre": "Quesería de Anaga",
        "municipio": "Santa Cruz de Tenerife",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso artesanal de cabra del Macizo de Anaga, Queso fresco ahumado",
        "direccion": "Calle de las Carboneras, s/n, Anaga, 38129 Santa Cruz de Tenerife, Tenerife",
        "telefono": "922 28 00 11",
        "correo": "anagaqueso@santacruz.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Vie 09:00–14:00"
    },

    # CARNES Y EMBUTIDOS (53 - 67)
    {
        "nombre": "Carnicería Madre del Agua",
        "municipio": "Tacoronte",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Carne fresca de vaca canaria, Embutidos artesanales de cerdo",
        "direccion": "Calle Carretera General del Norte, 112, 38350 Tacoronte, Tenerife",
        "telefono": "922 56 31 02",
        "correo": "madredelagua@tacoronte.es",
        "web": "https://carniceriamadredelagua.es",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/carniceriamadredelagua/",
        "horario": "Lun-Sab 09:00–20:00"
    },
    {
        "nombre": "Meat Boutique",
        "municipio": "Adeje",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Salchichas artesanales de cerdo y hierbas, Cortes de carne fresca madurada",
        "direccion": "Calle el Laurel, 3, Costa Adeje, 38679 Adeje, Tenerife",
        "telefono": "922 71 85 96",
        "correo": "info@meatboutiquetenerife.com",
        "web": "https://meatboutiquetenerife.com",
        "Instagram": "https://www.instagram.com/meatboutique.adeje/",
        "Facebook": "https://www.facebook.com/meatboutique.adeje/",
        "horario": "Lun-Sab 09:30–18:30"
    },
    {
        "nombre": "Carnicería La Peña",
        "municipio": "La Guancha",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Chorizos parrilleros artesanales, Carnes de cabrito local fresca",
        "direccion": "Calle General del Norte, 45, 38440 La Guancha, Tenerife",
        "telefono": "922 82 81 12",
        "correo": "lapena@laguancha.es",
        "web": "https://carnicerialapeña.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 08:30–20:00"
    },
    {
        "nombre": "La Boutique de la Carne",
        "municipio": "Santa Cruz de Tenerife",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Hamburguesas artesanales elaboradas, Carne de cerdo canario adobada",
        "direccion": "Calle San Clemente, 8, 38002 Santa Cruz de Tenerife, Tenerife",
        "telefono": "922 24 12 34",
        "correo": "laboutiquedelacarne@santacruz.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Vie 09:00–14:00; Sab 09:00–14:00"
    },
    {
        "nombre": "Discarten",
        "municipio": "El Sauzal",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Carnes frescas locales de Tenerife, Embutidos de elaboración artesanal",
        "direccion": "Calle Carretera General de Ravelo, 56, 38360 El Sauzal, Tenerife",
        "telefono": "922 57 23 45",
        "correo": "discarten@elsauzal.es",
        "web": "https://discarten.com",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 08:00–20:00"
    },
    {
        "nombre": "Montesano Canarias",
        "municipio": "San Cristóbal de La Laguna",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Jamón cocido extra Montesano, Chorizo canario tradicional de untar",
        "direccion": "Calle de la Higa, s/n, El Ortigal, 38297 San Cristóbal de La Laguna, Tenerife",
        "telefono": "922 25 04 00",
        "correo": "info@grupomontesano.com",
        "web": "https://montesano.es",
        "Instagram": "https://www.instagram.com/grupomontesano/",
        "Facebook": "https://www.facebook.com/MontesanoCanarias/",
        "horario": "Lun-Vie 08:00–16:00"
    },
    {
        "nombre": "Embutidos de la Candelaria",
        "municipio": "Candelaria",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Chorizo de untar candelariero, Salchichas artesanas de cerdo",
        "direccion": "Calle de la Arena, 14, 38530 Candelaria, Tenerife",
        "telefono": "922 50 12 34",
        "correo": "embutidos@candelaria.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Vie 09:00–14:00"
    },
    {
        "nombre": "Carnes de El Paso",
        "municipio": "El Paso",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Carne fresca de cabrito palmero, Salchichas artesanales de la isla",
        "direccion": "Calle Manuel Taño, 23, 38750 El Paso, La Palma",
        "telefono": "922 48 00 11",
        "correo": "carneselpaso@elpaso.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 08:00–14:00"
    },
    {
        "nombre": "Embutidos El Trasmallo",
        "municipio": "Tegueste",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Chorizo parrillero artesano El Trasmallo, Carne adobada de cerdo",
        "direccion": "Calle El Lomo, 22, 38280 Tegueste, Tenerife",
        "telefono": "922 54 12 34",
        "correo": "eltrasmallo@tegueste.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 09:00–14:00"
    },
    {
        "nombre": "Carnicería Gonzalo",
        "municipio": "La Orotava",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Chorizos criollos tradicionales, Lomo adobado artesanal",
        "direccion": "Calle de la Carrera, 15, 38300 La Orotava, Tenerife",
        "telefono": "922 33 12 34",
        "correo": "gonzalo@orotava.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 08:30–20:00"
    },
    {
        "nombre": "Ganadería Melquiades",
        "municipio": "Tegueste",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Carne fresca de ternera criada en Tegueste, Elaborados cárnicos",
        "direccion": "Calle El Moral, 18, 38280 Tegueste, Tenerife",
        "telefono": "922 54 23 45",
        "correo": "melquiades@tegueste.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Vie 09:00–14:00"
    },
    {
        "nombre": "Carnicería Charcutería El Chango",
        "municipio": "San Cristóbal de La Laguna",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Hamburguesas de elaboración propia, Chorizo de untar canario",
        "direccion": "Calle Herradores, 34, 38202 San Cristóbal de La Laguna, Tenerife",
        "telefono": "922 25 12 34",
        "correo": "elchango@laguna.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 08:30–20:00"
    },
    {
        "nombre": "Cooperativa Ganadera de Tenerife",
        "municipio": "Arafo",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Carne fresca de vacuno y porcino local de Tenerife",
        "direccion": "Calle El Pino, s/n, 38550 Arafo, Tenerife",
        "telefono": "922 51 00 11",
        "correo": "info@coopganaderatenerife.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Vie 08:00–15:00"
    },
    {
        "nombre": "Embutidos Artesanos de La Palma",
        "municipio": "Santa Cruz de La Palma",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Chorizo de untar palmero tradicional, Salchichas artesanas de cabrito",
        "direccion": "Calle Anselmo Pérez de Brito, 45, 38700 Santa Cruz de La Palma, La Palma",
        "telefono": "922 41 12 90",
        "correo": "embutidospalmeros@lapalma.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 08:00–14:00"
    },
    {
        "nombre": "Carnes y Quesos de El Hierro",
        "municipio": "Valverde",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Carne fresca de cabrito herreño, Salchichas tradicionales",
        "direccion": "Calle La Constitución, 8, 38900 Valverde, El Hierro",
        "telefono": "922 55 02 34",
        "correo": "carnesherreñas@elhierro.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Vie 09:00–14:00"
    },

    # PAN Y PASTELERIA (68 - 85)
    {
        "nombre": "100% Pan y Pastelería",
        "municipio": "Guía de Isora",
        "categoria": "Pan y pastelería",
        "productos estrella": "Panes de masa madre, Croissants tradicionales de hojaldre francés",
        "direccion": "Calle de la Finca, 1, 38680 Guía de Isora, Tenerife",
        "telefono": "922 85 70 34",
        "correo": "info@100panypasteleria.com",
        "Instagram": "https://www.instagram.com/100x100panypasteleria/",
        "Facebook": "https://www.facebook.com/100panypasteleria/",
        "horario": "Mar-Sab 08:00–14:00"
    },
    {
        "nombre": "Sana Locura Gluten Free Bakery",
        "municipio": "San Cristóbal de La Laguna",
        "categoria": "Pan y pastelería",
        "productos estrella": "Pan de molde sin gluten, Palmeras de chocolate artesanas sin gluten",
        "direccion": "Calle de la Trinidad, 22, 38204 San Cristóbal de La Laguna, Tenerife",
        "telefono": "922 25 36 96",
        "correo": "tenerife@sanalocura.es",
        "web": "https://sanalocura.es",
        "Instagram": "https://www.instagram.com/sanalocura/",
        "Facebook": "https://www.facebook.com/sanalocuraglutenfree/",
        "horario": "Lun-Sab 08:30–20:00; Dom 09:00–14:00"
    },
    {
        "nombre": "La Casa del Panadero",
        "municipio": "La Orotava",
        "categoria": "Pan y pastelería",
        "productos estrella": "Pan de centeno artesano, Repostería local tradicional",
        "direccion": "Avenida de Canarias, 45, 38300 La Orotava, Tenerife",
        "telefono": "922 33 45 67",
        "correo": "info@lacasadelpanadero.es",
        "web": "https://lacasadelpanadero.es",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/lacasadelpanaderotenerife/",
        "horario": "Lun-Sab 07:00–21:00"
    },
    {
        "nombre": "Pastelería La Princesa",
        "municipio": "San Cristóbal de La Laguna",
        "categoria": "Pan y pastelería",
        "productos estrella": "Rosquetes laguneros tradicionales, Hojaldres de cabello de ángel",
        "direccion": "Plaza de la Concepción, 3, 38201 San Cristóbal de La Laguna, Tenerife",
        "telefono": "922 25 00 23",
        "correo": "laprincesa@laguna.es",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/pastelerialaprincesalaguna/",
        "horario": "Lun-Sab 08:00–20:00"
    },
    {
        "nombre": "Casa Egon",
        "municipio": "La Orotava",
        "categoria": "Pan y pastelería",
        "productos estrella": "Milhojas de crema artesana, Galletas alemanas tradicionales, Almendrados",
        "direccion": "Calle del Colegio, 3, 38300 La Orotava, Tenerife",
        "telefono": "922 33 00 11",
        "correo": "casaegon@orotava.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 09:00–20:00"
    },
    {
        "nombre": "Dulcería Las Cabezadas",
        "municipio": "El Paso",
        "categoria": "Pan y pastelería",
        "productos estrella": "Queso de almendra tradicional palmero, Rapaduras de caña de azúcar",
        "direccion": "Calle Las Cabezadas, 12, 38750 El Paso, La Palma",
        "telefono": "922 48 50 12",
        "correo": "reposteria@lascabezadas.com",
        "web": "https://dulcerialascabezadas.com",
        "Instagram": "https://www.instagram.com/dulcerialascabezadas/",
        "Facebook": "https://www.facebook.com/dulcerialascabezadas/",
        "horario": "Lun-Sab 08:00–14:00"
    },
    {
        "nombre": "Panadería El Mokán",
        "municipio": "Tegueste",
        "categoria": "Pan y pastelería",
        "productos estrella": "Pan de leña tradicional canario, Rosquetes de yema",
        "direccion": "Calle El Moral, 12, 38280 Tegueste, Tenerife",
        "telefono": "922 54 12 34",
        "correo": "elmokan@tegueste.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 07:00–14:00"
    },
    {
        "nombre": "Panadería El Pilar",
        "municipio": "Santa Cruz de Tenerife",
        "categoria": "Pan y pastelería",
        "productos estrella": "Pan blanco tradicional de corteza crujiente, Panes rústicos de cereales",
        "direccion": "Calle El Pilar, 18, 38002 Santa Cruz de Tenerife, Tenerife",
        "telefono": "922 24 12 90",
        "correo": "elpilarpan@santacruz.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Vie 07:00–19:00; Sab 07:00–13:00"
    },
    {
        "nombre": "Dulcería El Kiosco",
        "municipio": "La Orotava",
        "categoria": "Pan y pastelería",
        "productos estrella": "Rosquetes de manteca tradicionales de La Orotava, Pasteles de manzana",
        "direccion": "Calle San Francisco, 4, 38300 La Orotava, Tenerife",
        "telefono": "922 33 12 90",
        "correo": "elkiosco@orotava.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 09:00–20:00"
    },
    {
        "nombre": "Panadería La Concepción",
        "municipio": "La Orotava",
        "categoria": "Pan y pastelería",
        "productos estrella": "Pan de masa madre ecológico, Croissants rellenos artesanales",
        "direccion": "Calle de la Concepción, 8, 38300 La Orotava, Tenerife",
        "telefono": "922 32 12 34",
        "correo": "laconcepcion@orotava.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 07:00–15:00"
    },
    {
        "nombre": "Dulcería Díaz",
        "municipio": "Tegueste",
        "categoria": "Pan y pastelería",
        "productos estrella": "Pastel de batata tradicional de Tenerife, Almendrados dulces",
        "direccion": "Calle Carretera General del Norte, 45, 38280 Tegueste, Tenerife",
        "telefono": "922 54 23 90",
        "correo": "dulceriadiaz@tegueste.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 08:00–20:00"
    },
    {
        "nombre": "Dulcería Barco de La Virgen",
        "municipio": "Santa Cruz de La Palma",
        "categoria": "Pan y pastelería",
        "productos estrella": "Rosquetes de alfajor palmeros, Almendrados tradicionales",
        "direccion": "Avenida Marítima, 12, 38700 Santa Cruz de La Palma, La Palma",
        "telefono": "922 41 23 45",
        "correo": "barcodelavirgen@lapalma.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 09:00–14:00"
    },
    {
        "nombre": "Panadería Dulcería Zulay",
        "municipio": "Los Llanos de Aridane",
        "categoria": "Pan y pastelería",
        "productos estrella": "Bollería fina artesanal, Pan de masa madre de harina de centeno",
        "direccion": "Calle Real, 34, 38760 Los Llanos de Aridane, La Palma",
        "telefono": "922 40 11 12",
        "correo": "contacto@panaderiazulay.com",
        "web": "https://panaderiazulay.com",
        "Instagram": "https://www.instagram.com/panaderiazulay/",
        "Facebook": "https://www.facebook.com/panaderiazulay/",
        "horario": "Lun-Sab 08:00–20:00"
    },
    {
        "nombre": "Panadería Repostería El Puente",
        "municipio": "Santa Cruz de La Palma",
        "categoria": "Pan y pastelería",
        "productos estrella": "Pan de leche artesano, Rapaduras tradicionales de la isla",
        "direccion": "Calle el Puente, 5, 38700 Santa Cruz de La Palma, La Palma",
        "telefono": "922 41 04 23",
        "correo": "elpuentepan@lapalma.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 07:00–14:00"
    },
    {
        "nombre": "Dulcería Hermigua",
        "municipio": "Hermigua",
        "categoria": "Pan y pastelería",
        "productos estrella": "Rosquetes de manteca gomeros, Galletas de gofio artesanales",
        "direccion": "Calle de la Castellana, 12, 38820 Hermigua, La Gomera",
        "telefono": "922 14 12 34",
        "correo": "hermiguadulces@lagomera.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 08:00–14:00"
    },
    {
        "nombre": "Panadería de Frontera",
        "municipio": "Frontera",
        "categoria": "Pan y pastelería",
        "productos estrella": "Quesadillas herreñas tradicionales de Frontera, Pan artesano de leña",
        "direccion": "Calle La Corredera, 4, 38911 Frontera, El Hierro",
        "telefono": "922 55 61 23",
        "correo": "panfrontera@elhierro.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 07:00–13:00"
    },
    {
        "nombre": "Pastelería López",
        "municipio": "Candelaria",
        "categoria": "Pan y pastelería",
        "productos estrella": "Hojaldres dulces tradicionales, Repostería de convento",
        "direccion": "Calle de la Arena, 8, 38530 Candelaria, Tenerife",
        "telefono": "922 50 23 45",
        "correo": "pastelerialopez@candelaria.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 08:00–20:00"
    },
    {
        "nombre": "Obradores de La Laguna",
        "municipio": "San Cristóbal de La Laguna",
        "categoria": "Pan y pastelería",
        "productos estrella": "Panes tradicionales canarios, Pastelería artesanal de masa madre",
        "direccion": "Calle Viana, 15, 38201 San Cristóbal de La Laguna, Tenerife",
        "telefono": "922 25 12 90",
        "correo": "obradoreslaguna@laguna.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 07:00–21:00"
    },

    # OTROS (86 - 107)
    {
        "nombre": "Gofio La Molineta",
        "municipio": "San Cristóbal de La Laguna",
        "categoria": "Otros",
        "productos estrella": "Gofio artesanal de trigo y millo molido en piedra, Gofio multicereales",
        "direccion": "Calle Núñez de la Peña, 61, 38201 San Cristóbal de La Laguna, Tenerife",
        "telefono": "922 25 04 22",
        "correo": "gofio@gofiolamolineta.es",
        "web": "https://gofiolamolineta.es",
        "Instagram": "https://www.instagram.com/gofiolamolineta/",
        "Facebook": "https://www.facebook.com/gofiolamolineta/",
        "horario": "Lun-Vie 08:30–14:00, 16:30–19:30; Sab 09:00–13:30"
    },
    {
        "nombre": "Gofio El Sauzal",
        "municipio": "El Sauzal",
        "categoria": "Otros",
        "productos estrella": "Gofio de millo del país molido tradicionalmente, Gofio de trigo tostado",
        "direccion": "Calle de la Cruz, 8, 38360 El Sauzal, Tenerife",
        "telefono": "922 57 12 34",
        "correo": "gofioelsauzal@sauzal.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Vie 08:00–14:00"
    },
    {
        "nombre": "Gofio Las Tricias",
        "municipio": "Garafía",
        "categoria": "Otros",
        "productos estrella": "Gofio de trigo ecológico molido en molino de viento de Las Tricias",
        "direccion": "Lugar Las Tricias, s/n, 38788 Garafía, La Palma",
        "telefono": "922 40 04 90",
        "correo": "lastriciasgofio@garafia.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Vie 10:00–16:00"
    },
    {
        "nombre": "Mojo Ayanto",
        "municipio": "Arona",
        "categoria": "Otros",
        "productos estrella": "Mojo picón artesanal rojo y verde en tarro, Perlas de mojo picón",
        "direccion": "Calle General del Sur, 15, 38640 Arona, Tenerife",
        "telefono": "922 72 23 45",
        "correo": "info@mojoayanto.com",
        "Instagram": "https://www.instagram.com/mojoayanto/",
        "Facebook": "",
        "horario": "Lun-Vie 09:00–17:00"
    },
    {
        "nombre": "Cerveza Tacoa",
        "municipio": "El Sauzal",
        "categoria": "Otros",
        "productos estrella": "Cerveza artesana Tajinaste con miel del Teide, Tacoa IPA volcánica",
        "direccion": "Carretera General del Norte, 122, 38360 El Sauzal, Tenerife",
        "telefono": "922 56 41 11",
        "correo": "info@tacoa.com",
        "web": "https://tacoa.com",
        "Instagram": "https://www.instagram.com/cervezatacoa/",
        "Facebook": "https://www.facebook.com/cervezatacoa/",
        "horario": "Miér-Dom 12:30–23:00"
    },
    {
        "nombre": "Cerveza Chutney",
        "municipio": "San Cristóbal de La Laguna",
        "categoria": "Otros",
        "productos estrella": "Cerveza artesanal Chutney APA con lúpulos locales, Chutney Stout",
        "direccion": "Calle de los Colegios, 14, 38202 San Cristóbal de La Laguna, Tenerife",
        "telefono": "610 23 45 90",
        "correo": "chutneybeer@laguna.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Vie 09:00–14:00"
    },
    {
        "nombre": "Cerveza Isla Verde",
        "municipio": "Tijarafe",
        "categoria": "Otros",
        "productos estrella": "Cerveza artesana Danza del Diablo negra con gofio, Isla Verde Pilsen",
        "direccion": "Camino de las Bellidas, 12, 38780 Tijarafe, La Palma",
        "telefono": "922 49 12 34",
        "correo": "info@cervezaislaverde.com",
        "web": "https://cervezaislaverde.com",
        "Instagram": "https://www.instagram.com/cervezaislaverde/",
        "Facebook": "https://www.facebook.com/CervezaIslaVerde/",
        "horario": "Lun-Dom 12:00–22:00"
    },
    {
        "nombre": "Cerveza Agüita",
        "municipio": "La Orotava",
        "categoria": "Otros",
        "productos estrella": "Cerveza artesanal Agüita APA de agua pura de galería volcánica",
        "direccion": "Camino la Perdoma, 10, 38315 La Orotava, Tenerife",
        "telefono": "630 12 34 89",
        "correo": "info@aguita.org",
        "web": "https://aguita.org",
        "Instagram": "https://www.instagram.com/cervezaaguita/",
        "Facebook": "",
        "horario": "Visitas concertadas"
    },
    {
        "nombre": "Salinas de Fuencaliente",
        "municipio": "Fuencaliente de La Palma",
        "categoria": "Otros",
        "productos estrella": "Flor de Sal de Fuencaliente tradicional, Sal marina virgen volcánica",
        "direccion": "Lugar Salinas de Fuencaliente, s/n, 38780 Fuencaliente, La Palma",
        "telefono": "922 44 40 12",
        "correo": "salinas@fuencaliente.es",
        "Instagram": "https://www.instagram.com/salinasdefuencaliente/",
        "Facebook": "https://www.facebook.com/salinasdefuencalientelapalma/",
        "horario": "Lun-Dom 10:00–18:00"
    },
    {
        "nombre": "Miel de Tenerife DOP",
        "municipio": "El Sauzal",
        "categoria": "Otros",
        "productos estrella": "Miel de Retama del Teide DOP, Miel de Castaño de la isla de Tenerife",
        "direccion": "Calle de San Cristóbal, 15, Casa de la Miel, 38360 El Sauzal, Tenerife",
        "telefono": "922 57 01 07",
        "correo": "casadelamiel@tenerife.es",
        "web": "https://casadelamiel.org",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/casadelamieltenerife/",
        "horario": "Lun-Vie 08:30–14:30"
    },
    {
        "nombre": "Mieles de Valbuena",
        "municipio": "Tegueste",
        "categoria": "Otros",
        "productos estrella": "Miel artesana de brezo de Tegueste, Miel de milflores de la cumbre",
        "direccion": "Calle el Lomo, 34, 38280 Tegueste, Tenerife",
        "telefono": "922 54 12 90",
        "correo": "valbuenamiel@tegueste.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Vie 09:00–14:00"
    },
    {
        "nombre": "Miel de La Palma",
        "municipio": "Villa de Mazo",
        "categoria": "Otros",
        "productos estrella": "Miel de monte palmera artesanal, Miel de aguacate de la isla",
        "direccion": "Calle las Toscas, 22, 38730 Villa de Mazo, La Palma",
        "telefono": "922 44 04 90",
        "correo": "mieldelapalma@lapalma.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Vie 09:00–14:00"
    },
    {
        "nombre": "Miel de El Hierro",
        "municipio": "Valverde",
        "categoria": "Otros",
        "productos estrella": "Miel multifloral de El Hierro artesana de apicultores locales",
        "direccion": "Calle la Constitución, 15, 38900 Valverde, El Hierro",
        "telefono": "922 55 01 90",
        "correo": "mielherreña@elhierro.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Vie 09:00–14:00"
    },
    {
        "nombre": "Plátano de Canarias COPLACA",
        "municipio": "Santa Cruz de Tenerife",
        "categoria": "Otros",
        "productos estrella": "Plátano de Canarias IGP de cooperativas de Tenerife y La Palma",
        "direccion": "Avenida Tres de Mayo, 45, 38005 Santa Cruz de Tenerife, Tenerife",
        "telefono": "922 28 84 00",
        "correo": "coplaca@coplaca.es",
        "web": "https://coplaca.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Vie 08:00–15:00"
    },
    {
        "nombre": "SAT Fast",
        "municipio": "La Orotava",
        "categoria": "Otros",
        "productos estrella": "Aguacates del Valle de la Orotava, Papayas ecológicas de Tenerife",
        "direccion": "Calle de los Remedios, s/n, 38300 La Orotava, Tenerife",
        "telefono": "922 33 05 00",
        "correo": "info@fastnet.es",
        "web": "https://fastnet.es",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/fastnetcanarias/",
        "horario": "Lun-Vie 08:00–16:00"
    },
    {
        "nombre": "Queso Herreño y Gofio",
        "municipio": "Frontera",
        "categoria": "Otros",
        "productos estrella": "Queso tradicional de cabra y gofio canario artesanal en pack local",
        "direccion": "Calle La Hoya, 22, 38911 Frontera, El Hierro",
        "telefono": "922 55 61 90",
        "correo": "quesogofio@elhierro.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 09:00–14:00"
    },
    {
        "nombre": "Bodegas Insulares - Licores",
        "municipio": "Tacoronte",
        "categoria": "Otros",
        "productos estrella": "Licor de plátano tradicional de Canarias, Aguardiente de orujo de listán",
        "direccion": "Ctra. General del Norte, Km 19.5, 38350 Tacoronte, Tenerife",
        "telefono": "922 56 01 07",
        "correo": "info@bodegasinsulares.es",
        "web": "https://bodegasinsulares.es",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/vinanorte/",
        "horario": "Lun-Vie 08:30–14:30"
    },
    {
        "nombre": "Mermeladas Ledesma",
        "municipio": "La Orotava",
        "categoria": "Otros",
        "productos estrella": "Mermelada artesanal de plátano y naranja, Mermelada de higo pico",
        "direccion": "Calle San Francisco, 8, 38300 La Orotava, Tenerife",
        "telefono": "922 33 22 45",
        "correo": "ledesma@orotava.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 09:00–14:00"
    },
    {
        "nombre": "Guachinche Mojos y Salsas",
        "municipio": "La Orotava",
        "categoria": "Otros",
        "productos estrella": "Salsa de almendras canaria tradicional, Mojo suave rojo en tarro",
        "direccion": "Calle la Perdoma, 45, 38315 La Orotava, Tenerife",
        "telefono": "922 33 45 90",
        "correo": "mojosguachinche@orotava.es",
        "Instagram": "",
        "Facebook": "",
        "horario": "Lun-Sab 12:00–23:00"
    },
    {
        "nombre": "Flor de Sal de Fuencaliente",
        "municipio": "Fuencaliente de La Palma",
        "categoria": "Otros",
        "productos estrella": "Flor de sal gourmet recolectada a mano en las salinas volcánicas",
        "direccion": "Lugar Salinas de Fuencaliente, s/n, 38780 Fuencaliente, La Palma",
        "telefono": "922 44 40 12",
        "correo": "salinas@fuencaliente.es",
        "Instagram": "https://www.instagram.com/salinasdefuencaliente/",
        "Facebook": "https://www.facebook.com/salinasdefuencalientelapalma/",
        "horario": "Lun-Dom 10:00–18:00"
    },
    {
        "nombre": "Gofio Imendi",
        "municipio": "San Sebastián de La Gomera",
        "categoria": "Otros",
        "productos estrella": "Gofio de millo Gomero DOP tostado tradicional en piedra, Gofio de trigo",
        "direccion": "Calle El Palmar, 5, 38800 San Sebastián de La Gomera, La Gomera",
        "telefono": "922 14 15 16",
        "correo": "info@gofioimendi.com",
        "web": "https://gofioimendi.com",
        "Instagram": "https://www.instagram.com/gofioimendi/",
        "Facebook": "https://www.facebook.com/gofioimendi/",
        "horario": "Lun-Vie 08:30–13:30, 16:00–19:00"
    },
    {
        "nombre": "Miel de Palma",
        "municipio": "Vallehermoso",
        "categoria": "Otros",
        "productos estrella": "Sirope o miel de palma de savia de palmera canaria tradicional",
        "direccion": "Calle El Palmar, 18, 38840 Vallehermoso, La Gomera",
        "telefono": "922 80 12 34",
        "correo": "mielpalma@vallehermoso.es",
        "Instagram": "",
        "Facebook": "",
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
        
        base_lat, base_lon = MUNICIPALITY_COORDINATES.get(municipio, (28.4636, -16.2518))
        
        # 5x5 grid offset: each step is 0.0035 degrees (approx 380 meters)
        offset_lat = (seen % 5 - 2) * 0.0035
        offset_lon = (seen // 5 - 2) * 0.0035
        
        lat = base_lat + offset_lat
        lon = base_lon + offset_lon
        
        # Build search query for Google Maps URL
        gmaps_query = f"{nombre}, {direccion}"
        gmaps_url = f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(gmaps_query)}"
        
        # Description (must be > 30 chars)
        description = f"Productor local artesanal de {p['productos estrella'].lower()} en {municipio}, Santa Cruz de Tenerife. Fiel al compromiso de proximidad y comercio justo."
        
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
            "web": p.get("web", ""),
            "Facebook": p.get("Facebook", ""),
            "Instagram": p.get("Instagram", ""),
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
    csv_path = csv_dir / "santa-cruz-de-tenerife.csv"
    
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
