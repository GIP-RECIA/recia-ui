# r-page-layout

- [r-page-layout](#r-page-layout)
  - [Propriétés](#propriétés)
  - [Slots](#slots)
    - [default](#default)
    - [header](#header)

## Propriétés

| Nom          |                Type                | Obligatoire |   Default   | Description                                                  |
| ------------ | :--------------------------------: | :---------: | :---------: | ------------------------------------------------------------ |
| `back-link`  | `[Link](./src/types/linkTypes.ts)` |   `false`   | `undefined` | Lien du bouton retour (utiliser `name` pour l'accessibilité) |
| `page-title` |              `String`              |   `false`   | `undefined` | Titre de la page                                             |

## Slots

### default

Contenu de la page.

### header

Zone d'entête après le nom du service.
