- [r-filters](#r-filters)
  - [Propriétés](#propriétés)
  - [Évènements](#évènements)
    - [`update-filters`](#update-filters)
      - [Retour](#retour)

# r-filters

## Propriétés

| Nom    |                 Type                  | Obligatoire | Default | Description       |
| ------ | :-----------------------------------: | :---------: | :-----: | ----------------- |
| `data` | [`Array`](./src/types/SectionType.ts) |   `false`   | `null`  | Liste des filtres |

## Évènements

### `update-filters`

Évènement levé lors de la sélection  d'un filtre.

#### Retour

```ts
detail: {
  activeFilters: {
    id: string
    checked: Array<string>
  }
}
```
