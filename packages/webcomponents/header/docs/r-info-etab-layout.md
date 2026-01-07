# r-info-etab-layout

- [r-info-etab-layout](#r-info-etab-layout)
  - [Propriétés](#propriétés)
  - [Évènements](#évènements)

## Propriétés

| Nom           |                             Type                              | Obligatoire |   Default   | Description                       |
| ------------- | :-----------------------------------------------------------: | :---------: | :---------: | --------------------------------- |
| `image-url`   |                           `string`                            |   `false`   | `undefined` | URL de l'image établissement      |
| `svg-url`     |                           `string`                            |   `false`   | `undefined` | URL du SVG de l'ENT               |
| `etab-name`   |                           `string`                            |   `false`   | `undefined` | Nom de l'établissement            |
| `acad-name`   |                           `string`                            |   `false`   | `undefined` | Nom de l'académie                 |
| `information` | [`Partial<InformationConfig>`](../src/types/etabInfoTypes.ts) |   `false`   | `undefined` | Liste des informations a afficher |

## Évènements

Aucun
