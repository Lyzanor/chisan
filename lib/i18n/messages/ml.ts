import type { Messages } from "../messages";

const messages = {
  languageName: "മലയാളം",
  languageSwitcher: { label: "ഭാഷ" },
  siteHeader: {
    tagline: "പ്രാദേശിക ഭക്ഷണം, ഒന്നായി",
    accountNavigation: "അക്കൗണ്ട്",
    signIn: "സൈൻ ഇൻ ചെയ്യുക",
    register: "രജിസ്റ്റർ ചെയ്യുക",
    myAccount: "എന്റെ അക്കൗണ്ട്",
    greeting: "നമസ്കാരം, {name}",
    favorites: "പ്രിയപ്പെട്ടവ",
    signOut: "സൈൻ ഔട്ട് ചെയ്യുക",
  },
  siteFooter: {
    navigation: "ഫൂട്ടർ നാവിഗേഷൻ",
    aboutLink: "ഞങ്ങളുടെ ലക്ഷ്യം",
    catalogLink: "ഉൽപ്പാദകരുടെ കാറ്റലോഗ്",
    contactLink: "GitHub-ൽ ഞങ്ങളെ ബന്ധപ്പെടുക",
  },
  accountActions: {
    ownershipVerifiedDescription:
      "ഈ പ്രൊഫൈൽ ഉൽപ്പാദകൻ അവകാശപ്പെടുകയും പരിശോധിക്കുകയും ചെയ്തിട്ടുണ്ട്.",
    saveOrClaimPrompt:
      "ഈ ഉൽപ്പാദകനെ സംരക്ഷിക്കുകയോ ഉടമസ്ഥാവകാശം അവകാശപ്പെടുകയോ ചെയ്യുക.",
    signIn: "സൈൻ ഇൻ ചെയ്യുക",
    createAccount: "അക്കൗണ്ട് സൃഷ്ടിക്കുക",
    removeFavorite: "പ്രിയപ്പെട്ടവയിൽ നിന്ന് നീക്കുക",
    saveFavorite: "പ്രിയപ്പെട്ടവയിൽ സംരക്ഷിക്കുക",
    editMyProfile: "എന്റെ പ്രൊഫൈൽ തിരുത്തുക",
    expandProfile: "പ്രൊഫൈൽ വിപുലീകരിക്കുക",
    ownershipVerified: "ഉൽപ്പാദകൻ പരിശോധിച്ചത്",
    viewOwnershipClaim: "ഉടമസ്ഥാവകാശ അവകാശവാദം കാണുക",
    claimProducer: "ഈ ഉൽപ്പാദകന്റെ ഉടമസ്ഥാവകാശം അവകാശപ്പെടുക",
    descriptionLanguage: {
      none: "വിവരണത്തിന്റെ ഭാഷയില്ല",
      names: {
        en: "ഇംഗ്ലീഷ്",
        es: "സ്പാനിഷ്",
        ca: "കറ്റാലൻ",
        de: "ജർമ്മൻ",
        ja: "ജാപ്പനീസ്",
        fr: "ഫ്രഞ്ച്",
        it: "ഇറ്റാലിയൻ",
        nl: "ഡച്ച്",
        pt: "പോർച്ചുഗീസ്",
        gl: "ഗലീഷ്യൻ",
        eu: "ബാസ്ക്",
      },
    },
  },
  ownerProducerFieldHelp: {
    nombre: "ഉൽപ്പാദകന്റെയോ ബ്രാൻഡിന്റെയോ പൊതുപേര്.",
    municipio: "വിൽപ്പന ഓഫീസിന്റേതല്ല, ഉൽപ്പാദന യൂണിറ്റിന്റെ മുനിസിപ്പാലിറ്റി.",
    categoria: "ഉൽപ്പാദകന്റെ പ്രധാന ഭൗതിക ഉൽപ്പാദനം.",
    "categorias adicionales":
      "ഇതേ ഉൽപ്പാദന യൂണിറ്റ് നിർമ്മിക്കുന്ന മറ്റ് ഭൗതിക ഉൽപ്പന്നങ്ങൾ.",
    "productos estrella":
      "നിശ്ചിത ഉൽപ്പന്നങ്ങളുടെയോ ബ്രാൻഡുകളുടെയോ പേരുകളുടെയോ ചുരുക്കപ്പട്ടിക.",
    descripcion:
      "പ്രചാരണ അവകാശവാദങ്ങളില്ലാത്ത, ഉൽപ്പാദകനെക്കുറിച്ചുള്ള വസ്തുതാപരമായ വിവരങ്ങൾ.",
    descripcion_locale:
      "കാനോനിക്കൽ വിവരണത്തിന്റെ ഉറവിട ഭാഷ; വിവരണം ശൂന്യമെങ്കിൽ മാത്രം ശൂന്യമായി വിടുക.",
    direccion:
      "ഉൽപ്പാദന യൂണിറ്റിന്റെയോ പൊതുജനങ്ങൾക്കായി തുറന്നിരിക്കുന്ന സ്ഥലത്തിന്റെയോ വിലാസം.",
    horario: "നിലവിലെ സന്ദർശന, ശേഖരണ, അല്ലെങ്കിൽ പൊതുതുറന്ന സമയങ്ങൾ.",
    telefono: "അന്താരാഷ്ട്ര E.164 രൂപം, ഉദാഹരണം +34600112233.",
    correo: "ഈ ഉൽപ്പാദകന്റെ പൊതുസമ്പർക്ക വിലാസം.",
    web: "ഉൽപ്പാദകന്റെ ഔദ്യോഗിക HTTP(S) വെബ്‌സൈറ്റ്.",
    Facebook: "ഔദ്യോഗിക Facebook പേജിന്റെ URL.",
    Instagram: "ഔദ്യോഗിക Instagram പ്രൊഫൈലിന്റെ URL.",
    "Google Maps": "ഉൽപ്പാദന യൂണിറ്റിന്റെ പരിശോധിച്ച Google Maps ലിസ്റ്റിംഗ്.",
    lat: "WGS84 ദശാംശ അക്ഷാംശം. അക്ഷാംശവും രേഖാംശവും ഒരുമിച്ച് നൽകണം.",
    lon: "WGS84 ദശാംശ രേഖാംശം. അക്ഷാംശവും രേഖാംശവും ഒരുമിച്ച് നൽകണം.",
    "Venta online": "നിലവിലെ ഓർഡർ സംവിധാനം പരിശോധിച്ചിട്ടുണ്ടോ എന്നത്.",
    "Canal de venta": "നിലവിൽ തെളിയിച്ചിട്ടുള്ള ഓർഡർ മാർഗങ്ങൾ.",
    "visitas guiadas":
      "ഉൽപ്പാദകൻ നിലവിൽ ഗൈഡഡ് സന്ദർശനങ്ങൾ നൽകുന്നുണ്ടോ എന്നത്.",
    "mensaje a la comunidad":
      "പ്രാദേശിക ഭക്ഷ്യ സമൂഹത്തോടുള്ള ഉൽപ്പാദകന്റെ പൊതുസന്ദേശം.",
    mensaje_comunidad_locale:
      "സമൂഹ സന്ദേശത്തിന്റെ ഉറവിട ഭാഷ; സന്ദേശം ശൂന്യമെങ്കിൽ മാത്രം ശൂന്യമായി വിടുക.",
    "enlace destacado 1":
      "ഉൽപ്പാദകൻ തിരഞ്ഞെടുത്ത ഒരു അധിക പൊതു HTTP(S) ലിങ്ക്.",
    "enlace destacado 2":
      "രണ്ടാമത്തെ അധിക പൊതു HTTP(S) ലിങ്ക്; ആദ്യത്തേതിന് ശേഷം മാത്രം ഉപയോഗിക്കുക.",
  },
  common: { unitCount: "{count} {unit}", unavailable: "—" },
  notFound: {
    title: "പേജ് കണ്ടെത്തിയില്ല",
    description: "ആ ഉൽപ്പാദകനോ പേജോ നിലവിലില്ല.",
    backToCatalog: "കാറ്റലോഗിലേക്ക് മടങ്ങുക",
  },
  metadata: {
    homeTitle: "{site} · പ്രാദേശിക ഭക്ഷണം, ഒന്നായി",
    homeDescription:
      "പ്രാദേശിക ഭക്ഷണം, ഒന്നായി. {unit} അനുസരിച്ച് ക്രമീകരിച്ച വിശ്വസനീയമായ കാറ്റലോഗിൽ പ്രാദേശിക ഭക്ഷ്യ-പാനീയ ഉൽപ്പാദകരെ കണ്ടെത്തുക.",
    countryTitle: "{country} · {site} ഉൽപ്പാദകർ",
    countryDescription:
      "പ്രാദേശിക ഉൽപ്പാദകരെ കാണാൻ {country}-യിലെ ഒരു {unit} തിരഞ്ഞെടുക്കുക.",
    areaNotFoundTitle: "പ്രദേശം കണ്ടെത്തിയില്ല",
    areaTitle: "{area}-ലെ ഉൽപ്പാദകർ",
    areaDescription: "{area}, {country}-ലെ പ്രാദേശിക ഉൽപ്പാദകരെ കാണുക.",
    producerNotFoundTitle: "ഉൽപ്പാദകനെ കണ്ടെത്തിയില്ല",
    producerNotFoundDescription: "ആ ഉൽപ്പാദകൻ CSV കാറ്റലോഗിലില്ല.",
    producerDescription:
      "{city}-ലെ {producer}. പ്രാദേശിക ഉൽപ്പന്നങ്ങൾ: {categories}.",
  },
  home: {
    chooseCountry: "ഒരു രാജ്യം തിരഞ്ഞെടുക്കുക",
    countrySummary: "{regions}-ൽ {areas}",
    aboutKicker: "Chisan-നെക്കുറിച്ച്",
    aboutDescription:
      "പ്രാദേശിക ഭക്ഷണത്തിനായി പങ്കിട്ട കണ്ടെത്തൽ പാളി Chisan നിർമ്മിക്കുകയാണ്: സ്വന്തം സമൂഹങ്ങളിൽ വേരൂന്നിയ ഭക്ഷണ-പാനീയ ഉൽപ്പാദകരെ കണ്ടെത്താനും മനസ്സിലാക്കാനും അവരുമായി ബന്ധപ്പെടാനും ഒരിടം.",
    aboutCatalogDescription:
      "സുതാര്യമായ CSV കാറ്റലോഗ് തന്നെ സത്യത്തിന്റെ ഉറവിടമായി തുടരുന്നു. Chisan വികസിക്കുമ്പോഴും കാറ്റലോഗ് പ്രയോജനകരവും വിശ്വസനീയവും തുറന്നതുമായി തുടരാൻ വെബ്, അക്കൗണ്ടുകൾ, അവലോകനം ചെയ്ത സംഭാവനാ പ്രവാഹങ്ങൾ എന്നിവ അതിനെ ചുറ്റിപ്പറ്റി വളരുന്നു.",
  },
  locationOnboarding: {
    title: "നിങ്ങളുടെ കാറ്റലോഗ് പ്രദേശം കണ്ടെത്തുക",
    description:
      "നിങ്ങളുടെ അനുമതിയോടെ, ഉൾപ്പെടുത്തിയിട്ടുള്ള പ്രദേശം കണ്ടെത്താൻ Chisan ഈ ബ്രൗസറിൽ നിങ്ങളുടെ സ്ഥാനം പരിശോധിക്കുന്നു. നിങ്ങളുടെ സ്ഥാനം അയയ്ക്കുകയോ സംരക്ഷിക്കുകയോ ചെയ്യുന്നില്ല.",
    useLocation: "എന്റെ സ്ഥാനം ഉപയോഗിക്കുക",
    chooseManually: "സ്വമേധയാ തിരഞ്ഞെടുക്കുക",
    locating: "നിങ്ങളുടെ പ്രദേശം പരിശോധിക്കുന്നു…",
    dismissed: "സ്ഥാനം ഐച്ഛികമാണ്. നിങ്ങൾക്ക് ഇഷ്ടമുള്ളപ്പോൾ ഉപയോഗിക്കാം.",
    errors: {
      permissionDenied:
        "സ്ഥാനാനുമതി നിരസിച്ചു. ഒരു പ്രദേശം സ്വമേധയാ തിരഞ്ഞെടുക്കുക.",
      timeout:
        "സ്ഥാനം കണ്ടെത്താൻ അധികസമയം എടുത്തു. ഒരു പ്രദേശം സ്വമേധയാ തിരഞ്ഞെടുക്കുക.",
      unavailable: "സ്ഥാനം ലഭ്യമല്ല. ഒരു പ്രദേശം സ്വമേധയാ തിരഞ്ഞെടുക്കുക.",
      outside:
        "നിങ്ങളുടെ സ്ഥാനം നിലവിലെ ലൊക്കേഷൻ പരിധിക്ക് പുറത്താണ്. സ്വമേധയാ തിരഞ്ഞെടുക്കുക.",
      ambiguous:
        "മതിയായ ഉറപ്പോടെ ഒരു പ്രദേശം നിർണ്ണയിക്കാനായില്ല. സ്വമേധയാ തിരഞ്ഞെടുക്കുക.",
      loadFailed:
        "അതിർത്തി ഡാറ്റ ലോഡ് ചെയ്യാനായില്ല. ഒരു പ്രദേശം സ്വമേധയാ തിരഞ്ഞെടുക്കുക.",
    },
  },
  country: { chooseUnit: "ഒരു {unit} തിരഞ്ഞെടുക്കുക" },
  areaSelector: {
    label: "{unit}",
    placeholder: "ഒരു {unit} തിരഞ്ഞെടുക്കുക",
    submit: "പ്രദേശം തുറക്കുക",
  },
  catalog: {
    title: "ഉൽപ്പാദകരുടെ മാപ്പ്",
    summary: "{area} · {producers} · {mapped}",
    producersFound: {
      one: "{count} ഉൽപ്പാദകനെ കണ്ടെത്തി",
      other: "{count} ഉൽപ്പാദകരെ കണ്ടെത്തി",
    },
    mapped: { one: "മാപ്പിൽ {count}", other: "മാപ്പിൽ {count}" },
    categories: "വിഭാഗങ്ങൾ",
    allCategories: "എല്ലാം",
    selected: "തിരഞ്ഞെടുത്തത്",
    seeAll: "എല്ലാം കാണുക",
    openProfile: "പ്രൊഫൈൽ തുറക്കുക",
    producers: "ഉൽപ്പാദകർ",
    showing: "ആകെ {total}-ൽ {visible} കാണിക്കുന്നു",
    totalInArea: { one: "{area}-ൽ ആകെ {count}", other: "{area}-ൽ ആകെ {count}" },
    details: "വിശദാംശങ്ങൾ",
    emptyCategory: "{area}-ൽ ഈ വിഭാഗത്തിൽ ഉൽപ്പാദകരില്ല.",
  },
  map: {
    loading: "മാപ്പ് ലോഡ് ചെയ്യുന്നു…",
    emptyCoordinates: "ഈ തിരഞ്ഞെടുപ്പിൽ സാധുവായ കോർഡിനേറ്റുകളില്ല.",
    producerMap: "ഉൽപ്പാദകരുടെ മാപ്പ്",
    producers: "ഉൽപ്പാദകർ",
    openProfile: "പ്രൊഫൈൽ തുറക്കുക",
  },
  producer: {
    backToMap: "മാപ്പിലേക്ക് മടങ്ങുക",
    profile: "ഉൽപ്പാദകന്റെ പ്രൊഫൈൽ",
    expandedProfile: "വിപുലീകരിച്ച പ്രൊഫൈൽ",
    website: "വെബ്‌സൈറ്റ്",
    googleMaps: "Google Maps",
    phone: "ഫോൺ",
    email: "ഇമെയിൽ",
    imageAlt: "{producer}-ന്റെ ചിത്രം",
    location: "സ്ഥലം",
    mapAria: "{producer}-നെ കാണിക്കുന്ന മാപ്പ്",
    details: "വിശദാംശങ്ങൾ",
    field: "ഫീൽഡ്",
    value: "മൂല്യം",
    navigation: "നാവിഗേഷൻ",
    map: "മാപ്പ്",
    categories: "വിഭാഗങ്ങൾ",
    allCategories: "എല്ലാം",
    information: "വിവരം",
  },
  fieldLabels: {
    slug: "Slug",
    producerId: "ഉൽപ്പാദക ID",
    name: "പേര്",
    municipality: "മുനിസിപ്പാലിറ്റി",
    category: "വിഭാഗം",
    additionalCategories: "അധിക വിഭാഗങ്ങൾ",
    featuredProducts: "പ്രധാന ഉൽപ്പന്നങ്ങൾ",
    address: "വിലാസം",
    description: "വിവരണം",
    descriptionLocale: "വിവരണത്തിന്റെ ഭാഷ",
    guidedVisits: "ഗൈഡഡ് സന്ദർശനങ്ങൾ",
    communityMessage: "സമൂഹത്തോടുള്ള സന്ദേശം",
    communityMessageLocale: "സമൂഹ സന്ദേശത്തിന്റെ ഭാഷ",
    highlightedLink1: "പ്രധാന ലിങ്ക് 1",
    highlightedLink2: "പ്രധാന ലിങ്ക് 2",
    openingHours: "തുറക്കുന്ന സമയം",
    phone: "ഫോൺ",
    email: "ഇമെയിൽ",
    website: "വെബ്",
    image: "ചിത്രം",
    onlineSales: "ഓൺലൈൻ വിൽപ്പന",
    salesChannels: "വിൽപ്പന മാർഗങ്ങൾ",
    facebook: "Facebook",
    instagram: "Instagram",
    googleMaps: "Google Maps",
    latitude: "അക്ഷാംശം",
    longitude: "രേഖാംശം",
    verification: "പരിശോധന",
  },
  controlledValues: {
    verification: {
      pendiente: "തീർപ്പാക്കാത്തത്",
    },
    onlineSales: {
      sí: "അതെ",
      no: "ഇല്ല",
      "no comprobado": "പരിശോധിച്ചിട്ടില്ല",
    },
    salesChannels: {
      ecommerce: "ഓൺലൈൻ കട",
      whatsapp: "WhatsApp",
      email: "ഇമെയിൽ",
      telefono: "ഫോൺ",
      suscripcion: "സബ്സ്ക്രിപ്ഷൻ",
      marketplace: "മാർക്കറ്റ്‌പ്ലേസ്",
    },
  },
} satisfies Messages;

export default messages;
