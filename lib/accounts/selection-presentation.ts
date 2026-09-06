import type { ProducerSelectionPageMessages } from "@/components/producer-selection-page";

// Public selections share the Spanish public interface.
export const selectionPageMessages: ProducerSelectionPageMessages = {
  producerCount: (count) =>
    `${count} ${count === 1 ? "productor" : "productores"}`,
  mappedCount: (count) => `${count} en el mapa`,
  producers: "Productores seleccionados",
  map: {
    loading: "Cargando mapa…",
    emptyCoordinates:
      "Estos productores todavía no tienen una ubicación en el mapa. Puedes abrir sus perfiles desde la lista.",
    producerMap: "Mapa de productores seleccionados",
    openProfile: "Abrir perfil del productor",
  },
};
