# QR Profiles and Producer Selections

Status: product plan; implementation deferred. Decision date: 2026-09-03.

`docs/ACCOUNT_SYSTEM.md` and `design/README.md` describe the shipped behavior.
This plan guides the next iteration; it does not change routes, account state
or entitlements. Related producer content is implemented independently under
`docs/PRODUCER_CONTENT.md`.

## Product intent

A producer QR opens one canonical producer profile. A selection QR opens the
producers explicitly selected by one account. Both use existing stable public
URLs, so printed labels remain useful after an internal implementation change.
A restaurant, shop or private person uses the same selection capability; its
name and explanatory text provide context without inventing a venue category.

A selection means “chosen by this account”. It does not prove a supply
relationship, stock, sale, endorsement or producer verification. Favorites stay
private unless the owner explicitly shares each producer. Publishing a profile
never publishes all favorites automatically.

## Next delivery

Make the current single public selection at `/u/<public_handle>` clearer:

- Keep profile visibility, account entitlement, QR opt-in and per-favorite
  sharing decisions intact.
- Offer a preview and require at least one selected producer before the first
  QR download.
- Show the whole explicit selection on the map, with a stable accompanying list.
  Keep producers without coordinates in that list.
- Remove proximity ranking from this selection view; ordinary area discovery
  continues to support proximity.
- Use “Selection QR” in public copy, with optional owner title/description and
  neutral fallbacks. Do not imply a reviewed restaurant/shop classification.
- Preserve the shared map behavior, language support, keyboard access, readable
  print layout and a scan destination without tracking parameters.

Acceptance is an end-to-end journey: choose shared producers, preview, activate,
download, scan, open their profiles and revoke sharing. Private/disabled states
must remain private. Existing printed URLs must keep their documented behavior.
Update the owning contracts and test this journey when implementing the phase.

## Options after that

Evaluate ordering, short attributed notes, category sections and additional
print layouts from real use. Several selections per account may later justify
a separate selection identity and route while preserving the existing handle.
Menu entries or dish-to-producer relationships need their own meaning and
freshness rules; producer content alone does not imply live menus or inventory.

Decide future routes, billing, analytics and moderation when those capabilities
are actually selected for implementation. They are not requirements for the
next delivery.
