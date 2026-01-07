# r-widgets-wrapper

- [r-widgets-wrapper](#r-widgets-wrapper)
  - [Propriétés](#propriétés)

⚠️ Nécessite [widgets-adapter](../../widgets-adapter/) pour fonctionner.

## Propriétés

| Nom                  |   Type   | Obligatoire | Default | Description                                                                                                                 |
| -------------------- | :------: | :---------: | :-----: | --------------------------------------------------------------------------------------------------------------------------- |
| `adapter-source-uri` | `string` |   `false`   |   ``    | URL/path de [l'adapter](../../widgets-adapter/)                                                                             |
| `adapter-config-uri` | `string` |   `false`   |   ``    | URL/path de la configuration de l'adapter ([exemple de configuration](./public/widgets-adapter/adapter-configuration.json)) |
| `localization-uri`   | `string` |   `false`   |   ``    | URL/path du fichiers de traductions ([exemple de traductions](./public/widgets-wrapper/i18n.json))                          |
| `widget-max-count`   | `number` |   `false`   |   `3`   | Nombre maximum de widgets affichable                                                                                        |
| `soffit-uri`         | `string` |   `false`   |   ``    | URL/path de l'API informations utilisateur du portail                                                                       |
| `get-prefs-uri`      | `string` |   `false`   |   ``    | URL/path de lecture de l'API préférences d'une portlet du portail                                                           |
| `put-prefs-uri`      | `string` |   `false`   |   ``    | URL/path d'écriture de l'API préférences d'une portlet du portail                                                           |
