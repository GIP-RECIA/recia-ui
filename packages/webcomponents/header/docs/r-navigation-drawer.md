# r-navigation-drawer

- [r-navigation-drawer](#r-navigation-drawer)
  - [Propriétés](#propriétés)
  - [Évènements](#évènements)
    - [`toggle`](#toggle)
      - [Retour](#retour)
    - [`toggle-services-layout`](#toggle-services-layout)
      - [Retour](#retour-1)
    - [`toggle-favorite-dropdown`](#toggle-favorite-dropdown)
      - [Retour](#retour-2)
    - [`launch`](#launch)
      - [Retour](#retour-3)

## Propriétés

| Nom                     |   Type    | Obligatoire |   Default   | Description                       |
| ----------------------- | :-------: | :---------: | :---------: | --------------------------------- |
| `name`                  | `string`  |   `false`   | `undefined` | Nom de l'ENT                      |
| `visible`               | `boolean` |   `false`   |   `false`   | Affiche le tiroir de navigation   |
| `expanded`              | `boolean` |   `false`   |   `false`   | Déplie le tiroir de navigation    |
| `services-layout-state` | `boolean` |   `false`   |   `false`   | La liste des services est affiché |

## Évènements

### `toggle`

Évènement levé lors du clic sur le bouton menu.

#### Retour

```ts
detail: {
  isExpanded: boolean
}
```

### `toggle-services-layout`

Évènement levé lors du clic sur le bouton ouvrant la liste des services (ecran >= md).

#### Retour

```ts
detail: {
  show: boolean
}
```

### `toggle-favorite-dropdown`

Évènement levé lors du clic sur le bouton ouvrant la liste des services (ecran < md).

#### Retour

```ts
detail: {
  show: boolean
}
```

### `launch`

Évènement levé lors du clic sur un bouton du tiroir de navigation (hors services et favoris).

#### Retour

```ts
detail: {
}
```
