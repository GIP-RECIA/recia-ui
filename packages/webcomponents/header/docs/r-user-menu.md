- [r-user-menu](#r-user-menu)
  - [Propriétés](#propriétés)
  - [Évènements](#évènements)
    - [`launch`](#launch)
      - [Retour](#retour)
    - [`user-menu-event`](#user-menu-event)
      - [Retour](#retour-1)

# r-user-menu

## Propriétés

| Nom            |                            Type                            | Obligatoire |   Default   | Description                         |
| -------------- | :--------------------------------------------------------: | :---------: | :---------: | ----------------------------------- |
| `picture`      |                          `string`                          |   `false`   | `undefined` | URL de la photo de profil           |
| `display-name` |                          `string`                          |   `false`   | `undefined` | Nom d'affichage de l'utilisateur    |
| `function`     |                          `string`                          |   `false`   | `undefined` | Fonction de l'utilisateur           |
| `config`       | [`Partial<UserMenuConfig>`](../src/types/userMenuTypes.ts) |   `false`   | `undefined` | Configurations des éléments du menu |
| `notification` |                          `number`                          |   `false`   | `undefined` | Nombre de notifications non lues    |
| `avatar-size`  |                          `string`                          |   `false`   | `undefined` | Taille de l'avatar                  |

## Évènements

### `launch`

Évènement levé lors du clic sur un bouton.

#### Retour

```ts
detail: {
  type: string
}
```

### `user-menu-event`

Évènement levé lors du clic sur un élement du menu.

#### Retour

```ts
detail: {
  event: Event
  elementId: string
}
```
