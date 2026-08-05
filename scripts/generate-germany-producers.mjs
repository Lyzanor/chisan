import fs from 'node:fs/promises';
import path from 'node:path';

const TARGET_COUNT = 500;
const COUNTRY_CODE = 'DE';
const COUNTRY_SLUG = 'de';
const CANONICAL_HEADER = [
  'slug', 'nombre', 'municipio', 'categoria', 'productos estrella', 'direccion',
  'descripcion', 'horario', 'telefono', 'correo', 'web', 'Facebook', 'Instagram',
  'Google Maps', 'lat', 'lon', 'imagen', 'verificacion', 'Venta online', 'Canal de venta'
];

const STATES = [
  { code: 'DE-BW', slug: 'baden-wuerttemberg', label: 'Baden-Württemberg', quota: 45 },
  { code: 'DE-BY', slug: 'bayern', label: 'Bayern', quota: 70 },
  { code: 'DE-BE', slug: 'berlin', label: 'Berlin', quota: 8 },
  { code: 'DE-BB', slug: 'brandenburg', label: 'Brandenburg', quota: 25 },
  { code: 'DE-HB', slug: 'bremen', label: 'Bremen', quota: 5 },
  { code: 'DE-HH', slug: 'hamburg', label: 'Hamburg', quota: 6 },
  { code: 'DE-HE', slug: 'hessen', label: 'Hessen', quota: 35 },
  { code: 'DE-MV', slug: 'mecklenburg-vorpommern', label: 'Mecklenburg-Vorpommern', quota: 20 },
  { code: 'DE-NI', slug: 'niedersachsen', label: 'Niedersachsen', quota: 45 },
  { code: 'DE-NW', slug: 'nordrhein-westfalen', label: 'Nordrhein-Westfalen', quota: 65 },
  { code: 'DE-RP', slug: 'rheinland-pfalz', label: 'Rheinland-Pfalz', quota: 40 },
  { code: 'DE-SL', slug: 'saarland', label: 'Saarland', quota: 8 },
  { code: 'DE-SN', slug: 'sachsen', label: 'Sachsen', quota: 35 },
  { code: 'DE-ST', slug: 'sachsen-anhalt', label: 'Sachsen-Anhalt', quota: 25 },
  { code: 'DE-SH', slug: 'schleswig-holstein', label: 'Schleswig-Holstein', quota: 35 },
  { code: 'DE-TH', slug: 'thueringen', label: 'Thüringen', quota: 33 }
];
const STATE_BY_CODE = new Map(STATES.map((state) => [state.code, state]));

const OVERPASS_QUERY = `[out:json][timeout:600];
area["ISO3166-1"="DE"][admin_level=2]->.de;
(
  nwr(area.de)["shop"="farm"]["name"];
  nwr(area.de)["craft"~"^(beekeeper|winery|brewery|cheese|dairy|oil_mill|distillery|bakery|confectionery|butcher)$"]["name"];
);
out tags center qt;`;

const OVERPASS_ENDPOINTS = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://overpass.nchc.org.tw/api/interpreter'
];

const BOUNDARY_URLS = [
  'https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/main/2_bundeslaender/4_niedrig.geo.json',
  'https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/master/2_bundeslaender/4_niedrig.geo.json'
];

