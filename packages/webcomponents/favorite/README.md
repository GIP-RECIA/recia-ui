- [r-favorite-layout](#r-favorite-layout)
  - [Propriétés](#propriétés)
  - [Évènements](#évènements)
    - [`updated`](#updated)
      - [Retour](#retour)
- [r-favorite-bottom-sheet](#r-favorite-bottom-sheet)
  - [Propriétés](#propriétés-1)
  - [Évènements](#évènements-1)
    - [`updated`](#updated-1)
- [r-favorite-dropdown](#r-favorite-dropdown)
  - [Propriétés](#propriétés-2)
  - [Évènements](#évènements-2)
    - [`updated`](#updated-2)

# r-favorite-layout

## Propriétés

| Nom    |                      Type                      | Obligatoire |   Default   | Description        |
| ------ | :--------------------------------------------: | :---------: | :---------: | ------------------ |
| `data` | [`Array<Section>`](./src/types/SectionType.ts) |   `false`   | `undefined` | Liste des sections |

## Évènements

### `updated`

Évènement levé de l'enregistrement des modifications.

#### Retour

```ts
detail: {
  newValue: Array<UpdatedSection> | undefined
}
```

Type [UpdatedSection](./src/types/SectionType.ts)

# r-favorite-bottom-sheet

## Propriétés

| Nom    |                      Type                      | Obligatoire |   Default   | Description        |
| ------ | :--------------------------------------------: | :---------: | :---------: | ------------------ |
| `data` | [`Array<Section>`](./src/types/SectionType.ts) |   `false`   | `undefined` | Liste des sections |

## Évènements

### [`updated`](#updated)

# r-favorite-dropdown

## Propriétés

| Nom    |                      Type                      | Obligatoire |   Default   | Description         |
| ------ | :--------------------------------------------: | :---------: | :---------: | ------------------- |
| `show` |                   `boolean`                    |   `false`   |   `false`   | Affiche le dropdown |
| `data` | [`Array<Section>`](./src/types/SectionType.ts) |   `false`   | `undefined` | Liste des sections  |

## Évènements

### [`updated`](#updated)
