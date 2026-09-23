import type { CatalogSourceFigures } from "../catalog/source-figures";
import type { Locale } from "./locales";

export type PublicPageLocale = "en" | "es";

export function resolvePublicPageLocale(locale: Locale | null): PublicPageLocale {
  return locale === "es" ? "es" : "en";
}

type PublicSource = {
  name: string;
  url: string;
};

/**
 * Databases named on How Chisan works, grouped by the role they play in
 * research. Names keep their official spelling; the figures shown beside them
 * describe this country's catalog.
 */
export const HOW_CHISAN_WORKS_SOURCES = {
  country: "es",
  groups: {
    registries: [
      {
        name: "Registro General Sanitario de Empresas Alimentarias y Alimentos (AESAN)",
        url: "https://rgsa-web-aesan.mscbs.es/rgsa/formulario_principal_js.jsp",
      },
      {
        name: "Productors adherits a la venda de proximitat (Generalitat de Catalunya)",
        url: "https://analisi.transparenciacatalunya.cat/d/xmyy-7xqi",
      },
      {
        name: "Indústries agroalimentàries de Catalunya (Generalitat de Catalunya)",
        url: "https://analisi.transparenciacatalunya.cat/d/p28j-xe65",
      },
      {
        name: "Registro de Venta Directa de Castilla-La Mancha",
        url: "https://registroventadirecta.castillalamancha.es/",
      },
      {
        name: "Venta directa (Govern de les Illes Balears)",
        url: "https://www.caib.es/sites/vendadirecta/",
      },
      {
        name: "Registro de Artesanos Alimentarios (Junta de Castilla y León)",
        url: "https://analisis.datosabiertos.jcyl.es/explore/dataset/registro-de-artesanos-alimentarios/",
      },
      {
        name: "Artesanía alimentaria (Gobierno de Aragón)",
        url: "https://www.aragon.es/calidad-agroalimentaria/figuras-de-calidad-diferenciada/artesania-alimentaria",
      },
      {
        name: "Boletín Oficial del Registro Mercantil (BORME)",
        url: "https://www.boe.es/diario_borme/",
      },
    ],
    certification: [
      { name: "DOCa Rioja", url: "https://riojawine.com/es/" },
      { name: "D.O. Cava", url: "https://www.cava.wine/es/" },
      {
        name: "Consell Regulador de la DOQ Priorat",
        url: "https://www.doqpriorat.org/",
      },
      {
        name: "IGP Faba Asturiana",
        url: "https://faba-asturiana.org/comercializacion/productores-de-venta-primaria/",
      },
      { name: "COPAE (Asturias)", url: "https://www.copaeastur.org/directorio/" },
      {
        name: "CBPAE (Illes Balears)",
        url: "https://www.cbpae.org/directori-ecologic/",
      },
      {
        name: "CRAEGA (Galicia)",
        url: "https://www.craega.es/es/buscador-de-productores/",
      },
      {
        name: "TRACES NT (Comisión Europea)",
        url: "https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/index",
      },
    ],
    territory: [
      {
        name: "Cooperativas Agro-alimentarias de España",
        url: "https://www.agro-alimentarias.coop/cooperativas",
      },
      {
        name: "Tierra de Sabor (Castilla y León)",
        url: "https://www.tierradesabor.es/",
      },
      { name: "Reyno Gourmet (Navarra)", url: "https://reynogourmet.com/empresas/" },
      {
        name: "Venta directa y de proximidad de Navarra",
        url: "https://localtokikoa.navarra.es/",
      },
      { name: "Gastroteca (Catalunya)", url: "https://www.gastroteca.cat/" },
      {
        name: "Pon Aragón en tu mesa",
        url: "https://ponaragonentumesa.com/directorio/",
      },
      {
        name: "Catálogo de Productores Locales de la Provincia de Badajoz",
        url: "https://catalogoproductoslocales.dip-badajoz.es/",
      },
      {
        name: "Sabores de la Provincia de Sevilla",
        url: "https://www.prodetur.es/prodetur/www/sabores/",
      },
    ],
    geography: [
      {
        name: "Base de Datos de Límites Jurisdiccionales de España (IGN)",
        url: "https://centrodedescargas.cnig.es/CentroDescargas/",
      },
      { name: "CartoCiudad", url: "https://www.cartociudad.es/" },
      {
        name: "Sede Electrónica del Catastro",
        url: "https://www.sedecatastro.gob.es/",
      },
      {
        name: "Institut Cartogràfic i Geològic de Catalunya",
        url: "https://www.icgc.cat/ca",
      },
      { name: "OpenStreetMap", url: "https://www.openstreetmap.org/" },
      { name: "Wikidata", url: "https://www.wikidata.org/" },
    ],
  },
} satisfies {
  country: string;
  groups: Record<string, PublicSource[]>;
};

type HowChisanWorksSourceGroup = keyof typeof HOW_CHISAN_WORKS_SOURCES.groups;

