import type { Locale } from "./locales";

const en = {
  changes: "Your profile proposals",
  changesHelp:
    "Save a draft, send it for review and follow its progress here. Your public profile changes after publication.",
  noChanges: "You have no profile proposals yet.",
  unavailable: "Producer no longer published",
  removeValue: "Remove current value",
  newProposal: "Start a new proposal",
  withdraw: "Withdraw proposal",
  premiumPaused: "Your draft is saved",
  premiumPausedHelp:
    "Editing these products requires an active expanded profile. You can view or withdraw the saved draft from your proposals.",
  products: "Products",
  productsHelp:
    "Show what you make. Add a name and a description; you can include the format or presentation. Changes are reviewed before appearing on your profile.",
  add: "Add product",
  empty: "You have no products in this proposal yet.",
  name: "Product name",
  description: "Description",
  language: "Original language",
  optional: "Optional",
  remove: "Remove",
  up: "Move up",
  down: "Move down",
  undo: "Undo removal",
  removed: "Product removed from this proposal.",
  newProduct: "New product",
  preview: "Preview products",
  assets: "Photos and links",
  media: "Reviewed photos",
  links: "Reviewed links",
  draft: "Save draft",
  submit: "Send for review",
  saving: "Saving…",
  unsaved: "Changes not saved",
  saved: "Draft saved",
  initial: "Published profile",
  reviewHelp:
    "Save a draft to continue later, or send your changes for review. Your public profile stays as it is until publication.",
  standard: "Profile information",
  standardHelp: "Keep your activity, location and contact details up to date.",
  expanded: "Your story",
  expandedHelp: "Tell people about your work and the people behind it.",
  note: "What changed?",
  noteHelp:
    "Explain the changes and add a public source. For your own story, confirm that we may publish and translate it.",
  notePlaceholder:
    "For example: we have added a new cheese. Here is the product page on our website…",
  error: "Your changes could not be saved.",
  reload: "Open the latest profile",
  copy: "Copy my changes",
  copied: "Changes copied. Keep them before opening the latest profile.",
  editor: "Edit your profile",
  publicProfile: "View public profile",
  process: "You edit · We review · Your profile is updated",
  active: "Your expanded profile is active",
  activeHelp: "You can manage products and enrich your story below.",
  draftHelp: "This is your saved draft. It has not been sent for review.",
  continue: "Continue editing",
  sent: "Your proposal is being reviewed",
  sentHelp:
    "You can see the proposed changes and follow their progress. Your public profile keeps its published content.",
  viewRequest: "View proposal",
  unsavedWarning: "You have unsaved changes.",
  limit: "Product limit reached",
  count: "products",
  orderHelp: "The order here is the order on your profile.",
};
type Labels = typeof en;
const es: Labels = {
  changes: "Tus propuestas de perfil",
  changesHelp:
    "Guarda un borrador, envíalo a revisión y sigue aquí su estado. El perfil público se actualiza tras la publicación.",
  noChanges: "Todavía no tienes propuestas de perfil.",
  unavailable: "El productor ya no está publicado",
  removeValue: "Retirar el valor actual",
  newProposal: "Crear otra propuesta",
  withdraw: "Retirar propuesta",
  premiumPaused: "Tu borrador está guardado",
  premiumPausedHelp:
    "Para editar estos productos necesitas un perfil ampliado activo. Puedes consultar o retirar el borrador desde tus propuestas.",
  products: "Productos",
  productsHelp:
    "Muestra lo que elaboras. Añade un nombre y una descripción; puedes incluir el formato o la presentación. Revisaremos los cambios antes de mostrarlos en tu perfil.",
  add: "Añadir producto",
  empty: "Todavía no hay productos en esta propuesta.",
  name: "Nombre del producto",
  description: "Descripción",
  language: "Idioma original",
  optional: "Opcional",
  remove: "Retirar",
  up: "Subir",
  down: "Bajar",
  undo: "Deshacer retirada",
  removed: "Producto retirado de esta propuesta.",
  newProduct: "Nuevo producto",
  preview: "Vista previa de los productos",
  assets: "Fotos y enlaces",
  media: "Fotos revisadas",
  links: "Enlaces revisados",
  draft: "Guardar borrador",
  submit: "Enviar a revisión",
  saving: "Guardando…",
  unsaved: "Cambios sin guardar",
  saved: "Borrador guardado",
  initial: "Perfil publicado",
  reviewHelp:
    "Guarda un borrador para continuar después o envía tus cambios a revisión. Tu perfil público se mantiene hasta que publiquemos la propuesta.",
  standard: "Datos del perfil",
  standardHelp: "Mantén al día tu actividad, ubicación y datos de contacto.",
  expanded: "Tu historia",
  expandedHelp: "Cuenta cómo trabajáis y quién está detrás del productor.",
  note: "¿Qué ha cambiado?",
  noteHelp:
    "Explica los cambios y añade una fuente pública. Para los textos de tu historia, confirma que podemos publicarlos y traducirlos.",
  notePlaceholder:
    "Por ejemplo: hemos añadido un nuevo queso. Esta es su página en nuestra web…",
  error: "No se han podido guardar tus cambios.",
  reload: "Abrir el perfil actualizado",
  copy: "Copiar mis cambios",
  copied: "Cambios copiados. Consérvalos antes de abrir el perfil actualizado.",
  editor: "Edita tu perfil",
  publicProfile: "Ver perfil público",
  process: "Tú editas · Revisamos · Actualizamos tu perfil",
  active: "Tu perfil ampliado está activo",
  activeHelp:
    "Puedes gestionar los productos y ampliar tu historia a continuación.",
  draftHelp:
    "Este es tu borrador guardado. Todavía no se ha enviado a revisión.",
  continue: "Continuar editando",
  sent: "Tu propuesta está en revisión",
  sentHelp:
    "Puedes consultar los cambios propuestos y seguir su estado. Tu perfil público conserva el contenido publicado.",
  viewRequest: "Ver propuesta",
  unsavedWarning: "Tienes cambios sin guardar.",
  limit: "Has alcanzado el límite de productos",
  count: "productos",
  orderHelp: "Se mostrarán en el perfil en este mismo orden.",
};
const ca: Labels = {
  changes: "Les teves propostes de perfil",
  changesHelp:
    "Desa un esborrany, envia'l a revisió i segueix-ne l'estat aquí. El perfil públic s'actualitza després de la publicació.",
  noChanges: "Encara no tens propostes de perfil.",
  unavailable: "El productor ja no està publicat",
  removeValue: "Retirar el valor actual",
  newProposal: "Crear una altra proposta",
  withdraw: "Retirar proposta",
  premiumPaused: "El teu esborrany està desat",
  premiumPausedHelp:
    "Per editar aquests productes necessites un perfil ampliat actiu. Pots consultar o retirar l'esborrany des de les teves propostes.",
  products: "Productes",
  productsHelp:
    "Mostra què elabores. Afegeix un nom i una descripció; pots indicar el format o la presentació. Revisarem els canvis abans de mostrar-los al perfil.",
  add: "Afegir producte",
  empty: "Encara no hi ha productes en aquesta proposta.",
  name: "Nom del producte",
  description: "Descripció",
  language: "Idioma original",
  optional: "Opcional",
  remove: "Retirar",
  up: "Pujar",
  down: "Baixar",
  undo: "Desfer retirada",
  removed: "Producte retirat d'aquesta proposta.",
  newProduct: "Producte nou",
  preview: "Vista prèvia dels productes",
  assets: "Fotos i enllaços",
  media: "Fotos revisades",
  links: "Enllaços revisats",
  draft: "Desar esborrany",
  submit: "Enviar a revisió",
  saving: "Desant…",
  unsaved: "Canvis sense desar",
  saved: "Esborrany desat",
  initial: "Perfil publicat",
  reviewHelp:
    "Desa un esborrany per continuar més tard o envia els canvis a revisió. El perfil públic es manté fins que publiquem la proposta.",
  standard: "Dades del perfil",
  standardHelp:
    "Mantén al dia l'activitat, la ubicació i les dades de contacte.",
  expanded: "La vostra història",
  expandedHelp: "Explica com treballeu i qui hi ha darrere del productor.",
  note: "Què ha canviat?",
  noteHelp:
    "Explica els canvis i afegeix una font pública. Per als textos de la vostra història, confirma que els podem publicar i traduir.",
  notePlaceholder:
    "Per exemple: hem afegit un formatge nou. Aquesta és la seva pàgina al nostre web…",
  error: "No s'han pogut desar els canvis.",
  reload: "Obrir el perfil actualitzat",
  copy: "Copiar els meus canvis",
  copied: "Canvis copiats. Conserva'ls abans d'obrir el perfil actualitzat.",
  editor: "Edita el teu perfil",
  publicProfile: "Veure el perfil públic",
  process: "Tu edites · Revisem · Actualitzem el perfil",
  active: "El perfil ampliat està actiu",
  activeHelp:
    "Pots gestionar els productes i ampliar la vostra història a continuació.",
  draftHelp: "Aquest és l'esborrany desat. Encara no s'ha enviat a revisió.",
  continue: "Continuar editant",
  sent: "La proposta està en revisió",
  sentHelp:
    "Pots consultar els canvis proposats i seguir-ne l'estat. El perfil públic conserva el contingut publicat.",
  viewRequest: "Veure proposta",
  unsavedWarning: "Tens canvis sense desar.",
  limit: "Has arribat al límit de productes",
  count: "productes",
  orderHelp: "Es mostraran al perfil en aquest mateix ordre.",
};

