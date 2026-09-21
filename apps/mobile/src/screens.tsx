import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SITE_TAGLINE } from "../../../lib/site";
import type { MobileArea, MobileProducer } from "./catalog";
import { Action, Notice, styles } from "./ui";

export function Welcome({ busy, message, onSocial, onHosted, onPrivacy }: {
  busy: boolean; message: string; onSocial: (provider: "google" | "apple") => void;
  onHosted: () => void; onPrivacy: () => void;
}) {
  return <>
    <Text style={styles.kicker}>CERCA DE TI</Text>
    <Text accessibilityRole="header" style={styles.title}>{SITE_TAGLINE}</Text>
    <Text style={styles.text}>Entra con tu cuenta y descubre a los productores de tu zona.</Text>
    <View style={styles.actions}>
      <Action disabled={busy} secondary onPress={() => onSocial("google")}>Continuar con Google</Action>
      <Action disabled={busy} secondary onPress={() => onSocial("apple")}>Continuar con Apple</Action>
      <Action disabled={busy} onPress={onHosted}>{busy ? "Abriendo acceso…" : "Continuar con correo u otro método"}</Action>
    </View>
    <Text style={styles.small}>Si ya usas Chisan en la web, entra con la misma cuenta. Si es tu primera vez, podrás crearla al continuar.</Text>
    {message ? <Notice>{message}</Notice> : null}
    <Action secondary onPress={onPrivacy}>Privacidad</Action>
  </>;
}

export function ChooseArea({ areas, busy, message, onLocate, onChoose }: {
  areas: MobileArea[]; busy: boolean; message: string;
  onLocate: () => void; onChoose: (area: MobileArea) => void;
}) {
  const [manual, setManual] = useState(false);
  const [query, setQuery] = useState("");
  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const visible = areas.filter(area => normalize(`${area.label} ${area.countryLabel}`).includes(normalize(query)));
  return <>
    <Text style={styles.kicker}>TU ZONA</Text>
    <Text accessibilityRole="header" style={styles.title}>Empecemos por lo que tienes cerca</Text>
    <Text style={styles.text}>Usa tu ubicación para encontrar tu zona. También puedes elegirla tú.</Text>
    <Action disabled={busy} onPress={onLocate}>{busy ? "Buscando tu zona…" : "Usar mi ubicación"}</Action>
    <Text style={styles.small}>Solo la usamos en este momento. Guardamos la zona elegida, nunca tu posición exacta.</Text>
    {message ? <Notice>{message}</Notice> : null}
    <Action secondary onPress={() => setManual(!manual)}>{manual ? "Cerrar selector de zona" : "Elegir zona manualmente"}</Action>
    {manual ? <View style={styles.actions}>
      <TextInput style={styles.input} accessibilityLabel="Buscar zona" placeholder="Buscar zona" value={query} onChangeText={setQuery} autoCorrect={false} />
      {visible.map(area => <Action key={`${area.country}:${area.area}`} secondary onPress={() => onChoose(area)}>{area.label} · {area.countryLabel}</Action>)}
      {!visible.length ? <Text style={styles.text}>No encontramos esa zona en el catálogo actual.</Text> : null}
    </View> : null}
  </>;
}

export function Producers({ area, producers, onOpen }: { area: MobileArea; producers: MobileProducer[]; onOpen: (url: string) => void }) {
  return <>
    <Text style={styles.kicker}>DESCUBRE TU ZONA</Text>
    <Text accessibilityRole="header" style={styles.title}>{area.label}</Text>
    <Text style={styles.text}>Conoce a quienes producen aquí y descubre su trabajo.</Text>
    {producers.map(producer => <Pressable accessibilityRole="link" accessibilityLabel={`Ver ${producer.name} en la web de Chisan`}
      key={`${producer.country}:${producer.producer_id}`} onPress={() => onOpen(producer.url)} style={styles.card}>
      <Text style={styles.small}>{producer.categories.map(category => category.label).join(" · ")}</Text>
      <Text style={styles.cardTitle}>{producer.name}</Text>
      <Text style={styles.text}>{producer.municipality}</Text>
      {producer.description ? <Text numberOfLines={3} style={styles.small}>{producer.description.text}</Text> : null}
      <Text style={styles.kicker}>Ver ficha en Chisan ↗</Text>
    </Pressable>)}
  </>;
}
