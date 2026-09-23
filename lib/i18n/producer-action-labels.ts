import type { Locale } from "./locales";

export type ProducerActionLabels = Readonly<{
  buyOnline: string;
  directions: string;
  call: string;
  contact: string;
  whatsapp: string;
}>;

const PRODUCER_ACTION_LABELS = {
  en: { buyOnline: "Buy online", directions: "Directions", call: "Call", contact: "Contact", whatsapp: "WhatsApp" },
  es: { buyOnline: "Comprar en la tienda", directions: "Cómo llegar", call: "Llamar", contact: "Contactar", whatsapp: "WhatsApp" },
  ca: { buyOnline: "Comprar a la botiga", directions: "Com arribar-hi", call: "Trucar", contact: "Contactar", whatsapp: "WhatsApp" },
  de: { buyOnline: "Online kaufen", directions: "Route", call: "Anrufen", contact: "Kontakt", whatsapp: "WhatsApp" },
  ja: { buyOnline: "オンラインで購入", directions: "行き方", call: "電話する", contact: "お問い合わせ", whatsapp: "WhatsApp" },
  fr: { buyOnline: "Acheter en ligne", directions: "Itinéraire", call: "Appeler", contact: "Contacter", whatsapp: "WhatsApp" },
  it: { buyOnline: "Acquista online", directions: "Indicazioni", call: "Chiama", contact: "Contatta", whatsapp: "WhatsApp" },
  nl: { buyOnline: "Online kopen", directions: "Route", call: "Bellen", contact: "Contact", whatsapp: "WhatsApp" },
  pt: { buyOnline: "Comprar online", directions: "Como chegar", call: "Ligar", contact: "Contactar", whatsapp: "WhatsApp" },
  af: { buyOnline: "Koop aanlyn", directions: "Aanwysings", call: "Bel", contact: "Kontak", whatsapp: "WhatsApp" },
  as: { buyOnline: "অনলাইন কিনক", directions: "দিশ-নিৰ্দেশ", call: "ফোন কৰক", contact: "যোগাযোগ কৰক", whatsapp: "WhatsApp" },
  bn: { buyOnline: "অনলাইনে কিনুন", directions: "দিকনির্দেশ", call: "কল করুন", contact: "যোগাযোগ", whatsapp: "WhatsApp" },
  cy: { buyOnline: "Prynu ar-lein", directions: "Cyfarwyddiadau", call: "Ffonio", contact: "Cysylltu", whatsapp: "WhatsApp" },
  ga: { buyOnline: "Ceannaigh ar líne", directions: "Treoracha", call: "Glaoigh", contact: "Teagmháil", whatsapp: "WhatsApp" },
  gd: { buyOnline: "Ceannaich air-loidhne", directions: "Stiùiridhean", call: "Cuir fòn", contact: "Cuir fios", whatsapp: "WhatsApp" },
  gu: { buyOnline: "ઑનલાઇન ખરીદો", directions: "દિશાઓ", call: "કૉલ કરો", contact: "સંપર્ક કરો", whatsapp: "WhatsApp" },
  haw: { buyOnline: "Kūʻai ma ka pūnaewele", directions: "Kuhikuhi ala", call: "Kelepona", contact: "Hoʻokaʻaʻike", whatsapp: "WhatsApp" },
  hi: { buyOnline: "ऑनलाइन खरीदें", directions: "रास्ता देखें", call: "कॉल करें", contact: "संपर्क करें", whatsapp: "WhatsApp" },
  kn: { buyOnline: "ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಖರೀದಿಸಿ", directions: "ದಿಕ್ಕುಗಳು", call: "ಕರೆ ಮಾಡಿ", contact: "ಸಂಪರ್ಕಿಸಿ", whatsapp: "WhatsApp" },
  kok: { buyOnline: "ऑनलायन विकत घेवचें", directions: "दिका", call: "फोन करात", contact: "संपर्क", whatsapp: "WhatsApp" },
  ml: { buyOnline: "ഓൺലൈനായി വാങ്ങുക", directions: "വഴി", call: "വിളിക്കുക", contact: "ബന്ധപ്പെടുക", whatsapp: "WhatsApp" },
  mr: { buyOnline: "ऑनलाइन खरेदी करा", directions: "दिशा", call: "कॉल करा", contact: "संपर्क साधा", whatsapp: "WhatsApp" },
  ne: { buyOnline: "अनलाइन किन्नुहोस्", directions: "दिशा", call: "फोन गर्नुहोस्", contact: "सम्पर्क गर्नुहोस्", whatsapp: "WhatsApp" },
  nso: { buyOnline: "Reka inthaneteng", directions: "Ditšhupetšo", call: "Letša mogala", contact: "Ikgokaganye", whatsapp: "WhatsApp" },
  or: { buyOnline: "ଅନଲାଇନ୍ କିଣନ୍ତୁ", directions: "ଦିଗନିର୍ଦ୍ଦେଶ", call: "କଲ୍ କରନ୍ତୁ", contact: "ଯୋଗାଯୋଗ କରନ୍ତୁ", whatsapp: "WhatsApp" },
  pa: { buyOnline: "ਆਨਲਾਈਨ ਖਰੀਦੋ", directions: "ਦਿਸ਼ਾਵਾਂ", call: "ਕਾਲ ਕਰੋ", contact: "ਸੰਪਰਕ ਕਰੋ", whatsapp: "WhatsApp" },
  ss: { buyOnline: "Tsenga ku-inthanethi", directions: "Tikhombandlela", call: "Shaya lucingo", contact: "Tsintsana", whatsapp: "WhatsApp" },
  st: { buyOnline: "Reka inthaneteng", directions: "Litsela", call: "Letsetsa", contact: "Ikopanye", whatsapp: "WhatsApp" },
  ta: { buyOnline: "இணையத்தில் வாங்குங்கள்", directions: "வழிகாட்டல்", call: "அழைக்கவும்", contact: "தொடர்புகொள்ளவும்", whatsapp: "WhatsApp" },
  te: { buyOnline: "ఆన్‌లైన్‌లో కొనండి", directions: "ദിശలు", call: "కాల్ చేయండి", contact: "సంప్రదించండి", whatsapp: "WhatsApp" },
  tn: { buyOnline: "Reka mo inthaneteng", directions: "Dikaelo", call: "Letsa", contact: "Ikgolaganye", whatsapp: "WhatsApp" },
  xh: { buyOnline: "Thenga kwi-intanethi", directions: "Izalathiso", call: "Fowuna", contact: "Qhagamshelana", whatsapp: "WhatsApp" },
  zu: { buyOnline: "Thenga ku-inthanethi", directions: "Izikhombisi-ndlela", call: "Shaya ucingo", contact: "Xhumana", whatsapp: "WhatsApp" },
} as const satisfies Record<Locale, ProducerActionLabels>;

export function getProducerActionLabels(locale: Locale): ProducerActionLabels {
  return PRODUCER_ACTION_LABELS[locale];
}
