import { ClerkProvider, useAuth, useClerk, useSSO } from "@clerk/expo";
import { useHostedAuth } from "@clerk/expo/hosted-auth";
import { useSignInWithApple } from "@clerk/expo/apple";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, AppState, Platform, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import outfit from "../../../app/_fonts/outfit.ttf";
import { CatalogChangedError, MobileHttpError, catalogAreas, fetchJson, fetchProducers, mobileOrigin, producerSearchPath, savedArea, serializeArea, webUrl, type MobileArea, type MobileResults } from "./catalog";
import { areaStorage, deviceLocation } from "./device";
import { Launch } from "./launch";
import { locateArea } from "./location";
import { AccountAccess, ChooseArea, Home, Producers } from "./screens";
import { Action, Notice, Screen, styles, type MobileTab } from "./ui";

WebBrowser.maybeCompleteAuthSession();
const origin = mobileOrigin(process.env.EXPO_PUBLIC_CHISAN_ORIGIN, __DEV__);
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const appleEnabled = process.env.EXPO_PUBLIC_CHISAN_APPLE_SIGN_IN_ENABLED === "true";

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
  async function enter(provider?: "google" | "apple", mode: "sign-in" | "sign-up" = "sign-in") {
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setMessage("");
    try {
      if (provider === "apple") {
        if (Platform.OS !== "ios") return;
        const result = await startAppleAuthenticationFlow();
        if (result.createdSessionId && result.setActive) await result.setActive({ session: result.createdSessionId });
        else if (result.signUp?.status === "missing_requirements" || result.signIn?.status === "needs_second_factor") setMessage("Falta completar tu acceso. Continúa con correo para terminarlo de forma segura.");
      } else if (provider === "google") {
        const result = await startSSOFlow({ strategy: "oauth_google", redirectUrl: "chisan://sso-callback" });
        if (result.createdSessionId && result.setActive) await result.setActive({ session: result.createdSessionId });
        else if (result.authSessionResult?.type === "success") setMessage("Falta completar tu acceso. Continúa con correo para terminarlo de forma segura.");
      } else {
        await startHostedAuth({ mode, redirectUrl: "chisan://sso-callback" });
      }
    } catch { setMessage("No se ha podido completar el acceso. Puedes seguir explorando e intentarlo más tarde."); }
    finally { inFlight.current = false; setBusy(false); }
  }
  return <AccountAccess busy={busy} message={message} appleEnabled={appleEnabled} onSocial={provider => void enter(provider)}
    onHosted={mode => void enter(undefined, mode)}
    onPrivacy={() => { void openWeb("/privacy").catch(() => setMessage("No se ha podido abrir la página.")); }} />;
}

function AccountSummary() {
  const { getToken } = useAuth();
  const { signOut } = useClerk();
  const [status, setStatus] = useState<"checking" | "active" | "inactive" | "unavailable">("checking");
  const [message, setMessage] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    async function check() {
      setStatus("checking");
      try {
        const token = await getToken();
        if (!token) throw new Error("Missing session.");
        const account = await fetchJson(origin, "/api/mobile/account", token) as { status?: string };
        if (active) setStatus(account.status === "active" ? "active" : "unavailable");
      } catch (error) {
        if (active) setStatus(error instanceof MobileHttpError && [401, 403].includes(error.status) ? "inactive" : "unavailable");
      }
    }
    void check();
    const subscription = AppState.addEventListener("change", state => { if (state === "active") void check(); });
    return () => { active = false; subscription.remove(); };
  }, [getToken, attempt]);
  return <>
    <Text style={styles.kicker}>TU CUENTA</Text>
    <Text accessibilityRole="header" style={styles.title}>Cuenta de Chisan</Text>
    {status === "checking" ? <ActivityIndicator accessibilityLabel="Comprobando cuenta" /> : null}
    {status === "active" ? <>
      <Text style={styles.text}>Tu sesión está activa. Las gestiones de cuenta y productor se abren en Chisan web.</Text>
      <Action onPress={() => { void openWeb("/cuenta").catch(() => setMessage("No se ha podido abrir tu cuenta.")); }}>Mi cuenta en la web ↗</Action>
      <Action secondary onPress={() => { void openWeb("/cuenta/reclamaciones").catch(() => setMessage("No se ha podido abrir la verificación.")); }}>Verificar mi productor en la web ↗</Action>
    </> : null}
    {status === "inactive" ? <Notice>Esta sesión no tiene una cuenta activa de Chisan. Revisa el acceso o entra con otra cuenta.</Notice> : null}
    {status === "unavailable" ? <Notice>Ahora no podemos consultar tu cuenta. El catálogo público sigue disponible; vuelve a intentarlo cuando se restablezca el servicio.</Notice> : null}
    {status !== "active" && status !== "checking" ? <Action onPress={() => setAttempt(value => value + 1)}>Reintentar acceso</Action> : null}
    {message ? <Notice>{message}</Notice> : null}
    <Action secondary onPress={() => { void signOut().catch(() => setMessage("No se ha podido cerrar la sesión.")); }}>Cerrar sesión</Action>
  </>;
}

