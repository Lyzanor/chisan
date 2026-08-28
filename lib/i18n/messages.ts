import type { DescriptionSourceLocale, Locale } from "./locales";
import { getLocaleDisplayTag } from "./locales";

export type PluralMessage = {
  one: string;
  other: string;
};

export type Messages = {
  languageName: string;
  languageSwitcher: {
    label: string;
  };
  siteHeader: {
    tagline: string;
    accountNavigation: string;
    signIn: string;
    register: string;
    myAccount: string;
    signOut: string;
  };
  siteFooter: {
    navigation: string;
    aboutLink: string;
    catalogLink: string;
    contactLink: string;
  };
  accountActions: {
    ownershipVerifiedDescription: string;
    saveOrClaimPrompt: string;
    signIn: string;
    createAccount: string;
    removeFavorite: string;
    saveFavorite: string;
    editMyProfile: string;
    expandProfile: string;
    ownershipVerified: string;
    viewOwnershipClaim: string;
    claimProducer: string;
    descriptionLanguage: {
      none: string;
      names: Partial<Record<DescriptionSourceLocale, string>>;
    };
  };
  ownerProducerFieldHelp: {
    nombre: string;
    municipio: string;
    categoria: string;
    "categorias adicionales": string;
    "productos estrella": string;
    descripcion: string;
    descripcion_locale: string;
    "visitas guiadas": string;
    "mensaje a la comunidad": string;
    mensaje_comunidad_locale: string;
    "enlace destacado 1": string;
    "enlace destacado 2": string;
    direccion: string;
    horario: string;
    telefono: string;
    correo: string;
    web: string;
    Facebook: string;
    Instagram: string;
    "Google Maps": string;
    lat: string;
    lon: string;
    "Venta online": string;
    "Canal de venta": string;
  };
  common: {
    unitCount: string;
    unavailable: string;
  };
  notFound: {
    title: string;
    description: string;
    backToCatalog: string;
  };
  metadata: {
    homeTitle: string;
    homeDescription: string;
    countryTitle: string;
    countryDescription: string;
    areaNotFoundTitle: string;
    areaTitle: string;
    areaDescription: string;
    producerNotFoundTitle: string;
    producerNotFoundDescription: string;
    producerDescription: string;
  };
  home: {
    chooseCountry: string;
    countrySummary: string;
    aboutKicker: string;
    aboutDescription: string;
    aboutCatalogDescription: string;
  };
  locationOnboarding: {
    title: string;
    description: string;
    useLocation: string;
    chooseManually: string;
    manualCountryLabel: string;
    manualCountryPlaceholder: string;
    manualAreaLabel: string;
    manualAreaPlaceholder: string;
    locating: string;
    dismissed: string;
    savedTitle: string;
    savedDescription: string;
    continueInArea: string;
    changeArea: string;
    forgetArea: string;
    errors: {
      permissionDenied: string;
      timeout: string;
      unavailable: string;
      outside: string;
      ambiguous: string;
      loadFailed: string;
    };
  };
  country: {
    chooseUnit: string;
  };
  areaSelector: {
    label: string;
    placeholder: string;
    submit: string;
  };
  catalog: {
    title: string;
    summary: string;
    producersFound: PluralMessage;
    mapped: PluralMessage;
    categories: string;
    allCategories: string;
    selected: string;
    seeAll: string;
    openProfile: string;
    producers: string;
    showing: string;
    totalInArea: PluralMessage;
    details: string;
    emptyCategory: string;
  };
  map: {
    loading: string;
    emptyCoordinates: string;
    producerMap: string;
    producers: string;
    openProfile: string;
  };
  producer: {
    backToMap: string;
    profile: string;
    website: string;
    googleMaps: string;
    phone: string;
    email: string;
    imageAlt: string;
    location: string;
    mapAria: string;
    details: string;
    field: string;
    value: string;
    navigation: string;
    map: string;
    categories: string;
    allCategories: string;
    information: string;
    expandedProfile: string;
  };
  fieldLabels: {
    slug: string;
    producerId: string;
    name: string;
    municipality: string;
    category: string;
    additionalCategories: string;
    featuredProducts: string;
    address: string;
    description: string;
    descriptionLocale: string;
    guidedVisits: string;
    communityMessage: string;
    communityMessageLocale: string;
    highlightedLink1: string;
    highlightedLink2: string;
    openingHours: string;
    phone: string;
    email: string;
    website: string;
    image: string;
    onlineSales: string;
    salesChannels: string;
    facebook: string;
    instagram: string;
    googleMaps: string;
    latitude: string;
    longitude: string;
    verification: string;
  };
  controlledValues: {
    verification: {
      pendiente: string;
    };
    onlineSales: {
      sí: string;
      no: string;
      "no comprobado": string;
    };
    salesChannels: {
      ecommerce: string;
      whatsapp: string;
      email: string;
      telefono: string;
      suscripcion: string;
      marketplace: string;
    };
  };
};