const CATEGORY_RULES = [
  { category: 'Miel', products: 'Honig', re: /\b(beekeeper|apiary|bienen?|imker|honig|met)\b/i },
  { category: 'Vino', products: 'Wein', re: /\b(winery|weingut|weinbau|winzer|wein|sekt|vinothek)\b/i },
  { category: 'Cerveza', products: 'Bier', re: /\b(brewery|brauerei|brauhaus|bier|hopfen)\b/i },
  { category: 'Lácteos y quesos', products: 'Käse und Milchprodukte', re: /\b(cheese|dairy|käse|kaese|milch|molkerei|joghurt|quark|ziegenkäse|schafskäse)\b/i },
  { category: 'Aceite', products: 'Öl', re: /\b(oil_mill|ölmühle|oelmuehle|speiseöl|rapsöl|leinöl|öl)\b/i },
  { category: 'Destilados y licores', products: 'Spirituosen und Liköre', re: /\b(distillery|brennerei|destillerie|schnaps|likör|likoer|spirituosen|obstbrand)\b/i },
  { category: 'Pan y cereal', products: 'Brot und Getreide', re: /\b(bakery|bäckerei|baeckerei|backstube|brot|mehl|mühle|muehle|getreide|nudel|pasta)\b/i },
  { category: 'Chocolate', products: 'Schokolade', re: /\b(chocolate|schokolade|chocolatier|kakao)\b/i },
  { category: 'Dulces y repostería', products: 'Süßwaren und Gebäck', re: /\b(confectionery|konditorei|praline|bonbon|kuchen|torte|gebäck|gebaeck|süß|suess)\b/i },
  { category: 'Carne', products: 'Fleisch und Wurst', re: /\b(butcher|metzgerei|hofmetzgerei|fleisch|wurst|rind|schwein|lamm|wild|geflügel|gefluegel|pute)\b/i },
  { category: 'Huevos', products: 'Eier', re: /\b(egg|eggs|eier|hühner|huehner|freilandei)\b/i },
  { category: 'Pescado', products: 'Fisch', re: /\b(fisch|forelle|karpfen|aal|lachs|fish)\b/i },
  { category: 'Setas', products: 'Pilze', re: /\b(pilz|pilze|champignon|trüffel|trueffel|mushroom)\b/i },
  { category: 'Frutos secos', products: 'Nüsse', re: /\b(nuss|nüsse|nuesse|haselnuss|walnuss|mandel)\b/i },
  { category: 'Condimentos', products: 'Kräuter und Gewürze', re: /\b(kräuter|kraeuter|gewürz|gewuerz|salz|senf|sauce|chili)\b/i },
  { category: 'Té e infusiones', products: 'Tee und Kräuteraufgüsse', re: /\b(tee|teegarten|kräutertee|kraeutertee)\b/i },
  { category: 'Sidra', products: 'Apfelwein und Cider', re: /\b(cider|cidre|apfelwein|mosterei|most)\b/i },
  { category: 'Bebidas sin alcohol', products: 'Säfte', re: /\b(saftpresse|saft|fruchtsaft|limonade|mosterei)\b/i },
  { category: 'Fruta y verdura', products: 'Obst und Gemüse', re: /\b(obst|gemüse|gemuese|spargel|erdbeer|beere|apfel|äpfel|aepfel|kirsche|kartoffel|hofgarten|gärtnerei|gaertnerei|landgemüse)\b/i },
  { category: 'Legumbres y cereales', products: 'Hülsenfrüchte und Getreide', re: /\b(hülsenfrucht|huelsenfrucht|linse|bohne|erbse|kichererbse|getreide)\b/i },
  { category: 'Conservas', products: 'Konfitüren und Eingemachtes', re: /\b(marmelade|konfitüre|konfituere|eingemacht|chutney|konserve)\b/i },
  { category: 'Helados', products: 'Eis', re: /\b(eis|eismanufaktur|ice_cream)\b/i }
];

const GENERIC_NAMES = new Set([
  'hofladen', 'biohofladen', 'bauernladen', 'farm shop', 'farmshop', 'direktvermarktung',
  'selbstbedienung', 'verkaufsautomat', 'milchtankstelle', 'milchautomat', 'eierautomat',
  'regiomat', 'dorfladen', 'bioladen', 'landmarkt'
]);

function collapse(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function firstTag(tags, keys) {
  for (const key of keys) {
    const value = collapse(tags[key]);
    if (value) return value;
  }
  return '';
}

function germanAscii(value) {
  return collapse(value)
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/Ä/g, 'Ae').replace(/Ö/g, 'Oe').replace(/Ü/g, 'Ue')
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
}

