# r-pronote-summary

- [r-pronote-summary](#r-pronote-summary)
  - [Propriétés](#propriétés)

## Propriétés

| Nom                  |   Type   | Obligatoire | Default | Description                                                                                                                 |
| -------------------- | :------: | :---------: | :-----: | --------------------------------------------------------------------------------------------------------------------------- |
| `url-pronote-api`    | `string` |   `true`    |   ``    | URL/path de l'API Pronote                                                                                                   |
| `url-redirect`       | `string` |   `true`    |   ``    | URL/path du service de restitution des informations Pronote                                                                 |
| `timeout`            | `number` |   `false`   | `30000` | Timeout de la requête à l'API Pronote                                                                                       |
| `max-elements`       | `number` |   `false`   |   `5`   | Nombre de skeletons à afficher lors du chargement du composant                                                              |
