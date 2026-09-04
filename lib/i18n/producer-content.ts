import type { Locale } from "./locales";

// Product names, alt text and link labels come from the reviewed content itself.
const labels = {
  en: ["Products", "Gallery", "Links"],
  es: ["Productos", "Galería", "Enlaces"],
  ca: ["Productes", "Galeria", "Enllaços"],
  de: ["Produkte", "Galerie", "Links"],
  ja: ["商品", "ギャラリー", "リンク"],
  fr: ["Produits", "Galerie", "Liens"],
  it: ["Prodotti", "Galleria", "Link"],
  nl: ["Producten", "Galerij", "Links"],
  pt: ["Produtos", "Galeria", "Ligações"],
  af: ["Produkte", "Galery", "Skakels"],
  as: ["সামগ্ৰী", "চিত্ৰশালা", "সংযোগ"],
  bn: ["পণ্য", "গ্যালারি", "লিংক"],
  cy: ["Cynhyrchion", "Oriel", "Dolenni"],
  ga: ["Táirgí", "Gailearaí", "Naisc"],
  gd: ["Bathar", "Gailearaidh", "Ceanglaichean"],
  gu: ["ઉત્પાદનો", "ગેલેરી", "લિંક્સ"],
  haw: ["Nā huahana", "Nā kiʻi", "Nā loulou"],
  hi: ["उत्पाद", "गैलरी", "लिंक"],
  kn: ["ಉತ್ಪನ್ನಗಳು", "ಚಿತ್ರಶಾಲೆ", "ಕೊಂಡಿಗಳು"],
  kok: ["उत्पादनां", "चित्रदालन", "दुवे"],
  ml: ["ഉൽപ്പന്നങ്ങൾ", "ഗാലറി", "ലിങ്കുകൾ"],
  mr: ["उत्पादने", "चित्रदालन", "दुवे"],
  ne: ["उत्पादनहरू", "ग्यालरी", "लिङ्कहरू"],
  nso: ["Ditšweletšwa", "Diswantšho", "Dikgokagano"],
  or: ["ଉତ୍ପାଦ", "ଗ୍ୟାଲେରୀ", "ଲିଙ୍କ୍"],
  pa: ["ਉਤਪਾਦ", "ਗੈਲਰੀ", "ਲਿੰਕ"],
  ss: ["Imikhicito", "Titfombe", "Tichumanisi"],
  st: ["Lihlahisoa", "Litšoantšo", "Lihokelo"],
  ta: ["தயாரிப்புகள்", "படத்தொகுப்பு", "இணைப்புகள்"],
  te: ["ఉత్పత్తులు", "గ్యాలరీ", "లింక్‌లు"],
  tn: ["Dikuno", "Ditshwantsho", "Dikgolagano"],
  xh: ["Iimveliso", "Igalari", "Amakhonkco"],
  zu: ["Imikhiqizo", "Igalari", "Izixhumanisi"],
} satisfies Record<Locale, readonly string[]>;

export function getProducerContentLabels(locale: Locale) {
  const [products, gallery, links] = labels[locale];
  return { products, gallery, links };
}
