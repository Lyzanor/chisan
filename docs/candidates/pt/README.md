# Portugal — pasada de categorías infrarrepresentadas (2026-08-10)

Portugal publica 449 filas de `Vino` sobre 530: el hueco del catálogo portugués
no es geográfico, es de categoría. `Aceite`, `Pan y cereal`, `Frutos secos`,
`Legumbres y cereales`, `Café` y `Setas` estaban a cero pese a ser producciones
centrales del país, y `Conservas` (3), `Carne` (9) o `Miel` (3) no llegaban a
representar sectores enteros.

Esta pasada busca candidatos **no vinícolas** en las siete regiones, en
categorías que encajan con lo que Portugal produce de verdad: conservas de
pescado en Matosinhos, Olhão y Figueira; fumeiro en Trás-os-Montes; azeite en
Alentejo, Ribatejo y Trás-os-Montes; queso DOP en Nisa, Serpa, Cuba y las
Azores; doçaria conventual en Aveiro, Coimbra, Lamego y Madeira; flor de sal y
frutos secos en el Algarve; chá, licores y lácteos en las Azores; mel-de-cana y
rum agrícola en Madeira.

## Qué es y qué no es esta lista

Cada entrada trae nombre, concelho declarado y la fuente donde apareció.
**Ninguna está verificada.** Un registro sectorial acredita existencia,
pertenencia o certificación; no acredita actividad vigente, oferta propia ni que
la dirección publicada sea la unidad productiva. Antes de publicar cualquier
fila hay que confirmar marca pública, producto concreto y concelho de la unidad
productiva, y deduplicar contra el CSV del área.

Los nombres ya presentes en `data/csv/pt/**` se excluyeron al compilar la lista.

## Fuentes usadas

- **PTPT** — [directorio de productores de Produtos Tradicionais Portugueses](https://www.ptpt.pt/produtores)
  (DGADR, 493 fichas con dirección y contacto).
- **ANICP** — [asociados de la Associação Nacional dos Industriais de Conservas de Peixe](https://anicp.pt/associados/).
- **Casa do Azeite** — [asociados](https://casadoazeite.pt/pt/associados).
- **JN-Azeite** — [guía de productores de azeite del Jornal de Negócios](https://www.jornaldenegocios.pt/mais/conferencias/azeite/detalhe/azeite___guia_de_produtores).
- **Marca Açores** — [directorio de promotores certificados](https://www.marcaacores.pt/promotores)
  (301 fichas con dirección, filtrables por categoría e isla).
- **CM-Nisa** — [productores de Queijo de Nisa](https://www.cm-nisa.pt/index.php/marca-enisa/aderentes/produtores-de-queijo).
- **Montalegre** — [productores de la Associação de Produtores de Fumeiro da Terra Fria Barrosã](https://fumeirodemontalegre.pt/2026/produtores-outros).
- **Alijó** — [productores de azeite de D'Olival ao Azeite D'Ouro](https://dolivalaoazeitedouro.cm-alijo.pt/produtores/).
- **Al-Bio** — [productores de la Associação Agroecológica do Algarve](https://al-bio.pt/produtores/).
- **AEAlgarve** — [empresas agroalimentares de las áreas empresariales del Algarve](https://aealgarve.pt/empresas).
- **PortalNacional** — [empresas alimentares de Madeira por actividad](http://portalnacional.com.pt/madeira/empresas/alimentacao/).
- **CAP2019** — [listado de marcas de cerveja artesanal portuguesa](https://cervejaartesanalportuguesa.pt/cervejas/).
  Es de 2019: sirve para descubrir, **no** para afirmar actividad. Muchas marcas
  eran proyectos *gypsy* sin instalación propia. Comprobar una a una.

## Cobertura por región

419 entradas en total: 389 candidatos a productor y 30 agrupamientos gestores o
asociaciones sectoriales, marcados con `—` en la columna de categoría. Estos
últimos **no** son altas: son la vía documentada hacia los productores concretos
de un DOP/IGP cuando el registro no los publica uno a uno.

| región | entradas | ficheros |
|---|---|---|
| Norte | 98 | `braga`, `braganca`, `porto`, `viana-do-castelo`, `vila-real` |
| Centro | 94 | `aveiro`, `castelo-branco`, `coimbra`, `guarda`, `leiria`, `viseu` |
| Lisboa e Vale do Tejo | 45 | `lisboa`, `santarem`, `setubal` |
| Alentejo | 53 | `beja`, `evora`, `portalegre` |
| Algarve | 36 | `faro` |
| Açores | 56 | `acores` |
| Madeira | 37 | `madeira` |

## Trampas detectadas al compilar

- **El azeite alentejano y duriense sale casi siempre de bodegas ya publicadas.**
  Casa Relvas, Esporão, J. Portugal Ramos, Quinta do Crasto, Quinta do Noval o
  Ventozelo venden azeite propio: ahí el cambio es `categorias adicionales`, no
  una fila nueva. Está anotado fila a fila en `evora.md` y `vila-real.md`.
- **El lagar y la bodega pueden estar en distritos distintos.** El lagar de
  Esporão está en Serpa (Beja) y la adega en Reguengos (Évora).
- **La marca miente sobre el concelho.** `Fumeiro Artesanal de Seia` produce en
  Oliveira do Hospital (Coimbra) y `Queijaria do Pico` en Praia da Vitória
  (Terceira).
- **PTPT mezcla productores con puntos de venta.** El directorio incluye
  restaurantes y pastelerías que solo revenden el producto tradicional, y en
  Boticas y Ul lista particulares con domicilio privado: no son candidatos.
- **El listado de cerveza artesanal es de 2019** y muchas marcas eran proyectos
  *gypsy*. Ninguna entrada `CAP2019` vale sin comprobar instalación y actividad.
- **Madeira no tiene directorio de productores.** El registro empresarial que
  hubo que usar incluye importadores y sociedades sin actividad productiva; el
  IVBAM, que sí publica la lista oficial de rum y poncha, no fue accesible.
