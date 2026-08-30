import type { Messages } from "../messages";

const messages = {
  languageName: "தமிழ்",
  languageSwitcher: { label: "மொழி" },
  siteHeader: {
    tagline: "உள்ளூர் உணவு, ஒருங்கிணைந்து",
    accountNavigation: "கணக்கு",
    signIn: "உள்நுழைக",
    register: "பதிவு செய்க",
    myAccount: "என் கணக்கு",
    greeting: "வணக்கம், {name}",
    favorites: "பிடித்தவை",
    signOut: "வெளியேறு",
  },
  siteFooter: {
    navigation: "அடிக்குறிப்பு வழிசெலுத்தல்",
    aboutLink: "எங்கள் நோக்கம்",
    catalogLink: "உற்பத்தியாளர் பட்டியல்",
    contactLink: "GitHub-ல் எங்களைத் தொடர்புகொள்க",
  },
  accountActions: {
    ownershipVerifiedDescription:
      "இந்தச் சுயவிவரத்தை உற்பத்தியாளர் உரிமைகோரி சரிபார்த்துள்ளார்.",
    saveOrClaimPrompt:
      "இந்த உற்பத்தியாளரைச் சேமிக்கவும் அல்லது உரிமையைக் கோரவும்.",
    signIn: "உள்நுழைக",
    createAccount: "கணக்கை உருவாக்குக",
    removeFavorite: "பிடித்தவற்றிலிருந்து அகற்றுக",
    saveFavorite: "பிடித்தவற்றில் சேமிக்குக",
    editMyProfile: "என் சுயவிவரத்தைத் திருத்துக",
    expandProfile: "சுயவிவரத்தை விரிவாக்குக",
    ownershipVerified: "உற்பத்தியாளரால் சரிபார்க்கப்பட்டது",
    viewOwnershipClaim: "உரிமைக் கோரிக்கையைப் பார்க்க",
    claimProducer: "இந்த உற்பத்தியாளரின் உரிமையைக் கோருக",
    descriptionLanguage: {
      none: "விவரிப்பு மொழி இல்லை",
      names: {
        en: "ஆங்கிலம்",
        es: "ஸ்பானிஷ்",
        ca: "கட்டலான்",
        de: "ஜெர்மன்",
        ja: "ஜப்பானியம்",
        fr: "பிரெஞ்சு",
        it: "இத்தாலியம்",
        nl: "டச்சு",
        pt: "போர்த்துகீசியம்",
        gl: "கலீசியன்",
        eu: "பாஸ்க்",
      },
    },
  },
  ownerProducerFieldHelp: {
    nombre: "உற்பத்தியாளர் அல்லது பிராண்டின் பொதுப் பெயர்.",
    municipio: "விற்பனை அலுவலகத்தினுடையது அல்ல; உற்பத்தி அலகின் நகராட்சி.",
    categoria: "உற்பத்தியாளரின் முதன்மையான பொருள் உற்பத்தி.",
    "categorias adicionales":
      "இதே உற்பத்தி அலகு தயாரிக்கும் பிற பொருள் உற்பத்திகள்.",
    "productos estrella":
      "குறிப்பிட்ட தயாரிப்புகள், பிராண்டுகள் அல்லது பெயர்களின் சுருக்கப்பட்ட பட்டியல்.",
    descripcion:
      "விளம்பரக் கூற்றுகள் இல்லாத, உற்பத்தியாளர் சார்ந்த உண்மைத் தகவல்.",
    descripcion_locale:
      "மூல விளக்கத்தின் மொழி; விளக்கம் காலியாக இருந்தால் மட்டுமே காலியாக விடுக.",
    "visitas guiadas":
      "உற்பத்தியாளர் தற்போது வழிகாட்டியுடன் கூடிய சுற்றுப்பயணங்களை வழங்குகிறாரா என்பது.",
    "mensaje a la comunidad":
      "சமூகத்திற்கான உற்பத்தியாளரின் பொதுச் செய்தி.",
    mensaje_comunidad_locale:
      "சமூகச் செய்தியின் மூல மொழி; செய்தி காலியாக இருந்தால் மட்டுமே காலியாக விடுக.",
    "enlace destacado 1":
      "செய்திக் கட்டுரை போன்ற முதல் கூடுதல் சிறப்பம்ச HTTP(S) இணைப்பு.",
    "enlace destacado 2":
      "செய்திக் கட்டுரை போன்ற இரண்டாவது கூடுதல் சிறப்பம்ச HTTP(S) இணைப்பு.",
    direccion:
      "உற்பத்தி அலகின் அல்லது பொதுமக்களுக்குத் திறந்திருக்கும் வளாகத்தின் முகவரி.",
    horario: "தற்போதைய பார்வை, சேகரிப்பு அல்லது பொதுத் திறப்பு நேரங்கள்.",
    telefono: "சர்வதேச E.164 வடிவம், எடுத்துக்காட்டு: +34600112233.",
    correo: "இந்த உற்பத்தியாளரின் பொதுத் தொடர்பு முகவரி.",
    web: "உற்பத்தியாளரின் அதிகாரப்பூர்வ HTTP(S) இணையதளம்.",
    Facebook: "அதிகாரப்பூர்வ Facebook பக்க URL.",
    Instagram: "அதிகாரப்பூர்வ Instagram சுயவிவர URL.",
    "Google Maps": "உற்பத்தி அலகிற்கான சரிபார்க்கப்பட்ட Google Maps பட்டியல்.",
    lat: "WGS84 தசம அட்சரேகை. அட்சரேகையும் தீர்க்கரேகையும் ஒன்றாக வழங்கப்பட வேண்டும்.",
    lon: "WGS84 தசம தீர்க்கரேகை. அட்சரேகையும் தீர்க்கரேகையும் ஒன்றாக வழங்கப்பட வேண்டும்.",
    "Venta online":
      "தற்போதைய ஆர்டர் செய்யும் வழிமுறை சரிபார்க்கப்பட்டதா என்பதைக் குறிக்கும்.",
    "Canal de venta": "தற்போது உறுதிப்படுத்தப்பட்ட ஆர்டர் செய்யும் வழிமுறைகள்.",
  },
  common: { unitCount: "{count} {unit}", unavailable: "—" },
  notFound: {
    title: "பக்கம் கிடைக்கவில்லை",
    description: "அந்த உற்பத்தியாளரோ பக்கமோ இல்லை.",
    backToCatalog: "பட்டியலுக்குத் திரும்புக",
  },
  metadata: {
    homeTitle: "{site} · உள்ளூர் உணவு, ஒருங்கிணைந்து",
    homeDescription:
      "உள்ளூர் உணவு, ஒருங்கிணைந்து. {unit} அடிப்படையில் ஒழுங்கமைக்கப்பட்ட நம்பகமான பட்டியலில் உள்ளூர் உணவு மற்றும் பான உற்பத்தியாளர்களைக் கண்டறியுங்கள்.",
    countryTitle: "{country} · {site} உற்பத்தியாளர்கள்",
    countryDescription:
      "உள்ளூர் உற்பத்தியாளர்களை உலாவ {country}-இன் ஒரு {unit}-ஐத் தேர்ந்தெடுக்கவும்.",
    areaNotFoundTitle: "பகுதி கிடைக்கவில்லை",
    areaTitle: "{area} உற்பத்தியாளர்கள்",
    areaDescription:
      "{area}, {country}-இன் உள்ளூர் உற்பத்தியாளர்களை உலாவுங்கள்.",
    producerNotFoundTitle: "உற்பத்தியாளர் கிடைக்கவில்லை",
    producerNotFoundDescription: "அந்த உற்பத்தியாளர் CSV பட்டியலில் இல்லை.",
    producerDescription:
      "{city}-இல் {producer}. உள்ளூர் தயாரிப்புகள்: {categories}.",
  },
  home: {
    chooseCountry: "ஒரு நாட்டைத் தேர்ந்தெடுக்கவும்",
    countrySummary: "{regions}-இல் {areas}",
    aboutKicker: "Chisan பற்றி",
    aboutDescription:
      "உள்ளூர் உணவுக்கான பகிரப்பட்ட கண்டறிதல் அடுக்கை Chisan உருவாக்குகிறது: தங்கள் சமூகங்களில் வேரூன்றிய உணவு மற்றும் பான உற்பத்தியாளர்களைக் கண்டறிந்து, புரிந்துகொண்டு, அவர்களுடன் இணைய ஒரே இடம்.",
    aboutCatalogDescription:
      "வெளிப்படையான CSV பட்டியல் தொடர்ந்து உண்மைக்கான ஆதாரமாக உள்ளது. Chisan விரிவடையும் போது பட்டியல் பயனுள்ளதாகவும் நம்பகமானதாகவும் திறந்ததாகவும் நீடிக்க, இணையம், கணக்குகள் மற்றும் மதிப்பாய்வு செய்யப்பட்ட பங்களிப்பு ஓட்டங்கள் அதைச் சுற்றி வளர்கின்றன.",
  },
  locationOnboarding: {
    title: "உங்கள் பட்டியல் பகுதியைக் கண்டறியுங்கள்",
    description:
      "உங்கள் அனுமதியுடன், உள்ளடக்கப்பட்ட பகுதியைக் கண்டறிய இந்த உலாவியில் உங்கள் இருப்பிடத்தை Chisan சரிபார்க்கிறது. உங்கள் நிலை அனுப்பப்படவோ சேமிக்கப்படவோ இல்லை.",
    useLocation: "என் இருப்பிடத்தைப் பயன்படுத்து",
    chooseManually: "கைமுறையாகத் தேர்ந்தெடு",
    locating: "உங்கள் பகுதி சரிபார்க்கப்படுகிறது…",
    dismissed:
      "இருப்பிடம் விருப்பத்திற்குரியது. நீங்கள் விரும்பும்போது இதைப் பயன்படுத்தலாம்.",
    errors: {
      permissionDenied:
        "இருப்பிட அனுமதி மறுக்கப்பட்டது. ஒரு பகுதியைக் கைமுறையாகத் தேர்ந்தெடுக்கவும்.",
      timeout:
        "இருப்பிடத்தைக் கண்டறிய அதிக நேரம் எடுத்தது. ஒரு பகுதியைக் கைமுறையாகத் தேர்ந்தெடுக்கவும்.",
      unavailable:
        "இருப்பிடம் கிடைக்கவில்லை. ஒரு பகுதியைக் கைமுறையாகத் தேர்ந்தெடுக்கவும்.",
      outside:
        "உங்கள் நிலை தற்போதைய இருப்பிடக் கவரேஜுக்கு வெளியே உள்ளது. கைமுறையாகத் தேர்ந்தெடுக்கவும்.",
      ambiguous:
        "போதிய உறுதியுடன் ஒரு பகுதியைத் தீர்மானிக்க முடியவில்லை. கைமுறையாகத் தேர்ந்தெடுக்கவும்.",
      loadFailed:
        "எல்லைத் தரவை ஏற்ற முடியவில்லை. ஒரு பகுதியைக் கைமுறையாகத் தேர்ந்தெடுக்கவும்.",
    },
  },
  country: { chooseUnit: "ஒரு {unit}-ஐத் தேர்ந்தெடுக்கவும்" },
  areaSelector: {
    label: "{unit}",
    placeholder: "ஒரு {unit}-ஐத் தேர்ந்தெடுக்கவும்",
    submit: "பகுதியைத் திறக்கவும்",
  },
  catalog: {
    title: "உற்பத்தியாளர் வரைபடம்",
    summary: "{area} · {producers} · {mapped}",
    producersFound: {
      one: "{count} உற்பத்தியாளர் கிடைத்தார்",
      other: "{count} உற்பத்தியாளர்கள் கிடைத்தனர்",
    },
    mapped: { one: "வரைபடத்தில் {count}", other: "வரைபடத்தில் {count}" },
    categories: "வகைகள்",
    allCategories: "அனைத்தும்",
    selected: "தேர்ந்தெடுக்கப்பட்டது",
    seeAll: "அனைத்தையும் காண்க",
    openProfile: "சுயவிவரத்தைத் திறக்கவும்",
    producers: "உற்பத்தியாளர்கள்",
    showing: "மொத்தம் {total}-இல் {visible} காட்டப்படுகிறது",
    totalInArea: {
      one: "{area}-இல் மொத்தம் {count}",
      other: "{area}-இல் மொத்தம் {count}",
    },
    details: "விவரங்கள்",
    emptyCategory: "{area}-இல் இந்த வகையில் உற்பத்தியாளர்கள் இல்லை.",
  },
  map: {
    loading: "வரைபடம் ஏற்றப்படுகிறது…",
    emptyCoordinates: "இந்தத் தேர்வில் சரியான ஆயத்தொலைவுகள் இல்லை.",
    producerMap: "உற்பத்தியாளர் வரைபடம்",
    producers: "உற்பத்தியாளர்கள்",
    openProfile: "சுயவிவரத்தைத் திறக்கவும்",
  },
  producer: {
    backToMap: "வரைபடத்திற்குத் திரும்புக",
    profile: "உற்பத்தியாளர் சுயவிவரம்",
    website: "இணையதளம்",
    googleMaps: "Google Maps",
    phone: "தொலைபேசி",
    email: "மின்னஞ்சல்",
    imageAlt: "{producer}-ன் படம்",
    location: "இருப்பிடம்",
    mapAria: "{producer}-ஐக் காட்டும் வரைபடம்",
    details: "விவரங்கள்",
    field: "புலம்",
    value: "மதிப்பு",
    navigation: "வழிசெலுத்தல்",
    map: "வரைபடம்",
    categories: "வகைகள்",
    allCategories: "அனைத்தும்",
    information: "தகவல்",
    expandedProfile: "விரிவாக்கப்பட்ட சுயவிவரம்",
  },
  fieldLabels: {
    slug: "Slug",
    producerId: "உற்பத்தியாளர் ID",
    name: "பெயர்",
    municipality: "நகராட்சி",
    category: "வகை",
    additionalCategories: "கூடுதல் வகைகள்",
    featuredProducts: "சிறப்புத் தயாரிப்புகள்",
    address: "முகவரி",
    description: "விளக்கம்",
    descriptionLocale: "விவரிப்பு மொழி",
    guidedVisits: "வழிகாட்டியுடன் கூடிய சுற்றுப்பயணங்கள்",
    communityMessage: "சமூகத்திற்கான செய்தி",
    communityMessageLocale: "சமூகச் செய்தியின் மொழி",
    highlightedLink1: "சிறப்பம்ச இணைப்பு 1",
    highlightedLink2: "சிறப்பம்ச இணைப்பு 2",
    openingHours: "திறந்திருக்கும் நேரம்",
    phone: "தொலைபேசி",
    email: "மின்னஞ்சல்",
    website: "வலை",
    image: "படம்",
    onlineSales: "ஆன்லைன் விற்பனை",
    salesChannels: "விற்பனை வழிகள்",
    facebook: "Facebook",
    instagram: "Instagram",
    googleMaps: "Google Maps",
    latitude: "அட்சரேகை",
    longitude: "தீர்க்கரேகை",
    verification: "சரிபார்ப்பு",
  },
  controlledValues: {
    verification: {
      pendiente: "நிலுவையில்",
    },
    onlineSales: {
      sí: "ஆம்",
      no: "இல்லை",
      "no comprobado": "சரிபார்க்கப்படவில்லை",
    },
    salesChannels: {
      ecommerce: "ஆன்லைன் கடை",
      whatsapp: "WhatsApp",
      email: "மின்னஞ்சல்",
      telefono: "தொலைபேசி",
      suscripcion: "சந்தா",
      marketplace: "சந்தைத் தளம்",
    },
  },
} satisfies Messages;

export default messages;
