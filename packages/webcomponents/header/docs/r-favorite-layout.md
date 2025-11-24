- [r-widget](#r-widget)
  - [Propriétés](#propriétés)
  - [Évènements](#évènements)
    - [`updated`](#updated)
      - [Retour](#retour)
    - [`favorite-event`](#favorite-event)
      - [Retour](#retour-1)

# r-widget

## Propriétés

| Nom                     |                         Type                         | Obligatoire |   Default   | Description                                                  |
| ----------------------- | :--------------------------------------------------: | :---------: | :---------: | ------------------------------------------------------------ |
| `data`                  | [`FavoriteSection[]`](../src/types/favoriteTypes.ts) |   `false`   | `undefined` | Liste des sections favorites à afficher                      |
| `loading`               |                      `boolean`                       |   `false`   |   `false`   | Affiche l'overlay de chargement                              |
| `loding-sections`       |                       `number`                       |   `false`   |      1      | Nombre de séction à afficher pour le chargement              |
| `loding-sections-items` |                       `number`                       |   `false`   |      4      | Nombre d'éléments à afficher dans les sections au chargement |

## Évènements

### `updated`

Évènement levé lors de l'enregistrement de la liste des favoris (après opération "gérer").

#### Retour

```ts
detail: {
  newValue: UpdatedFavoriteSection[] | undefined
}
```

### `favorite-event`

Évènement levé dans le document lors du clic sur un favori.

#### Retour

```ts
detail: {
  event: Event
  fname: string
}
```
