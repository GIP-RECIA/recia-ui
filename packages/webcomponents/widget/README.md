- [r-widget](#r-widget)
  - [Propriétés](#propriétés)
  - [Évènements](#évènements)
    - [`delete`](#delete)
      - [Retour](#retour)
    - [`move`](#move)
      - [Retour](#retour-1)
    - [`click-on-item`](#click-on-item)
      - [Retour](#retour-2)
    - [`click-on-heading-link`](#click-on-heading-link)
      - [Retour](#retour-3)

# r-widget

## Propriétés

| Nom              |                Type                 | Obligatoire |   Default   | Description                                                                   |
| ---------------- | :---------------------------------: | :---------: | :---------: | ----------------------------------------------------------------------------- |
| `uid`            |              `string`               |   `false`   | `undefined` | Identifiant unique                                                            |
| `name`           |              `string`               |   `false`   | `undefined` | Titre                                                                         |
| `subtitle`       |              `string`               |   `false`   | `undefined` | Sous titre                                                                    |
| `notifications`  |              `number`               |   `false`   | `undefined` | Nombre de notifications                                                       |
| `link`           |  [`Link`](./src/types/LinkType.ts)  |   `false`   | `undefined` | Lien d’entête                                                                 |
| `items`          | [`Item[]`](./src/types/ItemType.ts) |   `false`   | `undefined` | Liste des éléments à afficher                                                 |
| `empty-icon`     |              `string`               |   `false`   | `undefined` | SVG lors ce qu'il n'y a pas d'éléments à afficher                             |
| `empty-text`     |              `string`               |   `false`   | `undefined` | Texte lors ce qu'il n'y a pas d'éléments à afficher                           |
| `empty-discover` |              `boolean`              |   `false`   |   `false`   | Affiche un lien vers le service lors ce qu'il n'y a pas d'éléments à afficher |
| `manage`         |              `boolean`              |   `false`   |   `false`   | Affiche l'overlay de gestion                                                  |
| `deletable`      |              `boolean`              |   `false`   |   `false`   | Affiche le bouton de suppression sur l'overlay de gestion                     |
| `noPrevious`     |              `boolean`              |   `false`   |   `false`   | Retire le bouton de déplacement vers la gauche sur l'overlay de gestion       |
| `noNext`         |              `boolean`              |   `false`   |   `false`   | Retire le bouton de déplacement vers la droite sur l'overlay de gestion       |
| `loading`        |              `boolean`              |   `false`   |   `false`   | Affiche l'overlay de chargement                                               |
| `isError`        |              `boolean`              |   `false`   | `undefined` | Affiche le rendu d'erreur                                                     |
| `errorMessage`   |              `string`               |   `false`   | `undefined` | Texte du rendu d'erreur                                                       |

## Évènements

### `delete`

#### Retour

```ts
detail: {
  uid: string
}
```

### `move`

#### Retour

```ts
detail: {
  uid: string
  newPosition: '-1' | '+1'
}
```

### `click-on-item`

#### Retour

```ts
detail: {
  uid: string
  id: string
}
```

### `click-on-heading-link`

#### Retour

```ts
detail: {
  uid: string
}
```
