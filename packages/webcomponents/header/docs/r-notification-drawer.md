# r-notification-drawer

- [r-notification-drawer](#r-notification-drawer)
  - [Propriétés](#propriétés)
  - [Évènements](#évènements)
    - [`close`](#close)
      - [Retour](#retour)
    - [`notification-event`](#notification-event)
      - [Retour](#retour-1)

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

### `notification-event`

Évènement levé dans le document lors du clic sur le lien d'une notification.

#### Retour

```ts
detail: {
  event: Event
  fname: string
}
```