type HowChisanWorksCopy = {
  locale: PublicPageLocale;
  title: string;
  description: string;
  purposeLead: string;
  purposeOriginBefore: string;
  purposeOriginAfter: string;
  purposeBelief: string;
  processKicker: string;
  processTitle: string;
  processIntroduction: string;
  steps: readonly {
    title: string;
    description: string;
  }[];
  sourcesKicker: string;
  sourcesTitle: string;
  sourcesIntroduction: string;
  sourceFigures: Record<keyof CatalogSourceFigures, string>;
  sourceFiguresNote: string;
  sourceGroups: readonly {
    title: string;
    description: string;
    sources?: HowChisanWorksSourceGroup;
  }[];
  opensInNewTab: string;
  eligibilityKicker: string;
  eligibilityTitle: string;
  eligibilityIntroduction: string;
  eligibilityCriteria: readonly {
    title: string;
    description: string;
  }[];
  boundariesKicker: string;
  boundariesTitle: string;
  boundariesIntroduction: string;
  boundaries: readonly {
    title: string;
    description: string;
  }[];
  lifecycleKicker: string;
  lifecycleTitle: string;
  lifecycleParagraphs: readonly string[];
  trustKicker: string;
  trustTitle: string;
  trustIntroduction: string;
  trustPoints: readonly {
    title: string;
    description: string;
  }[];
  participationKicker: string;
  participationTitle: string;
  participationParagraphs: readonly string[];
  accessKicker: string;
  accessTitle: string;
  accessParagraphs: readonly string[];
  agentsKicker: string;
  agentsTitle: string;
  agentsIntroduction: string;
  agentsEndpointLabel: string;
  agentsTools: readonly {
    title: string;
    description: string;
  }[];
  agentsParagraphs: readonly string[];
  agentsOpenApi: string;
  agentsLlms: string;
  agentsPrivacy: string;
  closing: string;
  exploreCatalog: string;
  contact: string;
  account: string;
};

type AboutPrinciple = {
  title: string;
  description: string;
};

export type AboutCopy = {
  locale: PublicPageLocale;
  title: string;
  description: string;
  heroLead: string;
  heroParagraphs: readonly string[];
  founderKicker: string;
  founderTitle: string;
  founderLead: string;
  founderParagraphs: readonly string[];
  travelKicker: string;
  travelTitle: string;
  travelLead: string;
  travelParagraphs: readonly string[];
  technologyKicker: string;
  technologyTitle: string;
  technologyLead: string;
  technologyParagraphs: readonly string[];
  principlesKicker: string;
  principlesTitle: string;
  principlesLead: string;
  principles: readonly AboutPrinciple[];
  futureKicker: string;
  futureTitle: string;
  futureParagraphs: readonly string[];
  closing: string;
  exploreCatalog: string;
  howWeWorkLink: string;
  contactLink: string;
  linkedInUrl: string;
  linkedInLabel: string;
};

type ContactCopy = {
  locale: PublicPageLocale;
  title: string;
  description: string;
  introduction: string;
  channelsTitle: string;
  emailTitle: string;
  emailDescription: string;
  catalogTitle: string;
  catalogDescription: string;
  producerTitle: string;
  producerDescription: string;
  socialTitle: string;
  socialDescription: string;
  privacyTitle: string;
  privacyDescription: string;
  accountLink: string;
  privacyLink: string;
};

