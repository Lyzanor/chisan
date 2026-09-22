import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import type { WebViewNavigation } from "react-native-webview";
import outfit from "../../../app/_fonts/outfit.ttf";
import colors from "../../../design/adapters/native-colors.json";
import { Launch } from "./launch";
import { accountLinkBridge, isAccountUrl, mobileOrigin, webNavigation } from "./web-shell";

const origin = mobileOrigin(process.env.EXPO_PUBLIC_CHISAN_ORIGIN, __DEV__);

function Site() {
  const [fontsLoaded, fontError] = useFonts({ Outfit: outfit });
  const [sourceUri, setSourceUri] = useState(`${origin}/`);
  const [loaded, setLoaded] = useState(false);
  const [launchFinished, setLaunchFinished] = useState(false);
  const [error, setError] = useState("");
  const [canGoBack, setCanGoBack] = useState(false);
  const webView = useRef<WebView>(null);
  const currentUrl = useRef(`${origin}/`);
  const lastExternalized = useRef("");

  useEffect(() => {
    if (Platform.OS !== "android") return;
    const listener = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!canGoBack) return false;
      webView.current?.goBack();
      return true;
    });
    return () => listener.remove();
  }, [canGoBack]);

  const openBrowser = useCallback((url: string) => {
    void Linking.openURL(url).catch(() => setError("No se ha podido abrir el enlace. Inténtalo de nuevo."));
  }, []);

  const handleNavigation = useCallback((url: string) => {
    const destination = webNavigation(url, origin);
    if (destination === "browser") openBrowser(url);
    return destination === "embedded";
  }, [openBrowser]);

  const handleNewWindow = useCallback((url: string) => {
    const destination = webNavigation(url, origin);
    if (destination === "embedded") setSourceUri(url);
    else if (destination === "browser") openBrowser(url);
  }, [openBrowser]);

  const handleStateChange = useCallback((state: WebViewNavigation) => {
    const destination = webNavigation(state.url, origin);
    if (isAccountUrl(state.url, origin)) {
      if (lastExternalized.current !== state.url) {
        lastExternalized.current = state.url;
        openBrowser(state.url);
      }
      webView.current?.injectJavaScript(`window.location.replace(${JSON.stringify(currentUrl.current)}); true;`);
      return;
    }
    if (destination === "embedded") {
      currentUrl.current = state.url;
      lastExternalized.current = "";
      setCanGoBack(state.canGoBack);
    }
  }, [openBrowser]);

  return <SafeAreaView edges={["top", "bottom"]} style={styles.root}>
    <StatusBar style="dark" />
    <WebView
      ref={webView}
      source={{ uri: sourceUri }}
      style={styles.webView}
      javaScriptEnabled
      domStorageEnabled
      geolocationEnabled
      setSupportMultipleWindows
      allowsBackForwardNavigationGestures
      mixedContentMode="never"
      webviewDebuggingEnabled={__DEV__}
      injectedJavaScript={accountLinkBridge(origin)}
      onShouldStartLoadWithRequest={request => handleNavigation(request.url)}
      onOpenWindow={event => handleNewWindow(event.nativeEvent.targetUrl)}
      onMessage={event => {
        try {
          const message = JSON.parse(event.nativeEvent.data) as { type?: string; url?: string };
          if (message.type === "open-account" && message.url && isAccountUrl(message.url, origin)) {
            openBrowser(message.url);
          }
        } catch { /* Ignore malformed messages from web content. */ }
      }}
      onNavigationStateChange={handleStateChange}
      onLoadEnd={() => setLoaded(true)}
      onError={() => { setLoaded(true); setError("No se ha podido cargar Chisan. Comprueba tu conexión y vuelve a intentarlo."); }}
      onHttpError={event => {
        if (event.nativeEvent.statusCode >= 500 && event.nativeEvent.url === currentUrl.current) {
          setError("Chisan no está disponible ahora. Vuelve a intentarlo en un momento.");
        }
      }}
    />
    {error && launchFinished ? <View style={styles.error} accessibilityRole="alert">
      <Text style={styles.errorTitle}>No se ha podido abrir Chisan</Text>
      <Text style={styles.errorText}>{error}</Text>
      <Pressable accessibilityRole="button" style={styles.retry} onPress={() => { setError(""); webView.current?.reload(); }}>
        <Text style={styles.retryText}>Reintentar</Text>
      </Pressable>
    </View> : null}
    {!launchFinished ? <Launch ready={(fontsLoaded || Boolean(fontError)) && (loaded || Boolean(error))}
      onFinish={() => setLaunchFinished(true)} /> : null}
  </SafeAreaView>;
}

export default function App() {
  return <SafeAreaProvider><Site /></SafeAreaProvider>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors["rice-paper"] },
  webView: { flex: 1, backgroundColor: colors["rice-paper"] },
  error: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0,
    alignItems: "center", justifyContent: "center", gap: 16,
    padding: 28, backgroundColor: colors["rice-paper"] },
  errorTitle: { fontFamily: "Outfit", fontSize: 28, color: colors.ink, textAlign: "center" },
  errorText: { fontFamily: "Outfit", fontSize: 17, color: colors.stone, textAlign: "center" },
  retry: { backgroundColor: colors.moss, minHeight: 52, minWidth: 160, borderRadius: 8, justifyContent: "center" },
  retryText: { fontFamily: "Outfit", fontSize: 17, color: colors.surface, textAlign: "center" },
});
