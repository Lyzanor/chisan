import type { Locale } from "./locales";

const en = {
  removeMunicipality: "Remove municipality filter",
  sources: "Public sources",
  checked: "Consulted",
  verified: "Verified producer",
  verifiedHelp:
    "The producer has claimed this profile and their relationship with it has been reviewed.",
  pending: "Pending review",
  pendingHelp:
    "Some information still needs checking. Confirm details with the producer before visiting or ordering.",
  editorial:
    "Information compiled from public sources. This profile has not been claimed by the producer.",
  participate: "Is this your production?",
  participateHelp:
    "Claim your profile for free, keep your information up to date and add a gallery of up to 5 photos. We review each change before publishing it.",
  contribute: "A profile that grows with you",
  contributeHelp:
    "Keep your information up to date. We review each change before publishing it.",
  gallery: "Producer photos",
  enlarge: "Enlarge photo",
  previous: "Previous photo",
  next: "Next photo",
  close: "Close gallery",
  fromLocation: "From your location",
  freeGallery: "Your free gallery · up to 5 photos",
  freeGalleryHelp:
    "Show your work, your place and your products. New photos are reviewed before publication.",
};
const es: typeof en = {
  removeMunicipality: "Quitar filtro de municipio",
  sources: "Fuentes públicas",
  checked: "Consultada",
  verified: "Productor verificado",
  verifiedHelp:
    "El productor ha reclamado esta ficha y hemos revisado su vinculación con ella.",
  pending: "Pendiente de revisión",
  pendingHelp:
    "Hay información pendiente de comprobar. Confirma los detalles con el productor antes de visitar o hacer un pedido.",
  editorial:
    "Información recopilada de fuentes públicas. El productor todavía no ha reclamado esta ficha.",
  participate: "¿Eres este productor?",
  participateHelp:
    "Reclama tu ficha gratis, mantén tu información al día y añade una galería de hasta 5 fotos. Revisamos cada cambio antes de publicarlo.",
  contribute: "Una ficha que crece contigo",
  contributeHelp:
    "Mantén tu información al día. Revisamos cada cambio antes de publicarlo.",
  gallery: "Fotos del productor",
  enlarge: "Ampliar foto",
  previous: "Foto anterior",
  next: "Foto siguiente",
  close: "Cerrar galería",
  fromLocation: "Desde tu ubicación",
  freeGallery: "Tu galería gratuita · hasta 5 fotos",
  freeGalleryHelp:
    "Muestra tu trabajo, tu lugar y tus productos. Las fotos nuevas se revisan antes de publicarse.",
};
const ca: typeof en = {
  removeMunicipality: "Treu el filtre de municipi",
  sources: "Fonts públiques",
  checked: "Consultada",
  verified: "Productor verificat",
  verifiedHelp:
    "El productor ha reclamat aquesta fitxa i n'hem revisat la vinculació.",
  pending: "Pendent de revisió",
  pendingHelp:
    "Hi ha informació pendent de comprovar. Confirma els detalls amb el productor abans de visitar-lo o fer una comanda.",
  editorial:
    "Informació recopilada de fonts públiques. El productor encara no ha reclamat aquesta fitxa.",
  participate: "Ets aquest productor?",
  participateHelp:
    "Reclama la fitxa de franc, mantén la informació al dia i afegeix una galeria de fins a 5 fotos. Revisem cada canvi abans de publicar-lo.",
  contribute: "Una fitxa que creix amb tu",
  contributeHelp:
    "Mantén la informació al dia. Revisem cada canvi abans de publicar-lo.",
  gallery: "Fotos del productor",
  enlarge: "Amplia la foto",
  previous: "Foto anterior",
  next: "Foto següent",
  close: "Tanca la galeria",
  fromLocation: "Des de la teva ubicació",
  freeGallery: "La teva galeria gratuïta · fins a 5 fotos",
  freeGalleryHelp:
    "Mostra la teva feina, el teu lloc i els teus productes. Les fotos noves es revisen abans de publicar-les.",
};
export function producerProfileLabels(locale: Locale) {
  return locale === "es" ? es : locale === "ca" ? ca : en;
}