const MESSAGE_LOADERS = {
  en: () => import("./messages/en"),
  es: () => import("./messages/es"),
  ca: () => import("./messages/ca"),
  de: () => import("./messages/de"),
  ja: () => import("./messages/ja"),
  fr: () => import("./messages/fr"),
  it: () => import("./messages/it"),
  nl: () => import("./messages/nl"),
  pt: () => import("./messages/pt"),
  af: () => import("./messages/af"),
  as: () => import("./messages/as"),
  bn: () => import("./messages/bn"),
  cy: () => import("./messages/cy"),
  ga: () => import("./messages/ga"),
  gd: () => import("./messages/gd"),
  gu: () => import("./messages/gu"),
  haw: () => import("./messages/haw"),
  hi: () => import("./messages/hi"),
  kn: () => import("./messages/kn"),
  kok: () => import("./messages/kok"),
  ml: () => import("./messages/ml"),
  mr: () => import("./messages/mr"),
  ne: () => import("./messages/ne"),
  nso: () => import("./messages/nso"),
  or: () => import("./messages/or"),
  pa: () => import("./messages/pa"),
  ss: () => import("./messages/ss"),
  st: () => import("./messages/st"),
  ta: () => import("./messages/ta"),
  te: () => import("./messages/te"),
  tn: () => import("./messages/tn"),
  xh: () => import("./messages/xh"),
  zu: () => import("./messages/zu"),
} satisfies Record<Locale, () => Promise<{ default: Messages }>>;

export async function loadMessages(locale: Locale): Promise<Messages> {
  return (await MESSAGE_LOADERS[locale]()).default;
}

type TemplateValue = string | number;

export function formatMessage(
  template: string,
  values: Readonly<Record<string, TemplateValue>>,
): string {
  return template.replace(
    /\{([a-zA-Z][a-zA-Z0-9]*)\}/g,
    (placeholder, key: string) =>
      Object.hasOwn(values, key) ? String(values[key]) : placeholder,
  );
}

export function formatNumber(locale: Locale, value: number): string {
  return new Intl.NumberFormat(getLocaleDisplayTag(locale)).format(value);
}

export function formatPluralMessage(
  locale: Locale,
  value: number,
  message: PluralMessage,
  values: Readonly<Record<string, TemplateValue>> = {},
): string {
  const pluralCategory = new Intl.PluralRules(
    getLocaleDisplayTag(locale),
  ).select(value);
  const template = pluralCategory === "one" ? message.one : message.other;

  return formatMessage(template, {
    ...values,
    count: formatNumber(locale, value),
  });
}

export function formatUnitCount(
  locale: Locale,
  value: number,
  unit: { one: string; many: string },
  template: string,
): string {
  const pluralCategory = new Intl.PluralRules(
    getLocaleDisplayTag(locale),
  ).select(value);

  return formatMessage(template, {
    count: formatNumber(locale, value),
    unit: pluralCategory === "one" ? unit.one : unit.many,
  });
}
