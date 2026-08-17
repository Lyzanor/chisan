# Buenos Aires — candidatos

- CSV destino: `data/csv/ar/pampeana/buenos-aires.csv`
- Fuentes barridas: registro provincial de Mercados Bonaerenses (`https://mi.mda.gba.gob.ar/api/productores`, 2.528 fichas, paginado a 10 por página pese al `limit`; la ficha de detalle vive en `/mercados/bonaerenses/v2/productor/<codigoDeVerificacionQR>` y es la que trae los contactos), directorio de socios de Bodegas de Argentina, `hechoporargentinos.com` (etiquetas `bodegas-en-<partido>`), ruta del queso de Suipacha y guías locales de Tandil.
- Fecha de la última pasada: 2026-08-16.

## Cola sin resolver

- **Bodega Yancanello** — 4ª Piso — sin web en el directorio de Bodegas de Argentina.
- **La Catalina** (Coronel Pringles) y **Finca Las Antípodas** (Junín) — la nota de prensa de la ruta del vino las nombra pero no publica contacto ni domicilio; ninguna resuelve dominio propio.
- **Bodega Don Atilio** (Uribelarrea, Cañuelas) — mismo caso; ojo, no es la quesería «Don Atilio» de Tandil, que ya está en el CSV.
- **Charcutería Tandilera** — el resumen de la DO nombra «La Charcutería» entre los elaboradores certificados y lo único que aparece con ese nombre en Tandil es una carnicería/fiambrería. Falta acreditar que elabora antes de darla de alta.
- **Época de Quesos / Tradición Inza** (Tandil) — local de venta en 14 de Julio y San Martín; falta separar la tienda de la unidad elaboradora.
- **Cabañas Las Dinas** (Tandil) — elaborador del salame DO, pero `lasdinas.com.ar` es el alojamiento rural homónimo (o de la misma familia) y no acredita la fábrica.
- **Quesos de Suipacha** — la ruta del queso solo publica su Instagram; falta domicilio.

## Trabajo pendiente

- La horticultura del cinturón platense sigue sin barrer por fuera del registro provincial.
- El registro provincial deja ~440 fichas con Instagram y nombre de marca todavía sin triar, y unas 2.000 más a nombre de una persona física, que solo entran si se les acredita marca y actividad.
- Ojo con dos trampas ya vistas: casi toda entrada «Buenos Aires» del directorio de Bodegas de Argentina es la oficina porteña de una bodega que elabora en otra provincia; y la columna de web del registro provincial está muy caducada (tiendas dadas de baja, dominios que ya no resuelven y algún dominio que hoy es un portal de noticias).
