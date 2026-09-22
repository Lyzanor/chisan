# Android and iOS foundations

`apps/mobile` is one Expo / React Native application for Android and iOS. The
Next.js site remains the public website and backend. The first native flow is
the Chisan launch animation, a public welcome, device-local area selection and
a paginated producer list. The persistent **Inicio / Explorar / Cuenta** menu
keeps registration available without making it a condition of public discovery.
Producer profiles, account editing and ownership verification open their existing
web pages in the system browser. Distribution is currently private Android APK
testing only. No Play Store or App Store submission is authorized or configured.

## Shared ownership

- The public `/api/catalog/v1` provides published countries, areas and producers.
  No CSVs, private records or separately editable catalog ship in the app.
- The same Clerk instance identifies the person. SecureStore stores native
  session credentials through Clerk's token cache. `/api/mobile/account` validates
  the Bearer session and uses the existing internal-account resolver before
  showing account actions. Native login does not grant memberships or entitlements.
  Public discovery is anonymous and remains usable if Clerk is not configured or
  Neon account access is temporarily unavailable. A signed-in user sees a
  recoverable account message rather than losing the public catalog.
- `lib/location/location-onboarding.ts` and the reviewed geometry resolve the
  device position locally. The native adapter requests foreground permission only
  after **Usar mi ubicación**, uses balanced accuracy, a five-minute maximum cached
  age and an eight-second position deadline. There is no background tracking.
- Only the versioned `{ country, area }` preference is stored on the device. It is
  revalidated against current discovery on startup; **Cambiar zona** clears it.
  Permission denial, unavailable GPS, uncertain boundaries and network failures
  leave the manual selector usable. Language and account data stay independent.
- Native colors are generated from `design/foundations/tokens.css` with
  `pnpm build:mobile-tokens`; the app reuses the checked-in Chisan icon, wordmark and
  Outfit font. Native view layout belongs to `apps/mobile/src/ui.tsx`.

The native account screen is presentation, not an API authorization boundary.
Every future private native operation must reuse the
server's exact permission checks. A native session and a system-browser website
session are separate: opening account/verification pages may require signing in
again with the same provider. Do not put tokens in URLs or silently copy cookies.

## Local work

```bash
pnpm install --frozen-lockfile
cp apps/mobile/.env.example apps/mobile/.env.local
pnpm mobile:android
# On a Mac with full Xcode installed:
pnpm mobile:ios
# Once the development build is installed:
pnpm mobile:dev
```

Set the public Clerk key from the same instance as the target web server. Set
`EXPO_PUBLIC_CHISAN_ORIGIN` to that server's HTTPS origin, or a reachable LAN HTTP
origin during development. Start the web with `pnpm dev` when using its local
API. The default is production; a prepared local API is not automatically there.
Never include Clerk, Apple, Google, Meta or database secrets in an Expo public
variable. Build-time environment changes require a new bundle.

The application identifiers are `app.chisan.mobile`, and authentication returns
to `chisan://sso-callback`. Register the native applications and callback in the
same Clerk instance and enable its Native API. Google uses
Clerk's SSO flow in a system authentication browser. Apple is exclusive to iOS
and uses `useSignInWithApple` with `expo-apple-authentication`, without a web OAuth
fallback. Android and the Chisan website do not offer the Apple button. iOS
shows it only when `EXPO_PUBLIC_CHISAN_APPLE_SIGN_IN_ENABLED=true` in the build,
after the provider has been configured and tested. Hosted
authentication has separate sign-up and sign-in entry points for email,
additional verification and incomplete sign-up requirements.
Cancelling returns to the access screen. A saved valid session does not demand
a fresh login on every launch. The app rechecks account status on foregrounding.

`eas.json` defines development and internal preview profiles without
claiming an Expo account, EAS project, signing certificate or store listing.
The preview profile produces a standalone APK with its JavaScript bundled, not a
development client requiring Metro. It targets `https://chisan.app` and real
Chisan accounts. Configure `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` for the EAS preview
environment before building; local `.env.local` is ignored by Git and must not be
assumed to exist in a remote build. Local app versions own the version counter.

When an APK is requested, use `eas build --platform android --profile preview`
from `apps/mobile`, after linking an owner-controlled Expo project and choosing
a persistent signing key. Preserve that key for installable updates and register
its actual SHA-256 fingerprint in Clerk. Do not enable auto-submit or create a
store listing. A local signed Gradle build is also possible without EAS; never
substitute the public template debug key for the private tester signing key.

