- [r-footer](#r-footer)
  - [Propriétés](#propriétés)

# r-footer

## Propriétés

| Nom                |                   Type                   | Obligatoire |   Default   | Description                   |
| ------------------ | :--------------------------------------: | :---------: | :---------: | ----------------------------- |
| `domain`           |                 `string`                 |   `false`   | `undefined` | Domaine du portail            |
| `portal-path`      |                 `string`                 |   `false`   | `undefined` | Path du portail               |
| `template-api-url` |                 `string`                 |   `false`   | `undefined` | URL de l'API template         |
| `top-links`        | [`Array<Link>`](./src/types/LinkType.ts) |   `false`   | `undefined` | Liens de la partie supérieur  |
| `bottom-links`     | [`Array<Link>`](./src/types/LinkType.ts) |   `false`   | `undefined` | Liens de la partie inférieure |