function slugify(value) {
  return germanAscii(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function normalizeKey(value) {
  return germanAscii(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function csvEscape(value) {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(rows, headers) {
  return `${headers.map(csvEscape).join(',')}\n${rows.map((row) => headers.map((header) => csvEscape(row[header])).join(',')).join('\n')}\n`;
}

function makeUrl(value) {
  let url = collapse(value).split(';')[0].trim();
  if (!url) return '';
  if (/^www\./i.test(url)) url = `https://${url}`;
  if (!/^https?:\/\//i.test(url)) return '';
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return '';
    return parsed.toString();
  } catch {
    return '';
  }
}

function normalizePhone(value) {
  const raw = collapse(value).split(/[;|]/)[0].trim();
  if (!raw) return '';
  let normalized = raw.replace(/\b(?:ext\.?|extension|durchwahl)\b.*$/i, '').trim();
  normalized = normalized.replace(/^00/, '+');
  if (normalized.startsWith('+')) {
    let digits = normalized.slice(1).replace(/\D/g, '');
    if (digits.startsWith('490')) digits = `49${digits.slice(3)}`;
    const result = `+${digits}`;
    return /^\+\d{7,15}$/.test(result) ? result : '';
  }
  const digits = normalized.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0')) {
    const result = `+49${digits.slice(1)}`;
    return /^\+\d{7,15}$/.test(result) ? result : '';
  }
  const result = digits.startsWith('49') ? `+${digits}` : `+49${digits}`;
  return /^\+\d{7,15}$/.test(result) ? result : '';
}

function normalizeEmail(value) {
  const raw = collapse(value).split(/[;,|]/)[0].trim().toLowerCase();
  return /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(raw) ? raw : '';
}

function socialUrl(value, network) {
  const raw = collapse(value).split(';')[0].trim();
  if (!raw) return '';
  const asUrl = makeUrl(raw);
  if (asUrl) return asUrl;
  const handle = raw.replace(/^@/, '').replace(/^\/+|\/+$/g, '');
  if (!handle || /\s/.test(handle)) return '';
  return network === 'facebook'
    ? `https://www.facebook.com/${handle}`
    : `https://www.instagram.com/${handle}`;
}

function elementPoint(element) {
  if (Number.isFinite(element.lat) && Number.isFinite(element.lon)) return [element.lon, element.lat];
  if (Number.isFinite(element.center?.lat) && Number.isFinite(element.center?.lon)) return [element.center.lon, element.center.lat];
  return null;
}

function pointInRing([x, y], ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects = ((yi > y) !== (yj > y)) &&
      (x < ((xj - xi) * (y - yi)) / ((yj - yi) || Number.EPSILON) + xi);
    if (intersects) inside = !inside;
  }
  return inside;
}

function pointInPolygon(point, polygon) {
  if (!polygon?.length || !pointInRing(point, polygon[0])) return false;
  for (let i = 1; i < polygon.length; i += 1) {
    if (pointInRing(point, polygon[i])) return false;
  }
  return true;
}

function pointInGeometry(point, geometry) {
  if (!geometry) return false;
  if (geometry.type === 'Polygon') return pointInPolygon(point, geometry.coordinates);
  if (geometry.type === 'MultiPolygon') return geometry.coordinates.some((polygon) => pointInPolygon(point, polygon));
  return false;
}

function assignState(point, boundaries) {
  for (const feature of boundaries.features) {
    const code = feature.properties?.id;
    if (STATE_BY_CODE.has(code) && pointInGeometry(point, feature.geometry)) return STATE_BY_CODE.get(code);
  }
  return null;
}

function categoryFor(tags, name) {
  const haystack = [
    tags.craft, tags.shop, tags.product, tags.produce, tags['shop:product'], tags.vending,
    tags.description, tags.operator, name
  ].filter(Boolean).join(' ');
  for (const rule of CATEGORY_RULES) {
    if (rule.re.test(haystack)) return { category: rule.category, products: rule.products };
  }
  return { category: 'Otros', products: '' };
}

function municipalityFor(tags) {
  let municipality = firstTag(tags, [
    'addr:city', 'contact:city', 'addr:place', 'addr:municipality', 'is_in:city', 'is_in:town', 'is_in:village', 'is_in'
  ]);
  if (municipality.includes(',')) municipality = municipality.split(',')[0].trim();
  return municipality;
}

function addressFor(tags, municipality) {
  const street = firstTag(tags, ['addr:street', 'addr:place']);
  const number = collapse(tags['addr:housenumber']);
  const postcode = collapse(tags['addr:postcode']);
  const locality = municipality || collapse(tags['addr:city']);
  const parts = [];
  const line1 = collapse([street, number].filter(Boolean).join(' '));
  const line2 = collapse([postcode, locality].filter(Boolean).join(' '));
  if (line1) parts.push(line1);
  if (line2 && normalizeKey(line2) !== normalizeKey(line1)) parts.push(line2);
  return parts.join(', ');
}

function objectSourceUrl(element) {
  return `https://www.openstreetmap.org/${element.type}/${element.id}`;
}

function recordScore(record) {
  let score = 0;
  if (record.web) score += 8;
  if (record.Facebook || record.Instagram) score += 2;
  if (record.correo) score += 2;
  if (record.telefono) score += 2;
  if (record.direccion) score += 3;
  if (record.categoria !== 'Otros') score += 4;
  if (record.osmKind === 'farm') score += 3;
  if (record.organic === 'only' || record.organic === 'yes') score += 1;
  if (record.checkDate && /^202[5-9]-/.test(record.checkDate)) score += 1;
  return score;
}

async function fetchJsonWithRetry(url, options = {}, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 720_000);
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, attempt * 4_000));
    }
  }
  throw lastError;
}

