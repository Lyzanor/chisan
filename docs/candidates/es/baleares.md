# Candidatos de Baleares

Notas de trabajo sin contrastar del todo. No es una cola de revisión ni un
registro de estado: cada entrada se verifica por web antes de tocar el CSV y se
borra de aquí en el mismo cambio en que se resuelve.

La pasada de verificación en curso (`docs/verificacion/es/baleares.md`) **no añade
altas**: su objetivo es cerrar las filas heredadas. Lo que aparece aquí sale de
lo que la pasada encuentra de paso.

## Gossalba (Sant Joan)

Possessió del término de Sant Joan, en el Pla de Mallorca, dedicada al aceite de
oliva virgen extra con D.O. Oli de Mallorca. Unos 2.000 olivos, ~30 t de aceituna
al año y unos 5.000 litros. La misma familia comercializa también la marca
**Indesinenter**. Web propia `gossalba.com`, con tienda.

Apareció al purgar `oli-de-sant-joan-sant-joan`, una fila del volcado sintético
cuyo nombre no corresponde a ningún productor real: Gossalba es el único
elaborador de aceite de Sant Joan que aparece en las fuentes. **No se dio de alta
en el mismo cambio para no sustituir una identidad por otra**; entra como alta
nueva cuando se verifique por su cuenta.

Ojo: su agroturismo está cerrado durante 2026 por obras, lo que no afecta a la
actividad oleícola pero sí a lo que se pueda leer en su web.

## Procam (elaborador de la marca Can Pere Joan)

Elaborador certificado de la I.G.P. Sobrasada de Mallorca. Es quien fabrica la
sobrasada que Mercadona vende bajo la marca **Can Pere Joan**, la fila que se
purgó en BAL-07 por describir una unidad productiva inexistente en Inca. Falta
localizar su municipio y su web propia antes de plantear el alta.

## Bon Gust (Algaida)

Elaborador certificado de la I.G.P. Sobrasada de Mallorca y, según el registro,
**el único de Algaida**. Apareció al purgar `sobrasada-de-mallorca-ferrer-algaida`,
una fila inventada cuyo nombre no corresponde a ninguna empresa.

## Otros elaboradores de la I.G.P. sin fila en el CSV

Del registro de quince elaboradores certificados
(`sobrasadademallorca.org`), no están en el CSV: Bon Gust, Procam,
Aplicacions Tècniques Insulars, Tucarn, Ca Na Paulina, Ramaders Agrupats,
Hipercentro y Embotits Montuiri. Varios son industria o distribución más que
productor de marca propia: verificar uno a uno antes de dar de alta ninguno.
