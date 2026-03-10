export function getCategoryEmoji(category: string): string {
  if (/vino|bodega/i.test(category)) return "🍷";
  if (/ques/i.test(category)) return "🧀";
  if (/pan|boll|horno|pastel/i.test(category)) return "🥖";
  if (/miel/i.test(category)) return "🍯";
  if (/cerve/i.test(category)) return "🍺";
  if (/fruta|verdura|hort|agric/i.test(category)) return "🥕";
  if (/aceite|oliva/i.test(category)) return "🫒";
  if (/charcut|carne|embut/i.test(category)) return "🥩";
  if (/pescado|marisc/i.test(category)) return "🐟";
  if (/cafe|té|te/i.test(category)) return "☕";
  return "🧺";
}
