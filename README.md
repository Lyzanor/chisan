# Km0 Mapa de Productores

Web mapa-first (Next.js + Prisma + PostgreSQL + Leaflet) cuyo contenido proviene 100% de `Km0-productores.csv`.
El mapa está acotado a la provincia de Barcelona y el buscador principal prioriza ciudad y categoría.

## Rutas principales

- `/`: portada simplificada con buscador + filtros + mapa (sin listado).
- `/buscar`: buscador con listado de resultados (sin mapa).
- `/p/[id|slug]`: ficha detallada de productor.

## Columnas detectadas en el CSV

`nombre`, `-- municipio`, `categoria`, `subcategoria`, `direccion`, `descripcion`, `horario`, `telefono`, `correo`, `web`, `Facebook`, `Instagram`, `Google Maps`, `lat`, `lon`, `Revisado`

## Stack

- Next.js 16 (App Router) + TypeScript
- TailwindCSS
- PostgreSQL + Prisma
- Leaflet + OpenStreetMap / MapTiler
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

3. Activa pnpm (si no lo tienes en el sistema):

```bash
corepack enable
```

Si no puedes activar pnpm globalmente (permisos), usa `npx pnpm` en todos los comandos.

4. Instala dependencias:

```bash
pnpm i
```

5. Ejecuta migraciones:

```bash
pnpm db:migrate
```

6. Carga CSV en la base de datos:

```bash
pnpm db:seed
```

Nota: la primera carga puede tardar porque geocodifica registros sin coordenadas. Puedes bajar/subir el volumen por corrida con `GEOCODING_MAX_REQUESTS`.

7. Arranca en desarrollo:

```bash
pnpm dev
```

App disponible en [http://localhost:3000](http://localhost:3000).

## Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm verify` (lint + build)
- `pnpm db:migrate`
- `pnpm db:seed`

## Endpoints

- `GET /api/producers?query=&city=&category=&subcategory=&bbox=&page=&pageSize=`
- `GET /api/producers/[id]`
- `GET /api/taxonomy`

Formato de `bbox`: `minLng,minLat,maxLng,maxLat`.

## Comportamiento de datos

- La importación normaliza strings (`trim`, espacios múltiples).
- Deduplicación por clave única razonable: `name + city + address`.
- Prioridad de coordenadas en seed: columnas `lat/lon` del CSV → coordenadas en `Google Maps` → geocoding de dirección/ciudad.
- Si faltan coordenadas tras ese proceso, el seed intenta geocodificar dirección/ciudad con Nominatim (OpenStreetMap).
- Si no encuentra una dirección concreta, aplica fallback por ciudad para maximizar cobertura de puntos.
- La geocodificación usa caché persistente en tabla `GeocodeCache` para no repetir consultas entre seeds.
- Regla estricta: solo se aceptan coordenadas dentro de la provincia de Barcelona (`GEOCODING_STRICT_BARCELONA_BOUNDS=true`).
- `GEOCODING_MAX_REQUESTS` controla cuántas consultas remotas hacer por ejecución (`800` por defecto en `.env.example`).
- Si faltan coordenadas, el productor sigue apareciendo en listados y fichas.

Opcional para API: `GET /api/producers` acepta `includeNoCoordinates=true|false` (por defecto `true`) para incluir o excluir registros sin lat/lon en el listado.

## Proveedor de mapa (sin tocar código)

La app está desacoplada por configuración:
- Capa de `tiles` (mapa principal y mini mapa de ficha)
- Link externo de mapa en la ficha
- Geocoding del seed (independiente del proveedor visual)

Variables clave:
- `NEXT_PUBLIC_MAP_PROVIDER` (`osm` o `maptiler`)
- `NEXT_PUBLIC_MAPTILER_KEY` (obligatoria si usas MapTiler)
- `NEXT_PUBLIC_MAPTILER_STYLE` (ej. `streets-v2`)
- `NEXT_PUBLIC_MAP_TILE_URL` (override manual opcional)
- `NEXT_PUBLIC_MAP_ATTRIBUTION`
- `NEXT_PUBLIC_MAP_VIEW_URL_TEMPLATE` (opcional, para sobreescribir link externo)
- `GEOCODING_PROVIDER` (actualmente `nominatim`)
- `GEOCODING_BASE_URL` (opcional)

Template opcional de link externo admite placeholders:
- `{lat}`, `{lon}`, `{query}` (URL encoded), `{query_raw}`

Configuración mínima MapTiler en `.env`:
- `NEXT_PUBLIC_MAP_PROVIDER=maptiler`
- `NEXT_PUBLIC_MAPTILER_KEY=TU_API_KEY`
- `NEXT_PUBLIC_MAPTILER_STYLE=streets-v2`

## Subir a GitHub / Deploy Checklist

1. Incluye en el repo:
- Código fuente
- `prisma/schema.prisma`
- `prisma/migrations/*`
- `prisma/seed.ts`
- `docker-compose.yml`
- `.env.example`
- `README.md`
- `pnpm-lock.yaml`

2. No subas secretos:
- No commitear `.env`
- Si el proveedor nuevo requiere API key, dejar solo placeholders en `.env.example`
- Configura claves reales únicamente como variables de entorno del proveedor de deploy (Vercel/Render/Railway/etc.)
- Verifica antes de hacer push: `git status --short` (no debe aparecer `.env`)

3. Arranque tras clonar:
- `docker-compose up -d`
- `corepack enable`
- `pnpm i`
- `pnpm db:migrate`
- `pnpm db:seed`
- `pnpm dev`

4. Producción:
- Base PostgreSQL accesible
- Variables de entorno configuradas
- Ejecutar `pnpm db:migrate` en deploy

Variables mínimas recomendadas en deploy:
- `DATABASE_URL`
- `NEXT_PUBLIC_MAP_PROVIDER=maptiler`
- `NEXT_PUBLIC_MAPTILER_KEY`
- `NEXT_PUBLIC_MAPTILER_STYLE=streets-v2`

## Operación recomendada: Vercel + Supabase

1. Configura en Vercel (entorno `Production`):
- `DATABASE_URL` (Supabase pooler, con `pgbouncer=true&sslmode=require`)
- `NEXT_PUBLIC_MAP_PROVIDER=maptiler`
- `NEXT_PUBLIC_MAP_PROVIDER_LABEL=MapTiler`
- `NEXT_PUBLIC_MAPTILER_KEY`
- `NEXT_PUBLIC_MAPTILER_STYLE=streets-v2`

2. Antes de cada deploy relevante:
```bash
pnpm verify
```

3. Si cambias schema Prisma:
```bash
pnpm db:migrate
```
Ejecuta migraciones contra la base de producción antes o durante el despliegue.
