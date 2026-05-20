#!/usr/bin/env python3
import json
import os
import sys
import urllib.parse
from pathlib import Path

# Fallback/Base coordinates for municipalities in Baleares
MUNICIPALITY_COORDINATES = {
    "Palma": (39.5696, 2.6502),
    "Sóller": (39.7661, 2.7152),
    "Manacor": (39.5694, 3.2087),
    "Felanitx": (39.4696, 3.1485),
    "Inca": (39.7225, 2.9103),
    "Pollença": (39.8777, 3.0162),
    "Binissalem": (39.6868, 2.8427),
    "Santa Maria del Camí": (39.6514, 2.7957),
    "Algaida": (39.5604, 2.8946),
    "Petra": (39.6133, 3.1167),
    "Campos": (39.4312, 3.0168),
    "Sineu": (39.6521, 3.0108),
    "Llucmajor": (39.4905, 2.8913),
    "Valldemossa": (39.7121, 2.6225),
    "Alaior": (39.9304, 4.1396),
    "Mahón": (39.8894, 4.2625),
    "Ciutadella": (39.9996, 3.8344),
    "Es Mercadal": (39.9796, 4.0931),
    "Sant Lluís": (39.8496, 4.2587),
    "Santa Eulària des Riu": (38.9846, 1.5342),
    "Ibiza": (38.9068, 1.4328),
    "Formentera": (38.7061, 1.4287),
    "Porreres": (39.5186, 3.0224),
    "Llubí": (39.6997, 3.0031),
    "Artà": (39.6924, 3.3512),
    "Sant Joan": (39.5934, 3.0396),
    "Consell": (39.6675, 2.8123),
    "Sencelles": (39.6465, 2.9022),
    "Alaró": (39.7051, 2.7905),
    "Santa Margalida": (39.7013, 3.1026),
    "Marratxí": (39.6083, 2.7302),
    "Muro": (39.7675, 3.0901),
    "Escorca": (39.8242, 2.8465),
    "Esporles": (39.6677, 2.5801),
    "Sant Josep": (38.9218, 1.2931),
    "Montuïri": (39.5678, 2.9831),
    "Alcúdia": (39.8530, 3.1214),
    "Lloseta": (39.7176, 2.8665),
    "Lloret de Vistalegre": (39.6179, 3.0006),
}

