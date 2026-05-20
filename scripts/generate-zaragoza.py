#!/usr/bin/env python3
import json
import csv
from pathlib import Path

def main():
    print("Restoring Zaragoza dataset to the 110 real, verified producers...")
    existing_json_path = Path("/tmp/existing_zaragoza_110.json")
    if not existing_json_path.exists():
        print("ERROR: /tmp/existing_zaragoza_110.json does not exist. Please check your system.")
        return
        
    with open(existing_json_path, encoding="utf-8") as f:
        producers = json.load(f)
        
    print(f"Loaded {len(producers)} real producers.")
    
    # Save back to CSV
    output_path = Path("data/csv/aragon/zaragoza.csv")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    headers = [
        "slug", "nombre", "municipio", "categoria", "productos estrella",
        "direccion", "descripcion", "horario", "telefono", "correo", "web",
        "Facebook", "Instagram", "Google Maps", "lat", "lon", "fecha_revision", "imagen"
    ]
    
    with open(output_path, "w", encoding="utf-8", newline="") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=headers)
        writer.writeheader()
        for p in producers:
            row = {h: p.get(h, "") for h in headers}
            writer.writerow(row)
            
    print(f"SUCCESS: Restored {len(producers)} real rows in {output_path}")

if __name__ == "__main__":
    main()
