import type { PropsWithChildren } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../../design/adapters/native-colors.json";
import wordmark from "../../../design/brand/assets/chisan-wordmark-ink.png";

export type MobileTab = "home" | "explore" | "account";
const tabs: { id: MobileTab; label: string }[] = [
  { id: "home", label: "Inicio" },
  { id: "explore", label: "Explorar" },
  { id: "account", label: "Cuenta" },
];

export function Screen({ children, tab, onTab }: PropsWithChildren<{ tab: MobileTab; onTab: (tab: MobileTab) => void }>) {
  return <SafeAreaView style={styles.root}>
    <ScrollView key={tab} contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <View style={styles.body}>
        <Image source={wordmark} style={styles.logo} alt="Chisan" accessibilityLabel="Chisan" resizeMode="contain" />
        {children}
      </View>
    </ScrollView>
    <View accessibilityRole="tablist" style={styles.tabBar}>
      {tabs.map(item => <Pressable key={item.id} accessibilityRole="tab" accessibilityState={{ selected: tab === item.id }}
        onPress={() => onTab(item.id)} style={[styles.tab, tab === item.id && styles.selectedTab]}>
        <Text style={[styles.tabText, tab === item.id && styles.selectedTabText]}>{item.label}</Text>
      </Pressable>)}
    </View>
  </SafeAreaView>;
}

export function Action({ children, onPress, disabled = false, secondary = false }: PropsWithChildren<{
  onPress: () => void; disabled?: boolean; secondary?: boolean;
}>) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
    style={({ pressed }) => [styles.button, secondary && styles.secondaryButton, (pressed || disabled) && styles.dimmed]}>
    <Text style={[styles.buttonText, secondary && styles.secondaryText]}>{children}</Text>
  </Pressable>;
}

export function Notice({ children }: PropsWithChildren) {
  return <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.notice}>{children}</Text>;
}

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors["rice-paper"] },
  page: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 28, paddingBottom: 40 },
  body: { width: "100%", maxWidth: 560, alignSelf: "center", gap: 20 },
  logo: { width: 116, height: 40, marginBottom: 20, alignSelf: "flex-start" },
  kicker: { color: colors.moss, fontFamily: "Outfit", fontSize: 14, lineHeight: 20 },
  title: { color: colors.ink, fontFamily: "Outfit", fontSize: 34, lineHeight: 40 },
  text: { color: colors.stone, fontFamily: "Outfit", fontSize: 17, lineHeight: 25 },
  small: { color: colors.stone, fontFamily: "Outfit", fontSize: 14, lineHeight: 21 },
  actions: { gap: 12, marginTop: 12 },
  button: { minHeight: 52, paddingVertical: 15, paddingHorizontal: 20, borderRadius: 8, backgroundColor: colors.moss, justifyContent: "center" },
  buttonText: { fontFamily: "Outfit", fontSize: 17, lineHeight: 23, color: colors.surface, textAlign: "center" },
  secondaryButton: { backgroundColor: colors["surface-muted"], borderWidth: 1, borderColor: colors.hairline },
  secondaryText: { color: colors.ink },
  dimmed: { opacity: 0.6 },
  notice: { color: colors.ink, backgroundColor: colors["moss-pale"], padding: 16, borderRadius: 8, fontFamily: "Outfit", fontSize: 15, lineHeight: 22 },
  input: { minHeight: 52, borderWidth: 1, borderColor: colors.stone, borderRadius: 8, padding: 14, fontFamily: "Outfit", fontSize: 17, color: colors.ink },
  card: { gap: 8, borderBottomWidth: 1, borderBottomColor: colors.hairline, paddingVertical: 20 },
  cardTitle: { color: colors.ink, fontFamily: "Outfit", fontSize: 22, lineHeight: 28 },
  tabBar: { flexDirection: "row", borderTopWidth: 1, borderTopColor: colors.hairline, backgroundColor: colors.surface, paddingHorizontal: 12, paddingTop: 8 },
  tab: { flex: 1, minHeight: 52, alignItems: "center", justifyContent: "center", borderRadius: 8 },
  selectedTab: { backgroundColor: colors["moss-pale"] },
  tabText: { fontFamily: "Outfit", fontSize: 15, color: colors.stone },
  selectedTabText: { color: colors.moss },
});