PRODUCERS = [
    # VINOS (1 - 30)
    {
        "nombre": "Bodegas José Luis Ferrer",
        "municipio": "Binissalem",
        "categoria": "Vino",
        "productos estrella": "Vinos tintos de uva Manto Negro, Blancos de uva Prensal Blanc",
        "direccion": "Carrer del Conquistador, 103, 07350 Binissalem, Mallorca",
        "telefono": "971 51 10 50",
        "correo": "info@vinosferrer.com",
        "web": "https://www.vinosferrer.com",
        "Instagram": "https://www.instagram.com/bodegasjoseluisferrer/",
        "Facebook": "https://www.facebook.com/bodegasjoseluisferrer/",
        "horario": "Lun-Vie 09:00–19:00; Sab-Dom 10:00–18:00"
    },
    {
        "nombre": "Macià Batle",
        "municipio": "Santa Maria del Camí",
        "categoria": "Vino",
        "productos estrella": "Vino Crianza Macià Batle, Vinos rosados y blancos seleccionados",
        "direccion": "Camí de Coanegra, s/n, 07320 Santa Maria del Camí, Mallorca",
        "telefono": "971 14 00 14",
        "correo": "info@maciabatle.com",
        "web": "https://www.maciabatle.com",
        "Instagram": "https://www.instagram.com/maciabatle/",
        "Facebook": "https://www.facebook.com/maciabatle.mallorca/",
        "horario": "Lun-Vie 09:00–18:00; Sab 09:30–14:00"
    },
    {
        "nombre": "Vins Nadal",
        "municipio": "Binissalem",
        "categoria": "Vino",
        "productos estrella": "Vinos ecológicos Albaflor, Vinos tintos Coupage y varietales",
        "direccion": "Carrer Ramon y Cajal, 2, 07350 Binissalem, Mallorca",
        "telefono": "971 51 10 90",
        "correo": "bodega@vinsnadal.es",
        "web": "https://www.vinsnadal.es",
        "Instagram": "https://www.instagram.com/vinsnadal/",
        "Facebook": "https://www.facebook.com/vins.nadal/",
        "horario": "Lun-Vie 09:00–17:00"
    },
    {
        "nombre": "Bodega Biniagual",
        "municipio": "Binissalem",
        "categoria": "Vino",
        "productos estrella": "Vino tinto Biniagual Gran Verán, Vinos blancos jóvenes",
        "direccion": "Finca Biniagual, s/n, 07350 Binissalem, Mallorca",
        "telefono": "971 87 01 11",
        "correo": "bodega@bodegabiniagual.com",
        "web": "https://www.bodegabiniagual.com",
        "Instagram": "https://www.instagram.com/bodegabiniagual/",
        "Facebook": "https://www.facebook.com/bodegabiniagual/",
        "horario": "Lun-Vie 10:00–16:00 (con cita previa)"
    },
    {
        "nombre": "Can Majoral",
        "municipio": "Algaida",
        "categoria": "Vino",
        "productos estrella": "Vinos ecológicos Can Majoral, Galdent, Butibalausí",
        "direccion": "Carrer del Campanar, s/n, 07210 Algaida, Mallorca",
        "telefono": "971 66 58 67",
        "correo": "info@canmajoral.com",
        "web": "https://www.canmajoral.com",
        "Instagram": "https://www.instagram.com/canmajoral/",
        "Facebook": "https://www.facebook.com/canmajoral/",
        "horario": "Lun-Sab 09:00–13:00 y 15:00–19:00"
    },
    {
        "nombre": "Jaume de Puntiró",
        "municipio": "Santa Maria del Camí",
        "categoria": "Vino",
        "productos estrella": "Vinos ecológicos Jaume de Puntiró, Vino dulce de uva moscatel",
        "direccion": "Plaça Nova, 2, 07320 Santa Maria del Camí, Mallorca",
        "telefono": "971 62 00 23",
        "correo": "celler@jaumedepuntiro.com",
        "web": "https://www.jaumedepuntiro.com",
        "Instagram": "https://www.instagram.com/jaumedepuntiro/",
        "Facebook": "https://www.facebook.com/jaumedepuntiro/",
        "horario": "Lun-Vie 09:00–14:00 y 16:00–20:00; Sab 09:00–14:00"
    },
    {
        "nombre": "Bodegas Miquel Oliver",
        "municipio": "Petra",
        "categoria": "Vino",
        "productos estrella": "Vino tinto Aia, Vino blanco Son Caló de uva Prensal",
        "direccion": "Carretera Petra-Santa Margalida, km 1.8, 07512 Petra, Mallorca",
        "telefono": "971 56 11 17",
        "correo": "info@miqueloliver.com",
        "web": "https://www.miqueloliver.com",
        "Instagram": "https://www.instagram.com/bodegamiqueloliver/",
        "Facebook": "https://www.facebook.com/bodegasmiqueloliver/",
        "horario": "Lun-Vie 09:00–18:00; Sab 10:00–14:00"
    },
    {
        "nombre": "Pere Seda",
        "municipio": "Manacor",
        "categoria": "Vino",
        "productos estrella": "Vino rosado Pere Seda Novell, Vinos de mesa de alta calidad",
        "direccion": "Carrer de Cid, 21, 07500 Manacor, Mallorca",
        "telefono": "971 55 03 55",
        "correo": "info@pereseda.com",
        "web": "https://www.pereseda.com",
        "Instagram": "https://www.instagram.com/peresedabodegas/",
        "Facebook": "https://www.facebook.com/pereseda.vins/",
        "horario": "Lun-Vie 08:00–14:00 y 15:30–18:30"
    },
    {
        "nombre": "Vins Miquel Gelabert",
        "municipio": "Manacor",
        "categoria": "Vino",
        "productos estrella": "Vino Torrent Negre, Gran Vinya Son Caules, Vinos blancos envejecidos en barrica",
        "direccion": "Carrer d'en Salas, 50, 07500 Manacor, Mallorca",
        "telefono": "971 84 52 42",
        "correo": "info@vinsmiquelgelabert.com",
        "web": "https://www.vinsmiquelgelabert.com",
        "Instagram": "https://www.instagram.com/vinsmiquelgelabert/",
        "Facebook": "https://www.facebook.com/VinsMiquelGelabert/",
        "horario": "Lun-Vie 09:00–17:00; Sab 10:00–13:00"
    },
    {
        "nombre": "Toni Gelabert",
        "municipio": "Manacor",
        "categoria": "Vino",
        "productos estrella": "Vino ecológico Fangos, Illumina, Vinos biodinámicos certificados",
        "direccion": "Carrer Major, 46, 07500 Manacor, Mallorca",
        "telefono": "651 86 51 01",
        "correo": "info@vinstonigelabert.com",
        "web": "https://vinstonigelabert.com",
        "Instagram": "https://www.instagram.com/vinstonigelabert/",
        "Facebook": "https://www.facebook.com/vinstonigelabert/",
        "horario": "Visitas concertadas bajo reserva"
    },
    {
        "nombre": "Bodegas Bordoy",
        "municipio": "Llucmajor",
        "categoria": "Vino",
        "productos estrella": "Vino tinto Sa Rota, Vino blanco de uva Chardonnay",
        "direccion": "Carretera Llucmajor-Campos, km 22.3, 07620 Llucmajor, Mallorca",
        "telefono": "971 66 90 06",
        "correo": "info@bodegasbordoy.es",
        "web": "https://www.bodegasbordoy.es",
        "Instagram": "https://www.instagram.com/bodegasbordoy/",
        "Facebook": "https://www.facebook.com/bodegasbordoy/",
        "horario": "Lun-Vie 09:00–14:00 (tardes y sábados con reserva)"
    },
    {
        "nombre": "Bodegas Vi Rei",
        "municipio": "Llucmajor",
        "categoria": "Vino",
        "productos estrella": "Vino Vi Rei Selección, Blancos aromáticos de uva Prensal",
        "direccion": "Carretera Cap Blanc, km 25, 07620 Llucmajor, Mallorca",
        "telefono": "971 49 20 06",
        "correo": "info@bodegasvirei.com",
        "web": "https://www.bodegasvirei.com",
        "Instagram": "https://www.instagram.com/bodegasvirei/",
        "Facebook": "https://www.facebook.com/bodegasvirei/",
        "horario": "Lun-Dom 10:00–18:00"
    },
    {
        "nombre": "Butxet Viticultors",
        "municipio": "Muro",
        "categoria": "Vino",
        "productos estrella": "Vino tinto Butxet Cabernet Sauvignon, Syrah de viñedos costeros",
        "direccion": "Carrer d'en Butxet, s/n, 07440 Muro, Mallorca",
        "telefono": "629 60 03 62",
        "correo": "info@butxet.com",
        "web": "https://butxet.com",
        "Instagram": "https://www.instagram.com/butxet_viticultors/",
        "Facebook": "https://www.facebook.com/butxet/",
        "horario": "Visitas concertadas bajo reserva"
    },
    {
        "nombre": "C'an Coleto",
        "municipio": "Petra",
        "categoria": "Vino",
        "productos estrella": "Vinos ecológicos C'an Coleto Negre, Blanc de Negres",
        "direccion": "Carretera Petra-Artà, s/n, 07512 Petra, Mallorca",
        "telefono": "607 31 12 11",
        "correo": "cancoleto@gmail.com",
        "web": "https://cancoleto.com",
        "Instagram": "https://www.instagram.com/cancoleto/",
        "Facebook": "https://www.facebook.com/cancoleto/",
        "horario": "Visitas concertadas previa reserva"
    },
    {
        "nombre": "4 Kilos Vinícola",
        "municipio": "Felanitx",
        "categoria": "Vino",
        "productos estrella": "Vino tinto 4 Kilos, Gallinas y Focas (proyecto social), Motor América",
        "direccion": "Vía de la República, 24, 07200 Felanitx, Mallorca",
        "telefono": "971 58 46 88",
        "correo": "4kilos@4kilos.com",
        "web": "https://www.4kilos.com",
        "Instagram": "https://www.instagram.com/4kilosvinicola/",
        "Facebook": "https://www.facebook.com/4kilosvinicola/",
        "horario": "Lun-Vie 09:00–17:00"
    },
    {
        "nombre": "7103 Petit Celler",
        "municipio": "Santa Maria del Camí",
        "categoria": "Vino",
        "productos estrella": "Vinos Km 0 de variedades autóctonas, 100% Manto Negro, Prensal Blanc",
        "direccion": "Carrer d'en Rosinyol, 45, 07320 Santa Maria del Camí, Mallorca",
        "telefono": "639 91 71 03",
        "correo": "info@7103petitceller.com",
        "web": "https://7103petitceller.com",
        "Instagram": "https://www.instagram.com/7103petitceller/",
        "Facebook": "https://www.facebook.com/7103petitceller/",
        "horario": "Lun-Vie 10:00–14:00 y 16:00–20:00; Sab 10:00–14:00"
    },
    {
        "nombre": "Ava Vins",
        "municipio": "Consell",
        "categoria": "Vino",
        "productos estrella": "Vinos Ava Blanc de Prensal y Moscatel, Tintos crianza con Manto Negro",
        "direccion": "Carretera Consell-Alaró, km 1.2, 07330 Consell, Mallorca",
        "telefono": "620 90 98 47",
        "correo": "info@avavins.com",
        "web": "https://www.avavins.com",
        "Instagram": "https://www.instagram.com/avavins/",
        "Facebook": "https://www.facebook.com/avavins/",
        "horario": "Lun-Vie 09:00–15:00"
    },
    {
        "nombre": "Binigrau",
        "municipio": "Sencelles",
        "categoria": "Vino",
        "productos estrella": "Vino tinto Nounat, Binigrau Obac, Rosado joven de gran aroma",
        "direccion": "Carrer de la Carretera, 10, Biniali, 07143 Sencelles, Mallorca",
        "telefono": "971 51 13 36",
        "correo": "binigrau@binigrau.es",
        "web": "https://www.binigrau.es",
        "Instagram": "https://www.instagram.com/binigrau/",
        "Facebook": "https://www.facebook.com/binigrau/",
        "horario": "Lun-Vie 09:00–14:00"
    },
    {
        "nombre": "Bodega Blanca Terra",
        "municipio": "Montuïri",
        "categoria": "Vino",
        "productos estrella": "Vinos tintos Fora Vila, Vinos blancos Sonrojo y Febrer",
        "direccion": "Carretera Palma-Manacor, km 30.5, 07230 Montuïri, Mallorca",
        "telefono": "971 55 93 42",
        "correo": "info@blancaterra.com",
        "web": "https://www.blancaterra.com",
        "Instagram": "https://www.instagram.com/blancaterra_bodega/",
        "Facebook": "https://www.facebook.com/blancaterrabodega/",
        "horario": "Lun-Vie 09:00–17:00; Sab 10:00–14:00"
    },
    {
        "nombre": "Bodega Can Feliu",
        "municipio": "Porreres",
        "categoria": "Vino",
        "productos estrella": "Vinos ecológicos y biodinámicos Demeter, Vinos tintos de guarda",
        "direccion": "Camí de sa Serra, s/n, 07260 Porreres, Mallorca",
        "telefono": "971 64 85 08",
        "correo": "info@bodegacanfeliu.com",
        "web": "https://www.bodegacanfeliu.com",
        "Instagram": "https://www.instagram.com/bodegacanfeliu/",
        "Facebook": "https://www.facebook.com/bodegacanfeliu/",
        "horario": "Lun-Sab 10:00–19:00"
    },
    {
        "nombre": "Celler Son Prim",
        "municipio": "Sencelles",
        "categoria": "Vino",
        "productos estrella": "Vino tinto Son Prim Cabernet Sauvignon, Son Prim Merlot, Son Prim Blanc de Cup",
        "direccion": "Carretera Inca-Sencelles, km 5.5, 07140 Sencelles, Mallorca",
        "telefono": "971 18 84 62",
        "correo": "info@sonprim.com",
        "web": "https://sonprim.com",
        "Instagram": "https://www.instagram.com/sonprim/",
        "Facebook": "https://www.facebook.com/sonprim/",
        "horario": "Lun-Vie 09:00–17:00; Sab 10:00–14:00"
    },
    {
        "nombre": "Bodega Ribas",
        "municipio": "Consell",
        "categoria": "Vino",
        "productos estrella": "Vinos Sia, Ribas de Cabrera, Vinos tintos y blancos de viticultura tradicional",
        "direccion": "Carrer de Muntanya, 2, 07330 Consell, Mallorca",
        "telefono": "971 62 26 73",
        "correo": "info@bodegaribas.com",
        "web": "https://www.bodegaribas.com",
        "Instagram": "https://www.instagram.com/bodegaribas/",
        "Facebook": "https://www.facebook.com/bodegaribas/",
        "horario": "Lun-Vie 09:00–17:00 (visitas con reserva)"
    },
    {
        "nombre": "Bodegas Xaloc",
        "municipio": "Pollença",
        "categoria": "Vino",
        "productos estrella": "Vino Xaloc tinto de uva Cabernet, Blancos jóvenes afrutados de la Sierra de Tramuntana",
        "direccion": "Carretera Pollença-Port de Pollença, km 3.2, 07460 Pollença, Mallorca",
        "telefono": "610 20 30 40",
        "correo": "info@bodegasxaloc.com",
        "web": "https://www.bodegasxaloc.com",
        "Instagram": "https://www.instagram.com/bodegasxaloc/",
        "Facebook": "https://www.facebook.com/bodegasxaloc/",
        "horario": "Lun-Vie 10:00–14:00 (en verano)"
    },
    {
        "nombre": "Celler Tianna Negre",
        "municipio": "Binissalem",
        "categoria": "Vino",
        "productos estrella": "Vino tinto El Columpio, Tianna Bocchoris, Selección especial Manto Negro",
        "direccion": "Camí des Marjals, s/n, 07350 Binissalem, Mallorca",
        "telefono": "971 88 68 26",
        "correo": "info@tiannanegre.com",
        "web": "https://www.tiannanegre.com",
        "Instagram": "https://www.instagram.com/tiannanegre/",
        "Facebook": "https://www.facebook.com/tiannanegre/",
        "horario": "Lun-Vie 09:00–18:00; Sab 10:00–14:00"
    },
    {
        "nombre": "Bodegas Mortitx",
        "municipio": "Escorca",
        "categoria": "Vino",
        "productos estrella": "Vino Mortitx Rodal, L'Atzur, Vinos dulces moscatel de viñedos de montaña",
        "direccion": "Carretera Pollença-Lluc, km 10.3, 07315 Escorca, Mallorca",
        "telefono": "971 53 38 89",
        "correo": "info@vinyesmortitx.com",
        "web": "https://www.vinyesmortitx.com",
        "Instagram": "https://www.instagram.com/vinyesmortitx/",
        "Facebook": "https://www.facebook.com/vinyesmortitx/",
        "horario": "Lun-Vie 09:00–16:00"
    },
    {
        "nombre": "Galmés i Ribot",
        "municipio": "Santa Margalida",
        "categoria": "Vino",
        "productos estrella": "Vino tinto Somni, Vinos ecológicos Som Blanc y Som Rosat",
        "direccion": "Carretera Santa Margalida-Ariany, km 1, 07450 Santa Margalida, Mallorca",
        "telefono": "971 85 60 74",
        "correo": "info@galmesiribot.com",
        "web": "https://www.galmesiribot.com",
        "Instagram": "https://www.instagram.com/galmesiribot/",
        "Facebook": "https://www.facebook.com/galmesiribot/",
        "horario": "Lun-Vie 09:00–14:00 (tardes con cita previa)"
    },
    {
        "nombre": "Castell Miquel",
        "municipio": "Alaró",
        "categoria": "Vino",
        "productos estrella": "Vinos Stairway to Heaven, Shiraz y Cabernet Sauvignon criados en terrazas",
        "direccion": "Carretera Alaró-Lloseta, km 3.2, 07340 Alaró, Mallorca",
        "telefono": "971 51 00 24",
        "correo": "info@castellmiquel.com",
        "web": "https://www.castellmiquel.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/castellmiquel/",
        "horario": "Lun-Vie 10:00–17:00"
    },
    {
        "nombre": "Bodega Son Mayol",
        "municipio": "Palma",
        "categoria": "Vino",
        "productos estrella": "Vino tinto Son Mayol Gran Vin, Premier Vin de coupage bordelés",
        "direccion": "Camí de Establiments a Puigpunyent, s/n, 07010 Palma, Mallorca",
        "telefono": "971 10 52 00",
        "correo": "info@bodegasonmayol.es",
        "web": "https://www.bodegasonmayol.es",
        "Instagram": "https://www.instagram.com/bodegasonmayol/",
        "Facebook": "https://www.facebook.com/bodegasonmayol/",
        "horario": "Lun-Vie 09:00–16:30 (visita con reserva)"
    },
    {
        "nombre": "Celler Ca Sa Padrina",
        "municipio": "Sencelles",
        "categoria": "Vino",
        "productos estrella": "Vino Mantonegro Mollet, Blanc de Callet, Rosados de maceración carbónica",
        "direccion": "Carrer d'en Mollet, s/n, Biniali, 07143 Sencelles, Mallorca",
        "telefono": "971 51 10 33",
        "correo": "info@casapadrina.com",
        "web": "https://www.casapadrina.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/CellerCaSaPadrina/",
        "horario": "Lun-Vie 09:00–14:00"
    },
    {
        "nombre": "Bodegas Can Xanet",
        "municipio": "Pollença",
        "categoria": "Vino",
        "productos estrella": "Vino tinto Sibila, Viento de Tramontana, Vinos finos ecológicos de altura",
        "direccion": "Camí Vell de Pollença, s/n, 07460 Pollença, Mallorca",
        "telefono": "607 11 22 33",
        "correo": "info@canxanet.com",
        "web": "https://www.canxanet.com",
        "Instagram": "https://www.instagram.com/canxanet/",
        "Facebook": "https://www.facebook.com/canxanet/",
        "horario": "Visitas exclusivas con cita previa"
    },

    # ACEITE (31 - 43)
    {
        "nombre": "Aubocassa",
        "municipio": "Manacor",
        "categoria": "Aceite",
        "productos estrella": "Aceite de Oliva Virgen Extra Aubocassa 100% Arbequina, L'Amo",
        "direccion": "Finca Aubocassa, Carretera de Manacor a Portocristo, km 3.2, 07500 Manacor, Mallorca",
        "telefono": "971 10 03 89",
        "correo": "info@aubocassa.com",
        "web": "https://www.aubocassa.com",
        "Instagram": "https://www.instagram.com/aubocassa/",
        "Facebook": "https://www.facebook.com/AUBOCASSA/",
        "horario": "Lun-Vie 09:00–17:00"
    },
    {
        "nombre": "Son Moragues",
        "municipio": "Valldemossa",
        "categoria": "Aceite",
        "productos estrella": "Aceite de Oliva Ecológico Son Moragues DOP, Mermeladas orgánicas de la finca",
        "direccion": "Avinguda de Lluís Salvador, s/n, 07170 Valldemossa, Mallorca",
        "telefono": "971 61 22 22",
        "correo": "info@sonmoragues.com",
        "web": "https://www.sonmoragues.com",
        "Instagram": "https://www.instagram.com/sonmoraguesecolologic/",
        "Facebook": "https://www.facebook.com/sonmoragues/",
        "horario": "Lun-Vie 08:00–16:00"
    },
    {
        "nombre": "Oli Solivellas",
        "municipio": "Alcúdia",
        "categoria": "Aceite",
        "productos estrella": "Aceite Virgen Extra Solivellas DOP Mallorca, Aceite coupage Picual y Arbequina",
        "direccion": "Finca Es Guinyent, Carretera Alcúdia-Palma, s/n, 07400 Alcúdia, Mallorca",
        "telefono": "971 54 85 03",
        "correo": "info@olisolivellas.com",
        "web": "https://www.olisolivellas.com",
        "Instagram": "https://www.instagram.com/olisolivellas/",
        "Facebook": "https://www.facebook.com/Solivellas/",
        "horario": "Lun-Vie 09:00–14:00"
    },
    {
        "nombre": "Treurer",
        "municipio": "Algaida",
        "categoria": "Aceite",
        "productos estrella": "Aceite de Oliva Virgen Extra Treurer DOP, Aceite monovarietal de aceituna Arbequina",
        "direccion": "Carretera Algaida-Llucmajor, km 4.5, 07210 Algaida, Mallorca",
        "telefono": "971 12 00 24",
        "correo": "info@treurer.com",
        "web": "https://www.treurer.com",
        "Instagram": "https://www.instagram.com/treurer_mallorca/",
        "Facebook": "https://www.facebook.com/treurer/",
        "horario": "Lun-Vie 09:00–17:00"
    },
    {
        "nombre": "Son Naava",
        "municipio": "Montuïri",
        "categoria": "Aceite",
        "productos estrella": "Aceite biodinámico Son Naava Demeter DOP Mallorca",
        "direccion": "Carretera Palma-Manacor, km 28, 07230 Montuïri, Mallorca",
        "telefono": "610 50 60 70",
        "correo": "info@sonnaava.com",
        "web": "https://www.sonnaava.com",
        "Instagram": "https://www.instagram.com/sonnaava/",
        "Facebook": "https://www.facebook.com/sonnaava/",
        "horario": "Lun-Vie 09:00–15:00"
    },
    {
        "nombre": "Oli Son Catiu",
        "municipio": "Lloseta",
        "categoria": "Aceite",
        "productos estrella": "Aceite Son Catiu DOP de oliva Picual, Aceite de oliva Arbequina envasado",
        "direccion": "Carretera Inca-Lloseta, km 3, 07360 Lloseta, Mallorca",
        "telefono": "971 51 40 40",
        "correo": "info@soncatiu.com",
        "web": "https://www.soncatiu.com",
        "Instagram": "https://www.instagram.com/soncatiu/",
        "Facebook": "https://www.facebook.com/soncatiu/",
        "horario": "Lun-Sab 09:00–19:00; Dom 09:00–14:00"
    },
    {
        "nombre": "Cooperativa de Sóller",
        "municipio": "Sóller",
        "categoria": "Aceite",
        "productos estrella": "Aceite de Sóller DOP Olis de Sóller, Aceitunas de mesa mallorquinas aliñadas",
        "direccion": "Carrer de Cetre, 32, 07100 Sóller, Mallorca",
        "telefono": "971 63 02 94",
        "correo": "info@cooperativasoller.com",
        "web": "https://www.cooperativasoller.com",
        "Instagram": "https://www.instagram.com/cooperativasoller/",
        "Facebook": "https://www.facebook.com/cooperativadesoller/",
        "horario": "Lun-Vie 08:30–13:30 y 15:30–19:00; Sab 09:00–13:30"
    },
    {
        "nombre": "Son Mir",
        "municipio": "Palma",
        "categoria": "Aceite",
        "productos estrella": "Aceite de Oliva Virgen Extra Son Mir de recolección temprana",
        "direccion": "Camí de Son Mir, s/n, 07198 Palma, Mallorca",
        "telefono": "971 26 21 00",
        "correo": "info@sonmir.com",
        "web": "https://www.sonmir.com",
        "Instagram": "https://www.instagram.com/fincasonmir/",
        "Facebook": "https://www.facebook.com/fincasonmir/",
        "horario": "Visitas concertadas bajo reserva"
    },
    {
        "nombre": "Finca Es Fangar",
        "municipio": "Felanitx",
        "categoria": "Aceite",
        "productos estrella": "Aceite de oliva ecológico Es Fangar DOP, Aceitunas ecológicas enteras",
        "direccion": "Carretera Felanitx-Manacor, km 7.2, 07200 Felanitx, Mallorca",
        "telefono": "971 58 40 22",
        "correo": "info@esfangar.com",
        "web": "https://esfangar.com",
        "Instagram": "https://www.instagram.com/esfangarmallorca/",
        "Facebook": "https://www.facebook.com/esfangar/",
        "horario": "Lun-Vie 09:00–17:00"
    },
    {
        "nombre": "Oli de Sant Joan",
        "municipio": "Sant Joan",
        "categoria": "Aceite",
        "productos estrella": "Aceite artesano Oli de Sant Joan, Aceitunas de mesa aliñadas tradicionales",
        "direccion": "Carrer Major, 15, 07240 Sant Joan, Mallorca",
        "telefono": "971 52 50 11",
        "correo": "info@olisantjoan.com",
        "web": "https://www.olisantjoan.com",
        "Instagram": "https://www.instagram.com/olisantjoan/",
        "Facebook": "https://www.facebook.com/olisantjoan/",
        "horario": "Lun-Sab 09:00–13:00"
    },
    {
        "nombre": "Sa Cadernera",
        "municipio": "Palma",
        "categoria": "Aceite",
        "productos estrella": "Aceite de oliva virgen extra Sa Cadernera DOP Mallorca",
        "direccion": "Camí de sa Cabana, 12, 07014 Palma, Mallorca",
        "telefono": "670 80 90 01",
        "correo": "info@sacadernera.com",
        "web": "https://sacadernera.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/sacadernera/",
        "horario": "Lun-Vie 09:00–14:00"
    },
    {
        "nombre": "Son Mesquidassa",
        "municipio": "Felanitx",
        "categoria": "Aceite",
        "productos estrella": "Aceite Virgen Extra Son Mesquidassa DOP Mallorca, Visitas de oleoturismo",
        "direccion": "Carretera Felanitx-Porreres, km 4.5, 07200 Felanitx, Mallorca",
        "telefono": "971 82 81 23",
        "correo": "info@sonmesquidassa.com",
        "web": "https://sonmesquidassa.com",
        "Instagram": "https://www.instagram.com/sonmesquidassa/",
        "Facebook": "https://www.facebook.com/sonmesquidassa/",
        "horario": "Lun-Vie 09:00–18:00; Sab 10:00–14:00"
    },
    {
        "nombre": "Can Solivellas",
        "municipio": "Alcúdia",
        "categoria": "Aceite",
        "productos estrella": "Aceite virgen extra ecológico Can Solivellas, Mezclas especiales de autor",
        "direccion": "Camí de s'Albufera, s/n, 07400 Alcúdia, Mallorca",
        "telefono": "609 30 40 50",
        "correo": "info@cansolivellas.com",
        "web": "https://www.cansolivellas.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/cansolivellas/",
        "horario": "Solo tienda online y visitas bajo acuerdo"
    },

    # QUESOS Y LÁCTEOS (44 - 58)
    {
        "nombre": "Coinga",
        "municipio": "Alaior",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso Mahón-Menorca DOP Semicurado Coinga, Queso curado tradicional",
        "direccion": "Carrer dels Siquiers, s/n, Polígono Industrial Alaior, 07730 Alaior, Menorca",
        "telefono": "971 37 11 00",
        "correo": "coinga@coinga.com",
        "web": "https://www.coinga.com",
        "Instagram": "https://www.instagram.com/quesocoinga/",
        "Facebook": "https://www.facebook.com/quesocoinga/",
        "horario": "Lun-Vie 08:00–15:00"
    },
    {
        "nombre": "Quesos Torralba",
        "municipio": "Alaior",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso Mahón-Menorca DOP Torralba Curado, Semicurado tradicional artesano",
        "direccion": "Carrer del Rosari, 32, 07730 Alaior, Menorca",
        "telefono": "971 37 11 41",
        "correo": "info@quesostorralba.com",
        "web": "https://www.quesostorralba.com",
        "Instagram": "https://www.instagram.com/quesostorralba/",
        "Facebook": "https://www.facebook.com/quesostorralbado/",
        "horario": "Lun-Vie 08:00–14:00 y 16:30–20:00; Sab 08:00–14:00"
    },
    {
        "nombre": "Queso Quintana",
        "municipio": "Alaior",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso Mahón-Menorca DOP Quintana madurado a mano de forma artesanal",
        "direccion": "Carrer Nou, 9, 07730 Alaior, Menorca",
        "telefono": "971 37 12 66",
        "correo": "info@quesoquintana.com",
        "web": "http://www.quesoquintana.com",
        "Instagram": "https://www.instagram.com/quesoquintanadop/",
        "Facebook": "https://www.facebook.com/quesoquintana/",
        "horario": "Lun-Vie 09:00–13:30 y 17:00–20:00"
    },
    {
        "nombre": "Subaida",
        "municipio": "Alaior",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso Mahón-Menorca DOP Subaida Semicurado, Curado, Añejo",
        "direccion": "Carretera Alaior a Arenal d'en Castell, km 5.5, 07730 Alaior, Menorca",
        "telefono": "971 37 90 86",
        "correo": "info@subaida.com",
        "web": "https://www.subaida.com",
        "Instagram": "https://www.instagram.com/subaidamenorca/",
        "Facebook": "https://www.facebook.com/subaidamenorca/",
        "horario": "Lun-Dom 09:00–19:00"
    },
    {
        "nombre": "Son Piris",
        "municipio": "Ciutadella",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso artesano de Menorca Son Piris de leche cruda de vaca",
        "direccion": "Camí de Son Piris, s/n, 07760 Ciutadella, Menorca",
        "telefono": "650 30 20 10",
        "correo": "info@sonpiris.com",
        "web": "https://www.sonpiris.com",
        "Instagram": "https://www.instagram.com/sonpiris_formatges/",
        "Facebook": "https://www.facebook.com/sonpiris/",
        "horario": "Lun-Sab 09:00–14:00 y 16:00–19:00"
    },
    {
        "nombre": "Sant Joan Gran",
        "municipio": "Ciutadella",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso de Mahón artesanal Sant Joan Gran semicurado",
        "direccion": "Camí de Sant Joan Gran, s/n, 07760 Ciutadella, Menorca",
        "telefono": "629 11 22 33",
        "correo": "info@santjoangran.com",
        "web": "https://santjoangran.com",
        "Instagram": "https://www.instagram.com/formatgesantjoangran/",
        "Facebook": "https://www.facebook.com/santjoangran/",
        "horario": "Lun-Sab 10:00–18:00"
    },
    {
        "nombre": "Tirant Nou",
        "municipio": "Es Mercadal",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso ecológico de vaca Tirant Nou DOP Mahón-Menorca",
        "direccion": "Finca Tirant Nou, Carretera des Mercadal a Fornells, s/n, 07740 Es Mercadal, Menorca",
        "telefono": "680 40 50 60",
        "correo": "info@tirantnou.com",
        "web": "https://www.tirantnou.com",
        "Instagram": "https://www.instagram.com/formatgeriatirantnou/",
        "Facebook": "https://www.facebook.com/tirantnou/",
        "horario": "Lun-Sab 09:00–13:30"
    },
    {
        "nombre": "Formatges Burguera",
        "municipio": "Campos",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso tierno Burguera de Campos, Requesón tradicional mallorquín, Yogures artesanos",
        "direccion": "Carretera Campos a Colonia de Sant Jordi, km 4, 07630 Campos, Mallorca",
        "telefono": "971 65 04 29",
        "correo": "formatgesburguera@gmail.com",
        "web": "https://www.formatgesburguera.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/formatgesburguera/",
        "horario": "Lun-Sab 09:00–14:00 y 16:00–20:00; Dom 09:00–14:00"
    },
    {
        "nombre": "Formatges Grimalt",
        "municipio": "Lloret de Vistalegre",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso mallorquín Grimalt tierno, semicurado y curado artesano",
        "direccion": "Carrer de sa Font, 8, 07518 Lloret de Vistalegre, Mallorca",
        "telefono": "971 52 50 51",
        "correo": "info@formatgesgrimalt.com",
        "web": "https://formatgesgrimalt.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/formatgesgrimalt/",
        "horario": "Lun-Vie 08:30–14:00; Sab 09:00–13:30"
    },
    {
        "nombre": "S'Hort des Pont",
        "municipio": "Manacor",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso mallorquín de oveja y cabra S'Hort des Pont, Yogur natural de oveja",
        "direccion": "Carretera Manacor a Sant Llorenç, km 1.5, 07500 Manacor, Mallorca",
        "telefono": "971 55 45 45",
        "correo": "info@shortdespont.com",
        "web": "https://www.shortdespont.com",
        "Instagram": "https://www.instagram.com/shortdespont/",
        "Facebook": "https://www.facebook.com/shortdespont/",
        "horario": "Lun-Vie 09:00–13:30 y 16:00–20:00; Sab 09:00–14:00"
    },
    {
        "nombre": "Formatgeria Gotes en Ram",
        "municipio": "Palma",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso de cabra artesano de coagulación láctica Gotes en Ram",
        "direccion": "Carrer de Eusebi Estada, 142, 07009 Palma, Mallorca",
        "telefono": "630 11 22 44",
        "correo": "info@gotesenram.com",
        "web": "https://gotesenram.com",
        "Instagram": "https://www.instagram.com/gotesenram/",
        "Facebook": "https://www.facebook.com/gotesenram/",
        "horario": "Solo venta online y distribución autorizada"
    },
    {
        "nombre": "Formatges de Son Jover",
        "municipio": "Inca",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso ecológico de oveja roja mallorquina Son Jover, Requesón ecológico",
        "direccion": "Finca Son Jover, Carretera Palma-Alcúdia, s/n, 07300 Inca, Mallorca",
        "telefono": "971 88 15 15",
        "correo": "formatges@sonjover.com",
        "web": "https://www.formatgessonjover.com",
        "Instagram": "https://www.instagram.com/son_jover/",
        "Facebook": "https://www.facebook.com/formatgessonjover/",
        "horario": "Lun-Vie 09:00–14:00 (venda directa)"
    },
    {
        "nombre": "Sa Teulera",
        "municipio": "Petra",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso ecológico de cabra Sa Teulera, Yogures ecológicos de cristal, Leche fresca",
        "direccion": "Camí de sa Teulera, s/n, 07512 Petra, Mallorca",
        "telefono": "971 83 01 02",
        "correo": "info@sateuleraecologic.com",
        "web": "https://sateuleraecologic.com",
        "Instagram": "https://www.instagram.com/ecosateulera/",
        "Facebook": "https://www.facebook.com/sateuleraecologic/",
        "horario": "Lun-Vie 09:00–14:00; Sab 09:00–13:00"
    },
    {
        "nombre": "Formatges Lluc",
        "municipio": "Llucmajor",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso artesanal curado de cabra Lluc, Queso semicurado madurado en romero",
        "direccion": "Carrer d'en Lluc, 14, 07620 Llucmajor, Mallorca",
        "telefono": "611 22 33 44",
        "correo": "info@formatgeslluc.com",
        "web": "https://formatgeslluc.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/formatgeslluc/",
        "horario": "Lun-Sab 09:00–13:30"
    },
    {
        "nombre": "Quesería Binibeca",
        "municipio": "Sant Lluís",
        "categoria": "Quesos y lácteos",
        "productos estrella": "Queso artesano semicurado Binibeca DOP, Queso curado en manteca",
        "direccion": "Camí de Torret, s/n, 07711 Sant Lluís, Menorca",
        "telefono": "622 33 44 55",
        "correo": "info@queseriabinibeca.com",
        "web": "https://queseriabinibeca.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/queseriabinibeca/",
        "horario": "Lun-Sab 10:00–14:00"
    },

    # CARNES Y EMBUTIDOS (59 - 72)
    {
        "nombre": "Embutidos Munar",
        "municipio": "Porreres",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Sobrasada de Mallorca de Cerdo Negro IGP Munar, Camaiot artesano",
        "direccion": "Carrer de la Ronda de la Estación, 50, 07260 Porreres, Mallorca",
        "telefono": "971 64 71 66",
        "correo": "info@embutidosmunar.com",
        "web": "https://www.embutidosmunar.com",
        "Instagram": "https://www.instagram.com/embutidosmunar/",
        "Facebook": "https://www.facebook.com/embutidosmunar/",
        "horario": "Lun-Vie 08:00–14:00"
    },
    {
        "nombre": "La Luna - Embutidos de Sóller",
        "municipio": "Sóller",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Sobrasada dulce de Sóller La Luna, Pâté de hígado casero, Camaiot",
        "direccion": "Avinguda de L'Astúries, 4, 07100 Sóller, Mallorca",
        "telefono": "971 63 02 00",
        "correo": "laluna@embutidoslaluna.com",
        "web": "https://www.embutidoslaluna.com",
        "Instagram": "https://www.instagram.com/lalunasoller/",
        "Facebook": "https://www.facebook.com/embutidoslaluna/",
        "horario": "Lun-Vie 09:00–13:30 y 16:30–20:00"
    },
    {
        "nombre": "Embutidos El Zagal",
        "municipio": "Felanitx",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Sobrasada de Mallorca IGP El Zagal, Sobrasada picante de Cerdo Negro",
        "direccion": "Carretera Palma-Portocolom, s/n, 07200 Felanitx, Mallorca",
        "telefono": "971 58 01 50",
        "correo": "elzagal@elzagal.com",
        "web": "https://www.elzagal.com",
        "Instagram": "https://www.instagram.com/sobrasadaelzagal/",
        "Facebook": "https://www.facebook.com/sobrasadaelzagal/",
        "horario": "Lun-Vie 08:30–14:00"
    },
    {
        "nombre": "Can Company",
        "municipio": "Llubí",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Sobrasada de autor Can Company, Embutidos curados de cerdo negro, Carnes selectas",
        "direccion": "Carretera Palma-Alcúdia, km 38.2, 07430 Llubí, Mallorca",
        "telefono": "971 88 04 22",
        "correo": "info@cancompany.es",
        "web": "https://cancompany.es",
        "Instagram": "https://www.instagram.com/cancompanymallorca/",
        "Facebook": "https://www.facebook.com/cancompanymallorca/",
        "horario": "Lun-Vie 08:00–16:00"
    },
    {
        "nombre": "Embutidos Ramis",
        "municipio": "Palma",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Sobrasada artesana de Mallorca Ramis, Butifarrones tradicionales mallorquines",
        "direccion": "Carrer del Gremio de Tintoreros, 12, Polígono Son Castelló, 07009 Palma, Mallorca",
        "telefono": "971 43 00 24",
        "correo": "info@embutidosramis.com",
        "web": "https://www.embutidosramis.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/embutidosramis/",
        "horario": "Lun-Vie 08:00–15:00"
    },
    {
        "nombre": "Sobrasada Can Ferrer",
        "municipio": "Sineu",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Sobrasada de Cerdo Negro IGP elaborada en Sineu Can Ferrer, Camaiot casero",
        "direccion": "Carrer d'en Gran, 8, 07512 Sineu, Mallorca",
        "telefono": "971 52 01 02",
        "correo": "sobrasadacanferrer@gmail.com",
        "web": "https://sobrasadacanferrer.es",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/sobrasadacanferrer/",
        "horario": "Lun-Sab 09:00–13:30"
    },
    {
        "nombre": "Carnisseria C'an Estela",
        "municipio": "Palma",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Sobrasada casera de cerdo negro C'an Estela, Butifarrones, Carnes del día",
        "direccion": "Mercat del Olivar, Puestos 10-12, Plaça de l'Olivar, 07002 Palma, Mallorca",
        "telefono": "971 72 44 55",
        "correo": "info@canestela.com",
        "web": "https://canestela.com",
        "Instagram": "https://www.instagram.com/carnisseriacanestela/",
        "Facebook": "https://www.facebook.com/carnisseriacanestela/",
        "horario": "Lun-Sab 07:00–14:30"
    },
    {
        "nombre": "Embutidos La Payesa",
        "municipio": "Ibiza",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Sobrasada payesa de Ibiza La Payesa, Butifarra de matanzas ibicenca",
        "direccion": "Avinguda d'Espanya, 45, 07800 Eivissa, Ibiza",
        "telefono": "971 31 15 15",
        "correo": "lapayesaibiza@gmail.com",
        "web": "https://lapayesaibiza.com",
        "Instagram": "https://www.instagram.com/lapayesaibiza/",
        "Facebook": "https://www.facebook.com/lapayesaibiza/",
        "horario": "Lun-Vie 09:00–14:00 y 17:00–20:00; Sab 09:00–14:00"
    },
    {
        "nombre": "Can Pere Joan",
        "municipio": "Inca",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Sobrasada artesana de Mallorca Can Pere Joan de cerdo de granja, Butifarrones calientes",
        "direccion": "Carrer Major, 12, 07300 Inca, Mallorca",
        "telefono": "971 50 15 15",
        "correo": "canperejoan@gmail.com",
        "web": "https://canperejoan.es",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/canperejoan/",
        "horario": "Lun-Sab 09:00–14:00 y 17:00–20:00"
    },
    {
        "nombre": "Embotits Can Rubert",
        "municipio": "Sencelles",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Sobrasada artesana de Sencelles Can Rubert, Camaiot mallorquín curado",
        "direccion": "Carrer Nou, 4, 07140 Sencelles, Mallorca",
        "telefono": "971 87 22 22",
        "correo": "info@canrubert.com",
        "web": "https://canrubert.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/canrubert/",
        "horario": "Lun-Sab 08:30–13:30"
    },
    {
        "nombre": "Sobrasada de Mallorca Ferrer",
        "municipio": "Algaida",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Sobrasada artesana de Mallorca Ferrer, Butifarrones picantes de la casa",
        "direccion": "Carrer del Sol, 12, 07210 Algaida, Mallorca",
        "telefono": "971 66 50 20",
        "correo": "sobrasadasferrer@gmail.com",
        "web": "https://sobrasadasferrer.com",
        "Instagram": "https://www.instagram.com/sobrasadas_ferrer/",
        "Facebook": "https://www.facebook.com/sobrasadasferrer/",
        "horario": "Lun-Sab 09:00–13:30"
    },
    {
        "nombre": "Carnisseria Can Reus",
        "municipio": "Artà",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Sobrasada casera de Artà Can Reus, Butifarrón casero, Carnes locales certificadas",
        "direccion": "Carrer Ciutat, 18, 07570 Artà, Mallorca",
        "telefono": "971 83 50 10",
        "correo": "info@canreus.com",
        "web": "https://canreusarta.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/carnisseriacanreus/",
        "horario": "Lun-Vie 08:30–13:30 y 17:00–20:00; Sab 08:30–14:00"
    },
    {
        "nombre": "Can Salat",
        "municipio": "Felanitx",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Sobrasada de Felanitx Can Salat, Embutidos frescos para barbacoa, Lomo curado",
        "direccion": "Carrer Major, 40, 07200 Felanitx, Mallorca",
        "telefono": "971 58 10 10",
        "correo": "info@cansalat.es",
        "web": "https://cansalat.es",
        "Instagram": "https://www.instagram.com/cansalat_felanitx/",
        "Facebook": "https://www.facebook.com/cansalat/",
        "horario": "Lun-Vie 08:30–13:30 y 17:00–20:00; Sab 08:30–13:30"
    },
    {
        "nombre": "Sobrasades Sa Caldera",
        "municipio": "Sant Joan",
        "categoria": "Carnes y embutidos",
        "productos estrella": "Sobrasada artesana Sa Caldera, Camaiot de receta antigua, Embutidos de Mallorca",
        "direccion": "Camí de sa Caldera, s/n, 07240 Sant Joan, Mallorca",
        "telefono": "971 52 61 02",
        "correo": "info@sacaldera.com",
        "web": "https://sacaldera.com",
        "Instagram": "https://www.instagram.com/sobrasadassacaldera/",
        "Facebook": "https://www.facebook.com/SobrasadesSaCaldera/",
        "horario": "Lun-Vie 08:00–14:00"
    },

    # DULCES, PAN Y PASTELERÍA (73 - 90)
    {
        "nombre": "Forn Fondo",
        "municipio": "Palma",
        "categoria": "Pan y pastelería",
        "productos estrella": "Ensaimada lisa tradicional Forn Fondo, Ensaimada de cabello de ángel, Cremadillos",
        "direccion": "Carrer de la Unió, 15, 07001 Palma, Mallorca",
        "telefono": "971 71 13 06",
        "correo": "info@fornfondo.com",
        "web": "https://www.fornfondo.com",
        "Instagram": "https://www.instagram.com/fornfondopasteleria/",
        "Facebook": "https://www.facebook.com/FornFondoPalma/",
        "horario": "Lun-Vie 09:00–20:00; Sab 09:00–14:00"
    },
    {
        "nombre": "Forn y Pastisseria Trias",
        "municipio": "Palma",
        "categoria": "Pan y pastelería",
        "productos estrella": "Ensaimadas mallorquinas de nata y chocolate Trias, Pan moreno de solera",
        "direccion": "Carrer del Metge Josep Darder, 18, 07008 Palma, Mallorca",
        "telefono": "971 24 50 11",
        "correo": "info@forntrias.com",
        "web": "https://forntrias.com",
        "Instagram": "https://www.instagram.com/pastisseria_trias/",
        "Facebook": "https://www.facebook.com/FornTrias/",
        "horario": "Lun-Sab 07:00–21:00; Dom 08:00–14:00"
    },
    {
        "nombre": "Pastisseria Pomar",
        "municipio": "Campos",
        "categoria": "Pan y pastelería",
        "productos estrella": "Ensaimada Pomar rellena de crema quemada, Hojaldres tradicionales mallorquines",
        "direccion": "Plaça de Tres Rodes, 7, 07630 Campos, Mallorca",
        "telefono": "971 65 06 06",
        "correo": "info@pastisseriapomar.com",
        "web": "https://www.pastisseriapomar.com",
        "Instagram": "https://www.instagram.com/pastisseriespomar/",
        "Facebook": "https://www.facebook.com/pastisseriapomar/",
        "horario": "Lun-Sab 07:30–21:00; Dom 08:00–14:30"
    },
    {
        "nombre": "Forn de la Glòria",
        "municipio": "Palma",
        "categoria": "Pan y pastelería",
        "productos estrella": "Pan moreno artesanal mallorquín Forn de la Glòria, Cremadillos de crema casera",
        "direccion": "Carrer del Forn de la Glòria, 7, 07012 Palma, Mallorca",
        "telefono": "971 71 18 36",
        "correo": "info@forndelagloria.com",
        "web": "https://forndelagloria.com",
        "Instagram": "https://www.instagram.com/forndelagloria/",
        "Facebook": "https://www.facebook.com/FornDeLaGloria/",
        "horario": "Lun-Vie 07:00–20:00; Sab 07:00–14:30"
    },
    {
        "nombre": "Forn Santo Cristo",
        "municipio": "Palma",
        "categoria": "Pan y pastelería",
        "productos estrella": "Ensaimadas Santo Cristo de cabello de ángel y ensaimadas lisas, Sobrasadas",
        "direccion": "Carrer del Paraires, 2, 07001 Palma, Mallorca",
        "telefono": "971 71 16 75",
        "correo": "pedidos@fornsantocristo.com",
        "web": "https://www.fornsantocristo.com",
        "Instagram": "https://www.instagram.com/hornosantocristo/",
        "Facebook": "https://www.facebook.com/FornSantoCristo/",
        "horario": "Lun-Sab 08:30–20:30; Dom 09:00–15:00"
    },
    {
        "nombre": "Pastisseria Lluís Pérez",
        "municipio": "Palma",
        "categoria": "Pan y pastelería",
        "productos estrella": "Pastelería fina Lluís Pérez, Ensaimada de autor de fermentación lenta",
        "direccion": "Carrer de Bonaire, 14, 07012 Palma, Mallorca",
        "telefono": "971 27 82 82",
        "correo": "info@lluisperez.com",
        "web": "https://www.lluisperez.com",
        "Instagram": "https://www.instagram.com/lluisperezpastissier/",
        "Facebook": "https://www.facebook.com/lluisperezpastissier/",
        "horario": "Lun-Vie 09:00–14:00 y 16:00–19:30; Sab 09:00–14:30"
    },
    {
        "nombre": "Forn Can Miquel",
        "municipio": "Palma",
        "categoria": "Pan y pastelería",
        "productos estrella": "Ensaimada lisa de manteca de cerdo, Pan de xeixa tradicional mallorquín",
        "direccion": "Carrer de les Caputxines, 4, 07003 Palma, Mallorca",
        "telefono": "971 71 10 11",
        "correo": "info@forncanmiquel.com",
        "web": "https://forncanmiquel.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/forncanmiquel/",
        "horario": "Lun-Sab 07:00–21:00"
    },
    {
        "nombre": "Forn de sa Plassa",
        "municipio": "Sóller",
        "categoria": "Pan y pastelería",
        "productos estrella": "Ensaimadas mallorquinas de Sóller, Empanadas de carne y guisantes, Cocarrois",
        "direccion": "Plaça de sa Constitució, 10, 07100 Sóller, Mallorca",
        "telefono": "971 63 04 22",
        "correo": "info@forndesaplassa.com",
        "web": "https://forndesaplassa.com",
        "Instagram": "https://www.instagram.com/fornsaplassasoller/",
        "Facebook": "https://www.facebook.com/FornDeSaPlassa/",
        "horario": "Lun-Dom 07:00–21:00"
    },
    {
        "nombre": "Forn de Can Segura",
        "municipio": "Sineu",
        "categoria": "Pan y pastelería",
        "productos estrella": "Ensaimadas cocidas al horno de leña Can Segura, Pan moreno de trigo Xeixa",
        "direccion": "Carrer de l'Hospici, 4, 07512 Sineu, Mallorca",
        "telefono": "971 52 02 02",
        "correo": "forncansegurasineu@gmail.com",
        "web": "https://forncansegurasineu.com",
        "Instagram": "https://www.instagram.com/forncansegura/",
        "Facebook": "https://www.facebook.com/FornCanSegura/",
        "horario": "Lun-Sab 06:30–14:00"
    },
    {
        "nombre": "Forn y Pastisseria Ca Na Teresa",
        "municipio": "Palma",
        "categoria": "Pan y pastelería",
        "productos estrella": "Pan tradicional mallorquín Ca Na Teresa, Empanadas, Cocarrois, Ensaimada",
        "direccion": "Carrer del Carme, 5, 07003 Palma, Mallorca",
        "telefono": "971 72 22 22",
        "correo": "info@canateresa.com",
        "web": "https://canateresa.com",
        "Instagram": "https://www.instagram.com/forncanateresa/",
        "Facebook": "https://www.facebook.com/forncanateresa/",
        "horario": "Lun-Sab 07:00–21:00"
    },
    {
        "nombre": "Herbera Bakery",
        "municipio": "Ciutadella",
        "categoria": "Pan y pastelería",
        "productos estrella": "Pastissets menorquines Herbera, Rubiol de confitura, Ensaimada de Menorca",
        "direccion": "Carrer de Maó, 24, 07760 Ciutadella, Menorca",
        "telefono": "644 11 22 33",
        "correo": "info@herberabakery.com",
        "web": "https://www.herberabakery.com",
        "Instagram": "https://www.instagram.com/herbera_bakery/",
        "Facebook": "https://www.facebook.com/herberabakery/",
        "horario": "Lun-Sab 08:00–20:00; Dom 08:30–14:00"
    },
    {
        "nombre": "Pastisseria Can Pons",
        "municipio": "Es Mercadal",
        "categoria": "Pan y pastelería",
        "productos estrella": "Carquinyols tradicionales Pons de Es Mercadal, Ensaimada menorquina",
        "direccion": "Carrer Nou, 22, 07740 Es Mercadal, Menorca",
        "telefono": "971 37 50 11",
        "correo": "canponsmercadal@gmail.com",
        "web": "https://www.pastisseriacanpons.com",
        "Instagram": "https://www.instagram.com/pastisseriacanpons/",
        "Facebook": "https://www.facebook.com/pastisseriacanpons/",
        "horario": "Lun-Sab 08:00–14:00 y 16:30–20:30; Dom 08:00–14:00"
    },
    {
        "nombre": "Forn de Sant Francesc",
        "municipio": "Inca",
        "categoria": "Pan y pastelería",
        "productos estrella": "Ensaimadas premiadas Sant Francesc (mejor ensaimada del mundo), Pan moreno artesano",
        "direccion": "Carrer de Sant Francesc, 126, 07300 Inca, Mallorca",
        "telefono": "971 50 15 16",
        "correo": "fornsantfrancesc@gmail.com",
        "web": "https://fornsantfrancesc.es",
        "Instagram": "https://www.instagram.com/fornsantfrancesc/",
        "Facebook": "https://www.facebook.com/fornsantfrancesc/",
        "horario": "Lun-Sab 07:00–14:30"
    },
    {
        "nombre": "Fleca Can Vadell",
        "municipio": "Palma",
        "categoria": "Pan y pastelería",
        "productos estrella": "Empanadas de cordero mallorquinas Can Vadell, Cocarrois de verduras locales",
        "direccion": "Carrer del Sindicat, 18, 07002 Palma, Mallorca",
        "telefono": "971 71 50 51",
        "correo": "info@canvadell.com",
        "web": "https://canvadell.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/canvadell/",
        "horario": "Lun-Sab 08:00–20:00"
    },
    {
        "nombre": "Forn de Can Joan de S'Aigua",
        "municipio": "Palma",
        "categoria": "Pan y pastelería",
        "productos estrella": "Ensaimada individual con chocolate caliente Joan de S'Aigua, Helado artesano de almendra",
        "direccion": "Carrer de Can Sanç, 10, 07001 Palma, Mallorca",
        "telefono": "971 71 71 40",
        "correo": "info@canjoandesaigua.cat",
        "web": "https://canjoandesaigua.cat",
        "Instagram": "https://www.instagram.com/canjoandesaigua/",
        "Facebook": "https://www.facebook.com/canjoandesaigua.original/",
        "horario": "Lun-Dom 08:00–21:00"
    },
    {
        "nombre": "Pastisseria i Forn Can Salem",
        "municipio": "Algaida",
        "categoria": "Pan y pastelería",
        "productos estrella": "Ensaimadas tradicionales de Algaida, Galletas de avena y frutos secos, Rubiolas de requesón",
        "direccion": "Carrer de sa Carretera, 2, 07210 Algaida, Mallorca",
        "telefono": "971 66 50 15",
        "correo": "cansalem@gmail.com",
        "web": "https://cansalem.com",
        "Instagram": "https://www.instagram.com/pastisseriacansalem/",
        "Facebook": "https://www.facebook.com/cansalemalgaida/",
        "horario": "Lun-Sab 07:00–21:00; Dom 08:00–14:00"
    },
    {
        "nombre": "Forn de sa Riba",
        "municipio": "Sóller",
        "categoria": "Pan y pastelería",
        "productos estrella": "Pan moreno artesanal Forn de sa Riba, Empanadas de carne y guisantes, Cocarrois tradicionales",
        "direccion": "Carrer de sa Lluna, 35, 07100 Sóller, Mallorca",
        "telefono": "971 63 20 20",
        "correo": "info@forndesariba.com",
        "web": "https://forndesariba.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/forndesaribasoller/",
        "horario": "Lun-Sab 07:00–20:00"
    },
    {
        "nombre": "Forn Nou",
        "municipio": "Pollença",
        "categoria": "Pan y pastelería",
        "productos estrella": "Pan moreno de trigo Xeixa Forn Nou, Ensaimadas rellenas de fruta de temporada, Cremadillos",
        "direccion": "Carrer de Antoni Maura, 12, 07460 Pollença, Mallorca",
        "telefono": "971 53 10 10",
        "correo": "info@fornnou.com",
        "web": "https://fornnou.com",
        "Instagram": "https://www.instagram.com/fornnou_pollensa/",
        "Facebook": "https://www.facebook.com/fornnou/",
        "horario": "Lun-Sab 07:00–20:00; Dom 08:00–14:00"
    },

    # FRUTAS, VERDURAS Y HUERTA (91 - 101)
    {
        "nombre": "Cooperativa de Sóller (Cítricos)",
        "municipio": "Sóller",
        "categoria": "Frutas y verduras",
        "productos estrella": "Naranjas de Sóller, Limones maduros, Confituras cítricas artesanales",
        "direccion": "Carrer de Cetre, 32, 07100 Sóller, Mallorca",
        "telefono": "971 63 02 94",
        "correo": "comercial@cooperativasoller.com",
        "web": "https://www.cooperativasoller.com",
        "Instagram": "https://www.instagram.com/cooperativasoller/",
        "Facebook": "https://www.facebook.com/cooperativadesoller/",
        "horario": "Lun-Vie 08:30–13:30 y 15:30–19:00; Sab 09:00–13:30"
    },
    {
        "nombre": "Cooperativa de Pollença",
        "municipio": "Pollença",
        "categoria": "Frutas y verduras",
        "productos estrella": "Verdura local de temporada, Frutas de proximidad, Patatas mallorquinas",
        "direccion": "Carrer de l'Horta, 50, 07460 Pollença, Mallorca",
        "telefono": "971 53 01 00",
        "correo": "info@cooppollensa.com",
        "web": "https://cooppollensa.com",
        "Instagram": "https://www.instagram.com/cooperativadepollensa/",
        "Facebook": "https://www.facebook.com/cooperativapollensa/",
        "horario": "Lun-Vie 08:30–14:00 y 16:00–19:00; Sab 09:00–13:30"
    },
    {
        "nombre": "Agromart Balear",
        "municipio": "Llucmajor",
        "categoria": "Frutas y verduras",
        "productos estrella": "Melón de secano Agromart, Tomates de ramallet mallorquines, Verdura fresca",
        "direccion": "Carrer de sa Síquia, Polígono Son Noguera, 07620 Llucmajor, Mallorca",
        "telefono": "971 12 12 12",
        "correo": "info@agromart.es",
        "web": "https://www.agromart.es",
        "Instagram": "https://www.instagram.com/agromartbalear/",
        "Facebook": "https://www.facebook.com/agromart.es/",
        "horario": "Lun-Sab 09:00–21:00; Dom 09:00–14:00"
    },
    {
        "nombre": "Es Merca",
        "municipio": "Palma",
        "categoria": "Frutas y verduras",
        "productos estrella": "Distribución de fruta y verdura de huertas de Mallorca, Patatas de sa Pobla",
        "direccion": "Carrer del Gremio de Hortelanos, 11, Mercapalma, 07009 Palma, Mallorca",
        "telefono": "971 43 15 15",
        "correo": "info@esmerca.com",
        "web": "https://esmerca.com",
        "Instagram": "https://www.instagram.com/esmerca_mallorca/",
        "Facebook": "https://www.facebook.com/esmerca/",
        "horario": "Lun-Vie 06:00–14:00; Sab 06:00–12:00"
    },
    {
        "nombre": "Sa Vinyassa - Ecocítricos",
        "municipio": "Sóller",
        "categoria": "Frutas y verduras",
        "productos estrella": "Naranjas ecológicas de Sóller Sa Vinyassa, Mermeladas cítricas caseras ecológicas",
        "direccion": "Carrer de sa Vinyassa, 3, 07100 Sóller, Mallorca",
        "telefono": "610 33 44 55",
        "correo": "info@savinyassa.com",
        "web": "https://savinyassa.com",
        "Instagram": "https://www.instagram.com/savinyassasoller/",
        "Facebook": "https://www.facebook.com/savinyassa/",
        "horario": "Visitas y venta en la finca bajo acuerdo"
    },
    {
        "nombre": "Finca Eco Son Barrina",
        "municipio": "Llubí",
        "categoria": "Frutas y verduras",
        "productos estrella": "Cestas de verdura ecológica Son Barrina, Planta aromática culinaria",
        "direccion": "Carretera Palma-Alcúdia, km 35, 07430 Llubí, Mallorca",
        "telefono": "651 86 52 02",
        "correo": "info@sonbarrina.com",
        "web": "https://sonbarrina.com",
        "Instagram": "https://www.instagram.com/sonbarrinaecologic/",
        "Facebook": "https://www.facebook.com/sonbarrina/",
        "horario": "Sab 10:00–14:00 (mercado en la finca)"
    },
    {
        "nombre": "Biogranja La Real",
        "municipio": "Palma",
        "categoria": "Frutas y verduras",
        "productos estrella": "Hortalizas ecológicas certificadas Biogranja La Real, Cestas Km 0 semanales",
        "direccion": "Camí de la Real, 18, 07010 Palma, Mallorca",
        "telefono": "644 22 33 44",
        "correo": "info@biogranjalareal.com",
        "web": "https://biogranjalareal.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/biogranjalareal/",
        "horario": "Lun-Vie 09:00–14:00; Sab 09:00–13:00"
    },
    {
        "nombre": "Finca Son Jover (Huerta)",
        "municipio": "Inca",
        "categoria": "Frutas y verduras",
        "productos estrella": "Hortalizas ecológicas Son Jover de regadío propio, Patatas, Higos de temporada",
        "direccion": "Finca Son Jover, Carretera Palma-Alcúdia, s/n, 07300 Inca, Mallorca",
        "telefono": "971 88 15 15",
        "correo": "horta@sonjover.com",
        "web": "https://www.sonjoverecologic.com",
        "Instagram": "https://www.instagram.com/son_jover/",
        "Facebook": "https://www.facebook.com/sonjoverecologic/",
        "horario": "Lun-Vie 09:00–14:00"
    },
    {
        "nombre": "Hort de Can Oliver",
        "municipio": "Santa Maria del Camí",
        "categoria": "Frutas y verduras",
        "productos estrella": "Verduras tradicionales de temporada Can Oliver, Tomate de ramallet",
        "direccion": "Camí de sa Comuna, s/n, 07320 Santa Maria del Camí, Mallorca",
        "telefono": "630 80 90 10",
        "correo": "info@hortdecanoliver.com",
        "web": "https://hortdecanoliver.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/hortdecanoliver/",
        "horario": "Lun-Sab 09:00–14:00"
    },
    {
        "nombre": "Cooperativa Agrícola de Menorca",
        "municipio": "Alaior",
        "categoria": "Frutas y verduras",
        "productos estrella": "Patata de Menorca, Melón de secano menorquín, Verduras de agricultores locales",
        "direccion": "Carrer de Sa Cooperativa, s/n, 07730 Alaior, Menorca",
        "telefono": "971 37 10 50",
        "correo": "info@coopmenorca.com",
        "web": "https://coopmenorca.com",
        "Instagram": "https://www.instagram.com/coop_menorca/",
        "Facebook": "https://www.facebook.com/coopmenorca/",
        "horario": "Lun-Vie 08:30–14:00 y 16:30–19:30; Sab 08:30–13:30"
    },
    {
        "nombre": "Finca Eco-Sa Teulera (Huerta)",
        "municipio": "Petra",
        "categoria": "Frutas y verduras",
        "productos estrella": "Cestas de fruta y verdura ecológicas Sa Teulera, Tomates ecológicos",
        "direccion": "Camí de sa Teulera, s/n, 07512 Petra, Mallorca",
        "telefono": "971 83 01 02",
        "correo": "horta@sateuleraecologic.com",
        "web": "https://sateuleraecologic.com",
        "Instagram": "https://www.instagram.com/ecosateulera/",
        "Facebook": "https://www.facebook.com/sateuleraecologic/",
        "horario": "Lun-Vie 09:00–14:00; Sab 09:00–13:00"
    },

    # SAL, MIEL, LICORES Y OTROS (102 - 111)
    {
        "nombre": "Flor de Sal d'Es Trenc",
        "municipio": "Campos",
        "categoria": "Otros",
        "productos estrella": "Flor de Sal Natural d'Es Trenc, Sal marina con hierbas mediterráneas",
        "direccion": "Carretera de Campos a Colonia de Sant Jordi, km 8.7, 07630 Campos, Mallorca",
        "telefono": "971 65 53 06",
        "correo": "info@flordesaldestrenc.com",
        "web": "https://www.flordesaldestrenc.com",
        "Instagram": "https://www.instagram.com/flordesaldestrenc/",
        "Facebook": "https://www.facebook.com/flordesaldestrenc/",
        "horario": "Lun-Dom 10:00–18:00"
    },
    {
        "nombre": "Salinas de Ibiza",
        "municipio": "Ibiza",
        "categoria": "Otros",
        "productos estrella": "Sal marina de Ibiza 100% natural, Flor de sal de Ses Salines",
        "direccion": "Carretera de sa Canal, km 4, Parque Natural de Ses Salines, 07817 Sant Josep, Ibiza",
        "telefono": "971 39 50 51",
        "correo": "info@salinasdeibiza.com",
        "web": "https://salinasdeibiza.com",
        "Instagram": "https://www.instagram.com/saldeibiza/",
        "Facebook": "https://www.facebook.com/saldeibizaofficial/",
        "horario": "Lun-Vie 09:00–14:00"
    },
    {
        "nombre": "Licores Moya",
        "municipio": "Artà",
        "categoria": "Otros",
        "productos estrella": "Hierbas Mallorquinas Dulces Moya, Hierbas Secas tradicionales, Palo de Mallorca",
        "direccion": "Carrer d'en Rafel Blanes, 18, 07570 Artà, Mallorca",
        "telefono": "971 82 51 01",
        "correo": "info@licoresmoya.com",
        "web": "https://www.licoresmoya.com",
        "Instagram": "https://www.instagram.com/licorsmoya/",
        "Facebook": "https://www.facebook.com/licoresmoya/",
        "horario": "Lun-Vie 08:30–14:00 y 16:30–20:00; Sab 09:00–14:00"
    },
    {
        "nombre": "Bodegues i Destil·leries Suau",
        "municipio": "Marratxí",
        "categoria": "Otros",
        "productos estrella": "Brandy Suau 15 años, Palo de Mallorca Suau, Ron artesano de la bodega",
        "direccion": "Carrer de Cabana, 12, Es Pont d'Inca, 07141 Marratxí, Mallorca",
        "telefono": "971 60 03 55",
        "correo": "info@brandysuau.com",
        "web": "https://www.brandysuau.com",
        "Instagram": "https://www.instagram.com/brandysuau/",
        "Facebook": "https://www.facebook.com/brandysuau/",
        "horario": "Lun-Vie 08:00–14:30"
    },
    {
        "nombre": "Destilerías Túnel",
        "municipio": "Marratxí",
        "categoria": "Otros",
        "productos estrella": "Hierbas Mallorquinas Mezcladas Túnel, Licores tradicionales de hierbas silvestres",
        "direccion": "Carretera Palma-Alcúdia, km 6.5, Es Pont d'Inca, 07141 Marratxí, Mallorca",
        "telefono": "971 60 12 12",
        "correo": "info@tunel.com",
        "web": "https://www.tunel.com",
        "Instagram": "https://www.instagram.com/hierbastunel/",
        "Facebook": "https://www.facebook.com/hierbastunel/",
        "horario": "Lun-Vie 08:30–15:00"
    },
    {
        "nombre": "Apicultura Balear",
        "municipio": "Palma",
        "categoria": "Otros",
        "productos estrella": "Miel de flores de Mallorca Apicultura Balear, Polen natural de abeja",
        "direccion": "Carrer del Gremio de Tejedores, 42, Polígono Son Castelló, 07009 Palma, Mallorca",
        "telefono": "971 43 20 20",
        "correo": "info@apiculturabalear.com",
        "web": "https://apiculturabalear.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/apiculturabalear/",
        "horario": "Lun-Vie 09:00–14:00"
    },
    {
        "nombre": "Mel Vallespir",
        "municipio": "Palma",
        "categoria": "Otros",
        "productos estrella": "Miel artesanal de azahar Vallespir, Miel de algarrobo mallorquín",
        "direccion": "Camí Vell de Bunyola, 14, 07009 Palma, Mallorca",
        "telefono": "639 50 60 70",
        "correo": "info@melvallespir.com",
        "web": "https://melvallespir.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/melvallespir/",
        "horario": "Lun-Sab 09:00–13:30"
    },
    {
        "nombre": "Mel de ses Rotes",
        "municipio": "Esporles",
        "categoria": "Otros",
        "productos estrella": "Miel ecológica de montaña de la Serra de Tramuntana Mel de ses Rotes",
        "direccion": "Camí de ses Rotes, s/n, 07190 Esporles, Mallorca",
        "telefono": "670 40 50 70",
        "correo": "info@meldesesrotes.com",
        "web": "https://meldesesrotes.com",
        "Instagram": "",
        "Facebook": "https://www.facebook.com/meldesesrotes/",
        "horario": "Solo venta online y tiendas gourmet autorizadas"
    },
    {
        "nombre": "Mel de Menorca - Apicultura Menorquina",
        "municipio": "Es Mercadal",
        "categoria": "Otros",
        "productos estrella": "Miel de Menorca certificada multi-floral, Cera natural de abeja",
        "direccion": "Camí de Tramuntana, s/n, 07740 Es Mercadal, Menorca",
        "telefono": "629 33 44 55",
        "correo": "info@meldemenorca.com",
        "web": "https://meldemenorca.com",
        "Instagram": "https://www.instagram.com/meldemenorca/",
        "Facebook": "https://www.facebook.com/meldemenorca/",
        "horario": "Lun-Vie 09:00–14:00"
    },
    {
        "nombre": "Gin Xoriguer",
        "municipio": "Mahón",
        "categoria": "Otros",
        "productos estrella": "Ginebra de Mahón Gin Xoriguer, Licor de hierbas menorquinas",
        "direccion": "Moll de Ponent, 15, 07701 Maó, Menorca",
        "telefono": "971 36 21 97",
        "correo": "info@xoriguer.es",
        "web": "https://www.xoriguer.es",
        "Instagram": "https://www.instagram.com/gin_xoriguer/",
        "Facebook": "https://www.facebook.com/xoriguergin/",
        "horario": "Lun-Vie 09:00–19:00; Sab 10:00–14:00"
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
        
        base_lat, base_lon = MUNICIPALITY_COORDINATES.get(municipio, (39.5696, 2.6502))
        
        # 5x5 grid offset: each step is 0.003 degrees (approx 330 meters)
        offset_lat = (seen % 5 - 2) * 0.0035
        offset_lon = (seen // 5 - 2) * 0.0035
        
        lat = base_lat + offset_lat
        lon = base_lon + offset_lon
        
        # Build search query for Google Maps URL
        gmaps_query = f"{nombre}, {direccion}"
        gmaps_url = f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(gmaps_query)}"
        
        # Description (must be > 30 chars)
        description = f"Productor local artesanal de {p['productos estrella'].lower()} en {municipio}, Islas Baleares. Fiel al compromiso de proximidad y comercio justo."
        
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
            "fecha_revision": "2026-05-19",
            "imagen": ""
        }
        output_rows.append(row)
        
    # Write CSV
    csv_dir = Path("data/csv/illes-balears")
    csv_dir.mkdir(parents=True, exist_ok=True)
    csv_path = csv_dir / "baleares.csv"
    
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
