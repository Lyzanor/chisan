import type { Messages } from "../messages";

const messages = {
  languageName: "తెలుగు",
  languageSwitcher: { label: "భాష" },
  siteHeader: {
    tagline: "స్థానిక ఆహారం, సమైక్యంగా",
    accountNavigation: "ఖాతా",
    signIn: "సైన్ ఇన్ చేయండి",
    register: "నమోదు చేయండి",
    myAccount: "నా ఖాతా",
    greeting: "నమస్కారం, {name}",
    favorites: "ఇష్టమైనవి",
    signOut: "సైన్ అవుట్ చేయండి",
  },
  siteFooter: {
    navigation: "ఫుటర్ నావిగేషన్",
    aboutLink: "Chisan ఎలా పనిచేస్తుంది",
    catalogLink: "ఉత్పత్తిదారుల కేటలాగ్",
    contactLink: "సంప్రదించండి",
  },
  accountActions: {
    ownershipVerifiedDescription:
      "ఈ ప్రొఫైల్‌ను ఉత్పత్తిదారు క్లెయిమ్ చేసి ధృవీకరించారు.",
    saveOrClaimPrompt:
      "ఈ ఉత్పత్తిదారును భద్రపరచండి లేదా యాజమాన్యాన్ని క్లెయిమ్ చేయండి.",
    signIn: "సైన్ ఇన్ చేయండి",
    createAccount: "ఖాతా సృష్టించండి",
    removeFavorite: "ఇష్టమైన వాటి నుంచి తొలగించండి",
    saveFavorite: "ఇష్టమైన వాటిలో భద్రపరచండి",
    editMyProfile: "నా ప్రొఫైల్‌ను సవరించండి",
    expandProfile: "ప్రొఫైల్‌ను విస్తరించండి",
    ownershipVerified: "ఉత్పత్తిదారుచే ధృవీకరించబడింది",
    viewOwnershipClaim: "యాజమాన్య క్లెయిమ్‌ను చూడండి",
    claimProducer: "ఈ ఉత్పత్తిదారు యాజమాన్యాన్ని క్లెయిమ్ చేయండి",
    descriptionLanguage: {
      none: "వివరణ భాష లేదు",
      names: {
        en: "ఇంగ్లీష్",
        es: "స్పానిష్",
        ca: "కాటలాన్",
        de: "జర్మన్",
        ja: "జపనీస్",
        fr: "ఫ్రెంచ్",
        it: "ఇటాలియన్",
        nl: "డచ్",
        pt: "పోర్చుగీస్",
        gl: "గలీషియన్",
        eu: "బాస్క్",
      },
    },
  },
  ownerProducerFieldHelp: {
    nombre: "ఉత్పత్తిదారు లేదా బ్రాండ్ యొక్క బహిరంగ పేరు.",
    municipio: "అమ్మకపు కార్యాలయానిది కాదు; ఉత్పత్తి యూనిట్ ఉన్న మునిసిపాలిటీ.",
    categoria: "ఉత్పత్తిదారు తయారుచేసే ప్రధాన భౌతిక ఉత్పత్తి.",
    "categorias adicionales":
      "ఇదే ఉత్పత్తి యూనిట్ తయారుచేసే ఇతర భౌతిక ఉత్పత్తులు.",
    "productos estrella":
      "నిర్దిష్ట ఉత్పత్తులు, బ్రాండ్‌లు లేదా పేర్ల సంక్షిప్త జాబితా.",
    descripcion:
      "ప్రచార వాదనలు లేకుండా ఉత్పత్తిదారుకు సంబంధించిన వాస్తవ సమాచారం.",
    descripcion_locale:
      "కానానికల్ వివరణ యొక్క మూల భాష; వివరణ ఖాళీగా ఉన్నప్పుడే ఖాళీగా ఉంచండి.",
    "visitas guiadas":
      "ఉత్పత్తిదారు ప్రస్తుతం మార్గదర్శక పర్యటనలు అందిస్తున్నారా అనే విషయం.",
    "mensaje a la comunidad":
      "సమాజానికి ఉత్పత్తిదారు అందించే బహిరంగ సందేశం.",
    mensaje_comunidad_locale:
      "సమాజ సందేశం యొక్క మూల భాష; సందేశం ఖాళీగా ఉన్నప్పుడే ఖాళీగా ఉంచండి.",
    "enlace destacado 1":
      "వార్తా కథనం వంటి మొదటి అదనపు ప్రముఖ HTTP(S) లింక్.",
    "enlace destacado 2":
      "వార్తా కథనం వంటి రెండవ అదనపు ప్రముఖ HTTP(S) లింక్.",
    direccion: "ఉత్పత్తి యూనిట్ లేదా ప్రజలకు తెరిచి ఉన్న ప్రాంగణం చిరునామా.",
    horario: "ప్రస్తుత సందర్శన, సేకరణ లేదా ప్రజలకు తెరిచి ఉండే సమయాలు.",
    telefono: "అంతర్జాతీయ E.164 రూపం, ఉదాహరణకు +34600112233.",
    correo: "ఈ ఉత్పత్తిదారుకు సంబంధించిన బహిరంగ సంప్రదింపు చిరునామా.",
    web: "ఉత్పత్తిదారు అధికారిక HTTP(S) వెబ్‌సైట్.",
    Facebook: "అధికారిక Facebook పేజీ URL.",
    Instagram: "అధికారిక Instagram ప్రొఫైల్ URL.",
    "Google Maps": "ఉత్పత్తి యూనిట్‌కు సమీక్షించిన Google Maps జాబితా.",
    lat: "WGS84 దశాంశ అక్షాంశం. అక్షాంశం, రేఖాంశం రెండూ కలిసి ఇవ్వాలి.",
    lon: "WGS84 దశాంశ రేఖాంశం. అక్షాంశం, రేఖాంశం రెండూ కలిసి ఇవ్వాలి.",
    "Venta online": "ప్రస్తుత ఆర్డర్ విధానం సమీక్షించబడిందా అనే విషయం.",
    "Canal de venta": "ప్రస్తుతం నిరూపించబడిన ఆర్డర్ విధానాలు.",
  },
  common: { unitCount: "{count} {unit}", unavailable: "—" },
  notFound: {
    title: "పేజీ కనబడలేదు",
    description: "ఆ ఉత్పత్తిదారు లేదా పేజీ ఉనికిలో లేదు.",
    backToCatalog: "కేటలాగ్‌కు తిరిగి వెళ్లండి",
  },
  metadata: {
    homeTitle: "{site} · స్థానిక ఆహారం, సమైక్యంగా",
    homeDescription:
      "స్థానిక ఆహారం, సమైక్యంగా. {unit} ఆధారంగా క్రమబద్ధీకరించిన విశ్వసనీయ కేటలాగ్‌లో స్థానిక ఆహార, పానీయాల ఉత్పత్తిదారులను కనుగొనండి.",
    countryTitle: "{country} · {site} ఉత్పత్తిదారులు",
    countryDescription:
      "స్థానిక ఉత్పత్తిదారులను చూడటానికి {country}లోని ఒక {unit}ను ఎంచుకోండి.",
    areaNotFoundTitle: "ప్రాంతం కనబడలేదు",
    areaTitle: "{area} ఉత్పత్తిదారులు",
    areaDescription: "{area}, {country}లోని స్థానిక ఉత్పత్తిదారులను చూడండి.",
    producerNotFoundTitle: "ఉత్పత్తిదారు కనబడలేదు",
    producerNotFoundDescription: "ఆ ఉత్పత్తిదారు CSV కేటలాగ్‌లో లేరు.",
    producerDescription:
      "{city}లోని {producer}. స్థానిక ఉత్పత్తులు: {categories}.",
  },
  home: {
    chooseCountry: "ఒక దేశాన్ని ఎంచుకోండి",
    countrySummary: "{regions}లో {areas}",
    aboutKicker: "Chisan గురించి",
    aboutDescription:
      "స్థానిక ఆహారం కోసం Chisan ఒక భాగస్వామ్య అన్వేషణ పొరను నిర్మిస్తోంది: తమ సముదాయాల్లో వేళ్లూనుకున్న ఆహార, పానీయ ఉత్పత్తిదారులను కనుగొని, అర్థం చేసుకుని, వారితో అనుసంధానమయ్యే ఒకే స్థలం.",
    aboutCatalogDescription:
      "పారదర్శకమైన CSV కేటలాగ్ సత్యానికి మూల వనరుగా కొనసాగుతుంది. Chisan విస్తరిస్తున్న కొద్దీ కేటలాగ్ ఉపయోగకరంగా, విశ్వసనీయంగా, తెరవబడి ఉండేలా వెబ్, ఖాతాలు, సమీక్షించిన సహకార ప్రవాహాలు దాని చుట్టూ అభివృద్ధి చెందుతాయి.",
  },
  locationOnboarding: {
    title: "మీ కేటలాగ్ ప్రాంతాన్ని కనుగొనండి",
    description:
      "మీ అనుమతితో, కవరేజీలో ఉన్న ప్రాంతాన్ని కనుగొనడానికి Chisan ఈ బ్రౌజర్‌లో మీ స్థానాన్ని తనిఖీ చేస్తుంది. మీ స్థానం పంపబడదు లేదా భద్రపరచబడదు.",
    useLocation: "నా స్థానాన్ని ఉపయోగించండి",
    chooseManually: "మాన్యువల్‌గా ఎంచుకోండి",
    locating: "మీ ప్రాంతాన్ని తనిఖీ చేస్తోంది…",
    dismissed: "స్థానం ఐచ్ఛికం. మీకు నచ్చినప్పుడు ఉపయోగించవచ్చు.",
    errors: {
      permissionDenied:
        "స్థాన అనుమతి నిరాకరించబడింది. ప్రాంతాన్ని మాన్యువల్‌గా ఎంచుకోండి.",
      timeout:
        "స్థానాన్ని కనుగొనడానికి ఎక్కువ సమయం పట్టింది. ప్రాంతాన్ని మాన్యువల్‌గా ఎంచుకోండి.",
      unavailable:
        "స్థానం అందుబాటులో లేదు. ప్రాంతాన్ని మాన్యువల్‌గా ఎంచుకోండి.",
      outside:
        "మీ స్థానం ప్రస్తుత లొకేషన్ కవరేజీకి వెలుపల ఉంది. మాన్యువల్‌గా ఎంచుకోండి.",
      ambiguous:
        "తగినంత నిశ్చయంతో ఒక ప్రాంతాన్ని నిర్ణయించలేకపోయాం. మాన్యువల్‌గా ఎంచుకోండి.",
      loadFailed:
        "సరిహద్దు డేటాను లోడ్ చేయలేకపోయాం. ప్రాంతాన్ని మాన్యువల్‌గా ఎంచుకోండి.",
    },
  },
  country: { chooseUnit: "ఒక {unit}ను ఎంచుకోండి" },
  areaSelector: {
    label: "{unit}",
    placeholder: "ఒక {unit}ను ఎంచుకోండి",
    submit: "ప్రాంతాన్ని తెరవండి",
  },
  catalog: {
    title: "ఉత్పత్తిదారుల మ్యాప్",
    summary: "{area} · {producers} · {mapped}",
    producersFound: {
      one: "{count} ఉత్పత్తిదారు కనుగొనబడ్డారు",
      other: "{count} ఉత్పత్తిదారులు కనుగొనబడ్డారు",
    },
    mapped: { one: "మ్యాప్‌లో {count}", other: "మ్యాప్‌లో {count}" },
    categories: "వర్గాలు",
    allCategories: "అన్నీ",
    emptyMapView: "ఈ మ్యాప్ వీక్షణలో ఉత్పత్తిదారులు ఎవరూ కనిపించడం లేదు.",
    openProfile: "ప్రొఫైల్‌ను తెరవండి",
    producers: "ఉత్పత్తిదారులు",
    searchPlaceholder: "ఉత్పత్తిదారులను వెతకండి",
    showing: "మొత్తం {total}లో {visible} చూపిస్తోంది",
    totalInArea: {
      one: "{area}లో మొత్తం {count}",
      other: "{area}లో మొత్తం {count}",
    },
    details: "వివరాలు",
    emptyCategory: "{area}లో ఈ వర్గానికి ఉత్పత్తిదారులు లేరు.",
  },
  map: {
    loading: "మ్యాప్ లోడ్ అవుతోంది…",
    emptyCoordinates: "ఈ ఎంపికలో చెల్లుబాటు అయ్యే కోఆర్డినేట్లు లేవు.",
    producerMap: "ఉత్పత్తిదారుల మ్యాప్",
    producers: "ఉత్పత్తిదారులు",
    openProfile: "ప్రొఫైల్‌ను తెరవండి",
  },
  producer: {
    profile: "ఉత్పత్తిదారు ప్రొఫైల్",
    website: "వెబ్‌సైట్",
    googleMaps: "Google Maps",
    phone: "ఫోన్",
    email: "ఇమెయిల్",
    imageAlt: "{producer} చిత్రం",
    location: "స్థానం",
    mapAria: "{producer}ను చూపిస్తున్న మ్యాప్",
    details: "వివరాలు",
    field: "ఫీల్డ్",
    value: "విలువ",
    navigation: "నావిగేషన్",
    map: "మ్యాప్",
    categories: "వర్గాలు",
    allCategories: "అన్నీ",
    information: "సమాచారం",
    expandedProfile: "విస్తరించిన ప్రొఫైల్",
  },
  fieldLabels: {
    slug: "Slug",
    producerId: "ఉత్పత్తిదారు ID",
    name: "పేరు",
    municipality: "మునిసిపాలిటీ",
    category: "వర్గం",
    additionalCategories: "అదనపు వర్గాలు",
    featuredProducts: "ప్రత్యేక ఉత్పత్తులు",
    address: "చిరునామా",
    description: "వివరణ",
    descriptionLocale: "వివరణ భాష",
    guidedVisits: "మార్గదర్శక పర్యటనలు",
    communityMessage: "సమాజానికి సందేశం",
    communityMessageLocale: "సమాజ సందేశం భాష",
    highlightedLink1: "ప్రముఖ లింక్ 1",
    highlightedLink2: "ప్రముఖ లింక్ 2",
    openingHours: "తెరిచి ఉండే సమయాలు",
    phone: "ఫోన్",
    email: "ఇమెయిల్",
    website: "వెబ్",
    image: "చిత్రం",
    onlineSales: "ఆన్‌లైన్ అమ్మకాలు",
    salesChannels: "అమ్మకాల మార్గాలు",
    facebook: "Facebook",
    instagram: "Instagram",
    googleMaps: "Google Maps",
    latitude: "అక్షాంశం",
    longitude: "రేఖాంశం",
    verification: "ధృవీకరణ",
  },
  controlledValues: {
    verification: {
      pendiente: "పెండింగ్‌లో ఉంది",
    },
    onlineSales: { sí: "అవును", no: "కాదు", "no comprobado": "తనిఖీ చేయలేదు" },
    salesChannels: {
      ecommerce: "ఆన్‌లైన్ దుకాణం",
      whatsapp: "WhatsApp",
      email: "ఇమెయిల్",
      telefono: "ఫోన్",
      suscripcion: "చందా",
      marketplace: "మార్కెట్‌ప్లేస్",
    },
  },
} satisfies Messages;

export default messages;
