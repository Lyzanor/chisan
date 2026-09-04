// Stable public catalog interface. Implementations live by responsibility.
export * from "./catalog/registry";
export * from "./catalog/producers";
export {
  localizeProducerFields,
  localizeProducerDescriptions,
} from "./catalog/localization";