export function getProducerEditorLabels(locale: Locale): Labels {
  return locale === "es" ? es : locale === "ca" ? ca : en;
}

const proposalStatusLabels = {
  es: {
    draft: "Borrador",
    submitted: "Pendiente de revisión",
    needs_changes: "Necesita una propuesta corregida",
    approved: "Aprobada · pendiente de publicación",
    applying: "Preparando publicación",
    applied: "Incorporada al catálogo",
    rejected: "No aprobada",
    withdrawn: "Retirada",
    conflict: "El perfil ha cambiado",
    failed: "Publicación pendiente de resolver",
  },
  ca: {
    draft: "Esborrany",
    submitted: "Pendent de revisió",
    needs_changes: "Cal una proposta corregida",
    approved: "Aprovada · pendent de publicació",
    applying: "Preparant publicació",
    applied: "Incorporada al catàleg",
    rejected: "No aprovada",
    withdrawn: "Retirada",
    conflict: "El perfil ha canviat",
    failed: "Publicació pendent de resoldre",
  },
};
export function producerProposalStatusLabel(
  locale: Locale,
  status: keyof typeof proposalStatusLabels.es,
  fallback: string,
): string {
  return locale === "es" || locale === "ca"
    ? proposalStatusLabels[locale][status]
    : fallback;
}

