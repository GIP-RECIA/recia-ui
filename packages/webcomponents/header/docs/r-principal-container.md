- [r-principal-container](#r-principal-container)
  - [Propriétés](#propriétés)
  - [Évènements](#évènements)
    - [`user-menu-event`](#user-menu-event)
    - [`search-event`](#search-event)

# r-principal-container

## Propriétés

| Nom                         |   Type    | Obligatoire |   Default   | Description                          |
| --------------------------- | :-------: | :---------: | :---------: | ------------------------------------ |
| `navigation-drawer-visible` | `boolean` |   `false`   |   `false`   | Le tiroire de navigation est visible |
| `searching`                 | `boolean` |   `false`   |   `false`   | Une recherche est en cours           |
| `name`                      | `string`  |   `false`   | `undefined` | Nom de l'ENT                         |
| `search-open`               | `boolean` |   `false`   |   `false`   | La recherche est ouverte             |
| `services-open`             | `boolean` |   `false`   |   `false`   | La liste des services est ouverte    |

## Évènements

### `user-menu-event`

Transmission des évènements du [r-user-menu](r-user-menu.md).

### `search-event`

Transmission des évènements du [r-search](r-search.md).
