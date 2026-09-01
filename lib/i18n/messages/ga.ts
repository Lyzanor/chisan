import type { Messages } from "../messages";

const messages = {
  languageName: "Gaeilge",
  languageSwitcher: { label: "Teanga" },
  siteHeader: {
    tagline: "Bia áitiúil, aontaithe",
    accountNavigation: "Cuntas",
    signIn: "Logáil isteach",
    register: "Cláraigh",
    myAccount: "Mo chuntas",
    greeting: "Dia dhuit, {name}",
    favorites: "Ceanáin",
    signOut: "Logáil amach",
  },
  siteFooter: {
    navigation: "Nascleanúint an buntásca",
    aboutLink: "Conas a oibríonn Chisan",
    catalogLink: "Catalóg na dtáirgeoirí",
    contactLink: "Teagmháil",
  },
  accountActions: {
    ownershipVerifiedDescription:
      "D'éiligh an táirgeoir an phróifíl seo agus fíoraíodh í.",
    saveOrClaimPrompt: "Sábháil an táirgeoir seo nó éiligh úinéireacht air.",
    signIn: "Logáil isteach",
    createAccount: "Cruthaigh cuntas",
    removeFavorite: "Bain ceanán",
    saveFavorite: "Sábháil mar cheanán",
    editMyProfile: "Cuir mo phróifíl in eagar",
    expandProfile: "Leathnaigh an phróifíl",
    ownershipVerified: "Fíoraithe ag an táirgeoir",
    viewOwnershipClaim: "Féach ar éileamh úinéireachta",
    claimProducer: "Éiligh an táirgeoir seo",
    descriptionLanguage: {
      none: "Gan teanga tuairisce",
      names: {
        en: "Béarla",
        es: "Spáinnis",
        ca: "Catalóinis",
        de: "Gearmáinis",
        ja: "Seapáinis",
        fr: "Fraincis",
        it: "Iodáilis",
        nl: "Ollainnis",
        pt: "Portaingéilis",
        gl: "Gailísis",
        eu: "Bascais",
      },
    },
  },
  ownerProducerFieldHelp: {
    nombre: "Ainm poiblí an táirgeora nó an bhranda.",
    municipio: "Bardas an aonaid táirgthe, ní oifig díolacháin.",
    categoria: "Príomhtháirge ábhartha an táirgeora.",
    "categorias adicionales":
      "Táirgí ábhartha eile a dhéanann an t-aonad táirgthe céanna seo.",
    "productos estrella":
      "Liosta gairid de tháirgí, brandaí nó sonrúcháin nithiúla.",
    descripcion:
      "Eolas fíorasach sonrach faoin táirgeoir, gan éilimh chur chun cinn.",
    descripcion_locale:
      "Teanga foinse an tuairisc chanónaigh; fág folamh é ach amháin nuair atá an tuairisc folamh.",
    direccion:
      "Seoladh an aonaid táirgthe nó an áitribh atá os comhair an phobail.",
    horario: "Uaireanta reatha cuairte, bailithe nó oscailte don phobal.",
    telefono: "Formáid idirnáisiúnta E.164, mar shampla +34600112233.",
    correo: "Seoladh teagmhála poiblí don táirgeoir seo.",
    web: "Suíomh gréasáin oifigiúil HTTP(S) an táirgeora.",
    Facebook: "URL leathanach oifigiúil Facebook.",
    Instagram: "URL próifíle oifigiúil Instagram.",
    "Google Maps": "Liostú Google Maps athbhreithnithe don aonad táirgthe.",
    lat: "Domhanleithead deachúil WGS84. Ní mór domhanleithead agus domhanfhad a sholáthar le chéile.",
    lon: "Domhanfhad deachúil WGS84. Ní mór domhanleithead agus domhanfhad a sholáthar le chéile.",
    "Venta online": "An ndearnadh meicníocht ordaithe reatha a athbhreithniú.",
    "Canal de venta": "Meicníochtaí ordaithe reatha a léiríodh.",
    "visitas guiadas":
      "An gcuireann an táirgeoir turais threoraithe ar fáil faoi láthair.",
    "mensaje a la comunidad":
      "Teachtaireacht phoiblí ón táirgeoir chuig pobal an bhia áitiúil.",
    mensaje_comunidad_locale:
      "Teanga foinse na teachtaireachta pobail; fág folamh í ach amháin nuair atá an teachtaireacht folamh.",
    "enlace destacado 1":
      "Nasc poiblí breise HTTP(S) arna roghnú ag an táirgeoir.",
    "enlace destacado 2":
      "An dara nasc poiblí breise HTTP(S); ná húsáid ach i ndiaidh an chéad cheann.",
  },
  common: { unitCount: "{count} {unit}", unavailable: "—" },
  notFound: {
    title: "Níor aimsíodh an leathanach",
    description: "Níl an táirgeoir ná an leathanach seo ann.",
    backToCatalog: "Fill ar an gcatalóg",
  },
  metadata: {
    homeTitle: "{site} · Bia áitiúil, aontaithe",
    homeDescription:
      "Bia áitiúil, aontaithe. Faigh táirgeoirí bia agus dí áitiúla i gcatalóg iontaofa amháin, eagraithe de réir {unit}.",
    countryTitle: "Táirgeoirí {country} · {site}",
    countryDescription:
      "Roghnaigh {unit} de {country} chun a tháirgeoirí áitiúla a bhrabhsáil.",
    areaNotFoundTitle: "Níor aimsíodh an ceantar",
    areaTitle: "Táirgeoirí {area}",
    areaDescription: "Brabhsáil táirgeoirí áitiúla in {area}, {country}.",
    producerNotFoundTitle: "Níor aimsíodh an táirgeoir",
    producerNotFoundDescription: "Níl an táirgeoir seo i gcatalóg CSV.",
    producerDescription: "{producer} i {city}. Táirgí áitiúla: {categories}.",
  },
  home: {
    chooseCountry: "Roghnaigh tír",
    countrySummary: "{areas} i {regions}",
    aboutKicker: "Maidir le Chisan",
    aboutDescription:
      "Tá Chisan ag tógáil sraith chomhroinnte fionnachtana do bhia áitiúil: áit amháin chun táirgeoirí bia agus dí atá fréamhaithe ina bpobail a aimsiú, a thuiscint agus teagmháil a dhéanamh leo.",
    aboutCatalogDescription:
      "Fanann catalóg thrédhearcach CSV mar fhoinse na fírinne. Fásann an gréasán, na cuntais agus na sreafaí ranníocaíochtaí athbhreithnithe timpeall uirthi ionas gur féidir leis an gcatalóg fanacht úsáideach, iontaofa agus oscailte de réir mar a leathnaíonn Chisan.",
  },
  locationOnboarding: {
    title: "Faigh do cheantar catalóige",
    description:
      "Le do chead, seiceálann Chisan do shuíomh sa bhrabhsálaí seo chun ceantar clúdaithe a aimsiú. Ní sheoltar ná ní shábháiltear do shuíomh.",
    useLocation: "Úsáid mo shuíomh",
    chooseManually: "Roghnaigh de láimh",
    locating: "Do cheantar á sheiceáil…",
    dismissed:
      "Tá an suíomh roghnach. Is féidir leat é a úsáid aon uair is mian leat.",
    errors: {
      permissionDenied: "Diúltaíodh cead suímh. Roghnaigh ceantar de láimh.",
      timeout: "Thóg an suíomh ró-fhada. Roghnaigh ceantar de láimh.",
      unavailable: "Níl an suíomh ar fáil. Roghnaigh ceantar de láimh.",
      outside:
        "Tá do shuíomh lasmuigh den chlúdach reatha. Roghnaigh de láimh.",
      ambiguous:
        "Ní rabhamar in ann ceantar amháin a chinneadh le dóthain cinnteachta. Roghnaigh de láimh.",
      loadFailed:
        "Níorbh fhéidir sonraí na dteorainneacha a luchtú. Roghnaigh ceantar de láimh.",
    },
  },
  country: { chooseUnit: "Roghnaigh {unit}" },
  areaSelector: {
    label: "{unit}",
    placeholder: "Roghnaigh {unit}",
    submit: "Oscail an ceantar",
  },
  catalog: {
    title: "Léarscáil na dtáirgeoirí",
    summary: "{area} · {producers} · {mapped}",
    producersFound: {
      one: "Aimsíodh {count} táirgeoir",
      other: "Aimsíodh {count} táirgeoir",
    },
    mapped: {
      one: "{count} ar an léarscáil",
      other: "{count} ar an léarscáil",
    },
    categories: "Catagóirí",
    allCategories: "Uile",
    showMore: "Taispeáin tuilleadh",
    showMapOnly: "Taispeáin iad siúd ar an léarscáil amháin",
    emptyMapView: "Níl aon táirgeoirí le feiceáil san amharc léarscáile seo.",
    openProfile: "Oscail próifíl",
    producers: "Táirgeoirí",
    showing: "{visible} de {total} á dtaispeáint",
    totalInArea: {
      one: "{count} san iomlán in {area}",
      other: "{count} san iomlán in {area}",
    },
    details: "Sonraí",
    emptyCategory: "Níl táirgeoirí sa chatagóir seo le haghaidh {area}.",
  },
  map: {
    loading: "Léarscáil á luchtú…",
    emptyCoordinates: "Níl comhordanáidí bailí sa roghnú seo.",
    producerMap: "Léarscáil na dtáirgeoirí",
    producers: "Táirgeoirí",
    openProfile: "Oscail próifíl",
  },
  producer: {
    backToMap: "Fill ar an léarscáil",
    profile: "Próifíl an táirgeora",
    expandedProfile: "Próifíl leathnaithe",
    website: "Suíomh gréasáin",
    googleMaps: "Google Maps",
    phone: "Fón",
    email: "Ríomhphost",
    imageAlt: "Íomhá de {producer}",
    location: "Suíomh",
    mapAria: "Léarscáil ag taispeáint {producer}",
    details: "Sonraí",
    field: "Réimse",
    value: "Luach",
    navigation: "Nascleanúint",
    map: "Léarscáil",
    categories: "Catagóirí",
    allCategories: "Uile",
    information: "Eolas",
  },
  fieldLabels: {
    slug: "Slug",
    producerId: "ID an táirgeora",
    name: "Ainm",
    municipality: "Bardas",
    category: "Catagóir",
    additionalCategories: "Catagóirí breise",
    featuredProducts: "Táirgí faoi thrácht",
    address: "Seoladh",
    description: "Tuairisc",
    descriptionLocale: "Teanga na tuairisce",
    guidedVisits: "Turais threoraithe",
    communityMessage: "Teachtaireacht don phobal",
    communityMessageLocale: "Teanga na teachtaireachta pobail",
    highlightedLink1: "Nasc faoi thrácht 1",
    highlightedLink2: "Nasc faoi thrácht 2",
    openingHours: "Uaireanta oscailte",
    phone: "Fón",
    email: "Ríomhphost",
    website: "Gréasán",
    image: "Íomhá",
    onlineSales: "Díolacháin ar líne",
    salesChannels: "Cainéil díolacháin",
    facebook: "Facebook",
    instagram: "Instagram",
    googleMaps: "Google Maps",
    latitude: "Domhanleithead",
    longitude: "Domhanfhad",
    verification: "Fíorú",
  },
  controlledValues: {
    verification: {
      pendiente: "Ar feitheamh",
    },
    onlineSales: { sí: "Tá", no: "Níl", "no comprobado": "Gan seiceáil" },
    salesChannels: {
      ecommerce: "Siopa ar líne",
      whatsapp: "WhatsApp",
      email: "Ríomhphost",
      telefono: "Fón",
      suscripcion: "Síntiús",
      marketplace: "Margadh",
    },
  },
} satisfies Messages;

export default messages;
