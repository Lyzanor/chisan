import { getLocaleDisplayTag, type Locale } from "./locales";
import type { Messages } from "./messages";

type ControlledMessages = Messages["controlledValues"];

function getDisplayValue<T extends Record<string, string>>(value: string, labels: T): string {
  return Object.hasOwn(labels, value) ? labels[value as keyof T] : value;
}

export function formatVerification(
  value: string,
  messages: ControlledMessages,
): string {
  return getDisplayValue(value, messages.verification);
}

export function formatOnlineSales(
  value: string,
  messages: ControlledMessages,
): string {
  return getDisplayValue(value, messages.onlineSales);
}

export function formatSalesChannels(
  value: string,
  locale: Locale,
  messages: ControlledMessages,
): string {
  const channels = value
    .split("|")
    .map((channel) => channel.trim())
    .filter(Boolean)
    .map((channel) => getDisplayValue(channel, messages.salesChannels));

  return new Intl.ListFormat(getLocaleDisplayTag(locale), {
    style: "long",
    type: "conjunction",
  }).format(channels);
}
