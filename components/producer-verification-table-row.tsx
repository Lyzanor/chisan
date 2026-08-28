import { isProducerOwnershipVerified } from "@/lib/accounts/producer-ownership";
import type { Locale } from "@/lib/i18n/locales";
import type { Messages } from "@/lib/i18n/messages";
import { presentProducerVerification } from "@/lib/i18n/producer-fields";

type ProducerVerificationTableRowProps = {
  country: string;
  locale: Locale;
  messages: Messages;
  producerId: number;
  verification: string;
};

export async function ProducerVerificationTableRow({
  country,
  locale,
  messages,
  producerId,
  verification,
}: ProducerVerificationTableRowProps) {
  const ownershipVerified = await isProducerOwnershipVerified(country, producerId);
  const field = presentProducerVerification(
    verification,
    ownershipVerified,
    locale,
    messages,
  );
  if (!field) return null;

  return (
    <tr>
      <td>{field.label}</td>
      <td>{field.displayValue}</td>
    </tr>
  );
}
