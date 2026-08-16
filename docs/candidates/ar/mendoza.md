# Mendoza — candidatos

- CSV destino: `data/csv/ar/cuyo/mendoza.csv`
- Fuente: directorio de socios de Bodegas de Argentina, https://bodegasdeargentina.org/socios-bodegas-de-argentina/ (una sola página con ~200 fichas: nombre, dirección, teléfono, web y correo)
- Fecha de búsqueda: 2026-08-16
- Alcance: solo vino, y solo lo que publica ese directorio. Los socios proveedores (bancos, corcho, vidrio, seguros, personal) ya están podados; lo que queda son bodegas sin verificar.

## Cola sin resolver

Dominios sondeados el 2026-08-16; el estado va anotado solo cuando no es un 200 limpio. Ninguna ficha está verificada: el directorio prueba la pertenencia a la cámara, no la actividad ni la localidad de la unidad productiva.

- **Bodega Aaron Tubert** — `http://www.balbistarhotel.com.ar` no resuelve
- **Bodega Bombal** — 4º Piso Dpto. — `https://bodegabombal.com/`
- **Bodega Clos De Chacras** — sin web en el directorio
- **Bodega Clément** — `http://www.clement.com.ar`
- **Bodega Colosso Wines** — Cp 5507 — `http://www.colossowines.com`
- **Bodega Cánepa Martin** — `http://canepamartin.com` no resuelve
- **Bodega Divendres** — sin web en el directorio
- **Bodega Durigutti Family Winemakers** — `http://www.durigutti.com` responde 403
- **Bodega Familia Crotta** — `http://www.crotta.com.ar`
- **Bodega Familia Zanchetta** — `http://www.bodega-raffy-zanchetta.com`
- **Bodega Finca Agostino** — Bº Trapiche Godoy Cruz — `http://www.fincaagostino.com`
- **Bodega Finca El Origen** — `http://www.fincaelorigen.com`
- **Bodega Finca Savina** — `http://www.bodegafincasavina.com/`
- **Bodega Gimenez Riili** — sin web en el directorio
- **Bodega Jorge Giol** — 3°p Of. G — sin web en el directorio
- **Bodega Lagarde** — `http://www.lagarde.com.ar`
- **Bodega Lamadrid Estate Wines** — `http://www.lamadridwines.com`
- **Bodega Monte Quieto Sa** — `http://www.montequieto.com`
- **Bodega Navarro Correas** — sin web en el directorio
- **Bodega Nieto Senetiner** — `http://www.nietosenetiner.com.ar`
- **Bodega Pulenta Estate** — `http://www.pulentaestate.com`
- **Bodega Rosell Boher** — `http://www.rosellboher.com/`
- **Bodega Serrera Wines** — `http://serrera.com.ar`
- **Bodega Sottano** — Cp 5507 — `http://www.bodegasottano.com`
- **Bodega Suter** — sin web en el directorio
- **Bodega Trapiche** — `http://www.vinosyspirits.com`
- **Dervinsa Derivados Vinicos** — sin web en el directorio
- **Grupo Avinea** — OFIC. 4 PB — sin web en el directorio

## Trabajo pendiente

Quedan 28 socios sin resolver: el resto ya está en el CSV. La dirección del directorio es a menudo la oficina comercial: 39 entradas no nombran ninguna localidad y 13 dicen solo «Ciudad». Antes de escribir `municipio` hay que abrir la web del productor.

Sin barrer: el padrón del INV (que en datos.gob.ar solo sale agregado por departamento), las rutas del vino provinciales y todo lo que no sea vino — aceite de oliva de Maipú y Luján, conservas, frutos secos.
