import { LOCATION_ONBOARDING_STORAGE_KEY } from "../../../lib/location/location-onboarding";

// Presentation adapter for the real home/map. Location and catalog behavior
// stays in the website; these hooks also work with the currently deployed home.
export const mobilePresentationCss = `
  html[data-chisan-app] { scrollbar-gutter: auto; }
  html[data-chisan-app] body:has(.catalog-page--immersive) {
    height: var(--chisan-app-height, 100dvh);
  }
  /* The native SafeAreaView already excludes the system bars. */
  html[data-chisan-app] .site-header { padding-top: var(--chisan-space-3); }
  html[data-chisan-app] body:has(.catalog-page--immersive) .site-header {
    padding-top: var(--chisan-space-2);
  }
  @media (max-width: 760px) {
    html[data-chisan-app] .site-bottom-nav { height: 56px; padding-bottom: 0; }
    html[data-chisan-app] .catalog-simple-layout.producer-map-explorer,
    html[data-chisan-app] .producer-map-explorer > * { --catalog-sheet-peek: 100px; }
    html[data-chisan-app] .producer-map-explorer .catalog-results-sheet > .catalog-viewer-body {
      padding-bottom: calc(56px + var(--chisan-space-4));
    }
  }
  html[data-chisan-entry] .site-header { position: static; border: 0; }
  html[data-chisan-entry] .site-account-nav,
  html[data-chisan-entry] .site-footer,
  html[data-chisan-entry] .site-bottom-nav,
  html[data-chisan-entry] .catalog-start-page--home > :not(.catalog-start-shell),
  html[data-chisan-entry] .catalog-start-shell > :not(.home-catalog),
  html[data-chisan-entry] .home-catalog > .catalog-start-head,
  html[data-chisan-entry] .home-catalog__orbit { display: none; }
  html[data-chisan-entry] .catalog-start-page--home {
    width: min(32rem, calc(100% - 3rem)); margin: 0 auto; padding: 0 0 2rem;
  }
  html[data-chisan-entry] .catalog-start-shell {
    display: block; padding: 1.5rem 0; margin: 0;
  }
  html[data-chisan-entry] .home-catalog {
    display: block; padding: 0; border: 0; background: transparent; box-shadow: none;
  }
  html[data-chisan-entry] .location-onboarding { margin: 0; padding: 0; border: 0; }
  html[data-chisan-entry] .location-onboarding__copy h2 {
    color: var(--chisan-color-ink); font-size: clamp(2rem, 8vw, 2.75rem); line-height: 1.15;
  }
  html[data-chisan-entry] .location-onboarding__copy p {
    color: var(--chisan-color-stone); font-size: 1rem; line-height: 1.6;
  }
  html[data-chisan-entry] .location-onboarding__primary { width: 100%; min-height: 52px; justify-content: center; }
  html[data-chisan-entry] .country-card-list { margin-top: 1rem; }
  html[data-chisan-entry] .country-card { min-height: 72px; }
  .chisan-app-manual-label { margin: 1.5rem 0 0; color: var(--chisan-color-stone); font-size: 1rem; }
  html:not([data-chisan-entry]) .chisan-app-manual-label { display: none; }
`;

/** One app-entry decision per document, never an automatic permission request. */
export function mobilePresentationBridge(origin: string): string {
  return `(() => {
    if (location.origin !== ${JSON.stringify(origin)} || window.__chisanPresentation) return;
    window.__chisanPresentation = true;
    var root = document.documentElement;
    root.dataset.chisanApp = '';
    var style = document.createElement('style');
    style.textContent = ${JSON.stringify(mobilePresentationCss)};
    document.head.appendChild(style);
    var stored = null;
    try { stored = JSON.parse(localStorage.getItem(${JSON.stringify(LOCATION_ONBOARDING_STORAGE_KEY)})); } catch (_) {}
    // The website validates and resumes saved areas itself. If that key is
    // stale it still renders the location choice, which keeps this entry usable.
    if (location.pathname !== '/' || (stored && stored.onboarding === 'dismissed' && stored.area === null)) return;
    root.dataset.chisanEntry = 'location';
    var observer = new MutationObserver(function () {
      if (location.pathname !== '/') {
        delete root.dataset.chisanEntry;
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    var choices = document.querySelector('.country-card-list');
    if (choices) {
      var label = document.createElement('p');
      label.className = 'chisan-app-manual-label';
      label.textContent = document.documentElement.lang.startsWith('es') ? 'O elige tu zona manualmente' : 'Or choose your area manually';
      choices.before(label);
      choices.addEventListener('click', function (event) {
        if (!event.target.closest('a[href]')) return;
        try { localStorage.setItem(${JSON.stringify(LOCATION_ONBOARDING_STORAGE_KEY)}, JSON.stringify({ onboarding: 'dismissed', area: null })); } catch (_) {}
      });
    }
  })(); true;`;
}

/** Native safe areas and keyboard determine the WebView's usable viewport. */
export function mobileViewportBridge(height: number): string {
  if (!Number.isFinite(height) || height <= 0) return "true;";
  return `document.documentElement.style.setProperty('--chisan-app-height', '${Math.round(height)}px'); window.dispatchEvent(new Event('resize')); true;`;
}
