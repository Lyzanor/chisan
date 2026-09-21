import { ClerkProvider, useAuth, useClerk, useSSO } from "@clerk/expo";
import { useHostedAuth } from "@clerk/expo/hosted-auth";
import { useSignInWithApple } from "@clerk/expo/apple";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, AppState, Platform, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import outfit from "../../../app/_fonts/outfit.ttf";
import { CatalogChangedError, catalogAreas, fetchJson, fetchProducers, mobileOrigin, producerSearchPath, savedArea, serializeArea, webUrl, type MobileArea, type MobileResults } from "./catalog";
import { areaStorage, deviceLocation } from "./device";
import { locateArea } from "./location";
import { ChooseArea, Producers, Welcome } from "./screens";
import { Action, Notice, Screen, styles } from "./ui";

WebBrowser.maybeCompleteAuthSession();
const origin = mobileOrigin(process.env.EXPO_PUBLIC_CHISAN_ORIGIN, __DEV__);
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

async function openWeb(path: string) {
  await WebBrowser.openBrowserAsync(webUrl(path, origin));
}

function SignIn() {
  const { startSSOFlow } = useSSO();
  const { startAppleAuthenticationFlow } = useSignInWithApple();
  const { startHostedAuth } = useHostedAuth();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const inFlight = useRef(false);
  async function enter(provider?: "google" | "apple") {
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setMessage("");
    try {
      if (provider === "apple") {
        if (Platform.OS !== "ios") return;
        const result = await startAppleAuthenticationFlow();
        if (result.createdSessionId && result.setActive) await result.setActive({ session: result.createdSessionId });
        else if (result.signUp?.status === "missing_requirements" || result.signIn?.status === "needs_second_factor") setMessage("Falta completar tu acceso. Continúa con correo u otro método para terminarlo de forma segura.");
      } else if (provider === "google") {
        const result = await startSSOFlow({ strategy: "oauth_google", redirectUrl: "chisan://sso-callback" });
        if (result.createdSessionId && result.setActive) await result.setActive({ session: result.createdSessionId });
        else if (result.authSessionResult?.type === "success") setMessage("Falta completar tu acceso. Continúa con correo u otro método para terminarlo de forma segura.");
      } else await startHostedAuth({ redirectUrl: "chisan://sso-callback" });
    } catch { setMessage("No se ha podido completar el acceso. Inténtalo de nuevo o elige otro método."); }
    finally { inFlight.current = false; setBusy(false); }
  }
  return <Welcome busy={busy} message={message} onSocial={provider => void enter(provider)} onHosted={() => void enter()}
    onPrivacy={() => { void openWeb("/privacy").catch(() => setMessage("No se ha podido abrir la página.")); }} />;
}

function Catalog({ area }: { area: MobileArea }) {
  const [result, setResult] = useState<MobileResults | null>(null);
  const [busy, setBusy] = useState(true);
  const [message, setMessage] = useState("");
  const [attempt, setAttempt] = useState(0);
  const alive = useRef(true);
  const loading = useRef(false);
  useEffect(() => {
    let active = true; alive.current = true;
    fetchProducers(origin, producerSearchPath(area)).then(value => {
      if (active) { setResult(value); setMessage(""); }
    }).catch(() => { if (active) setMessage("No se ha podido cargar el catálogo. Comprueba tu conexión y vuelve a intentarlo."); })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; alive.current = false; };
  }, [area, attempt]);
  async function more() {
    if (!result?.next || loading.current) return;
    loading.current = true; setBusy(true); setMessage("");
    try {
      const page = await fetchProducers(origin, result.next);
      if (alive.current) setResult({ ...page, producers: [...result.producers, ...page.producers] });
    } catch (error) {
      if (alive.current) {
        if (error instanceof CatalogChangedError) { setResult(null); setAttempt(value => value + 1); }
        else setMessage("No se han podido cargar más productores. Puedes volver a intentarlo.");
      }
    } finally { loading.current = false; if (alive.current) setBusy(false); }
  }
  return <>
    <Producers area={area} producers={result?.producers ?? []} onOpen={url => { void openWeb(url).catch(() => setMessage("No se ha podido abrir la ficha.")); }} />
    {busy ? <ActivityIndicator accessibilityLabel="Cargando productores" /> : null}
    {message ? <Notice>{message}</Notice> : null}
    {!busy && !result ? <Action onPress={() => { setBusy(true); setAttempt(value => value + 1); }}>Reintentar</Action> : null}
    {result?.total === 0 ? <Text style={styles.text}>Todavía no hay productores publicados en esta zona.</Text> : null}
    {result?.next ? <Action secondary disabled={busy} onPress={() => void more()}>Ver más productores</Action> : null}
  </>;
}

