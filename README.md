# Km0 Mapa de Productores

Web mapa-first (Next.js + Prisma + PostgreSQL + Leaflet) cuyo contenido proviene 100% de `Km0-productores.csv`.
El mapa está acotado a la provincia de Barcelona y el buscador principal es central, con prioridad visual para ciudad y categoría.

## Columnas detectadas en el CSV

`nombre`, `-- municipio`, `categoria`, `subcategoria`, `direccion`, `descripcion`, `horario`, `telefono`, `correo`, `web`, `Facebook`, `Instagram`, `Google Maps`, `Revisado`

## Stack

- Next.js 16 (App Router) + TypeScript
- TailwindCSS
- PostgreSQL + Prisma
- Leaflet + OpenStreetMap + Marker clustering
- pnpm
- Docker Compose (Postgres)

## Configuración rápida

1. Copia variables de entorno:

```bash
cp .env.example .env
```

2. Levanta Postgres:

```bash
docker-compose up -d
```

3. Instala dependencias:

```bash
pnpm i
```

4. Ejecuta migraciones:

```bash
pnpm db:migrate
```

5. Carga CSV en la base de datos:

```bash
pnpm db:seed
```

Nota: la primera carga puede tardar porque geocodifica registros sin coordenadas. Puedes bajar/subir el volumen por corrida con `GEOCODING_MAX_REQUESTS`.

6. Arranca en desarrollo:

```bash
pnpm dev
```

App disponible en [http://localhost:3000](http://localhost:3000).

## Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm db:migrate`
- `pnpm db:seed`

## Endpoints

- `GET /api/producers?query=&city=&category=&subcategory=&bbox=&page=`
- `GET /api/producers/[id]`
- `GET /api/taxonomy`

Formato de `bbox`: `minLng,minLat,maxLng,maxLat`.

## Comportamiento de datos

- La importación normaliza strings (`trim`, espacios múltiples).
- Deduplicación por clave única razonable: `name + city + address`.
- Si `Google Maps` contiene coordenadas, se guardan en `latitude/longitude`.
- Si faltan coordenadas, el seed intenta geocodificar dirección/ciudad con Nominatim (OpenStreetMap).
- Si no encuentra una dirección concreta, aplica fallback por ciudad para maximizar cobertura de puntos.
- La geocodificación usa caché persistente en tabla `GeocodeCache` para no repetir consultas entre seeds.
- Regla estricta: solo se aceptan coordenadas dentro de la provincia de Barcelona (`GEOCODING_STRICT_BARCELONA_BOUNDS=true`).
- `GEOCODING_MAX_REQUESTS` controla cuántas consultas remotas hacer por ejecución (`800` por defecto en `.env.example`).
- Si faltan coordenadas, el productor sigue apareciendo en listados y fichas.
