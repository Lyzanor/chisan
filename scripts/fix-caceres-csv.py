#!/usr/bin/env python3
import csv

CSV_PATH = "data/csv/extremadura/caceres.csv"

# Dictionary of corrections mapping slug -> { field_name: new_value }
CORRECTIONS = {
    "quesos-mateos-acehuche": {
        "Facebook": "https://www.facebook.com/share/15Bcq6k1gS/?mibextid=wwXIfr"
    },
    "dulces-gayo-aldeanueva-del-camino": {
        "Facebook": ""
    },
    "queseria-la-patilla-aliseda": {
        "web": ""
    },
    "horno-panaderia-bolleria-montilla-suarez-almoharin": {
        "web": "",
        "Instagram": ""
    },
    "frutas-rubi-cabezuela-del-valle": {
        "Facebook": ""
    },
    "carniceria-salchicheria-angel-caceres": {
        "Facebook": ""
    },
    "carniceria-don-solomillo-coria": {
        "web": ""
    },
    "pimenton-de-la-vera-d-o-p-las-hermanas-cuacos-de-yuste": {
        "Facebook": "https://www.facebook.com/PimentondelaVeraLasHermanas/"
    },
    "productos-la-rozay-sl-hoyos": {
        "web": "",
        "Instagram": "https://www.instagram.com/quesoslarozay/"
    },
    "pimenton-la-ristra-jaraiz-de-la-vera": {
        "Facebook": "https://www.facebook.com/pimentonlaristra/"
    },
    "pasteleria-valentin-jaraiz-de-la-vera": {
        "web": "",
        "Facebook": "https://www.facebook.com/pasteleriavalentinjaraiz/"
    },
    "productos-ovejero-s-la-moheda-de-gata": {
        "web": ""
    },
    "carniceria-charcuteria-ibericos-el-edugon-malpartida-de-caceres": {
        "Facebook": "https://www.facebook.com/people/Carnicería-El-Edugón/100063628373307/"
    },
    "panaderia-la-tahona-artesana-de-la-abuela-malpartida-de-caceres": {
        "web": ""
    },
    "obrador-horno-panaderia-dulceria-en-montanchez-montilla-suarez-montanchez": {
        "web": "",
        "Facebook": "https://www.facebook.com/panreal.almoharin.5",
        "Instagram": ""
    },
    "carniceria-bernal-avda-de-extremadura-plasencia": {
        "web": ""
    },
    "carniceria-bernal-avenida-de-la-vera-plasencia": {
        "web": ""
    },
    "carniceria-bernal-sor-valentina-miron-51-plasencia": {
        "web": ""
    },
    "vega-seleccion-jamones-y-embutidos-ibericos-plasencia": {
        "Facebook": ""
    },
    "quesos-el-cabron-plasencia": {
        "Facebook": ""
    },
    "talavera-selecta-queseria-don-pablo-plasencia": {
        "Facebook": ""
    },
    "panaderia-virgen-del-rio-talavan": {
        "web": ""
    },
    "carniceria-ortega-rubio-trujillo": {
        "web": ""
    },
    "hortofrut-de-coria-trujillo": {
        "Facebook": ""
    }
}

def main():
    rows = []
    headers = []
    
    # Read the original file
    with open(CSV_PATH, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames
        for row in reader:
            slug = row.get('slug', '')
            if slug in CORRECTIONS:
                for field, val in CORRECTIONS[slug].items():
                    print(f"Modifying '{slug}' field '{field}': '{row[field]}' -> '{val}'")
                    row[field] = val
            rows.append(row)
            
    # Write back the corrected rows
    with open(CSV_PATH, mode='w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)
        
    print("Corrections applied successfully!")

if __name__ == "__main__":
    main()
