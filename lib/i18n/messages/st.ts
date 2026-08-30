import type { Messages } from "../messages";

const messages = {
  languageName: "Sesotho",
  languageSwitcher: { label: "Puo" },
  siteHeader: {
    tagline: "Lijo tsa lehae, li kopane",
    accountNavigation: "Akhaonto",
    signIn: "Kena",
    register: "Ngolisa",
    myAccount: "Akhaonto ea ka",
    greeting: "Lumela, {name}",
    favorites: "Tse ratoang",
    signOut: "Tsoa",
  },
  siteFooter: {
    navigation: "Tsamaiso ea botlaaseng",
    aboutLink: "Kamoo Chisan e sebetsang kateng",
    catalogLink: "Lenane la bahlahisi",
    contactLink: "Ikopanye",
  },
  accountActions: {
    ownershipVerifiedDescription:
      "Profaele ena e tsekiloe le ho netefatsoa ke mohlahisi.",
    saveOrClaimPrompt: "Boloka mohlahisi enoa kapa u tseke botho.",
    signIn: "Kena",
    createAccount: "Theha akhaonto",
    removeFavorite: "Tlosa ho tseo ke li ratang",
    saveFavorite: "Boloka seo ke se ratang",
    editMyProfile: "Fetola profaele ea ka",
    expandProfile: "Atolosa profaele",
    ownershipVerified: "E netefalitsoe ke mohlahisi",
    viewOwnershipClaim: "Sheba tseko ea botho",
    claimProducer: "Tseka mohlahisi enoa",
    descriptionLanguage: {
      none: "Ha ho puo ea tlhaloso",
      names: {
        en: "Senyesemane",
        es: "Sepanishe",
        ca: "Sekatalane",
        de: "Sejeremane",
        ja: "Sejapane",
        fr: "Sefora",
        it: "Setaliana",
        nl: "Sedache",
        pt: "Sepotoketsi",
        gl: "Segalicia",
        eu: "Sebasque",
      },
    },
  },
  ownerProducerFieldHelp: {
    nombre: "Lebitso la sechaba la mohlahisi kapa letšoao.",
    municipio: "Toropo ea yuniti ea tlhahiso, eseng ofisi ea thekiso.",
    categoria: "Sehlahisoa se seholo sa mohlahisi.",
    "categorias adicionales":
      "Lihlahisoa tse ling tse entsoeng ke yuniti ena ea tlhahiso.",
    "productos estrella":
      "Lenane le lekhutšoanyane la lihlahisoa, matšoao kapa mabitso a lihlahisoa.",
    descripcion:
      "Tlhahisoleseding ea nnete ka mohlahisi, ntle le lipolelo tsa papatso.",
    descripcion_locale:
      "Puo ea mohloli ea tlhaloso ea mantlha; e tlohele e se na letho feela haeba tlhaloso e se na letho.",
    "visitas guiadas":
      "Hore na mohlahisi o fana ka maeto a tataiso hona joale.",
    "mensaje a la comunidad":
      "Molaetsa oa sechaba oa mohlahisi o eang sechabeng.",
    mensaje_comunidad_locale:
      "Puo ea mohloli ea molaetsa oa sechaba; e tlohele e se na letho feela haeba molaetsa o se na letho.",
    "enlace destacado 1":
      "Sehokelo sa pele se hlahelletseng sa HTTP(S), joalo ka sengoloa sa litaba.",
    "enlace destacado 2":
      "Sehokelo sa bobeli se hlahelletseng sa HTTP(S), joalo ka sengoloa sa litaba.",
    direccion:
      "Aterese ea yuniti ea tlhahiso kapa sebaka se amohelang mohlahisi.",
    horario: "Lihora tsa hajoale tsa ketelo, pokello kapa ho bulela sechaba.",
    telefono: "Sebopeho sa machaba sa E.164, mohlala +34600112233.",
    correo: "Aterese ea puisano ea sechaba ea mohlahisi enoa.",
    web: "Webosaete ea semmuso ea mohlahisi ea HTTP(S).",
    Facebook: "URL ea leqephe la semmuso la Facebook.",
    Instagram: "URL ea profaele ea semmuso ea Instagram.",
    "Google Maps":
      "Lenane le hlahlobiloeng la Google Maps la yuniti ea tlhahiso.",
    lat: "Latitude ea desimali ea WGS84. Latitude le longitude li tlameha ho fanoa hammoho.",
    lon: "Longitude ea desimali ea WGS84. Latitude le longitude li tlameha ho fanoa hammoho.",
    "Venta online": "Hore na mokhoa oa hajoale oa ho odara o hlahlobiloe.",
    "Canal de venta": "Mekhoa ea hajoale ea ho odara e bontšitsoeng.",
  },
  common: { unitCount: "{count} {unit}", unavailable: "—" },
  notFound: {
    title: "Leqephe ha le fumanehe",
    description: "Mohlahisi kapa leqephe leo ha le eo.",
    backToCatalog: "Khutlela lenaneng",
  },
  metadata: {
    homeTitle: "{site} · Lijo tsa lehae, li kopane",
    homeDescription:
      "Lijo tsa lehae, li kopane. Sibolla bahlahisi ba lijo le lino tsa libaka lenaneng le le leng le tšepahalang, le hlophisitsoeng ka {unit}.",
    countryTitle: "{country} · Bahlahisi ba {site}",
    countryDescription:
      "Khetha {unit} ea {country} ho sheba bahlahisi ba eona ba lehae.",
    areaNotFoundTitle: "Sebaka ha se fumanehe",
    areaTitle: "Bahlahisi ba {area}",
    areaDescription: "Sheba bahlahisi ba lehae ba {area}, {country}.",
    producerNotFoundTitle: "Mohlahisi ha a fumanehe",
    producerNotFoundDescription: "Mohlahisi eo ha a eo lenaneng la CSV.",
    producerDescription:
      "{producer} ho {city}. Lihlahisoa tsa lehae: {categories}.",
  },
  home: {
    chooseCountry: "Khetha naha",
    countrySummary: "{areas} ho {regions}",
    aboutKicker: "Ka Chisan",
    aboutDescription:
      "Chisan e haha mokato o arolelanoang oa ho sibolla lijo tsa lehae: sebaka se le seng sa ho fumana, ho utloisisa le ho hokahana le bahlahisi ba lijo le lino ba metseng ea bona.",
    aboutCatalogDescription:
      "Khathaloko e bonaletsang ea CSV e ntse e le mohloli oa ’nete. Webe, liakhaonto le mekhoa ea menehelo e hlahlobiloeng lia hōla ho e potoloha, e le hore khathaloko e lule e le molemo, e tšepahala ebile e bulehile ha Chisan e ntse e hola.",
  },
  locationOnboarding: {
    title: "Fumana sebaka sa lenane la hau",
    description:
      "Ka tumello ea hau, Chisan e hlahloba sebaka sa hau ho sebatli sena ho fumana sebaka se koahetsoeng. Boemo ba hau ha bo romeloe kapa ho bolokoa.",
    useLocation: "Sebelisa sebaka sa ka",
    chooseManually: "Khetha ka letsoho",
    locating: "E hlahloba sebaka sa hau…",
    dismissed: "Sebaka ke boikhethelo. U ka se sebelisa neng kapa neng.",
    errors: {
      permissionDenied: "Tumello ea sebaka e hanne. Khetha sebaka ka letsoho.",
      timeout: "Ho fumana sebaka ho nkile nako e telele. Khetha ka letsoho.",
      unavailable: "Sebaka ha se fumanehe. Khetha sebaka ka letsoho.",
      outside:
        "Boemo ba hau bo kantle ho tšireletso ea hajoale ea sebaka. Khetha ka letsoho.",
      ambiguous:
        "Ha rea khona ho tseba sebaka se le seng ka bonnete bo lekaneng. Khetha ka letsoho.",
      loadFailed:
        "Lintlha tsa meeli ha lia khona ho laeloa. Khetha sebaka ka letsoho.",
    },
  },
  country: { chooseUnit: "Khetha {unit}" },
  areaSelector: {
    label: "{unit}",
    placeholder: "Khetha {unit}",
    submit: "Bula sebaka",
  },
  catalog: {
    title: "'Mapa oa bahlahisi",
    summary: "{area} · {producers} · {mapped}",
    producersFound: {
      one: "Mohlahisi ea {count} o fumanoe",
      other: "Ho fumanoe bahlahisi ba {count}",
    },
    mapped: { one: "{count} 'mapeng", other: "{count} 'mapeng" },
    categories: "Lihlopha",
    allCategories: "Tsohle",
    selected: "E khethiloe",
    seeAll: "Sheba tsohle",
    openProfile: "Bula profaele",
    producers: "Bahlahisi",
    showing: "E bontša {visible} ho {total}",
    totalInArea: {
      one: "{count} kaofela ho {area}",
      other: "{count} kaofela ho {area}",
    },
    details: "Lintlha",
    emptyCategory: "Ha ho bahlahisi ba sehlopha sena ho {area}.",
  },
  map: {
    loading: "'Mapa oa laeloa…",
    emptyCoordinates: "Ha ho likhokahano tse nepahetseng khethong ena.",
    producerMap: "'Mapa oa bahlahisi",
    producers: "Bahlahisi",
    openProfile: "Bula profaele",
  },
  producer: {
    backToMap: "Khutlela 'mapeng",
    profile: "Profaele ea mohlahisi",
    website: "Webosaete",
    googleMaps: "Google Maps",
    phone: "Mohala",
    email: "Imeile",
    imageAlt: "Setšoantšo sa {producer}",
    location: "Sebaka",
    mapAria: "'Mapa o bontša {producer}",
    details: "Lintlha",
    field: "Tšimo",
    value: "Boleng",
    navigation: "Tsamaiso",
    map: "'Mapa",
    categories: "Lihlopha",
    allCategories: "Tsohle",
    information: "Tlhahisoleseding",
    expandedProfile: "Profaele e atolositsoeng",
  },
  fieldLabels: {
    slug: "Slug",
    producerId: "ID ea mohlahisi",
    name: "Lebitso",
    municipality: "Toropo",
    category: "Sehlopha",
    additionalCategories: "Lihlopha tse ling",
    featuredProducts: "Lihlahisoa tse hlahelletseng",
    address: "Aterese",
    description: "Tlhaloso",
    descriptionLocale: "Puo ea tlhaloso",
    guidedVisits: "Maeto a tataiso",
    communityMessage: "Molaetsa ho sechaba",
    communityMessageLocale: "Puo ea molaetsa oa sechaba",
    highlightedLink1: "Sehokelo se hlahelletseng 1",
    highlightedLink2: "Sehokelo se hlahelletseng 2",
    openingHours: "Lihora tsa ho bula",
    phone: "Mohala",
    email: "Imeile",
    website: "Webosaete",
    image: "Setšoantšo",
    onlineSales: "Thekiso ea inthanete",
    salesChannels: "Likanale tsa thekiso",
    facebook: "Facebook",
    instagram: "Instagram",
    googleMaps: "Google Maps",
    latitude: "Latitšhute",
    longitude: "Longitšhute",
    verification: "Netefatso",
  },
  controlledValues: {
    verification: {
      pendiente: "E emetse",
    },
    onlineSales: { sí: "E", no: "Che", "no comprobado": "Ha ea hlahlojoa" },
    salesChannels: {
      ecommerce: "Lebenkele la inthanete",
      whatsapp: "WhatsApp",
      email: "Imeile",
      telefono: "Mohala",
      suscripcion: "Ngoliso",
      marketplace: "Mmaraka",
    },
  },
} satisfies Messages;

export default messages;