const HOW_CHISAN_WORKS = {
  en: {
    locale: "en",
    title: "How Chisan works",
    description:
      "How Chisan discovers, reviews, publishes and maintains a trustworthy public catalog of place-based food and drink producers.",
    purposeLead: "Local food systems are full of value, but too often fragmented.",
    purposeOriginBefore: "Inspired by ",
    purposeOriginAfter:
      " — local production for local consumption — Chisan exists to bring producers, products, availability and local demand into one connected network.",
    purposeBelief:
      "We believe better information creates stronger relationships: helping producers reach the right buyers, making local food easier to discover, and enabling communities to build more resilient food economies.",
    processKicker: "The catalog process",
    processTitle: "From a possible producer to a stable public profile",
    processIntroduction:
      "Chisan combines source-backed research with reviewed contributions. Publication is a deliberate editorial decision, not an automatic import or a popularity ranking.",
    steps: [
      {
        title: "Discover",
        description:
          "Public sources, producer contributions and community suggestions surface possible productive units. Each useful lead remains an area candidate — not a public profile — with its source, place clue and next unanswered question.",
      },
      {
        title: "Review",
        description:
          "For each candidate we resolve the public identity, productive place, material output, current own offer and overlap with the catalog. We then accept it, keep it in research with one concrete next question, route it, recognize an existing profile or close it with evidence.",
      },
      {
        title: "Publish",
        description:
          "Accepted facts are materialized in area CSV files. Decision evidence retains the sources relied on for admissions and closed outcomes; unresolved candidates remain research instead of becoming speculative profiles.",
      },
      {
        title: "Keep current",
        description:
          "Corrections, producer requests and catalog changes are reviewed before publication. No request made on the deployed website writes directly to the public catalog.",
      },
    ],
    sourcesKicker: "Sources and figures",
    sourcesTitle: "The databases behind the catalog",
    sourcesIntroduction:
      "No Chisan producer comes from a single database. We cross-check official registers, regulatory councils, regional directories and each producer's own channels, recording what each source supports and when we checked it.",
    sourceFigures: {
      producers: "published producers",
      municipalities: "municipalities with at least one producer",
      sourceReferences: "source references behind our decisions",
      websites: "distinct websites among those references",
    },
    sourceFiguresNote:
      "Figures for the Spanish catalog, calculated from its published profiles and editorial evidence whenever the website is updated.",
    sourceGroups: [
      {
        title: "Official registers and open data",
        description:
          "They confirm identities, authorized activities, addresses and closures. Each register supports only what it publishes: a food-safety registration does not show that a product is on sale today.",
        sources: "registries",
      },
      {
        title: "Designations of origin and organic production",
        description:
          "Regulatory councils and certification bodies publish who is registered and what they certify. They help us discover producers and check what they make.",
        sources: "certification",
      },
      {
        title: "Regional directories",
        description:
          "Regional and provincial quality marks, provincial councils and cooperatives lead us to producers in each district and help confirm where they work.",
        sources: "territory",
      },
      {
        title: "Maps and geographic references",
        description:
          "They place each productive unit in its municipality and on the map. A geocoder suggests locations; publishing a point remains an editorial decision.",
        sources: "geography",
      },
      {
        title: "Producers, press and community",
        description:
          "Each producer's websites, online shops and official social accounts show what it makes and offers today. Press, guides, food fairs and reviewed contributions bring new leads.",
      },
    ],
    opensInNewTab: "(opens in a new tab)",
    eligibilityKicker: "Catalog inclusion",
    eligibilityTitle: "Who can be part of Chisan",
    eligibilityIntroduction:
      "Chisan publishes active, place-based identities for food or drink producers. A productive unit qualifies only when every criterion is supported by current public evidence.",
    eligibilityCriteria: [
      {
        title: "A real public identity",
        description:
          "A person, business, cooperative or collective can be named and distinguished from similar entities.",
      },
      {
        title: "Material production",
        description:
          "It grows, raises, catches, harvests, extracts, mills, ferments, roasts, bakes, preserves, distils, prepares or otherwise materially makes food or drink for people.",
      },
      {
        title: "A current own offer",
        description:
          "At least one resulting product reaches the public under an identity that remains attributable to the producer.",
      },
      {
        title: "A productive place",
        description:
          "The actual production activity can be assigned to one catalog area and municipality. A public street address is optional.",
      },
      {
        title: "Connected evidence",
        description:
          "Public sources connect the identity, productive activity, offer and place. A source that proves one claim does not silently prove the rest.",
      },
      {
        title: "A current, distinct unit",
        description:
          "Current evidence supports its activity, and the same productive unit is not already represented by another profile.",
      },
    ],
    boundariesKicker: "Scope and evidence",
    boundariesTitle: "What does not prove production",
    boundariesIntroduction:
      "These signals may help discover or corroborate a producer, but none earns inclusion on its own.",
    boundaries: [
      {
        title: "Registers and distinctions",
        description:
          "Appearing in a registry, association, guide or map, or holding a seal or certification, is useful evidence only for the claims that source actually publishes.",
      },
      {
        title: "Commercial presence",
        description:
          "A shop, restaurant, café, office, market stall, sales channel or tasting room does not establish where or whether production occurs.",
      },
      {
        title: "Brand and popularity",
        description:
          "A brand mention, social profile, product listing or positive review does not identify a qualifying productive unit or determine editorial relevance.",
      },
      {
        title: "Resale and service",
        description:
          "Stocking, packing, branding, serving or reselling products made by others is not material production.",
      },
    ],
    lifecycleKicker: "Editorial lifecycle",
    lifecycleTitle: "Review, correction and removal",
    lifecycleParagraphs: [
      "Every suggestion and factual change is reviewed before publication. If essential evidence is missing, the proposed unit stays outside the public catalog while research continues.",
      "If a published profile no longer meets the criteria, duplicates another unit or belongs in a different area, it is corrected, merged, moved or removed through a reviewed decision.",
      "The criteria may evolve as the catalog expands. Existing profiles are reviewed against a changed criterion before any correction or removal.",
    ],
    trustKicker: "Trust and limits",
    trustTitle: "Clear sources, stable identities and revisable decisions",
    trustIntroduction:
      "The catalog is designed to be inspectable. It says what Chisan currently knows without turning uncertainty into marketing language or pretending that a review can never be improved.",
    trustPoints: [
      {
        title: "Chisan publishes and maintains the catalog",
        description:
          "Chisan is the source to cite for this catalog. We bring together public information and reviewed contributions in one stable profile for each producer.",
      },
      {
        title: "Several sources inform our work",
        description:
          "Beyond the databases named on this page, we draw on producer websites and source-backed contributions. We assess what each source supports and retain the evidence internally, without adding a source list to every profile or fact.",
      },
      {
        title: "Candidate work accumulates",
        description:
          "Area by area, open candidates retain the useful source and the next question. Closed exclusions and published-record merges leave a durable trace, while catalog checks prevent duplicate publication, so a new source pass builds on earlier research instead of restarting it.",
      },
      {
        title: "Producer participation is visible",
        description:
          "When a profile claim is approved, we show the confirmed relationship with its producer. This does not certify every fact; proposed changes still receive editorial review.",
      },
      {
        title: "Dates have a specific meaning",
        description:
          "Premium profiles can show the date of the last approved producer change. It records that update, not a complete recheck of every fact. A missing date does not imply recent verification.",
      },
      {
        title: "Coverage is never presented as complete",
        description:
          "A missing producer may simply not have been reviewed yet. Chisan does not infer quality, scale or relevance from inclusion or absence.",
      },
    ],
    participationKicker: "Participation",
    participationTitle: "People can improve the catalog without weakening it",
    participationParagraphs: [
      "Anyone can point Chisan toward a correction or a producer that deserves review. Useful proposals identify the productive unit, explain the requested change and include current public sources.",
      "Producers can use an account to claim the right profile and propose updates. Ownership authorizes participation; it does not replace evidence or editorial review.",
    ],
    accessKicker: "Access and commercial status",
    accessTitle: "Public discovery remains open",
    accessParagraphs: [
      "The public catalog can be browsed without an account. Accounts add favorites, ownership workflows and reviewed participation around the same public catalog.",
      "Any paid producer offer must publish its price, scope and terms before it is activated. Paid access never determines catalog inclusion, ordering, verification or editorial copy.",
    ],
    agentsKicker: "Agents and integrations",
    agentsTitle: "AI assistants can read the same public catalog",
    agentsIntroduction:
      "Chisan offers a public, read-only Remote MCP server. Assistants such as Claude can connect to it without an account or API key and answer with the same reviewed information shown on these pages.",
    agentsEndpointLabel: "Server URL (Streamable HTTP, no authentication):",
    agentsTools: [
      {
        title: "Chisan catalog coverage",
        description: "Published countries, regions, areas, languages and categories.",
      },
      {
        title: "Search Chisan producers",
        description: "Producers by text, geography, category, online sales or distance from a point.",
      },
      {
        title: "Search Chisan products",
        description: "Individually recorded products and varieties that are currently visible.",
      },
      {
        title: "Get Chisan producer",
        description: "One producer profile with its reviewed products, photos, links and contact channels.",
      },
    ],
    agentsParagraphs: [
      "Every tool only reads. None sends messages, books visits or places orders: contact and shop links are prepared for the person to use. Answers should cite the producer's Chisan profile. Missing information means unknown, and recorded prices are not live quotes or stock.",
      "The server needs no account and keeps no prompts, locations or client identities. Coordinates sent with a search are used only to answer it. The same operations are available as a JSON API.",
    ],
    agentsOpenApi: "OpenAPI description",
    agentsLlms: "Guide for language models (llms.txt)",
    agentsPrivacy: "Privacy policy",
    closing: "Connecting local food.",
    exploreCatalog: "Explore the producer catalog",
    contact: "Contact Chisan",
    account: "Use your account",
  },
  es: {
    locale: "es",
    title: "Cómo funciona Chisan",
    description:
      "Cómo Chisan descubre, revisa, publica y mantiene un catálogo público fiable de productores de alimentos y bebidas vinculados a un lugar.",
    purposeLead:
      "Los sistemas alimentarios locales están llenos de valor, pero con demasiada frecuencia están fragmentados.",
    purposeOriginBefore: "Inspirado en ",
    purposeOriginAfter:
      " — producción local para consumo local — Chisan existe para reunir productores, productos, disponibilidad y demanda local en una red conectada.",
    purposeBelief:
      "Creemos que una mejor información crea relaciones más sólidas: ayuda a los productores a llegar a los compradores adecuados, facilita el descubrimiento de alimentos locales y permite construir economías alimentarias más resilientes.",
    processKicker: "El proceso del catálogo",
    processTitle: "De posible productor a perfil público estable",
    processIntroduction:
      "Chisan combina investigación respaldada por fuentes con contribuciones revisadas. Publicar es una decisión editorial deliberada, no una importación automática ni una clasificación por popularidad.",
    steps: [
      {
        title: "Descubrir",
        description:
          "Las fuentes públicas, las contribuciones de productores y las sugerencias de la comunidad permiten localizar posibles unidades productivas. Cada pista útil permanece como candidato de su zona —no como perfil público— con su fuente, indicio de lugar y siguiente pregunta abierta.",
      },
      {
        title: "Revisar",
        description:
          "Para cada candidato resolvemos su identidad pública, lugar productivo, producción material, oferta propia actual y posible solapamiento con el catálogo. Después lo aceptamos, lo mantenemos en investigación con una pregunta concreta, lo trasladamos, lo vinculamos a un perfil existente o lo cerramos con evidencias.",
      },
      {
        title: "Publicar",
        description:
          "Los hechos aceptados se materializan en archivos CSV por zona. Las evidencias conservan las fuentes utilizadas para las admisiones y decisiones cerradas; los candidatos no resueltos siguen siendo investigación en vez de perfiles especulativos.",
      },
      {
        title: "Mantener al día",
        description:
          "Las correcciones, las solicitudes de productores y los cambios del catálogo se revisan antes de publicarse. Ninguna petición realizada en la web desplegada escribe directamente en el catálogo público.",
      },
    ],
    sourcesKicker: "Fuentes y cifras",
    sourcesTitle: "Las bases de datos detrás del catálogo",
    sourcesIntroduction:
      "Ningún productor de Chisan procede de una única base de datos. Cruzamos registros oficiales, consejos reguladores, directorios del territorio y los canales de cada productor, y anotamos qué acredita cada fuente y cuándo la consultamos.",
    sourceFigures: {
      producers: "productores publicados",
      municipalities: "municipios con al menos un productor",
      sourceReferences: "referencias a fuentes que respaldan nuestras decisiones",
      websites: "sitios web distintos entre esas referencias",
    },
    sourceFiguresNote:
      "Cifras del catálogo de España, calculadas a partir de los perfiles publicados y de sus evidencias editoriales cada vez que se actualiza la web.",
    sourceGroups: [
      {
        title: "Registros oficiales y datos abiertos",
        description:
          "Confirman identidades, actividades autorizadas, direcciones y cierres. Cada registro acredita solo lo que publica: una inscripción sanitaria no demuestra que hoy se venda un producto.",
        sources: "registries",
      },
      {
        title: "Denominaciones de origen y producción ecológica",
        description:
          "Los consejos reguladores y los organismos de certificación publican quién está inscrito y qué certifican. Nos ayudan a descubrir productores y a contrastar lo que elaboran.",
        sources: "certification",
      },
      {
        title: "Directorios del territorio",
        description:
          "Las marcas de calidad autonómicas y provinciales, las diputaciones y las cooperativas nos acercan a los productores de cada comarca y ayudan a confirmar dónde trabajan.",
        sources: "territory",
      },
      {
        title: "Mapas y referencias geográficas",
        description:
          "Sitúan cada unidad productiva en su municipio y en el mapa. Un geocodificador propone ubicaciones; publicar un punto sigue siendo una decisión editorial.",
        sources: "geography",
      },
      {
        title: "Productores, prensa y comunidad",
        description:
          "Las webs, tiendas online y redes oficiales de cada productor muestran qué elabora y qué ofrece hoy. La prensa, las guías, las ferias gastronómicas y las aportaciones revisadas aportan nuevas pistas.",
      },
    ],
    opensInNewTab: "(se abre en una pestaña nueva)",
    eligibilityKicker: "Criterios de inclusión",
    eligibilityTitle: "Quién puede formar parte de Chisan",
    eligibilityIntroduction:
      "Chisan publica identidades activas y vinculadas a un lugar de productores de alimentos o bebidas. Una unidad productiva cumple los criterios solo cuando todos ellos están respaldados por evidencias públicas actuales.",
    eligibilityCriteria: [
      {
        title: "Una identidad pública real",
        description:
          "Una persona, empresa, cooperativa o colectivo puede identificarse y distinguirse de entidades similares.",
      },
      {
        title: "Producción material",
        description:
          "Cultiva, cría, captura, cosecha, extrae, muele, fermenta, tuesta, hornea, conserva, destila, prepara o transforma materialmente alimentos o bebidas para personas.",
      },
      {
        title: "Una oferta propia y actual",
        description:
          "Al menos uno de los productos resultantes llega al público bajo una identidad que sigue siendo atribuible al productor.",
      },
      {
        title: "Un lugar productivo",
        description:
          "La actividad productiva real puede asignarse a una zona y un municipio del catálogo. No es necesaria una dirección pública exacta.",
      },
      {
        title: "Evidencias conectadas",
        description:
          "Las fuentes públicas conectan la identidad, la actividad productiva, la oferta y el lugar. Una fuente que demuestra una afirmación no demuestra automáticamente las demás.",
      },
      {
        title: "Una unidad activa y diferenciada",
        description:
          "Las evidencias actuales respaldan su actividad y la misma unidad productiva no está ya representada por otro perfil.",
      },
    ],
    boundariesKicker: "Alcance y evidencias",
    boundariesTitle: "Lo que no demuestra producción",
    boundariesIntroduction:
      "Estas señales pueden ayudar a descubrir o corroborar un productor, pero ninguna justifica por sí sola su inclusión.",
    boundaries: [
      {
        title: "Registros y distintivos",
        description:
          "Aparecer en un registro, asociación, guía o mapa, o disponer de un sello o certificación, solo aporta evidencia sobre las afirmaciones que esa fuente publica realmente.",
      },
      {
        title: "Presencia comercial",
        description:
          "Una tienda, restaurante, cafetería, oficina, puesto de mercado, canal de venta o sala de degustación no demuestra dónde ni si existe producción.",
      },
      {
        title: "Marca y popularidad",
        description:
          "Una mención de marca, un perfil social, un listado de productos o una reseña positiva no identifican una unidad productiva válida ni determinan su relevancia editorial.",
      },
      {
        title: "Reventa y servicio",
        description:
          "Almacenar, envasar, presentar, servir o revender productos elaborados por terceros no constituye producción material.",
      },
    ],
    lifecycleKicker: "Ciclo editorial",
    lifecycleTitle: "Revisión, corrección y retirada",
    lifecycleParagraphs: [
      "Cada sugerencia y cambio factual se revisa antes de publicarse. Si falta una evidencia esencial, la unidad propuesta permanece fuera del catálogo público mientras continúa la investigación.",
      "Si un perfil publicado deja de cumplir los criterios, duplica otra unidad o pertenece a una zona diferente, se corrige, combina, traslada o retira mediante una decisión revisada.",
      "Los criterios pueden evolucionar a medida que crece el catálogo. Los perfiles existentes se revisan frente a cualquier criterio modificado antes de corregirlos o retirarlos.",
    ],
    trustKicker: "Confianza y límites",
    trustTitle: "Fuentes claras, identidades estables y decisiones revisables",
    trustIntroduction:
      "El catálogo está pensado para poder inspeccionarse. Expone lo que Chisan sabe actualmente sin convertir la incertidumbre en lenguaje promocional ni fingir que una revisión no puede mejorarse.",
    trustPoints: [
      {
        title: "Chisan publica y mantiene el catálogo",
        description:
          "Chisan es la fuente que citar para este catálogo. Reunimos información pública y aportaciones revisadas en un perfil estable y único para cada productor.",
      },
      {
        title: "Combinamos distintas fuentes",
        description:
          "Además de las bases de datos citadas en esta página, nos apoyamos en webs de productores y aportaciones respaldadas por fuentes. Valoramos qué acredita cada fuente y conservamos las evidencias internamente, sin añadir una lista de fuentes a cada perfil o dato.",
      },
      {
        title: "El trabajo con candidatos se acumula",
        description:
          "Zona a zona, los candidatos abiertos conservan la fuente útil y la siguiente pregunta. Las exclusiones cerradas y las fusiones de perfiles publicados dejan un rastro duradero, mientras las comprobaciones del catálogo evitan duplicados, de modo que una nueva revisión continúa el trabajo anterior en vez de empezarlo de nuevo.",
      },
      {
        title: "La participación del productor es visible",
        description:
          "Cuando se aprueba la solicitud de verificación de un perfil, mostramos la relación confirmada con su productor. Esto no certifica todos los datos; los cambios propuestos siguen pasando por revisión editorial.",
      },
      {
        title: "Las fechas tienen un significado concreto",
        description:
          "Los perfiles premium pueden mostrar la fecha del último cambio aprobado del productor. Indica esa actualización, no una comprobación completa de todos los datos. La ausencia de fecha no implica una verificación reciente.",
      },
      {
        title: "La cobertura nunca se presenta como completa",
        description:
          "Que un productor no aparezca puede significar simplemente que todavía no ha sido revisado. Chisan no deduce calidad, escala ni relevancia de la inclusión o la ausencia.",
      },
    ],
    participationKicker: "Participación",
    participationTitle: "Mejorar el catálogo sin debilitarlo",
    participationParagraphs: [
      "Cualquier persona puede señalar una corrección o un productor que merezca revisión. Las propuestas útiles identifican la unidad productiva, explican el cambio solicitado e incluyen fuentes públicas actuales.",
      "Los productores pueden usar una cuenta para verificar el perfil correcto y proponer actualizaciones. La propiedad autoriza la participación; no sustituye las evidencias ni la revisión editorial.",
    ],
    accessKicker: "Acceso y situación comercial",
    accessTitle: "El descubrimiento público permanece abierto",
    accessParagraphs: [
      "El catálogo público puede consultarse sin una cuenta. Las cuentas añaden favoritos, flujos de propiedad y participación revisada alrededor del mismo catálogo público.",
      "Cualquier oferta de pago para productores debe publicar su precio, alcance y condiciones antes de activarse. El pago nunca determina la inclusión, el orden, la verificación ni el texto editorial del catálogo.",
    ],
    agentsKicker: "Agentes e integraciones",
    agentsTitle: "Los asistentes de IA pueden consultar el mismo catálogo público",
    agentsIntroduction:
      "Chisan ofrece un servidor Remote MCP público y de solo lectura. Asistentes como Claude pueden conectarse sin cuenta ni clave de API y responder con la misma información revisada que muestran estas páginas.",
    agentsEndpointLabel: "URL del servidor (Streamable HTTP, sin autenticación):",
    agentsTools: [
      {
        title: "Cobertura del catálogo",
        description: "Países, regiones, zonas, idiomas y categorías publicados.",
      },
      {
        title: "Buscar productores",
        description: "Productores por texto, geografía, categoría, venta en línea o distancia a un punto.",
      },
      {
        title: "Buscar productos",
        description: "Productos y variedades registrados individualmente y visibles en ese momento.",
      },
      {
        title: "Consultar un productor",
        description: "Un perfil con sus productos revisados, fotos, enlaces y canales de contacto.",
      },
    ],
    agentsParagraphs: [
      "Todas las herramientas son de lectura. Ninguna envía mensajes, reserva visitas ni hace pedidos: los enlaces de contacto y tienda quedan preparados para que los use la persona. Las respuestas deben citar el perfil del productor en Chisan. La información que falta es desconocida y los precios registrados no son cotizaciones ni existencias en vivo.",
      "El servidor no necesita cuenta y no guarda consultas, ubicaciones ni identidades de cliente. Las coordenadas enviadas en una búsqueda solo se usan para responderla. Las mismas operaciones están disponibles como API JSON.",
    ],
    agentsOpenApi: "Descripción OpenAPI",
    agentsLlms: "Guía para modelos de lenguaje (llms.txt)",
    agentsPrivacy: "Política de privacidad",
    closing: "Conecta con lo que se produce cerca de ti",
    exploreCatalog: "Explorar el catálogo de productores",
    contact: "Contactar con Chisan",
    account: "Usar tu cuenta",
  },
} as const satisfies Record<PublicPageLocale, HowChisanWorksCopy>;

