# r-dropdown-add

- [r-dropdown-add](#r-dropdown-add)
  - [Propriétés](#propriétés)
  - [Évènements](#évènements)
    - [`item-click`](#item-click)
      - [Retour](#retour)

## Propriétés

| Nom        |                   Type                   | Obligatoire |   Default   | Description                  |
| ---------- | :--------------------------------------: | :---------: | :---------: | ---------------------------- |
| `items`    | [`Widget[]`](../src/types/widgetType.ts) |   `false`   | `undefined` | Liste des widgets à afficher |
| `disabled` |                `boolean`                 |   `false`   |   `false`   | Désactive le dropdown        |

## Évènements

### `item-click`

#### Retour

L'uid du widget séléctionné dans la liste.

```ts
detail: {
  key: string
}
```
