import {
  PRODUCER_STANDARD_EDITABLE_FIELDS,
  type ProducerEditableField,
  type ProducerEditableFieldKey,
} from "@/lib/accounts/producer-fields";

/**
 * A community suggestion is scoped to one visible part of the public producer
 * profile. Sections exist so a reader can correct what they actually saw
 * instead of opening the whole owner editor, and so a reviewer can read the
 * request in the same terms. They partition the standard editable fields;
 * expanded fields stay out because they require the producer entitlement that
 * an unclaimed producer cannot hold.
 */
export type ProducerSuggestionSectionDefinition = {
  /** Spanish label for the account area. */
  label: string;
  /** English label for the operations workspace. */
  operatorLabel: string;
  /** Spanish explanation of what belongs in this section. */
  help: string;
  fields: readonly ProducerEditableFieldKey[];
};

export const PRODUCER_SUGGESTION_SECTIONS = {
  identidad: {
    label: "Nombre y categorías",
    operatorLabel: "Name and categories",
    help: "El nombre público, el municipio de la unidad productiva y sus categorías.",
    fields: ["nombre", "municipio", "categoria", "categorias adicionales"],
  },
  productos: {
    label: "Productos destacados",
    operatorLabel: "Featured products",
    help: "Los productos, marcas o denominaciones concretos que elabora el productor.",
    fields: ["productos estrella"],
  },
  descripcion: {
    label: "Descripción",
    operatorLabel: "Description",
    help: "La descripción factual del productor y el idioma en el que está escrita.",
    fields: ["descripcion", "descripcion_locale"],
  },
  ubicacion: {
    label: "Ubicación",
    operatorLabel: "Location",
    help: "La dirección, las coordenadas del mapa y la ficha de Google Maps.",
    fields: ["direccion", "lat", "lon", "Google Maps"],
  },
  horario: {
    label: "Horario",
    operatorLabel: "Public hours",
    help: "El horario de visita, recogida o apertura al público.",
    fields: ["horario"],
  },
  contacto: {
    label: "Contacto",
    operatorLabel: "Contact",
    help: "El teléfono, el correo público, la web y las redes sociales oficiales.",
    fields: ["telefono", "correo", "web", "Facebook", "Instagram"],
  },
  venta: {
    label: "Venta y canales",
    operatorLabel: "Sales and channels",
    help: "Si hay venta online comprobada y por qué canales se puede comprar.",
    fields: ["Venta online", "Canal de venta"],
  },
} as const satisfies Record<string, ProducerSuggestionSectionDefinition>;

export type ProducerSuggestionSection = keyof typeof PRODUCER_SUGGESTION_SECTIONS;

export const PRODUCER_SUGGESTION_SECTION_KEYS = Object.keys(
  PRODUCER_SUGGESTION_SECTIONS,
) as readonly ProducerSuggestionSection[];

export function isProducerSuggestionSection(
  value: string,
): value is ProducerSuggestionSection {
  return Object.hasOwn(PRODUCER_SUGGESTION_SECTIONS, value);
}

export function getProducerSuggestionSection(
  section: ProducerSuggestionSection,
): ProducerSuggestionSectionDefinition {
  return PRODUCER_SUGGESTION_SECTIONS[section];
}

/**
 * The editable-field subset a section may propose, in catalog field order.
 * Narrowing this list is what keeps a section form from blanking every field
 * it does not render.
 */
export function producerSuggestionSectionFields(
  section: ProducerSuggestionSection,
): readonly ProducerEditableField[] {
  const keys = new Set<string>(PRODUCER_SUGGESTION_SECTIONS[section].fields);
  return PRODUCER_STANDARD_EDITABLE_FIELDS.filter(({ key }) => keys.has(key));
}

/** Every patched key must belong to the section the author declared. */
export function isProducerSuggestionPatchInSection(
  section: ProducerSuggestionSection,
  patch: Record<string, unknown>,
): boolean {
  const keys = new Set<string>(PRODUCER_SUGGESTION_SECTIONS[section].fields);
  return Object.keys(patch).every((key) => keys.has(key));
}
