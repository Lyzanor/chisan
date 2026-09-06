import type { Locale } from "./locales";
const es = {
  title: "Imágenes de productos y galería",
  help: "Asigna una foto a un producto o déjala en la galería. Las imágenes nuevas son privadas hasta que revisemos y publiquemos la propuesta.",
  add: "Subir imágenes",
  uploading: "Preparando imágenes…",
  formats:
    "JPG, PNG o WebP · hasta 3 MiB por archivo · mínimo 200 × 200 px · hasta 20 imágenes en el perfil.",
  rights:
    "Tengo permiso para publicar estas imágenes y autorizo su uso en este perfil.",
  target: "Añadir a",
  gallery: "Galería del perfil",
  alt: "Describe qué aparece en la imagen",
  caption: "Pie de foto (opcional)",
  credit: "Autoría o crédito (opcional)",
  language: "Idioma del texto",
  remove: "Retirar imagen",
  undo: "Deshacer retirada",
  up: "Subir",
  down: "Bajar",
  private: "Nueva · pendiente de revisión",
  published: "Publicada",
  empty: "Todavía no hay imágenes en esta propuesta.",
  removed: "Imagen retirada de la propuesta y de sus productos.",
  ready: "Imagen preparada. Completa su descripción y guarda el borrador.",
  reuse: "Subidas recientes",
  reuseHelp:
    "Puedes recuperar imágenes que subiste antes y todavía no has incorporado a esta propuesta.",
  use: "Añadir a la propuesta",
  productPhoto: "Subir foto del producto",
  assigned: "En productos",
  preview: "Ampliar imagen",
  errors: {
    size: "La imagen es demasiado grande. Usa un archivo de hasta 3 MiB; si tiene mucho detalle, reduce su resolución.",
    format: "Usa una imagen JPG, PNG o WebP sin animación.",
    dimensions:
      "La imagen debe medir al menos 200 × 200 px y conservar esas dimensiones al reducirla a 1600 px.",
    invalid:
      "No se puede leer esta imagen. Prueba a exportarla de nuevo como JPG o PNG.",
    access:
      "Tu acceso al perfil ha cambiado. Guarda el texto que estabas preparando y vuelve a abrir el editor.",
    quota:
      "Has alcanzado el límite de subidas. Conservamos las imágenes preparadas; inténtalo más tarde.",
    rights: "Confirma que tienes permiso para publicar las imágenes.",
    paused: "Las subidas están pausadas temporalmente.",
    unavailable:
      "No se ha podido subir la imagen. Puedes volver a intentarlo; tus cambios siguen aquí.",
    limit:
      "El perfil admite hasta 20 imágenes. Retira alguna antes de añadir más.",
  },
};
type Words = typeof es;
const ca: Words = {
  title: "Imatges de productes i galeria",
  help: "Assigna una foto a un producte o deixa-la a la galeria. Les imatges noves són privades fins que revisem i publiquem la proposta.",
  add: "Pujar imatges",
  uploading: "Preparant imatges…",
  formats:
    "JPG, PNG o WebP · fins a 3 MiB per fitxer · mínim 200 × 200 px · fins a 20 imatges al perfil.",
  rights:
    "Tinc permís per publicar aquestes imatges i n'autoritzo l'ús en aquest perfil.",
  target: "Afegir a",
  gallery: "Galeria del perfil",
  alt: "Descriu què apareix a la imatge",
  caption: "Peu de foto (opcional)",
  credit: "Autoria o crèdit (opcional)",
  language: "Idioma del text",
  remove: "Retirar imatge",
  undo: "Desfer retirada",
  up: "Pujar",
  down: "Baixar",
  private: "Nova · pendent de revisió",
  published: "Publicada",
  empty: "Encara no hi ha imatges en aquesta proposta.",
  removed: "Imatge retirada de la proposta i dels seus productes.",
  ready: "Imatge preparada. Completa'n la descripció i desa l'esborrany.",
  reuse: "Pujades recents",
  reuseHelp:
    "Pots recuperar imatges que vas pujar abans i encara no has incorporat a aquesta proposta.",
  use: "Afegir a la proposta",
  productPhoto: "Pujar foto del producte",
  assigned: "En productes",
  preview: "Ampliar imatge",
  errors: {
    size: "La imatge és massa gran. Fes servir un fitxer de fins a 3 MiB; si té molt detall, redueix-ne la resolució.",
    format: "Fes servir una imatge JPG, PNG o WebP sense animació.",
    dimensions:
      "La imatge ha de mesurar almenys 200 × 200 px i conservar aquestes dimensions en reduir-la a 1600 px.",
    invalid:
      "No es pot llegir aquesta imatge. Prova d'exportar-la de nou com a JPG o PNG.",
    access:
      "L'accés al perfil ha canviat. Conserva el text que preparaves i torna a obrir l'editor.",
    quota:
      "Has arribat al límit de pujades. Conservem les imatges preparades; torna-ho a provar més tard.",
    rights: "Confirma que tens permís per publicar les imatges.",
    paused: "Les pujades estan aturades temporalment.",
    unavailable:
      "No s'ha pogut pujar la imatge. Pots tornar-ho a provar; els canvis continuen aquí.",
    limit:
      "El perfil admet fins a 20 imatges. Retira'n alguna abans d'afegir-ne més.",
  },
};
const en: Words = {
  title: "Product images and gallery",
  help: "Assign a photo to a product or leave it in the gallery. New images stay private until we review and publish the proposal.",
  add: "Upload images",
  uploading: "Preparing images…",
  formats:
    "JPG, PNG or WebP · up to 3 MiB per file · at least 200 × 200 px · up to 20 images per profile.",
  rights:
    "I have permission to publish these images and authorize their use on this profile.",
  target: "Add to",
  gallery: "Profile gallery",
  alt: "Describe what the image shows",
  caption: "Caption (optional)",
  credit: "Attribution or credit (optional)",
  language: "Text language",
  remove: "Remove image",
  undo: "Undo removal",
  up: "Move up",
  down: "Move down",
  private: "New · awaiting review",
  published: "Published",
  empty: "This proposal has no images yet.",
  removed: "Image removed from the proposal and its products.",
  ready: "Image prepared. Add its description and save the draft.",
  reuse: "Recent uploads",
  reuseHelp:
    "Recover images you uploaded earlier but have not included in this proposal.",
  use: "Add to proposal",
  productPhoto: "Upload product photo",
  assigned: "In products",
  preview: "Enlarge image",
  errors: {
    size: "The image is too large. Use a file up to 3 MiB; reduce its resolution if it has a lot of detail.",
    format: "Use a JPG, PNG or WebP image without animation.",
    dimensions:
      "The image must be at least 200 × 200 px and retain those dimensions when resized to 1600 px.",
    invalid: "We cannot read this image. Try exporting it again as JPG or PNG.",
    access:
      "Your profile access changed. Keep the text you were preparing and reopen the editor.",
    quota:
      "You have reached the upload limit. Prepared images are safe; try again later.",
    rights: "Confirm that you have permission to publish these images.",
    paused: "Uploads are temporarily paused.",
    unavailable:
      "The image could not be uploaded. Try again; your changes are still here.",
    limit: "A profile accepts up to 20 images. Remove one before adding more.",
  },
};
export const getProducerMediaLabels = (locale: Locale): Words =>
  locale === "es" ? es : locale === "ca" ? ca : en;
