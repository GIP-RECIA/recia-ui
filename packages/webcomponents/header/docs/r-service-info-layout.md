# r-service-info-layout

- [r-service-info-layout](#r-service-info-layout)
  - [Propriétés](#propriétés)
  - [Évènements](#évènements)
    - [`toggle-favorite`](#toggle-favorite)
      - [Retour](#retour)
    - [`close`](#close)
    - [`service-info-event`](#service-info-event)
      - [Retour](#retour-1)

## Propriétés

| Nom               |                     Type                     | Obligatoire |   Default   | Description                                        |
| ----------------- | :------------------------------------------: | :---------: | :---------: | -------------------------------------------------- |
| `fname`           |                   `string`                   |   `false`   | `undefined` | Fname du service                                   |
| `icon-url`        |                   `string`                   |   `false`   | `undefined` | URL de l'icone (SVG) du service                    |
| `name`            |                   `string`                   |   `false`   | `undefined` | Nom du service                                     |
| `origin`          | [`Origin`](../src/types/serviceInfoTypes.ts) |   `false`   | `undefined` |                                                    |
| `category`        | [`Category`](../src/types/categoryTypes.ts)  |   `false`   | `undefined` | Catégorie du service                               |
| `favorite-toggle` |                  `boolean`                   |   `false`   |   `false`   | Possibilité de mettre/retirer des favoris          |
| `favorite`        |                  `boolean`                   |   `false`   |   `false`   | Le service est en favoris                          |
| `description`     |                   `string`                   |   `false`   | `undefined` | Description du service (HTML)                      |
| `video`           |                   `string`                   |   `false`   | `undefined` | URL d'une vidéo de présentation                    |
| `ressources`      |    [`Link[]`](../src/types/linkTypes.ts)     |   `false`   | `undefined` | Listes des ressources disponnibles                 |
| `ressources-link` |     [`Link`](../src/types/linkTypes.ts)      |   `false`   | `undefined` | Lien vers un service listant toutes les ressources |
| `launch-link`     |     [`Link`](../src/types/linkTypes.ts)      |   `false`   | `undefined` | Lien du service                                    |
| `loading`         |                  `boolean`                   |   `false`   |   `false`   | Affiche l'overlay de chargement                    |
| `error`           |                  `boolean`                   |   `false`   |   `false`   | Affiche l'overlay d'erreur                         |

## Évènements

### `toggle-favorite`

Évènement émis lors du clic sur le bouton de mise/retrait des favoris.

#### Retour

```ts
detail: {
  favorite: boolean
}
```

### `close`

Évènement émis lors du clic sur le fouton fermer.

### `service-info-event`

Évènement émis lors du clic sur le lien du service.

#### Retour

```ts
detail: {
  event: Event
  fname: string
}
```
