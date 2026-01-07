# r-services-layout

- [r-services-layout](#r-services-layout)
  - [Propriétés](#propriétés)
  - [Évènements](#évènements)
    - [`close`](#close)
      - [Retour](#retour)
    - [`open-more`](#open-more)

## Propriétés

| Nom                         |  Type   | Obligatoire | Default | Description                          |
| --------------------------- | :-----: | :---------: | :-----: | ------------------------------------ |
| `show`                      | `false` |   `false`   | `false` | Affiche l'overlay                    |
| `navigation-drawer-visible` | `false` |   `false`   | `false` | Le tiroir de navigation est visible |

## Évènements

### `close`

Évènement emis lors de la fermeture de la liste des services.

#### Retour

```ts
detail: {
  show: boolean
}
```

### `open-more`

Transmission de l'évènement du [r-service](r-service.md).