const CONTACT = {
  en: {
    locale: "en",
    title: "Contact Chisan",
    description:
      "Contact Chisan about catalog corrections, producer participation, privacy or general questions.",
    introduction:
      "The most useful message explains what you need, identifies the relevant producer or page when applicable, and links to current public sources. Please do not send passwords, payment information or unnecessary personal data.",
    channelsTitle: "Choose the right channel",
    emailTitle: "General and private enquiries",
    emailDescription:
      "Use email for general questions, privacy requests or anything that should not be discussed in public. Chisan may ask for additional context before acting on a catalog or account request.",
    catalogTitle: "Catalog corrections",
    catalogDescription:
      "Include the public profile URL, the exact fact that appears wrong or incomplete, the proposed correction and the source that supports it. A suggestion starts a review; it does not update the CSV automatically.",
    producerTitle: "Producer participation",
    producerDescription:
      "If you represent a listed producer, use your Chisan account to begin an ownership request for the exact productive unit. Ownership is checked separately from every factual change you later propose.",
    socialTitle: "Public updates",
    socialDescription:
      "Follow Chisan on Instagram or X for public product updates. Social messages are not a suitable channel for sensitive information or formal privacy requests.",
    privacyTitle: "Privacy and safety",
    privacyDescription:
      "Chisan uses only the information needed to understand and answer a request. Read the privacy notice for account, analytics, location and advertising details.",
    accountLink: "Open your account",
    privacyLink: "Read privacy and cookies",
  },
  es: {
    locale: "es",
    title: "Contactar con Chisan",
    description:
      "Contacta con Chisan para correcciones del catálogo, participación de productores, privacidad o consultas generales.",
    introduction:
      "Los mensajes más útiles explican qué necesitas, identifican el productor o la página correspondiente cuando proceda e incluyen enlaces a fuentes públicas actuales. No envíes contraseñas, información de pago ni datos personales innecesarios.",
    channelsTitle: "Elige el canal adecuado",
    emailTitle: "Consultas generales y privadas",
    emailDescription:
      "Utiliza el correo electrónico para preguntas generales, solicitudes de privacidad o asuntos que no deban tratarse en público. Chisan puede pedir más contexto antes de actuar sobre una solicitud del catálogo o de una cuenta.",
    catalogTitle: "Correcciones del catálogo",
    catalogDescription:
      "Incluye la URL del perfil público, el dato exacto que parece incorrecto o incompleto, la corrección propuesta y la fuente que la respalda. Una sugerencia inicia una revisión; no actualiza el CSV automáticamente.",
    producerTitle: "Participación de productores",
    producerDescription:
      "Si representas a un productor publicado, utiliza tu cuenta de Chisan para iniciar una solicitud de propiedad sobre la unidad productiva exacta. La propiedad se comprueba por separado de cada cambio factual que propongas después.",
    socialTitle: "Actualizaciones públicas",
    socialDescription:
      "Sigue a Chisan en Instagram o X para recibir novedades públicas del producto. Los mensajes sociales no son un canal adecuado para información sensible ni para solicitudes formales de privacidad.",
    privacyTitle: "Privacidad y seguridad",
    privacyDescription:
      "Chisan utiliza solo la información necesaria para entender y responder una solicitud. Consulta el aviso de privacidad para conocer los detalles sobre cuentas, analítica, ubicación y publicidad.",
    accountLink: "Abrir tu cuenta",
    privacyLink: "Leer privacidad y cookies",
  },
} as const satisfies Record<PublicPageLocale, ContactCopy>;

