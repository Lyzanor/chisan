/**
 * Devuelve el emoji asociado a una categoría. Compartido entre página principal y menú móvil.
 */
export function getCategoryIcon(value: string): string {
  if (/vino|bodega/i.test(value)) return "🍷";
  if (/ques/i.test(value)) return "🧀";
  if (/pan|boll|horno|pastel/i.test(value)) return "🍞";
  if (/miel/i.test(value)) return "🍯";
  if (/cerve/i.test(value)) return "🍺";
  if (/fruta/i.test(value)) return "🍎";
  if (/verdura|hort|agric/i.test(value)) return "🥦";
  if (/aceite|oliva/i.test(value)) return "🫒";
  if (/charcut|carne|embut/i.test(value)) return "🥩";
  if (/pescado|marisc/i.test(value)) return "🐟";
  if (/chocolate|cacao|bombon/i.test(value)) return "🍫";
  if (/caf[eé]|infus/i.test(value)) return "☕";
  if (/sidra/i.test(value)) return "🍏";
  if (/zumo|mosto/i.test(value)) return "🧃";
  if (/helado/i.test(value)) return "🍨";
  if (/huevo|ave|granja/i.test(value)) return "🥚";
  if (/hierb/i.test(value)) return "🌿";
  return "🧺";
}
