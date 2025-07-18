- [r-dropdown-info](#r-dropdown-info)
  - [Propriétés](#propriétés)

# r-dropdown-info

## Propriétés

| Nom                |                   Type                    | Obligatoire |    Default     | Description                                        |
| ------------------ | :---------------------------------------: | :---------: | :------------: | -------------------------------------------------- |
| `location`         | [`Location`](./src/types/LocationType.ts) |   `false`   | `bottom right` | Emplacement d'ouverture du menu                    |
| `label`            |                 `string`                  |   `false`   |  `undefined`   | Label du tooltip et du bouton pour l'accessibilité |
| `tooltip`          |                 `boolean`                 |   `false`   |    `false`     | Affiche le tooltip                                 |
| `tooltip-location` | [`Location`](./src/types/LocationType.ts) |   `false`   | `bottom right` | Emplacement du tooltip                             |
| `no-padding`       |                 `boolean`                 |   `false`   |    `false`     | Supprime le padding                                |
| `no-mask`          |                 `boolean`                 |   `false`   |    `false`     | Supprime le masque                                 |