const ABOUT = {
  en: {
    locale: "en",
    title: "About Chisan",
    description:
      "The origin, philosophy and people behind Chisan: restoring the value of local food in a rapidly changing world.",
    heroLead: "Restoring the value of local food in a world changing at high speed.",
    heroParagraphs: [
      "Chisan is inspired by the Japanese concept of chisan-chisho (地産地消): local production for local consumption.",
      "We believe that the most advanced technology is only meaningful when it serves what is tangible: the land, real food, and the craft of those who produce it.",
    ],
    founderKicker: "Who is behind Chisan",
    founderTitle: "Physics, technology and fatherhood",
    founderLead:
      "Behind Chisan is Enrique Pérez: a physicist by training, technology journalist and senior editor at Xataka / director of Xataka Móvil for over a decade, and recently a father.",
    founderParagraphs: [
      "My career has allowed me to follow from the front row how the internet transformed society, and how artificial intelligence is bringing us to a new era. Yet my experience traveling and exploring territories has always reminded me of an essential truth: the more virtual the world becomes, the more vital the real things that sustain us are.",
      "Becoming a father changes the time horizon. You stop thinking only about the next tech cycle and start asking what kind of world our children will inherit. Chisan is my personal commitment to building a more human, transparent and locally grounded future.",
    ],
    travelKicker: "The origin",
    travelTitle: "The paradox of what is near",
    travelLead:
      "I have always loved traveling and tasting the identity of each place through its food: artisanal cheeses from local shepherds, wines from small parcels, olive oil from family mills, or vegetables grown just a few kilometers away.",
    travelParagraphs: [
      "Yet returning home brings an absurd reality: we regularly consume products shipped across oceans in refrigerated containers, while extraordinary local producers right next door remain invisible behind layers of intermediaries and industrial distribution.",
      "In Japan, they understood generations ago that closely linking production with the immediate territory is not just environmentalism: it is health, community resilience, and cultural respect for those who work the land.",
    ],
    technologyKicker: "A post-AGI world",
    technologyTitle: "Using artificial intelligence to look back at the land",
    technologyLead:
      "We are entering an era where software, digital content, and media tend toward infinite abundance. In this landscape, irreplaceable value lives in the physical, the biological, and human craft.",
    technologyParagraphs: [
      "Artificial intelligence should not be a tool to isolate us deeper into screens or fill the internet with synthetic noise. For the first time, it gives us the leverage to audit complex public registers, cross-reference dispersed official sources, and structure local catalog data with precision that once required a government agency or a large corporation.",
      "Chisan uses technology to enhance human judgment, not replace it: AI assists with research and data reconciliation, but every publication decision reflects deliberate, evidence-backed editorial review.",
    ],
    principlesKicker: "Independence",
    principlesTitle: "Principles of an independent project",
    principlesLead:
      "Building Chisan as a solo creator preserves complete editorial freedom without commercial compromises.",
    principles: [
      {
        title: "Zero advertising and no paid placement",
        description:
          "No producer pays to be listed or to appear higher in searches. We do not sell sponsored rankings.",
      },
      {
        title: "No intermediation or data monetization",
        description:
          "Chisan does not take sales cuts or commercialize producer contacts. Verified public data is maintained as a community resource.",
      },
      {
        title: "Evidence-based editorial review",
        description:
          "We do not scrape or import bulk registries blindly. Every published unit is verified against public evidence and official records.",
      },
    ],
    futureKicker: "Community",
    futureTitle: "An open invitation",
    futureParagraphs: [
      "Chisan begins with one person behind the code and initial curation, but its purpose is shared. The catalog grows and stays current through the contributions of people who know their local territory.",
      "Whether you are a food producer, know a local craft that deserves discovery, or share this vision for the future, this space is for you.",
    ],
    closing: "Connecting local food.",
    exploreCatalog: "Explore the producer catalog",
    howWeWorkLink: "How our editorial criteria works",
    contactLink: "Contact Chisan",
    linkedInUrl: "https://www.linkedin.com/in/lyzanor/",
    linkedInLabel: "Connect with Enrique on LinkedIn",
  },
  es: {
    locale: "es",
    title: "Sobre Chisan",
    description:
      "El origen, la filosofía y quién está detrás de Chisan: devolver el valor a lo cercano en un mundo que cambia a toda velocidad.",
    heroLead:
      "Devolver el valor a lo cercano en un mundo que cambia a toda velocidad.",
    heroParagraphs: [
      "Chisan nace inspirado en la filosofía japonesa de chisan-chisho (地産地消): la producción local para el consumo local.",
      "Creemos que la tecnología más avanzada solo tiene sentido si nos ayuda a cuidar lo tangible: la tierra, el alimento real y el oficio de quienes lo elaboran.",
    ],
    founderKicker: "Quién está detrás",
    founderTitle: "Física, tecnología y paternidad",
    founderLead:
      "Detrás de Chisan está Enrique Pérez: físico de formación, periodista y editor especializado en tecnología y economía digital desde hace más de una década en Xataka y director de Xataka Móvil, y recientemente padre.",
    founderParagraphs: [
      "Mi trayectoria profesional me ha permitido seguir desde primera fila cómo internet ha transformado la sociedad, y cómo la llegada de la inteligencia artificial nos sitúa ante un cambio de época. Pero mi experiencia como viajero y ciudadano siempre me ha recordado una verdad elemental: cuanto más virtual se vuelve el mundo, más esenciales son las cosas reales que nos sostienen.",
      "Al convertirme en padre, el horizonte temporal cambia. Dejas de pensar únicamente en el próximo ciclo tecnológico y empiezas a preguntarte qué clase de mundo van a heredar nuestros hijos. Chisan es mi compromiso personal para construir un entorno más humano, transparente y arraigado en lo cercano.",
    ],
    travelKicker: "El origen",
    travelTitle: "La paradoja de lo cercano",
    travelLead:
      "Siempre me ha fascinado viajar y saborear la identidad de cada lugar a través de sus alimentos: los quesos de pastores locales, el vino de pequeñas parcelas, el aceite de almazaras familiares o las hortalizas cultivadas a pocos kilómetros.",
    travelParagraphs: [
      "Sin embargo, al regresar a la rutina diaria, la realidad suele ser otra: compramos productos que han recorrido medio planeta en cámaras frigoríficas mientras los alimentos excepcionales que se producen a nuestro lado quedan invisibilizados tras capas de intermediarios y distribución industrial.",
      "En Japón comprendieron hace generaciones que vincular estrechamente la producción con el entorno inmediato no es solo ecología: es salud, economía comunitaria y respeto cultural por quien trabaja la tierra.",
    ],
    technologyKicker: "Un mundo post-AGI",
    technologyTitle: "Usar la inteligencia artificial para mirar a la tierra",
    technologyLead:
      "Nos adentramos en una era donde el software, las imágenes y el contenido digital tienden a una abundancia infinita. En ese escenario, el valor insustituible reside en lo físico, lo biológico y el tiempo humano.",
    technologyParagraphs: [
      "La inteligencia artificial no debe ser una fuerza para aislarnos aún más en pantallas ni para inundar internet de ruido especulativo. Por primera vez, nos da la capacidad técnica para auditar registros sanitarios oficiales, contrastar fuentes públicas dispersas y ordenar la información del territorio con una precisión que antes solo estaba al alcance de grandes corporaciones o ministerios.",
      "Chisan utiliza la tecnología avanzada no para sustituir al ser humano, sino para amplificar el criterio: la IA asiste en la investigación y el cruce de datos, pero cada decisión de publicación responde a una verificación editorial real y contrastada.",
    ],
    principlesKicker: "Independencia",
    principlesTitle: "Principios de un proyecto independiente",
    principlesLead:
      "Construir Chisan en solitario permite mantener una libertad editorial absoluta y sin compromisos.",
    principles: [
      {
        title: "Cero publicidad y sin compra de visibilidad",
        description:
          "Ningún productor paga por figurar en el catálogo ni por aparecer más arriba en los resultados. No vendemos posicionamiento patrocinado.",
      },
      {
        title: "Sin intermediación ni venta de datos",
        description:
          "Chisan no cobra comisiones por venta ni comercializa los datos de los productores. La información verificada es un bien público puesto al servicio de la comunidad.",
      },
      {
        title: "Criterio basado en evidencias",
        description:
          "No importamos listados masivos a ciegas ni usamos bots para inflar cifras. Cada unidad productiva publicada cuenta con fuentes contrastadas que respaldan su actividad real.",
      },
    ],
    futureKicker: "Comunidad",
    futureTitle: "Una iniciativa abierta a todos",
    futureParagraphs: [
      "Chisan comienza con una persona detrás del código y la investigación inicial, pero su vocación es compartida y abierta. El catálogo crece y se mantiene vivo gracias a las aportaciones de quienes conocen de cerca su territorio.",
      "Si eres productor, si conoces proyectos locales que merecen ser descubiertos o si compartes esta forma de entender el futuro, este proyecto también es tuyo.",
    ],
    closing: "Conecta con lo que se produce cerca de ti.",
    exploreCatalog: "Explorar el catálogo",
    howWeWorkLink: "Cómo funciona nuestro criterio editorial",
    contactLink: "Contactar con Chisan",
    linkedInUrl: "https://www.linkedin.com/in/lyzanor/",
    linkedInLabel: "Conectar con Enrique en LinkedIn",
  },
} as const satisfies Record<PublicPageLocale, AboutCopy>;

export function getHowChisanWorksCopy(locale: Locale | null): HowChisanWorksCopy {
  return HOW_CHISAN_WORKS[resolvePublicPageLocale(locale)];
}

export function getAboutCopy(locale: Locale | null): AboutCopy {
  return ABOUT[resolvePublicPageLocale(locale)];
}

export function getContactCopy(locale: Locale | null): ContactCopy {
  return CONTACT[resolvePublicPageLocale(locale)];
}
