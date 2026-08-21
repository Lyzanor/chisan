# Candidate Workspace

`docs/candidates/**` is temporary discovery workspace. The app never reads it.
Published producers live in `data/csv/**`; closed decisions and tombstones live
in `data/evidence/**`.

This tree hands work from discovery to admission under `docs/EDITORIAL.md`. It
is not a queue for enriching published rows and does not store ownership claims
or producer profile requests.

## Document ownership

- This file defines the common note format and lifecycle.
- `docs/candidates/<country>/README.md`, when useful, contains only durable,
  reusable discovery methods for that country.
- `docs/candidates/<country>/<area>.md` contains the active queue, concrete
  sources and queries, cutoff date, and unresolved work for one area.
- `data/csv/<country>/AGENTS.md` contains durable country rules and source
  ceilings.
- `data/csv/**` and `data/evidence/**` contain published rows and closed
  decisions respectively.

Never put live counts, completed-area lists, batch results, closure dates,
current service failures, or pending queues in a README. Do not maintain a
manual area index; the file tree already is the index.

## Area notes

Use one file per area: `docs/candidates/<country>/<area>.md`. Add a thematic
file only when a specific search would make the area note unmanageable. Do not
copy data already published in the CSV.

Use English for new headings and editor-authored prose, but do not spend a
standalone cleanup pass translating historical area notes: they are temporary
and should disappear when their candidates are resolved. Preserve official
names, verbatim source text, URLs, and controlled CSV or category tokens in
their canonical form.

The note header records the target CSV, discovery source or query, search date,
scope, cutoff, and remaining work. For each open candidate retain only what the
next reviewer needs:

- published name;
- municipality or geographic clue;
- probable category and concrete reason it may qualify;
- discovery URL, plus an official site or profile when found in the same pass;
- visible material doubts.

Do not fill gaps by intuition or open a full verification search during
discovery. An entry is open by definition and needs no separate status table.

### Incidental findings

After checking for duplicates, place an out-of-scope but plausible producer in
the note for its actual area, marked as incidental. It becomes a later batch and
does not expand or block the current cutoff. If the area is unresolved, retain
it temporarily where it was found with `location unresolved` and the available
clues. Use `reject:other-area` only for a specific area attribution that was
investigated and disproved.

When an already-open source explicitly confirms another useful field for the
same matched producer, update the CSV and evidence in the same change. Do not
branch into adjacent searches merely to fill blanks. Resolve contradictions
because they affect correctness. Update an existing `keep` record in place;
never add a second record for the same `slug`.

## Resolution and deletion

Follow the discovery and admission outcomes in `docs/EDITORIAL.md`. Before
removing an accepted or rejected candidate, ensure its durable source trail or
tombstone exists in `data/evidence/**`. Keep an unresolved candidate with one
specific, actionable blocker.

Update or prune the note with the CSV or evidence change. Delete the area note
when no unresolved candidates remain: accepted rows are in the CSV, rejections
are in evidence, and earlier working versions remain in Git.

Run changed-data checks while editing and `npx pnpm verify:data` before closing
the batch.
