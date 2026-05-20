#!/usr/bin/env python3
import re
from pathlib import Path

BALEARES_CORRECTIONS = {
    "Pere Seda": "https://www.instagram.com/peresedabodegas/",
    "Bodega Blanca Terra": "https://www.instagram.com/blancaterra_bodega/",
    "Forn Santo Cristo": "https://www.instagram.com/hornosantocristo/",
    "Pastisseria Pomar": "https://www.instagram.com/pastisseriespomar/",
    "Finca Eco-Sa Teulera (Huerta)": "https://www.instagram.com/ecosateulera/",
    "Sa Teulera": "https://www.instagram.com/ecosateulera/",
    "Licores Moya": "https://www.instagram.com/licorsmoya/",
    # Set to empty
    "Celler Ca Sa Padrina": "",
    "Castell Miquel": "",
    "Formatges Burguera": "",
    "Formatges Grimalt": "",
    "Formatges Lluc": "",
    "Quesería Binibeca": "",
    "Embutidos Ramis": "",
    "Sobrasada Can Ferrer": "",
    "Can Pere Joan": "",
    "Embotits Can Rubert": "",
    "Carnisseria Can Reus": "",
    "Forn Can Miquel": "",
    "Fleca Can Vadell": "",
    "Forn de sa Riba": "",
    "Biogranja La Real": "",
    "Hort de Can Oliver": "",
    "Apicultura Balear": "",
    "Mel Vallespir": "",
    "Mel de ses Rotes": "",
    "Sa Cadernera": "",
    "Can Solivellas": ""
}

LAS_PALMAS_CORRECTIONS = {
    "Bodega Frontón de Oro": "https://www.instagram.com/bodegafrontondeoro/",
    "Bodega Bermejo": "https://www.instagram.com/bodegaslosbermejos/",
    "Ron Arehucas": "https://www.instagram.com/arehucasron/",
    # Set to empty
    "Bodega Teberite": "",
    "Quesería La Gloria": "",
    "Quesería Lomo El Palo": "",
    "Quesería Madre Vieja": "",
    "Quesos Camino de Santiago": "",
    "Quesería Naroy": "",
    "Quesería La Caldera": "",
    "Quesería Guriamen": "",
    "Quesería Julián Díaz": "",
    "Quesería Rubicón": "",
    "Quesería Flor de Luz": "",
    "Quesería El Cortijo": "",
    "Embutidos El Secuestro": "",
    "Carnicería Gonzalo": "",
    "Embutidos Los Canarios": "",
    "Jamones Gran Canaria": "",
    "Ganadería El Cortijo": "",
    "Embutidos Terorero": "",
    "Carnes de Cabra Fuerte": "",
    "Embutidos Maxorata": "",
    "Dulcería Nublo": "",
    "Dulcería La Colmena": "",
    "Bizcochos de Moya": "",
    "Panadería Amaro": "",
    "Pastelería Vienna": "",
    "Panadería El Sabor": "",
    "Panadería El Cardón": "",
    "Dulcería Betancuria": "",
    "Salinas de Tenefé": "",
    "Salinas de Janubio": "",
    "Bodega Plaza Perdida": "",
    "Bodega Reymar": "",
    "Miel de Guayadeque": "",
    "Miel de Tejeda": "",
    "Miel de Lanzarote": "",
    "Miel de Fuerteventura": ""
}

def update_generator_file(filepath, corrections):
    print(f"Updating {filepath}...")
    with open(filepath, "r", encoding="utf-8") as f:
        lines = f.readlines()

    updated_lines = []
    current_name = None
    in_producers = False
    replaced_count = 0

    for line in lines:
        if "PRODUCERS = [" in line:
            in_producers = True

        if in_producers:
            # Check for name definition
            name_match = re.search(r'"nombre":\s*"([^"]+)"', line)
            if name_match:
                current_name = name_match.group(1)

            # Check for Instagram definition
            ig_match = re.search(r'"Instagram":\s*"([^"]*)"', line)
            if ig_match and current_name in corrections:
                new_url = corrections[current_name]
                # Keep original indentation
                indent = re.match(r"^\s*", line).group(0)
                line = f'{indent}"Instagram": "{new_url}",\r\n' if "\r\n" in line else f'{indent}"Instagram": "{new_url}",\n'
                replaced_count += 1

            if "]" in line and current_name is None:
                # Assuming end of PRODUCERS list
                in_producers = False

        updated_lines.append(line)

    with open(filepath, "w", encoding="utf-8") as f:
        f.writelines(updated_lines)

    print(f"Successfully updated {replaced_count} Instagram URLs in {filepath}")

def main():
    update_generator_file("scripts/generate-baleares.py", BALEARES_CORRECTIONS)
    update_generator_file("scripts/generate-las-palmas.py", LAS_PALMAS_CORRECTIONS)

if __name__ == "__main__":
    main()
