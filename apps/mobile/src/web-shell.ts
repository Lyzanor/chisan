import { SITE_ORIGIN } from "../../../lib/site";

export type WebNavigation = "embedded" | "browser" | "blocked";

const ACCOUNT_PATH = /^\/(cuenta|acceso|registro)(\/|$)/;

export function isAccountUrl(value: string, origin: string): boolean {
  try {
    const url = new URL(value);
    return !url.username && !url.password && url.origin === origin && ACCOUNT_PATH.test(url.pathname);
  } catch { return false; }
}

export function mobileOrigin(value: string | undefined, development: boolean): string {
  const url = new URL(value?.trim() || SITE_ORIGIN);
  if ((url.protocol !== "https:" && !(development && url.protocol === "http:")) ||
      url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("Chisan requires an HTTPS origin (HTTP is allowed only for local development).");
  }
  return url.origin;
}

/** Keep public Chisan navigation in the app. Account flows use the system browser. */
export function webNavigation(value: string, origin: string): WebNavigation {
  let url: URL;
  try { url = new URL(value); } catch { return "blocked"; }

  if (url.username || url.password) return "blocked";
  if (url.origin === origin) return isAccountUrl(value, origin) ? "browser" : "embedded";
  return ["https:", "http:", "mailto:", "tel:"].includes(url.protocol) ? "browser" : "blocked";
}

/** Next.js links can use pushState, which does not invoke WebView navigation callbacks. */
export function accountLinkBridge(origin: string): string {
  return `(() => {
    if (location.origin !== ${JSON.stringify(origin)} || window.__chisanAccountBridge) return;
    window.__chisanAccountBridge = true;
    document.addEventListener('click', function (event) {
      if (event.defaultPrevented || event.button !== 0) return;
      var target = event.target;
      var link = target && target.closest ? target.closest('a[href]') :
        target && target.parentElement ? target.parentElement.closest('a[href]') : null;
      if (!link) return;
      try {
        var url = new URL(link.href, location.href);
        if (url.origin !== ${JSON.stringify(origin)} || !/^\\/(cuenta|acceso|registro)(\\/|$)/.test(url.pathname)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'open-account', url: url.href }));
      } catch (_) {}
    }, true);
  })(); true;`;
}