function Account() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    if (isLoaded) return;
    const timer = setTimeout(() => setTimedOut(true), 8_000);
    return () => clearTimeout(timer);
  }, [isLoaded]);
  if (!isLoaded) return timedOut ? <Notice>No se ha podido cargar el acceso. Puedes seguir explorando e intentarlo más tarde.</Notice>
    : <ActivityIndicator accessibilityLabel="Cargando acceso" />;
  return isSignedIn ? <AccountSummary key={userId} /> : <SignIn />;
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

function MobileExperience({ fontReady }: { fontReady: boolean }) {
  const [tab, setTab] = useState<MobileTab>("home");
  const [areas, setAreas] = useState<MobileArea[] | null>(null);
  const [area, setArea] = useState<MobileArea | null>(null);
  const [failure, setFailure] = useState("");
  const [message, setMessage] = useState("");
  const [locating, setLocating] = useState(false);
  const [manualSelector, setManualSelector] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [launchFinished, setLaunchFinished] = useState(false);
  const operation = useRef(0);
  useEffect(() => {
    let active = true;
    const pendingOperations = operation;
    async function load() {
      try {
        const [discovery, preference] = await Promise.all([fetchJson(origin, "/api/catalog/v1"), areaStorage.read()]);
        const enabled = catalogAreas(discovery);
        if (active) { setAreas(enabled); setArea(savedArea(preference, enabled)); setFailure(""); }
      } catch {
        if (active) setFailure("No se han podido cargar las zonas. Comprueba tu conexión y vuelve a intentarlo.");
      }
    }
    void load();
    return () => { active = false; pendingOperations.current++; };
  }, [attempt]);
  function choose(value: MobileArea) {
    operation.current++; setArea(value); setLocating(false); setMessage(""); setTab("explore");
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
  const finishLaunch = useCallback(() => setLaunchFinished(true), []);
  return <View style={{ flex: 1 }}>
    <Screen tab={tab} onTab={setTab}>
      {tab === "home" ? <Home area={area} locating={locating} areasReady={areas !== null} message={message}
        onLocate={() => void locate()} onExplore={() => { if (!area) setManualSelector(true); setTab("explore"); }} onAccount={() => setTab("account")} /> : null}
      {tab === "explore" ? <>
        {area ? <>
          <Catalog key={`${area.country}:${area.area}`} area={area} />
          <Action secondary onPress={() => { operation.current++; setArea(null); setManualSelector(true); void areaStorage.write(null); }}>Cambiar zona</Action>
        </> : areas ? <ChooseArea areas={areas} busy={locating} message={message} initialManual={manualSelector}
          onLocate={() => void locate()} onChoose={choose} /> : null}
      </> : null}
      {tab === "account" ? publishableKey ? <Account /> : <Notice>El acceso a cuentas no está configurado en esta versión. Puedes seguir explorando el catálogo.</Notice> : null}
      {failure && tab !== "account" ? <><Notice>{failure}</Notice><Action onPress={() => { setFailure(""); setAttempt(value => value + 1); }}>Reintentar zonas</Action></> : null}
      {!areas && !failure && tab !== "account" ? <ActivityIndicator accessibilityLabel="Cargando zonas" /> : null}
    </Screen>
    {!launchFinished ? <Launch ready={fontReady && (areas !== null || Boolean(failure))} onFinish={finishLaunch} /> : null}
  </View>;
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({ Outfit: outfit });
  return <SafeAreaProvider><StatusBar style="dark" />
    {publishableKey ? <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <MobileExperience fontReady={fontsLoaded || Boolean(fontError)} />
    </ClerkProvider> : <MobileExperience fontReady={fontsLoaded || Boolean(fontError)} />}
  </SafeAreaProvider>;
}
