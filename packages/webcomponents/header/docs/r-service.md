- [r-service](#r-service)
  - [Propriétés](#propriétés)
  - [Évènements](#évènements)
    - [`open-more`](#open-more)
      - [Retour](#retour)
    - [`service-event`](#service-event)
      - [Retour](#retour-1)

# r-service

## Propriétés

| Nom        |                      Type                      | Obligatoire |   Default   | Description                                           |
| ---------- | :--------------------------------------------: | :---------: | :---------: | ----------------------------------------------------- |
| `id`       |                    `number`                    |   `false`   | `undefined` | ID du service                                         |
| `fname`    |                    `string`                    |   `false`   | `undefined` | Fname du service                                      |
| `name`     |                    `string`                    |   `false`   | `undefined` | Nom d'affichage du service                            |
| `category` | [`Category`](../src/types/categoryTypes.ts.ts) |   `false`   | `undefined` | Catégorie du service                                  |
| `icon-url` |                    `string`                    |   `false`   | `undefined` | URL de l'icone (SVG) du service                       |
| `link`     |      [`Link`](../src/types/linkTypes.ts)       |   `false`   | `undefined` | URL du service                                        |
| `new`      |                   `boolean`                    |   `false`   |   `false`   | Le service est nouveau                                |
| `favorite` |                   `boolean`                    |   `false`   |   `false`   | Le service est favori                                 |
| `more`     |                   `boolean`                    |   `false`   |   `false`   | Le service as une fiche d'informations complémentaire |

## Évènements

### `open-more`

Évènement levé lors du clic sur le en savoir plus. L'événement est également levé au niveau du document.

#### Retour

```ts
detail: {
  fname: string
}
```

### `service-event`

Évènement levé dans le document lors du clic sur le lien du service.

#### Retour

```ts
detail: {
  event: Event
  fname: string
}
```
