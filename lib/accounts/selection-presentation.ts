import type { ProducerSelectionPageMessages } from "@/components/producer-selection-page";

// The application shell uses English; catalog links and producer prose retain
// the visitor's explicit presentation locale.
export const selectionPageMessages: ProducerSelectionPageMessages = {
  producerCount: (count) =>
    `${count} ${count === 1 ? "producer" : "producers"}`,
  mappedCount: (count) => `${count} on the map`,
  producers: "Selected producers",
  map: {
    loading: "Loading map…",
    emptyCoordinates:
      "These producers do not have mapped locations yet. You can open their profiles from the list.",
    producerMap: "Selected producer map",
    openProfile: "Open producer profile",
  },
};
