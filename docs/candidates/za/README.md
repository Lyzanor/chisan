# South Africa discovery methods

Apply the [shared candidate workflow](../README.md) and the
[South Africa rules and source ceilings](../../../data/csv/za/AGENTS.md). Keep
area-specific queries, dates, cutoffs and unresolved candidates in the area
note.

## Reusable techniques

- Start with the WOSA member index for a submitted name and website, then use
  the applicable regional wine route for contact details and the producer's own
  site for the productive address.
- A WordPress listing may expose member pages through a sitemap even when its
  archive is rendered in JavaScript. Inspect
  `wp-sitemap-posts-<post-type>-1.xml` and use `wp-json/wp/v2/types` to
  identify the post type.
- On Wilcity listing pages, ignore the shared `defaultMapCenter`. The listing's
  own `:lat-lng` or `listing-ggmap-url` component carries the candidate
  address and point.
- For Stellenbosch discovery, the regional route is published at
  `wineroute.co.za`; route membership still requires productive-unit review.
