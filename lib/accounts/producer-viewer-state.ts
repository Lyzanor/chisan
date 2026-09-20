/** Private presentation state; every destination still rechecks authorization. */
export type ProducerViewerState = {
  signedIn: boolean;
  activeOwner: boolean;
  membership: { role: string } | null;
  claim: boolean;
  openSuggestion: boolean;
  canOfferProfileUpgrade: boolean;
};

export function guestProducerViewerState(activeOwner: boolean): ProducerViewerState {
  return {
    signedIn: false,
    activeOwner,
    membership: null,
    claim: false,
    openSuggestion: false,
    canOfferProfileUpgrade: false,
  };
}
