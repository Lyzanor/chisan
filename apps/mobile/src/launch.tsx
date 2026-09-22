import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Easing, Image, Platform, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import colors from "../../../design/adapters/native-colors.json";
import c from "../assets/intro-c.png";
import hisan from "../assets/intro-hisan.png";
import mascot from "../assets/intro-mascot.png";

const nativeDriver = Platform.OS !== "web";

// These three images are the layers in chisan-intro.html. The native sequence
// plays once, after discovery has either loaded or reported a recoverable error.
export function Launch({ ready, onFinish }: { ready: boolean; onFinish: () => void }) {
  const { width } = useWindowDimensions();
  const scale = Math.min(width - 48, 560) / 1485;
  const [flight] = useState(() => new Animated.Value(0));
  const [bob] = useState(() => new Animated.Value(0));
  const [reveal] = useState(() => new Animated.Value(0));
  const [fade] = useState(() => new Animated.Value(1));
  const idle = useRef<Animated.CompositeAnimation | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then(value => { if (active) setReduceMotion(value); });
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    return () => { active = false; subscription.remove(); };
  }, []);

  useEffect(() => {
    if (ready || reduceMotion) return;
    idle.current = Animated.loop(Animated.sequence([
      Animated.timing(bob, { toValue: -8 * scale, duration: 520, easing: Easing.inOut(Easing.sin), useNativeDriver: nativeDriver }),
      Animated.timing(bob, { toValue: 0, duration: 520, easing: Easing.inOut(Easing.sin), useNativeDriver: nativeDriver }),
    ]));
    idle.current.start();
    return () => idle.current?.stop();
  }, [ready, reduceMotion, bob, scale]);

  useEffect(() => {
    if (!ready) return;
    idle.current?.stop();
    if (reduceMotion) { onFinish(); return; }
    bob.setValue(0);
    const animation = Animated.sequence([
      Animated.parallel([
        Animated.timing(flight, { toValue: 1, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: nativeDriver }),
        Animated.sequence([
          Animated.delay(580),
          Animated.timing(reveal, { toValue: 1, duration: 460, easing: Easing.out(Easing.cubic), useNativeDriver: nativeDriver }),
        ]),
      ]),
      Animated.delay(200),
      Animated.timing(fade, { toValue: 0, duration: 320, useNativeDriver: nativeDriver }),
    ]);
    animation.start(({ finished }) => { if (finished) onFinish(); });
    return () => animation.stop();
  }, [ready, reduceMotion, bob, flight, reveal, fade, onFinish]);

  const flightX = flight.interpolate({ inputRange: [0, 1], outputRange: [-290 * scale, 0] });
  const flightY = flight.interpolate({ inputRange: [0, 0.55, 1], outputRange: [170 * scale, -96 * scale, 0] });
  return <Animated.View pointerEvents="auto" accessibilityLabel="Iniciando Chisan" style={[styles.overlay, { opacity: fade }]}>
    <View style={{ width: 1485 * scale, height: 339 * scale }}>
      <Image source={c} alt="" resizeMode="stretch" style={[styles.layer, { left: 0, width: 354 * scale, height: 334 * scale }]} />
      <Animated.Image source={hisan} resizeMode="stretch" style={[styles.layer, {
        left: 340 * scale, width: 1145 * scale, height: 339 * scale, opacity: reveal,
        transform: [{ translateX: reveal.interpolate({ inputRange: [0, 1], outputRange: [-28 * scale, 0] }) }],
      }]} />
      <Animated.View style={[styles.layer, {
        left: 259 * scale, width: 95 * scale, height: 87 * scale,
        transform: [{ translateX: flightX }, { translateY: Animated.add(flightY, bob) }],
      }]}>
        <Image source={mascot} alt="" resizeMode="stretch" style={{ width: 95 * scale, height: 87 * scale }} />
        <Animated.View style={[styles.eye, { left: 29.5 * scale, top: 37.5 * scale, width: 11 * scale, height: 11 * scale,
          borderRadius: 5.5 * scale, opacity: flight.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 1, 0] }) }]} />
        <Animated.View style={[styles.eye, { left: 55.5 * scale, top: 37.5 * scale, width: 11 * scale, height: 11 * scale,
          borderRadius: 5.5 * scale, opacity: flight.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 1, 0] }) }]} />
      </Animated.View>
    </View>
    <Text style={styles.tagline}>Conecta con lo que se produce cerca de ti</Text>
  </Animated.View>;
}

const styles = StyleSheet.create({
  overlay: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, zIndex: 10, backgroundColor: colors["rice-paper"], alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  layer: { position: "absolute", top: 0 },
  eye: { position: "absolute", backgroundColor: colors.surface },
  tagline: { marginTop: 24, color: colors.stone, fontFamily: "Outfit", fontSize: 16, textAlign: "center" },
});