Register those with the project owner before a signed distribution. Native
projects are generated by `pnpm --filter @chisan/mobile prebuild` and ignored in
Git; configuration and plugins are their source. Full Xcode and the matching
Android SDK/JDK are required to compile device binaries.

## Activation and verification

Google is already enabled in the inspected production Clerk instance (public
configuration checked 2026-09-21). Native API is enabled and the exact
`chisan://sso-callback` URL is allowlisted in that instance. No wildcard callback
was added. The ignored local mobile environment contains only its public key and
the Chisan origin; no backend credentials were copied.

Apple was absent. Its native activation needs the owner's Apple Developer Team
ID, the `app.chisan.mobile` Bundle ID with Sign in with Apple, and that native app
registered in Clerk. Keep web Apple OAuth unconfigured; if the shared provider
is enabled, verify the hosted email flow still does not offer an unusable Apple
web option. Set the native Apple build flag only after testing this setup. The
Chisan web widgets hide the Apple buttons through their shared
provider appearance. Frontend deployment does not activate a provider. Follow
[native Sign in with Apple](https://clerk.com/docs/expo/guides/configure/auth-strategies/sign-in-with-apple),
[Clerk hosted authentication](https://clerk.com/docs/expo/guides/account-portal/hosted-auth)
and [social connections](https://clerk.com/docs/guides/configure/auth-strategies/social-connections/overview).

Instagram is a professional-profile control proof in the existing web ownership
request, also reachable from the app's **Verificar mi productor en la web** action.
The requested next capability is also account creation and returning sign-in with
Instagram on web, Android and iOS, reusing a confirmed profile as ownership
evidence when it matches the catalog. That login is not implemented or activated
by the current evidence adapter. Clerk custom social connections require OIDC;
the Instagram authorization-code/profile API is not a drop-in Clerk connection.
Any bridge must preserve verified email onboarding, exact immutable Instagram
identity binding, Clerk sessions, account suspension/deletion, MFA, replay-safe
native return and manual ownership review. Do not add a cosmetic login button
before that full flow works. Meta limits this integration to professional
business/creator accounts. See [Account system](ACCOUNT_SYSTEM.md) and
[Operations](OPERATIONS.md#instagram-professional-profile-verification).

```bash
pnpm check:mobile
pnpm test:instagram
pnpm --filter @chisan/mobile exec expo install --check
pnpm --filter @chisan/mobile export
pnpm verify:ai
```

Export validates the Android/iOS JavaScript bundles, not a signed APK/IPA or an
actual OS permission prompt. Before distribution, test Google and Apple creation
and returning access on both devices, cancellation, foreground/session expiry,
suspended/deleted accounts, denied/revoked location, manual selection, offline
retry, catalog revision changes and the complete Instagram claim review. Verify
that no precise device coordinates appear in network requests or logs. Web
previews support visual QA but do not replace those device checks.

## Launch experience and sensory branding

The native startup gate serves as the threshold into Chisan. Its checked-in
layers come from `chisan-intro.html`. A native one-shot animation idles while
the public discovery request and font load settle, then moves the detached
module into the C, reveals the wordmark and fades to the already mounted app.
Reduced-motion settings skip the movement. A recoverable catalog error also
ends the intro so retry remains reachable. The prototype additionally specifies:

- **Mascot and mark synergy:** The detached module from the initial **C** behaves as
  an observant, curious entity while the application initializes.
- **State-machine trigger:** When discovery is ready, the module leaps into the
  upper-right opening of the **C** and the remaining letters appear.
- **Haptic feedback (Taptic Engine):** In the millisecond of impact (`t ≈ 2.65s`),
  trigger a synchronized medium impact (`Haptics.impactAsync(ImpactFeedbackStyle.Medium)`).
  This grounds the digital snap as a tangible physical lock.
- **Acoustic courtesy and identity:** Audio uses the ambient category
  (`AVAudioSessionCategoryAmbient`) so it never plays if the device is on silent/vibrate.
  When unmuted, the mechanical wooden snap of the **C** is complemented by a serene,
  harmonious Spanish nylon-string guitar arpeggio and a soft whisper unfold.
- **Transition to territory:** The prototype dissolves upward into local discovery.
  The current native app fades into the public welcome and producer list.
- **Prototyping reference:** An interactive HTML/CSS/WebAudio prototype is maintained
  in `chisan-intro.html` for motion timing and acoustic reference.

Haptics and audio are prototype directions, not included in the current native
bundle. The first app opens to public welcome and list discovery, not a native
map. Add sound only with a reviewed asset, silent-mode behavior and device QA.
