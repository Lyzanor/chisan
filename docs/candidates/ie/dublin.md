# Dublin — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/leinster/dublin.csv`. Nothing recorded here is verified or
approved for publication. Resolve each lead under the normal CSV and evidence
workflow and prune it from this file.

## Teeling Whiskey — municipality and address unresolved (2026-08-11)

Source: <http://www.teelingwhiskey.com/>, read 2026-08-11. The producer's own site
establishes identity, the products and that the distillery is in Dublin, and it
sells online. It publishes no street address, phone or email on the pages read,
so the productive `municipio` inside County Dublin is not yet pinned.

To resolve: read the distillery's own visit or contact page for the address.
Note `dublin` is dropped from the built centroid catalog as ambiguous and is
supplied instead by `municipality-overrides.json`.

## Irish craft beer directory sweep (2026-08-11)

Source: <https://irishcraftbeer.ie/breweries/>, read 2026-08-11. The directory
publishes a brewery name, a county, sometimes a town, and a URL, and flags some
entries as closed. It establishes none of those as current, does not give the
productive town for most entries, and its county attribution is unreliable — it
lists Big Hand Brewery under Dublin behind a Welsh domain. Every entry below is
therefore a `hold` lead: confirm identity, qualifying activity, productive
municipality, a public contact and the remote-order status on the producer's own
current source before admission.

| Lead | Location as listed | Listed domain |
|---|---|---|
| Four Provinces Brewery Co. | Dublin | fourprovinces.ie |
| Hope Beer | Dublin | hopebeer.ie |
| LINEMAN | — | lineman.ie |
| Porterhouse Brew Co. | Glasnevin | porterhousebrewco.ie |
| Priory Brewing | — | priorybrewing.ie |
| Rascals Brewing Co | Rathcoole | rascalsbrewing.com |
| Stone Barrel Brewing Co | — | stonebarrelbrewing.ie |
| Third Barrel Brewing | — | thirdbarrel.com |
| Whiplash Beer | — | whiplashbeer.com |

## Remaining search work

- The official establishment registers (DAFM approved establishments, FSAI
  approved food premises) have not been scoped for this county. They are the
  exhaustive-registry lane and nothing here substitutes for them.
- No category outside the ones named above has been swept for this county.
