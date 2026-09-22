# Android and iOS apps

`apps/mobile` is a small Expo / React Native shell around Chisan's responsive
website. The app plays the checked-in `chisan-intro.html` layers as a native
one-shot launch animation, then shows the site's real mobile navigation and
content in a WebView. This includes **Descubrir / Mapa / Mi Cuenta**, the
interactive catalog map, filters, producer profiles, guides and later website
redesigns. The app does not maintain a second producer list, map, account view
or copy of the catalog. The configured site must be reachable for those pages
to load; there is a native retry screen for connection failures.

The website and its published catalog remain authoritative. The app only loads
the configured Chisan origin internally. External sites, email and phone links
open with the operating system. Account, sign-in and registration routes also
open in the system browser: Clerk's web login and social providers run there,
with the same web session and server-side authorization as the website. The
WebView and system browser do not share an assumed account session. Do not put
tokens in URLs, inject account cookies or represent a native account as a web
session. Signed-in account management takes place in the browser until a
reviewed session handoff exists.

## Visitor location

On a first home entry, the app presents the website's location choice as a
focused screen immediately after the intro, with the existing manual country
selection below it. Marketing content and the bottom navigation are hidden for
that step. The presentation adapter in `apps/mobile/src/web-presentation.ts`
uses the existing home classes; keep those hooks working when redesigning the
home. Once the visitor leaves the home, ordinary web navigation is restored.
Choosing the manual path records only the shared onboarding dismissal. A saved
area is still validated and resumed by the website itself. The app does not
request position on launch. On Android the WebView has
`geolocationEnabled`; the app declares foreground coarse/fine permission, while
background location is blocked. On iOS the Expo location configuration declares
the when-in-use purpose. The website's
[visitor location contract](VISITOR_LOCATION_ROUTING.md) still governs the one-shot
request, boundary resolution and storage: only the selected catalog area is
saved in the WebView's site storage, never precise coordinates. Test permission
grant, approximate position, denial and retry on physical devices because a
browser preview does not exercise the operating-system WebView prompt.

## App viewport

Native safe areas own the space for the status and navigation bars. Automatic
WebView content insets are disabled; the app presentation adapter removes the
website's duplicate header and bottom-navigation safe-area padding. The
immersive map receives the measured WebView height after each native layout,
including keyboard opening/closing, and a resize event for its map canvas.
Overscroll bounce is disabled. Keep these rules limited to the app so ordinary
mobile browsers retain their own safe-area handling.

## Local work and builds

```bash
pnpm install --frozen-lockfile
cp apps/mobile/.env.example apps/mobile/.env.local
pnpm mobile:android
# On a Mac with full Xcode installed:
pnpm mobile:ios
pnpm mobile:dev
```

`EXPO_PUBLIC_CHISAN_ORIGIN` defaults to `https://chisan.app`. A local HTTPS
origin or reachable LAN HTTP origin can be used for development; HTTP is refused
in a release build. Build-time origin changes require a new binary. Native
projects under `apps/mobile/android` and `apps/mobile/ios` are generated and
ignored by Git. The app identifier is `app.chisan.mobile` on both platforms.

`eas.json` contains a standalone internal Android APK preview profile. EAS
requires an owner-controlled Expo project and a persistent signing key. A local
signed Gradle build is also supported. Preserve the signing key so a later APK
can update the same installation; do not use the public template debug key.
There is no store submission or listing.

## Activation and verification

The map, discovery, content and their future CSS changes are supplied by the
deployed website. An APK can therefore lag behind unpublished local web work.
Before sharing a preview, check the deployed site and test on a device:

- the intro ends on success and on recoverable load failure;
- **Mapa** opens the current area map, markers and result sheet work, and
  producer profiles remain navigable;
- Android back and iOS swipe navigate through the embedded site;
- location requests occur only after a tap, with a usable manual path when
  permission is denied;
- **Mi Cuenta**, registration, Google sign-in and external links open safely in
  the system browser, with no expectation of a shared WebView session;
- no precise device coordinates enter application URLs, logs or server requests.

The current Instagram professional-profile connection is ownership evidence,
not an Instagram sign-in provider. Instagram account creation and return login
remain separate work; a paused Neon account database can affect private account
flows while public discovery remains available.

```bash
pnpm check:mobile
pnpm --filter @chisan/mobile exec expo install --check
pnpm --filter @chisan/mobile export
pnpm verify:ai
```

Export validates the JavaScript bundles but does not prove WebView navigation,
permission prompts or account behavior on Android and iOS. Use device checks for
those. For material mobile visual changes, record the 390px and wide website
check in `design/qa/design-qa.md`.

## Launch experience

The native startup gate uses the three checked-in image layers from
`chisan-intro.html`. It idles until the website loads or reports a recoverable
error, moves the detached module into the **C**, reveals the wordmark and fades
into the already mounted website. Reduced-motion settings skip the movement.
Haptics and audio remain prototype directions; add them only with reviewed
assets, silent-mode behavior and device QA.
