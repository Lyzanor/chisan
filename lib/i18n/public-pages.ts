import type { Locale } from "./locales";

export type PublicPageLocale = "en" | "es";

export function resolvePublicPageLocale(locale: Locale | null): PublicPageLocale {
  return locale === "es" ? "es" : "en";
}

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
  closing: string;
  exploreCatalog: string;
  contact: string;
  account: string;
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
          "Public sources, producer contributions and community suggestions surface possible productive units. A shop, café, sales channel or brand mention on its own is not proof of production.",
      },
      {
        title: "Review",
        description:
          "We check the public identity, productive location, own material output and current evidence for each unit. One catalog row represents one productive unit.",
      },
      {
        title: "Publish",
        description:
          "Reviewed facts are materialized in area CSV files. Those files define public profiles and routes; evidence records the sources and the reasons behind closed decisions.",
      },
      {
        title: "Keep current",
        description:
          "Corrections, producer requests and catalog changes are reviewed before publication. No request made on the deployed website writes directly to the public catalog.",
      },
    ],
    trustKicker: "Trust and limits",
    trustTitle: "Clear sources, stable identities and revisable decisions",
    trustIntroduction:
      "The catalog is designed to be inspectable. It says what Chisan currently knows without turning uncertainty into marketing language or pretending that a review can never be improved.",
    trustPoints: [
      {
        title: "The CSV catalog is canonical",
        description:
          "Public producer facts live in the area catalog. Account data, candidate notes and internal workflows never become a hidden second producer registry.",
      },
      {
        title: "Evidence supports decisions",
        description:
          "Sources are kept separately from published facts so a profile can remain readable while its editorial basis stays traceable.",
      },
      {
        title: "Ownership is not automatic proof",
        description:
          "A producer may propose a change and an active owner relationship may be shown publicly, but every factual change still requires editorial review.",
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
          "Las fuentes públicas, las contribuciones de productores y las sugerencias de la comunidad permiten localizar posibles unidades productivas. Una tienda, cafetería, canal de venta o mención de marca no demuestra por sí sola que exista producción.",
      },
      {
        title: "Revisar",
        description:
          "Comprobamos la identidad pública, la ubicación productiva, la producción material propia y las evidencias actuales de cada unidad. Una fila del catálogo representa una unidad productiva.",
      },
      {
        title: "Publicar",
        description:
          "Los hechos revisados se materializan en archivos CSV por zona. Esos archivos definen los perfiles y las rutas públicas; las evidencias conservan las fuentes y los motivos de las decisiones cerradas.",
      },
      {
        title: "Mantener al día",
        description:
          "Las correcciones, las solicitudes de productores y los cambios del catálogo se revisan antes de publicarse. Ninguna petición realizada en la web desplegada escribe directamente en el catálogo público.",
      },
    ],
    trustKicker: "Confianza y límites",
    trustTitle: "Fuentes claras, identidades estables y decisiones revisables",
    trustIntroduction:
      "El catálogo está pensado para poder inspeccionarse. Expone lo que Chisan sabe actualmente sin convertir la incertidumbre en lenguaje promocional ni fingir que una revisión no puede mejorarse.",
    trustPoints: [
      {
        title: "El catálogo CSV es canónico",
        description:
          "Los datos públicos de los productores viven en el catálogo de cada zona. Las cuentas, las notas de candidatos y los flujos internos nunca forman un segundo registro oculto de productores.",
      },
      {
        title: "Las evidencias respaldan las decisiones",
        description:
          "Las fuentes se conservan separadas de los hechos publicados para que el perfil siga siendo legible y su base editorial permanezca trazable.",
      },
      {
        title: "La propiedad no es una prueba automática",
        description:
          "Un productor puede proponer un cambio y una relación de propiedad activa puede mostrarse públicamente, pero cada cambio factual sigue necesitando revisión editorial.",
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
      "Los productores pueden usar una cuenta para reclamar el perfil correcto y proponer actualizaciones. La propiedad autoriza la participación; no sustituye las evidencias ni la revisión editorial.",
    ],
    accessKicker: "Acceso y situación comercial",
    accessTitle: "El descubrimiento público permanece abierto",
    accessParagraphs: [
      "El catálogo público puede consultarse sin una cuenta. Las cuentas añaden favoritos, flujos de propiedad y participación revisada alrededor del mismo catálogo público.",
      "Cualquier oferta de pago para productores debe publicar su precio, alcance y condiciones antes de activarse. El pago nunca determina la inclusión, el orden, la verificación ni el texto editorial del catálogo.",
    ],
    closing: "Conectando la alimentación local.",
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

export function getHowChisanWorksCopy(locale: Locale | null): HowChisanWorksCopy {
  return HOW_CHISAN_WORKS[resolvePublicPageLocale(locale)];
}

export function getContactCopy(locale: Locale | null): ContactCopy {
  return CONTACT[resolvePublicPageLocale(locale)];
}
