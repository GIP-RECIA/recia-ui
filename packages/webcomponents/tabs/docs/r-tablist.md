# r-tablist

- [r-tablist](#r-tablist)
  - [Propriétés](#propriétés)
  - [Évènements](#évènements)
    - [`set-active-tab`](#set-active-tab)
      - [Retour](#retour)

## Propriétés

| Nom               |    Type    | Obligatoire |   Default   | Description                                                             |
| ----------------- | :--------: | :---------: | :---------: | ----------------------------------------------------------------------- |
| `id-prefix`       |  `string`  |   `false`   | `undefined` | Préfixe pour l'id des boutons                                           |
| `tabs`            | `string[]` |   `false`   |    `[]`     | Liste des onglets (titres)                                              |
| `active-tab`      |  `number`  |   `false`   |     `0`     | Index de l'onglet actif                                                 |
| `switch-tabpanel` | `boolean`  |   `false`   |   `false`   | Switch du tabpanel (si `r-tabpanel` est au même niveau que `r-tablist`) |

## Évènements

### `set-active-tab`

Évènement levé lors du changement d'onglet.

#### Retour

```ts
detail: {
  idPrefix: string
  activeTab: number
  oldActiveTab: number
}
```
