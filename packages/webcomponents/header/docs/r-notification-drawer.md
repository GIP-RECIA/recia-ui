# r-notification-drawer

- [r-notification-drawer](#r-notification-drawer)
  - [Propriétés](#propriétés)
  - [Évènements](#évènements)
    - [`close`](#close)
      - [Retour](#retour)

## Propriétés

| Nom        |   Type    | Obligatoire | Default | Description                       |
| ---------- | :-------: | :---------: | :-----: | --------------------------------- |
| `expanded` | `boolean` |   `false`   | `false` | Déplie le tiroir de notifications |

## Évènements

### `close`

Évènement levé lors de la fermeture du tiroir de notifications.

#### Retour

```ts
detail: {
  isExpanded: boolean
}
```
