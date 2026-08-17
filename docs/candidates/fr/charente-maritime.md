# Candidatos — Charente-Maritime

Investigación del 2026-08-08, revisada por completo el 2026-08-13. Los siete operadores que permanecen en esta tabla aparecen como `Ferme`, con actividad activa de `Production`, producciones declaradas y certificación `ENGAGEE` en el [directorio oficial de Agence Bio](https://annuaire.agencebio.org/); sus datos proceden de organismos certificadores y se actualizan durante los controles, según la [ficha oficial del conjunto de datos](https://www.data.gouv.fr/datasets/professionnels-engages-en-bio). Se mantienen como señales abiertas porque la revisión no encontró todavía una marca y oferta alimentaria pública concreta atribuible a la unidad: el registro confirma actividad agraria, pero no basta por sí solo para publicar. El resto del corte se resolvió el 2026-08-13 con nueve altas en el CSV: Domaine du Geay, Le Potager des Prises, Légumes Garden, ESAT de Loulay, Favre et Fils, Jonathan Girardon, La Ferme de Liberneuil, Victoria's Juices y La Saline aux 4 Vents.

| Nombre público declarado | Razón social | Commune provisional | Dirección local | Tipo de ubicación | Producciones declaradas (muestra) | Último control | Fuente |
|---|---|---|---|---|---|---|---|
| AU COIN DES PLANTES CASTELLETTA Eric | CASTELLETTA ERIC | BREUIL-LA-REORTE | 76 RUE DU SAFRAN 17700 | actividad | Zone de cueillette de plantes à parfum aromatiques et médicinales sauvages, Hysope, Autres fruits à pépins | 2026 | [nº Bio 39531](https://annuaire.agencebio.org/operateur/39531) |
| BEAULIEU CHENU Francine | EARL BEAULIEU | Taillebourg | Beaulieu 17350 | actividad | Autres fruits à pépins, Prairie permanente, Culture inconnue | 2026 | [nº Bio 170517](https://annuaire.agencebio.org/operateur/170517) |
| CHAMPVALLON TARDY Christophe | SAS CHAMPVALLON | Saint Martial de Mirambeau | 4 la Bertonnière 17150 | actividad | Prairie permanente, Raisin de cuve, Jachère, gel entrant en rotation (yc bandes tampon et surfaces non exploitées temporairement) | 2026 | [nº Bio 19944](https://annuaire.agencebio.org/operateur/19944) |
| DE MONDEVIS | GIRAUD BERTRAND | La Villedieu | 29 chemin de la procession 17470 | actividad | Jachère, gel entrant en rotation (yc bandes tampon et surfaces non exploitées temporairement), Mélanges Céréales-légumineuses, Lentilles, sèches | 2026 | [nº Bio 142978](https://annuaire.agencebio.org/operateur/142978) |
| DEUS EX ORGANIC COLLET Thomas | DEUS EX ORGANIC | Saint Denis d'Oleron | Ferme de la Motte Chalon 17650 | actividad | Mélanges Céréales-légumineuses, Vaches allaitantes, Prairie permanente | 2026 | [nº Bio 142250](https://annuaire.agencebio.org/operateur/142250) |
| GAEC DES ILES D AGERES | LES ILES D'AGERES | BALLON | 27 RUE DU MARAIS 17290 | actividad | Betterave fourragère, Prairie temporaire, Mélanges Céréaliers (sans légumineuses) | 2026 | [nº Bio 152731](https://annuaire.agencebio.org/operateur/152731) |
| LA FANTAISIE GAUTHIER FRANCOIS | EARL LA FANTAISIE | Beauvais sur Matha | Bourcelaine 17490 | actividad | Tournesol, Lin (graines), Parcours herbeux (hors estives collectives) | 2026 | [nº Bio 9043](https://annuaire.agencebio.org/operateur/9043) |

## Barrido SIRENE de categorías infrarrepresentadas (2026-08-10)

Pasada por región descrita en [guía nacional](README.md#sirene-como-fuente-de-descubrimiento), revisada por completo el 2026-08-13. Victoria's Juices y La Saline aux 4 Vents se publicaron tras confirmar su oferta y actividad actuales. Chamboule Tout permanece como señal: la empresa sigue activa con código de preparación de zumos, pero no apareció una presencia pública reciente que permita verificar una oferta concreta bajo esa marca.

| Nombre declarado | Razón social | Commune | Dirección | Categoría propuesta | Actividad declarada (NAF) | Alta | Fuentes |
|---|---|---|---|---|---|---|---|
| CHAMBOULE TOUT | VERONIQUE CHELLIT | La Rochelle | 20 RUE GILL 17000 LA ROCHELLE | Bebidas sin alcohol | 10.32Z — Préparation de jus de fruits et légumes | 2013-02 | [SIREN 791153166](https://annuaire-entreprises.data.gouv.fr/entreprise/791153166) |

## Productores de queso — barrido nacional del 2026-08-12

Revisión zona por zona con corte 2026-08-12. Se cruzaron tres fuentes nacionales: [Bienvenue à la ferme](https://www.bienvenue-a-la-ferme.com/fr/recherche?categories[]=products&product_categories[]=cremerie&q=fromage), red de las Cámaras de Agricultura, filtrada a perfiles de `Producteur` clasificados en `Fromages et crèmerie` cuya ficha contiene `fromage`; la [sección IX láctea de la DGAL](https://agriculture.gouv.fr/liste-des-etablissements-agrees-ce-conformement-au-reglement-ce-ndeg8532004-lists-ue-approved), cruzada por SIRET con empresas activas cuya actividad principal en [SIRENE](https://recherche-entreprises.api.gouv.fr/docs/) es `10.51C — Fabrication de fromage`; y el [directorio oficial de Agence Bio](https://annuaire.agencebio.org/), limitado a perfiles activos de `Ferme`, certificado `ENGAGEE` y producción controlada `Fromages`. Se excluyeron mercados y tiendas colectivas, y se deduplicó contra el CSV y los candidatos ya documentados en este département.

El corte quesero se cerró el 2026-08-12. Las dos unidades manufactureras y las ocho explotaciones bio se publicaron tras confirmar identidad, elaboración propia y punto productivo. Tonton Fromage queda en `parcial`: la empresa adquirió en noviembre de 2025 el fondo activo de la Fromagerie de Mortafond y figura como fabricante, pero todavía no tiene una presencia pública que permita precisar gama o contacto. Las otras nueve altas quedaron verificadas; Le Petit Taugonnais, Les Brebis de Saintonge y La Ferme du Roc tienen pedido por marketplace, y La Ferme de Candé dispone de tienda propia. No quedan señales queseras abiertas de este corte.

## Barrido de productores de cerveza (2026-08-13)

Búsqueda de cervecerías artesanales e independientes con planta de elaboración propia en el departamento de Charente-Maritime. Las fuentes consultadas confirman la actividad productiva e instalaciones propias; quedan registradas como candidaturas en espera para la verificación completa de coordenadas, contacto y canales de venta directa antes de su publicación en el catálogo.

| Candidato | Señal / Actividad | Municipio | Contacto / Web / Instagram |
|---|---|---|---|
