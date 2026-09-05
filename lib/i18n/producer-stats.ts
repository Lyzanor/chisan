import type { Locale } from "./locales";

const en = {
  title: "Profile statistics",
  link: "Statistics",
  premium: "Included in your premium profile",
  description: "See how often people open your producer profile.",
  total: "Total visits",
  today: "Today",
  last7: "Last 7 days",
  last30: "Last 30 days",
  about: "How visits are counted",
  evolution: "Visits over the last 30 days",
  daily: "See daily figures",
  date: "Date",
  visits: "Visits",
  empty:
    "No visits recorded yet. Your figures will appear here as people open your profile.",
  method:
    "Each opening of the public profile counts as a visit, including repeat visits by the same person. These are visits, not unique people. Your signed-in team’s visits, recognized bots and page preloads are excluded. Browser privacy choices and blockers may prevent recording.",
  period:
    "Days use UTC. The 7-day and 30-day periods include today, which is still in progress. Recording starts when this feature is activated; earlier visits cannot be recovered.",
  private:
    "Only you, as the verified owner with an active premium profile, can see these figures.",
  locked: "Statistics are available with an active premium profile.",
  disabled: "Visit recording is not active at the moment.",
  unavailable:
    "Statistics are temporarily unavailable. Please try again later.",
  back: "Edit profile",
  publicProfile: "View public profile",
  retry: "Try again",
};
type Labels = typeof en;
const es: Labels = {
  title: "Estadísticas de la ficha",
  link: "Estadísticas",
  premium: "Incluido en tu perfil premium",
  description: "Consulta cuántas veces abren la ficha de tu productor.",
  total: "Visitas totales",
  today: "Hoy",
  last7: "Últimos 7 días",
  last30: "Últimos 30 días",
  about: "Cómo se cuentan las visitas",
  evolution: "Visitas de los últimos 30 días",
  daily: "Ver cifras por día",
  date: "Fecha",
  visits: "Visitas",
  empty:
    "Todavía no hay visitas registradas. Las cifras aparecerán aquí cuando alguien abra tu ficha.",
  method:
    "Cada apertura de la ficha pública cuenta como una visita, aunque una misma persona entre varias veces. Son visitas, no personas únicas. Se excluyen las visitas de tu equipo con sesión iniciada, los robots reconocidos y las precargas. Las preferencias de privacidad y los bloqueadores del navegador pueden impedir el registro.",
  period:
    "Los días se calculan en UTC. Los periodos de 7 y 30 días incluyen hoy, que sigue en curso. El recuento empieza al activar esta función; no se pueden recuperar visitas anteriores.",
  private:
    "Solo tú, como titular verificado con un perfil premium activo, puedes consultar estas cifras.",
  locked: "Las estadísticas están disponibles con un perfil premium activo.",
  disabled: "El registro de visitas no está activo en este momento.",
  unavailable:
    "Las estadísticas no están disponibles temporalmente. Inténtalo de nuevo más tarde.",
  back: "Editar ficha",
  publicProfile: "Ver ficha pública",
  retry: "Volver a intentar",
};
const ca: Labels = {
  title: "Estadístiques de la fitxa",
  link: "Estadístiques",
  premium: "Inclòs en el teu perfil premium",
  description: "Consulta quantes vegades obren la fitxa del teu productor.",
  total: "Visites totals",
  today: "Avui",
  last7: "Últims 7 dies",
  last30: "Últims 30 dies",
  about: "Com es compten les visites",
  evolution: "Visites dels últims 30 dies",
  daily: "Veure les xifres per dia",
  date: "Data",
  visits: "Visites",
  empty:
    "Encara no hi ha visites registrades. Les xifres apareixeran aquí quan algú obri la teva fitxa.",
  method:
    "Cada obertura de la fitxa pública compta com una visita, encara que una mateixa persona hi entri diverses vegades. Són visites, no persones úniques. S’exclouen les visites del teu equip amb la sessió iniciada, els robots reconeguts i les precàrregues. Les preferències de privadesa i els bloquejadors del navegador poden impedir el registre.",
  period:
    "Els dies es calculen en UTC. Els períodes de 7 i 30 dies inclouen avui, que continua en curs. El recompte comença en activar aquesta funció; no es poden recuperar visites anteriors.",
  private:
    "Només tu, com a titular verificat amb un perfil premium actiu, pots consultar aquestes xifres.",
  locked: "Les estadístiques estan disponibles amb un perfil premium actiu.",
  disabled: "El registre de visites no està actiu en aquest moment.",
  unavailable:
    "Les estadístiques no estan disponibles temporalment. Torna-ho a provar més tard.",
  back: "Editar fitxa",
  publicProfile: "Veure la fitxa pública",
  retry: "Torna-ho a provar",
};
export function getProducerStatsLabels(locale: Locale): Labels {
  return locale === "es" ? es : locale === "ca" ? ca : en;
}