const editorMessages: Record<string, readonly [string, string]> = {
  "This draft changed. Reload it before saving.": [
    "El borrador ha cambiado. Abre la versión guardada antes de continuar.",
    "L’esborrany ha canviat. Obre la versió desada abans de continuar.",
  ],
  "The catalog row changed while you were editing. Review the latest values and try again.":
    [
      "El perfil ha cambiado mientras editabas. Conservamos tus cambios; revisa la versión actual antes de continuar.",
      "El perfil ha canviat mentre editaves. Conservem els teus canvis; revisa la versió actual abans de continuar.",
    ],
  "The expanded-profile right changed while this form was open. Reload the latest profile before submitting.":
    [
      "El acceso al perfil ampliado ha cambiado. Conservamos tus cambios; abre el perfil actualizado.",
      "L’accés al perfil ampliat ha canviat. Conservem els teus canvis; obre el perfil actualitzat.",
    ],
  "Review the highlighted fields and submit again.": [
    "Revisa los campos señalados e inténtalo de nuevo.",
    "Revisa els camps assenyalats i torna-ho a provar.",
  ],
  "The products changed while you were editing. Your input is preserved; review the latest profile before continuing.":
    [
      "Los productos han cambiado mientras editabas. Conservamos tus cambios; revisa el perfil actualizado antes de continuar.",
      "Els productes han canviat mentre editaves. Conservem els teus canvis; revisa el perfil actualitzat abans de continuar.",
    ],
  "Review the products before saving.": [
    "Revisa los productos antes de guardar.",
    "Revisa els productes abans de desar.",
  ],
  "Each product needs a name and language. Use up to 50 products, names up to 160 characters and descriptions up to 2,000 characters; photos and links must belong to this profile.":
    [
      "Cada producto necesita un nombre y un idioma. Puedes añadir hasta 50 productos, con nombres de hasta 160 caracteres y descripciones de hasta 2.000. Las fotos y los enlaces deben pertenecer a este perfil.",
      "Cada producte necessita un nom i un idioma. Pots afegir fins a 50 productes, amb noms de fins a 160 caràcters i descripcions de fins a 2.000. Les fotos i els enllaços han de pertànyer a aquest perfil.",
    ],
  "Change at least one field before submitting.": [
    "Modifica algún dato o producto antes de enviar la propuesta.",
    "Modifica alguna dada o producte abans d’enviar la proposta.",
  ],
  "Explain the change and its public source in 20–4,000 characters.": [
    "Explica los cambios y su fuente pública en entre 20 y 4.000 caracteres.",
    "Explica els canvis i la font pública en entre 20 i 4.000 caràcters.",
  ],
  "We could not save the proposal. Your input is preserved; try again shortly.":
    [
      "No hemos podido guardar la propuesta. Conservamos tus cambios; inténtalo de nuevo en unos instantes.",
      "No hem pogut desar la proposta. Conservem els teus canvis; torna-ho a provar d’aquí a uns instants.",
    ],
  "The expanded-profile right changed before this proposal was saved.": [
    "El acceso al perfil ampliado ha cambiado antes de guardar. Conservamos tus cambios.",
    "L’accés al perfil ampliat ha canviat abans de desar. Conservem els teus canvis.",
  ],
  "Resolve an existing profile proposal before submitting another.": [
    "Cierra una propuesta pendiente antes de crear otra.",
    "Tanca una proposta pendent abans de crear-ne una altra.",
  ],
  "The daily profile-change limit has been reached. Try again later.": [
    "Has alcanzado el límite diario de guardados. Inténtalo más tarde.",
    "Has arribat al límit diari de desats. Torna-ho a provar més tard.",
  ],
  "This draft changed in another window. Your input is preserved; reload the saved draft before continuing.":
    [
      "El borrador ha cambiado en otra ventana. Conservamos tus cambios; abre la versión guardada antes de continuar.",
      "L’esborrany ha canviat en una altra finestra. Conservem els teus canvis; obre la versió desada abans de continuar.",
    ],
  "You already have an open change request for this producer.": [
    "Ya tienes una propuesta abierta para este productor. Puedes consultarla desde tus propuestas.",
    "Ja tens una proposta oberta per a aquest productor. Pots consultar-la des de les teves propostes.",
  ],
  "Changes submitted for editorial review.": [
    "Propuesta enviada a revisión.",
    "Proposta enviada a revisió.",
  ],
  "The profile or products changed after this proposal was submitted.": [
    "El perfil o los productos han cambiado desde que enviaste esta propuesta.",
    "El perfil o els productes han canviat des que vas enviar aquesta proposta.",
  ],
};
export function producerEditorMessage(locale: Locale, message: string): string {
  const translated = editorMessages[message];
  return translated && (locale === "es" || locale === "ca")
    ? translated[locale === "es" ? 0 : 1]
    : message;
}
