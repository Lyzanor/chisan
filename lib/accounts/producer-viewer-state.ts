/** Private presentation state; every destination still rechecks authorization. */
export type ProducerViewerState = {
  signedIn: boolean;
  activeOwner: boolean;
  membership: { role: string } | null;
  claim: boolean;
  canClaimProducer: boolean;
  openSuggestion: boolean;
  canOfferProfileUpgrade: boolean;
};

export function guestProducerViewerState(activeOwner: boolean): ProducerViewerState {
  return {
    signedIn: false,
    activeOwner,
    membership: null,
    claim: false,
    canClaimProducer: true,
    openSuggestion: false,
    canOfferProfileUpgrade: false,
  };
}
