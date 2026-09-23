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
  participateOfflineHelp:
    "Account registration is temporarily unavailable. Write to us to start reviewing your connection to this producer.",
  participateEmailAction: "Request verification by email",
  participateEmailSubject: "Verify producer",
  participateEmailBody: "Hello, I would like to verify my connection to this producer profile:",
  contribute: "A profile that grows with you",
  contributeHelp:
    "Keep your information up to date. We review each change before publishing it.",
  gallery: "Producer photos",
  photoCaption: "Photo caption and credit",
  fromLocation: "From your location",
  freeGallery: "Your free gallery · up to 5 photos",
  freeGalleryHelp:
    "Show your work, your place and your products. New photos are reviewed before publication.",
  galleryManageTitle: "Bring your profile to life",
  galleryManageAction: "Manage photos",
  galleryClaimPendingTitle: "Verification request submitted",
  galleryClaimPendingHelp: "Your claim is currently under editorial review.",
  galleryClaimPendingAction: "View claim",
};
const es: typeof en = {
  removeMunicipality: "Quitar filtro de municipio",
  sources: "Fuentes públicas",
  checked: "Consultada",
  verified: "Productor verificado",
  verifiedHelp:
    "Hemos verificado la vinculación del productor con esta ficha.",
  pending: "Pendiente de revisión",
  pendingHelp:
    "Hay información pendiente de comprobar. Confirma los detalles con el productor antes de visitar o hacer un pedido.",
  editorial:
    "Información recopilada de fuentes públicas. El productor todavía no ha verificado su vinculación con esta ficha.",
  participate: "¿Eres este productor?",
  participateHelp:
    "Solicita gratis la verificación de tu ficha, mantén tu información al día y añade una galería de hasta 5 fotos. Revisamos cada cambio antes de publicarlo.",
  participateOfflineHelp:
    "El registro está temporalmente desactivado. Escríbenos para iniciar la revisión de tu vinculación con este productor.",
  participateEmailAction: "Solicitar verificación por correo",
  participateEmailSubject: "Verificar productor",
  participateEmailBody: "Hola, quiero verificar mi vinculación con esta ficha de productor:",
  contribute: "Una ficha que crece contigo",
  contributeHelp:
    "Mantén tu información al día. Revisamos cada cambio antes de publicarlo.",
  gallery: "Fotos del productor",
  photoCaption: "Pie y créditos de la foto",
  fromLocation: "Desde tu ubicación",
  freeGallery: "Tu galería gratuita · hasta 5 fotos",
  freeGalleryHelp:
    "Muestra tu trabajo, tu lugar y tus productos. Las fotos nuevas se revisan antes de publicarse.",
  galleryManageTitle: "Dale vida a tu ficha",
  galleryManageAction: "Gestionar fotos",
  galleryClaimPendingTitle: "Solicitud de verificación enviada",
  galleryClaimPendingHelp: "Tu solicitud está en revisión por el equipo editorial.",
  galleryClaimPendingAction: "Ver solicitud",
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
  participateOfflineHelp:
    "El registre està temporalment desactivat. Escriu-nos per iniciar la revisió de la teva vinculació amb aquest productor.",
  participateEmailAction: "Sol·licitar la verificació per correu",
  participateEmailSubject: "Verificar productor",
  participateEmailBody: "Hola, vull verificar la meva vinculació amb aquesta fitxa de productor:",
  contribute: "Una fitxa que creix amb tu",
  contributeHelp:
    "Mantén la informació al dia. Revisem cada canvi abans de publicar-lo.",
  gallery: "Fotos del productor",
  photoCaption: "Peu i crèdits de la foto",
  fromLocation: "Des de la teva ubicació",
  freeGallery: "La teva galeria gratuïta · fins a 5 fotos",
  freeGalleryHelp:
    "Mostra la teva feina, el teu lloc i els teus productes. Les fotos noves es revisen abans de publicar-les.",
  galleryManageTitle: "Dona vida a la teva fitxa",
  galleryManageAction: "Gestionar fotos",
  galleryClaimPendingTitle: "Sol·licitud de verificació enviada",
  galleryClaimPendingHelp: "La teva sol·licitud està en revisió per l'equip editorial.",
  galleryClaimPendingAction: "Veure sol·licitud",
};
export function producerProfileLabels(locale: Locale) {
  return locale === "es" ? es : locale === "ca" ? ca : en;
}
