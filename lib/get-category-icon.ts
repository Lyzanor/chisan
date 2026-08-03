/**
 * Devuelve el emoji asociado a una categoría. Compartido entre página principal y menú móvil.
 *
 * La cascada se lee de arriba abajo y cubre el conjunto vigente de
 * `data/reference/categories.json`. Al añadir o renombrar una categoría hay que
 * pasar por aquí: lo que no casa ninguna rama cae al cesto, que es el icono
 * correcto sólo para `Otros` y `Despensa artesanal`.
 */
export function getCategoryIcon(value: string): string {
  if (/vino|bodega/i.test(value)) return "🍷";
  if (/ques/i.test(value)) return "🧀";
  if (/pan|pastel/i.test(value)) return "🍞";
  if (/miel/i.test(value)) return "🍯";
  if (/cerve/i.test(value)) return "🍺";
  if (/licor|destilad/i.test(value)) return "🥃";
  if (/bebida|zumo|mosto/i.test(value)) return "🧃";
  if (/caf[eé]/i.test(value)) return "☕";
  if (/t[eé] e infus|infus/i.test(value)) return "🍵";
  if (/fruto/i.test(value)) return "🌰";
  if (/fruta|verdura/i.test(value)) return "🍎";
  if (/aceite/i.test(value)) return "🫒";
  if (/carne/i.test(value)) return "🥩";
  if (/pescado/i.test(value)) return "🐟";
  if (/chocolate/i.test(value)) return "🍫";
  if (/helado/i.test(value)) return "🍨";
  if (/huevo/i.test(value)) return "🥚";
  if (/seta|trufa|hongo/i.test(value)) return "🍄";
  if (/legumbre/i.test(value)) return "🫘";
  if (/condimento|especia/i.test(value)) return "🧂";
  if (/conserva/i.test(value)) return "🥫";
  if (/dulce|reposter/i.test(value)) return "🍰";
  if (/comida|preparad/i.test(value)) return "🍲";
  if (/aperitivo/i.test(value)) return "🥨";
  return "🧺";
}
