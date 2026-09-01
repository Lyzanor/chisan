import {
  ProfileQrLabel,
  type ProfileQrLabelProps,
} from "@/components/profile-qr-label";
import { getAccountSystemConfiguration } from "@/lib/accounts/config";
import { isProducerProfileQrEnabled } from "@/lib/accounts/profile-qr-entitlements";

type ProducerProfileQrLabelProps = Omit<ProfileQrLabelProps, "kind"> & {
  country: string;
  producerId: number;
};

export async function ProducerProfileQrLabel({
  country,
  producerId,
  ...labelProps
}: ProducerProfileQrLabelProps) {
  if (!getAccountSystemConfiguration().databaseConfigured) return null;

  try {
    if (!(await isProducerProfileQrEnabled(country, producerId))) return null;
  } catch (error) {
    console.error("Producer profile QR is temporarily unavailable.", {
      country,
      errorName: error instanceof Error ? error.name : "UnknownError",
      producerId,
    });
    return null;
  }

  return <ProfileQrLabel {...labelProps} kind="producer" />;
}