async function fetchBoundaries() {
  const errors = [];
  for (const url of BOUNDARY_URLS) {
    try {
      const data = await fetchJsonWithRetry(url, { headers: { 'user-agent': 'km0-germany-dataset/1.0' }, timeoutMs: 120_000 }, 2);
      if (data?.type === 'FeatureCollection' && data.features?.length >= 16) return { data, url };
      errors.push(`${url}: invalid feature collection`);
    } catch (error) {
      errors.push(`${url}: ${error.message}`);
    }
  }
  throw new Error(`Unable to fetch German state boundaries: ${errors.join(' | ')}`);
}

async function fetchOverpass() {
  const errors = [];
  const body = new URLSearchParams({ data: OVERPASS_QUERY });
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const data = await fetchJsonWithRetry(endpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'user-agent': 'km0-germany-dataset/1.0 (OpenStreetMap direct-marketer export)'
        },
        body,
        timeoutMs: 720_000
      }, 2);
      if (!Array.isArray(data?.elements) || data.elements.length < TARGET_COUNT) {
        throw new Error(`only ${data?.elements?.length ?? 0} elements returned`);
      }
      return { data, endpoint };
    } catch (error) {
      errors.push(`${endpoint}: ${error.message}`);
    }
  }
  throw new Error(`All Overpass endpoints failed: ${errors.join(' | ')}`);
}

