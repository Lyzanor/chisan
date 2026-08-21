# France discovery methods

Apply the [shared candidate workflow](../README.md) and the
[France rules and source ceilings](../../../data/csv/fr/AGENTS.md). Keep each
department's query, review date, cutoff and unresolved candidates in its area
note.

## Agence Bio

The [official directory](https://annuaire.agencebio.org/) and
[open dataset](https://www.data.gouv.fr/datasets/professionnels-engages-en-bio)
can locate certified operations, declared production and activity sites. Match
the operation to a public producer identity and productive unit before
admission.

<a id="sirene-como-fuente-de-descubrimiento"></a>

## SIRENE

The [Annuaire des Entreprises search API](https://recherche-entreprises.api.gouv.fr/)
can search active establishments by department and NAF code. Use it to discover
specific production categories, not to admit legal entities mechanically.

Exclude holding, distribution and non-food activities before review. When a
code also covers cosmetics or other uses, require an explicit food signal.
Record the codes, filters, date and scope in the area note.
