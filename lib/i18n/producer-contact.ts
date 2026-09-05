import type { Locale } from "./locales";

const ENGLISH_MESSAGES = {
  title: "Write to the producer",
  message: "Your message",
  placeholder: "What would you like to know before visiting or ordering?",
  action: "Continue in your email app",
  explanation: "Your email app will open with this message. You can review it and send it from there.",
};

export type ProducerContactMessages = typeof ENGLISH_MESSAGES;

const MESSAGES: Partial<Record<Locale, ProducerContactMessages>> = {
  en: ENGLISH_MESSAGES,
  es: {
    title: "Escribe al productor",
    message: "Tu mensaje",
    placeholder: "¿Qué te gustaría saber antes de visitar o hacer un pedido?",
    action: "Continuar en tu correo",
    explanation: "Se abrirá tu aplicación de correo con este mensaje. Allí podrás revisarlo y enviarlo.",
  },
  ca: {
    title: "Escriu al productor",
    message: "El teu missatge",
    placeholder: "Què t'agradaria saber abans de visitar o fer una comanda?",
    action: "Continua al teu correu",
    explanation: "S'obrirà l'aplicació de correu amb aquest missatge. Allà podràs revisar-lo i enviar-lo.",
  },
  de: {
    title: "Dem Erzeuger schreiben",
    message: "Deine Nachricht",
    placeholder: "Was möchtest du vor einem Besuch oder einer Bestellung wissen?",
    action: "In deiner E-Mail-App fortfahren",
    explanation: "Deine E-Mail-App öffnet sich mit dieser Nachricht. Dort kannst du sie prüfen und senden.",
  },
  fr: {
    title: "Écrire au producteur",
    message: "Votre message",
    placeholder: "Que souhaitez-vous savoir avant une visite ou une commande ?",
    action: "Continuer dans votre messagerie",
    explanation: "Votre messagerie s'ouvrira avec ce message. Vous pourrez le relire et l'envoyer depuis celle-ci.",
  },
  it: {
    title: "Scrivi al produttore",
    message: "Il tuo messaggio",
    placeholder: "Cosa vorresti sapere prima di una visita o di un ordine?",
    action: "Continua nella tua app email",
    explanation: "La tua app email si aprirà con questo messaggio. Potrai rileggerlo e inviarlo da lì.",
  },
  ja: {
    title: "生産者にメッセージを書く",
    message: "メッセージ",
    placeholder: "訪問や注文の前に知りたいことはありますか？",
    action: "メールアプリで続ける",
    explanation: "このメッセージを入力したメールアプリが開きます。内容を確認してから送信できます。",
  },
  nl: {
    title: "Schrijf de producent",
    message: "Je bericht",
    placeholder: "Wat wil je weten voordat je langskomt of bestelt?",
    action: "Verder in je e-mailapp",
    explanation: "Je e-mailapp opent met dit bericht. Daar kun je het controleren en versturen.",
  },
  pt: {
    title: "Escreve ao produtor",
    message: "A tua mensagem",
    placeholder: "O que gostarias de saber antes de visitar ou encomendar?",
    action: "Continuar no teu email",
    explanation: "A tua aplicação de email abrirá com esta mensagem. Poderás revê-la e enviá-la a partir daí.",
  },
};

export function getProducerContactMessages(locale: Locale): ProducerContactMessages {
  return MESSAGES[locale] ?? ENGLISH_MESSAGES;
}