function buildCandidate(element, boundaries) {
  const point = elementPoint(element);
  const tags = element.tags ?? {};
  if (!point) return null;
  const state = assignState(point, boundaries);
  if (!state) return null;

  let name = collapse(tags.name);
  const operator = collapse(tags.operator);
  if (!name) return null;
  if (GENERIC_NAMES.has(normalizeKey(name)) && operator && normalizeKey(operator) !== normalizeKey(name)) name = operator;
  if (GENERIC_NAMES.has(normalizeKey(name))) return null;

  const municipality = municipalityFor(tags);
  if (!municipality || municipality.length < 2) return null;

  const { category, products } = categoryFor(tags, name);
  const [lon, lat] = point;
  const web = makeUrl(firstTag(tags, ['website', 'contact:website', 'url']));
  const facebook = socialUrl(firstTag(tags, ['contact:facebook', 'facebook']), 'facebook');
  const instagram = socialUrl(firstTag(tags, ['contact:instagram', 'instagram']), 'instagram');
  const osmKind = tags.craft || (tags.shop === 'farm' ? 'farm' : 'other');
  const osmId = `${element.type}/${element.id}`;
  const candidate = {
    slug: '',
    nombre: name,
    municipio: municipality,
    categoria: category,
    'productos estrella': products,
    direccion: addressFor(tags, municipality),
    descripcion: '',
    horario: collapse(tags.opening_hours),
    telefono: normalizePhone(firstTag(tags, ['phone', 'contact:phone', 'mobile', 'contact:mobile'])),
    correo: normalizeEmail(firstTag(tags, ['email', 'contact:email'])),
    web,
    Facebook: facebook,
    Instagram: instagram,
    'Google Maps': `https://www.google.com/maps?q=${lat.toFixed(6)},${lon.toFixed(6)}`,
    lat: lat.toFixed(6),
    lon: lon.toFixed(6),
    imagen: '',
    verificacion: 'parcial',
    'Venta online': 'no comprobado',
    'Canal de venta': '',
    region: state.label,
    region_codigo: state.code,
    region_slug: state.slug,
    pais: 'Alemania',
    pais_codigo: COUNTRY_CODE,
    osm_id: osmId,
    fuente_url: objectSourceUrl(element),
    osmKind,
    organic: collapse(tags.organic),
    checkDate: collapse(tags.check_date || tags['check_date:shop']),
    sourceTags: [tags.product, tags.produce, tags.description].filter(Boolean).join('; ')
  };
  candidate.score = recordScore(candidate);
  return candidate;
}

function deduplicate(candidates) {
  const byOsm = new Map();
  for (const candidate of candidates) byOsm.set(candidate.osm_id, candidate);
  const byIdentity = new Map();
  for (const candidate of byOsm.values()) {
    const key = `${normalizeKey(candidate.nombre)}|${normalizeKey(candidate.municipio)}|${candidate.region_codigo}`;
    const existing = byIdentity.get(key);
    if (!existing || candidate.score > existing.score) byIdentity.set(key, candidate);
  }
  return [...byIdentity.values()];
}

function compareCandidates(a, b) {
  return b.score - a.score || a.region_codigo.localeCompare(b.region_codigo, 'de') ||
    a.municipio.localeCompare(b.municipio, 'de') || a.nombre.localeCompare(b.nombre, 'de') ||
    a.osm_id.localeCompare(b.osm_id);
}

function selectBalanced(candidates) {
  const groups = new Map(STATES.map((state) => [state.code, []]));
  for (const candidate of candidates) groups.get(candidate.region_codigo)?.push(candidate);
  for (const rows of groups.values()) rows.sort(compareCandidates);

  const selected = [];
  const selectedIds = new Set();
  for (const state of STATES) {
    const rows = groups.get(state.code) ?? [];
    for (const row of rows.slice(0, Math.min(state.quota, rows.length))) {
      selected.push(row);
      selectedIds.add(row.osm_id);
    }
  }
  if (selected.length < TARGET_COUNT) {
    const remainder = candidates.filter((row) => !selectedIds.has(row.osm_id)).sort(compareCandidates);
    for (const row of remainder) {
      if (selected.length >= TARGET_COUNT) break;
      selected.push(row);
      selectedIds.add(row.osm_id);
    }
  }
  if (selected.length < TARGET_COUNT) throw new Error(`Only ${selected.length} eligible, deduplicated German producers were found`);
  return selected.slice(0, TARGET_COUNT);
}

function assignSlugs(records) {
  const usedByArea = new Map();
  for (const record of records) {
    if (!usedByArea.has(record.region_slug)) usedByArea.set(record.region_slug, new Set());
    const used = usedByArea.get(record.region_slug);
    const base = slugify(`${record.nombre}-${record.municipio}`) || `producer-${record.osm_id.replace(/\D/g, '')}`;
    let slug = base;
    if (used.has(slug)) slug = `${base}-${record.osm_id.replace(/\D/g, '').slice(-6)}`;
    let suffix = 2;
    while (used.has(slug)) slug = `${base}-${suffix++}`;
    used.add(slug);
    record.slug = slug;
  }
}

function appRow(record) {
  return Object.fromEntries(CANONICAL_HEADER.map((header) => [header, record[header] ?? '']));
}

