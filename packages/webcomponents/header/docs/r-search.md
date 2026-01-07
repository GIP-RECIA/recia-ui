# r-search

- [r-search](#r-search)
  - [Propriétés](#propriétés)
  - [Évènements](#évènements)
    - [`event`](#event)
      - [Retour](#retour)
    - [`search-event`](#search-event)
      - [Retour](#retour-1)

## Propriétés

| Nom          |   Type    | Obligatoire | Default | Description                                                                                         |
| ------------ | :-------: | :---------: | :-----: | --------------------------------------------------------------------------------------------------- |
| `open`       | `boolean` |   `false`   | `false` | La recherche est ouverte                                                                            |
| `no-results` | `boolean` |   `false`   | `false` | Ne pas afficher les résultats de recherche et ne pas nettoyer la recherhe lors de la perte du focus |

## Évènements

### `event`

#### Retour

```ts
detail: {
  open: boolean | undefined
  mask: boolean | undefined
}
```

### `search-event`

Évènement levé dans le document lors du clic sur un lien.

#### Retour

```ts
detail: {
  event: Event
  fname: string
}
```
