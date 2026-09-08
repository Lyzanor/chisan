import type { Locale } from "./locales";
const labels: Record<string, readonly string[]> = {
  ecologico: ["Ecológico", "Ecològic", "Organic"],
  biodinamico_demeter: ["Biodinámico · Demeter (privado)", "Biodinàmic · Demeter (privat)", "Biodynamic · Demeter (private)"],
  dop: ["Denominación de Origen Protegida (DOP)", "Denominació d’Origen Protegida (DOP)", "Protected Designation of Origin (PDO)"],
  igp: ["Indicación Geográfica Protegida (IGP)", "Indicació Geogràfica Protegida (IGP)", "Protected Geographical Indication (PGI)"],
  artesania_alimentaria: ["Artesanía alimentaria", "Artesania alimentària", "Food craftsmanship"],
  "cita previa obligatoria": ["Cita previa obligatoria", "Cita prèvia obligatòria", "Booking required"],
  "cita previa recomendada": ["Cita previa recomendada", "Cita prèvia recomanada", "Booking recommended"],
  "acceso libre en horario": ["Acceso libre en horario", "Accés lliure dins l’horari", "Walk in during opening hours"],
  "sí": ["Sí", "Sí", "Yes"], "no": ["No", "No", "No"],
  "bajo consulta": ["Bajo consulta", "Sota consulta", "On request"],
  contact: ["Contacto profesional / HORECA", "Contacte professional / HORECA", "Professional / hospitality contact"],
  subject: ["Consulta profesional / HORECA", "Consulta professional / HORECA", "Professional / hospitality enquiry"],
  demo: ["Ejemplo ficticio · Sin certificación real", "Exemple fictici · Sense certificació real", "Fictional example · No real certification"],
};
export function premiumValueLabel(value: string, locale: Locale): string {
  return labels[value]?.[locale === "es" ? 0 : locale === "ca" ? 1 : 2] ?? value;
}