function userRow(record, extractionDate) {
  return {
    nombre: record.nombre,
    pais: record.pais,
    pais_codigo: record.pais_codigo,
    region: record.region,
    region_codigo: record.region_codigo,
    municipio: record.municipio,
    categoria: record.categoria,
    productos: record['productos estrella'],
    direccion: record.direccion,
    horario: record.horario,
    telefono: record.telefono,
    correo: record.correo,
    web: record.web,
    facebook: record.Facebook,
    instagram: record.Instagram,
    google_maps: record['Google Maps'],
    lat: record.lat,
    lon: record.lon,
    osm_id: record.osm_id,
    fuente_url: record.fuente_url,
    fecha_extraccion: extractionDate,
    verificacion: record.verificacion,
    venta_online: record['Venta online']
  };
}

function countBy(records, key) {
  const counts = {};
  for (const record of records) counts[record[key]] = (counts[record[key]] ?? 0) + 1;
  return Object.fromEntries(Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'es')));
}

async function ensureCleanGermanyOutput() {
  await fs.rm(path.join('data', 'csv', COUNTRY_SLUG), { recursive: true, force: true });
  await fs.mkdir(path.join('data', 'csv', COUNTRY_SLUG), { recursive: true });
  await fs.mkdir('exports', { recursive: true });
}

