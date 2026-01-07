# r-footer

- [r-footer](#r-footer)
  - [Propriétés](#propriétés)

## Propriétés

| Nom                 |                   Type                   | Obligatoire |          Default           | Description                                       |
| ------------------- | :--------------------------------------: | :---------: | :------------------------: | ------------------------------------------------- |
| `domain`            |                 `string`                 |   `false`   | `window.location.hostname` | Domaine du portail                                |
| `template-api-url`  |                 `string`                 |   `false`   |        `undefined`         | URL de l'API template                             |
| `template-api-path` |                 `string`                 |   `false`   |        `undefined`         | @deprecated rempli la variable `template-api-url` |
| `top-links`         | [`Array<Link>`](./src/types/LinkType.ts) |   `false`   |        `undefined`         | Liens de la partie supérieur                      |
| `bottom-links`      | [`Array<Link>`](./src/types/LinkType.ts) |   `false`   |        `undefined`         | Liens de la partie inférieure                     |
