"use client";

import { CaretDownIcon, UserCheckIcon, UserPlusIcon } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { useProducerFollows } from "./producer-follows-context";
import { ACCOUNT_ROUTES } from "@/lib/accounts/config";
import type { Locale } from "@/lib/i18n/locales";

export function ProducerFollowToggle({ country, producerId, name, returnTo, locale = "es", compact = false, dropdown = false }: {
  country: string; producerId: number; name: string; returnTo: string; locale?: Locale; compact?: boolean; dropdown?: boolean;
}) {
  const follows = useProducerFollows();
  const [error, setError] = useState(false);
  const menu = useRef<HTMLDetailsElement>(null);
  const key = `${country}:${producerId}`;
  const following = follows.keys.includes(key);
  const words = locale === "es" ? { follow: "Seguir", following: "Siguiendo", remove: "Dejar de seguir", error: "No se ha podido guardar. Vuelve a intentarlo.", unavailable: "No se ha podido cargar el seguimiento. Recarga para intentarlo de nuevo." }
    : locale === "ca" ? { follow: "Seguir", following: "Seguint", remove: "Deixar de seguir", error: "No s'ha pogut desar. Torna-ho a provar.", unavailable: "No s'ha pogut carregar el seguiment. Recarrega per tornar-ho a provar." }
    : { follow: "Follow", following: "Following", remove: "Unfollow", error: "Could not save. Please try again.", unavailable: "Could not load follows. Reload to try again." };
  const label = `${following ? words.remove : words.follow} · ${name}`;
  const unavailable = follows.status === "unavailable";
  const registrationHref = (path: string) => `${ACCOUNT_ROUTES.signUp}?redirect_url=${encodeURIComponent(path)}`;
  const content = <>{following ? <UserCheckIcon size={20} aria-hidden="true" /> : <UserPlusIcon size={20} aria-hidden="true" />}{!compact && <span>{following ? words.following : words.follow}</span>}</>;

  const control = <>
    {follows.status === "guest" ? <a className="producer-follow-button" href={registrationHref(returnTo)} aria-label={label} title={label}
      onClick={(event) => {
        event.currentTarget.href = registrationHref(`${window.location.pathname}${window.location.search}${window.location.hash}`);
      }}>
      {content}
    </a> : <button type="button" className="producer-follow-button" aria-label={label} title={unavailable ? words.unavailable : label} aria-pressed={following}
      disabled={follows.status === "loading" || unavailable || follows.pending.has(key)} aria-busy={follows.pending.has(key)}
      onClick={async () => {
        setError(false);
        const result = await follows.setFollowing(country, producerId, !following);
        if (result === "guest") window.location.assign(registrationHref(`${window.location.pathname}${window.location.search}${window.location.hash}`));
        else {
          setError(result === "error");
          if (result !== "error" && menu.current) menu.current.open = false;
        }
      }}>{content}</button>}
    {error ? <span className="producer-follow-error" role="alert">{words.error}</span> : null}
    {unavailable ? <span className="visually-hidden" role="status">{words.unavailable}</span> : null}
  </>;

  if (dropdown) return <details ref={menu} className="producer-follow-menu">
    <summary className={`catalog-chip catalog-chip--select${following ? " is-active" : ""}`}>
      {content}
      <CaretDownIcon size={14} aria-hidden="true" />
    </summary>
    <div className="producer-follow-menu__panel">{control}</div>
  </details>;

  return <span className={`producer-follow-control${compact ? " producer-follow-control--compact" : ""}`}>{control}</span>;
}
