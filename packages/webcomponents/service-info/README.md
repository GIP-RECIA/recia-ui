- [r-service-info-layout](#r-service-info-layout)
  - [Propriétés](#propriétés)
  - [Évènements](#évènements)
    - [`toggle-favorite`](#toggle-favorite)
      - [Retour](#retour)
    - [`close`](#close)
      - [Retour](#retour-1)
- [r-bottom-sheet-service-info](#r-bottom-sheet-service-info)
  - [Propriétés](#propriétés-1)

# r-service-info-layout

## Propriétés

| Nom              |                   Type                    | Obligatoire |   Default   | Description                                                            |
| ---------------- | :---------------------------------------: | :---------: | :---------: | ---------------------------------------------------------------------- |
| `icon-url`       |                 `string`                  |   `false`   | `undefined` | URL du SVG (le svg doit contenir un id. ex: `/spritemap.svg#capytale`) |
| `name`           |                 `string`                  |   `false`   |    `''`     | Nom du service                                                         |
| `origin`         |   [`Origin`](./src/types/OriginType.ts)   |   `false`   | `undefined` | Origine du service                                                     |
| `category`       | [`Category`](./src/types/CategoryType.ts) |   `false`   | `undefined` | Catégorie du service                                                   |
| `favorite`       |                 `boolean`                 |   `false`   |   `false`   | Le servie est en favoris                                               |
| `description`    |                 `string`                  |   `false`   |    `''`     | Description du service (HTML en string)                                |
| `video`          |                 `string`                  |   `false`   |    `''`     | URL de la vidéo de présentation (affichage en iframe)                  |
| `tutorials`      | [`Array<Link>`](./src/types/LinkType.ts)  |   `false`   |    `[]`     | Liste des tutoriels disponibles (le `name` est requis ici)             |
| `tutorials-link` |     [`Link`](./src/types/LinkType.ts)     |   `false`   | `undefined` | Lien du bouton `Voir tous les tutoriels`                               |
| `launch-link`    |     [`Link`](./src/types/LinkType.ts)     |   `false`   | `undefined` | Lien du bouton `Lancer le service`                                     |

## Évènements

### `toggle-favorite`

Évènement levé lors du clic sur le bouton de mise/retrait des favoris.

#### Retour

```ts
detail: {
  favorite: boolean
}
```

### `close`

Évènement levé sur le clic du bouton fermer.

#### Retour

Aucun

# r-bottom-sheet-service-info

## Propriétés

| Nom | Type  | Obligatoire | Default | Description |
| --- | :---: | :---------: | :-----: | ----------- |
| ``  |  ``   |     ``      |   ``    |             |