async function writeOutputs(records, metadata) {
  await ensureCleanGermanyOutput();
  const extractionDate = new Date().toISOString().slice(0, 10);

  const countryManifest = {
    label: 'Germany',
    unit: { one: 'federal state', many: 'federal states' },
    regionUnit: { one: 'federal state', many: 'federal states' },
    aliases: {
      'baden-wurttemberg': 'baden-wuerttemberg',
      thuringen: 'thueringen'
    },
    regions: STATES.map((state) => ({
      slug: state.slug,
      label: state.label,
      areas: [{ slug: state.slug, label: state.label }]
    }))
  };
  await fs.writeFile(path.join('data', 'csv', COUNTRY_SLUG, 'country.json'), `${JSON.stringify(countryManifest, null, 2)}\n`, 'utf8');

  const germanyGuide = `# Germany data guide\n\n- Catalog hierarchy: country → Bundesland → Bundesland. Each federal state is represented by one area CSV so the existing country/region/area contract remains unchanged.\n- Producer discovery source for this initial 500-row import: OpenStreetMap records tagged as named \`shop=farm\` or named producer crafts (beekeeper, winery, brewery, dairy/cheese, oil mill, distillery, bakery, confectionery, butcher).\n- Categories are mapped onto the repository-wide controlled category list; do not add Germany-only labels.\n- New rows start at \`verificacion=parcial\` and \`Venta online=no comprobado\`. OSM confirms a public listing, not complete editorial verification or online-sales status.\n- Names and municipalities retain German spelling. Slugs transliterate umlauts as ae/oe/ue and ß as ss.\n- OpenStreetMap data is available under ODbL 1.0 and requires attribution to OpenStreetMap contributors.\n`;
  await fs.writeFile(path.join('data', 'csv', COUNTRY_SLUG, 'AGENTS.md'), germanyGuide, 'utf8');

  for (const state of STATES) {
    const stateRows = records
      .filter((record) => record.region_codigo === state.code)
      .sort((a, b) => a.municipio.localeCompare(b.municipio, 'de') || a.nombre.localeCompare(b.nombre, 'de'))
      .map(appRow);
    const dir = path.join('data', 'csv', COUNTRY_SLUG, state.slug);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, `${state.slug}.csv`), toCsv(stateRows, CANONICAL_HEADER), 'utf8');
  }

  const userHeaders = [
    'nombre', 'pais', 'pais_codigo', 'region', 'region_codigo', 'municipio', 'categoria', 'productos',
    'direccion', 'horario', 'telefono', 'correo', 'web', 'facebook', 'instagram', 'google_maps',
    'lat', 'lon', 'osm_id', 'fuente_url', 'fecha_extraccion', 'verificacion', 'venta_online'
  ];
  const userRows = records
    .slice()
    .sort((a, b) => a.region.localeCompare(b.region, 'de') || a.municipio.localeCompare(b.municipio, 'de') || a.nombre.localeCompare(b.nombre, 'de'))
    .map((record) => userRow(record, extractionDate));
  await fs.writeFile(path.join('exports', 'productores_km0_alemania_500.csv'), toCsv(userRows, userHeaders), 'utf8');

  const quality = {
    generated_at: new Date().toISOString(),
    source: 'OpenStreetMap via Overpass API',
    source_endpoint: metadata.overpassEndpoint,
    source_query: OVERPASS_QUERY,
    state_boundaries: metadata.boundaryUrl,
    license: 'OpenStreetMap data © OpenStreetMap contributors, ODbL 1.0',
    total: records.length,
    unique_osm_ids: new Set(records.map((row) => row.osm_id)).size,
    unique_area_slugs: new Set(records.map((row) => `${row.region_slug}/${row.slug}`)).size,
    rows_with_municipality: records.filter((row) => row.municipio).length,
    rows_with_coordinates: records.filter((row) => row.lat && row.lon).length,
    rows_with_official_web: records.filter((row) => row.web).length,
    rows_with_any_public_link: records.filter((row) => row.web || row.Facebook || row.Instagram || row['Google Maps']).length,
    rows_with_full_address: records.filter((row) => row.direccion).length,
    regions: countBy(records, 'region'),
    categories: countBy(records, 'categoria'),
    notes: [
      'This is a discovery/import dataset, not a formal km0 certification register.',
      'All records are direct-marketer or producer-craft listings in OpenStreetMap and should receive an editorial spot-check before production publication.',
      'Website values are included only when present in the public OSM record; missing web does not imply the producer has no website.'
    ]
  };
  await fs.writeFile(path.join('exports', 'calidad_productores_km0_alemania_500.json'), `${JSON.stringify(quality, null, 2)}\n`, 'utf8');

  const readme = `# 500 productores locales de Alemania\n\n- Archivo principal: \`productores_km0_alemania_500.csv\`\n- Filas: ${records.length}\n- Fuente: OpenStreetMap, consultada mediante Overpass API el ${extractionDate}.\n- Cobertura web oficial en OSM: ${quality.rows_with_official_web}/${records.length}.\n- Datos para la app: \`data/csv/de/<bundesland>/<bundesland>.csv\`, con el encabezado canónico de 20 columnas.\n- Licencia de los datos de origen: © OpenStreetMap contributors, ODbL 1.0.\n\nLos registros se han deduplicado por objeto OSM y por nombre + municipio + estado. Se han priorizado fichas con web, dirección y categoría específica. \`verificacion=parcial\` indica que la fuente confirma una ficha pública, pero no sustituye una revisión editorial individual.\n`;
  await fs.writeFile(path.join('exports', 'README_productores_km0_alemania_500.md'), readme, 'utf8');

  return quality;
}

async function main() {
  console.log('Fetching German state boundaries…');
  const boundaries = await fetchBoundaries();
  console.log('Fetching named German direct marketers and producer crafts from Overpass…');
  const overpass = await fetchOverpass();
  console.log(`Overpass returned ${overpass.data.elements.length} elements.`);

  const candidates = overpass.data.elements
    .map((element) => buildCandidate(element, boundaries.data))
    .filter(Boolean);
  const deduped = deduplicate(candidates);
  console.log(`${candidates.length} eligible candidates; ${deduped.length} after deduplication.`);

  const selected = selectBalanced(deduped);
  assignSlugs(selected);
  const quality = await writeOutputs(selected, {
    overpassEndpoint: overpass.endpoint,
    boundaryUrl: boundaries.url
  });

  if (quality.total !== TARGET_COUNT || quality.unique_osm_ids !== TARGET_COUNT || quality.unique_area_slugs !== TARGET_COUNT) {
    throw new Error(`Quality gate failed: ${JSON.stringify(quality)}`);
  }
  console.log(JSON.stringify(quality, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
