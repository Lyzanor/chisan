import type { Messages } from "../messages";

const messages = {
  languageName: "Gàidhlig",
  languageSwitcher: { label: "Cànan" },
  siteHeader: {
    tagline: "Biadh ionadail, aonaichte",
    accountNavigation: "Cunntas",
    signIn: "Clàraich a-steach",
    register: "Clàraich",
    myAccount: "Mo chunntas",
    greeting: "Halò, {name}",
    favorites: "An fheadhainn as fheàrr",
    signOut: "Clàraich a-mach",
  },
  siteFooter: {
    navigation: "Seòladh na coise",
    aboutLink: "Ar n-adhbhar",
    catalogLink: "Catalog nan riochdairean",
    contactLink: "Cuir fios thugainn air GitHub",
  },
  accountActions: {
    ownershipVerifiedDescription:
      "Chaidh am pròifil seo a thagradh agus a dhearbhadh leis an riochdaire.",
    saveOrClaimPrompt: "Sàbhail an riochdaire seo no tagair seilbh air.",
    signIn: "Clàraich a-steach",
    createAccount: "Cruthaich cunntas",
    removeFavorite: "Thoir air falbh am fear as fheàrr leat",
    saveFavorite: "Sàbhail mar fhear as fheàrr leat",
    editMyProfile: "Deasaich mo phròifil",
    expandProfile: "Leudaich a' phròifil",
    ownershipVerified: "Air a dhearbhadh leis an riochdaire",
    viewOwnershipClaim: "Faic tagradh na seilbhe",
    claimProducer: "Tagair an riochdaire seo",
    descriptionLanguage: {
      none: "Gun chànan tuairisgeul",
      names: {
        en: "Beurla",
        es: "Spàinntis",
        ca: "Catalanais",
        de: "Gearmailtis",
        ja: "Seapanais",
        fr: "Fraingis",
        it: "Eadailtis",
        nl: "Duitseis",
        pt: "Portagailis",
        gl: "Gailisis",
        eu: "Basgais",
      },
    },
  },
  ownerProducerFieldHelp: {
    nombre: "Ainm poblach an riochdaire no a’ bhrand.",
    municipio: "Baile an aonaid riochdachaidh, chan e oifis reic.",
    categoria: "Prìomh thoradh stuthail an riochdaire.",
    "categorias adicionales":
      "Toraidhean stuthail eile a nì an aon aonad riochdachaidh seo.",
    "productos estrella":
      "Liosta ghoirid de thoraidhean, bhrandaichean no ainmean sònraichte.",
    descripcion:
      "Fiosrachadh fìrinneach mun riochdaire shònraichte, gun tagraidhean sanasachd.",
    descripcion_locale:
      "Cànan tùsail an tuairisgeul chanonaich; fàg bàn e dìreach nuair a tha an tuairisgeul bàn.",
    direccion:
      "Seòladh an aonaid riochdachaidh no nan togalach a tha fosgailte don phoball.",
    horario:
      "Na h-uairean làithreach airson tadhal, cruinneachadh no fosgladh don phoball.",
    telefono: "Cruth eadar-nàiseanta E.164, mar eisimpleir +34600112233.",
    correo: "Seòladh conaltraidh poblach airson an riochdaire seo.",
    web: "Làrach-lìn oifigeil HTTP(S) an riochdaire.",
    Facebook: "URL duilleag Facebook oifigeil.",
    Instagram: "URL pròifil Instagram oifigeil.",
    "Google Maps":
      "Liostadh Google Maps ath-sgrùdaichte airson na h-aonad riochdachaidh.",
    lat: "Domhan-leud deicheach WGS84. Feumar domhan-leud agus domhan-fhad a thoirt seachad còmhla.",
    lon: "Domhan-fhad deicheach WGS84. Feumar domhan-leud agus domhan-fhad a thoirt seachad còmhla.",
    "Venta online": "A bheil dòigh òrdachaidh làithreach air a sgrùdadh.",
    "Canal de venta": "Dòighean òrdachaidh làithreach a chaidh a dhearbhadh.",
    "visitas guiadas":
      "A bheil an riochdaire a’ tabhann tursan treòraichte an-dràsta.",
    "mensaje a la comunidad":
      "Teachdaireachd phoblach bhon riochdaire gu coimhearsnachd a’ bhìdh ionadail.",
    mensaje_comunidad_locale:
      "Cànan tùsail teachdaireachd na coimhearsnachd; fàg bàn e dìreach nuair a tha an teachdaireachd bàn.",
    "enlace destacado 1":
      "Ceangal poblach HTTP(S) a bharrachd a thagh an riochdaire.",
    "enlace destacado 2":
      "Dàrna ceangal poblach HTTP(S) a bharrachd; cleachd e dìreach às dèidh a’ chiad fhear.",
  },
  common: { unitCount: "{count} {unit}", unavailable: "—" },
  notFound: {
    title: "Cha deach an duilleag a lorg",
    description: "Chan eil an riochdaire no an duilleag seo ann.",
    backToCatalog: "Air ais don catalog",
  },
  metadata: {
    homeTitle: "{site} · Biadh ionadail, aonaichte",
    homeDescription:
      "Biadh ionadail, aonaichte. Lorg riochdairean bìdh is dibhe ionadail ann an aon catalog earbsach, air an cur air dòigh a rèir {unit}.",
    countryTitle: "Riochdairean {country} · {site}",
    countryDescription:
      "Tagh {unit} de {country} gus na riochdairean ionadail aige a bhrabhsadh.",
    areaNotFoundTitle: "Cha deach an sgìre a lorg",
    areaTitle: "Riochdairean {area}",
    areaDescription:
      "Brabhsaich riochdairean ionadail ann an {area}, {country}.",
    producerNotFoundTitle: "Cha deach an riochdaire a lorg",
    producerNotFoundDescription:
      "Chan eil an riochdaire seo ann an catalog CSV.",
    producerDescription:
      "{producer} ann an {city}. Toraidhean ionadail: {categories}.",
  },
  home: {
    chooseCountry: "Tagh dùthaich",
    countrySummary: "{areas} ann an {regions}",
    aboutKicker: "Mu Chisan",
    aboutDescription:
      "Tha Chisan a’ togail sreath cho-roinnte lorgaidh airson biadh ionadail: aon àite gus riochdairean bìdh is dibhe a tha freumhaichte sna coimhearsnachdan aca a lorg, a thuigsinn agus ceangal a dhèanamh riutha.",
    aboutCatalogDescription:
      "Tha catalog CSV follaiseach fhathast na thùs na fìrinn. Bidh an lìon, cunntasan agus sruthan tabhartasan ath-sgrùdaichte a’ fàs timcheall air gus am faod an catalog fuireach feumail, earbsach agus fosgailte mar a leudaicheas Chisan.",
  },
  locationOnboarding: {
    title: "Lorg do sgìre chatalog",
    description:
      "Le do chead, bidh Chisan a’ sgrùdadh d’ àite sa bhrabhsair seo gus sgìre a tha fo chòmhdach a lorg. Cha tèid d’ àite a chur no a shàbhaladh.",
    useLocation: "Cleachd m’ àite",
    chooseManually: "Tagh le làimh",
    manualCountryLabel: "Dùthaich",
    manualCountryPlaceholder: "Tagh dùthaich",
    manualAreaLabel: "Sgìre chatalog",
    manualAreaPlaceholder: "Tagh sgìre chatalog",
    locating: "A’ sgrùdadh do sgìre…",
    dismissed:
      "Tha an t-àite roghainneil. Faodaidh tu a chleachdadh uair sam bith a thogras tu.",
    savedTitle: "Lean air adhart san sgìre agad a chaidh a shàbhaladh",
    savedDescription: "Shàbhail thu {area} mar an sgìre Chisan agad.",
    continueInArea: "Lean air adhart ann an {area}",
    changeArea: "Tagh sgìre eile",
    forgetArea: "Dìochuimhnich an sgìre a chaidh a shàbhaladh",
    errors: {
      permissionDenied: "Chaidh cead an àite a dhiùltadh. Tagh sgìre le làimh.",
      timeout: "Thug an t-àite ro fhada. Tagh sgìre le làimh.",
      unavailable: "Chan eil an t-àite ri fhaighinn. Tagh sgìre le làimh.",
      outside:
        "Tha d’ àite taobh a-muigh a’ chòmhdaich làithrich. Tagh le làimh.",
      ambiguous:
        "Cha b’ urrainn dhuinn aon sgìre a dhearbhadh le cinnt gu leòr. Tagh le làimh.",
      loadFailed:
        "Cha b’ urrainn dhuinn dàta nan crìochan a luchdadh. Tagh sgìre le làimh.",
    },
  },
  country: { chooseUnit: "Tagh {unit}" },
  areaSelector: {
    label: "{unit}",
    placeholder: "Tagh {unit}",
    submit: "Fosgail an sgìre",
  },
  catalog: {
    title: "Mapa nan riochdairean",
    summary: "{area} · {producers} · {mapped}",
    producersFound: {
      one: "Chaidh {count} riochdaire a lorg",
      other: "Chaidh {count} riochdairean a lorg",
    },
    mapped: { one: "{count} air a’ mhapa", other: "{count} air a’ mhapa" },
    categories: "Roinnean",
    allCategories: "Uile",
    selected: "Air a thaghadh",
    seeAll: "Faic na h-uile",
    openProfile: "Fosgail pròifil",
    producers: "Riochdairean",
    showing: "A’ sealltainn {visible} de {total}",
    totalInArea: {
      one: "{count} uile gu lèir ann an {area}",
      other: "{count} uile gu lèir ann an {area}",
    },
    details: "Mion-fhiosrachadh",
    emptyCategory: "Chan eil riochdairean san roinn seo airson {area}.",
  },
  map: {
    loading: "A’ luchdadh a’ mhapa…",
    emptyCoordinates: "Chan eil co-chomharran dligheach san taghadh seo.",
    producerMap: "Mapa nan riochdairean",
    producers: "Riochdairean",
    openProfile: "Fosgail pròifil",
  },
  producer: {
    backToMap: "Air ais chun mhapa",
    profile: "Pròifil an riochdaire",
    expandedProfile: "Pròifil leudaichte",
    website: "Làrach-lìn",
    googleMaps: "Google Maps",
    phone: "Fòn",
    email: "Post-d",
    imageAlt: "Ìomhaigh de {producer}",
    location: "Àite",
    mapAria: "Mapa a’ sealltainn {producer}",
    details: "Mion-fhiosrachadh",
    field: "Raon",
    value: "Luach",
    navigation: "Seòladh",
    map: "Mapa",
    categories: "Roinnean",
    allCategories: "Uile",
    information: "Fiosrachadh",
  },
  fieldLabels: {
    slug: "Slug",
    producerId: "ID an riochdaire",
    name: "Ainm",
    municipality: "Baile",
    category: "Roinn",
    additionalCategories: "Roinnean a bharrachd",
    featuredProducts: "Toraidhean sònraichte",
    address: "Seòladh",
    description: "Tuairisgeul",
    descriptionLocale: "Cànan an tuairisgeul",
    guidedVisits: "Tursan treòraichte",
    communityMessage: "Teachdaireachd dhan choimhearsnachd",
    communityMessageLocale: "Cànan teachdaireachd na coimhearsnachd",
    highlightedLink1: "Ceangal sònraichte 1",
    highlightedLink2: "Ceangal sònraichte 2",
    openingHours: "Uairean fosglaidh",
    phone: "Fòn",
    email: "Post-d",
    website: "Làrach-lìn",
    image: "Ìomhaigh",
    onlineSales: "Reic air-loidhne",
    salesChannels: "Sianalan reic",
    facebook: "Facebook",
    instagram: "Instagram",
    googleMaps: "Google Maps",
    latitude: "Domhan-leud",
    longitude: "Domhan-fhad",
    verification: "Dearbhadh",
  },
  controlledValues: {
    verification: {
      pendiente: "A’ feitheamh",
    },
    onlineSales: { sí: "Tha", no: "Chan eil", "no comprobado": "Gun sgrùdadh" },
    salesChannels: {
      ecommerce: "Bùth air-loidhne",
      whatsapp: "WhatsApp",
      email: "Post-d",
      telefono: "Fòn",
      suscripcion: "Fo-sgrìobhadh",
      marketplace: "Margaidh",
    },
  },
} satisfies Messages;

export default messages;
