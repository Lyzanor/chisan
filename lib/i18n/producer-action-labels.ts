import type { Locale } from "./locales";

export type ProducerActionLabels = Readonly<{
  buyOnline: string;
  directions: string;
  call: string;
}>;

const PRODUCER_ACTION_LABELS = {
  en: { buyOnline: "Buy online", directions: "Directions", call: "Call" },
  es: { buyOnline: "Comprar online", directions: "Cómo llegar", call: "Llamar" },
  ca: { buyOnline: "Comprar en línia", directions: "Com arribar-hi", call: "Trucar" },
  de: { buyOnline: "Online kaufen", directions: "Route", call: "Anrufen" },
  ja: { buyOnline: "オンラインで購入", directions: "行き方", call: "電話する" },
  fr: { buyOnline: "Acheter en ligne", directions: "Itinéraire", call: "Appeler" },
  it: { buyOnline: "Acquista online", directions: "Indicazioni", call: "Chiama" },
  nl: { buyOnline: "Online kopen", directions: "Route", call: "Bellen" },
  pt: { buyOnline: "Comprar online", directions: "Como chegar", call: "Ligar" },
  af: { buyOnline: "Koop aanlyn", directions: "Aanwysings", call: "Bel" },
  as: { buyOnline: "অনলাইন কিনক", directions: "দিশ-নিৰ্দেশ", call: "ফোন কৰক" },
  bn: { buyOnline: "অনলাইনে কিনুন", directions: "দিকনির্দেশ", call: "কল করুন" },
  cy: { buyOnline: "Prynu ar-lein", directions: "Cyfarwyddiadau", call: "Ffonio" },
  ga: { buyOnline: "Ceannaigh ar líne", directions: "Treoracha", call: "Glaoigh" },
  gd: { buyOnline: "Ceannaich air-loidhne", directions: "Stiùiridhean", call: "Cuir fòn" },
  gu: { buyOnline: "ઑનલાઇન ખરીદો", directions: "દિશાઓ", call: "કૉલ કરો" },
  haw: { buyOnline: "Kūʻai ma ka pūnaewele", directions: "Kuhikuhi ala", call: "Kelepona" },
  hi: { buyOnline: "ऑनलाइन खरीदें", directions: "रास्ता देखें", call: "कॉल करें" },
  kn: { buyOnline: "ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಖರೀದಿಸಿ", directions: "ದಿಕ್ಕುಗಳು", call: "ಕರೆ ಮಾಡಿ" },
  kok: { buyOnline: "ऑनलायन विकत घेवचें", directions: "दिका", call: "फोन करात" },
  ml: { buyOnline: "ഓൺലൈനായി വാങ്ങുക", directions: "വഴി", call: "വിളിക്കുക" },
  mr: { buyOnline: "ऑनलाइन खरेदी करा", directions: "दिशा", call: "कॉल करा" },
  ne: { buyOnline: "अनलाइन किन्नुहोस्", directions: "दिशा", call: "फोन गर्नुहोस्" },
  nso: { buyOnline: "Reka inthaneteng", directions: "Ditšhupetšo", call: "Letša mogala" },
  or: { buyOnline: "ଅନଲାଇନ୍ କିଣନ୍ତୁ", directions: "ଦିଗନିର୍ଦ୍ଦେଶ", call: "କଲ୍ କରନ୍ତୁ" },
  pa: { buyOnline: "ਆਨਲਾਈਨ ਖਰੀਦੋ", directions: "ਦਿਸ਼ਾਵਾਂ", call: "ਕਾਲ ਕਰੋ" },
  ss: { buyOnline: "Tsenga ku-inthanethi", directions: "Tikhombandlela", call: "Shaya lucingo" },
  st: { buyOnline: "Reka inthaneteng", directions: "Litsela", call: "Letsetsa" },
  ta: { buyOnline: "இணையத்தில் வாங்குங்கள்", directions: "வழிகாட்டல்", call: "அழைக்கவும்" },
  te: { buyOnline: "ఆన్‌లైన్‌లో కొనండి", directions: "దిశలు", call: "కాల్ చేయండి" },
  tn: { buyOnline: "Reka mo inthaneteng", directions: "Dikaelo", call: "Letsa" },
  xh: { buyOnline: "Thenga kwi-intanethi", directions: "Izalathiso", call: "Fowuna" },
  zu: { buyOnline: "Thenga ku-inthanethi", directions: "Izikhombisi-ndlela", call: "Shaya ucingo" },
} as const satisfies Record<Locale, ProducerActionLabels>;

export function getProducerActionLabels(locale: Locale): ProducerActionLabels {
  return PRODUCER_ACTION_LABELS[locale];
}
