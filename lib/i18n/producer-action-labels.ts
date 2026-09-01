import type { Locale } from "./locales";

export type ProducerActionLabels = Readonly<{
  buyOnline: string;
  directions: string;
  call: string;
  contact: string;
}>;

const PRODUCER_ACTION_LABELS = {
  en: { buyOnline: "Buy online", directions: "Directions", call: "Call", contact: "Contact" },
  es: { buyOnline: "Comprar online", directions: "Cómo llegar", call: "Llamar", contact: "Contactar" },
  ca: { buyOnline: "Comprar en línia", directions: "Com arribar-hi", call: "Trucar", contact: "Contactar" },
  de: { buyOnline: "Online kaufen", directions: "Route", call: "Anrufen", contact: "Kontakt" },
  ja: { buyOnline: "オンラインで購入", directions: "行き方", call: "電話する", contact: "お問い合わせ" },
  fr: { buyOnline: "Acheter en ligne", directions: "Itinéraire", call: "Appeler", contact: "Contacter" },
  it: { buyOnline: "Acquista online", directions: "Indicazioni", call: "Chiama", contact: "Contatta" },
  nl: { buyOnline: "Online kopen", directions: "Route", call: "Bellen", contact: "Contact" },
  pt: { buyOnline: "Comprar online", directions: "Como chegar", call: "Ligar", contact: "Contactar" },
  af: { buyOnline: "Koop aanlyn", directions: "Aanwysings", call: "Bel", contact: "Kontak" },
  as: { buyOnline: "অনলাইন কিনক", directions: "দিশ-নিৰ্দেশ", call: "ফোন কৰক", contact: "যোগাযোগ কৰক" },
  bn: { buyOnline: "অনলাইনে কিনুন", directions: "দিকনির্দেশ", call: "কল করুন", contact: "যোগাযোগ" },
  cy: { buyOnline: "Prynu ar-lein", directions: "Cyfarwyddiadau", call: "Ffonio", contact: "Cysylltu" },
  ga: { buyOnline: "Ceannaigh ar líne", directions: "Treoracha", call: "Glaoigh", contact: "Teagmháil" },
  gd: { buyOnline: "Ceannaich air-loidhne", directions: "Stiùiridhean", call: "Cuir fòn", contact: "Cuir fios" },
  gu: { buyOnline: "ઑનલાઇન ખરીદો", directions: "દિશાઓ", call: "કૉલ કરો", contact: "સંપર્ક કરો" },
  haw: { buyOnline: "Kūʻai ma ka pūnaewele", directions: "Kuhikuhi ala", call: "Kelepona", contact: "Hoʻokaʻaʻike" },
  hi: { buyOnline: "ऑनलाइन खरीदें", directions: "रास्ता देखें", call: "कॉल करें", contact: "संपर्क करें" },
  kn: { buyOnline: "ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಖರೀದಿಸಿ", directions: "ದಿಕ್ಕುಗಳು", call: "ಕರೆ ಮಾಡಿ", contact: "ಸಂಪರ್ಕಿಸಿ" },
  kok: { buyOnline: "ऑनलायन विकत घेवचें", directions: "दिका", call: "फोन करात", contact: "संपर्क" },
  ml: { buyOnline: "ഓൺലൈനായി വാങ്ങുക", directions: "വഴി", call: "വിളിക്കുക", contact: "ബന്ധപ്പെടുക" },
  mr: { buyOnline: "ऑनलाइन खरेदी करा", directions: "दिशा", call: "कॉल करा", contact: "संपर्क साधा" },
  ne: { buyOnline: "अनलाइन किन्नुहोस्", directions: "दिशा", call: "फोन गर्नुहोस्", contact: "सम्पर्क गर्नुहोस्" },
  nso: { buyOnline: "Reka inthaneteng", directions: "Ditšhupetšo", call: "Letša mogala", contact: "Ikgokaganye" },
  or: { buyOnline: "ଅନଲାଇନ୍ କିଣନ୍ତୁ", directions: "ଦିଗନିର୍ଦ୍ଦେଶ", call: "କଲ୍ କରନ୍ତୁ", contact: "ଯୋଗାଯୋଗ କରନ୍ତୁ" },
  pa: { buyOnline: "ਆਨਲਾਈਨ ਖਰੀਦੋ", directions: "ਦਿਸ਼ਾਵਾਂ", call: "ਕਾਲ ਕਰੋ", contact: "ਸੰਪਰਕ ਕਰੋ" },
  ss: { buyOnline: "Tsenga ku-inthanethi", directions: "Tikhombandlela", call: "Shaya lucingo", contact: "Tsintsana" },
  st: { buyOnline: "Reka inthaneteng", directions: "Litsela", call: "Letsetsa", contact: "Ikopanye" },
  ta: { buyOnline: "இணையத்தில் வாங்குங்கள்", directions: "வழிகாட்டல்", call: "அழைக்கவும்", contact: "தொடர்புகொள்ளவும்" },
  te: { buyOnline: "ఆన్‌లైన్‌లో కొనండి", directions: "దిశలు", call: "కాల్ చేయండి", contact: "సంప్రదించండి" },
  tn: { buyOnline: "Reka mo inthaneteng", directions: "Dikaelo", call: "Letsa", contact: "Ikgolaganye" },
  xh: { buyOnline: "Thenga kwi-intanethi", directions: "Izalathiso", call: "Fowuna", contact: "Qhagamshelana" },
  zu: { buyOnline: "Thenga ku-inthanethi", directions: "Izikhombisi-ndlela", call: "Shaya ucingo", contact: "Xhumana" },
} as const satisfies Record<Locale, ProducerActionLabels>;

export function getProducerActionLabels(locale: Locale): ProducerActionLabels {
  return PRODUCER_ACTION_LABELS[locale];
}
