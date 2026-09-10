import { isAccountSystemConfigured } from "../accounts/config";

export function whatsappEnabled(
  environment: Record<string, string | undefined> = process.env,
) {
  return (
    environment.CHISAN_WHATSAPP_ENABLED === "true" &&
    isAccountSystemConfigured(environment)
  );
}
export function whatsappConfig(
  environment: Record<string, string | undefined> = process.env,
) {
  const required = (key: string) => {
    const value = environment[key]?.trim();
    if (!value) throw new Error(`Missing WhatsApp configuration: ${key}`);
    return value;
  };
  const version = required("WHATSAPP_GRAPH_VERSION");
  const phoneId = required("WHATSAPP_PHONE_NUMBER_ID");
  const number = required("WHATSAPP_BUSINESS_NUMBER");
  if (
    !/^v\d+\.0$/.test(version) ||
    !/^\d+$/.test(phoneId) ||
    !/^[1-9]\d{6,14}$/.test(number)
  )
    throw new Error("Invalid WhatsApp configuration");
  return {
    version,
    phoneId,
    number,
    appSecret: required("WHATSAPP_APP_SECRET"),
    verifyToken: required("WHATSAPP_VERIFY_TOKEN"),
    accessToken: required("WHATSAPP_ACCESS_TOKEN"),
  };
}
export type WhatsAppConfig = ReturnType<typeof whatsappConfig>;
