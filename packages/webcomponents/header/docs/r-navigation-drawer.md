# r-navigation-drawer

- [r-widget](#r-widget)
  - [Propriétés](#propriétés)
  - [Évènements](#évènements)
    - [`item-click`](#item-click)
      - [Retour](#retour)

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
