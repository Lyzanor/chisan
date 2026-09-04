import type { Messages } from "../messages";

const messages = {
  languageName: "Cymraeg",
  languageSwitcher: { label: "Iaith" },
  siteHeader: {
    tagline: "Bwyd lleol, unedig",
    accountNavigation: "Cyfrif",
    signIn: "Mewngofnodi",
    register: "Cofrestru",
    myAccount: "Fy nghyfrif",
    greeting: "Helo, {name}",
    favorites: "Ffefrynnau",
    signOut: "Allgofnodi",
  },
  siteFooter: {
    navigation: "Llywio'r troedyn",
    aboutLink: "Sut mae Chisan yn gweithio",
    catalogLink: "Catalog cynhyrchwyr",
    contactLink: "Cyswllt",
  },
  accountActions: {
    ownershipVerifiedDescription:
      "Mae Chisan wedi dilysu’r cysylltiad rhwng y cynhyrchydd hwn a’r sawl sy’n rheoli’r proffil hwn.",
    saveOrClaimPrompt: "Cadwch y cynhyrchydd hwn neu hawliwch berchnogaeth.",
    signIn: "Mewngofnodi",
    createAccount: "Creu cyfrif",
    removeFavorite: "Dileu ffefryn",
    saveFavorite: "Cadw ffefryn",
    editMyProfile: "Golygu fy mhroffil",
    expandProfile: "Ehangu'r proffil",
    ownershipVerified: "Perchnogaeth wedi’i dilysu",
    viewOwnershipClaim: "Gweld hawliad perchnogaeth",
    claimProducer: "Hawlio'r cynhyrchydd hwn",
    descriptionLanguage: {
      none: "Dim iaith disgrifiad",
      names: {
        en: "Saesneg",
        es: "Sbaeneg",
        ca: "Catalaneg",
        de: "Almaeneg",
        ja: "Japaneg",
        fr: "Ffrangeg",
        it: "Eidaleg",
        nl: "Iseldireg",
        pt: "Portiwgaleg",
        gl: "Galisieg",
        eu: "Basgeg",
      },
    },
  },
  ownerProducerFieldHelp: {
    nombre: "Enw cyhoeddus y cynhyrchydd neu'r brand.",
    municipio: "Bwrdeistref yr uned gynhyrchu, nid swyddfa werthu.",
    categoria: "Prif allbwn materol y cynhyrchydd.",
    "categorias adicionales":
      "Allbynnau materol eraill a wneir gan yr uned gynhyrchu hon.",
    "productos estrella":
      "Rhestr fer o gynhyrchion, brandiau neu enwadau penodol.",
    descripcion:
      "Gwybodaeth ffeithiol benodol am y cynhyrchydd, heb honiadau hyrwyddo.",
    descripcion_locale:
      "Iaith ffynhonnell y disgrifiad canonaidd; gadewch yn wag dim ond gyda disgrifiad gwag.",
    direccion:
      "Cyfeiriad yr uned gynhyrchu neu'r adeilad sy'n wynebu'r cyhoedd.",
    horario: "Oriau cyfredol ymweld, casglu neu agor i'r cyhoedd.",
    telefono: "Fformat rhyngwladol E.164, er enghraifft +34600112233.",
    correo: "Cyfeiriad cyswllt cyhoeddus ar gyfer y cynhyrchydd hwn.",
    web: "Gwefan swyddogol HTTP(S) y cynhyrchydd.",
    Facebook: "URL tudalen Facebook swyddogol.",
    Instagram: "URL proffil Instagram swyddogol.",
    "Google Maps": "Rhestr Google Maps a adolygwyd ar gyfer yr uned gynhyrchu.",
    lat: "Lledred degol WGS84. Rhaid darparu lledred a hydred gyda'i gilydd.",
    lon: "Hydred degol WGS84. Rhaid darparu lledred a hydred gyda'i gilydd.",
    "Venta online": "A yw dull archebu cyfredol wedi'i adolygu.",
    "Canal de venta": "Mecanweithiau archebu cyfredol a ddangoswyd.",
    "visitas guiadas": "A yw'r cynhyrchydd yn cynnig teithiau tywys ar hyn o bryd.",
    "mensaje a la comunidad":
      "Neges gyhoeddus gan y cynhyrchydd i'r gymuned fwyd leol.",
    mensaje_comunidad_locale:
      "Iaith ffynhonnell neges y gymuned; gadewch yn wag dim ond pan fo'r neges yn wag.",
    "enlace destacado 1":
      "Dolen HTTP(S) gyhoeddus ychwanegol a ddewiswyd gan y cynhyrchydd.",
    "enlace destacado 2":
      "Ail ddolen HTTP(S) gyhoeddus ychwanegol; defnyddiwch hi ar ôl y gyntaf yn unig.",
  },
  common: { unitCount: "{count} {unit}", unavailable: "—" },
  notFound: {
    title: "Heb ddod o hyd i'r dudalen",
    description: "Nid yw'r cynhyrchydd na'r dudalen hon yn bodoli.",
    backToCatalog: "Nôl i'r catalog",
  },
  metadata: {
    homeTitle: "{site} · Bwyd lleol, unedig",
    homeDescription:
      "Bwyd lleol, unedig. Darganfyddwch gynhyrchwyr bwyd a diod lleol mewn un catalog dibynadwy, wedi'i drefnu yn ôl {unit}.",
    countryTitle: "Cynhyrchwyr {country} · {site}",
    countryDescription:
      "Dewiswch {unit} o {country} i bori ei gynhyrchwyr lleol.",
    areaNotFoundTitle: "Heb ddod o hyd i'r ardal",
    areaTitle: "Cynhyrchwyr {area}",
    areaDescription: "Porwch gynhyrchwyr lleol yn {area}, {country}.",
    producerNotFoundTitle: "Heb ddod o hyd i'r cynhyrchydd",
    producerNotFoundDescription: "Nid yw'r cynhyrchydd hwn yn y catalog CSV.",
    producerDescription:
      "{producer} yn {city}. Cynhyrchion lleol: {categories}.",
  },
  home: {
    chooseCountry: "Dewiswch wlad",
    countrySummary: "{areas} yn {regions}",
    aboutKicker: "Ynglŷn â Chisan",
    aboutDescription:
      "Mae Chisan yn adeiladu haen ddarganfod a rennir ar gyfer bwyd lleol: un lle i ddod o hyd i gynhyrchwyr bwyd a diod sydd wedi gwreiddio yn eu cymunedau, eu deall a chysylltu â nhw.",
    aboutCatalogDescription:
      "Mae catalog CSV tryloyw yn parhau i fod yn ffynhonnell y gwirionedd. Mae'r we, cyfrifon a llifoedd cyfrannu a adolygwyd yn tyfu o'i gwmpas er mwyn i'r catalog allu parhau'n ddefnyddiol, dibynadwy ac agored wrth i Chisan ehangu.",
  },
  locationOnboarding: {
    title: "Dod o hyd i'ch ardal gatalog",
    description:
      "Gyda'ch caniatâd, mae Chisan yn gwirio'ch lleoliad yn y porwr hwn i ddod o hyd i ardal dan sylw. Nid yw'ch safle'n cael ei anfon na'i gadw.",
    useLocation: "Defnyddio fy lleoliad",
    chooseManually: "Dewis â llaw",
    locating: "Gwirio'ch ardal…",
    dismissed:
      "Mae lleoliad yn ddewisol. Gallwch ei ddefnyddio pryd bynnag y dymunwch.",
    errors: {
      permissionDenied: "Gwrthodwyd caniatâd lleoliad. Dewiswch ardal â llaw.",
      timeout: "Cymerodd lleoliad ormod o amser. Dewiswch ardal â llaw.",
      unavailable: "Nid yw'r lleoliad ar gael. Dewiswch ardal â llaw.",
      outside:
        "Mae'ch lleoliad y tu allan i'r cwmpas presennol. Dewiswch â llaw.",
      ambiguous:
        "Nid oedd modd pennu un ardal gyda digon o sicrwydd. Dewiswch â llaw.",
      loadFailed:
        "Nid oedd modd llwytho data'r ffiniau. Dewiswch ardal â llaw.",
    },
  },
  country: { chooseUnit: "Dewiswch {unit}" },
  areaSelector: {
    label: "{unit}",
    placeholder: "Dewiswch {unit}",
    submit: "Agor yr ardal",
  },
  catalog: {
    title: "Map cynhyrchwyr",
    summary: "{area} · {producers} · {mapped}",
    producersFound: {
      one: "Daethpwyd o hyd i {count} gynhyrchydd",
      other: "Daethpwyd o hyd i {count} o gynhyrchwyr",
    },
    mapped: { one: "{count} ar y map", other: "{count} ar y map" },
    categories: "Categorïau",
    allCategories: "Pob un",
    emptyMapView: "Nid oes unrhyw gynhyrchwyr yn weladwy yn yr olygfa map hon.",
    openProfile: "Agor proffil",
    producers: "Cynhyrchwyr",
    searchPlaceholder: "Chwilio cynhyrchwyr",
    showing: "Yn dangos {visible} o {total}",
    totalInArea: {
      one: "Cyfanswm o {count} yn {area}",
      other: "Cyfanswm o {count} yn {area}",
    },
    details: "Manylion",
    emptyCategory: "Dim cynhyrchwyr yn y categori hwn ar gyfer {area}.",
  },
  map: {
    loading: "Llwytho'r map…",
    emptyCoordinates: "Dim cyfesurynnau dilys yn y dewis hwn.",
    producerMap: "Map cynhyrchwyr",
    producers: "Cynhyrchwyr",
    openProfile: "Agor proffil",
  },
  producer: {
    profile: "Proffil y cynhyrchydd",
    expandedProfile: "Proffil estynedig",
    website: "Gwefan",
    googleMaps: "Google Maps",
    phone: "Ffôn",
    email: "E-bost",
    imageAlt: "Delwedd o {producer}",
    location: "Lleoliad",
    mapAria: "Map yn dangos {producer}",
    details: "Manylion",
    field: "Maes",
    value: "Gwerth",
    navigation: "Llywio",
    map: "Map",
    categories: "Categorïau",
    allCategories: "Pob un",
    information: "Gwybodaeth",
  },
  fieldLabels: {
    slug: "Slug",
    producerId: "ID cynhyrchydd",
    name: "Enw",
    municipality: "Bwrdeistref",
    category: "Categori",
    additionalCategories: "Categorïau ychwanegol",
    featuredProducts: "Cynhyrchion dan sylw",
    address: "Cyfeiriad",
    description: "Disgrifiad",
    descriptionLocale: "Iaith y disgrifiad",
    guidedVisits: "Teithiau tywys",
    communityMessage: "Neges i'r gymuned",
    communityMessageLocale: "Iaith neges y gymuned",
    highlightedLink1: "Dolen dan sylw 1",
    highlightedLink2: "Dolen dan sylw 2",
    openingHours: "Oriau agor",
    phone: "Ffôn",
    email: "E-bost",
    website: "Gwe",
    image: "Delwedd",
    onlineSales: "Gwerthiannau ar-lein",
    salesChannels: "Sianeli gwerthu",
    facebook: "Facebook",
    instagram: "Instagram",
    googleMaps: "Google Maps",
    latitude: "Lledred",
    longitude: "Hydred",
    verification: "Dilysiad",
  },
  controlledValues: {
    verification: {
      pendiente: "Yn aros",
    },
    onlineSales: { sí: "Oes", no: "Na", "no comprobado": "Heb ei wirio" },
    salesChannels: {
      ecommerce: "Siop ar-lein",
      whatsapp: "WhatsApp",
      email: "E-bost",
      telefono: "Ffôn",
      suscripcion: "Tanysgrifiad",
      marketplace: "Marchnad",
    },
  },
} satisfies Messages;

export default messages;