function SignedIn() {
  const { getToken } = useAuth();
  const { signOut } = useClerk();
  const [areas, setAreas] = useState<MobileArea[] | null>(null);
  const [area, setArea] = useState<MobileArea | null>(null);
  const [checked, setChecked] = useState(false);
  const [failure, setFailure] = useState("");
  const [message, setMessage] = useState("");
  const [locating, setLocating] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const operation = useRef(0);
  useEffect(() => {
    let active = true;
    const pendingOperations = operation;
    async function load() {
      try {
        const token = await getToken();
        if (!token) throw new Error("Session unavailable.");
        const account = await fetchJson(origin, "/api/mobile/account", token) as { status?: string };
        if (account.status !== "active") throw new Error("Account unavailable.");
        const [discovery, preference] = await Promise.all([fetchJson(origin, "/api/catalog/v1"), areaStorage.read()]);
        const enabled = catalogAreas(discovery);
        if (active) { setAreas(enabled); setArea(savedArea(preference, enabled)); setChecked(true); setFailure(""); }
      } catch { if (active) { setChecked(false); setFailure("No hemos podido comprobar tu cuenta o cargar las zonas. Revisa tu conexión y vuelve a intentarlo."); } }
    }
    void load();
    const subscription = AppState.addEventListener("change", state => {
      if (state === "active") { setChecked(false); void load(); }
    });
    return () => { active = false; pendingOperations.current++; subscription.remove(); };
  }, [getToken, attempt]);
  function choose(value: MobileArea) {
    operation.current++; setArea(value); setLocating(false); setMessage("");
    void areaStorage.write(serializeArea(value));
  }
  async function locate() {
    if (!areas || locating) return;
    const revision = ++operation.current;
    setLocating(true); setMessage("");
    try {
      const found = await locateArea(deviceLocation, origin, areas);
      if (revision !== operation.current) return;
      if (found) choose(found);
      else setMessage("No hemos podido determinar tu zona. Puedes elegirla manualmente o revisar el permiso de ubicación.");
    } catch { if (revision === operation.current) setMessage("No se ha podido obtener tu ubicación. Puedes elegir tu zona manualmente."); }
    finally { if (revision === operation.current) setLocating(false); }
  }
  async function exit() {
    try { await signOut(); }
    catch { setMessage("No se ha podido cerrar la sesión. Inténtalo de nuevo."); }
  }
  return <>
    {!checked ? failure ? <><Notice>{failure}</Notice><Action onPress={() => { setFailure(""); setAttempt(value => value + 1); }}>Reintentar</Action></> : <ActivityIndicator accessibilityLabel="Comprobando cuenta" />
      : area ? <Catalog key={`${area.country}:${area.area}`} area={area} />
      : <ChooseArea areas={areas ?? []} busy={locating} message={message} onLocate={() => void locate()} onChoose={choose} />}
    {area && checked ? <>
      <Action secondary onPress={() => { operation.current++; setArea(null); void areaStorage.write(null); }}>Cambiar zona</Action>
      <Action secondary onPress={() => { void openWeb("/cuenta").catch(() => setMessage("No se ha podido abrir tu cuenta.")); }}>Mi cuenta en la web ↗</Action>
      <Action secondary onPress={() => { void openWeb("/cuenta/reclamaciones").catch(() => setMessage("No se ha podido abrir la verificación.")); }}>Verificar mi productor en la web ↗</Action>
    </> : null}
    {area && message ? <Notice>{message}</Notice> : null}
    <Action secondary onPress={() => void exit()}>Cerrar sesión</Action>
  </>;
}

function Session() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  if (!isLoaded) return <ActivityIndicator accessibilityLabel="Cargando cuenta" />;
  return isSignedIn ? <SignedIn key={userId} /> : <SignIn />;
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({ Outfit: outfit });
  return <SafeAreaProvider><StatusBar style="dark" /><Screen>
    {!fontsLoaded && !fontError ? <ActivityIndicator accessibilityLabel="Cargando Chisan" /> : !publishableKey ? <>
      <Text style={styles.title}>Chisan está preparando su acceso</Text>
      <Text style={styles.text}>El acceso a cuentas todavía no está configurado en esta versión.</Text>
    </> : <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}><Session /></ClerkProvider>}
  </Screen></SafeAreaProvider>;
}
